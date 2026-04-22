# 📋 requirements.md — skill-performance v5.2

**Performance Auditor & Optimization Architect**

Forge v5.2 | Appetite: 🔴 L (4 semanas) | Versão: 5.2.0 | Gerado por: skill-planner v5.1

---

## CONVENÇÃO EARS (Event + Actor + Requirement + System)

Sintaxe: **"QUANDO [evento], O [ator] DEVE [requisito] PARA [sistema]"**

---

## 🎯 REQUISITOS FUNCIONAIS — FASE 1 (PRÉ-BUILD ANALYZER)

### REQ-F1-001 — CLI: Análise de Arquitetura

**User Story:** Como desenvolvedor, quero analisar meu projeto ANTES de começar o build para descobrir problemas de performance que minha arquitetura causará.

**Requisitos EARS:**

- QUANDO o dev executa `/skill-performance [projeto] --analyze-architecture`,
  O sistema DEVE ler o código-fonte do projeto e gerar relatório em JSON em menos de 30 segundos.

- QUANDO o dev fornece `[projeto]` inexistente,
  O sistema DEVE retornar erro específico "Projeto não encontrado em [caminho]" (SEC-07 — sem stack trace).

- QUANDO o relatório é gerado com sucesso,
  O sistema DEVE salvar em `.skill-memory/performance-analysis-[timestamp].json` e exibir resumo no terminal.

**Critérios de Aceite:**

- [ ] CLI aceita argumento `--analyze-architecture`
- [ ] Análise completa em < 30 segundos (projeto Arena Truco: ~125kb JS)
- [ ] Erro handling sem stack trace externo
- [ ] JSON salvo em `.skill-memory/` com timestamp
- [ ] Resumo exibido no terminal (formato legível)

**Fora do escopo (Fase 2+):**

- Análise em tempo real durante coding
- Geração automática de PRs com fixes

**Referência requirements:** REQ-F1-001

---

### REQ-F1-002 — Detector: Sequential Animations

**User Story:** Como dev, quero ser avisado se estou usando animações sequenciais que vão travar o LCP.

**Requisitos EARS:**

- QUANDO o analyzer detecta código com `delay: index * 0.04s` ou similar (padrão sequential),
  O sistema DEVE reportar como [HIGH] severity com arquivo, linha e recomendação.

- QUANDO a recomendação é gerada,
  O sistema DEVE ser ESPECÍFICA: "RankingScreen.tsx:145 — remover delay. Usar layoutId em vez de sequential."

- QUANDO não há animações sequenciais,
  O sistema DEVE omitir este issue do relatório (não reportar como "0 issues found").

**Critérios de Aceite:**

- [ ] Padrão `delay: index * X` detectado em regex
- [ ] Issue marcado como [HIGH]
- [ ] Recomendação inclui arquivo:linha
- [ ] Recomendação é actionable (específica, não genérica)
- [ ] Testado em Arena Truco RankingScreen (deve detectar problema real se ainda existir)

**Referência requirements:** REQ-F1-002

---

### REQ-F1-003 — Detector: Excess Re-renders

**User Story:** Como dev, quero saber quais componentes re-rendem desnecessariamente.

**Requisitos EARS:**

- QUANDO o analyzer encontra função criada inline sem useCallback (ex: `const handleClick = () => {...}`),
  O sistema DEVE detectar e sugerir envolver em useCallback.

- QUANDO o analyzer encontra componente sem React.memo que recebe props função,
  O sistema DEVE sugerir memoização.

- QUANDO há missing dependencies em useEffect,
  O sistema DEVE alertar (MEDIUM severity).

**Critérios de Aceite:**

- [ ] useCallback detection implementado
- [ ] React.memo detection implementado
- [ ] useEffect dependency warning implementado
- [ ] Issues marcados com severidade apropriada
- [ ] Testado em Arena Truco ProfileOverlay (já tem useCallback + memo)

**Referência requirements:** REQ-F1-003

---

### REQ-F1-004 — Detector: Images Without Optimization

**User Story:** Como dev, quero saber quais imagens podem ser otimizadas (WebP, srcset, lazy-loading).

**Requisitos EARS:**

- QUANDO o analyzer encontra `<img src="...dicebear...">` sem `loading="lazy"`,
  O sistema DEVE reportar como [MEDIUM] com fix específica.

- QUANDO a imagem não usa WebP,
  O sistema DEVE sugerir conversão + tamanho economizado.

- QUANDO há múltiplas imagens iguais carregando,
  O sistema DEVE alertar sobre N+1 HTTP (SE houver pattern detectável).

**Critérios de Aceite:**

- [ ] Imagem sem `loading="lazy"` detectada
- [ ] WebP suggestion com estimativa de tamanho
- [ ] Issue mostra arquivo:linha
- [ ] Testado em Arena Truco (dicebear avatars)

**Referência requirements:** REQ-F1-004

---

### REQ-F1-005 — Detector: Bundle Red Flags

**User Story:** Como dev, quero saber se meu bundle está inchado com dependências desnecessárias.

**Requisitos EARS:**

- QUANDO o analyzer verifica package.json,
  O sistema DEVE listar todas as dependências com tamanho estimado (via bundlesize data).

- QUANDO um pacote adiciona > 50kb ao bundle e é pouco usado (< 2 imports),
  O sistema DEVE sugerir avaliação (MEDIUM severity).

- QUANDO o bundle total cresce > 10% vs. baseline,
  O sistema DEVE alertar [HIGH].

**Critérios de Aceite:**

- [ ] package.json parsing implementado
- [ ] Tamanho estimado por dependência
- [ ] Alerta para pacotes grandes pouco usados
- [ ] Baseline tracking funciona

**Referência requirements:** REQ-F1-005

---

### REQ-F1-006 — Reporter: JSON Output Estruturado

**User Story:** Como dev, quero receber o relatório em JSON para integrar com outras ferramentas.

**Requisitos EARS:**

- QUANDO o analyzer completa,
  O sistema DEVE gerar JSON estruturado com campos: `status`, `issues`, `recommendations`, `metrics`.

- QUANDO há múltiplas issues,
  O sistema DEVE ordená-las por severidade [HIGH → MEDIUM → LOW].

- QUANDO o JSON é salvo,
  O sistema DEVE validar que é JSON valid (sem syntax errors).

**Critérios de Aceite:**

- [ ] JSON schema definido e documentado
- [ ] Campos obrigatórios presentes
- [ ] Issues ordenadas por severidade
- [ ] JSON válido (validado com jq ou similar)

**Referência requirements:** REQ-F1-006

---

## 🎯 REQUISITOS FUNCIONAIS — FASE 2 (DURANTE + PRÉ-DEPLOY)

### REQ-F2-001 — Bundle Size Tracking

**User Story:** Como dev, quero rastrear mudança de tamanho de bundle entre sprints.

**Requisitos EARS:**

- QUANDO o analyzer roda ao final de cada sprint,
  O sistema DEVE comparar bundle atual vs. baseline da sprint anterior.

- QUANDO há crescimento > 5% em JS,
  O sistema DEVE alertar [MEDIUM] com detalhes (qual arquivo cresceu).

- QUANDO há redução significativa (> 10%),
  O sistema DEVE documentar em histórico (para validação).

**Critérios de Aceite:**

- [ ] Baseline salvo após Sprint 1
- [ ] Comparação funciona (atual vs. baseline)
- [ ] Alerta implementado para threshold 5%
- [ ] Histórico rastreado em `.skill-memory/bundle-history.json`

**Referência requirements:** REQ-F2-001

---

### REQ-F2-002 — React Profiler: Re-render Detection

**User Story:** Como dev, quero saber quais componentes estão re-renderizando mais que o esperado.

**Requisitos EARS:**

- QUANDO o React Profiler roda,
  O sistema DEVE identificar componentes com > 3 re-renders por ação do usuário.

- QUANDO um componente re-rende excessivamente,
  O sistema DEVE sugerir React.memo ou mover state para cima da árvore.

- QUANDO a sugestão é aplicada,
  O dev consegue validar redução de re-renders (baseline vs. after).

**Critérios de Aceite:**

- [ ] Profiler integra com why-did-you-render
- [ ] Threshold 3 re-renders configurável
- [ ] Sugestões são actionable
- [ ] Baseline profiling salvo

**Referência requirements:** REQ-F2-002

---

### REQ-F2-003 — Database Query Analyzer: N+1 Detection

**User Story:** Como dev, quero detectar queries N+1 que estou fazendo sem perceber.

**Requisitos EARS:**

- QUANDO o app faz múltiplas queries idênticas em um mesmo render,
  O sistema DEVE detectar o padrão N+1.

- QUANDO N+1 é detectado,
  O sistema DEVE sugerir caching com useMemo ou move query para cima.

- QUANDO há query sem índice óbvio,
  O sistema DEVE alertar (conexão com database engineer).

**Critérios de Aceite:**

- [ ] SQL pattern parser implementado
- [ ] Detecção de queries repetidas
- [ ] Sugestão de caching/memoization
- [ ] Logging sem exposição de dados sensíveis (SEC-05)

**Referência requirements:** REQ-F2-003

---

### REQ-F2-004 — Image Optimization: WebP + Srcset Validator

**User Story:** Como dev, quero garantir que minhas imagens estão otimizadas para web.

**Requisitos EARS:**

- QUANDO imagens são encontradas,
  O sistema DEVE verificar: formato (WebP?), lazy-loading, srcset, tamanho.

- QUANDO imagem é > 200kb em JPEG,
  O sistema DEVE sugerir WebP com economias estimadas.

- QUANDO não há srcset,
  O sistema DEVE sugerir (MEDIUM severity).

**Critérios de Aceite:**

- [ ] Formato checking (JPEG → WebP)
- [ ] Tamanho analysis + estimativa de economias
- [ ] Lazy-loading verification
- [ ] Srcset suggestion
- [ ] Testado em dicebear avatars (Arena Truco)

**Referência requirements:** REQ-F2-004

---

### REQ-F2-005 — Lighthouse Integration (Local)

**User Story:** Como dev, quero rodar Lighthouse localmente e validar Core Web Vitals.

**Requisitos EARS:**

- QUANDO o dev executa `/skill-performance [projeto] --lighthouse`,
  O sistema DEVE executar Lighthouse CLI localmente (sem internet).

- QUANDO o score < 90 em Performance,
  O sistema DEVE listar as 3 maiores oportunidades (Lighthouse recommendations).

- QUANDO Core Web Vitals falham (LCP > 2.5s, FID > 100ms, CLS > 0.1),
  O sistema DEVE alertar [HIGH] com causa provável.

**Critérios de Aceite:**

- [ ] Lighthouse CLI invocado com sucesso
- [ ] Score extração funcionando
- [ ] Recomendações top-3 exibidas
- [ ] Core Web Vitals threshold validado

**Referência requirements:** REQ-F2-005

---

### REQ-F2-006 — Performance Budget Enforcement

**User Story:** Como dev, quero estabelecer limites de performance que não posso ultrapassar.

**Requisitos EARS:**

- QUANDO o dev define budget em arquivo (ex: `performance-budget.json`),
  O sistema DEVE fazer enforce ao final da sprint.

- QUANDO CSS > budget,
  O sistema DEVE bloquear commit (ou avisar com [CRITICAL]).

- QUANDO há espaço no budget,
  O sistema DEVE documentar quanto sobrou para próxima sprint.

**Critérios de Aceite:**

- [ ] Budget file parsing
- [ ] Comparação vs. actual
- [ ] Alerta se ultrapassado
- [ ] Documentação de remaining budget

**Referência requirements:** REQ-F2-006

---

## 🎯 REQUISITOS FUNCIONAIS — FASE 3 (MONITORAMENTO + DASHBOARD)

### REQ-F3-001 — Real User Monitoring (RUM) Setup Guide

**User Story:** Como dev, quero rastrear performance de usuários reais em produção.

**Requisitos EARS:**

- QUANDO o dev ativa monitoramento pós-deploy,
  O sistema DEVE fornecer setup guide (OpenTelemetry ou Grafana Cloud).

- QUANDO RUM está ativo,
  O sistema DEVE coletar: LCP, FID, CLS de usuários reais.

- QUANDO dados chegam,
  O sistema DEVE armazenar em `.skill-memory/rum-metrics-[timestamp].json` (ou Grafana).

**Critérios de Aceite:**

- [ ] Setup guide documentado
- [ ] OpenTelemetry config example pronto
- [ ] RUM data storage funcionando
- [ ] Privacy-compliant (SEC-05 — sem rastreamento individual)

**Referência requirements:** REQ-F3-001

---

### REQ-F3-002 — Alertas em Tempo Real

**User Story:** Como dev, quero receber alertas quando performance degrada em produção.

**Requisitos EARS:**

- QUANDO LCP degrada > 20% vs. baseline,
  O sistema DEVE enviar alerta [HIGH].

- QUANDO CLS spike detectado,
  O sistema DEVE enviar alerta com contexto (qual página, que hora).

- QUANDO FID > 200ms (bad range),
  O sistema DEVE marcar como [MEDIUM] alerta.

**Critérios de Aceite:**

- [ ] Threshold de degradação configurável
- [ ] Alertas enviados (email/Slack opcional)
- [ ] Contexto incluído no alerta
- [ ] Histórico de alertas rastreado

**Referência requirements:** REQ-F3-002

---

### REQ-F3-003 — Dashboard em Obsidian Canvas

**User Story:** Como dev, quero visualizar histórico de métricas de forma visual.

**Requisitos EARS:**

- QUANDO o dashboard é atualizado,
  O sistema DEVE gerar grafo em Obsidian Canvas com:
  - Pontos de cada sprint (LCP, CLS, FID)
  - Tendência (melhorando/piorando)
  - Comparação vs. baseline

- QUANDO há novo data point,
  O sistema DEVE atualizar canvas em tempo real (se Obsidian CLI suporta).

**Critérios de Aceite:**

- [ ] Canvas JSON gerado corretamente
- [ ] Gráficos renderizam em Obsidian
- [ ] Dados históricos carregam
- [ ] Tendência é visualmente clara

**Referência requirements:** REQ-F3-003

---

### REQ-F3-004 — Histórico de Métricas (Per Sprint)

**User Story:** Como dev, quero rastrear como minha aplicação evolui entre sprints.

**Requisitos EARS:**

- QUANDO cada sprint termina,
  O sistema DEVE capturar snapshot de LCP, CLS, FID, Bundle Size.

- QUANDO comparo Sprint 1 vs. Sprint 3,
  O sistema DEVE mostrar evolução com deltas (+ ou -).

- QUANDO há regressão,
  O sistema DEVE alertar que métrica voltou a piorar.

**Critérios de Aceite:**

- [ ] Snapshot captured ao final de cada sprint
- [ ] Comparação delta implementada
- [ ] Regressão detection ativa
- [ ] Histórico persistido em JSON

**Referência requirements:** REQ-F3-004

---

## 🎯 REQUISITOS NÃO-FUNCIONAIS

### PERFORMANCE

| Requisito | Meta | Teste |
|-----------|------|-------|
| Análise completa | < 2 min (Arena Truco) | Sprint 1 |
| Lighthouse local | < 90s | Sprint 2 |
| RUM processing | < 5s latência | Sprint 4 |

### SEGURANÇA

| Requisito | Nível | Compliance |
|-----------|-------|-----------|
| Secrets in logs | Zero | SEC-05 ✅ |
| API key exposure | Zero | SEC-05 ✅ |
| SQL injection | Zero | SEC-02 ✅ |
| Rate limiting | Via PageSpeed | SEC-06 ✅ |

### ACESSIBILIDADE

| Requisito | Padrão | Nota |
|-----------|--------|------|
| CLI output | Legível | WCAG AAA não aplica (CLI) |
| JSON schema | Clear | Documentado |

### ESCALABILIDADE

| Métrica | Limite | Plano |
|---------|--------|-------|
| Projetos simultâneos | 10+ | Free tier PageSpeed |
| RUM data points | 1M+ | Escalável com Grafana |
| Histórico rastreado | 12+ meses | JSON local + cloud |

---

## 📊 MATRIZ DE RASTREABILIDADE

| REQ | Feature | Sprint | Task | Teste |
|-----|---------|--------|------|-------|
| REQ-F1-001 | CLI Analyze | 1 | 1.1 | unit + integration |
| REQ-F1-002 | Sequential Animations | 1 | 1.2 | unit + case real (Arena Truco) |
| REQ-F1-003 | Re-renders | 1 | 1.3 | unit + case real |
| REQ-F1-004 | Images | 1 | 1.4 | unit + case real |
| REQ-F1-005 | Bundle Flags | 1 | 1.5 | unit + case real |
| REQ-F1-006 | JSON Output | 1 | 1.6 | unit |
| REQ-F2-001 | Bundle Tracking | 2 | 2.1 | integration |
| REQ-F2-002 | React Profiler | 2 | 2.2 | integration + case real |
| REQ-F2-003 | N+1 Detection | 3 | 3.1 | integration |
| REQ-F2-004 | Image Optimizer | 3 | 3.2 | integration |
| REQ-F2-005 | Lighthouse | 2 | 2.3 | integration |
| REQ-F2-006 | Budget | 2 | 2.4 | integration |
| REQ-F3-001 | RUM Guide | 4 | 4.1 | manual |
| REQ-F3-002 | Alertas | 4 | 4.2 | integration |
| REQ-F3-003 | Dashboard | 4 | 4.3 | integration |
| REQ-F3-004 | Histórico | 4 | 4.4 | integration |

---

## ✅ CRITÉRIO DE SUCESSO

**Projeto é "DONE" quando:**

- [ ] Todos os requisitos F1 funcionam em Arena Truco
- [ ] 8/10 recomendações resultam em melhoria Lighthouse > 5 pontos
- [ ] Análise completa em < 120s
- [ ] 9/10 recomendações são actionable
- [ ] Testes cobrem 80%+ do código
- [ ] Documentação atualizada (README, docs/)
- [ ] skill-segurança aprova security audit
- [ ] skill-sentinela aprova code quality

---

**Documento gerado por:** skill-planner v5.1  
**LLM:** Sonnet 4.6  
**Versão:** 5.2.0 | **Data:** 2026-04-15
