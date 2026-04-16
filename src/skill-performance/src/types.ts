/**
 * skill-performance v5.2 — Type Definitions
 * Core interfaces for performance analysis
 */

export type Severity = 'HIGH' | 'MEDIUM' | 'LOW';
export type DetectorType =
  | 'sequential_animation'
  | 'excess_rerender'
  | 'missing_lazy_loading'
  | 'bundle_size'
  | 'unused_dependency'
  | 'n1_query'
  | 'image_not_optimized';

/**
 * Issue — A performance problem detected in code
 */
export interface Issue {
  file: string;
  line: number;
  column: number;
  severity: Severity;
  type: DetectorType;
  message: string;
  context?: string; // Code snippet for context
  recommendation: string; // Actionable fix (arquivo:linha + código específico)
}

/**
 * AnalysisResult — Output of analyzer
 */
export interface AnalysisResult {
  timestamp: string; // ISO 8601
  projectPath: string;
  issues: Issue[];
  summary: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };
}

/**
 * Recommendation — Specialized recommendation from board members
 */
export interface Recommendation {
  severity: Severity;
  specialist: string; // 'React Specialist', 'Database Engineer', etc.
  issue: string; // What the problem is
  fix: string; // SPECIFIC: arquivo:linha + código
  estimatedImpact?: string; // 'LCP -500ms', 'bundle -50kb'
  confidence: number; // 0.0 - 1.0
}

/**
 * AnalyzerEngine — Main entry point
 */
export interface AnalyzerEngine {
  analyze(projectRoot: string): Promise<AnalysisResult>;
}

/**
 * CLIOptions — Command-line arguments
 */
export interface CLIOptions {
  analyzeArchitecture?: boolean;
  lighthouse?: boolean;
  monitor?: boolean;
  project?: string;
  verbose?: boolean;
}

/**
 * Config for analysis
 */
export interface AnalysisConfig {
  projectRoot: string;
  excludePatterns?: string[]; // Patterns to ignore (node_modules, etc.)
  maxFilesScanned?: number;
  timeout?: number; // milliseconds
}

/**
 * LighthouseResult — Output from Lighthouse dynamic analysis
 * @summary Scores and metrics from headless Chrome browser automation
 */
export interface LighthouseResult {
  timestamp: string; // ISO 8601
  url?: string; // URL analyzed (if applicable)
  scores: {
    performance: number; // 0-100
    accessibility: number; // 0-100
    bestPractices: number; // 0-100
    seo: number; // 0-100
  };
  metrics: {
    fcp?: number; // First Contentful Paint (ms)
    lcp?: number; // Largest Contentful Paint (ms)
    cls?: number; // Cumulative Layout Shift (unitless)
    fid?: number; // First Input Delay (ms)
  };
  opportunities?: {
    [key: string]: {
      description: string;
      savings: number; // estimated ms saved
    };
  };
}

/**
 * Lighthouse Analyzer interface
 */
export interface LighthouseAnalyzer {
  analyze(projectPath: string): Promise<LighthouseResult>;
}
