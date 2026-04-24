// ============================================
// IA DOS BOTS
// ============================================

import type { Card } from './gameLogic';
import { getCardValue } from './gameLogic';

export type BotPersonality = 'aggressive' | 'defensive' | 'neutral';

export interface BotDecision {
  cardIndex: number;
  action: 'play' | 'truco' | 'fold';
  confidence: number;
}

export interface BotChatMessage {
  text: string;
  probability: number;
}

export interface BotAction {
  action: 'play' | 'truco' | 'fold';
  cardIndex?: number;
  trucoLevel?: 3 | 6 | 9 | 12;
}

// Calcular força da mão (0 a 1)
export function calculateHandStrength(
  cards: Card[],
  trump: Card
): number {
  if (cards.length === 0) return 0;

  let totalValue = 0;
  for (const card of cards) {
    totalValue += getCardValue(card, trump);
  }

  // Normalizar: valor máximo seria 14 * 3 = 42
  return Math.min(totalValue / 42, 1);
}

// Decidir melhor carta para jogar
export function chooseBestCard(
  hand: Card[],
  trump: Card,
  personality: BotPersonality,
  roundNumber: number
): number {
  if (hand.length === 0) return 0;

  const handStrength = calculateHandStrength(hand, trump);

  // Estratégia agressiva: joga carta forte cedo
  if (personality === 'aggressive' && handStrength > 0.6) {
    return findStrongestCard(hand, trump);
  }

  // Estratégia defensiva: guarda cartas fortes
  if (personality === 'defensive' && roundNumber === 1) {
    return findWeakestCard(hand, trump);
  }

  // Estratégia neutra: aleatoriedade com preferência por cartas médias
  return findRandomCard(hand);
}

// Encontrar carta mais forte
function findStrongestCard(hand: Card[], trump: Card): number {
  let maxValue = -1;
  let bestIndex = 0;

  for (let i = 0; i < hand.length; i++) {
    const value = getCardValue(hand[i], trump);
    if (value > maxValue) {
      maxValue = value;
      bestIndex = i;
    }
  }

  return bestIndex;
}

// Encontrar carta mais fraca
function findWeakestCard(hand: Card[], trump: Card): number {
  let minValue = 999;
  let bestIndex = 0;

  for (let i = 0; i < hand.length; i++) {
    const value = getCardValue(hand[i], trump);
    if (value < minValue) {
      minValue = value;
      bestIndex = i;
    }
  }

  return bestIndex;
}

// Carta aleatória
function findRandomCard(hand: Card[]): number {
  return Math.floor(Math.random() * hand.length);
}

// Decidir se pede "Truco"
export function shouldCallTruco(
  handStrength: number,
  personality: BotPersonality,
  roundsWon: number
): boolean {
  const thresholds: Record<BotPersonality, number> = {
    aggressive: 0.6,
    neutral: 0.7,
    defensive: 0.8,
  };

  const threshold = thresholds[personality];
  const boost = roundsWon > 0 ? 0.1 : 0; // Boost se já ganhou rodada

  return handStrength >= threshold - boost && Math.random() < 0.4;
}

// Decidir se aceita "Truco"
export function shouldAcceptTruco(
  handStrength: number,
  personality: BotPersonality
): boolean {
  const thresholds: Record<BotPersonality, number> = {
    aggressive: 0.4,
    neutral: 0.45,
    defensive: 0.5,
  };

  return handStrength >= thresholds[personality];
}

// Decidir se pede "Seis"
export function shouldCallSix(
  handStrength: number,
  personality: BotPersonality
): boolean {
  const thresholds: Record<BotPersonality, number> = {
    aggressive: 0.75,
    neutral: 0.8,
    defensive: 0.9,
  };

  return handStrength >= thresholds[personality] && Math.random() < 0.3;
}

// Decidir se pede "Nove"
export function shouldCallNine(
  handStrength: number,
  personality: BotPersonality
): boolean {
  const thresholds: Record<BotPersonality, number> = {
    aggressive: 0.85,
    neutral: 0.88,
    defensive: 0.95,
  };

  return handStrength >= thresholds[personality] && Math.random() < 0.15;
}

// Decidir se pede "Doze"
export function shouldCallTwelve(
  handStrength: number,
  personality: BotPersonality
): boolean {
  const thresholds: Record<BotPersonality, number> = {
    aggressive: 0.92,
    neutral: 0.94,
    defensive: 0.98,
  };

  return handStrength >= thresholds[personality] && Math.random() < 0.05;
}

// Executar turno completo do bot (decide ação e retorna)
export function executeBotTurn(
  bot: { id: string; name: string; personality: BotPersonality },
  playerHand: Card[],
  trump: Card,
  _trucoValue: number,
  trucoStatus: string
): BotAction {
  const handStrength = calculateHandStrength(playerHand, trump);

  // Se ninguém pediu truco ainda, verificar se pede
  if (trucoStatus === 'none') {
    if (shouldCallTwelve(handStrength, bot.personality)) {
      return { action: 'truco', trucoLevel: 12 };
    }
    if (shouldCallNine(handStrength, bot.personality)) {
      return { action: 'truco', trucoLevel: 9 };
    }
    if (shouldCallSix(handStrength, bot.personality)) {
      return { action: 'truco', trucoLevel: 6 };
    }
    if (shouldCallTruco(handStrength, bot.personality, 0)) {
      return { action: 'truco', trucoLevel: 3 };
    }
  }

  // Se alguém pediu truco, decidir aceitar/recusar/escalar
  if (trucoStatus === 'called') {
    if (shouldAcceptTruco(handStrength, bot.personality)) {
      return { action: 'play', cardIndex: chooseBestCard(playerHand, trump, bot.personality, 1) };
    } else {
      return { action: 'fold' };
    }
  }

  // Caso padrão: jogar carta
  const cardIndex = chooseBestCard(playerHand, trump, bot.personality, 1);
  return { action: 'play', cardIndex };
}

// Gerar mensagem de chat
export function generateBotMessage(
  scenario: 'start' | 'winning' | 'losing' | 'truco' | 'react',
  personality: BotPersonality
): string {
  const messages: Record<string, Record<BotPersonality, string[]>> = {
    start: {
      aggressive: ['Vou ganhar isso! 💪', 'Preparem-se! 🔥', 'Hoje é meu dia!'],
      neutral: ['Vamos jogar! 🎮', 'Boa sorte a todos!', 'Que comece!'],
      defensive: ['Vamos com calma...', 'Jogo prudente...', 'Preciso pensar...'],
    },
    winning: {
      aggressive: ['Eba! Venci! 🎉', 'Eu avisei!', 'Muito fácil! 😎'],
      neutral: ['Consegui! ✨', 'Legal demais!', 'Boa jogada!'],
      defensive: ['Que alívio...', 'Consegui ganhar!', 'Sorte minha!'],
    },
    losing: {
      aggressive: ['Ainda não acabou!', 'Próxima vai ser minha!', 'Cora!'],
      neutral: ['Bem jogado!', 'Você mereceu!', 'Próxima! 💪'],
      defensive: ['Sabia que perderia...', 'Você foi melhor.', 'Meu erro...'],
    },
    truco: {
      aggressive: ['TRUCO! 💪', 'Vou pedir!', 'Raça! 🔥'],
      neutral: ['Truco?', 'Vou tentar!', 'Que tal um truco?'],
      defensive: ['Hmm... acho que...', 'Talvez...', 'Se insistirem...'],
    },
    react: {
      aggressive: ['Muito bom!', 'Isso é jogo!', 'Que emoção! 🎮'],
      neutral: ['Que jogada!', 'Bacana!', 'Interessante...'],
      defensive: ['Ah é?', 'Realmente...', 'Entendo...'],
    },
  };

  const messagesForScenario = messages[scenario][personality];
  return messagesForScenario[Math.floor(Math.random() * messagesForScenario.length)];
}
