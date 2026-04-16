/**
 * Unit tests for CLI Parser
 */

import { parseArgs, validateProjectPath } from '../src/cli';

describe('CLI Parser', () => {
  it('should parse --analyze-architecture flag', () => {
    const argv = ['node', 'cli.ts', '/path/to/project', '--analyze-architecture'];
    const options = parseArgs(argv);

    expect(options.analyzeArchitecture).toBe(true);
    expect(options.projectPath).toBe('/path/to/project');
  });

  it('should parse --lighthouse flag', () => {
    const argv = ['node', 'cli.ts', '/path/to/project', '--lighthouse'];
    const options = parseArgs(argv);

    expect(options.lighthouse).toBe(true);
    expect(options.projectPath).toBe('/path/to/project');
  });

  it('should parse --database flag', () => {
    const argv = ['node', 'cli.ts', '/path/to/project', '--database'];
    const options = parseArgs(argv);

    expect(options.database).toBe(true);
    expect(options.projectPath).toBe('/path/to/project');
  });

  it('should parse --bundle flag', () => {
    const argv = ['node', 'cli.ts', '/path/to/project', '--bundle'];
    const options = parseArgs(argv);

    expect(options.bundle).toBe(true);
    expect(options.projectPath).toBe('/path/to/project');
  });

  it('should parse --dead-code flag', () => {
    const argv = ['node', 'cli.ts', '/path/to/project', '--dead-code'];
    const options = parseArgs(argv);

    expect(options['dead-code']).toBe(true);
    expect(options.projectPath).toBe('/path/to/project');
  });

  it('should parse --monitor flag', () => {
    const argv = ['node', 'cli.ts', '/path/to/project', '--monitor'];
    const options = parseArgs(argv);

    expect(options.monitor).toBe(true);
  });

  it('should parse --verbose flag', () => {
    const argv = ['node', 'cli.ts', '/path/to/project', '--verbose'];
    const options = parseArgs(argv);

    expect(options.verbose).toBe(true);
  });

  it('should handle multiple flags', () => {
    const argv = ['node', 'cli.ts', '/path/to/project', '--analyze-architecture', '--verbose'];
    const options = parseArgs(argv);

    expect(options.analyzeArchitecture).toBe(true);
    expect(options.verbose).toBe(true);
  });
});

describe('Path Validation (SEC-02)', () => {
  it('should reject directory traversal attempts', () => {
    expect(() => {
      validateProjectPath('../../../etc/passwd');
    }).toThrow('directory traversal not allowed');
  });

  it('should reject paths with double slashes', () => {
    expect(() => {
      validateProjectPath('/path//to//project');
    }).toThrow('Invalid project path');
  });

  it('should accept valid paths', () => {
    const path = validateProjectPath('/valid/path/to/project');
    expect(path).toBeTruthy();
    expect(path).not.toContain('..');
    expect(path).not.toContain('//');
  });

  it('should reject undefined paths', () => {
    expect(() => {
      validateProjectPath(undefined);
    }).toThrow('Project path required');
  });
});
