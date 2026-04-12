# AI_CONTEXT — Arena Truco Premium
**Forge v4.0 Titan** | Stack: React 19 + TS + Vite 8 + Tailwind v4 + Framer Motion + Zustand | Fase: Construção

## Estado Atual
- Skill ativa: **skill-construtor** (Aguardando construção Sprint 1 continuação ou Sprint 2)
- Sentinela: **INATIVA** (ativar na Janela 2 ao retomar /skill-construtor)
- Health Score: **65/100** (Auditado)
- Progresso: **25%** (5/20 tasks | Sprint 1 de 5)

## Arquitetura de Memória (4 Tiers)
- **L1 Core Memory:** `.skill-memory/working-memory.json` (~3KB — **LER SEMPRE PRIMEIRO**)
- **L2 Episódica:** `.skill-memory/sprint-journal.json` (sprints comprimidas)
- **L3 Canal Sentinela:** `.skill-memory/sentinela-channel.json` (construtor → sentinela)
- **L3 Log Sentinela:** `.skill-memory/sentinela-log.json` (auditorias imutáveis)
- **L4 Bug-DNA Global:** `../../.forge/forge-knowledge-base.json` (cross-project)

## Código Implementado (Sprint 1)
```
src/
├── App.tsx              — Shell SPA, Swipe (5 abas), Bottom NavBar animada
├── main.tsx             — Entry point React 19
├── index.css            — Design System Obsidian & Gold (17KB, tokens CSS)
├── types.ts             — Tipagens (Card, Player, Room, TrucoEvent)
├── mockData.ts          — Dados mockados (salas, jogadores, ranking, clãs)
├── screens/
│   ├── LoginScreen.tsx  — Login simulado Apple-like com animações
│   ├── ArenaScreen.tsx  — Hub principal (perfil, logo, CTA "JOGAR")
│   ├── LojaScreen.tsx   — Loja de skins/pacotes premium
│   ├── ModosScreen.tsx  — Truco Mineiro, Paulista, Torneios
│   ├── RankingScreen.tsx— Classificação e estatísticas
│   └── ClansScreen.tsx  — Clãs, amigos, salas privadas
├── overlays/
│   ├── SalasOverlay.tsx — Lobby de salas (bottom sheet)
│   └── GameOverlay.tsx  — Mesa de Truco (4 pods, cartas, truco modal)
└── stores/
    ├── useAuthStore.ts      — Autenticação simulada (Zustand)
    └── useNavigationStore.ts— Navegação: tabs, overlays, stack
```

## Pipeline SDD (Ordem Obrigatória)
1. /skill-inicializador ✅ CONCLUÍDO
2. /skill-consultor ✅ CONCLUÍDO (PRD gerado)
3. /skill-planner ✅ CONCLUÍDO (SDD + 5 sprints planejadas)
4. /skill-documentador ✅ CONCLUÍDO (SPEC gerada, Tipos e Design Tokens validados)
5. /skill-construtor 🔄 **PRÓXIMO** (Construção Ativa)
6. /skill-forge-visual ⬜ PENDENTE

## Regras Críticas
- **Jamais** modificar `working-memory.json` sem atualizar `updated_at`
- **Sempre** ler `working-memory.json` antes de qualquer ação de construção
- **Overflow hidden** global — App simula Native (sem scroll, sem pull-to-refresh)
- **Tema Obsidian & Gold** — Tokens definidos no `:root` do `index.css`
