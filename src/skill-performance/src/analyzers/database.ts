/**
 * skill-performance v5.2 — Database N+1 Detector
 * @summary Detects N+1 query patterns using hybrid regex + ORM hints
 * @law SEC-07: Generic error messages (no stack traces)
 */

import { Issue } from '../types';

/**
 * Database Query Issue
 */
export interface DatabaseQueryIssue extends Issue {
  estimatedQueries?: number;
  ormType?: 'prisma' | 'typeorm' | 'sequelize' | 'unknown';
}

/**
 * DatabaseAnalyzerImpl
 * @description Detects N+1 query patterns in TypeScript/JavaScript code
 *              Uses hybrid approach: regex for quick detection + ORM hints
 */
export class DatabaseAnalyzerImpl {
  private n1Patterns = [
    // Pattern 1: for/forEach with db query (more flexible with whitespace)
    /for\s*\(\s*(?:let|const|var)\s+\w+\s+of\s+[\w.]+\s*\)\s*[\s\{]*(?:await\s+)?(?:db|this\.db|repository|this\.repository)[\w.]*\.(?:find|query|get|exec|execute|load)/gim,

    // Pattern 2: .map() with db query
    /\.map\s*\(\s*(?:async\s+)?\([^)]*\)\s*=>\s*[\s\{]*(?:await\s+)?(?:db|this\.db|repository)[\w.]*\.(?:find|query|get|exec|execute)/gim,

    // Pattern 3: items.forEach with query in loop
    /\.forEach\s*\(\s*(?:async\s+)?\([^)]*\)\s*=>\s*[\s\{]*(?:await\s+)?(?:db|this\.db|repository)[\w.]*\.(?:find|query|get)/gim,

    // Pattern 4: while loop with sequential queries
    /while\s*\([^)]*\)\s*[\s\{]*(?:const|let)\s+\w+\s*=\s*(?:await\s+)?(?:db|repository)[\w.]*\.(?:find|query)/gim,
  ];

  private ormPatterns = {
    prisma: [
      /\.find\(/g, // missing .include()
      /\.findUnique\(/g, // missing .include()
      /\.findMany\(/g, // missing .include()
    ],
    typeorm: [
      /\.find\(/g, // missing .relations()
      /\.findOne\(/g, // missing .relations()
      /\.findBy\(/g, // missing .relations()
    ],
    sequelize: [
      /\.findOne\(/g, // missing .include
      /\.findAll\(/g, // missing .include
      /\.find\(/g, // missing .include
    ],
  };

  /**
   * analyze — Main entry point for database analysis
   */
  analyze(content: string, filePath: string): DatabaseQueryIssue[] {
    const issues: DatabaseQueryIssue[] = [];

    // Detect N+1 patterns via regex
    for (const pattern of this.n1Patterns) {
      let match;
      const regex = new RegExp(pattern);

      while ((match = regex.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split('\n').length;

        issues.push({
          file: filePath,
          line: lineNumber,
          column: 1,
          severity: 'HIGH',
          type: 'n1_query',
          message: 'Potential N+1 query pattern detected',
          context: match[0].substring(0, 80),
          recommendation:
            'Use batch loading (Promise.all) or eager loading (.include()/.relations())',
          estimatedQueries: this.estimateQueryCount(content, match.index),
        });
      }
    }

    // Detect ORM-specific issues
    issues.push(...this.detectOrmIssues(content, filePath));

    // Detect batch loading opportunities
    issues.push(...this.detectBatchLoadingOpportunities(content, filePath));

    return issues;
  }

  /**
   * estimateQueryCount — Estimate N+1 impact
   * @private
   */
  private estimateQueryCount(content: string, startIndex: number): number {
    // Simple heuristic: count array iterations + 1 query
    const beforeMatch = content.substring(Math.max(0, startIndex - 200), startIndex);
    const arrayIterations = (beforeMatch.match(/\[|\.\w+\s*\[/g) || []).length;
    return Math.max(2, arrayIterations + 1); // At least 2 (1 + N)
  }

  /**
   * detectOrmIssues — Detect ORM-specific patterns
   * @private
   */
  private detectOrmIssues(
    content: string,
    filePath: string
  ): DatabaseQueryIssue[] {
    const issues: DatabaseQueryIssue[] = [];

    // Detect Prisma issues
    if (content.includes('@prisma/client') || content.includes('PrismaClient')) {
      const issues_prisma = this.detectPrismaIssues(content, filePath);
      issues.push(...issues_prisma);
    }

    // Detect TypeORM issues
    if (content.includes('TypeORM') || content.includes('getRepository')) {
      const issues_typeorm = this.detectTypeormIssues(content, filePath);
      issues.push(...issues_typeorm);
    }

    // Detect Sequelize issues
    if (content.includes('sequelize') || content.includes('Sequelize')) {
      const issues_sequelize = this.detectSequelizeIssues(content, filePath);
      issues.push(...issues_sequelize);
    }

    return issues;
  }

  /**
   * detectPrismaIssues — Prisma-specific hints
   * @private
   */
  private detectPrismaIssues(
    content: string,
    filePath: string
  ): DatabaseQueryIssue[] {
    const issues: DatabaseQueryIssue[] = [];

    // find() without .include()
    if (
      content.match(/\.find\s*\(/) &&
      !content.match(/\.find\s*\([^)]*\)\.include\s*\(/)
    ) {
      issues.push({
        file: filePath,
        line: this.getLineNumber(content, '\.find\\s*\\('),
        column: 1,
        severity: 'MEDIUM',
        type: 'n1_query',
        message: 'Prisma .find() without .include() — will load relations separately',
        recommendation:
          'Use .include({ relatedModel: true }) to eager load relations',
        ormType: 'prisma',
      });
    }

    // findMany() without .include()
    if (
      content.match(/\.findMany\s*\(/) &&
      !content.match(/\.findMany\s*\([^)]*\)\.include\s*\(/)
    ) {
      issues.push({
        file: filePath,
        line: this.getLineNumber(content, '\.findMany\\s*\\('),
        column: 1,
        severity: 'MEDIUM',
        type: 'n1_query',
        message:
          'Prisma .findMany() without .include() — queries relations separately',
        recommendation:
          'Add .include() to batch-load all relations in one query',
        ormType: 'prisma',
      });
    }

    return issues;
  }

  /**
   * detectTypeormIssues — TypeORM-specific hints
   * @private
   */
  private detectTypeormIssues(
    content: string,
    filePath: string
  ): DatabaseQueryIssue[] {
    const issues: DatabaseQueryIssue[] = [];

    if (
      content.match(/\.find\s*\(/) &&
      !content.match(/\.relations\s*\(\s*\[/)
    ) {
      issues.push({
        file: filePath,
        line: this.getLineNumber(content, '\.find\\s*\\('),
        column: 1,
        severity: 'MEDIUM',
        type: 'n1_query',
        message: 'TypeORM .find() without .relations() — missing eager load',
        recommendation: 'Use .relations(["relationName", "nested.relation"])',
        ormType: 'typeorm',
      });
    }

    return issues;
  }

  /**
   * detectSequelizeIssues — Sequelize-specific hints
   * @private
   */
  private detectSequelizeIssues(
    content: string,
    filePath: string
  ): DatabaseQueryIssue[] {
    const issues: DatabaseQueryIssue[] = [];

    if (content.match(/\.findOne\s*\(/) && !content.match(/include\s*:/)) {
      issues.push({
        file: filePath,
        line: this.getLineNumber(content, '\.findOne\\s*\\('),
        column: 1,
        severity: 'MEDIUM',
        type: 'n1_query',
        message: 'Sequelize .findOne() without include — relations queried separately',
        recommendation:
          'Add include: [{ association: "relationName", attributes: [...] }]',
        ormType: 'sequelize',
      });
    }

    return issues;
  }

  /**
   * getLineNumber — Helper to get line number from content
   * @private
   */
  private getLineNumber(content: string, pattern: string): number {
    const regex = new RegExp(pattern);
    const match = content.match(regex);
    if (!match) return 1;

    return content.substring(0, content.indexOf(match[0])).split('\n').length;
  }

  /**
   * detectBatchLoadingOpportunities — Suggest Promise.all() usage
   * @private
   */
  private detectBatchLoadingOpportunities(
    content: string,
    filePath: string
  ): DatabaseQueryIssue[] {
    const issues: DatabaseQueryIssue[] = [];

    // Detect awaits without Promise.all
    const asyncLoops = content.matchAll(
      /(?:for|forEach|map)\s*\([^)]*\)\s*{\s*(?:const|let)\s+\w+\s*=\s*await\s+/gm
    );

    for (const match of asyncLoops) {
      const lineNumber = content.substring(0, match.index!).split('\n').length;

      issues.push({
        file: filePath,
        line: lineNumber,
        column: 1,
        severity: 'MEDIUM',
        type: 'n1_query',
        message: 'Sequential async operations — consider Promise.all()',
        recommendation:
          'Collect all promises and await with Promise.all() for batch execution',
      });
    }

    return issues;
  }
}

/**
 * Factory function for creating DatabaseAnalyzer
 */
export function createDatabaseAnalyzer(): DatabaseAnalyzerImpl {
  return new DatabaseAnalyzerImpl();
}
