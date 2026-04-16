/**
 * CLI Output Formatter — skill-performance v5.2
 * Formats analysis results for terminal display
 */

import { AnalysisResult, Issue, Severity } from '../types';

/**
 * Color codes for terminal output
 */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

/**
 * Colorize text based on severity
 */
function colorBySeverity(text: string, severity: Severity): string {
  switch (severity) {
    case 'HIGH':
      return `${colors.red}${text}${colors.reset}`;
    case 'MEDIUM':
      return `${colors.yellow}${text}${colors.reset}`;
    case 'LOW':
      return `${colors.blue}${text}${colors.reset}`;
  }
}

/**
 * Format a single issue for display
 */
function formatIssue(issue: Issue, index: number): string {
  const severityLabel = colorBySeverity(`[${issue.severity}]`, issue.severity);
  const location = `${issue.file}:${issue.line}:${issue.column}`;

  return `
${index}. ${severityLabel} ${issue.type}
   ${colors.dim}${location}${colors.reset}

   ${colors.bold}Issue:${colors.reset} ${issue.message}
   ${colors.bold}Fix:${colors.reset} ${issue.recommendation}
`;
}

/**
 * Format summary statistics
 */
function formatSummary(result: AnalysisResult): string {
  const { summary } = result;
  const highColor = summary.high > 0 ? colors.red : colors.green;
  const mediumColor = summary.medium > 0 ? colors.yellow : colors.green;

  return `
${colors.bold}═══════════════════════════════════════════════${colors.reset}
${colors.bold}📊 Analysis Summary${colors.reset}
${colors.bold}═══════════════════════════════════════════════${colors.reset}

Total Issues: ${summary.total}
${highColor}  HIGH:${colors.reset}   ${summary.high}
${mediumColor}  MEDIUM:${colors.reset} ${summary.medium}
${colors.blue}  LOW:${colors.reset}    ${summary.low}

${colors.bold}═══════════════════════════════════════════════${colors.reset}
`;
}

/**
 * Format all issues for display
 */
function formatIssues(issues: Issue[]): string {
  if (issues.length === 0) {
    return `\n${colors.green}✅ No issues found!${colors.reset}\n`;
  }

  // Sort by severity
  const sorted = [...issues].sort((a, b) => {
    const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const formatted = sorted.map((issue, index) => formatIssue(issue, index + 1));
  return `\n${colors.bold}🔍 Issues Found:${colors.reset}${formatted.join('\n')}`;
}

/**
 * Format complete analysis output
 */
export function formatAnalysisOutput(result: AnalysisResult, verbose: boolean = false): string {
  let output = formatSummary(result);
  output += formatIssues(result.issues);

  if (verbose && result.issues.length > 0) {
    output += `\n${colors.dim}Verbose mode: showing all recommendations above${colors.reset}\n`;
  }

  return output;
}

/**
 * Format and save JSON report
 */
export function formatJsonReport(result: AnalysisResult): string {
  return JSON.stringify(result, null, 2);
}
