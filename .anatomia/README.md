# 🏗️ Anatomia do Arena Truco Premium

Bem-vindo! Esta pasta contém análises estruturais completas e versionadas do seu codebase.

---

## 🚀 COMECE AQUI

### Para Você (Léo) — Entender o seu próprio projeto

1. **Abra `index.html` no navegador** 🌐
   - Design visual lindo e interativo
   - Explore as 5 abas: Visão Geral → Métricas → Arquitetura → Saúde → Glossário
   - Use o Glossário para aprender termos (não lembra desde 2005? normal!)
   - Clique em "🎯 Tour Interativo" para guia

2. **Leia `2026-04-16-anatomia-completa.md`** 📖
   - Análise completa em 5 partes
   - ASCII art da arquitetura
   - Métricas profundas
   - Health score com recomendações

---

## 📁 O QUE CADA ARQUIVO FAZ

| Arquivo | Propósito | Para Quem |
|---------|-----------|-----------|
| **index.html** | Dashboard visual interativo | Você (aprendizado) + visitantes |
| **2026-04-16-anatomia-completa.md** | Relatório detalhado datado | Referência, documentação |
| **BLUEPRINT.md** | Template para regenerar análises | Qualquer IA no futuro |
| **reports.json** | Histórico estruturado em JSON | Automação, comparações |
| **README.md** | Este arquivo — guia de navegação | Primeira vez aqui |

---

## 🎯 CASOS DE USO

### Cenário 1: Você quer aprender a estrutura do seu app

```
1. Abra index.html no navegador
2. Vá para a aba "Arquitetura"
3. Leia sobre cada Screen, Overlay, Store
4. Não entendeu um termo? Aba "Glossário"
5. Está preso em um bug? Vá para aba "Saúde" (tem recomendações)
```

### Cenário 2: Você quer um novo relatório daqui a 1 semana

```
Você: "Gera nova análise de anatomia"
IA:
  1. Lê BLUEPRINT.md (sabe o que fazer)
  2. Executa os 5 passos
  3. Cria novo arquivo: 2026-04-23-anatomia-completa.md
  4. Atualiza reports.json
  5. index.html automaticamente mostra nova data no menu
```

### Cenário 3: Você quer comparar evolução do código

```
1. Gere análise em 16/abril (já temos)
2. Gere análise em 23/abril (próxima semana)
3. Abra index.html
4. Menu sidebar mostra ambas as datas
5. Clique em cada data para comparar (em breve)
```

---

## 📊 ESTATÍSTICAS ATUAIS (16 Abril 2026)

| Métrica | Valor |
|---------|-------|
| **Total LOC** | 5,678 |
| **Arquivos** | 23 |
| **Health Score** | 7.2/10 |
| **Maior arquivo** | ProfileOverlay.tsx (967 LOC) |
| **Cobertura testes** | 3% (objetivo: 70%) |

---

## 🧠 RESUMO RÁPIDO DA ARQUITETURA

```
🎮 Arena Truco Premium
├── 🖥️ 6 Screens (29% do código)
│   ├── LoginScreen (418 LOC)
│   ├── ArenaScreen (391 LOC)
│   ├── RankingScreen (351 LOC)
│   ├── ClansScreen (294 LOC)
│   ├── ModosScreen (205 LOC)
│   └── LojaScreen (186 LOC)
├── 🎭 5 Overlays (20% do código)
│   ├── ProfileOverlay ⭐ (967 LOC — o coração!)
│   ├── AmigosOnlineOverlay (298 LOC)
│   ├── SalasOverlay (248 LOC)
│   ├── GameOverlay (192 LOC)
│   └── ConfiguracoesOverlay (120 LOC)
├── 🧠 3 Stores (9% do código)
│   ├── useAuthStore (316 LOC)
│   ├── useGameStore (133 LOC)
│   └── useNavigationStore (57 LOC)
├── 📦 5 Components (11% do código)
├── 🔌 Data Layer (6% do código)
│   └── useProfileData.ts (128 LOC) — Supabase queries
└── 📂 Infrastructure (8% do código)
    ├── types.ts (175 LOC)
    └── mockData.ts (320 LOC)
```

---

## ✅ PONTOS FORTES

- ✅ Separação clara de responsabilidades
- ✅ 100% TypeScript (type-safe)
- ✅ Zustand pattern bem implementado
- ✅ Funcionalidade core estável
- ✅ Recentes fixes aplicados com sucesso

---

## ⚠️ PONTOS PARA MELHORAR

- ⚠️ Cobertura de testes: 3% → Objetivo 70%
- ⚠️ ProfileOverlay: 967 LOC → Refatorar em componentes
- ⚠️ Performance: Sem baseline estabelecido
- ⚠️ Documentação: Padrões pouco explicados

---

## 🔧 PRÓXIMOS PASSOS RECOMENDADOS

1. **Rodar skill-performance** — Análise de performance (Sprint 2.3)
2. **Adicionar 50+ testes** — Aumentar cobertura
3. **Refatorar ProfileOverlay** — Dividir em 3-4 sub-componentes
4. **Lighthouse baseline** — Estabelecer métricas
5. **Documentar padrões** — Data fetching, hooks, state management

---

## 🗺️ COMO NAVEGAR

### Se você quer aprender:
→ Abra **index.html** e explore a aba "Arquitetura"

### Se você quer detalhes técnicos:
→ Leia **2026-04-16-anatomia-completa.md**

### Se você é uma IA e precisa regenerar:
→ Leia **BLUEPRINT.md** (passo-a-passo)

### Se você quer histórico/dados estruturados:
→ Veja **reports.json**

---

## 📞 PERGUNTAS FREQUENTES

**P: Por que ProfileOverlay tem 967 LOC?**
A: Centraliza perfil, stats, achievements, histórico — 5+ abas em um arquivo. Candidato para refactor.

**P: O que significa Health Score 7.2?**
A: Bom (7-8 é saudável). Code está bem estruturado mas precisa testes e refactor de um arquivo grande.

**P: Cobertura de testes é 3%? Isso é ruim?**
A: Sim, mas normal em MVP. Objetivo é 70% quando tiver mais de 50+ testes de integração.

**P: Devo refatorar tudo agora?**
A: Não. Priorize: (1) Testes, (2) Refactor ProfileOverlay, (3) Performance. Nessa ordem.

**P: Como regenero daqui a 1 semana?**
A: Simples: "Gera nova análise de anatomia" — IA lê BLUEPRINT.md e faz tudo.

---

## 📅 HISTÓRICO

| Data | Status | Total LOC | Health |
|------|--------|-----------|--------|
| 2026-04-16 | ✅ Atual | 5,678 | 7.2 |
| 2026-04-23 | ⏳ Planejado | — | — |
| 2026-04-30 | ⏳ Planejado | — | — |

---

## 🎯 MISSÃO DESSA PASTA

Ajudar você:
1. **Entender** seu próprio projeto (visualmente)
2. **Aprender** termos e padrões (glossário interativo)
3. **Acompanhar** evolução do código (versionado)
4. **Tomar decisões** informadas (métricas + recomendações)

---

## 🚀 PRÓXIMAS AÇÕES

- [ ] Abra `index.html` no navegador
- [ ] Explore a aba "Glossário" para aprender
- [ ] Leia `2026-04-16-anatomia-completa.md` para detalhes
- [ ] Solicite nova análise em 23/abril (próxima semana)
- [ ] Inicie refactor de ProfileOverlay quando tiver tempo

---

**Criado:** 2026-04-16  
**Mantido por:** Agente Forge v5.2 + Claude Code  
**Próxima atualização:** 2026-04-23

Boa sorte! E bem-vindo de volta à programação, Léo! 🎉
