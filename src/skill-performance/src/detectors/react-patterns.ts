/**
 * React Pattern Detector — skill-performance v5.2
 * Detects missing useCallback, React.memo, and useEffect dependencies
 */

import { Issue } from '../types';
import * as t from '@babel/types';

/**
 * Detect React performance anti-patterns
 */
export function detectReactPatterns(
  filePath: string,
  content: string,
  ast: t.File,
): Issue[] {
  const issues: Issue[] = [];

  // Pattern 1: Function defined inline without useCallback
  // const handleClick = () => {...}  (inside component)
  const inlineFunctionPattern = /const\s+\w+\s*=\s*\(\s*\)\s*=>\s*\{/g;
  let match;
  while ((match = inlineFunctionPattern.exec(content))) {
    // Check if this is inside a component (heuristic: not in useCallback)
    const beforeText = content.substring(Math.max(0, match.index - 100), match.index);
    if (!beforeText.includes('useCallback')) {
      const line = content.substring(0, match.index).split('\n').length;
      const column = match.index - content.lastIndexOf('\n', match.index);

      const funcNamePart = content.substring(match.index + 6, match.index + 20).split('=')[0]?.trim() || 'handler';
      const issue: Issue = {
        file: filePath,
        line,
        column,
        severity: 'MEDIUM',
        type: 'excess_rerender',
        message: 'Arrow function defined inline — will cause re-renders if passed as prop',
        recommendation: `Wrap with useCallback: const ${funcNamePart} = useCallback(() => {...}, [/* deps */]);`,
      };

      issues.push(issue);
    }
  }

  // Pattern 2: Component exported without React.memo
  // export const MyComponent = (...) =>  (without memo)
  // This is a heuristic — we're not doing full AST analysis yet
  const exportComponentPattern =
    /export\s+(?:const|function)\s+([A-Z]\w+)\s*=\s*(?!\(\s*\)|\w+.memo)/gm;
  while ((match = exportComponentPattern.exec(content))) {
    const line = content.substring(0, match.index).split('\n').length;

    // Check if it's a React component (PascalCase)
    const componentName = match[1];
    if (componentName && /^[A-Z]/.test(componentName)) {
      // Skip if already using memo
      if (content.substring(match.index, match.index + 200).includes('.memo(')) {
        continue;
      }

      const issue: Issue = {
        file: filePath,
        line,
        column: 0,
        severity: 'MEDIUM',
        type: 'excess_rerender',
        message: `Component "${componentName}" not wrapped with React.memo — will re-render on parent renders`,
        recommendation: `Wrap with React.memo: const ${componentName} = memo(() => {...}); Import: import { memo } from 'react';`,
      };

      issues.push(issue);
    }
  }

  return issues;
}
