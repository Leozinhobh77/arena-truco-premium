import { create } from 'zustand';
import { GameState, initializeGame, nextHand, nextRound, canPlayCard, resolveHand, resolveRound, applyRoundPoints, isGameOver, Card, getWinner } from '../game/gameLogic';
import { executeBotTurn, BotPersonality, BotAction, generateBotMessage } from '../game/botAI';

interface GameStore {
  game: GameState | null;
  bot: { id: string; name: string; personality: BotPersonality } | null;
  humanId: string;
  botId: string;
  isBotThinking: boolean;
  botMessage: string | null;
  gameOver: { over: boolean; winner: 1 | 2 | null };

  startGame: (playerName: string, botPersonality: BotPersonality) => void;
  playCard: (cardIndex: number) => void;
  callTruco: (level: 3 | 6 | 9 | 12) => void;
  respondTruco: (accept: boolean) => void;
  triggerBotTurn: () => void;
  clearBotMessage: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  game: null,
  bot: null,
  humanId: 'player-1',
  botId: 'bot-1',
  isBotThinking: false,
  botMessage: null,
  gameOver: { over: false, winner: null },

  startGame: (playerName, botPersonality) => {
    const game = initializeGame(['player-1', 'bot-1']);
    set({
      game,
      bot: { id: 'bot-1', name: 'Master Bot', personality: botPersonality },
      isBotThinking: false,
      botMessage: generateBotMessage('start', botPersonality),
      gameOver: { over: false, winner: null },
    });
  },

  clearBotMessage: () => set({ botMessage: null }),

  playCard: (cardIndex) => {
    const { game, humanId } = get();
    if (!game || game.status !== 'playing' || game.trucoStatus === 'called') return;
    
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (currentPlayer.id !== humanId) return;

    // Remove the card from hand and place on table
    const card = currentPlayer.hand.cards[cardIndex];
    if (!card) return;

    // Mutate state logic locally 
    const newPlayers = [...game.players];
    const playerToUpdate = newPlayers[game.currentPlayerIndex];
    
    playerToUpdate.hand.playedCard = card;
    playerToUpdate.hand.cards = playerToUpdate.hand.cards.filter((_, i) => i !== cardIndex);

    const newTableCards = [...game.tableCards, card];
    
    // Check if hand is complete
    let newGame = { ...game, players: newPlayers, tableCards: newTableCards };
    const allPlayed = newGame.players.every(p => p.hand.playedCard !== undefined);

    if (allPlayed) {
      const { winner, isDraw } = resolveHand(newGame);
      if (winner === 1) newGame.handsWon.team1++;
      if (winner === 2) newGame.handsWon.team2++;

      const roundExt = resolveRound(newGame);
      if (roundExt.winner) {
        newGame = applyRoundPoints(newGame, roundExt.winner);
        const overCheck = isGameOver(newGame);
        if (overCheck.over) {
           set({ game: newGame, gameOver: overCheck });
           return;
        } else {
           // Small delay before next round
           setTimeout(() => {
             set({ game: nextRound(newGame) });
             get().triggerBotTurn();
           }, 2000);
           set({ game: newGame });
           return;
        }
      } else {
        // Next Hand setup
        setTimeout(() => {
          set({ game: nextHand(newGame) });
          get().triggerBotTurn();
        }, 1500);
      }
    } else {
      // Next player turn
      newGame.currentPlayerIndex = (newGame.currentPlayerIndex + 1) % newGame.players.length;
    }

    set({ game: newGame });

    // If it's bot's turn now, trigger it
    get().triggerBotTurn();
  },

  callTruco: (level) => {
    const { game, humanId } = get();
    if (!game) return;
    const caller = game.players.findIndex(p => p.id === humanId);
    set({
      game: { ...game, trucoStatus: 'called', trucoValue: level, trucoCaller: caller }
    });
    get().triggerBotTurn();
  },

  respondTruco: (accept) => {
    const { game, humanId, triggerBotTurn } = get();
    if (!game) return;
    
    if (accept) {
      set({ game: { ...game, trucoStatus: 'accepted' } });
      triggerBotTurn();
    } else {
      // Current team refused, other team wins round
      const callerTeam = game.players[game.trucoCaller!].team;
      const refuserTeam = callerTeam === 1 ? 2 : 1;
      
      let newGame = applyRoundPoints(game, callerTeam);
      const overCheck = isGameOver(newGame);
      if (overCheck.over) {
        set({ game: newGame, gameOver: overCheck });
      } else {
         set({ game: nextRound(newGame) });
         triggerBotTurn();
      }
    }
  },

  triggerBotTurn: () => {
    const { game, bot, botId } = get();
    if (!game || !bot || game.gameOver || game.status !== 'playing') return;

    const currentPlayer = game.players[game.currentPlayerIndex];
    if (currentPlayer.id !== botId) {
      // Wait: bot might need to respond to Truco even if it's not its turn to play a card
      if (game.trucoStatus === 'called' && game.trucoCaller !== game.players.findIndex(p=>p.id === botId)) {
         setTimeout(() => {
           const action = executeBotTurn(bot, currentPlayer.hand.cards, game.trump, game.trucoValue, game.trucoStatus);
           if (action.action === 'play') {
             get().respondTruco(true);
           } else {
             get().respondTruco(false);
           }
         }, 1500);
      }
      return;
    }

    set({ isBotThinking: true });

    setTimeout(() => {
      const g = get().game;
      if (!g) return;
      const action = executeBotTurn(bot, currentPlayer.hand.cards, g.trump, g.trucoValue, g.trucoStatus);

      set({ isBotThinking: false });

      if (action.action === 'truco') {
         set({ botMessage: generateBotMessage('truco', bot.personality) });
         set({
           game: { ...g, trucoStatus: 'called', trucoValue: action.trucoLevel as any, trucoCaller: g.currentPlayerIndex }
         });
      } else if (action.action === 'play') {
         get().playCard(action.cardIndex!);
      }
    }, 1200 + Math.random() * 1000);
  }
}));
