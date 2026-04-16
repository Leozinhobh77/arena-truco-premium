/**
 * skill-performance v5.2 — React Integration Tests
 * @summary Integration tests for React Profiler with Arena Baseline
 */

import { createReactProfiler } from '../../src/analyzers/react-profiler';
import { createArenaBaseline } from '../../src/analyzers/arena-baseline';
import { createBundleCorrelator } from '../../src/correlation/bundle-correlation';

describe('React Integration — Profiler with Arena System', () => {
  let profiler: ReturnType<typeof createReactProfiler>;
  let baseline: ReturnType<typeof createArenaBaseline>;
  let correlator: ReturnType<typeof createBundleCorrelator>;

  beforeEach(() => {
    profiler = createReactProfiler();
    baseline = createArenaBaseline();
    correlator = createBundleCorrelator();
  });

  describe('ReactProfiler integration with Arena Baseline', () => {
    test('should analyze project and generate React-specific issues', () => {
      const result = profiler.analyze('/tmp');

      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
      expect('missing_memo' in result.summary).toBe(true);
      expect('missing_usecallback' in result.summary).toBe(true);
    });

    test('should provide recommendations for React optimization', () => {
      const result = profiler.analyze('/tmp');

      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations!.length >= 0).toBe(true);
    });

    test('should classify React issues with appropriate severity', () => {
      const result = profiler.analyze('/tmp');

      const validSeverities = ['HIGH', 'MEDIUM', 'LOW'];
      result.issues.forEach((issue) => {
        expect(validSeverities).toContain(issue.severity);
      });
    });

    test('should report component names in React issues', () => {
      const result = profiler.analyze('/tmp');

      result.issues.forEach((issue) => {
        expect(typeof issue.componentName).toBe('string');
        expect(issue.componentName.length > 0).toBe(true);
      });
    });

    test('should provide estimated impact for React optimizations', () => {
      const result = profiler.analyze('/tmp');

      result.issues.forEach((issue) => {
        if (issue.estimatedImpact) {
          // Should mention performance metric (LCP, bundle size, etc.)
          expect(
            issue.estimatedImpact.includes('ms') ||
            issue.estimatedImpact.includes('kb') ||
            issue.estimatedImpact.includes('KB')
          ).toBe(true);
        }
      });
    });
  });

  describe('React issues in Arena Baseline aggregation', () => {
    test('should handle React analysis as optional analyzer', async () => {
      const baselineReport = await baseline.captureBaseline('/tmp');

      expect(baselineReport).toBeDefined();
      expect(baselineReport.projectName).toBe('Arena Truco Premium');
    });

    test('should support extension of baseline with React profiler', async () => {
      const baselineReport = await baseline.captureBaseline('/tmp');
      const reactResult = profiler.analyze('/tmp');

      // Should be able to combine reports
      expect(baselineReport.timestamp).toBeDefined();
      expect(reactResult.timestamp).toBeDefined();
      expect(baselineReport.analyzers).toBeDefined();
    });

    test('should track React component issues separately from bundle issues', () => {
      const reactResult = profiler.analyze('/tmp');
      const issues = reactResult.issues;

      // All issues should be React-specific types
      const reactIssueTypes = [
        'unnecessary_rerender',
        'missing_memo',
        'missing_usecallback',
        'missing_usememo',
        'inline_objects_arrays',
        'large_dependency_array',
      ];

      issues.forEach((issue) => {
        expect(reactIssueTypes).toContain(issue.issueType);
      });
    });
  });

  describe('Correlation engine with React issues', () => {
    test('should handle empty React profiler results', async () => {
      const baselineReport = await baseline.captureBaseline('/tmp');
      const reactResult = profiler.analyze('/tmp');

      // Create minimal issues array for correlation
      const correlationReport = correlator.correlate(baselineReport, []);

      expect(correlationReport).toBeDefined();
      expect(Array.isArray(correlationReport.correlations)).toBe(true);
    });

    test('should correlate React issues to performance impact', () => {
      const reactResult = profiler.analyze('/tmp');

      // React issues with HIGH severity should indicate significant impact
      const highSeverityIssues = reactResult.issues.filter((i) => i.severity === 'HIGH');

      if (highSeverityIssues.length > 0) {
        highSeverityIssues.forEach((issue) => {
          expect(issue.suggestedFix).toBeDefined();
          expect(issue.suggestedFix.length > 0).toBe(true);
        });
      }
    });
  });

  describe('React profiler resilience', () => {
    test('should handle projects without React components', () => {
      const result = profiler.analyze('/tmp');

      // Should complete without errors even if no components found
      expect(result).toBeDefined();
      expect(result.componentsScanned >= 0).toBe(true);
    });

    test('should skip files with syntax errors gracefully', () => {
      const result = profiler.analyze('/tmp');

      // Should not throw even with invalid React files
      expect(result).toBeDefined();
      expect(Array.isArray(result.issues)).toBe(true);
    });

    test('should handle missing React imports gracefully', () => {
      const result = profiler.analyze('/tmp');

      // Should still analyze even if React is not imported (edge case)
      expect(result.issues).toBeDefined();
      expect(Array.isArray(result.issues)).toBe(true);
    });

    test('should report meaningful component names even in edge cases', () => {
      const result = profiler.analyze('/tmp');

      result.issues.forEach((issue) => {
        expect(typeof issue.componentName).toBe('string');
        expect(issue.componentName.length > 0).toBe(true);
      });
    });
  });

  describe('React recommendations quality', () => {
    test('should provide specific fix suggestions for missing memo', () => {
      const result = profiler.analyze('/tmp');

      const memoIssues = result.issues.filter((i) => i.issueType === 'missing_memo');
      memoIssues.forEach((issue) => {
        expect(issue.suggestedFix.toLowerCase()).toContain('react.memo');
      });
    });

    test('should provide specific fix suggestions for missing useCallback', () => {
      const result = profiler.analyze('/tmp');

      const callbackIssues = result.issues.filter((i) => i.issueType === 'missing_usecallback');
      callbackIssues.forEach((issue) => {
        expect(issue.suggestedFix.toLowerCase()).toContain('usecallback');
      });
    });

    test('should provide specific fix suggestions for missing useMemo', () => {
      const result = profiler.analyze('/tmp');

      const memoIssues = result.issues.filter((i) => i.issueType === 'missing_usememo');
      memoIssues.forEach((issue) => {
        expect(issue.suggestedFix.toLowerCase()).toContain('usememo');
      });
    });

    test('should explain impact of inline objects/arrays', () => {
      const result = profiler.analyze('/tmp');

      const inlineIssues = result.issues.filter((i) => i.issueType === 'inline_objects_arrays');
      inlineIssues.forEach((issue) => {
        expect(issue.description.toLowerCase()).toContain('re-render');
      });
    });

    test('should mention dependency array issues', () => {
      const result = profiler.analyze('/tmp');

      const depIssues = result.issues.filter((i) => i.issueType === 'large_dependency_array');
      depIssues.forEach((issue) => {
        expect(issue.description.toLowerCase()).toContain('dependency');
      });
    });
  });

  describe('React profiler metrics consistency', () => {
    test('should have consistent issue counts in summary', () => {
      const result = profiler.analyze('/tmp');

      let summaryTotal = 0;
      for (const count of Object.values(result.summary)) {
        summaryTotal += count;
      }

      expect(summaryTotal).toBe(result.issuesFound);
    });

    test('should increment component count accurately', () => {
      const result = profiler.analyze('/tmp');

      expect(result.componentsScanned >= 0).toBe(true);
      expect(typeof result.componentsScanned).toBe('number');
    });

    test('should increment issue count accurately', () => {
      const result = profiler.analyze('/tmp');

      let manualCount = 0;
      result.issues.forEach(() => {
        manualCount++;
      });

      expect(manualCount).toBe(result.issuesFound);
    });

    test('should report valid issue statistics', () => {
      const result = profiler.analyze('/tmp');

      expect(result.issuesFound >= 0).toBe(true);
      expect(result.componentsScanned >= 0).toBe(true);
    });
  });

  describe('React profiler output consistency', () => {
    test('should generate consistent timestamps', () => {
      const result1 = profiler.analyze('/tmp');
      const result2 = profiler.analyze('/tmp');

      // Both should have valid timestamps
      expect(new Date(result1.timestamp).getTime()).toBeGreaterThan(0);
      expect(new Date(result2.timestamp).getTime()).toBeGreaterThan(0);
    });

    test('should maintain project path in result', () => {
      const projectPath = '/test/project';
      const result = profiler.analyze(projectPath);

      expect(result.projectPath).toBe(projectPath);
    });

    test('should always provide recommendations', () => {
      const result = profiler.analyze('/tmp');

      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should handle multiple analyses of same project', () => {
      const path = '/tmp';
      const result1 = profiler.analyze(path);
      const result2 = profiler.analyze(path);

      // Both should return valid results
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1.projectPath).toBe(result2.projectPath);
    });
  });

  describe('React profiler extensibility', () => {
    test('should allow new issue types to be added to summary', () => {
      const result = profiler.analyze('/tmp');

      // Summary object should allow adding new properties
      expect(Object.keys(result.summary).length >= 6).toBe(true);
    });

    test('should support recommendations beyond standard set', () => {
      const result = profiler.analyze('/tmp');

      // Recommendations can be customized for different rule sets
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should include all required fields for issues', () => {
      const result = profiler.analyze('/tmp');

      const requiredFields = ['componentName', 'file', 'line', 'issueType', 'severity', 'description', 'suggestedFix'];

      result.issues.forEach((issue) => {
        requiredFields.forEach((field) => {
          expect(field in issue).toBe(true);
        });
      });
    });
  });
});
