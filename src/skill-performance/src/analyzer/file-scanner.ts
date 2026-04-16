/**
 * File Scanner — skill-performance v5.2
 * Recursively scans project for TypeScript/JavaScript files
 */

import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_EXCLUDES = [
  'node_modules',
  'dist',
  'build',
  '.git',
  '.skill-memory',
  'coverage',
  '.next',
  'out',
];

const INCLUDE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];

/**
 * Recursively find all TypeScript/JavaScript files
 */
export function scanFiles(
  rootDir: string,
  excludePatterns: string[] = DEFAULT_EXCLUDES,
): string[] {
  const files: string[] = [];

  function walk(dir: string): void {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        // Check if directory should be excluded
        if (entry.isDirectory()) {
          const shouldExclude = excludePatterns.some((pattern) =>
            dir.includes(pattern) || entry.name === pattern,
          );

          if (!shouldExclude) {
            walk(path.join(dir, entry.name));
          }
          continue;
        }

        // Check if file has valid extension
        if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (INCLUDE_EXTENSIONS.includes(ext)) {
            files.push(path.join(dir, entry.name));
          }
        }
      }
    } catch (error) {
      // Silently skip inaccessible directories (permission denied, etc.)
      // Prevents crashes on symlinks or restricted directories
    }
  }

  walk(rootDir);
  return files;
}

/**
 * Read file contents safely
 */
export function readFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    // If file can't be read, return empty string
    // This prevents crashes on binary files, encoding issues, etc.
    return '';
  }
}

/**
 * Get line and column from file at a character position
 */
export function getLineAndColumn(
  fileContent: string,
  characterPosition: number,
): { line: number; column: number } {
  let line = 1;
  let column = 1;

  for (let i = 0; i < characterPosition && i < fileContent.length; i++) {
    if (fileContent[i] === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }
  }

  return { line, column };
}

/**
 * Get context (surrounding code) for an issue
 */
export function getCodeContext(
  fileContent: string,
  startLine: number,
  endLine: number = startLine,
): string {
  const lines = fileContent.split('\n');
  const contextStart = Math.max(0, startLine - 2);
  const contextEnd = Math.min(lines.length, endLine + 2);

  return lines
    .slice(contextStart, contextEnd)
    .map((line, index) => {
      const lineNum = contextStart + index + 1;
      const prefix = lineNum === startLine ? '> ' : '  ';
      return `${prefix}${lineNum}: ${line}`;
    })
    .join('\n');
}
