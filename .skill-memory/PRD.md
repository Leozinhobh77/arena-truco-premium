# 📊 PRD — skill-performance v5.2
**Performance Auditor & Optimization Architect**

*Documento estratégico aprovado pelo Board Executivo (CEO, CTO, CPO, CFO, Auditor)*  
**Versão:** 5.2 | **Forge:** v5.2 | **Appetite:** L (4 semanas) | **Nível:** ENTERPRISE

---

## 1. BUSINESS SUMMARY

### O Problema

Projetos pesados como **Arena Truco Premium** chegam em produção com performance degradada porque:
- **Detecção reativa:** Problemas encontrados DEPOIS de 2 semanas de build
- **Sem expertise integrado:** Stack do Forge tem Construtor, Sentinela, Segurança — falta Performance
- **Overhead manual:** Dev gasta horas em Lighthouse, Chrome DevTools, npm-check-updates
- **Sem contexto histórico:** Métricas não são rastreadas entre sprints

### A Solução

**skill-performance** é um **Performance Auditor sênior** integrado ao Forge v5.2 que:
- 🟢 **PRÉ-BUILD:** Analisa arquitetura proposta, previne problemas antes de codificar
- 🟡 **DURANTE BUILD:** Valida bundle size, React patterns, database queries, images
- 🔴 **PRÉ-DEPLOY:** Lighthouse + Core Web Vitals obrigatórios, performance budget enforcement
- 🔵 **PÓS-DEPLOY:** RUM (Real User Monitoring) + alertas + dashboard histórico

### Diferencial de Mercado

**skill-performance é a ÚNICA skill de performance integrada no pipeline de um agente IA.**
- Competidores (Vercel, Netlify): ferramentas externas, não integradas
- Agentes IA atuais: otimizam código sem medir impacto real
- **Forge v5.2:** Mede, alerta, recomenda — tudo automatizado no pipeline

### Público-Alvo

**Primário:** Desenvolvedores que constroem apps pesados (React, Vue, Angular) com Forge v5.2
- Léo (você): Múltiplos projetos como Arena Truco (30+ components, real-time)
- Agência de software: 5+ projetos simultâneos, cada um com 50-100 devs-dias de esforço

**Secundário:** Arquitetos que validam decisões técnicas antes de build (escolher React vs. Svelte, Next.js vs. SPA puro)

---

## 2. PÚBLICO-ALVO E DORES

### Persona Primária: Dev Intermediário/Avançado

**Nome:** Léo (você)  
**Contexto:** Construindo múltiplos apps React com Forge v5.2  
**Stack Favorito:** React 19, TypeScript, Zustand, Framer Motion

**Dores REAIS (validadas no Arena Truco):**
1. 🔴 **"Por que ficou lento?"** — Página com 100+ cards animadas causou lag em mobile, descoberto tarde
2. 🔴 **"Quando deveria otimizar?"** — Não há sinal de quando performance está degradando (reativo)
3. 🔴 **"Qual risco dessa arquitetura?"** — Propõe animações sequenciais, ninguém avisa que LCP vai 4s+
4. 🔴 **"Quanto vai melhorar se cortar X?"** — Sem baseline, não sabe qual change tem impacto real

**Comportamento Atual (problemático):**
- Usa Lighthouse ao final do build (depois de 2 semanas)
- Se score < 90: tira animações, lazy-loads tudo = sem premium feel
- Sem feedback quantitativo: "será que resolveu?"

**O que ela precisa:**
```
ANTES (idealmente):
  "Sua arquitetura vai resultar em LCP 4.2s. Recomendo:
   • Lazy-load cards além da fold
   • Remover animação sequential
   • Image WebP + srcset"

DURANTE:
  "Bundle cresceu +15%. 3 deps desnecessárias aqui."

DEPOIS:
  "Lighthouse: 85/100. FID está bom, mas CLS têm spike no tab-switch."
```

### Jornada do Usuário (Fluxo)

```
[1] Dev inicia novo projeto com /skill-orquestrador
         ↓
[2] /skill-consultor define PRD (requer skill-performance na pipeline)
         ↓
[3] /skill-planner cria sprints (calcula timeline com perf checks)
         ↓
[4] /skill-construtor implementa (sprint by sprint)
    ├─ Em paralelo: /skill-performance roda análises PRÉ-BUILD
         ↓
[5] Final de cada sprint: skill-performance roda DURANTE BUILD
    ├─ Bundle check
    ├─ React profiler
    ├─ Database analysis
    ├─ Image validation
         ↓
[6] Pré-deploy: skill-performance roda PRÉ-DEPLOY checkpoint
    ├─ Lighthouse obrigatório
    ├─ Core Web Vitals validation
    ├─ Performance budget check
         ↓
[7] Deploy acontece (aprovado por skill-segurança + skill-performance)
         ↓
[8] PÓS-DEPLOY (opcional): monitoring ativo no dashboard
    ├─ Alertas se LCP degrada
    ├─ Histórico de métricas
    └─ Comparação entre sprints
```

---

## 3. CORE FEATURES — MVP

### Feature 1️⃣: PRÉ-BUILD ANALYZER

**O que faz:**
Analisa arquitetura proposta (código existente) e avisa problemas ANTES de continuar build.

**CLI:**
```bash
/skill-performance [projeto] --analyze-architecture
```

**Output:**
```json
{
  "status": "warning",
  "lwc_estimate": "4.2s",
  "issues": [
    {
      "severity": "high",
      "type": "sequential_animations",
      "description": "100+ cards com delay: 0.04s = 4s de blocking",
      "fix": "Remover initial/animate em cards, só whileTap"
    },
    {
      "severity": "medium",
      "type": "dicebear_images",
      "description": "N+1 HTTP: 50 imagens carregam simultâneas",
      "fix": "Adicionar loading=\"lazy\" + Image CDN"
    }
  ],
  "recommendations": [
    "Usar React.memo em GlobalCard, AmigoRankingCard",
    "Mover sort em useMemo para evitar O(n log n) recalc"
  ]
}
```

**Board Member:** Performance Architect + React Specialist

---

### Feature 2️⃣: BUNDLE ANALYZER

**O que faz:**
Rastreia tamanho de bundle (CSS, JS, images) vs. baseline. Avisa se cresceu muito.

**Integração:**
Roda ao final de cada sprint (skill-construtor chama antes de commit).

**Output:**
```
Bundle Size Report:
  JS: 125kb (baseline: 120kb) — ⚠️ +5kb (+4%)
  CSS: 45kb (baseline: 45kb) — ✅ igual
  Images: 2.3mb (baseline: 1.8mb) — ❌ +500kb (+28%)

Critical Insight:
  Crescimento JS OK (< 10% tolerado)
  Crescimento Images PREOCUPANTE
  → Faltou otimizar dicebear avatars com WebP
```

**Board Member:** Frontend Analyst + Image Ops

---

### Feature 3️⃣: REACT PROFILER

**O que faz:**
Detecta padrões que causam excess re-renders:
- Functions recreadas em cada render (não usam useCallback)
- Arrays/objects criados inline
- Missing dependencies em useEffect

**Output:**
```
React Rendering Issues Found:

[HIGH] RankingScreen.tsx:145 — globalCard prop
  → Função abrirPerfilGlobal não usa useCallback
  → GlobalCard re-rende a cada parent render
  → FIX: Envolver em useCallback([amigoId], [deps])

[MEDIUM] AmigoCard — inline style em cada render
  → const borderColor = ... (cria novo object)
  → FIX: Usar CSS var ou styled-component

[LOW] StatusDot — não é memoizado
  → Pequeno impacto, mas pode optimizar com React.memo
```

**Board Member:** React Specialist

---

### Feature 4️⃣: DATABASE QUERY ANALYZER

**O que faz:**
Detecta padrões N+1 em chamadas de API:
- useMinhasPartidas() chamado em 50+ cards → 50 requests iguais
- Falta de memoização/caching

**Output:**
```
Database Query Issues:

[HIGH] useMinhasPartidas() em ProfileOverlay
  → Chamada em cada AmigoCard render
  → Estimado: 50 requisições para 50 amigos
  → FIX: Mover para ProfileContext + cache com useMemo

[MEDIUM] buscarUsuarioPorId() sem caching
  → Mesmo usuário pode ser buscado 5x no fluxo
  → FIX: Implementar Map<userId, User> no Zustand
```

**Board Member:** Database Engineer

---

### Feature 5️⃣: IMAGE OPTIMIZATION VALIDATOR

**O que faz:**
Valida otimizações de imagem:
- Está usando WebP?
- Tem srcset (responsive)?
- Está com lazy-loading?
- Tamanho final é reasonable?

**Output:**
```
Image Optimization Report:

❌ dicebear avatars (50+ instâncias)
  → Format: JPEG (2024 — usar WebP!)
  → Lazy-load: NO — todas carregam instantaneamente
  → Srcset: NO — mesma imagem em mobile e desktop
  → Estimated: 2.3mb → 400kb com WebP + lazy + srcset (82% reduction)

✅ Icons
  → SVG inline — ÓTIMO

SUMMARY: Imagens economizariam 1.9mb com optimizações simples.
```

**Board Member:** Image Ops + Frontend Analyst

---

### Feature 6️⃣: LIGHTHOUSE + CORE WEB VITALS

**O que faz:**
Roda Lighthouse localmente + calcula Core Web Vitals estimado:
- LCP (Largest Contentful Paint) — meta: < 2.5s
- FID (First Input Delay) — meta: < 100ms  
- CLS (Cumulative Layout Shift) — meta: < 0.1

**CLI:**
```bash
/skill-performance [projeto] --lighthouse
```

**Output:**
```
Lighthouse Report (Local):
  Performance: 62/100 ❌
  Accessibility: 92/100 ✅
  Best Practices: 88/100 ✅
  SEO: 95/100 ✅

Core Web Vitals:
  LCP: 3.8s ❌ (target: < 2.5s)
    → Caused by: images + animation blocking
  FID: 85ms ✅ (target: < 100ms)
  CLS: 0.15 ❌ (target: < 0.1)
    → Caused by: tab-switching animation repositioning content

Performance Budget:
  CSS: 50kb (current: 45kb) ✅ within budget
  JS: 150kb (current: 125kb) ✅ within budget
  Images: 2mb (current: 2.3mb) ❌ over budget by 300kb
```

**Board Member:** Frontend Analyst

---

## 4. O QUE NÃO É (Escopo Negativo)

**skill-performance NÃO:**
- ❌ Não modifica código automaticamente (apenas recomenda)
- ❌ Não faz profiling em produção real (apenas setup guide)
- ❌ Não substitui Lighthouse web (usa CLI local)
- ❌ Não garante 100/100 em Lighthouse (não é possível em apps reais)
- ❌ Não monetiza de nenhuma forma (internal tool do Forge)
- ❌ Não suporta frameworks além de React (v1.0)

**Features para v2.0+:**
- 💡 Integração com CI/CD (GitHub Actions, GitLab Pipelines)
- 💡 IA explicativa gerando PRs com sugestões
- 💡 Dashboard web interativo (vs. JSON)
- 💡 Mobile emulation profiling
- 💡 Suporte Vue.js, Svelte, Angular

---

## 5. CRITÉRIOS DE SUCESSO

### Métrica 1: Detecção Acurada

**Definição:** Recomendações de skill-performance causam melhoria real em Lighthouse quando implementadas.

**Target:** 8/10 recomendações (alta, média) resultam em melhoria mensurável (> 5 points Lighthouse)

**Como medir:** Comparar Lighthouse antes + depois de aplicar recomendação

**Baseline:** 0% (não existe ainda)

---

### Métrica 2: Velocidade de Análise

**Definição:** Tempo total para rodar análise completa (PRÉ-BUILD + DURANTE + PRÉ-DEPLOY)

**Target:** < 2 minutos para projeto de tamanho Arena Truco (30+ components, 125kb JS)

**Baseline:** N/A (não existe)

**Justificativa:** Dev não quer esperar > 2min a cada sprint

---

### Métrica 3: Usabilidade do Output

**Definição:** Dev consegue implementar recomendação sem ambiguidade ou pesquisa adicional.

**Target:** 9/10 recomendações são actionable (especificam arquivo + linha + fix)

**Success Story:**
```
❌ BAD: "Reduzir bundle size"
✅ GOOD: "RankingScreen.tsx:145 — abrirPerfilGlobal não usa useCallback.
          Fix: wrap em useCallback([amigoId], [amigos, pushOverlay])"
```

---

### Métrica 4: Credibilidade com Múltiplos Projetos

**Definição:** Skill funciona em Arena Truco + 2 projetos reais diferentes.

**Target:** 3/3 projetos validam que recomendações foram úteis

**Timeline:** Validar em Fase 2 (antes de Fase 3 release)

---

## 6. APPETITE E ESCOPO

### Appetite Declarado

```
🔴 GRANDE — 4 semanas = ~160 horas
  Sprints máximas: 4 (1 semana cada)
  Tasks máximas: ~50 tasks atômicas
  Timeline: 1 semana/sprint | 1 mês total
```

### Escopo Aprovado

| Fase | Sprint | Features | Timeline |
|------|--------|----------|----------|
| MVP | 1-2 | PRÉ-BUILD + Bundle + React Profiler | 1 semana |
| Produto | 2-3 | Database + Images + Lighthouse | 1.5 semanas |
| Escala | 4 | RUM + Alertas + Dashboard + Monitoring | 1.5 semanas |

### Regra de Ouro

**Nenhuma feature entra no MVP se não couber no appetite L (4 semanas).**

Se escopo crescer (ex: "adiciona suporte Vue.js"), requer:
1. Nova sessão com /skill-orquestrador
2. Recalcular appetite
3. Renegociar timeline

---

## 7. ROADMAP FUTURO (3 Fases)

### FASE 1 — MVP: PRÉ-BUILD ANALYZER (1 semana)

```
🎯 Objetivo: "Dar sinal amarelo/vermelho ANTES do build"

Board: 3 especialistas (Architect, React Specialist, Frontend Analyst)

Features:
  ✅ Detecção de padrões anti-performance
  ✅ Recomendações React específicas
  ✅ Estimativa de Core Web Vitals
  ✅ CLI: /skill-performance [projeto] --analyze-architecture
  ✅ Relatório JSON

KPI: Relatório em < 30s, recomendações específicas (não genéricas)
```

### FASE 2 — PRODUTO: DURANTE + PRÉ-DEPLOY (1.5 semanas)

```
🎯 Objetivo: "Validação contínua durante build e pré-deploy"

Board: 6 especialistas (completo)

Features:
  ✅ Bundle size tracking
  ✅ Database analyzer (N+1 detection)
  ✅ Image optimization validator
  ✅ Lighthouse integration (local + API)
  ✅ Core Web Vitals calculator
  ✅ Performance budget enforcement

KPI: Audit completo em < 120s, detecção de problemas reais
```

### FASE 3 — ESCALA: MONITORAMENTO + DASHBOARD (1.5 semanas)

```
🎯 Objetivo: "Monitoramento passivo pós-deploy"

Features:
  ✅ Real User Monitoring (RUM) setup
  ✅ Alertas em tempo real (LCP, CLS, FID degradation)
  ✅ Dashboard em Obsidian Canvas
  ✅ Histórico de métricas (por sprint, por projeto)
  ✅ Comparação benchmark
  ✅ Integração CI/CD (GitHub Actions, etc)

KPI: Alertas disparam para degradações > 20%
```

---

## 8. UX PRINCIPLES

1. **Específico > Genérico**
   - Sempre recomende arquivo:linha, não apenas "reduza bundle"

2. **Actionable > Informativo**
   - Output deve permitir implementação imediata sem pesquisa

3. **Sem Falsos Positivos**
   - Melhor não avisar do que avisar algo que não importa

4. **Progressivo > Perfeição**
   - Fase 1 MVP funciona bem em 80% dos casos; Fase 2 cobre 95%

5. **Integrado > Standalone**
   - Roda como parte do pipeline Forge, não ferramenta separada

---

## 9. STACK E INFRAESTRUTURA

### Runtime & Linguagem

**Node.js 20+ (TypeScript)**
- Compatível com Forge v5.2
- Acesso a Lighthouse CLI nativo
- Ferramentas de profiling maduras (clinic.js, 0x)
- Executa em processo (Janela 2)

### Core Libraries

```
Performance Analysis:
  ✅ lighthouse (CLI + Node API)
  ✅ bundlesize / esbuild (bundle analysis)
  ✅ clinic.js (CPU/memory profiling)

React Profiling:
  ✅ why-did-you-render (re-render detection)
  ✅ perforator (custom React profiler)

Database & Queries:
  ✅ sql-bricks / knex-inspect

Images:
  ✅ sharp (analysis + conversion)

Monitoring (PÓS-DEPLOY):
  ✅ OpenTelemetry (RUM setup)
  ✅ Grafana Cloud (free tier)

Dashboard & Reports:
  ✅ JSON (Obsidian compatible)
  ✅ Chart.js / Recharts (gráficos)
```

### Custo de Infraestrutura

| Nível | Custo | Limite |
|-------|-------|--------|
| Free Tier (local) | R$ 0/mês | 25k PageSpeed requests/dia |
| Escalando | R$ 0/mês | Unlimited local analysis |
| Com RUM (Grafana) | ~R$ 50-100/mês | 100+ concurrent metrics |

**Recomendação:** Iniciar em Free Tier, escalar conforme demanda

---

## 10. RISCOS BUG-DNA E PREVENÇÕES

### Risco 1: Profiling Pode Causar False-Positives

**Problema:** Análise estática pode sugerir otimização que não tem impacto real

**Prevenção:**
- Always incluir baseline de Lighthouse real (não só estimativa)
- Validar recomendação em 2+ cases antes de v1.0 release
- Marcar high-confidence recomendações com percentual (90% sure)

---

### Risco 2: Race Conditions (Janela 2)

**Problema:** skill-performance roda paralelo a skill-construtor, ambas acessam mesmo projeto

**Prevenção:**
- Implementar file locks granulares (.skill-memory/lock/skill-performance.lock)
- Read-only mode quando construtor está ativo
- Alertar se detectar modificações durante análise

---

### Risco 3: Complexidade de 6 Especialistas

**Problema:** Board interno pode ser overkill para análises simples, causando overhead

**Prevenção:**
- Fase 1: 3 especialistas apenas (reduz complexidade)
- Decision tree em código (especialista X dispara apenas se condição Y)
- Cache de análises (não re-rodar se código não mudou)

---

### Risco 4: Foco Demais em Lighthouse

**Problema:** Lighthouse não captura toda a realidade (ex: FID em lab vs real RUM)

**Prevenção:**
- Sempre avisar "estimativa baseada em padrões estáticos"
- Validar em produção real (Fase 3 RUM)
- Não obsessionar com 100/100 Lighthouse

---

## 11. SEGURANÇA & COMPLIANCE

### WCAG Accessibility

skill-performance não toca interface do usuário (é CLI + JSON + Obsidian), então N/A.

### LGPD Compliance

**Análise PRÉ-DEPLOY:** Read-only, sem coleta de dados pessoais ✅

**Análise PÓS-DEPLOY (RUM):** Requer setup do dev (não coleta automático)
- Dev responsável por privacy policy (skill apenas fornece setup guide)
- Sem rastreamento de IDs de usuário (apenas agregadas)
- Dados armazenados localmente ou em Grafana Cloud (dev escolhe)

---

## 12. DECISION LOG INTEGRADO

Toda decisão arquitetural é registrada em `.skill-memory/decision-log.json` para auditoria.

Exemplo:
```json
{
  "skill": "skill-consultor",
  "decisao": "Usar Node.js em vez de Python",
  "motivo": "Integração perfeita com Forge v5.2",
  "appetite_impacto": "compatível com L — timeline realista",
  "timestamp": "2026-04-15T10:00:00Z"
}
```

---

## APROVAÇÃO

**Board Executivo:** ✅ APROVADO  
**Appetite:** 🔴 L (4 semanas) — CONFIRMADO  
**Timeline:** 4 sprints (28 dias úteis)  
**Data Aprovação:** 2026-04-15  
**Próximo Passo:** /skill-planner (quebrar em tasks)

---

**Documento criado por:** /skill-consultor v5.2  
**LLM:** Opus 4.6  
**Versão PRD:** 5.2.0  
**Data Última Atualização:** 2026-04-15
