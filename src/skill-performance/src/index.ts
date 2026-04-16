/**
 * skill-performance v5.2 — Main Export
 * Performance Auditor & Optimization Architect for Forge v5.2
 */

// Core
export { AnalyzerEngineImpl } from './analyzer/engine';
export * from './types';

// Detectors
export { detectSequentialAnimations } from './detectors/sequential-animation';
export { detectReactPatterns } from './detectors/react-patterns';
export { detectImageOptimization } from './detectors/image-optimizer';

// Formatters
export { formatAnalysisOutput, formatJsonReport } from './formatters/cli-output';

// Utilities
export { scanFiles, readFile, getLineAndColumn, getCodeContext } from './analyzer/file-scanner';
export { parseFile, traverseAST, getNodeLocation } from './analyzer/ast-parser';

// CLI
export { parseArgs, validateProjectPath, main } from './cli';

// Version
export const VERSION = '1.0.0';
export const FORGE_VERSION = '5.2';
