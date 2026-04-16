/**
 * skill-performance v5.2 — Dead Code Detector via AST
 * @summary Detects unused exports, variables, and imports using Babel AST
 * @law SEC-07: Generic error messages (no stack traces)
 */

import { Issue } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from '@babel/parser';
// @ts-ignore - Babel traverse default export
import traverse from '@babel/traverse';

/**
 * Dead Code Issue
 */
export interface DeadCodeIssue extends Issue {
  declarationType?: 'variable' | 'function' | 'import' | 'export';
  unusedName?: string;
}

/**
 * DeadCodeAnalyzerImpl
 * @description Detects unused code via AST analysis
 *              Finds unused exports, imports, variables, and functions
 */
export class DeadCodeAnalyzerImpl {
  /**
   * analyze — Main entry point for dead code analysis
   */
  analyze(filePath: string): DeadCodeIssue[] {
    const issues: DeadCodeIssue[] = [];

    try {
      // Validate path (SEC-02)
      if (!filePath || filePath.includes('..') || filePath.includes('//')) {
        return issues;
      }

      if (!fs.existsSync(filePath)) {
        return issues;
      }

      const content = fs.readFileSync(filePath, 'utf-8');

      // Skip empty files
      if (!content.trim()) {
        return issues;
      }

      // Parse AST
      let ast;
      try {
        ast = parse(content, {
          sourceType: 'module',
          plugins: ['typescript', 'jsx'],
        });
      } catch (error) {
        // If parsing fails, return empty (SEC-07: generic error)
        return issues;
      }

      // Detect unused exports
      issues.push(...this.detectUnusedExports(ast, filePath, content));

      // Detect unused imports
      issues.push(...this.detectUnusedImports(ast, filePath, content));

      // Detect unused variables
      issues.push(...this.detectUnusedVariables(ast, filePath, content));

      return issues;
    } catch (error) {
      // SEC-07: Generic error messages
      return issues;
    }
  }

  /**
   * detectUnusedExports — Find exported items that are never used
   * @private
   */
  private detectUnusedExports(ast: any, filePath: string, content: string): DeadCodeIssue[] {
    const issues: DeadCodeIssue[] = [];
    const exportedNames = new Map<string, number>();
    const usedNames = new Set<string>();

    // First pass: collect exports
    (traverse as any)(ast, {
      ExportNamedDeclaration: (path: any) => {
        if (path.node.declaration) {
          if (path.node.declaration.id) {
            // export function/const/var
            const name = path.node.declaration.id.name;
            const lineNumber = path.node.loc?.start.line || 1;
            exportedNames.set(name, lineNumber);
          } else if (path.node.declaration.declarations) {
            // export const x = ..., y = ...
            path.node.declaration.declarations.forEach((decl: any) => {
              if (decl.id?.name) {
                const lineNumber = path.node.loc?.start.line || 1;
                exportedNames.set(decl.id.name, lineNumber);
              }
            });
          }
        } else if (path.node.specifiers) {
          // export { x, y }
          path.node.specifiers.forEach((spec: any) => {
            const name = spec.exported?.name || spec.local?.name;
            if (name) {
              const lineNumber = path.node.loc?.start.line || 1;
              exportedNames.set(name, lineNumber);
            }
          });
        }
      },
    });

    // Second pass: track usage within the file
    (traverse as any)(ast, {
      Identifier: (path: any) => {
        // Don't count declarations as usage
        if (path.isDeclaration() || path.isImportSpecifier()) {
          return;
        }

        // Count references to identifiers
        if (exportedNames.has(path.node.name)) {
          usedNames.add(path.node.name);
        }
      },
    });

    // Report unused exports
    exportedNames.forEach((lineNumber, exportName) => {
      // Skip default exports and special names
      if (exportName === 'default' || exportName.startsWith('_')) {
        return;
      }

      if (!usedNames.has(exportName)) {
        issues.push({
          file: filePath,
          line: lineNumber,
          column: 1,
          severity: 'LOW',
          type: 'unused_dependency',
          message: `Exported "${exportName}" is never used within this file`,
          recommendation: 'Remove unused export or delete if not needed by consumers',
          declarationType: 'export',
          unusedName: exportName,
        });
      }
    });

    return issues;
  }

  /**
   * detectUnusedImports — Find imports that are never used
   * @private
   */
  private detectUnusedImports(ast: any, filePath: string, content: string): DeadCodeIssue[] {
    const issues: DeadCodeIssue[] = [];
    const importedNames = new Map<string, number>();
    const usedNames = new Set<string>();

    // First pass: collect imports
    (traverse as any)(ast, {
      ImportDeclaration: (path: any) => {
        path.node.specifiers.forEach((spec: any) => {
          const importName = spec.local?.name;
          if (importName && importName !== 'React') {
            // Skip React (commonly imported but not directly referenced)
            const lineNumber = path.node.loc?.start.line || 1;
            importedNames.set(importName, lineNumber);
          }
        });
      },
    });

    // Second pass: track usage
    (traverse as any)(ast, {
      Identifier: (path: any) => {
        // Skip if this is an import declaration
        if (path.isImportSpecifier() || path.isImportDefaultSpecifier()) {
          return;
        }

        // Track usage
        if (importedNames.has(path.node.name)) {
          usedNames.add(path.node.name);
        }
      },
    });

    // Report unused imports
    importedNames.forEach((lineNumber, importName) => {
      if (!usedNames.has(importName)) {
        issues.push({
          file: filePath,
          line: lineNumber,
          column: 1,
          severity: 'LOW',
          type: 'unused_dependency',
          message: `Import "${importName}" is never used`,
          recommendation: 'Remove unused import to reduce bundle size',
          declarationType: 'import',
          unusedName: importName,
        });
      }
    });

    return issues;
  }

  /**
   * detectUnusedVariables — Find variables declared but never referenced
   * @private
   */
  private detectUnusedVariables(ast: any, filePath: string, content: string): DeadCodeIssue[] {
    const issues: DeadCodeIssue[] = [];
    const declaredVars = new Map<string, number>();
    const usedVars = new Set<string>();

    // First pass: collect variable declarations
    (traverse as any)(ast, {
      VariableDeclarator: (path: any) => {
        const varName = path.node.id?.name;
        if (varName && !varName.startsWith('_')) {
          const lineNumber = path.node.loc?.start.line || 1;

          // Skip common patterns
          if (!['props', 'state', 'error', 'data', 'result', 'value'].includes(varName)) {
            declaredVars.set(varName, lineNumber);
          }
        }
      },
    });

    // Second pass: track usage
    (traverse as any)(ast, {
      Identifier: (path: any) => {
        // Skip if it's the declaration itself
        if (path.listKey === 'params' || path.parentPath?.isVariableDeclarator()) {
          return;
        }

        if (declaredVars.has(path.node.name)) {
          usedVars.add(path.node.name);
        }
      },
    });

    // Report unused variables (only if significantly unused in scope)
    // This is conservative to avoid false positives
    declaredVars.forEach((lineNumber, varName) => {
      if (!usedVars.has(varName) && varName.length > 2) {
        // Only report longer names to avoid noise on single-letter vars
        issues.push({
          file: filePath,
          line: lineNumber,
          column: 1,
          severity: 'LOW',
          type: 'unused_dependency',
          message: `Variable "${varName}" is declared but never used`,
          recommendation: 'Remove unused variable or prefix with _ if intentionally unused',
          declarationType: 'variable',
          unusedName: varName,
        });
      }
    });

    return issues;
  }
}

/**
 * Factory function for creating DeadCodeAnalyzer
 */
export function createDeadCodeAnalyzer(): DeadCodeAnalyzerImpl {
  return new DeadCodeAnalyzerImpl();
}
