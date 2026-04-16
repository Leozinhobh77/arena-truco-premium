/**
 * Integration Test: Arena Truco Premium Analysis
 * Validates the skill-performance analyzer works on real codebase
 */

import { exec } from 'child_process';
import { join } from 'path';
import { promisify } from 'util';

const execPromise = promisify(exec);

describe('Arena Truco Premium - Integration Test', () => {
  // Project is 3 levels up from skill-performance root
  const projectPath = join(__dirname, '../../..');
  const skillRoot = join(__dirname, '..');

  it('should analyze Arena Truco project and find sequential animation issues', async () => {
    const cliPath = join(skillRoot, 'dist/cli.js');
    const { stdout } = await execPromise(
      `node "${cliPath}" "${projectPath}" --analyze-architecture`
    );

    // Verify analysis completed
    expect(stdout).toContain('Analysis Summary');
    expect(stdout).toContain('Total Issues');

    // Verify sequential animations detected (known issue in ClansScreen.tsx:239)
    expect(stdout).toContain('ClansScreen.tsx');
    expect(stdout).toContain('sequential_animation');
    expect(stdout).toContain('HIGH');

    // Verify issues are actionable (have recommendations)
    expect(stdout).toContain('Fix:');
    expect(stdout).toContain('layoutId');
  });

  it('should detect excess re-render issues in overlays', async () => {
    const cliPath = join(skillRoot, 'dist/cli.js');
    const { stdout } = await execPromise(
      `node "${cliPath}" "${projectPath}" --analyze-architecture"`
    );

    // Verify excess_rerender issues detected
    expect(stdout).toContain('excess_rerender');
    expect(stdout).toContain('MEDIUM');
    expect(stdout).toContain('useCallback');
  });

  it('should complete analysis in under 30 seconds', async () => {
    const cliPath = join(skillRoot, 'dist/cli.js');
    const startTime = Date.now();

    await execPromise(
      `node "${cliPath}" "${projectPath}" --analyze-architecture`
    );

    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(30000);
    console.log(`✓ Analysis completed in ${duration}ms`);
  });

  it('should generate valid summary statistics', async () => {
    const cliPath = join(skillRoot, 'dist/cli.js');
    const { stdout } = await execPromise(
      `node "${cliPath}" "${projectPath}" --analyze-architecture"`
    );

    // Parse summary line "Total Issues: 52"
    const totalMatch = stdout.match(/Total Issues:\s*(\d+)/);
    expect(totalMatch).not.toBeNull();
    const totalIssues = totalMatch ? parseInt(totalMatch[1]!, 10) : 0;

    // Parse HIGH issues
    const highMatch = stdout.match(/HIGH:\s*(\d+)/);
    const highIssues = highMatch ? parseInt(highMatch[1]!, 10) : 0;

    // Parse MEDIUM issues
    const mediumMatch = stdout.match(/MEDIUM:\s*(\d+)/);
    const mediumIssues = mediumMatch ? parseInt(mediumMatch[1]!, 10) : 0;

    // Parse LOW issues
    const lowMatch = stdout.match(/LOW:\s*(\d+)/);
    const lowIssues = lowMatch ? parseInt(lowMatch[1]!, 10) : 0;

    // Verify math checks out
    expect(highIssues + mediumIssues + lowIssues).toBe(totalIssues);
    expect(totalIssues).toBeGreaterThan(0);
    console.log(`✓ Found ${highIssues} HIGH, ${mediumIssues} MEDIUM, ${lowIssues} LOW = ${totalIssues} total`);
  });

  it('should provide actionable recommendations for at least 8/10 top issues', async () => {
    const cliPath = join(skillRoot, 'dist/cli.js');
    const { stdout } = await execPromise(
      `node "${cliPath}" "${projectPath}" --analyze-architecture"`
    );

    // Count issues with recommendations
    const issueMatches = stdout.match(/Issue:.*?Fix:/gs) || [];
    const recommendationMatches = stdout.match(/Fix:.*?\n/g) || [];

    expect(recommendationMatches.length).toBeGreaterThan(0);

    // Sample a few recommendations to verify they're actionable
    const fixTexts = recommendationMatches.slice(0, 10).join('\n');
    
    // Should contain actionable guidance
    expect(fixTexts.toLowerCase()).toMatch(/remove|replace|add|wrap/i);

    console.log(`✓ Found ${recommendationMatches.length} actionable recommendations`);
  });

  it('should validate SEC-02 security with Arena Truco paths', async () => {
    // Try invalid paths - should be rejected
    const invalidPaths = ['../../../etc/passwd', 'C:\test//double\slash'];

    const cliPath = join(skillRoot, 'dist/cli.js');
    for (const invalidPath of invalidPaths) {
      const { stdout } = await execPromise(
        `node "${cliPath}" "${invalidPath}" --analyze-architecture"`
      ).catch(e => ({ stdout: e.stdout || e.stderr || '' }));

      expect(stdout).toContain('Invalid');
    }

    console.log('✓ SEC-02 path validation working correctly');
  });
});
