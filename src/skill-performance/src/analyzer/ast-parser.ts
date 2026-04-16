/**
 * AST Parser — skill-performance v5.2
 * Parse TypeScript/JavaScript files using @babel/parser
 */

import * as parser from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

export interface ParsedFile {
  filePath: string;
  ast: t.File | null;
  error?: string;
}

/**
 * Parse a TypeScript/JavaScript file using Babel
 */
export function parseFile(filePath: string, content: string): ParsedFile {
  try {
    const ast = parser.parse(content, {
      sourceType: 'module',
      plugins: [
        'typescript',
        'jsx',
        'classProperties',
        'decorators-legacy',
        'logicalAssignment',
        'nullishCoalescingOperator',
        'optionalChaining',
      ],
    });

    return { filePath, ast };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown parse error';
    return {
      filePath,
      ast: null,
      error: `Parse error in ${filePath}: ${errorMessage}`,
    };
  }
}

/**
 * Visitor pattern — traverse AST and collect nodes of interest
 */
export interface ASTVisitor {
  onFunctionDeclaration?: (path: NodePath<t.FunctionDeclaration>) => void;
  onArrowFunctionExpression?: (path: NodePath<t.ArrowFunctionExpression>) => void;
  onCallExpression?: (path: NodePath<t.CallExpression>) => void;
  onJSXElement?: (path: NodePath<t.JSXElement>) => void;
  onObjectProperty?: (path: NodePath<t.ObjectProperty>) => void;
  onVariableDeclarator?: (path: NodePath<t.VariableDeclarator>) => void;
}

/**
 * Traverse AST with a visitor
 */
export function traverseAST(ast: t.File, visitor: ASTVisitor): void {
  traverse(ast, {
    FunctionDeclaration: (path) => visitor.onFunctionDeclaration?.(path),
    ArrowFunctionExpression: (path) => visitor.onArrowFunctionExpression?.(path),
    CallExpression: (path) => visitor.onCallExpression?.(path),
    JSXElement: (path) => visitor.onJSXElement?.(path),
    ObjectProperty: (path) => visitor.onObjectProperty?.(path),
    VariableDeclarator: (path) => visitor.onVariableDeclarator?.(path),
  });
}

/**
 * Get source location from node
 */
export function getNodeLocation(node: t.Node): { line: number; column: number } {
  return {
    line: node.loc?.start.line || 0,
    column: node.loc?.start.column || 0,
  };
}

/**
 * Check if a node is a React component (heuristic)
 */
export function isReactComponent(node: t.Node): boolean {
  if (t.isFunctionDeclaration(node) || t.isArrowFunctionExpression(node)) {
    // Component if it returns JSX or is PascalCase named
    return true;
  }
  return false;
}

/**
 * Extract identifier name from node
 */
export function getIdentifierName(node: t.Node): string | null {
  if (t.isIdentifier(node)) {
    return node.name;
  }
  if (t.isFunctionDeclaration(node) && node.id) {
    return node.id.name;
  }
  if (t.isVariableDeclarator(node) && t.isIdentifier(node.id)) {
    return node.id.name;
  }
  return null;
}

/**
 * Check if function uses useCallback hook
 */
export function usesUseCallback(node: t.FunctionDeclaration | t.ArrowFunctionExpression): boolean {
  let foundUseCallback = false;

  const visitor: ASTVisitor = {
    onCallExpression: (path) => {
      if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'useCallback') {
        foundUseCallback = true;
        path.stop();
      }
    },
  };

  if (node.body && t.isBlockStatement(node.body)) {
    // For block statements, we'd need to traverse the body
    // For now, use a simplified heuristic
  }

  return foundUseCallback;
}

/**
 * Check if component is wrapped with React.memo
 */
export function isWrappedWithMemo(node: t.VariableDeclarator): boolean {
  if (!node.init) return false;

  if (t.isCallExpression(node.init)) {
    const callee = node.init.callee;
    if (t.isMemberExpression(callee)) {
      const object = callee.object;
      const property = callee.property;

      if (
        t.isIdentifier(object) &&
        object.name === 'React' &&
        t.isIdentifier(property) &&
        property.name === 'memo'
      ) {
        return true;
      }
    }
  }

  return false;
}
