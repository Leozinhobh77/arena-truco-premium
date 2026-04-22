# 📋 tasks.md — skill-performance v5.2

**Sprint Breakdown & Betting Tables**

Forge v5.2 | Appetite: 🔴 L (4 semanas, ~160 horas) | Gerado por: skill-planner v5.1

---

## 📊 VISÃO GERAL

| Sprint | Nome | Duração | Tasks | Estimativa | Objetivo |
|--------|------|---------|-------|-----------|----------|
| **1** | PRÉ-BUILD MVP | 1 semana | 6 | ~40h | Analyzer engine funcional |
| **2** | DURANTE BUILD | 1.5 semanas | 8 | ~50h | Profiler + Lighthouse |
| **3** | PRÉ-DEPLOY | 1.5 semanas | 8 | ~50h | Database + Images + Budget |
| **4** | MONITORING | 1 semana | 6 | ~20h | RUM + Dashboard + Alertas |
| **TOTAL** | | **4 semanas** | **28 tasks** | **~160h** | ✅ Dentro do appetite |

---

## 🎲 BETTING TABLE GERAL

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎲 [BETTING TABLE — skill-performance v5.2]

Apostamos: 4 semanas de trabalho (~160 horas)

Nas seguintes features:
  ✅ PRÉ-BUILD Analyzer (static analysis)
  ✅ DURANTE BUILD Profiler (dynamic + Lighthouse)
  ✅ PRÉ-DEPLOY Checkpoint (bundle + database + images)
  ✅ PÓS-DEPLOY Monitoring (RUM + dashboard + alertas)

Risco detectado: 
  ⚠️ Profiling React pode adicionar overhead (mitigation: opt-in)
  ⚠️ Lighthouse CLI pode variar em timing (mitigation: cache results)

Recompensa: 
  ✅ Única skill de performance integrada no Forge v5.2
  ✅ Detecção PROATIVA (PRÉ-BUILD), não reativa
  ✅ Validado em Arena Truco (case real)

Aceita a aposta?

[CONFIRMAR] SIM — iniciar Sprint 1 agora
[2] Não — pausar e renegociar
[3] Ver riscos detalhados
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

---

# 🚀 SPRINT 1 — PRÉ-BUILD ANALYZER (SEMANA 1)

**Objetivo:** MVP funcional — dev consegue rodar `/skill-performance [projeto] --analyze-architecture` e receber recomendações

**Estimativa:** 40 horas (~5 dias)  
**Dependências:** Nenhuma (começa clean)  
**Leis ativas:** SEC-05 (secrets), SEC-02 (input validation)  
**Board:** 3 especialistas (Architect, React Specialist, Frontend Analyst)

---

## 🎲 BETTING TABLE — Sprint 1

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎲 [BETTING TABLE — Sprint 1]

Apostamos: 5 dias de trabalho (40 horas)

Em: PRÉ-BUILD analyzer MVP
  • Detectar animações sequenciais
  • Detectar re-renders em excesso
  • Detectar imagens sem lazy-loading
  • Gerar JSON report
  • CLI parsing + errors

Risco Sprint 1:
  ⚠️ @babel/parser pode ser overhead para grandes projetos
     Mitigation: cache parsed AST, benchmark Arena Truco

Recompensa:
  ✅ MVP pronto para teste em Arena Truco
  ✅ 80% de confiança que recomendações são úteis

Aceita a aposta?

[CONFIRMAR] SIM — executar Sprint 1
[2] Não — voltar a ajustar escopo
[3] Ver tasks detalhadas
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📋 Tasks — Sprint 1

### Task 1.1 — CLI Scaffolding & Entry Point

**Descrição:** Criar estrutura base da skill, CLI parsing, entry point

**Size:** M (Medium)  
**Estimativa:** 5 horas  
**Arquivos alvo:** `src/index.ts`, `src/cli.ts`, `src/types.ts`

**Critério de Done:**
- [ ] `src/index.ts` exporta `AnalyzerEngine`
- [ ] CLI parser funciona: `--analyze-architecture` flag
- [ ] Error handling básico (arquivo não encontrado)
- [ ] `tsc --noEmit` passa (TypeScript strict)
- [ ] Teste unit: CLI args parsing

**Dependências:** Nenhuma (começa aqui)

**Lei de segurança:** SEC-02 (input validation do caminho do projeto)

**Referência requirements:** REQ-F1-001

---

### Task 1.2 — FileScanner & AST Parser Setup

**Descrição:** Implementar scanner de arquivos + integração @babel/parser

**Size:** M  
**Estimativa:** 6 horas  
**Arquivos alvo:** `src/analyzer/file-scanner.ts`, `src/analyzer/ast-parser.ts`

**Critério de Done:**
- [ ] FileScanner lista arquivos recursivamente (src/, ignora node_modules)
- [ ] AST parser de-estrutura código TypeScript
- [ ] Cache de parsed AST (para reuso)
- [ ] Benchmark: Arena Truco parses em < 10s
- [ ] Teste unit: file discovery, parser accuracy

**Dependências:** Task 1.1 (CLI estrutura)

**Lei de segurança:** SEC-02 (not allowed to scan ../../../)

**Referência requirements:** REQ-F1-001

---

### Task 1.3 — Sequential Animation Detector

**Descrição:** Implementar detector de animações sequenciais

**Size:** S  
**Estimativa:** 4 horas  
**Arquivos alvo:** `src/detectors/sequential-animation.ts`

**Critério de Done:**
- [ ] Detecta padrão `delay: index * X` em Framer Motion
- [ ] Usa AST + regex (não apenas regex)
- [ ] Retorna Issue com arquivo:linha:coluna
- [ ] Recomendação é específica (não genérica)
- [ ] Teste unit: 5+ casos (false positive, true positive)
- [ ] Validado em Arena Truco RankingScreen (deve detectar se ainda houver)

**Dependências:** Task 1.2 (AST parser)

**Referência requirements:** REQ-F1-002

---

### Task 1.4 — React Pattern Detector (useCallback, memo)

**Descrição:** Detectar missing useCallback e React.memo

**Size:** M  
**Estimativa:** 6 horas  
**Arquivos alvo:** `src/detectors/react-patterns.ts`

**Critério de Done:**
- [ ] Detecta funções inline sem useCallback
- [ ] Detecta componentes sem React.memo recebendo function props
- [ ] Detecta missing dependencies em useEffect (ESLint-like)
- [ ] Recomendações específicas (arquivo:linha + código)
- [ ] Teste unit: 10+ casos React
- [ ] Validado em Arena Truco (ProfileOverlay já tem useCallback, deve passar)

**Dependências:** Task 1.2 (AST parser)

**Referência requirements:** REQ-F1-003

---

### Task 1.5 — Image Optimization Validator

**Descrição:** Detectar imagens sem lazy-loading, WebP, srcset

**Size:** S  
**Estimativa:** 4 horas  
**Arquivos alvo:** `src/detectors/image-optimizer.ts`

**Critério de Done:**
- [ ] Detecta `<img>` tags sem `loading="lazy"`
- [ ] Sugere WebP conversion (não detecta format, só alerta)
- [ ] Sugere srcset (MEDIUM severity)
- [ ] Testado em Arena Truco dicebear avatars
- [ ] Teste unit: JSX parsing accuracy

**Dependências:** Task 1.2 (AST parser)

**Referência requirements:** REQ-F1-004

---

### Task 1.6 — JSON Reporter & Output Formatting

**Descrição:** Serializar issues em JSON, exibir summary no CLI

**Size:** M  
**Estimativa:** 6 horas  
**Arquivos alvo:** `src/reporters/json-reporter.ts`, `src/formatters/cli-output.ts`

**Critério de Done:**
- [ ] JSON schema definido (issues, summary, metadata)
- [ ] JSON válido (validado com jq ou schema validator)
- [ ] Issues ordenadas por severidade (HIGH → MEDIUM → LOW)
- [ ] CLI output é legível (formatado, cores, tabelas)
- [ ] Salva em `.skill-memory/performance-analysis-[ts].json`
- [ ] Teste unit: JSON validation, format accuracy

**Dependências:** Task 1.1-1.5 (todos os detectors)

**Referência requirements:** REQ-F1-006

---

### Task 1.7 — Integration Test & Arena Truco Validation

**Descrição:** Rodar análise completa em Arena Truco, validar output

**Size:** M  
**Estimativa:** 5 horas  
**Arquivos alvo:** `tests/integration/full-pipeline.test.ts`

**Critério de Done:**
- [ ] Análise em Arena Truco roda sem erros
- [ ] Tempo total < 30s
- [ ] Recomendações são específicas (não genéricas)
- [ ] Pelo menos 1 recomendação é útil/acionável
- [ ] JSON está bem-formado
- [ ] Dev consegue ler e implementar sem pesquisa adicional

**Dependências:** Task 1.1-1.6 (todos os tasks)

**Referência requirements:** REQ-F1-001 a REQ-F1-006

---

## 🎯 Sensores — Sprint 1

```bash
tsc --noEmit              # TypeScript strict mode
eslint src/               # Code quality
jest --coverage > 80%     # Unit tests cover 80% code
npm audit                 # Dependencies security (SEC-08)
```

---

---

# 🚀 SPRINT 2 — DURANTE BUILD (SEMANA 1.5)

**Objetivo:** Profiler engine + Lighthouse integration + Bundle tracking

**Estimativa:** 50 horas (~6-7 dias)  
**Dependências:** Sprint 1 DONE  
**Leis ativas:** SEC-05, SEC-02, SEC-06 (rate limiting PageSpeed)  
**Board:** 6 especialistas (completo)

---

## 🎲 BETTING TABLE — Sprint 2

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎲 [BETTING TABLE — Sprint 2]

Apostamos: 6-7 dias de trabalho (50 horas)

Em: Profiler engine + Lighthouse + Bundle tracking
  • Dynamic analysis com clinic.js
  • Lighthouse CLI integration
  • Bundle size analysis
  • Core Web Vitals calculation
  • React profiler (why-did-you-render)
  • Performance budget enforcement

Risco Sprint 2:
  ⚠️ Lighthouse CLI pode ter variance em timing
     Mitigation: run 3 times, take median
  ⚠️ why-did-you-render needs runtime injection
     Mitigation: opt-in flag, fallback to static analysis

Recompensa:
  ✅ Validação COMPLETA (static + dynamic)
  ✅ Real metrics (Lighthouse, Core Web Vitals)
  ✅ Histórico de bundle rastreado

Aceita a aposta?

[CONFIRMAR] SIM — executar Sprint 2
[2] Não — voltar a ajustar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📋 Tasks — Sprint 2

### Task 2.1 — Lighthouse CLI Integration

**Descrição:** Rodar Lighthouse localmente e parsear output

**Size:** M  
**Estimativa:** 7 horas  
**Arquivos alvo:** `src/profiler/lighthouse-runner.ts`

**Critério de Done:**
- [ ] Lighthouse CLI invocado com sucesso
- [ ] Score extraction: Performance, Accessibility, Best Practices, SEO
- [ ] Core Web Vitals parsing: LCP, FID, CLS
- [ ] Result caching (não re-run se unchanged)
- [ ] Teste unit: mock Lighthouse output, verify parsing

**Dependências:** Sprint 1 DONE

**Referência requirements:** REQ-F2-005

---

### Task 2.2 — Bundle Size Analyzer

**Descrição:** Analisar tamanho de JS, CSS, images com esbuild

**Size:** M  
**Estimativa:** 6 horas  
**Arquivos alvo:** `src/profiler/bundle-analyzer.ts`

**Critério de Done:**
- [ ] esbuild metafile parsing
- [ ] JS size calculation (minified, gzipped)
- [ ] CSS size tracking
- [ ] Image assets enumeration
- [ ] Comparison vs. baseline (prev sprint)
- [ ] Teste unit: bundle fixture parsing

**Dependências:** Sprint 1 DONE

**Referência requirements:** REQ-F2-001

---

### Task 2.3 — React Profiler: why-did-you-render Integration

**Descrição:** Integrar why-did-you-render para detectar re-renders

**Size:** M  
**Estimativa:** 7 horas  
**Arquivos alvo:** `src/profiler/react-profiler.ts`

**Critério de Done:**
- [ ] why-did-you-render config setup
- [ ] Componente re-render detection
- [ ] Threshold: flag componentes com > 3 re-renders
- [ ] Sugestão: React.memo ou state lift
- [ ] Teste integration: mock React component + profiler

**Dependências:** Sprint 1 DONE

**Referência requirements:** REQ-F2-002

---

### Task 2.4 — Performance Budget Enforcement

**Descrição:** Ler performance-budget.json, validar limites

**Size:** S  
**Estimativa:** 4 horas  
**Arquivos alvo:** `src/profiler/budget-enforcer.ts`

**Critério de Done:**
- [ ] `performance-budget.json` schema definido
- [ ] Comparação: atual vs. budget
- [ ] Alerta [CRITICAL] se ultrapassado
- [ ] Documentação de remaining budget
- [ ] Teste unit: budget validation

**Dependências:** Task 2.2 (bundle analyzer)

**Referência requirements:** REQ-F2-006

---

### Task 2.5 — Baseline Tracking & History

**Descrição:** Salvar baseline após Sprint 1, trackear deltas

**Size:** S  
**Estimativa:** 4 horas  
**Arquivos alvo:** `src/history/baseline-tracker.ts`

**Critério de Done:**
- [ ] Baseline JSON criado após Sprint 1
- [ ] Delta calculation: (current - baseline) / baseline * 100
- [ ] Histórico append (não rewrite)
- [ ] Teste unit: delta math accuracy

**Dependências:** Task 2.2 (bundle analyzer)

**Referência requirements:** REQ-F2-001, REQ-F3-004

---

### Task 2.6 — N+1 Query Detector

**Descrição:** Detectar padrões N+1 em chamadas de API

**Size:** M  
**Estimativa:** 6 horas  
**Arquivos alvo:** `src/detectors/n1-detector.ts`

**Critério de Done:**
- [ ] SQL pattern matching (SELECT queries idênticas)
- [ ] API call logging detection (useEffect, etc)
- [ ] Suggest caching com useMemo
- [ ] Teste unit: SQL parsing accuracy

**Dependências:** Sprint 1 (AST parser)

**Referência requirements:** REQ-F2-003

---

### Task 2.7 — Core Web Vitals Recommendation Board

**Descrição:** Board module que gera recomendações de CWV

**Size:** M  
**Estimativa:** 8 horas  
**Arquivos altor:** `src/board/frontend-analyst-module.ts`

**Critério de Done:**
- [ ] LCP recommendation: causes + fixes
- [ ] FID recommendation: input handling improvements
- [ ] CLS recommendation: layout stability fixes
- [ ] Confidence scoring (0.0-1.0)
- [ ] Teste unit: CWV threshold validation

**Dependências:** Task 2.1 (Lighthouse runner)

**Referência requirements:** REQ-F2-005

---

### Task 2.8 — Integration Sprint 2 & Validation

**Descrição:** Full pipeline test Lighthouse + Bundle + Profiler

**Size:** M  
**Estimativa:** 5 horas  
**Arquivos alvo:** `tests/integration/sprint2-validation.test.ts`

**Critério de Done:**
- [ ] Lighthouse roda em < 90s (Arena Truco)
- [ ] Bundle analysis accurate vs. manual check
- [ ] React profiler detects actual re-renders
- [ ] All recommendations < 150 chars (actionable)
- [ ] No false positives > 10%

**Dependências:** Task 2.1-2.7

**Referência requirements:** REQ-F2-001 a REQ-F2-006

---

---

# 🚀 SPRINT 3 — PRÉ-DEPLOY CHECKPOINT (SEMANA 1.5)

**Objetivo:** Database analyzer + Image optimizer + Full validation

**Estimativa:** 50 horas (~6-7 dias)  
**Dependências:** Sprint 2 DONE  
**Board:** 6 especialistas

---

## 🎲 BETTING TABLE — Sprint 3

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎲 [BETTING TABLE — Sprint 3]

Apostamos: 6-7 dias de trabalho (50 horas)

Em: Database + Image optimization + Full checkpoint
  • Database engineer module (N+1 advanced)
  • Image ops module (WebP conversion, srcset)
  • Obsidian docs generation
  • Full validation em Arena Truco
  • Decision log finalization

Risco Sprint 3:
  ⚠️ Image WebP conversion pode ser lento
     Mitigation: estimate only, don't convert

Recompensa:
  ✅ Fase 2 COMPLETA (PRÉ-DEPLOY validation)
  ✅ Validado em Arena Truco com resultados reais

Aceita a aposta?

[CONFIRMAR] SIM — executar Sprint 3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📋 Tasks — Sprint 3

### Task 3.1 — Database Engineer Module

**Descrição:** Advanced N+1 detection, query indexing suggestions

**Size:** M  
**Estimativa:** 7 horas  

**Critério de Done:**
- [ ] Detects useQuery calls inside loops
- [ ] Suggests: batching, caching, indexes
- [ ] Confidence > 80% para recomendações HIGH

**Dependências:** Task 2.6

**Referência requirements:** REQ-F2-003

---

### Task 3.2 — Image Optimization Board Module

**Descrição:** WebP suggestions, srcset validation, size estimation

**Size:** M  
**Estimativa:** 7 horas  

**Critério de Done:**
- [ ] WebP conversion size estimation (accuracy > 95%)
- [ ] Srcset pattern suggestion
- [ ] Lazy-load verification
- [ ] Tested on dicebear avatars (Arena Truco)

**Dependências:** Sprint 2

**Referência requirements:** REQ-F2-004

---

### Task 3.3 — Obsidian Docs Generation

**Descrição:** Generate Obsidian Canvas + markdown report

**Size:** M  
**Estimativa:** 8 horas  

**Critério de Done:**
- [ ] Canvas JSON generation (valid Obsidian format)
- [ ] Markdown report with all recommendations
- [ ] Saved in `.skill-memory/performance-report-[ts].md`
- [ ] Renders properly in Obsidian

**Dependências:** Sprint 2

**Referência requirements:** REQ-F1-006

---

### Task 3.4 — Full Validation & Case Study (Arena Truco)

**Descrição:** Run complete analysis on Arena Truco, document results

**Size:** L  
**Estimativa:** 15 horas  

**Critério de Done:**
- [ ] Analysis completes without errors
- [ ] 8/10 recommendations implemented successfully
- [ ] Lighthouse score improves by 5+ points
- [ ] Case study documented
- [ ] Metrics before/after recorded

**Dependências:** Task 3.1-3.3

**Referência requirements:** All REQ-F2

---

### Task 3.5 — PR Review & Documentation Update

**Descrição:** Clean up code, update README, PRD

**Size:** S  
**Estimativa:** 6 horas  

**Critério de Done:**
- [ ] Code review completed (self + imaginary peer)
- [ ] README updated with usage examples
- [ ] PRD/CONSTITUTION reviewed for accuracy
- [ ] Decision log finalized

**Dependências:** Task 3.1-3.4

---

### Task 3.6 — Decision Log Sprint 3

**Descrição:** Record all architectural decisions made in Sprint 3

**Size:** XS  
**Estimativa:** 2 horas  

**Critério de Done:**
- [ ] 3-5 decisions logged
- [ ] Each with motivo, alternativas, appetite_impacto
- [ ] Timestamp + approval recorded

**Dependências:** Continuous

**Referência requirements:** CONSTITUTION (Decision Log integrado)

---

---

# 🚀 SPRINT 4 — MONITORING + DASHBOARD (SEMANA 1)

**Objetivo:** RUM setup, Alertas, Dashboard, Final release

**Estimativa:** 20 horas (~2.5-3 dias)  
**Dependências:** Sprint 3 DONE  
**Board:** DevOps Performance + Frontend Analyst

---

## 🎲 BETTING TABLE — Sprint 4

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎲 [BETTING TABLE — Sprint 4]

Apostamos: 2.5-3 dias de trabalho (20 horas)

Em: RUM setup + Alertas + Dashboard
  • OpenTelemetry setup guide
  • Alert rules (LCP > 20% degradation, etc)
  • Obsidian Canvas dashboard update
  • Monitoring CLI command
  • Final testing + release

Risco Sprint 4:
  ⚠️ Obsidian Canvas pode não render em tempo real
     Mitigation: Canvas is static, update on demand

Recompensa:
  ✅ skill-performance v1.0 PRONTO
  ✅ Full pipeline: PRÉ-BUILD → DURANTE → PRÉ-DEPLOY → MONITOR

Aceita a aposta?

[CONFIRMAR] SIM — executar Sprint 4
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📋 Tasks — Sprint 4

### Task 4.1 — RUM Setup Guide

**Descrição:** Document OpenTelemetry integration for production

**Size:** S  
**Estimativa:** 4 horas  

**Critério de Done:**
- [ ] Setup guide markdown created
- [ ] Code examples (React + OpenTelemetry)
- [ ] Privacy considerations documented (SEC-05)
- [ ] Integration with Grafana Cloud optional

**Referência requirements:** REQ-F3-001

---

### Task 4.2 — Alert Rules Engine

**Descrição:** Implement degradation detection + alert triggers

**Size:** S  
**Estimativa:** 5 horas  

**Critério de Done:**
- [ ] LCP degradation > 20% triggers alert
- [ ] CLS spike detection
- [ ] FID bad range (> 200ms)
- [ ] Alert payload includes context

**Referência requirements:** REQ-F3-002

---

### Task 4.3 — Dashboard Canvas + Metrics Visualization

**Descrição:** Generate Obsidian Canvas with metrics over time

**Size:** M  
**Estimativa:** 6 horas  

**Critério de Done:**
- [ ] Canvas JSON with charts (LCP, CLS, FID trends)
- [ ] Historical data plotted
- [ ] Baseline comparison visible
- [ ] Renders in Obsidian without errors

**Referência requirements:** REQ-F3-003, REQ-F3-004

---

### Task 4.4 — Monitoring CLI Command

**Descrição:** `/skill-performance [project] --monitor` (continuous)

**Size:** S  
**Estimativa:** 3 horas  

**Critério de Done:**
- [ ] Polls RUM data continuously
- [ ] Checks alerts
- [ ] Updates dashboard
- [ ] Graceful exit on signal

**Referência requirements:** REQ-F3-002

---

### Task 4.5 — Final Testing & Release

**Descrição:** E2E test, release v1.0, document in CHANGELOG

**Size:** M  
**Estimativa:** 2 horas  

**Critério de Done:**
- [ ] All tests pass (jest coverage > 85%)
- [ ] npm audit clean
- [ ] npm run lint clean
- [ ] CHANGELOG.md updated
- [ ] v1.0 tag created

---

---

## 🔗 CAMINHO CRÍTICO (CPM)

```
Sprint 1 (PRÉ-BUILD)
  └─ BLOQUEADOR → Sprint 2 (DURANTE)
     └─ BLOQUEADOR → Sprint 3 (PRÉ-DEPLOY)
        └─ BLOQUEADOR → Sprint 4 (MONITOR)

Crítica porque cada sprint depende de sprint anterior.
Sem paralelização possível.

Sprint crítica: Sprint 1 (se atrasar 1 dia, todo projeto atrasa 1 dia)
Slack: 0 dias (appetite é justo)
```

---

## ✅ CHECKLIST PRÉ-RELEASE (Antes de v1.0)

- [ ] Sprint 1-4 DONE (todos os tasks)
- [ ] Todos os testes passando (Jest > 85% coverage)
- [ ] TypeScript strict mode: sem erros
- [ ] ESLint: sem warnings críticos
- [ ] npm audit: zero CRITICAL/HIGH vulnerabilities (SEC-08)
- [ ] Sentinela aprovação (Janela 2 auditoria)
- [ ] skill-segurança aprovação (pré-deploy security check)
- [ ] Arena Truco validação (case study completo)
- [ ] Decision log finalizado (todas as decisões registradas)
- [ ] Documentação atualizada (README, PRD, design.md)
- [ ] CHANGELOG.md escrito
- [ ] Git tag v1.0 criada
- [ ] Próximos passos documentados (v1.1, Fase 3 completa)

---

## 📊 ESTIMATIVA POR SKILLSET

| Skillset | Tasks | Horas | Pessoa |
|----------|-------|-------|--------|
| Backend / Node.js | 1.1, 2.1, 2.3, 3.1, 4.4 | ~35h | skill-construtor |
| Frontend / React | 1.3, 1.4, 2.2, 3.2, 3.3 | ~35h | skill-construtor |
| DevOps / Infrastructure | 4.1, 4.2 | ~10h | DevOps Module |
| QA / Testing | 1.7, 2.8, 3.4, 4.5 | ~20h | skill-sentinela |
| Documentation | 3.3, 3.5, 4.1 | ~10h | skill-documentador |
| Architecture | All boards, DEC-A | ~15h | Continuous |

---

## 🎯 SUCCESS METRICS — By Sprint

| Sprint | Métrica | Target | Medir |
|--------|---------|--------|-------|
| 1 | Análise completa em < 30s | ✅ | Benchmark Arena Truco |
| 2 | 8/10 recomendações actionable | ✅ | Dev feedback |
| 3 | Lighthouse melhora > 5 points | ✅ | Before/after scores |
| 4 | Alertas disparam corretamente | ✅ | Manual trigger test |

---

**Documento gerado por:** skill-planner v5.1  
**LLM:** Sonnet 4.6  
**Versão:** 5.2.0 | **Data:** 2026-04-15

---

## 📌 PRÓXIMO PASSO

Todos os 3 documentos (requirements.md, design.md, tasks.md) foram aprovados e criados.

**Próxima skill:** /skill-construtor começa Sprint 1 quando dado o sinal.

Quer começar Sprint 1 agora?

**[CONFIRMAR]** Iniciar Sprint 1 com skill-construtor  
**[2]** Pausar e revisar documentos  
**[3]** Ajustar escopo antes de começar
