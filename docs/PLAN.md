# Master Plan: Arena Truco Premium (v1.0) 

Este plano detalha o roadmap de 9 Sprints para a conclusão do projeto. Utiliza a metodologia CPM (Critical Path Method) para garantir que a arquitetura core preceda os refinamentos visuais.

---

## 📅 Roadmap de Sprints

### 🟢 Sprint 1: Fundação SPA & UI Shell (CONCLUÍDA)
- **Status:** 100%
- **Tasks:**
  - [x] Configuração inicial Vite + React 19 + Tailwind v4.
  - [x] Implementação da navegação inferior (Bottom Bar).
  - [x] Sistema de Swipe entre as 5 telas core (Arena, Loja, etc).
  - [x] Implementação do LoginScreen Animado (Mocks).
  - [x] Definição dos Design Tokens "Obsidian & Gold".

### 🟢 Sprint 2: Core Engine & Mesa de Jogo (CONCLUÍDA)
- **Status:** 100%
- **Tasks:**
  - [x] Criação do Motor de Regras (`rules.ts`) — Força de cartas e manilhas.
  - [x] Implementação da Store de Jogo com Zustand (`useGameStore`).
  - [x] Componente `PlayingCard` com animações 3D.
  - [x] Layout da mesa de truco (Top-down) com 4 pods.
  - [x] Overlay de Salas (Lobby) funcional.

### 🟡 Sprint 3: Supabase Auth + Cérebro Gemini & Bot IA (EM PROGRESSO)
- **Status:** 20%
- **Tasks — Supabase (Fase 1 do BD):**
  - [ ] Criar projeto no Supabase (FREE tier) e rodar SQL da Fase 1 (`docs/SCHEMA.md`)
  - [ ] Criar `.env.local` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
  - [ ] Refatorar `useAuthStore.ts` — substituir mock por Supabase Auth real
  - [ ] Implementar `loginComEmail()`, `loginComGoogle()` e `logout()` reais
  - [ ] Carregar `profile` do usuário após login e salvar no store Zustand
  - [ ] Persistir nick/avatar escolhido na tabela `profiles` do Supabase
  - [ ] Configurar variáveis de ambiente no Netlify para deploy funcional
- **Tasks — Gemini (IA dos Bots):**
  - [ ] Integração com Gemini Flash 2.5 API via serverless/local proxy.
  - [ ] Sistema de "Personality" para Bots (Bastião, Dona Neves).
  - [ ] Sistema de Chat reativo na mesa (Provocações baseadas no placar).
  - [ ] Implementação do PTT (Push to Talk) — Voice to Text inicial.


### ⚪ Sprint 4: Áudio Imersivo & SFX
- **Tasks:**
  - [ ] Seleção de SFX (Cartas deslizando, embaralhar, batida na mesa).
  - [ ] Som dramático para o "TRUCO" (Efeito de tensão e impacto).
  - [ ] Música ambiente estilo Lounge/Casino (Layer opcional).
  - [ ] Feedback tátil visual para usuários mobile.

### ⚪ Sprint 5: Torneios & Meta-Game Ranking
- **Tasks:**
  - [ ] Lógica de progressão de Nivel e XP de Jogador.
  - [ ] Sistema de Ranking reativo (Gold, Platinum, Master).
  - [ ] Tela de Histórico de Partidas detalhada.
  - [ ] Simulação de Chaveamento de Torneio Diário.

### ⚪ Sprint 6: Loja & Customização Premium
- **Tasks:**
  - [ ] Sistema de Inventário (Baralhos, Temas de Mesa, Avatares).
  - [ ] Integração visual da Loja com Preview de itens.
  - [ ] Sistema de Moedas Virtuais e Recompensas Diárias.
  - [ ] Customização do verso do baralho.

### ⚪ Sprint 7: Performance & Mobile Polishing
- **Tasks:**
  - [ ] Auditoria de Performance (FPS Check em dispositivos antigos).
  - [ ] Verificação de Safe-Areas final (iPhone Notch / Android Gesture Bar).
  - [ ] Compactação de Assets (SVGs e WebP).
  - [ ] Lazy loading de telas pesadas (Overlays).

### ⚪ Sprint 8: Clãs & Social Interativa
- **Tasks:**
  - [ ] Sistema de Chat Global e Chat de Clã (Mocks dinâmicos).
  - [ ] Lista de amigos online e convites para sala.
  - [ ] Perfil de Clã com brasão e estatísticas coletivas.

### ⚪ Sprint 9: Auditoria Final & Entrega Titan
- **Tasks:**
  - [ ] Auditoria completa da Sentinela (T2) em todos os códigos.
  - [ ] Geração do `forge-docs.json` final.
  - [ ] Exportação do Manual Interativo v1.0.
  - [ ] Deploy de Produção Finalizado 100%.

---
**Notas Adicionais:**
- O caminho crítico atual é a **Integração com Gemini**, que desbloqueia a imersividade total prometida no PRD.
