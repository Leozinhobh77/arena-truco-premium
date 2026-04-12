// ============================================
// LÓGICA DO TRUCO
// ============================================

export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = '4' | '5' | '6' | '7' | 'Q' | 'J' | 'K' | 'A' | '2' | '3';

export interface Card {
  suit: Suit;
  rank: Rank;
}

export interface Hand {
  cards: Card[];
  playedCard?: Card;
}

export interface GameState {
  id: string;
  round: number;
  handNumber: 1 | 2 | 3;
  players: { id: string; hand: Hand; team: 1 | 2 }[];
  tableCards: Card[];
  trump: Card;
  currentPlayerIndex: number;
  score: { team1: number; team2: number };
  handsWon: { team1: number; team2: number };
  status: 'waiting' | 'playing' | 'finished';
  roundWinner?: 1 | 2;
  message: string;
  trucoValue: 1 | 3 | 6 | 9 | 12;
  trucoStatus: 'none' | 'called' | 'accepted' | 'refused';
  trucoCaller?: number;
}

// Criar baralho Truco (32 cartas, sem 8, 9, 10)
export function createDeck(): Card[] {
  const suits: Suit[] = ['♠', '♥', '♦', '♣'];
  const ranks: Rank[] = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];

  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }

  return shuffle(deck);
}

// Embaralhar baralho (Fisher-Yates)
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Distribuir 3 cartas para cada jogador
export function dealCards(deck: Card[], playerCount: number): Card[][] {
  const hands: Card[][] = [];
  for (let i = 0; i < playerCount; i++) {
    hands.push([]);
  }

  let deckIndex = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < playerCount; j++) {
      hands[j].push(deck[deckIndex++]);
    }
  }

  return hands;
}

// Calcular valor da carta (Truco)
export function getCardValue(card: Card, trump: Card): number {
  // Manilhas: carta seguinte ao "vira" em cada naipe (valor 14)
  if (
    card.rank === getNextRank(trump.rank) &&
    card.suit === trump.suit
  ) {
    return 14;
  }

  // Manilhas de outros naipes (valor 13)
  if (card.rank === getNextRank(trump.rank)) {
    return 13;
  }

  // Valores base
  const rankValues: Record<Rank, number> = {
    '3': 12,
    '2': 11,
    'A': 10,
    'K': 9,
    'J': 8,
    'Q': 7,
    '7': 6,
    '6': 5,
    '5': 4,
    '4': 3,
  };

  return rankValues[card.rank] || 0;
}

// Próximo rank (para calcular manilha)
function getNextRank(rank: Rank): Rank {
  const rankOrder: Rank[] = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
  const index = rankOrder.indexOf(rank);
  return rankOrder[(index + 1) % rankOrder.length];
}

// Calcular vencedor de uma mão
export function getWinner(
  cards: Card[],
  trump: Card,
  leadSuit: Suit
): number {
  let maxValue = -1;
  let winnerIndex = -1;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    // Só contar cartas do naipe de abertura ou manilhas
    if (
      card.suit !== leadSuit &&
      card.rank !== getNextRank(trump.rank)
    ) {
      continue;
    }

    const value = getCardValue(card, trump);
    if (value > maxValue) {
      maxValue = value;
      winnerIndex = i;
    }
  }

  return winnerIndex;
}

// Validar se pode jogar uma carta
export function canPlayCard(
  playerHand: Card[],
  cardIndex: number,
  tableCards: Card[],
  leadSuit?: Suit,
  trump?: Card
): boolean {
  if (cardIndex < 0 || cardIndex >= playerHand.length) {
    return false;
  }

  // Se é primeira carta da mão, sempre pode
  if (tableCards.length === 0) {
    return true;
  }

  // Se deve seguir naipe e tem carta do naipe, deve jogar do naipe
  if (leadSuit && trump) {
    const card = playerHand[cardIndex];
    const hasSuit = playerHand.some((c) => c.suit === leadSuit);

    if (hasSuit && card.suit !== leadSuit) {
      return false;
    }
  }

  return true;
}

// Verificar se todos jogaram nesta mão
export function checkHandComplete(game: GameState): boolean {
  return game.players.every((p) => p.hand.playedCard !== undefined);
}

// Resolver uma mão (determinar vencedor)
export function resolveHand(game: GameState): { winner: 1 | 2; isDraw: boolean } {
  const playedCards = game.players.map((p) => p.hand.playedCard!);
  const leadSuit = playedCards[0].suit;

  const winnerIndex = getWinner(playedCards, game.trump, leadSuit);

  if (winnerIndex === -1) {
    // Empate - quem ganhou a mão anterior (ou quem abrir próxima)
    return { winner: game.handsWon.team1 >= game.handsWon.team2 ? 1 : 2, isDraw: true };
  }

  const winnerTeam = game.players[winnerIndex].team;
  return { winner: winnerTeam, isDraw: false };
}

// Resolver um round (determinar vencedor do round)
export function resolveRound(game: GameState): { winner: 1 | 2 | null } {
  if (game.handsWon.team1 >= 2) return { winner: 1 };
  if (game.handsWon.team2 >= 2) return { winner: 2 };
  return { winner: null };
}

// Aplicar pontos do round
export function applyRoundPoints(game: GameState, winner: 1 | 2): GameState {
  const newGame = { ...game };
  if (winner === 1) {
    newGame.score.team1 += game.trucoValue;
  } else {
    newGame.score.team2 += game.trucoValue;
  }
  newGame.roundWinner = winner;
  return newGame;
}

// Próximo round
export function nextRound(game: GameState): GameState {
  const deck = createDeck();
  const trump = deck[deck.length - 1];
  const dealtCards = dealCards(deck, game.players.length);

  const newPlayers = game.players.map((p, index) => ({
    ...p,
    hand: { cards: dealtCards[index], playedCard: undefined },
  }));

  return {
    ...game,
    round: game.round + 1,
    handNumber: 1,
    players: newPlayers,
    tableCards: [],
    trump,
    currentPlayerIndex: 0,
    handsWon: { team1: 0, team2: 0 },
    trucoValue: 1,
    trucoStatus: 'none',
    message: `Round ${game.round + 1} começou!`,
  };
}

// Próxima mão dentro do round
export function nextHand(game: GameState): GameState {
  const deck = createDeck();
  const trump = deck[deck.length - 1];
  const dealtCards = dealCards(deck, game.players.length);

  const newPlayers = game.players.map((p, index) => ({
    ...p,
    hand: { cards: dealtCards[index], playedCard: undefined },
  }));

  return {
    ...game,
    handNumber: (game.handNumber + 1) as 1 | 2 | 3,
    players: newPlayers,
    tableCards: [],
    trump,
    currentPlayerIndex: (game.currentPlayerIndex + 1) % game.players.length,
    trucoValue: 1,
    trucoStatus: 'none',
    message: `Mão ${game.handNumber + 1} começou!`,
  };
}

// Verificar se o jogo terminou
export function isGameOver(game: GameState): { over: boolean; winner: 1 | 2 | null } {
  if (game.score.team1 >= 12) return { over: true, winner: 1 };
  if (game.score.team2 >= 12) return { over: true, winner: 2 };
  return { over: false, winner: null };
}

// Iniciar jogo
export function initializeGame(playerIds: string[]): GameState {
  const deck = createDeck();
  const trump = deck[deck.length - 1]; // Última carta é o "vira"
  const dealtCards = dealCards(deck, playerIds.length);

  const players = playerIds.map((id, index) => ({
    id,
    hand: { cards: dealtCards[index], playedCard: undefined },
    team: (index % 2) + 1 as 1 | 2,
  }));

  return {
    id: `game-${Date.now()}`,
    round: 1,
    handNumber: 1,
    players,
    tableCards: [],
    trump,
    currentPlayerIndex: 0,
    score: { team1: 0, team2: 0 },
    handsWon: { team1: 0, team2: 0 },
    status: 'playing',
    message: 'Jogo iniciado!',
    trucoValue: 1,
    trucoStatus: 'none',
  };
}
