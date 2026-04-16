/**
 * skill-performance v5.2 — Bundle Correlation Engine
 * @summary Maps bundle analysis issues to underlying code patterns from Sprint 1
 * @law SEC-07: Generic error messages (no stack traces)
 */

import { Issue } from '../types';
import { ArenaBaselineReport } from '../analyzers/arena-baseline';

/**
 * Bundle Correlation Report
 */
export interface BundleCorrelationReport {
  timestamp: string;
  analyzedIssues: number;
  correlatedIssues: number;
  correlations: BundleCorrelation[];
  impact: {
    performanceImpact?: number;
    bundleSizeImpact?: string;
    recommendations?: string[];
  };
}

/**
 * Bundle Correlation
 */
export interface BundleCorrelation {
  bundleIssue: string;
  relatedSprintIssues: string[];
  rootCauses: string[];
  estimatedImpact: 'HIGH' | 'MEDIUM' | 'LOW';
  suggestedFix: string;
}

/**
 * BundleCorrelatorImpl
 * @description Correlates bundle issues to code patterns
 */
export class BundleCorrelatorImpl {
  /**
   * correlate — Correlate baseline bundle issues to code patterns
   */
  correlate(baseline: ArenaBaselineReport, sprintIssues: Issue[]): BundleCorrelationReport {
    const report: BundleCorrelationReport = {
      timestamp: new Date().toISOString(),
      analyzedIssues: 0,
      correlatedIssues: 0,
      correlations: [],
      impact: {
        performanceImpact: 0,
        bundleSizeImpact: 'unknown',
        recommendations: [],
      },
    };

    // Analyze bundle size issues
    if (baseline.analyzers.bundle) {
      const bundleSize = baseline.analyzers.bundle.totalGzipped || 0;
      if (bundleSize > 500 * 1024) {
        report.analyzedIssues++;

        // Find related sequential animation issues (cause bloat)
        const sequentialAnimationIssues = sprintIssues.filter((i) =>
          i.type?.includes('sequential') || i.message?.includes('animation')
        );

        if (sequentialAnimationIssues.length > 0) {
          report.correlations.push({
            bundleIssue: `Large bundle ${(bundleSize / 1024).toFixed(1)}KB gzipped`,
            relatedSprintIssues: sequentialAnimationIssues.map((i) => i.message || 'Animation issue'),
            rootCauses: ['Unused animations bundled', 'Unoptimized CSS animations', 'Duplicate animation libraries'],
            estimatedImpact: 'HIGH',
            suggestedFix: 'Implement code splitting for animation libraries, use lazy loading for non-critical animations',
          });

          report.correlatedIssues++;
        }
      }

      // Analyze dead code impact on bundle
      if (baseline.analyzers.deadCode) {
        const deadCodeCount =
          (baseline.analyzers.deadCode.unusedExports || 0) +
          (baseline.analyzers.deadCode.unusedImports || 0) +
          (baseline.analyzers.deadCode.unusedVariables || 0);

        if (deadCodeCount > 10) {
          report.analyzedIssues++;

          report.correlations.push({
            bundleIssue: `${deadCodeCount} dead code items inflating bundle`,
            relatedSprintIssues: ['Unused exports', 'Unused dependencies', 'Dead code from refactoring'],
            rootCauses: ['Incomplete refactoring', 'Circular dependencies not resolved', 'Legacy code not removed'],
            estimatedImpact: 'MEDIUM',
            suggestedFix: `Remove ${deadCodeCount} unused exports/imports to reduce bundle by estimated ${(deadCodeCount * 2).toFixed(0)}KB`,
          });

          report.correlatedIssues++;
        }
      }

      // Analyze duplicate chunks
      if ((baseline.analyzers.bundle.chunks || 0) > 8) {
        report.analyzedIssues++;

        report.correlations.push({
          bundleIssue: `${baseline.analyzers.bundle.chunks} separate chunks - fragmentation overhead`,
          relatedSprintIssues: ['Multiple entry points', 'Shared dependencies not consolidated'],
          rootCauses: ['Inadequate code splitting strategy', 'Duplicate vendor code in multiple chunks'],
          estimatedImpact: 'MEDIUM',
          suggestedFix: 'Consolidate shared dependencies into a common chunk, implement better code-splitting strategy',
        });

        report.correlatedIssues++;
      }
    }

    // Analyze N+1 query impact on performance
    if (baseline.analyzers.database) {
      const n1QueryCount = baseline.analyzers.database.n1Queries || 0;

      if (n1QueryCount > 0) {
        report.analyzedIssues++;

        const performanceIssues = sprintIssues.filter((i) => i.severity === 'HIGH' && i.type?.includes('performance'));

        report.correlations.push({
          bundleIssue: `${n1QueryCount} N+1 query patterns causing runtime slowdown`,
          relatedSprintIssues: performanceIssues.map((i) => i.message || 'Performance issue'),
          rootCauses: ['Missing eager loading', 'Inefficient ORM usage', 'Waterfalling database requests'],
          estimatedImpact: 'HIGH',
          suggestedFix: `Use eager loading (.include()/.relations()) for ${n1QueryCount} queries, implement batch operations`,
        });

        report.correlatedIssues++;
      }
    }

    // Calculate overall impact
    report.impact.performanceImpact = this.calculatePerformanceImpact(report.correlations);
    report.impact.bundleSizeImpact = this.estimateBundleImpact(baseline);
    report.impact.recommendations = this.generateCorrelationRecommendations(report.correlations);

    return report;
  }

  /**
   * calculatePerformanceImpact — Estimate total performance impact
   * @private
   */
  private calculatePerformanceImpact(correlations: BundleCorrelation[]): number {
    let impact = 0;

    correlations.forEach((corr) => {
      if (corr.estimatedImpact === 'HIGH') {
        impact += 30;
      } else if (corr.estimatedImpact === 'MEDIUM') {
        impact += 15;
      } else {
        impact += 5;
      }
    });

    return Math.min(100, impact); // Cap at 100
  }

  /**
   * estimateBundleImpact — Estimate bundle size improvements
   * @private
   */
  private estimateBundleImpact(baseline: ArenaBaselineReport): string {
    const bundleSize = baseline.analyzers.bundle?.totalGzipped || 0;
    const deadCodeCount =
      (baseline.analyzers.deadCode?.unusedExports || 0) +
      (baseline.analyzers.deadCode?.unusedImports || 0) +
      (baseline.analyzers.deadCode?.unusedVariables || 0);

    const estimatedReduction = Math.min(
      bundleSize * 0.2, // Max 20% reduction
      deadCodeCount * 2 + (baseline.analyzers.database?.n1Queries || 0) * 1
    );

    if (estimatedReduction > 0) {
      return `Potential ${((estimatedReduction / bundleSize) * 100).toFixed(1)}% reduction (${(estimatedReduction / 1024).toFixed(0)}KB)`;
    }

    return 'Minimal optimization opportunities detected';
  }

  /**
   * generateCorrelationRecommendations — Create prioritized recommendations
   * @private
   */
  private generateCorrelationRecommendations(correlations: BundleCorrelation[]): string[] {
    const recommendations: string[] = [];

    // Prioritize by impact
    const highImpact = correlations.filter((c) => c.estimatedImpact === 'HIGH');
    const mediumImpact = correlations.filter((c) => c.estimatedImpact === 'MEDIUM');

    highImpact.forEach((corr) => {
      recommendations.push(`🔴 CRITICAL: ${corr.suggestedFix}`);
    });

    mediumImpact.forEach((corr) => {
      recommendations.push(`🟡 IMPORTANT: ${corr.suggestedFix}`);
    });

    if (recommendations.length === 0) {
      recommendations.push('✅ No significant correlations found - bundle looks optimized');
    }

    return recommendations;
  }
}

/**
 * Factory function for creating BundleCorrelator
 */
export function createBundleCorrelator(): BundleCorrelatorImpl {
  return new BundleCorrelatorImpl();
}
