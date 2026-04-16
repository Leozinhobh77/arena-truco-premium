/**
 * CLI Parser — skill-performance v5.2
 * Entry point for command-line interface
 */

import { CLIOptions } from './types';
import { AnalyzerEngineImpl } from './analyzer/engine';
import { createLighthouseAnalyzer } from './analyzers/lighthouse';
import { formatAnalysisOutput } from './formatters/cli-output';
import * as path from 'path';

/**
 * Parse command-line arguments
 * Usage:
 *   skill-performance [project-path] --analyze-architecture
 *   skill-performance [project-path] --lighthouse
 *   skill-performance [project-path] --monitor
 */
function parseArgs(argv: string[]): CLIOptions & { projectPath?: string } {
  const options: CLIOptions & { projectPath?: string } = {
    analyzeArchitecture: false,
    lighthouse: false,
    monitor: false,
    verbose: false,
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];

    if (!arg) continue;

    if (arg === '--analyze-architecture') {
      options.analyzeArchitecture = true;
    } else if (arg === '--lighthouse') {
      options.lighthouse = true;
    } else if (arg === '--monitor') {
      options.monitor = true;
    } else if (arg === '--verbose') {
      options.verbose = true;
    } else if (!arg.startsWith('--')) {
      // Project path (first non-flag argument)
      options.projectPath = arg;
    }
  }

  return options;
}

/**
 * Validate project path (SEC-02: input validation)
 */
function validateProjectPath(projectPath: string | undefined): string {
  if (!projectPath) {
    throw new Error('Project path required. Usage: skill-performance [project-path] --analyze-architecture');
  }

  // Prevent directory traversal attacks (SEC-02)
  if (projectPath.includes('..') || projectPath.includes('//')) {
    throw new Error('Invalid project path: directory traversal not allowed');
  }

  return path.resolve(projectPath);
}

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  try {
    const options = parseArgs(process.argv);
    const projectPath = validateProjectPath(options.projectPath);

    // Default to --analyze-architecture if no option specified
    if (!options.analyzeArchitecture && !options.lighthouse && !options.monitor) {
      options.analyzeArchitecture = true;
    }

    if (options.analyzeArchitecture) {
      await handleAnalyzeArchitecture(projectPath, options.verbose || false);
    } else if (options.lighthouse) {
      await handleLighthouseAnalysis(projectPath, options.verbose || false);
    } else if (options.monitor) {
      console.log('🚧 Monitoring — coming in Sprint 4');
    }
  } catch (error) {
    // SEC-07: Generic error messages (no stack trace to user)
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Error: ${message}`);
    process.exit(1);
  }
}

/**
 * Handle --analyze-architecture command
 */
async function handleAnalyzeArchitecture(projectPath: string, verbose: boolean): Promise<void> {
  console.log(`\n🔍 Analyzing project: ${projectPath}`);
  console.log('📡 Running static analysis...\n');

  const analyzer = new AnalyzerEngineImpl();
  const startTime = Date.now();

  const result = await analyzer.analyze(projectPath);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(formatAnalysisOutput(result, verbose));
  console.log(`\n⏱️  Analysis completed in ${elapsed}s`);
  console.log(`📁 Report saved: .skill-memory/performance-analysis-${Date.now()}.json`);
}

/**
 * Handle --lighthouse command
 * Dynamic performance analysis using Lighthouse CI
 */
async function handleLighthouseAnalysis(projectPath: string, verbose: boolean): Promise<void> {
  console.log(`\n💡 Lighthouse Performance Analysis`);
  console.log(`📁 Project: ${projectPath}`);
  console.log('🌐 Running headless Chrome browser automation...\n');

  const analyzer = createLighthouseAnalyzer();
  const startTime = Date.now();

  const result = await analyzer.analyze(projectPath);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  // Format Lighthouse output
  console.log('═══════════════════════════════════════════════════');
  console.log('📊 LIGHTHOUSE SCORES');
  console.log('═══════════════════════════════════════════════════');

  const scores = [
    { name: 'Performance', score: result.scores.performance },
    { name: 'Accessibility', score: result.scores.accessibility },
    { name: 'Best Practices', score: result.scores.bestPractices },
    { name: 'SEO', score: result.scores.seo },
  ];

  scores.forEach(({ name, score }) => {
    const color = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
    console.log(`${color} ${name.padEnd(18)} ${score.toString().padStart(3)}/100`);
  });

  if (verbose && Object.keys(result.metrics).length > 0) {
    console.log('\n═══════════════════════════════════════════════════');
    console.log('📈 CORE WEB VITALS');
    console.log('═══════════════════════════════════════════════════');

    const metrics = [
      { name: 'FCP (First Contentful Paint)', value: result.metrics.fcp, unit: 'ms' },
      { name: 'LCP (Largest Contentful Paint)', value: result.metrics.lcp, unit: 'ms' },
      { name: 'CLS (Cumulative Layout Shift)', value: result.metrics.cls, unit: '' },
      { name: 'FID (First Input Delay)', value: result.metrics.fid, unit: 'ms' },
    ];

    metrics.forEach(({ name, value, unit }) => {
      if (value !== undefined) {
        console.log(`  ${name}: ${value.toFixed(1)}${unit}`);
      }
    });
  }

  console.log(`\n⏱️  Analysis completed in ${elapsed}s`);
  console.log(`📁 Report timestamp: ${result.timestamp}`);
}

// Run if this is the main module
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { parseArgs, validateProjectPath, main };
