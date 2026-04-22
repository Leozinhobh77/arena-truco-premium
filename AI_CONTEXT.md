# AI_CONTEXT — Arena Truco Premium
**Forge v5.2** | Stack: React 19 + TS + Vite 8 + Framer Motion + Zustand + **Supabase** | Fase: Sprint 3 ✅

## Estado Atual
- Sprint ativa: **Sprint 3 CONCLUÍDA** — Integração Supabase completa
- Build: **✅ PASSING** (0 erros TS | Exit 0 | 2186 modules)
- Health Score: **100/100**
- Progresso: **80%** (16/20 tasks | Sprint 4 de 5 é a próxima)

## Arquitetura de Memória (4 Tiers)
- **L1 Core Memory:** `.skill-memory/working-memory.json` (~5KB — **LER SEMPRE PRIMEIRO**)
- **L2 Episódica:** `.skill-memory/sprint-journal.json` (sprints comprimidas)
- **L3 Canal Sentinela:** `.skill-memory/sentinela-channel.json` (construtor → sentinela)
- **L3 Log Sentinela:** `.skill-memory/sentinela-log.json` (auditorias imutáveis)
- **L4 Bug-DNA Global:** `../../.forge/forge-knowledge-base.json` (cross-project)

## Supabase — Configuração Real
```
URL: https://pblwmavgqdsiwphtetei.supabase.co
Env: .env.local (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY)
Auth: Email + Senha (Supabase Auth real, sem mock)

Tabelas:
  profiles         → perfil do jogador (nick, nível, xp, moedas, gemas)
  partidas         → histórico de jogos (modo, resultado, oponente, pontos)
  pontuacao_diaria → gráfico 7 dias na aba Stats
  badges_catalogo  → 8 badges globais do jogo
  conquistas       → progresso individual por badge/jogador

View: ranking → winrate, posição, K/D calculados em tempo real

Seed: npm run seed → 30 bots + 594 partidas + 420 pontuações
```

## Estrutura de Arquivos (Sprint 3)
```
src/
├── App.tsx                    — Shell + inicializarSessao() + splash loading
├── main.tsx                   — Entry point React 19
├── index.css                  — Design System Obsidian & Gold (18KB)
├── types.ts                   — Tipos do domínio
├── mockData.ts                — Dados demo (fallback para usuários não-logados)
├── lib/
│   ├── supabase.ts            — createClient (anon key via .env.local)
│   └── supabase.types.ts      — Tipos TS completos (5 tabelas + view)
├── hooks/
│   └── useProfileData.ts      — useMinhasPartidas | usePontuacaoSemanal | useMinhasConquistas
├── screens/
│   ├── LoginScreen.tsx        — Email+Senha real | toggle Entrar/Cadastrar | erros PT-BR
│   ├── ArenaScreen.tsx        — Hub principal
│   ├── LojaScreen.tsx         — Loja de skins
│   ├── ModosScreen.tsx        — Modos de jogo
│   ├── RankingScreen.tsx      — Ranking (ainda usa mock — Sprint 4)
│   └── ClansScreen.tsx        — Clãs e amigos
├── overlays/
│   ├── ProfileOverlay.tsx     — 4 abas: Perfil✅ Stats✅ Conquistas✅ MeusJogos✅
│   ├── GameOverlay.tsx        — Mesa de jogo
│   ├── SalasOverlay.tsx       — Lobby de salas
│   └── AmigosOnlineOverlay.tsx— Lista de amigos
└── stores/
    ├── useAuthStore.ts        — Auth REAL Supabase (signUp/signIn/logout/sessão)
    ├── useNavigationStore.ts  — Navegação tabs/overlays
    └── useGameStore.ts        — Estado do jogo em mesa
scripts/
└── seed.mjs                   — Seed 30 bots (npm run seed)
```

## Pipeline SDD (Ordem Obrigatória)
1. /skill-inicializador ✅ CONCLUÍDO
2. /skill-consultor ✅ CONCLUÍDO (PRD gerado)
3. /skill-planner ✅ CONCLUÍDO (SDD + 5 sprints)
4. /skill-documentador ✅ CONCLUÍDO (SPEC, Tipos, Design Tokens)
5. /skill-construtor ✅ **Sprint 1, 2 e 3 CONCLUÍDAS**
6. /skill-sentinela ✅ CONCLUÍDA (Handshake realizado)
7. **Sprint 4: Multiplayer Online** ← PRÓXIMA

## Sprint 4 — O que falta
- [ ] Persistir resultado real de partida no banco ao fim de cada jogo
- [ ] Gravar pontuação diária automaticamente
- [ ] Lógica automática de conquistas (unlock de badges)
- [ ] RankingScreen conectado à VIEW ranking do Supabase
- [ ] Salas online com Supabase Realtime

## Regras Críticas
- **Jamais** modificar `working-memory.json` sem atualizar `updated_at`
- **Sempre** ler `working-memory.json` antes de qualquer ação de construção
- **Overflow hidden** global — App simula Native (sem scroll, sem pull-to-refresh)
- **Tema Obsidian & Gold** — Tokens definidos no `:root` do `index.css`
- **RLS ativo** — Nunca expor `service_role_key` no frontend (apenas em scripts/MCP)
- **Mock como fallback** — Dados mock são usados quando perfil não tem histórico real
