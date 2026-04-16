/**
 * Sequential Animation Detector — skill-performance v5.2
 * Detects animations that block LCP: delay: index * X pattern
 */

import { Issue } from '../types';
import * as t from '@babel/types';

/**
 * Detect sequential animations (delay: index * X)
 */
export function detectSequentialAnimations(
  filePath: string,
  content: string,
  ast: t.File,
): Issue[] {
  const issues: Issue[] = [];

  // Pattern: delay: index * <number>
  // or: delay: i * <number>
  // or: {delay: index * 0.04}
  const patterns = [
    /delay\s*:\s*(?:index|i)\s*\*\s*[\d.]+/gi,
    /delay\s*:\s*(?:index|i)\s*\*\s*[\w$]+/gi,
  ];

  // Find all matches
  let match;
  for (const pattern of patterns) {
    while ((match = pattern.exec(content))) {
      const line = content.substring(0, match.index).split('\n').length;
      const column = match.index - content.lastIndexOf('\n', match.index);

      const issue: Issue = {
        file: filePath,
        line,
        column,
        severity: 'HIGH',
        type: 'sequential_animation',
        message: `Sequential animation detected: "${match[0]}" causes LCP delay`,
        recommendation:
          'Remove sequential delay. Use Framer Motion layoutId or batch animations instead. Example: replace delay={index * 0.04} with whileTap={{scale: 0.97}}',
      };

      issues.push(issue);
    }
  }

  return issues;
}
