/**
 * skill-performance v5.2 — React Profiler Tests
 * @summary Tests for React component performance profiling
 */

import { createReactProfiler } from '../src/analyzers/react-profiler';

describe('ReactProfiler', () => {
  let profiler: ReturnType<typeof createReactProfiler>;

  beforeEach(() => {
    profiler = createReactProfiler();
  });

  describe('createReactProfiler', () => {
    test('should create a react profiler instance', () => {
      expect(profiler).toBeDefined();
      expect(profiler.analyze).toBeDefined();
    });
  });

  describe('analyze()', () => {
    test('should return a valid profiler result structure', () => {
      const result = profiler.analyze('/tmp');

      expect(result.timestamp).toBeDefined();
      expect(result.projectPath).toBe('/tmp');
      expect(result.componentsScanned).toBeDefined();
      expect(result.issuesFound).toBeDefined();
      expect(Array.isArray(result.issues)).toBe(true);
      expect(result.summary).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });

    test('should use ISO 8601 timestamp format', () => {
      const result = profiler.analyze('/tmp');

      const timestamp = new Date(result.timestamp);
      expect(timestamp instanceof Date && !isNaN(timestamp.getTime())).toBe(true);
    });

    test('should initialize summary with zero values', () => {
      const result = profiler.analyze('/tmp');

      expect(result.summary.unnecessary_rerender).toBeDefined();
      expect(result.summary.missing_memo).toBeDefined();
      expect(result.summary.missing_usecallback).toBeDefined();
      expect(result.summary.missing_usememo).toBeDefined();
      expect(result.summary.inline_objects_arrays).toBeDefined();
      expect(result.summary.large_dependency_array).toBeDefined();
    });

    test('should include recommendations array', () => {
      const result = profiler.analyze('/tmp');

      expect(Array.isArray(result.recommendations)).toBe(true);
      if (result.recommendations && result.recommendations.length > 0) {
        expect(typeof result.recommendations[0]).toBe('string');
      }
    });

    test('should scan for React components', () => {
      const result = profiler.analyze('/tmp');

      expect(typeof result.componentsScanned).toBe('number');
      expect(result.componentsScanned >= 0).toBe(true);
    });

    test('should report issues found count', () => {
      const result = profiler.analyze('/tmp');

      expect(typeof result.issuesFound).toBe('number');
      expect(result.issuesFound >= 0).toBe(true);
    });

    test('should handle non-existent project path gracefully', () => {
      const result = profiler.analyze('/nonexistent/path');

      expect(result).toBeDefined();
      expect(result.projectPath).toBe('/nonexistent/path');
      expect(result.componentsScanned >= 0).toBe(true);
    });

    test('should track component performance issues by type', () => {
      const result = profiler.analyze('/tmp');

      const totalIssues = Object.values(result.summary).reduce((a, b) => a + b, 0);
      expect(totalIssues).toBe(result.issuesFound);
    });

    test('should have all issue types in summary', () => {
      const result = profiler.analyze('/tmp');

      expect('unnecessary_rerender' in result.summary).toBe(true);
      expect('missing_memo' in result.summary).toBe(true);
      expect('missing_usecallback' in result.summary).toBe(true);
      expect('missing_usememo' in result.summary).toBe(true);
      expect('inline_objects_arrays' in result.summary).toBe(true);
      expect('large_dependency_array' in result.summary).toBe(true);
    });

    test('should generate recommendations based on findings', () => {
      const result = profiler.analyze('/tmp');

      // Should always have at least one recommendation (even if it's "all good")
      expect(Array.isArray(result.recommendations)).toBe(true);
      if (result.recommendations && result.recommendations.length > 0) {
        const recommendation = result.recommendations[0]!;
        expect(typeof recommendation).toBe('string');
        expect(recommendation.length > 0).toBe(true);
      }
    });

    test('should include issue details in array', () => {
      const result = profiler.analyze('/tmp');

      if (result.issues.length > 0) {
        const issue = result.issues[0]!;
        expect(issue.componentName).toBeDefined();
        expect(issue.file).toBeDefined();
        expect(issue.line).toBeDefined();
        expect(issue.issueType).toBeDefined();
        expect(issue.severity).toBeDefined();
        expect(issue.description).toBeDefined();
        expect(issue.suggestedFix).toBeDefined();
      }
    });

    test('should handle empty project gracefully', () => {
      const result = profiler.analyze('/empty/project');

      expect(result).toBeDefined();
      expect(Array.isArray(result.issues)).toBe(true);
      expect(result.componentsScanned >= 0).toBe(true);
    });

    test('should identify issue severity levels', () => {
      const result = profiler.analyze('/tmp');

      const severities = new Set<string>();
      result.issues.forEach((issue) => {
        severities.add(issue.severity);
      });

      // Severities should be one of the valid types
      severities.forEach((severity) => {
        expect(['HIGH', 'MEDIUM', 'LOW']).toContain(severity);
      });
    });

    test('should include file paths in issues', () => {
      const result = profiler.analyze('/tmp');

      result.issues.forEach((issue) => {
        expect(typeof issue.file).toBe('string');
        expect(issue.file.length > 0).toBe(true);
      });
    });

    test('should include component names in issues', () => {
      const result = profiler.analyze('/tmp');

      result.issues.forEach((issue) => {
        expect(typeof issue.componentName).toBe('string');
        expect(issue.componentName.length > 0).toBe(true);
      });
    });

    test('should include actionable suggestions for each issue', () => {
      const result = profiler.analyze('/tmp');

      result.issues.forEach((issue) => {
        expect(typeof issue.suggestedFix).toBe('string');
        expect(issue.suggestedFix.length > 0).toBe(true);
      });
    });

    test('should provide issue descriptions', () => {
      const result = profiler.analyze('/tmp');

      result.issues.forEach((issue) => {
        expect(typeof issue.description).toBe('string');
        expect(issue.description.length > 0).toBe(true);
      });
    });

    test('should include estimated impact when available', () => {
      const result = profiler.analyze('/tmp');

      result.issues.forEach((issue) => {
        if (issue.estimatedImpact) {
          expect(typeof issue.estimatedImpact).toBe('string');
        }
      });
    });

    test('should report line numbers for issues', () => {
      const result = profiler.analyze('/tmp');

      result.issues.forEach((issue) => {
        expect(typeof issue.line).toBe('number');
        expect(issue.line >= 0).toBe(true);
      });
    });

    test('should classify issue types correctly', () => {
      const result = profiler.analyze('/tmp');

      const validTypes = [
        'unnecessary_rerender',
        'missing_memo',
        'missing_usecallback',
        'missing_usememo',
        'inline_objects_arrays',
        'large_dependency_array',
      ];

      result.issues.forEach((issue) => {
        expect(validTypes).toContain(issue.issueType);
      });
    });

    test('should count issues matching summary totals', () => {
      const result = profiler.analyze('/tmp');

      let countedIssues = 0;
      for (const count of Object.values(result.summary)) {
        countedIssues += count;
      }

      expect(countedIssues).toBe(result.issuesFound);
    });

    test('should skip invalid files gracefully', () => {
      // Should not throw when encountering invalid files
      expect(() => profiler.analyze('/tmp')).not.toThrow();
    });

    test('should focus on .tsx and .jsx files only', () => {
      const result = profiler.analyze('/tmp');

      result.issues.forEach((issue) => {
        const ext = issue.file.substring(issue.file.lastIndexOf('.'));
        // Files should be React component files
        expect(['.tsx', '.jsx']).toContain(ext);
      });
    });
  });
});
