# Spec Driven Document (SDD) — Arena Truco Premium

## 1. Arquitetura Base
- **Vite + React 19:** Otimização para Fast Refresh e empacotamento SPA de alta performance em arquivo único (`index.tsx` principal de entrada que chama a cascata).
- **TypeScript:** Tipagem estrita na lógica do `gameLogic.ts` (manilhas, valor das cartas) e nas Stores do Zustand.
- **Framer Motion + Tailwind CSS v4:** Animações nativas acopladas à classes de utilidade.

## 2. Estrutura de Estado (Zustand)

### 2.1 `useNavigationStore`
Responsável pela lógica estilo tela nativa.
- `stack: string[]` — Lista das telas renderizadas.
- `pushScreen(screen: string)` — Abre o Modal ou Sobreposição.
- `popScreen()` — Retorna.
- `activeTab: number` — Para o swipe de 0 a 4 (Arena, Loja, etc).

### 2.2 `useGameStore`
A máquina de estados da partida de Truco.
- **Engine Core:**
  - `salaStatus: 'waiting' | 'playing' | 'score_screen'`
  - `mesa: Card[]` — As cartas jogadas na rodada atual.
  - `manilha: Card` — O vira.
  - `historicoTruco: TrucoEvent[]` — Para renderizar aquele Modal Gigante de "TRUCO".
  - `pontos: { nos: number, eles: number }`
- **Actions:**
  - `distribuirCartas()`
  - `jogarCarta(playerId, card)`
  - `pedirTruco(playerId)`

### 2.3 `useAuthStore` (Simulação)
- `user: { name, level, moedas, avatar_url }`
- `loginSimulado()`: Injeta estado para pular a tela Falsa de Login caso já esteja setado.

## 3. Gestão de Componentes Visuais

### 3.1 Swipe Container
Um `<div className="flex w-[500vw] transition-transform duration-300">` onde cada `<section>` ocupa `100vw`. O estado `activeTab` determina o `translateX`.

### 3.2 Arena / Mesa (Top-Down com 4 Pods)
```tsx
<div className="game-table bg-truco-green radial-gradient">
  <OpponentTop pod/>
  <div className="center-board">
     {mesa.map(card => <PlayingCard card={card} />)}
  </div>
  <PlayerBottom pod cards={myCards}/>
</div>
```

## 4. Integração Gemini (gêmeos-2.5-flash)
### 4.1 Interface de Chat
Uma bolha que persiste no lobby ou na mesa. As mensagens enviadas são passadas ao hook `useGeminiBot`.
- O Bot recebe: "Você é um jogador de truco folgado do interior de minas. O placar tá 10 a 6 pra você. Responda à provocação."
### 4.2 WebRTC Áudio
Usar hook `useAudioRecorder`, gravar Blob, enviar como base64 no body para endpoint serverless ou simular com text-to-speech local se o foco for somente na transcrição textual rápida via API.

## 5. Árvore de Diretórios
```text
/src
 ├── /assets           (SVGs e Imagens do Baralho, Avatar Mocks)
 ├── /components       (PlayingCard, Avatar, Button, ModalTruco)
 ├── /stores           (useGameStore, useNavigationStore)
 ├── /lib              (truco/rules.ts, gemini/bot.ts)
 ├── /screens
 │    ├── LoginScreen.tsx
 │    ├── LobbyNav.tsx (Arena, Loja, Clãs...)
 │    └── GameTableScreen.tsx
 ├── index.css         (Estilização base e animações-chave)
 └── App.tsx           (Router Root)
```
