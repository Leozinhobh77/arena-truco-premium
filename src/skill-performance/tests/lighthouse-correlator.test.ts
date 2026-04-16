/**
 * skill-performance v5.2 — Lighthouse Correlator Tests
 * @summary Tests for mapping Lighthouse metrics to Sprint 1 issues
 */

import { createLighthouseCorrelator } from '../src/correlation/lighthouse-correlator';
import { Issue, LighthouseResult } from '../src/types';

describe('LighthouseCorrelator', () => {
  let correlator: ReturnType<typeof createLighthouseCorrelator>;

  beforeEach(() => {
    correlator = createLighthouseCorrelator();
  });

  describe('createLighthouseCorrelator', () => {
    test('should create a correlator instance', () => {
      expect(correlator).toBeDefined();
      expect(correlator.correlate).toBeDefined();
      expect(correlator.generateCorrelationReport).toBeDefined();
    });
  });

  describe('correlate()', () => {
    const mockLighthouse: LighthouseResult = {
      timestamp: new Date().toISOString(),
      scores: {
        performance: 45,
        accessibility: 80,
        bestPractices: 70,
        seo: 60,
      },
      metrics: {
        fcp: 2800,
        lcp: 2800,
        cls: 0.25,
        fid: 100,
      },
    };

    test('should enrich sequential animation issues with LCP impact', () => {
      const issue: Issue = {
        file: 'src/screens/ClansScreen.tsx',
        line: 239,
        column: 5,
        severity: 'HIGH',
        type: 'sequential_animation',
        message: 'Sequential animation with delay: i * 0.08',
        recommendation: 'Use batch stagger instead of sequential delays',
      };

      const result = correlator.correlate([issue], mockLighthouse);

      expect(result).toHaveLength(1);
      expect(result[0]!.lighthouseImpact).toBeDefined();
      expect(result[0]!.lighthouseImpact?.metric).toBe('LCP');
      expect(result[0]!.lighthouseImpact?.estimatedImpact).toContain('ms');
    });

    test('should enrich re-render issues with FID impact', () => {
      const issue: Issue = {
        file: 'src/overlays/ConfiguracoesOverlay.tsx',
        line: 19,
        column: 10,
        severity: 'MEDIUM',
        type: 'excess_rerender',
        message: 'Missing useCallback on event handler',
        recommendation:
          'Wrap with useCallback(() => {...}, [deps])',
      };

      const result = correlator.correlate([issue], mockLighthouse);

      expect(result).toHaveLength(1);
      expect(result[0]!.lighthouseImpact).toBeDefined();
      expect(result[0]!.lighthouseImpact?.metric).toBe('FID');
    });

    test('should enrich image optimization issues with Performance impact', () => {
      const issue: Issue = {
        file: 'src/components/Avatar.tsx',
        line: 45,
        column: 3,
        severity: 'LOW',
        type: 'missing_lazy_loading',
        message: 'Image missing loading="lazy" attribute',
        recommendation: 'Add loading="lazy" to <img> tag',
      };

      const result = correlator.correlate([issue], mockLighthouse);

      expect(result).toHaveLength(1);
      expect(result[0]!.lighthouseImpact).toBeDefined();
      expect(result[0]!.lighthouseImpact?.metric).toBe('Performance');
    });

    test('should handle multiple issues', () => {
      const issues: Issue[] = [
        {
          file: 'src/screens/ClansScreen.tsx',
          line: 239,
          column: 5,
          severity: 'HIGH',
          type: 'sequential_animation',
          message: 'Sequential animation issue 1',
          recommendation: 'Fix sequential animations',
        },
        {
          file: 'src/overlays/ConfiguracoesOverlay.tsx',
          line: 19,
          column: 10,
          severity: 'MEDIUM',
          type: 'excess_rerender',
          message: 'Missing useCallback',
          recommendation: 'Add useCallback',
        },
        {
          file: 'src/components/Avatar.tsx',
          line: 45,
          column: 3,
          severity: 'LOW',
          type: 'missing_lazy_loading',
          message: 'Missing lazy-loading',
          recommendation: 'Add lazy-loading',
        },
      ];

      const result = correlator.correlate(issues, mockLighthouse);

      expect(result).toHaveLength(3);
      expect(result[0]!.lighthouseImpact?.metric).toBe('LCP');
      expect(result[1]!.lighthouseImpact?.metric).toBe('FID');
      expect(result[2]!.lighthouseImpact?.metric).toBe('Performance');
    });

    test('should not modify non-correlated issue types', () => {
      const issue: Issue = {
        file: 'src/unknown.ts',
        line: 1,
        column: 1,
        severity: 'LOW',
        type: 'bundle_size',
        message: 'Large bundle',
        recommendation: 'Code split',
      };

      const result = correlator.correlate([issue], mockLighthouse);

      expect(result[0]!.lighthouseImpact).toBeUndefined();
    });
  });

  describe('generateCorrelationReport()', () => {
    const mockLighthouse: LighthouseResult = {
      timestamp: new Date().toISOString(),
      scores: {
        performance: 45,
        accessibility: 80,
        bestPractices: 70,
        seo: 60,
      },
      metrics: {
        fcp: 2800,
        lcp: 2800,
        cls: 0.25,
        fid: 100,
      },
    };

    test('should generate readable correlation report', () => {
      const issue: Issue = {
        file: 'src/screens/ClansScreen.tsx',
        line: 239,
        column: 5,
        severity: 'HIGH',
        type: 'sequential_animation',
        message: 'Sequential animation with delay: i * 0.08',
        recommendation: 'Use batch stagger',
      };

      const correlated = correlator.correlate([issue], mockLighthouse);
      const report = correlator.generateCorrelationReport(
        correlated,
        mockLighthouse
      );

      expect(report).toContain('LIGHTHOUSE × SPRINT 1 CORRELATION ANALYSIS');
      expect(report).toContain('Performance Score: 45/100');
      expect(report).toContain('LCP Impact');
      expect(report).toContain('Sequential animation');
    });

    test('should include Lighthouse scores in report', () => {
      const issue: Issue = {
        file: 'test.tsx',
        line: 1,
        column: 1,
        severity: 'LOW',
        type: 'sequential_animation',
        message: 'Test',
        recommendation: 'Test',
      };

      const correlated = correlator.correlate([issue], mockLighthouse);
      const report = correlator.generateCorrelationReport(
        correlated,
        mockLighthouse
      );

      expect(report).toContain('45/100'); // performance
      expect(report).toContain('80/100'); // accessibility
      expect(report).toContain('70/100'); // bestPractices
      expect(report).toContain('60/100'); // seo
    });

    test('should organize issues by metric', () => {
      const issues: Issue[] = [
        {
          file: 'ClansScreen.tsx',
          line: 239,
          column: 5,
          severity: 'HIGH',
          type: 'sequential_animation',
          message: 'Sequential animation 1',
          recommendation: 'Fix',
        },
        {
          file: 'ClansScreen.tsx',
          line: 250,
          column: 5,
          severity: 'HIGH',
          type: 'sequential_animation',
          message: 'Sequential animation 2',
          recommendation: 'Fix',
        },
      ];

      const correlated = correlator.correlate(issues, mockLighthouse);
      const report = correlator.generateCorrelationReport(
        correlated,
        mockLighthouse
      );

      expect(report).toContain('LCP Impact (2 issues)');
    });
  });
});
