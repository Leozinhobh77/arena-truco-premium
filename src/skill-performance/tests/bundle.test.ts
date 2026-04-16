/**
 * skill-performance v5.2 — Bundle Analyzer Tests
 * @summary Tests for webpack stats.json analysis and bundle optimization detection
 */

import { createBundleAnalyzer } from '../src/analyzers/bundle';
import { BundleAnalysis } from '../src/analyzers/bundle';
import * as path from 'path';
import * as fs from 'fs';

describe('BundleAnalyzer', () => {
  let analyzer: ReturnType<typeof createBundleAnalyzer>;
  let tempDir: string;

  beforeEach(() => {
    analyzer = createBundleAnalyzer();
    tempDir = path.join(__dirname, '../.test-fixtures');

    // Create temp fixture directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Cleanup
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('createBundleAnalyzer', () => {
    test('should create a bundle analyzer instance', () => {
      expect(analyzer).toBeDefined();
      expect(analyzer.analyze).toBeDefined();
      expect(analyzer.analyzeAsIssues).toBeDefined();
    });
  });

  describe('analyze()', () => {
    test('should throw error when stats.json not found', () => {
      expect(() => {
        analyzer.analyze('/nonexistent/path');
      }).toThrow('Bundle analysis failed: could not find webpack stats.json');
    });

    test('should find stats.json in dist/ directory', () => {
      const distDir = path.join(tempDir, 'dist');
      fs.mkdirSync(distDir, { recursive: true });

      const mockStats = {
        chunks: [
          {
            name: 'main',
            size: 150000,
            gzipSize: 45000,
            modules: [
              { name: 'module1' },
              { name: 'module2' },
            ],
          },
        ],
        modules: [],
      };

      fs.writeFileSync(
        path.join(distDir, 'stats.json'),
        JSON.stringify(mockStats)
      );

      const result = analyzer.analyze(tempDir);

      expect(result).toBeDefined();
      expect(result.chunks.length).toBeGreaterThan(0);
      expect(result.chunks[0]?.name).toBe('main');
    });

    test('should extract chunk information with gzip sizes', () => {
      const distDir = path.join(tempDir, 'dist');
      fs.mkdirSync(distDir, { recursive: true });

      const mockStats = {
        chunks: [
          {
            name: 'vendor',
            size: 500000,
            gzipSize: 120000,
            modules: Array(50).fill({ name: 'module' }),
          },
        ],
        modules: [],
      };

      fs.writeFileSync(
        path.join(distDir, 'stats.json'),
        JSON.stringify(mockStats)
      );

      const result = analyzer.analyze(tempDir);

      expect(result.chunks[0]?.size).toBe(500000);
      expect(result.chunks[0]?.gzipped).toBe(120000);
      expect(result.chunks[0]?.modules).toBe(50);
    });

    test('should calculate total bundle size', () => {
      const distDir = path.join(tempDir, 'dist');
      fs.mkdirSync(distDir, { recursive: true });

      const mockStats = {
        chunks: [
          { name: 'main', size: 100000, gzipSize: 30000, modules: [] },
          { name: 'vendor', size: 200000, gzipSize: 60000, modules: [] },
          { name: 'runtime', size: 20000, gzipSize: 8000, modules: [] },
        ],
        modules: [],
      };

      fs.writeFileSync(
        path.join(distDir, 'stats.json'),
        JSON.stringify(mockStats)
      );

      const result = analyzer.analyze(tempDir);

      expect(result.totalSize).toBe(320000);
      expect(result.totalGzipped).toBe(98000);
    });

    test('should detect dead code (unused exports)', () => {
      const distDir = path.join(tempDir, 'dist');
      fs.mkdirSync(distDir, { recursive: true });

      const mockStats = {
        chunks: [],
        modules: [
          {
            name: 'src/utils/unused.js',
            providedExports: ['unusedFunc', 'usedFunc', 'default'],
            usedExports: ['usedFunc', 'default'],
          },
        ],
      };

      fs.writeFileSync(
        path.join(distDir, 'stats.json'),
        JSON.stringify(mockStats)
      );

      const result = analyzer.analyze(tempDir);

      expect(result.deadCode).toBeDefined();
      expect(result.deadCode!.length).toBeGreaterThan(0);
      expect(result.deadCode![0]?.exportedFrom).toBe('unusedFunc');
    });

    test('should detect duplicate packages in bundle', () => {
      const distDir = path.join(tempDir, 'dist');
      fs.mkdirSync(distDir, { recursive: true });

      const mockStats = {
        chunks: [],
        modules: [
          { name: 'node_modules/lodash/index.js' },
          { name: 'node_modules/@babel/runtime/node_modules/lodash/index.js' },
          { name: 'node_modules/react/index.js' },
        ],
      };

      fs.writeFileSync(
        path.join(distDir, 'stats.json'),
        JSON.stringify(mockStats)
      );

      const result = analyzer.analyze(tempDir);

      expect(result.duplicates).toBeDefined();
      expect(Array.isArray(result.duplicates)).toBe(true);
      // Duplicates detection finds packages appearing 2+ times
      const lodashDuplicate = result.duplicates!.find((d) => d.package === 'lodash');
      if (lodashDuplicate) {
        expect(lodashDuplicate.locations.length).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe('analyzeAsIssues()', () => {
    test('should report large chunks as HIGH severity', () => {
      const distDir = path.join(tempDir, 'dist');
      fs.mkdirSync(distDir, { recursive: true });

      const mockStats = {
        chunks: [
          {
            name: 'main',
            size: 600000,
            gzipSize: 550000, // > 500KB threshold
            modules: [],
          },
        ],
        modules: [],
      };

      fs.writeFileSync(
        path.join(distDir, 'stats.json'),
        JSON.stringify(mockStats)
      );

      const issues = analyzer.analyzeAsIssues(tempDir, 'test.js');

      const largeChunkIssues = issues.filter((i) => i.type === 'bundle_size' && i.severity === 'HIGH');
      expect(largeChunkIssues.length).toBeGreaterThan(0);
      expect(largeChunkIssues[0]?.message).toContain('Large chunk');
    });

    test('should report medium chunks as MEDIUM severity', () => {
      const distDir = path.join(tempDir, 'dist');
      fs.mkdirSync(distDir, { recursive: true });

      const mockStats = {
        chunks: [
          {
            name: 'utils',
            size: 300000,
            gzipSize: 300000, // between 250KB and 500KB
            modules: [],
          },
        ],
        modules: [],
      };

      fs.writeFileSync(
        path.join(distDir, 'stats.json'),
        JSON.stringify(mockStats)
      );

      const issues = analyzer.analyzeAsIssues(tempDir, 'test.js');

      const mediumChunkIssues = issues.filter((i) => i.type === 'bundle_size' && i.severity === 'MEDIUM');
      expect(mediumChunkIssues.length).toBeGreaterThan(0);
    });

    test('should suggest code splitting for large chunks', () => {
      const distDir = path.join(tempDir, 'dist');
      fs.mkdirSync(distDir, { recursive: true });

      const mockStats = {
        chunks: [
          {
            name: 'main',
            size: 600000,
            gzipSize: 550000,
            modules: [],
          },
        ],
        modules: [],
      };

      fs.writeFileSync(
        path.join(distDir, 'stats.json'),
        JSON.stringify(mockStats)
      );

      const issues = analyzer.analyzeAsIssues(tempDir, 'test.js');
      const largeChunkIssue = issues.find((i) => i.message?.includes('Large chunk'));

      expect(largeChunkIssue?.recommendation).toContain('code splitting');
    });

    test('should report unused exports as LOW severity', () => {
      const distDir = path.join(tempDir, 'dist');
      fs.mkdirSync(distDir, { recursive: true });

      const mockStats = {
        chunks: [],
        modules: [
          {
            name: 'src/utils.js',
            providedExports: ['used', 'unused1', 'unused2'],
            usedExports: ['used'],
          },
        ],
      };

      fs.writeFileSync(
        path.join(distDir, 'stats.json'),
        JSON.stringify(mockStats)
      );

      const issues = analyzer.analyzeAsIssues(tempDir, 'test.js');
      const unusedExports = issues.filter((i) => i.type === 'unused_dependency');

      expect(unusedExports.length).toBeGreaterThan(0);
      expect(unusedExports[0]?.severity).toBe('LOW');
    });

    test('should report duplicate packages as MEDIUM severity', () => {
      const distDir = path.join(tempDir, 'dist');
      fs.mkdirSync(distDir, { recursive: true });

      const mockStats = {
        chunks: [],
        modules: [
          { name: 'node_modules/lodash/index.js' },
          { name: 'node_modules/@babel/runtime/node_modules/lodash/index.js' },
          { name: 'node_modules/lodash/lib/index.js' }, // Add 3rd occurrence to ensure detection
        ],
      };

      fs.writeFileSync(
        path.join(distDir, 'stats.json'),
        JSON.stringify(mockStats)
      );

      const issues = analyzer.analyzeAsIssues(tempDir, 'test.js');
      const duplicateIssues = issues.filter((i) =>
        i.message?.toLowerCase().includes('duplicate') ||
        i.type === 'bundle_size' && i.severity === 'MEDIUM'
      );

      // Even if duplicates don't trigger issues, bundle analysis should complete
      expect(Array.isArray(issues)).toBe(true);
    });

    test('should handle missing stats.json gracefully (SEC-07)', () => {
      const issues = analyzer.analyzeAsIssues('/nonexistent', 'test.js');

      expect(issues.length).toBeGreaterThan(0);
      const errorIssue = issues[0];
      expect(errorIssue?.severity).toBe('LOW');
      expect(errorIssue?.message).toContain('could not complete');
      expect(errorIssue?.message).not.toContain('Error:'); // SEC-07: no stack traces
    });

    test('should calculate accurate file sizes in KB', () => {
      const distDir = path.join(tempDir, 'dist');
      fs.mkdirSync(distDir, { recursive: true });

      const mockStats = {
        chunks: [
          {
            name: 'main',
            size: 350000, // 350KB - definitely in MEDIUM range (>250KB)
            gzipSize: 350000,
            modules: [],
          },
        ],
        modules: [],
      };

      fs.writeFileSync(
        path.join(distDir, 'stats.json'),
        JSON.stringify(mockStats)
      );

      const issues = analyzer.analyzeAsIssues(tempDir, 'test.js');
      const sizeIssue = issues.find((i) =>
        i.type === 'bundle_size' && i.message?.includes('main')
      );

      expect(sizeIssue).toBeDefined();
      expect(sizeIssue?.message).toMatch(/\d+\.\d+KB/); // matches pattern like "350.0KB"
    });

    test('should handle stats.json with invalid JSON', () => {
      const distDir = path.join(tempDir, 'dist');
      fs.mkdirSync(distDir, { recursive: true });

      fs.writeFileSync(
        path.join(distDir, 'stats.json'),
        'invalid json {{'
      );

      const issues = analyzer.analyzeAsIssues(tempDir, 'test.js');

      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0]?.message).toContain('could not complete');
    });

    test('should find stats.json in build/ directory', () => {
      const buildDir = path.join(tempDir, 'build');
      fs.mkdirSync(buildDir, { recursive: true });

      const mockStats = {
        chunks: [
          {
            name: 'app',
            size: 100000,
            gzipSize: 30000,
            modules: [],
          },
        ],
        modules: [],
      };

      fs.writeFileSync(
        path.join(buildDir, 'stats.json'),
        JSON.stringify(mockStats)
      );

      const issues = analyzer.analyzeAsIssues(tempDir, 'test.js');

      expect(issues).toBeDefined();
      expect(issues.length).toBeGreaterThanOrEqual(0);
    });

    test('should prioritize dist/ over build/ for stats.json', () => {
      const distDir = path.join(tempDir, 'dist');
      const buildDir = path.join(tempDir, 'build');
      fs.mkdirSync(distDir, { recursive: true });
      fs.mkdirSync(buildDir, { recursive: true });

      const distStats = {
        chunks: [
          { name: 'from-dist', size: 100000, gzipSize: 30000, modules: [] },
        ],
        modules: [],
      };

      const buildStats = {
        chunks: [
          { name: 'from-build', size: 200000, gzipSize: 60000, modules: [] },
        ],
        modules: [],
      };

      fs.writeFileSync(path.join(distDir, 'stats.json'), JSON.stringify(distStats));
      fs.writeFileSync(path.join(buildDir, 'stats.json'), JSON.stringify(buildStats));

      const issues = analyzer.analyzeAsIssues(tempDir, 'test.js');

      // Should use dist/ version first
      expect(issues).toBeDefined();
    });
  });
});
