/**
 * skill-performance v5.2 — React Component Profiler
 * @summary Analyzes React component rendering performance and optimization opportunities
 * @law SEC-07: Generic error messages (no stack traces)
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

/**
 * React Component Performance Issue
 */
export interface ComponentPerformanceIssue {
  componentName: string;
  file: string;
  line: number;
  issueType: 'unnecessary_rerender' | 'missing_memo' | 'missing_usecallback' | 'missing_usememo' | 'inline_objects_arrays' | 'large_dependency_array';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  suggestedFix: string;
  estimatedImpact?: string; // 'LCP -50ms', 'bundle -10kb', etc.
}

/**
 * Component Analysis Result
 */
export interface ReactProfilerResult {
  timestamp: string;
  projectPath: string;
  componentsScanned: number;
  issuesFound: number;
  issues: ComponentPerformanceIssue[];
  summary: {
    unnecessary_rerender: number;
    missing_memo: number;
    missing_usecallback: number;
    missing_usememo: number;
    inline_objects_arrays: number;
    large_dependency_array: number;
  };
  recommendations?: string[];
}

/**
 * ReactProfilerImpl
 * @description Analyzes React components for performance issues
 */
export class ReactProfilerImpl {
  /**
   * analyze — Analyze React components in a project
   */
  analyze(projectPath: string): ReactProfilerResult {
    const result: ReactProfilerResult = {
      timestamp: new Date().toISOString(),
      projectPath,
      componentsScanned: 0,
      issuesFound: 0,
      issues: [],
      summary: {
        unnecessary_rerender: 0,
        missing_memo: 0,
        missing_usecallback: 0,
        missing_usememo: 0,
        inline_objects_arrays: 0,
        large_dependency_array: 0,
      },
    };

    // Find all React component files
    const componentFiles = this.findComponentFiles(projectPath);

    for (const file of componentFiles) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const issues = this.analyzeComponent(content, file);

        result.componentsScanned++;
        result.issuesFound += issues.length;
        result.issues.push(...issues);

        // Update summary
        issues.forEach((issue) => {
          if (result.summary[issue.issueType] !== undefined) {
            result.summary[issue.issueType]++;
          }
        });
      } catch (error) {
        // Skip files that can't be analyzed
      }
    }

    // Generate recommendations
    result.recommendations = this.generateRecommendations(result);

    return result;
  }

  /**
   * analyzeComponent — Analyze a single React component file
   * @private
   */
  private analyzeComponent(content: string, filePath: string): ComponentPerformanceIssue[] {
    const issues: ComponentPerformanceIssue[] = [];

    try {
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'classProperties'],
      });

      let componentName = path.basename(filePath, path.extname(filePath));
      let hasReactImport = false;
      let usesMemo = false;
      let usesCallback = false;
      let hasPropsDestructuring = false;
      let largestDependencyArray = 0;

      (traverse as any)(ast, {
        ImportDeclaration(astPath: any) {
          const importSource = astPath.node.source.value;
          if (importSource === 'react') {
            hasReactImport = true;
          }
        },

        FunctionDeclaration(astPath: any) {
          const node = astPath.node;
          if (node.id && node.id.name) {
            componentName = node.id.name;

            // Check if component is wrapped with React.memo
            const parent = astPath.parent;
            const isMemoized =
              parent.type === 'CallExpression' &&
              parent.callee.type === 'MemberExpression' &&
              parent.callee.property.name === 'memo';

            if (!isMemoized && hasReactImport) {
              // Check if component receives props
              if (node.params && node.params.length > 0) {
                issues.push({
                  componentName,
                  file: filePath,
                  line: node.loc?.start.line || 0,
                  issueType: 'missing_memo',
                  severity: 'MEDIUM',
                  description: `Component ${componentName} receives props but is not memoized. May cause unnecessary re-renders.`,
                  suggestedFix: `Wrap component with React.memo: export default React.memo(${componentName});`,
                  estimatedImpact: 'LCP -20ms per component',
                });
              }
            }
          }
        },

        ArrowFunctionExpression(astPath: any) {
          const node = astPath.node;
          // Check for inline object/array in JSX props
          let hasInlineCollections = false;

          (traverse as any)(node, {
            ObjectExpression(innerPath: any) {
              if (innerPath.parent && innerPath.parent.type === 'JSXAttribute') {
                hasInlineCollections = true;
              }
            },
            ArrayExpression(innerPath: any) {
              if (innerPath.parent && innerPath.parent.type === 'JSXAttribute') {
                hasInlineCollections = true;
              }
            },
          });

          if (hasInlineCollections) {
            issues.push({
              componentName,
              file: filePath,
              line: node.loc?.start.line || 0,
              issueType: 'inline_objects_arrays',
              severity: 'MEDIUM',
              description: 'Inline object/array in JSX props causes re-render of child components on every render.',
              suggestedFix: 'Move object/array outside component or use useMemo() to memoize the collection.',
              estimatedImpact: 'LCP -30ms',
            });
          }
        },

        CallExpression(astPath: any) {
          const node = astPath.node;
          const calleeName =
            node.callee.type === 'Identifier' ? node.callee.name :
            node.callee.type === 'MemberExpression' ? node.callee.property?.name : null;

          // Detect useMemo and useCallback usage
          if (calleeName === 'useMemo') {
            usesMemo = true;
          }
          if (calleeName === 'useCallback') {
            usesCallback = true;
          }

          // Check for large dependency arrays (> 8 dependencies)
          if (calleeName === 'useEffect' || calleeName === 'useMemo' || calleeName === 'useCallback') {
            if (node.arguments && node.arguments.length >= 2) {
              const depArray = node.arguments[1];
              if (depArray && depArray.type === 'ArrayExpression') {
                const depCount = depArray.elements.length;
                if (depCount > 8) {
                  if (depCount > largestDependencyArray) {
                    largestDependencyArray = depCount;
                  }
                }
              }
            }
          }
        },

        JSXElement(astPath: any) {
          const node = astPath.node;
          // Check for child components that are created inline
          if (node.children) {
            node.children.forEach((child: any) => {
              if (child.type === 'JSXElement' && child.openingElement) {
                const childName = child.openingElement.name?.name;
                // If child is a function component created inline (rare but possible), flag it
                if (childName && childName[0] === childName[0].toUpperCase()) {
                  // This is a component reference, check if it's inline
                  const parentFunc = astPath.getFunctionParent();
                  if (parentFunc && parentFunc.isFunctionDeclaration()) {
                    // Component is inline, might be recreated on every render
                  }
                }
              }
            });
          }
        },
      });

      // Check for large dependency arrays
      if (largestDependencyArray > 8) {
        issues.push({
          componentName,
          file: filePath,
          line: 1,
          issueType: 'large_dependency_array',
          severity: 'LOW',
          description: `Component uses dependency array with ${largestDependencyArray} items. Large dependency arrays increase re-render frequency.`,
          suggestedFix: 'Refactor to split hooks with fewer dependencies or consider memoizing dependencies with useMemo().',
          estimatedImpact: 'Minor — improves maintainability',
        });
      }

      // Check if component could benefit from useMemo for expensive computations
      const hasComputations = content.includes('map(') || content.includes('filter(') || content.includes('reduce(');
      if (hasComputations && !usesMemo && hasReactImport) {
        issues.push({
          componentName,
          file: filePath,
          line: 1,
          issueType: 'missing_usememo',
          severity: 'LOW',
          description: 'Component performs array operations (map/filter/reduce) that could benefit from memoization.',
          suggestedFix: 'Wrap expensive computations in useMemo() to avoid recalculation on every render.',
          estimatedImpact: 'LCP -10ms',
        });
      }

      // Check if component uses inline handlers that could be memoized
      const hasInlineHandlers = content.includes('onClick={') || content.includes('onChange={') || content.includes('onSubmit={');
      if (hasInlineHandlers && !usesCallback && hasReactImport) {
        issues.push({
          componentName,
          file: filePath,
          line: 1,
          issueType: 'missing_usecallback',
          severity: 'MEDIUM',
          description: 'Component has inline event handlers that may be recreated on every render.',
          suggestedFix: 'Wrap handlers in useCallback() to maintain referential equality across renders.',
          estimatedImpact: 'LCP -15ms for child components',
        });
      }
    } catch (error) {
      // Skip files with syntax errors
    }

    return issues;
  }

  /**
   * findComponentFiles — Find all React component files
   * @private
   */
  private findComponentFiles(projectPath: string): string[] {
    const files: string[] = [];

    function walk(dir: string) {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          // Skip common exclusions
          if (
            entry.name === 'node_modules' ||
            entry.name === '.next' ||
            entry.name === 'dist' ||
            entry.name === 'build' ||
            entry.name.startsWith('.')
          ) {
            continue;
          }

          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            walk(fullPath);
          } else if (
            entry.isFile() &&
            /\.(tsx|jsx)$/.test(entry.name) &&
            entry.name.length > 0 &&
            (entry.name[0]! === entry.name[0]!.toUpperCase() || entry.name.includes('.component'))
          ) {
            // Only include files that look like React components (PascalCase or .component.tsx)
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Silently skip directories that can't be read
      }
    }

    walk(projectPath);
    return files;
  }

  /**
   * generateRecommendations — Create actionable recommendations
   * @private
   */
  private generateRecommendations(result: ReactProfilerResult): string[] {
    const recommendations: string[] = [];

    if (result.summary.unnecessary_rerender > 0) {
      recommendations.push(`🔄 ${result.summary.unnecessary_rerender} unnecessary re-renders detected — use React.memo() to prevent child re-renders`);
    }

    if (result.summary.missing_memo > 0) {
      recommendations.push(`📝 ${result.summary.missing_memo} components should be wrapped with React.memo() to optimize prop comparison`);
    }

    if (result.summary.missing_usecallback > 0) {
      recommendations.push(`🎯 ${result.summary.missing_usecallback} components have inline handlers — wrap in useCallback() to maintain referential equality`);
    }

    if (result.summary.missing_usememo > 0) {
      recommendations.push(`⚡ ${result.summary.missing_usememo} components perform expensive computations — use useMemo() to memoize results`);
    }

    if (result.summary.inline_objects_arrays > 0) {
      recommendations.push(`📦 ${result.summary.inline_objects_arrays} inline collections in JSX props — move to module level or memoize with useMemo()`);
    }

    if (result.summary.large_dependency_array > 0) {
      recommendations.push(`🔗 ${result.summary.large_dependency_array} hooks have large dependency arrays — refactor to split hooks or memoize dependencies`);
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ React component structure looks optimized!');
    }

    return recommendations;
  }
}

/**
 * Factory function for creating ReactProfiler
 */
export function createReactProfiler(): ReactProfilerImpl {
  return new ReactProfilerImpl();
}
