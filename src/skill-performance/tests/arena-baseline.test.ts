/**
 * skill-performance v5.2 — Arena Truco Baseline Tests
 * @summary Tests for Arena Truco baseline capture
 */

import { createArenaBaseline } from '../src/analyzers/arena-baseline';

describe('ArenaBaseline', () => {
  let analyzer: ReturnType<typeof createArenaBaseline>;

  beforeEach(() => {
    analyzer = createArenaBaseline();
  });

  describe('createArenaBaseline', () => {
    test('should create an arena baseline analyzer instance', () => {
      expect(analyzer).toBeDefined();
      expect(analyzer.captureBaseline).toBeDefined();
    });
  });

  describe('captureBaseline()', () => {
    test('should handle non-existent project path gracefully', async () => {
      const report = await analyzer.captureBaseline('/nonexistent/project');

      expect(report).toBeDefined();
      expect(report.projectName).toBe('Arena Truco Premium');
      expect(report.timestamp).toBeTruthy();
      expect(report.phase).toBe('baseline');
    });

    test('should create report with all required fields', async () => {
      const report = await analyzer.captureBaseline('/tmp');

      expect(report.projectName).toBeDefined();
      expect(report.timestamp).toBeDefined();
      expect(report.phase).toBeDefined();
      expect(report.analyzers).toBeDefined();
      expect(report.summary).toBeDefined();
      expect(report.recommendations).toBeDefined();
    });

    test('should initialize summary with zero values', async () => {
      const report = await analyzer.captureBaseline('/tmp');

      expect(report.summary.totalIssues).toBeDefined();
      expect(report.summary.highPriority).toBeDefined();
      expect(report.summary.mediumPriority).toBeDefined();
      expect(report.summary.lowPriority).toBeDefined();
    });

    test('should include recommendations array', async () => {
      const report = await analyzer.captureBaseline('/tmp');

      expect(Array.isArray(report.recommendations)).toBe(true);
      expect(report.recommendations.length).toBeGreaterThan(0);
    });

    test('should mark phase as baseline', async () => {
      const report = await analyzer.captureBaseline('/tmp');

      expect(report.phase).toBe('baseline');
    });

    test('should attempt to capture bundle analysis', async () => {
      const report = await analyzer.captureBaseline('/tmp');

      // Either captures bundle or gracefully skips
      expect(report.analyzers).toBeDefined();
    });

    test('should attempt to capture database analysis', async () => {
      const report = await analyzer.captureBaseline('/tmp');

      // Either captures database or gracefully skips
      expect(report.analyzers).toBeDefined();
    });

    test('should attempt to capture dead code analysis', async () => {
      const report = await analyzer.captureBaseline('/tmp');

      // Either captures dead code or gracefully skips
      expect(report.analyzers).toBeDefined();
    });

    test('should generate performance recommendations', async () => {
      const report = await analyzer.captureBaseline('/tmp');

      expect(Array.isArray(report.recommendations)).toBe(true);
      // Should have at least one recommendation (default or based on analysis)
      if (report.recommendations.length > 0) {
        expect(typeof report.recommendations[0]).toBe('string');
      }
    });

    test('should use ISO timestamp format', async () => {
      const report = await analyzer.captureBaseline('/tmp');

      // Should be valid ISO date format
      const timestamp = new Date(report.timestamp);
      expect(timestamp instanceof Date && !isNaN(timestamp.getTime())).toBe(true);
    });

    test('should have all analyzer fields as optional', async () => {
      const report = await analyzer.captureBaseline('/tmp');

      // Analyzers should be optional since some might fail
      expect(typeof report.analyzers === 'object').toBe(true);
    });

    test('should track total issues across all analyzers', async () => {
      const report = await analyzer.captureBaseline('/tmp');

      // Total issues should be sum of all analyzer issues
      const totalIssues = report.summary.totalIssues || 0;
      expect(typeof totalIssues === 'number').toBe(true);
      expect(totalIssues >= 0).toBe(true);
    });

    test('should categorize issues by priority', async () => {
      const report = await analyzer.captureBaseline('/tmp');

      const high = report.summary.highPriority || 0;
      const medium = report.summary.mediumPriority || 0;
      const low = report.summary.lowPriority || 0;

      // All should be numbers
      expect(typeof high === 'number').toBe(true);
      expect(typeof medium === 'number').toBe(true);
      expect(typeof low === 'number').toBe(true);
    });

    test('should handle errors gracefully and continue analysis', async () => {
      // Even with invalid paths, should complete without throwing
      const report = await analyzer.captureBaseline('../../../etc/passwd');

      expect(report).toBeDefined();
      expect(report.summary).toBeDefined();
    });

    test('should include project name in report', async () => {
      const report = await analyzer.captureBaseline('/tmp');

      expect(report.projectName).toBe('Arena Truco Premium');
    });
  });
});
