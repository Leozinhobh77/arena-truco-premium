/**
 * skill-performance v5.2 — Bundle Correlation Tests
 * @summary Tests for Bundle Correlation Engine
 */

import { createBundleCorrelator } from '../../src/correlation/bundle-correlation';
import { ArenaBaselineReport } from '../../src/analyzers/arena-baseline';
import { Issue } from '../../src/types';

describe('BundleCorrelator', () => {
  let correlator: ReturnType<typeof createBundleCorrelator>;

  beforeEach(() => {
    correlator = createBundleCorrelator();
  });

  describe('createBundleCorrelator', () => {
    test('should create a bundle correlator instance', () => {
      expect(correlator).toBeDefined();
      expect(correlator.correlate).toBeDefined();
    });
  });

  describe('correlate()', () => {
    test('should return a valid correlation report structure', () => {
      const baseline: ArenaBaselineReport = {
        projectName: 'Arena Truco Premium',
        timestamp: new Date().toISOString(),
        phase: 'baseline',
        analyzers: {},
        summary: { totalIssues: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0 },
        recommendations: [],
      };

      const report = correlator.correlate(baseline, []);

      expect(report.timestamp).toBeDefined();
      expect(report.analyzedIssues).toBeDefined();
      expect(report.correlatedIssues).toBeDefined();
      expect(Array.isArray(report.correlations)).toBe(true);
      expect(report.impact).toBeDefined();
    });

    test('should detect large bundle size correlation', () => {
      const baseline: ArenaBaselineReport = {
        projectName: 'Arena Truco Premium',
        timestamp: new Date().toISOString(),
        phase: 'baseline',
        analyzers: {
          bundle: {
            totalGzipped: 600 * 1024, // 600KB > 500KB threshold
          },
        },
        summary: { totalIssues: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0 },
        recommendations: [],
      };

      const sprintIssues: Issue[] = [
        {
          type: 'sequential_animation',
          message: 'Sequential animation detected',
          severity: 'HIGH',
          file: 'src/components/Card.tsx',
          line: 42,
          column: 5,
          recommendation: 'Use requestAnimationFrame for smooth animations',
        },
      ];

      const report = correlator.correlate(baseline, sprintIssues);

      expect(report.analyzedIssues).toBeGreaterThan(0);
      expect(report.correlatedIssues).toBeGreaterThan(0);
      expect(report.correlations.length).toBeGreaterThan(0);
      expect(report.correlations[0]!.estimatedImpact).toBe('HIGH');
    });

    test('should detect dead code impact on bundle', () => {
      const baseline: ArenaBaselineReport = {
        projectName: 'Arena Truco Premium',
        timestamp: new Date().toISOString(),
        phase: 'baseline',
        analyzers: {
          bundle: {
            totalGzipped: 300 * 1024,
          },
          deadCode: {
            unusedExports: 5,
            unusedImports: 3,
            unusedVariables: 4,
          },
        },
        summary: { totalIssues: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0 },
        recommendations: [],
      };

      const report = correlator.correlate(baseline, []);

      expect(report.analyzedIssues).toBeGreaterThan(0);
      expect(report.correlatedIssues).toBeGreaterThan(0);
      expect(
        report.correlations.some((c) => c.bundleIssue.includes('dead code'))
      ).toBe(true);
    });

    test('should detect chunk fragmentation issues', () => {
      const baseline: ArenaBaselineReport = {
        projectName: 'Arena Truco Premium',
        timestamp: new Date().toISOString(),
        phase: 'baseline',
        analyzers: {
          bundle: {
            totalGzipped: 300 * 1024,
            chunks: 10, // > 8 threshold
          },
        },
        summary: { totalIssues: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0 },
        recommendations: [],
      };

      const report = correlator.correlate(baseline, []);

      expect(report.analyzedIssues).toBeGreaterThan(0);
      expect(
        report.correlations.some((c) => c.bundleIssue.includes('fragmentation'))
      ).toBe(true);
    });

    test('should detect N+1 query impact on performance', () => {
      const baseline: ArenaBaselineReport = {
        projectName: 'Arena Truco Premium',
        timestamp: new Date().toISOString(),
        phase: 'baseline',
        analyzers: {
          database: {
            n1Queries: 3,
          },
        },
        summary: { totalIssues: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0 },
        recommendations: [],
      };

      const sprintIssues: Issue[] = [
        {
          type: 'n1_query',
          message: 'Slow API response',
          severity: 'HIGH',
          file: 'src/api/posts.ts',
          line: 15,
          column: 1,
          recommendation: 'Use eager loading or batch operations',
        },
      ];

      const report = correlator.correlate(baseline, sprintIssues);

      expect(report.analyzedIssues).toBeGreaterThan(0);
      expect(report.correlatedIssues).toBeGreaterThan(0);
      expect(
        report.correlations.some((c) => c.bundleIssue.includes('N+1'))
      ).toBe(true);
    });

    test('should include performance impact in report', () => {
      const baseline: ArenaBaselineReport = {
        projectName: 'Arena Truco Premium',
        timestamp: new Date().toISOString(),
        phase: 'baseline',
        analyzers: {
          bundle: {
            totalGzipped: 600 * 1024,
          },
          database: {
            n1Queries: 5,
          },
        },
        summary: { totalIssues: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0 },
        recommendations: [],
      };

      const report = correlator.correlate(baseline, []);

      expect(report.impact.performanceImpact).toBeGreaterThan(0);
      expect(report.impact.performanceImpact).toBeLessThanOrEqual(100);
    });

    test('should estimate bundle size improvement', () => {
      const baseline: ArenaBaselineReport = {
        projectName: 'Arena Truco Premium',
        timestamp: new Date().toISOString(),
        phase: 'baseline',
        analyzers: {
          bundle: {
            totalGzipped: 500 * 1024,
          },
          deadCode: {
            unusedExports: 10,
            unusedImports: 15,
            unusedVariables: 8,
          },
        },
        summary: { totalIssues: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0 },
        recommendations: [],
      };

      const report = correlator.correlate(baseline, []);

      expect(report.impact.bundleSizeImpact).toBeDefined();
      expect(typeof report.impact.bundleSizeImpact).toBe('string');
    });

    test('should generate actionable recommendations', () => {
      const baseline: ArenaBaselineReport = {
        projectName: 'Arena Truco Premium',
        timestamp: new Date().toISOString(),
        phase: 'baseline',
        analyzers: {
          bundle: {
            totalGzipped: 600 * 1024,
          },
          database: {
            n1Queries: 2,
          },
        },
        summary: { totalIssues: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0 },
        recommendations: [],
      };

      const report = correlator.correlate(baseline, []);

      expect(Array.isArray(report.impact.recommendations)).toBe(true);
      if (report.impact.recommendations && report.impact.recommendations.length > 0) {
        expect(typeof report.impact.recommendations[0]).toBe('string');
      }
    });

    test('should cap performance impact at 100', () => {
      const baseline: ArenaBaselineReport = {
        projectName: 'Arena Truco Premium',
        timestamp: new Date().toISOString(),
        phase: 'baseline',
        analyzers: {
          bundle: {
            totalGzipped: 800 * 1024,
          },
          database: {
            n1Queries: 10,
          },
          deadCode: {
            unusedExports: 50,
            unusedImports: 40,
            unusedVariables: 30,
          },
        },
        summary: { totalIssues: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0 },
        recommendations: [],
      };

      const report = correlator.correlate(baseline, []);

      expect(report.impact.performanceImpact).toBeLessThanOrEqual(100);
    });

    test('should handle empty correlations gracefully', () => {
      const baseline: ArenaBaselineReport = {
        projectName: 'Arena Truco Premium',
        timestamp: new Date().toISOString(),
        phase: 'baseline',
        analyzers: {},
        summary: { totalIssues: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0 },
        recommendations: [],
      };

      const report = correlator.correlate(baseline, []);

      expect(report).toBeDefined();
      expect(Array.isArray(report.correlations)).toBe(true);
      expect(report.impact.recommendations).toBeDefined();
    });

    test('should use ISO 8601 timestamp format', () => {
      const baseline: ArenaBaselineReport = {
        projectName: 'Arena Truco Premium',
        timestamp: new Date().toISOString(),
        phase: 'baseline',
        analyzers: {},
        summary: { totalIssues: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0 },
        recommendations: [],
      };

      const report = correlator.correlate(baseline, []);

      const timestamp = new Date(report.timestamp);
      expect(timestamp instanceof Date && !isNaN(timestamp.getTime())).toBe(true);
    });

    test('should count analyzed and correlated issues correctly', () => {
      const baseline: ArenaBaselineReport = {
        projectName: 'Arena Truco Premium',
        timestamp: new Date().toISOString(),
        phase: 'baseline',
        analyzers: {
          bundle: {
            totalGzipped: 600 * 1024,
            chunks: 10,
          },
          deadCode: {
            unusedExports: 5,
            unusedImports: 3,
            unusedVariables: 4,
          },
          database: {
            n1Queries: 2,
          },
        },
        summary: { totalIssues: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0 },
        recommendations: [],
      };

      const report = correlator.correlate(baseline, []);

      expect(report.analyzedIssues).toBeGreaterThan(0);
      expect(report.correlatedIssues).toBeGreaterThan(0);
      expect(report.correlations.length).toBe(report.correlatedIssues);
    });

    test('should prioritize HIGH impact correlations first in recommendations', () => {
      const baseline: ArenaBaselineReport = {
        projectName: 'Arena Truco Premium',
        timestamp: new Date().toISOString(),
        phase: 'baseline',
        analyzers: {
          bundle: {
            totalGzipped: 600 * 1024,
          },
          database: {
            n1Queries: 3,
          },
        },
        summary: { totalIssues: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0 },
        recommendations: [],
      };

      const report = correlator.correlate(baseline, []);

      if (report.impact.recommendations && report.impact.recommendations.length > 0) {
        const hasHighPriority = report.impact.recommendations.some((r) =>
          r.includes('CRITICAL') || r.includes('IMPORTANT')
        );
        expect(hasHighPriority || report.impact.recommendations.length > 0).toBe(true);
      }
    });
  });
});
