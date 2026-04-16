/**
 * skill-performance v5.2 — Arena Truco Baseline Capture
 * @summary Captures performance baseline for Arena Truco Premium project
 * @law SEC-07: Generic error messages (no stack traces)
 */

import { createLighthouseAnalyzer } from './lighthouse';
import { createBundleAnalyzer } from './bundle';
import { createDatabaseAnalyzer } from './database';
import { createDeadCodeAnalyzer } from './dead-code';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Arena Truco Baseline Report
 */
export interface ArenaBaselineReport {
  projectName: string;
  timestamp: string;
  phase: 'baseline' | 'optimization' | 'final';
  analyzers: {
    lighthouse?: {
      scores?: any;
      metrics?: any;
    };
    bundle?: {
      totalSize?: number;
      totalGzipped?: number;
      chunks?: number;
      issues?: number;
    };
    database?: {
      n1Queries?: number;
      batchOpportunities?: number;
      ormHints?: number;
    };
    deadCode?: {
      unusedExports?: number;
      unusedImports?: number;
      unusedVariables?: number;
    };
  };
  summary: {
    totalIssues?: number;
    highPriority?: number;
    mediumPriority?: number;
    lowPriority?: number;
  };
  recommendations: string[];
}

/**
 * ArenaBaselineImpl
 * @description Captures performance baseline for Arena Truco
 */
export class ArenaBaselineImpl {
  /**
   * captureBaseline — Main entry point
   */
  async captureBaseline(projectPath: string): Promise<ArenaBaselineReport> {
    const report: ArenaBaselineReport = {
      projectName: 'Arena Truco Premium',
      timestamp: new Date().toISOString(),
      phase: 'baseline',
      analyzers: {},
      summary: {
        totalIssues: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,
      },
      recommendations: [],
    };

    // Capture Lighthouse baseline
    try {
      const lighthouseAnalyzer = createLighthouseAnalyzer();
      const lighthouseResult = await lighthouseAnalyzer.analyze(projectPath);
      report.analyzers.lighthouse = {
        scores: lighthouseResult.scores,
        metrics: lighthouseResult.metrics,
      };
    } catch (error) {
      // Skip if Lighthouse fails
    }

    // Capture Bundle baseline
    try {
      const bundleAnalyzer = createBundleAnalyzer();
      const bundleAnalysis = bundleAnalyzer.analyze(projectPath);
      const bundleIssues = bundleAnalyzer.analyzeAsIssues(projectPath, 'arena-truco');

      report.analyzers.bundle = {
        totalSize: bundleAnalysis.totalSize,
        totalGzipped: bundleAnalysis.totalGzipped,
        chunks: bundleAnalysis.chunks?.length || 0,
        issues: bundleIssues.length,
      };

      report.summary.highPriority! += bundleIssues.filter((i) => i.severity === 'HIGH').length;
      report.summary.mediumPriority! += bundleIssues.filter((i) => i.severity === 'MEDIUM').length;
      report.summary.lowPriority! += bundleIssues.filter((i) => i.severity === 'LOW').length;
      report.summary.totalIssues! += bundleIssues.length;
    } catch (error) {
      // Skip if Bundle analysis fails
    }

    // Capture Database baseline
    try {
      const databaseAnalyzer = createDatabaseAnalyzer();
      const sourceFiles = this.findSourceFiles(projectPath);
      let n1Count = 0,
        batchCount = 0,
        ormCount = 0;

      for (const file of sourceFiles) {
        try {
          const content = fs.readFileSync(file, 'utf-8');
          const issues = databaseAnalyzer.analyze(content, file);

          n1Count += issues.filter((i) => i.message?.includes('N+1')).length;
          batchCount += issues.filter((i) => i.message?.includes('Promise.all')).length;
          ormCount += issues.filter((i) => i.ormType).length;
        } catch (error) {
          // Skip files that can't be read
        }
      }

      report.analyzers.database = {
        n1Queries: n1Count,
        batchOpportunities: batchCount,
        ormHints: ormCount,
      };

      report.summary.totalIssues! += n1Count + batchCount + ormCount;
    } catch (error) {
      // Skip if Database analysis fails
    }

    // Capture Dead Code baseline
    try {
      const deadCodeAnalyzer = createDeadCodeAnalyzer();
      const sourceFiles = this.findSourceFiles(projectPath);
      let exportCount = 0,
        importCount = 0,
        varCount = 0;

      for (const file of sourceFiles) {
        try {
          const issues = deadCodeAnalyzer.analyze(file);

          exportCount += issues.filter((i) => i.declarationType === 'export').length;
          importCount += issues.filter((i) => i.declarationType === 'import').length;
          varCount += issues.filter((i) => i.declarationType === 'variable').length;
        } catch (error) {
          // Skip files that can't be analyzed
        }
      }

      report.analyzers.deadCode = {
        unusedExports: exportCount,
        unusedImports: importCount,
        unusedVariables: varCount,
      };

      report.summary.lowPriority! += exportCount + importCount + varCount;
      report.summary.totalIssues! += exportCount + importCount + varCount;
    } catch (error) {
      // Skip if Dead Code analysis fails
    }

    // Generate recommendations
    report.recommendations = this.generateRecommendations(report);

    return report;
  }

  /**
   * generateRecommendations — Create actionable recommendations
   * @private
   */
  private generateRecommendations(report: ArenaBaselineReport): string[] {
    const recommendations: string[] = [];

    // Lighthouse recommendations
    if (report.analyzers.lighthouse?.scores) {
      const perfScore = report.analyzers.lighthouse.scores.performance;
      if (perfScore < 90) {
        recommendations.push(`📊 Performance score is ${perfScore}/100 - target: 90+ via bundle optimization and code splitting`);
      }
    }

    // Bundle recommendations
    if (report.analyzers.bundle) {
      if ((report.analyzers.bundle.totalGzipped || 0) > 500 * 1024) {
        recommendations.push('📦 Bundle is >500KB gzipped - implement code splitting or lazy loading');
      }
      if ((report.analyzers.bundle.issues || 0) > 0) {
        recommendations.push(`🔍 Found ${report.analyzers.bundle.issues} bundle optimization opportunities`);
      }
    }

    // Database recommendations
    if (report.analyzers.database) {
      if ((report.analyzers.database.n1Queries || 0) > 0) {
        recommendations.push(
          `🗄️  Detected ${report.analyzers.database.n1Queries} N+1 query patterns - use eager loading or batch operations`
        );
      }
      if ((report.analyzers.database.ormHints || 0) > 0) {
        recommendations.push(`🔗 ${report.analyzers.database.ormHints} ORM hints: add .include()/.relations() for eager loading`);
      }
    }

    // Dead Code recommendations
    if (report.analyzers.deadCode) {
      const totalDead = (report.analyzers.deadCode.unusedExports || 0) +
        (report.analyzers.deadCode.unusedImports || 0) +
        (report.analyzers.deadCode.unusedVariables || 0);

      if (totalDead > 0) {
        recommendations.push(`💀 Found ${totalDead} dead code items - remove unused exports/imports to reduce bundle`);
      }
    }

    // Overall recommendation
    if ((report.summary.highPriority || 0) > 0) {
      recommendations.push(`⚠️  ${report.summary.highPriority} HIGH priority issues detected - prioritize these for optimization`);
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Project looking good! Continue monitoring performance metrics.');
    }

    return recommendations;
  }

  /**
   * findSourceFiles — Find all source files
   * @private
   */
  private findSourceFiles(projectPath: string): string[] {
    const files: string[] = [];

    function walk(dir: string) {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          // Skip common exclusions
          if (
            entry.name === 'node_modules' ||
            entry.name === '.next' ||
            entry.name === 'dist' ||
            entry.name === 'build' ||
            entry.name.startsWith('.')
          ) {
            continue;
          }

          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            walk(fullPath);
          } else if (entry.isFile() && /\.(ts|js|tsx|jsx)$/.test(entry.name)) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Silently skip directories that can't be read
      }
    }

    walk(projectPath);
    return files;
  }
}

/**
 * Factory function for creating ArenaBaseline
 */
export function createArenaBaseline(): ArenaBaselineImpl {
  return new ArenaBaselineImpl();
}
