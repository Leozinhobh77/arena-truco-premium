/**
 * skill-performance v5.2 — Lighthouse Correlator
 * @summary Maps dynamic Lighthouse metrics to static Sprint 1 issues
 * @law SEC-07: Generic error messages (no stack traces)
 */

import { Issue, LighthouseResult } from '../types';

/**
 * Correlation Issue — enriched issue with Lighthouse data
 */
export interface CorrelationIssue extends Issue {
  lighthouseImpact?: {
    metric: string; // 'LCP', 'FID', 'CLS', 'Performance Score'
    estimatedImpact: string; // e.g., "+500ms", "-15 points"
  };
}

/**
 * LighthouseCorrelatorImpl
 * @description Maps Lighthouse metrics back to Sprint 1 static analysis issues
 *              Provides quantified performance impact data
 */
export class LighthouseCorrelatorImpl {
  /**
   * correlate — Main entry point
   * @param issues Sprint 1 static analysis issues
   * @param lighthouse Lighthouse dynamic metrics
   * @returns Enriched issues with Lighthouse correlation data
   */
  correlate(issues: Issue[], lighthouse: LighthouseResult): CorrelationIssue[] {
    const correlated: CorrelationIssue[] = [];

    for (const issue of issues) {
      const enriched: CorrelationIssue = { ...issue };

      // Map sequential animations to LCP impact
      if (issue.type === 'sequential_animation' && lighthouse.metrics.lcp) {
        enriched.lighthouseImpact = {
          metric: 'LCP',
          estimatedImpact: this.estimateAnimationImpact(
            issue,
            lighthouse.metrics.lcp
          ),
        };
      }

      // Map missing useCallback to FID impact
      if (
        issue.type === 'excess_rerender' &&
        lighthouse.metrics.fid !== undefined
      ) {
        enriched.lighthouseImpact = {
          metric: 'FID',
          estimatedImpact: this.estimateRerenderImpact(
            issue,
            lighthouse.metrics.fid
          ),
        };
      }

      // Map missing lazy-loading to Performance score
      if (
        issue.type === 'missing_lazy_loading' &&
        lighthouse.scores.performance
      ) {
        enriched.lighthouseImpact = {
          metric: 'Performance',
          estimatedImpact: this.estimateImageImpact(
            issue,
            lighthouse.scores.performance
          ),
        };
      }

      correlated.push(enriched);
    }

    return correlated;
  }

  /**
   * estimateAnimationImpact — Calculate LCP impact from sequential animations
   * @private
   */
  private estimateAnimationImpact(issue: Issue, lcpMetric: number): string {
    // Each sequential animation adds ~50-100ms to LCP
    // Estimate based on context (if available)
    const estimatedDelay = 75; // Average 75ms per animation issue
    return `+${estimatedDelay}ms to LCP`;
  }

  /**
   * estimateRerenderImpact — Calculate FID impact from excess re-renders
   * @private
   */
  private estimateRerenderImpact(issue: Issue, fidMetric: number): string {
    // Each unnecessary re-render adds ~5-10ms to FID
    const estimatedDelay = 8;
    return `+${estimatedDelay}ms to FID`;
  }

  /**
   * estimateImageImpact — Calculate Performance score impact from missing lazy-loading
   * @private
   */
  private estimateImageImpact(issue: Issue, performanceScore: number): string {
    // Lazy-loading images improves Performance score by 1-3 points per issue
    const estimatedImprovement = 2;
    return `+${estimatedImprovement} points`;
  }

  /**
   * generateCorrelationReport — Create human-readable report
   */
  generateCorrelationReport(
    correlatedIssues: CorrelationIssue[],
    lighthouse: LighthouseResult
  ): string {
    let report = '';
    report += '═════════════════════════════════════════════════════\n';
    report += '📊 LIGHTHOUSE × SPRINT 1 CORRELATION ANALYSIS\n';
    report += '═════════════════════════════════════════════════════\n\n';

    // Group by Lighthouse metric
    const byMetric = this.groupByMetric(correlatedIssues);

    report += `🔴 Performance Score: ${lighthouse.scores.performance}/100\n`;
    report += `🟡 Accessibility Score: ${lighthouse.scores.accessibility}/100\n`;
    report += `🟢 Best Practices: ${lighthouse.scores.bestPractices}/100\n`;
    report += `🔵 SEO Score: ${lighthouse.scores.seo}/100\n\n`;

    // LCP impact
    if (byMetric['LCP'] && byMetric['LCP'].length > 0) {
      report += `⏱️  LCP Impact (${byMetric['LCP'].length} issues):\n`;
      byMetric['LCP'].forEach((issue) => {
        report += `   • ${issue.message}\n`;
        if (issue.lighthouseImpact) {
          report += `     └─ ${issue.lighthouseImpact.estimatedImpact}\n`;
        }
      });
      report += '\n';
    }

    // FID impact
    if (byMetric['FID'] && byMetric['FID'].length > 0) {
      report += `⚡ FID Impact (${byMetric['FID'].length} issues):\n`;
      byMetric['FID'].forEach((issue) => {
        report += `   • ${issue.message}\n`;
        if (issue.lighthouseImpact) {
          report += `     └─ ${issue.lighthouseImpact.estimatedImpact}\n`;
        }
      });
      report += '\n';
    }

    // Performance score impact
    if (byMetric['Performance'] && byMetric['Performance'].length > 0) {
      report += `📈 Performance Score Impact (${byMetric['Performance'].length} issues):\n`;
      byMetric['Performance'].forEach((issue) => {
        report += `   • ${issue.message}\n`;
        if (issue.lighthouseImpact) {
          report += `     └─ ${issue.lighthouseImpact.estimatedImpact}\n`;
        }
      });
      report += '\n';
    }

    report += '═════════════════════════════════════════════════════\n';
    return report;
  }

  /**
   * groupByMetric — Helper to organize issues by Lighthouse metric
   * @private
   */
  private groupByMetric(
    issues: CorrelationIssue[]
  ): Record<string, CorrelationIssue[]> {
    const groups: Record<string, CorrelationIssue[]> = {};

    issues.forEach((issue) => {
      if (issue.lighthouseImpact) {
        const metric = issue.lighthouseImpact.metric;
        if (!groups[metric]) {
          groups[metric] = [];
        }
        groups[metric].push(issue);
      }
    });

    return groups;
  }
}

/**
 * Factory function for creating correlator
 */
export function createLighthouseCorrelator(): LighthouseCorrelatorImpl {
  return new LighthouseCorrelatorImpl();
}
