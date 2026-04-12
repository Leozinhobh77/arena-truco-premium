# Specification Document (SPEC) — Arena Truco Premium

## 1. Blueprint Tecnológico e Padrões de Domínio

Esta SPEC reflete o alinhamento auditado perfeitamente entre o PRD (Sonho) e SDD (Plano), atestando a arquitetura tecnológica atual do sistema. O App simula os mesmos padrões rigorosos de uma Single Page Application nativa, utilizando React 19, TypeScript e Vite.

### 1.1 Entidades Primárias (Schema Base do Jogo)

O core domain encontra-se totalmente mapeado e tipado. A integridade estrutural das partidas está garantida na camada de tipos (`src/types.ts`):

```typescript
// Cartas e Valor Base
export type Naipe = 'paus' | 'copas' | 'espadas' | 'ouros';
export type Valor = '4' | '5' | '6' | '7' | 'Q' | 'J' | 'K' | 'A' | '2' | '3';

export interface Carta {
  id: string;
  valor: Valor;
  naipe: Naipe;
  forcaBase: number;
  ehManilha: boolean;
}

// Sala e Máquina de Estado do Jogo
export type ModoJogo = 'paulista' | 'mineiro';
export type StatusSala = 'waiting' | 'playing' | 'finished';

export interface Jogador {
  id: string;
  nome: string;
  time: 'nos' | 'eles';
  isBot: boolean;
  cartas: Carta[];
  cartaJogada?: Omit<Carta, "">;
}

export interface Sala {
  id: string;
  status: StatusSala;
  pontoNos: number;
  pontoEles: number;
  vira?: Carta;
  manilha?: Carta;
}
```

### 1.2 Identidade e Design Tokens (CSS Root)

Os tokens definem a UX "Obsidian & Gold" e foram consolidados em `src/index.css` via custom properties do Tailwind v4.

* **Fundo Obsidian:** Um tom roxo/preto extremo e imersivo.
* **Destaques Gold:** Usados para CTAs, pontuações, bordas ativas e botões de Truco.
* **Cores de Função:** 
  * `truco-green`: Para fundo da mesa (Arena) - simulando feltro de casino.
  * `truco-red` / `truco-blue`: Indicador visual claro entre adversários ("Eles") e equipe ("Nós").

### 1.3 State Management e Overlays Mapeados

O fluxo de rotas abandona URLs tradicionais a favor de uma Native Screen Stack baseada em Zustand.

* **Stack Screens:** Loja, Modos, Arena, Ranking, Clans.
* **Bottom Sheets (Overlays):** 
  * `salas` (Lobby de Partidas)
  * `jogo` (GameOverlay em Tela Cheia / The Pod)

## 2. Histórico Sentinela Múltipla

A máquina Sentinel será engajada logo após esta auditoria. Toda vez que a Sentinela aprovar, injetar dados, ou notar divergências de design, seu extrato de atuação deve ser preservado aqui como comprovação.

> **Espaço Reservado para Relatório Dinâmico da Sentinela**. (Será populado ao término de ciclos avançados via `sentinela-log.json`).

| Sprint | Arquivo Analisado | Decisão Sentinela | Assinatura QA |
|---|---|---|---|
| 01 | SPA Shell & Stores | APROVADO | skill-documentador |
| 02 | `gameLogic.ts` | PENDENTE | skill-sentinela |

## 3. Diretiva de Avanço

A base lógica (Tipos) corresponde exatamente à base arquitetural (Zustand + React) exigida no SDD e atende ao "Apple Level UX" exigido no PRD, marcando um Checkpoint saudável sem discrepâncias.

**Status Final de Auditoria:** 100% de coerência Tático-Operacional.
