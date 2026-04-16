/**
 * Unit tests for React Pattern Detector
 */

import { detectReactPatterns } from '../../src/detectors/react-patterns';
import { parseFile } from '../../src/analyzer/ast-parser';

describe('React Pattern Detector', () => {
  it('should detect inline arrow functions without useCallback', () => {
    const code = `
      export const MyComponent = () => {
        const handleClick = () => {
          console.log('clicked');
        };
        return <button onClick={handleClick} />;
      };
    `;

    const parsed = parseFile('test.tsx', code);
    const issues = detectReactPatterns('test.tsx', code, parsed.ast!);

    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]!.severity).toBe('MEDIUM');
    expect(issues[0]!.type).toBe('excess_rerender');
    expect(issues[0]!.recommendation).toContain('useCallback');
  });

  it('should skip functions wrapped with useCallback', () => {
    const code = `
      const handleClick = useCallback(() => {
        console.log('clicked');
      }, []);
    `;

    const parsed = parseFile('test.tsx', code);
    const issues = detectReactPatterns('test.tsx', code, parsed.ast!);

    // Should not flag this since it uses useCallback
    expect(issues.length).toBe(0);
  });

  it('should detect components exported without React.memo', () => {
    const code = `
      export const MyComponent = () => {
        return <div>Hello</div>;
      };
    `;

    const parsed = parseFile('test.tsx', code);
    const issues = detectReactPatterns('test.tsx', code, parsed.ast!);

    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]!.message).toContain('not wrapped with React.memo');
  });

  it('should skip components wrapped with React.memo', () => {
    const code = `
      export const MyComponent = React.memo(() => {
        return <div>Hello</div>;
      });
    `;

    const parsed = parseFile('test.tsx', code);
    const issues = detectReactPatterns('test.tsx', code, parsed.ast!);

    // Should be skipped due to memo
    const memoIssues = issues.filter((i) => i.message.includes('React.memo'));
    expect(memoIssues.length).toBe(0);
  });

  it('should not flag non-component exports', () => {
    const code = `
      export const COLORS = {
        primary: '#000',
      };
    `;

    const parsed = parseFile('test.ts', code);
    const issues = detectReactPatterns('test.ts', code, parsed.ast!);

    expect(issues.length).toBe(0);
  });
});
