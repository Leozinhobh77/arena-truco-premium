# Product Requirements Document (PRD) — Arena Truco Premium

## 1. Visão do Produto
**Nome:** Arena Truco Premium
**Posicionamento:** O aplicativo definitivo de Truco. Uma Single Page Application (SPA) com interface de "Native App/FlutterFlow", animações 60fps nível Apple/Casino e meta-game inspirado em Clash Royale.
**Objetivo do Usuário:** Jogar Truco em uma interface imersiva, esteticamente perfeita ("Obsidian & Gold"), interagir com bots altamente inteligentes via Gemini AI e participar de uma navegação fluida em abas (swipe).

## 2. Arquitetura UX/UI ("Nível Apple")
- **Tema:** Dark mode imersivo (roxo escuro profundo, destaques em dourado premium, azul para oponentes, vermelho para aliados/jogador, verde para sucesso).
- **Tipografia:** `Titillium Web` ou `Outfit` (substituindo Bebas Neue por algo mais legível mas igualmente impactante) para títulos, `Inter` para corpo.
- **Navegação (Screen Stack & Swipe):**
  - 5 Telas Principais horizontais: `Arena` (Principal), `Loja`, `Modos`, `Classificação`, `Clãs`.
  - Navegação Inferior (Bottom Bar) reativa e brilhante.
  - Animações (Framer Motion): FadeIn, SlideUp, Swipe e Feedback Tátil visual.

## 3. Especificação das Telas

### 3.1 Tela do Meio (Hub Principal / Arena)
- **Estado Deslogado (Login Simulado):** Quando o usuário entra, a tela do meio concentra a simulação de Login nível Apple (FaceID simulado ou apenas botão lúdico com animação progressiva).
- **Estado Logado:**
  - **Header & Configurações:** Ícone de engrenagem para alterar temas de mesa (verde, azul, roxo) e estilo do verso do baralho (recurso avançado do Trucoon).
  - **Perfil do Jogador:** Exibe a Foto (Avatar), Nick, Pontuação atual, Nível com barra de progresso.
  - **Centro:** Logo do jogo brilhante, status de conexão.
  - **Call to Action Gigante:** Botão "JOGAR" no rodapé chamando para o Truco com Bots UI.
- **Trava de Scroll Nativo:** O app jamais rolará para baixo. Um override CSS global garante `overflow: hidden` no `body` e bloqueia o "pull-to-refresh" para dar a sensação 100% de App Nativo instalado (FlutterFlow type).

### 3.2 Telas do Meta-Game (Esquerda e Direita via Swipe)
- **Loja:** Pacotes premium, skins de baralho.
- **Modos:** Truco Mineiro (Manilha Fixa), Truco Paulista (Baralho Limpo opcional), e Torneios.
- **Classificação:** Ranking e painel de estatísticas avançadas (Histórico de partidas inspiradas no TrucoON).
- **Clãs / Amigos:** Encontrar salas privadas (com senha) e adicionar "favoritos" para ver quem está online.

### 3.3 Tela "Salas" e "Gameplay"
- **Lista de Salas:** Lobby com status dinâmico (3/4 Aguardando, Em Jogo).
- **Mesa de Truco:**
  - Visão top-down com perspectiva ("Pods").
  - Avatar, nome e contagem de cartas para oponentes.
  - Cartas reais na mão do usuário (animação de expandir ao tocar e drag/swipe para jogar no centro).
- **IA e Chat de Bots (Gemini Flash 2.5):**
  - Os bots na mesa mandarão "provocações" e analisarão o jogo.
  - **Transcrição de Voz:** Botão PTT (Push to Talk) via `navigator.mediaDevices` para enviar xingamentos/falas que viram texto.
- **Ação Dramática "TRUCO":**
  - Quando acontece, MODAL DE TELA CHEIA escurece tudo. Texto "TRUCO" tremendo (shake/flicker vermelho).
  - Botões para a resposta: Correr, Aceitar, Pedir SEIS.

## 4. Requisitos Técnicos
- **Stack:** React 19 + TypeScript + Vite + Zustand + Tailwind v4 + Framer Motion.
- **Dados:** Toda a estrutura de lobby e clãs será "Mockada" para demonstração imediata de alto nível. O Gameplay do Truco (Regras, força de cartas, manilhas) deve ser **100% Funcional no frontend** (contra bots locais).

## 5. Próximos Passos
- Gerar o **SDD (Spec Driven Document)** detalhando a arquitetura Zustand e Tailwind.
- Demolir a versão antiga.
- Iniciar a Sprint 1.
