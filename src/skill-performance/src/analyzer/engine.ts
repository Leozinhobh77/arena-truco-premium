/**
 * Analyzer Engine — skill-performance v5.2
 * Main entry point for static performance analysis
 */

import { AnalysisResult, Issue, AnalyzerEngine, AnalysisConfig } from '../types';
import { scanFiles, readFile } from './file-scanner';
import { parseFile, traverseAST, getNodeLocation } from './ast-parser';
import { detectSequentialAnimations } from '../detectors/sequential-animation';
import { detectReactPatterns } from '../detectors/react-patterns';
import { detectImageOptimization } from '../detectors/image-optimizer';

/**
 * AnalyzerEngineImpl — Main analyzer implementation
 */
export class AnalyzerEngineImpl implements AnalyzerEngine {
  /**
   * Run full analysis on project
   */
  async analyze(projectRoot: string): Promise<AnalysisResult> {
    const config: AnalysisConfig = {
      projectRoot,
      excludePatterns: undefined,
      maxFilesScanned: undefined,
      timeout: 30000, // 30 seconds max
    };

    const startTime = Date.now();
    const issues: Issue[] = [];

    try {
      // Scan all files
      const files = scanFiles(config.projectRoot);

      if (files.length === 0) {
        console.warn(`⚠️  No TypeScript/JavaScript files found in ${projectRoot}`);
      }

      // Analyze each file
      for (const filePath of files) {
        // Check timeout
        if (Date.now() - startTime > (config.timeout || 30000)) {
          console.warn(`⚠️  Analysis timeout (>30s) — stopping scan`);
          break;
        }

        const content = readFile(filePath);
        if (!content) continue;

        // Parse file
        const parsed = parseFile(filePath, content);
        if (parsed.error || !parsed.ast) {
          // Silently skip unparseable files (binary, encoding issues, etc.)
          continue;
        }

        // Run detectors
        const fileIssues: Issue[] = [];

        // Detector 1: Sequential animations
        const sequentialIssues = detectSequentialAnimations(filePath, content, parsed.ast);
        fileIssues.push(...sequentialIssues);

        // Detector 2: React patterns
        const reactIssues = detectReactPatterns(filePath, content, parsed.ast);
        fileIssues.push(...reactIssues);

        // Detector 3: Image optimization
        const imageIssues = detectImageOptimization(filePath, content);
        fileIssues.push(...imageIssues);

        issues.push(...fileIssues);
      }

      // Calculate summary
      const summary = {
        total: issues.length,
        high: issues.filter((i) => i.severity === 'HIGH').length,
        medium: issues.filter((i) => i.severity === 'MEDIUM').length,
        low: issues.filter((i) => i.severity === 'LOW').length,
      };

      const result: AnalysisResult = {
        timestamp: new Date().toISOString(),
        projectPath: config.projectRoot,
        issues,
        summary,
      };

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Analysis failed: ${errorMessage}`);
    }
  }
}
