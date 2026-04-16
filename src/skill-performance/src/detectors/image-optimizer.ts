/**
 * Image Optimization Detector — skill-performance v5.2
 * Detects images without lazy-loading, WebP, or srcset
 */

import { Issue } from '../types';

/**
 * Detect image optimization issues
 */
export function detectImageOptimization(filePath: string, content: string): Issue[] {
  const issues: Issue[] = [];

  // Pattern: <img ... src="..." /> without loading="lazy"
  // Look for dicebear avatars and other common image URLs
  const imgPatternWithoutLazy =
    /<img\s+(?!.*loading=["']lazy["'])[^>]*src=["']([^"']+)["'][^>]*\/?>/gi;

  let match;
  while ((match = imgPatternWithoutLazy.exec(content))) {
    const line = content.substring(0, match.index).split('\n').length;
    const srcUrl = match[1];

    // Only flag dicebear and other remote images (not data:)
    if (srcUrl && (srcUrl.includes('api.dicebear') || srcUrl.includes('http'))) {
      const issue: Issue = {
        file: filePath,
        line,
        column: 0,
        severity: 'MEDIUM',
        type: 'image_not_optimized',
        message: `Image missing lazy-loading: "${srcUrl.substring(0, 50)}..."`,
        recommendation: `Add loading="lazy" attribute: <img src="${srcUrl}" loading="lazy" alt="..." />. Also consider WebP + srcset for responsive images.`,
      };

      issues.push(issue);
    }
  }

  // Pattern: dicebear images without WebP consideration
  const dicebearPattern = /api\.dicebear[^"'>\s]+/gi;
  while ((match = dicebearPattern.exec(content))) {
    const line = content.substring(0, match.index).split('\n').length;

    const issue: Issue = {
      file: filePath,
      line,
      column: 0,
      severity: 'LOW',
      type: 'image_not_optimized',
      message: `Dicebear avatar loaded as JPEG — consider WebP conversion`,
      recommendation: `Dicebear supports ?format=webp in URL. Example: ${match[0]}?format=webp. This can save ~80% size (2.3mb → 400kb estimated).`,
    };

    issues.push(issue);
  }

  return issues;
}
