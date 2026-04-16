/**
 * Unit tests for Sequential Animation Detector
 */

import { detectSequentialAnimations } from '../../src/detectors/sequential-animation';
import { parseFile } from '../../src/analyzer/ast-parser';

describe('Sequential Animation Detector', () => {
  it('should detect sequential delay pattern with index', () => {
    const code = `
      const cards = items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.04 }}
        />
      ))
    `;

    const parsed = parseFile('test.tsx', code);
    const issues = detectSequentialAnimations('test.tsx', code, parsed.ast!);

    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]!.severity).toBe('HIGH');
    expect(issues[0]!.type).toBe('sequential_animation');
    expect(issues[0]!.recommendation).toContain('layoutId');
  });

  it('should detect sequential delay with variable i', () => {
    const code = `
      cards.map((c, i) => ({
        delay: i * 0.05,
      }))
    `;

    const parsed = parseFile('test.ts', code);
    const issues = detectSequentialAnimations('test.ts', code, parsed.ast!);

    expect(issues.length).toBeGreaterThan(0);
  });

  it('should not flag non-sequential delays', () => {
    const code = `
      <motion.div
        transition={{ delay: 0.2 }}
      />
    `;

    const parsed = parseFile('test.tsx', code);
    const issues = detectSequentialAnimations('test.tsx', code, parsed.ast!);

    expect(issues.length).toBe(0);
  });

  it('should return correct line numbers', () => {
    const code = `
      // Line 2: empty
      const items = [];
      const cards = items.map((item, index) => (
        <div transition={{ delay: index * 0.04 }} />
      ))
    `;

    const parsed = parseFile('test.tsx', code);
    const issues = detectSequentialAnimations('test.tsx', code, parsed.ast!);

    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]!.line).toBe(5); // Line 5 in this code
  });
});
