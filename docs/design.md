# 📐 design.md — skill-performance v5.2

**Performance Auditor & Optimization Architect — Technical Design**

Forge v5.2 | Appetite: 🔴 L (4 semanas) | Versão: 5.2.0 | Gerado por: skill-planner v5.1

---

## 🏛️ ARQUITETURA DE ALTO NÍVEL

```
┌──────────────────────────────────────────────────────────┐
│                    skill-performance v5.2                 │
│                    (Janela 2 — CLI Tool)                  │
└──────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
         ┌──────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
         │  Analyzer   │ │Profiler│ │ Reporters  │
         │   (Static)  │ │(Dynamic)│ │ (Output)   │
         └──────┬──────┘ └───┬────┘ └─────┬──────┘
                │             │             │
    ┌───────────┼─────────────┼─────────────┤
    │           │             │             │
    ▼           ▼             ▼             ▼
 Code Files  CLI Tools    System Stats   JSON/HTML
 (src/)     (node_modules) (clinic.js)   (reports/)
```

### Componentes Principais

**1. ANALYZER (Static Code Analysis)**
- Lê arquivos TypeScript/JavaScript
- Detecta padrões anti-performance (regex + AST parsing)
- Retorna lista de issues com localização (arquivo:linha)
- Usa: @babel/parser, @babel/traverse, custom regex patterns

**2. PROFILER (Dynamic/Runtime Analysis)**
- Roda Lighthouse CLI localmente
- Integra why-did-you-render para React
- Coleta métricas de sistema (clinic.js)
- Retorna Core Web Vitals + bundle analysis

**3. REPORTERS (Output Generation)**
- Serializa issues em JSON estruturado
- Gera Obsidian Canvas para dashboard
- Exporta CSV para histórico
- Salva em `.skill-memory/`

---

## 🔧 DECISÕES ARQUITETURAIS

### DEC-A-001 — Separação: Static Analysis vs. Dynamic Analysis

**Decisão:** Implementar PRÉ-BUILD (static) e DURANTE BUILD (dynamic) como separados.

**Motivo:** 
- Static roda sem executar código (rápido, < 30s)
- Dynamic requer execução (mais lento, mais preciso)
- Dev pode rodar PRÉ-BUILD sozinho, ou chamar full pipeline

**Alternativas Descartadas:**
- Unified analyzer: complexidade, performance ruim
- Só dynamic: impossível detectar problemas antes de build

**Tradeoff:** Code duplication mínima (patterns são compartilhados). Ganho: flexibilidade.

**Fit com appetite L:** Permite MVP rápido (só static), expansão depois (add dynamic).

---

### DEC-A-002 — AST Parsing para High-Accuracy Detection

**Decisão:** Usar @babel/parser + @babel/traverse para análise de padrões, não apenas regex.

**Motivo:**
- Regex tira false-positives (ex: detectar `delay` em comentário)
- AST parser entende contexto (é realmente `delay: index * X` em animation?)
- Mais preciso = confiança do dev sobe

**Alternativas Descartadas:**
- Só regex: rápido mas 20%+ false-positive rate
- Runtime instrumentation: overkill para MVP

**Tradeoff:** +200ms por arquivo (parsing overhead). Ganho: 90%+ accuracy.

**Fit com appetite L:** AST parsing é standard em eslint/prettier, libraries maduras.

---

### DEC-A-003 — Free Tier PageSpeed (não cloud-based RUM inicial)

**Decisão:** Fase 1-2 usa Lighthouse local + PageSpeed free tier. Fase 3 (RUM) é optional setup guide.

**Motivo:**
- R$ 0/mês (free tier: 25k requests/dia)
- Escalável (não atinge limite até 100+ projetos simultâneos)
- Sem vendor lock-in (pode trocar para Grafana depois)

**Alternativas Descartadas:**
- Obrigatório Grafana Cloud: custo (R$ 50-100/mês), vendor lock-in
- Só local Lighthouse: sem produção insights (incomplete)

**Tradeoff:** Fase 3 é apenas guia, não implementação completa. Ganho: custo zero.

**Fit com appetite L:** Realista, não extrapola budget.

---

### DEC-A-004 — Board de 6 Especialistas como Design Pattern

**Decisão:** Implementar Board interno (Performance Architect, React Specialist, etc.) como abstração de lógica de recomendação.

**Motivo:**
- Cada especialista = módulo separado (manutenibilidade)
- Decisions são auditáveis (especialista X recomendou Y porque Z)
- Escalável: adicionar novo especialista = novo módulo
- Alinhado com Forge v5.2 patterns (já usado em sentinela, consultor)

**Alternativas Descartadas:**
- Função única gigante: impossível de manter
- Rede neural: overkill, não auditável

**Tradeoff:** +20% de complexity inicial. Ganho: enterprise-grade, extensível.

**Fit com appetite L:** Arquitetura é feita para escala.

---

### DEC-A-005 — JSON Reports Only (no auto-fix)

**Decisão:** skill-performance NUNCA modifica código. Apenas gera recomendações em JSON.

**Motivo:**
- Dev mantém controle total
- Integração com skill-construtor é clara (Construtor lê JSON, decide implementar)
- Evita unintended breakage

**Alternativas Descartadas:**
- Auto-apply fixes: perfeito para demo, horrível para produção
- Gerar PRs: overhead alto, requer GitHub API

**Tradeoff:** Dev precisa implementar manualmente (mais trabalho). Ganho: segurança, auditabilidade.

**Fit com appetite L:** Simplifica MVP, delega aplicação para Construtor.

---

### DEC-A-006 — Obsidian Canvas para Dashboard (vs. Web)

**Decisão:** Fase 3 dashboard roda em Obsidian Canvas (JSON), não UI web separada.

**Motivo:**
- Dev usa Obsidian já (setup Forge)
- Economiza 2 sprints de UI dev
- Canvas é visual, integrável com workflow dev

**Alternativas Descartadas:**
- Web dashboard: +1.5 sprints (React UI, hosting)
- CLI-only output: sem visualização, menos impactante

**Tradeoff:** Obsidian Canvas é novo (2023), menos flexível que web. Ganho: timeline realista.

**Fit com appetite L:** Sem Obsidian Canvas, não fecharia Fase 3 no prazo.

---

## 📦 COMPONENTES PRINCIPAIS

### COMP-001 — AnalyzerEngine

**Responsabilidade:** Executar static analysis em código-fonte

**Interface:**
```typescript
Input:  { projectRoot: string; files: string[]; }
Output: {
  issues: Issue[];
  summary: { high: number; medium: number; low: number; };
}

interface Issue {
  file: string;
  line: number;
  column: number;
  severity: "HIGH" | "MEDIUM" | "LOW";
  type: "sequential_animation" | "unused_var" | "n1_query" | ...;
  message: string;
  recommendation: string;
}
```

**Responsabilidades Internas:**
- FileScanner: iterar arquivos do projeto
- PatternDetector: aplicar regex + AST para padrões conhecidos
- IssueMerger: consolidar issues duplicadas

**Dependências:** 
- @babel/parser
- @babel/traverse
- TypeScript compiler API (para type info)

**Testabilidade:** 
- Unit tests com código fixture (exemplo Arena Truco)
- Integration test rodar em projeto real

---

### COMP-002 — ProfilerEngine

**Responsabilidade:** Executar análise dinâmica (Lighthouse, React profiler)

**Interface:**
```typescript
Input:  { projectRoot: string; buildPath: string; }
Output: {
  lighthouse: { score: number; performance: number; ... };
  coreWebVitals: { lcp: number; fid: number; cls: number; };
  bundleAnalysis: { js: number; css: number; images: number; };
}
```

**Responsabilidades Internas:**
- LighthouseRunner: chamar CLI Lighthouse
- BundleAnalyzer: esbuild/bundlesize parsing
- ReactProfiler: why-did-you-render integration

**Dependências:**
- lighthouse (CLI + Node API)
- esbuild
- why-did-you-render

**Testabilidade:**
- Mock Lighthouse output
- Integration test com build real

---

### COMP-003 — RecommendationBoard

**Responsabilidade:** Gerar recomendações baseado em issues detectados

**Interface:**
```typescript
Input:  { issues: Issue[]; metrics: Metrics; }
Output: Recommendation[]

interface Recommendation {
  severity: "HIGH" | "MEDIUM" | "LOW";
  specialist: string; // "React Specialist", "Database Engineer", ...
  issue: string;
  fix: string; // ESPECÍFICA: arquivo:linha + código
  estimatedImpact: string; // "LCP -500ms"
  confidence: number; // 0.0-1.0
}
```

**Board Members (Modules):**
1. **PerformanceArchitectModule** — bundle, tree-shaking, lazy-loading
2. **ReactSpecialistModule** — memo, useCallback, useState design
3. **DatabaseEngineerModule** — N+1 queries, indexing
4. **FrontendAnalystModule** — Core Web Vitals, CSS, animations
5. **ImageOpsModule** — WebP, srcset, optimization
6. **DevOpsModule** — deployment, caching headers

**Testabilidade:**
- Unit test cada módulo isolado
- Integration test recomendações em conjunto

---

### COMP-004 — ReporterEngine

**Responsabilidade:** Serializar dados em JSON, Obsidian Canvas, etc.

**Interface:**
```typescript
Input:  { recommendations: Recommendation[]; history: HistoryEntry[]; }
Output: {
  json: string; // `.skill-memory/performance-analysis.json`
  canvas: string; // `.skill-memory/performance-dashboard.canvas`
  csv: string; // histórico para Excel
}
```

**Responsabilidades Internas:**
- JSONFormatter: valida schema, organiza por severidade
- CanvasBuilder: gera Obsidian Canvas JSON com gráficos
- CSVExporter: séries temporais

**Testabilidade:**
- Validate JSON schema
- Verify Canvas renderiza em Obsidian
- CSV parse-back test

---

## 🗄️ MODELO DE DADOS

### Issues & Recommendations

```json
{
  "analysis": {
    "timestamp": "2026-04-15T14:30:00Z",
    "projectPath": "/path/to/arena-truco",
    "issues": [
      {
        "file": "src/screens/RankingScreen.tsx",
        "line": 145,
        "column": 8,
        "severity": "HIGH",
        "type": "sequential_animation",
        "message": "Cards animate sequentially with delay: index * 0.04s",
        "context": "const [cards] = cards.map((c, i) => (..., {delay: i * 0.04}))",
        "recommendation": "Remove sequential delay. Use layoutId instead for smooth animation without blocking LCP."
      }
    ],
    "summary": {
      "total": 12,
      "high": 3,
      "medium": 5,
      "low": 4
    }
  }
}
```

### Performance History

```json
{
  "project": "Arena Truco Premium",
  "sprints": [
    {
      "sprint": 1,
      "date": "2026-04-20",
      "metrics": {
        "lcp": "3.8s",
        "fid": "85ms",
        "cls": "0.15",
        "jsSize": "125kb",
        "cssSize": "45kb",
        "imageSize": "2.3mb"
      }
    },
    {
      "sprint": 2,
      "date": "2026-04-27",
      "metrics": {
        "lcp": "3.2s",
        "fid": "72ms",
        "cls": "0.08",
        "jsSize": "130kb",
        "cssSize": "48kb",
        "imageSize": "1.8mb"
      },
      "delta": {
        "lcp": "-600ms (↓16%)",
        "images": "-500kb (↓22%)"
      }
    }
  ]
}
```

---

## 🔄 FLUXOS PRINCIPAIS

### Fluxo 1: PRÉ-BUILD Analysis

```
CLI: /skill-performance [projeto] --analyze-architecture
      ↓
  AnalyzerEngine
    ├─ FileScanner: scan src/
    ├─ PatternDetector: regex + AST
    └─ IssueMerger: consolidate
      ↓
  RecommendationBoard
    ├─ PerformanceArchitectModule (bundle)
    ├─ ReactSpecialistModule (memo)
    ├─ ImageOpsModule (WebP)
    └─ ... (outros especialistas)
      ↓
  ReporterEngine
    ├─ JSONFormatter
    └─ Output: .skill-memory/performance-analysis.json
      ↓
  CLI: exibir summary no terminal
```

---

### Fluxo 2: DURANTE BUILD (Lighthouse)

```
CLI: /skill-performance [projeto] --lighthouse
      ↓
  ProfilerEngine
    ├─ LighthouseRunner: local CLI
    ├─ BundleAnalyzer: esbuild parsing
    └─ ReactProfiler: why-did-you-render
      ↓
  RecommendationBoard
    ├─ FrontendAnalystModule (Core Web Vitals)
    ├─ PerformanceArchitectModule (bundle)
      ↓
  ReporterEngine
    └─ JSONFormatter + Comparison vs. baseline
      ↓
  CLI: "Performance: 62/100 ❌, Recomendações: [...]"
```

---

### Fluxo 3: PÓS-DEPLOY (RUM + Dashboard)

```
RUM Data (OpenTelemetry / Grafana)
      ↓
  skill-performance --monitor (contínuo)
    ├─ Poll metrics
    ├─ Detect degradations
    └─ Trigger alerts if threshold exceeded
      ↓
  ReporterEngine
    ├─ CanvasBuilder: Obsidian dashboard
    ├─ CSVExporter: histórico
    └─ JSONFormatter: snapshot
      ↓
  Output:
    ├─ .skill-memory/rum-metrics-[ts].json
    ├─ .skill-memory/performance-dashboard.canvas
    └─ Alerts sent (if configured)
```

---

## 🛡️ SEGURANÇA & COMPLIANCE

### SEC-05: Secrets & Environment

- ✅ Nunca log API keys (PageSpeed, Grafana)
- ✅ Lê de `.env` local apenas (não committed)
- ✅ JSON reports anônimizados (sem URLs produção se possível)

### SEC-02: Input Validation

- ✅ Valida `[projeto]` path (não permite `../../../etc/passwd`)
- ✅ Sanitiza filenames em relatórios

### SEC-07: Generic Errors

- ✅ Erro handling sem stack trace externo
- ✅ "Projeto não encontrado" vs. detalhe técnico

---

## 🧪 ESTRATÉGIA DE TESTE

### Unit Tests

```
tests/
  ├─ analyzer/
  │  ├─ sequential-animation.test.ts (COMP-001)
  │  ├─ react-patterns.test.ts
  │  └─ bundle-flags.test.ts
  ├─ profiler/
  │  ├─ lighthouse.test.ts (COMP-002)
  │  └─ bundle-analyzer.test.ts
  ├─ recommendations/
  │  ├─ react-specialist.test.ts (COMP-003)
  │  ├─ image-ops.test.ts
  │  └─ board.test.ts
  └─ reporters/
     └─ json-formatter.test.ts (COMP-004)
```

### Integration Tests

```
tests/integration/
  ├─ full-pipeline.test.ts
  │  └─ Run full analysis em Arena Truco, verify output
  ├─ lighthouse-integration.test.ts
  └─ obsidian-canvas.test.ts
```

### Validation Cases

- ✅ Arena Truco (real project with known issues)
- ✅ Synthetic project (simplest case)
- ✅ Large project (100+ components)

---

## 📊 MÉTRICAS DE QUALIDADE

| Métrica | Target | Medição |
|---------|--------|---------|
| Code Coverage | > 80% | Jest coverage report |
| False-Positive Rate | < 10% | Manual review 10 real projects |
| Analysis Speed | < 30s | Benchmark Arena Truco |
| Accuracy | 8/10 recommendations actionable | Dev feedback |

---

**Documento gerado por:** skill-planner v5.1  
**LLM:** Sonnet 4.6  
**Versão:** 5.2.0 | **Data:** 2026-04-15
