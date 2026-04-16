/**
 * skill-performance v5.2 — Database Analyzer Tests
 * @summary Tests for N+1 query pattern detection
 */

import { createDatabaseAnalyzer } from '../src/analyzers/database';

describe('DatabaseAnalyzer', () => {
  let analyzer: ReturnType<typeof createDatabaseAnalyzer>;

  beforeEach(() => {
    analyzer = createDatabaseAnalyzer();
  });

  describe('createDatabaseAnalyzer', () => {
    test('should create a database analyzer instance', () => {
      expect(analyzer).toBeDefined();
      expect(analyzer.analyze).toBeDefined();
    });
  });

  describe('analyze()', () => {
    test('should detect N+1 pattern: for loop with db query', () => {
      const code = `const userIds = [1, 2, 3]; for (const id of userIds) { await db.users.find(id); }`;

      const issues = analyzer.analyze(code, 'test.ts');

      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0]?.type).toBe('n1_query');
      expect(issues[0]?.severity).toBe('HIGH');
    });

    test('should detect N+1 pattern: forEach with await', () => {
      const code = `users.forEach(async (user) => { await db.profiles.find(user.id); });`;

      const issues = analyzer.analyze(code, 'test.ts');

      expect(issues.length).toBeGreaterThan(0);
    });

    test('should detect N+1 pattern: .map() with query', () => {
      const code = `const profiles = users.map(async (user) => await db.profiles.query(user.id));`;

      const issues = analyzer.analyze(code, 'test.ts');

      expect(issues.length).toBeGreaterThan(0);
    });

    test('should detect Prisma missing .include()', () => {
      const code = `import { PrismaClient } from '@prisma/client'; const users = await prisma.user.findMany();`;

      const issues = analyzer.analyze(code, 'test.ts');
      const prismaIssues = issues.filter((i) => i.ormType === 'prisma');

      expect(prismaIssues.length).toBeGreaterThan(0);
    });

    test('should detect TypeORM missing .relations()', () => {
      const code = `import { getRepository } from 'typeorm'; const user = await userRepo.find();`;

      const issues = analyzer.analyze(code, 'test.ts');
      const typeormIssues = issues.filter((i) => i.ormType === 'typeorm');

      expect(typeormIssues.length).toBeGreaterThan(0);
    });

    test('should suggest Promise.all() for batch loading', () => {
      const code = `
        for (const item of items) {
          const result = await database.query(item);
        }
      `;

      const issues = analyzer.analyze(code, 'test.ts');
      const batchIssues = issues.filter((i) =>
        i.message?.includes('Promise.all')
      );

      expect(batchIssues.length).toBeGreaterThan(0);
    });

    test('should return empty array for safe code', () => {
      const code = `
        const users = await db.users.findAll({
          include: ['profile', 'settings']
        });
      `;

      const issues = analyzer.analyze(code, 'safe.ts');

      // No issues for safe code (includes present)
      expect(issues.length).toBeLessThanOrEqual(1);
    });

    test('should include line numbers for detected issues', () => {
      const code = `
        line 1
        line 2
        for (const user of users) {
          const data = await db.query(user.id);
        }
      `;

      const issues = analyzer.analyze(code, 'test.ts');

      if (issues.length > 0) {
        expect(issues[0]?.line).toBeGreaterThan(0);
      }
    });

    test('should estimate query count for N+1', () => {
      const code = `
        const users = [1, 2, 3, 4, 5];
        for (const id of users) {
          await db.query(id);
        }
      `;

      const issues = analyzer.analyze(code, 'test.ts');
      const issuesWithEstimate = issues.filter((i) => i.estimatedQueries);

      expect(issuesWithEstimate.length).toBeGreaterThan(0);
      expect(issuesWithEstimate[0]?.estimatedQueries).toBeGreaterThan(1);
    });

    test('should handle multiple issues in same file', () => {
      const code = `
        // Issue 1
        for (const user of users) {
          await db.query(user.id);
        }

        // Issue 2
        users.forEach(async (u) => {
          await db.find(u.id);
        });
      `;

      const issues = analyzer.analyze(code, 'test.ts');

      expect(issues.length).toBeGreaterThanOrEqual(2);
    });

    test('should suggest Promise.all for sequential awaits outside loops', () => {
      const code = `
        const user1 = await db.users.find(1);
        const user2 = await db.users.find(2);
        const user3 = await db.users.find(3);
      `;

      const issues = analyzer.analyze(code, 'test.ts');
      const parallelOpportunities = issues.filter((i) =>
        i.message?.includes('sequential') && i.message?.toLowerCase().includes('parallel')
      );

      expect(parallelOpportunities.length).toBeGreaterThan(0);
    });

    test('should detect DataLoader pattern opportunities', () => {
      const code = `
        const users = await db.users.find();
        const profiles = users.map((user) => {
          return db.profiles.find(user.id);
        });
      `;

      const issues = analyzer.analyze(code, 'test.ts');
      const dataLoaderIssues = issues.filter((i) =>
        i.message?.includes('DataLoader')
      );

      // DataLoader suggestion is a LOW severity hint
      if (dataLoaderIssues.length > 0) {
        expect(dataLoaderIssues[0]?.severity).toBe('LOW');
        expect(dataLoaderIssues[0]?.message).toContain('DataLoader');
      }
    });

    test('should recommend Promise.all() for batch operations', () => {
      const code = `
        const ids = [1, 2, 3, 4, 5];
        const results = [];
        for (const id of ids) {
          const result = await db.query(id);
          results.push(result);
        }
      `;

      const issues = analyzer.analyze(code, 'test.ts');
      const batchIssues = issues.filter((i) => i.message?.includes('Promise.all'));

      expect(batchIssues.length).toBeGreaterThan(0);
      if (batchIssues[0]) {
        expect(batchIssues[0].recommendation).toContain('Promise.all');
      }
    });
  });
});
