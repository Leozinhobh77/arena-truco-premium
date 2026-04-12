import { create } from 'zustand';
import type { Carta, Jogador, ModoJogo, StatusSala } from '../types';
import { gerarBaralho, embaralhar, configurarManilhas } from '../lib/truco/rules';

interface GameState {
  modo: ModoJogo;
  status: StatusSala;
  pontoNos: number;
  pontoEles: number;
  rodadaAtual: number;
  vira?: Carta;
  manilha?: Carta;
  
  // Jogadores na mesa
  myUserId: string; // Para identificar quem sou eu no array
  jogadores: Jogador[];
  mesa: Carta[];

  // Actions
  iniciarPartida: (modo: ModoJogo, userId: string) => void;
  jogarCarta: (jogadorId: string, cartaId: string) => void;
}

// Cria 3 bots hardcoded para simular uma sala com 4 jogadores
const criarBotsDeZoeira = (): Jogador[] => [
  { id: 'bot_1', nome: 'Bastião', avatar: 'https://i.pravatar.cc/150?u=1', nivel: 40, pontos: 0, time: 'eles', pronto: true, isBot: true, cartas: [] },
  { id: 'bot_2', nome: 'Dona Neves', avatar: 'https://i.pravatar.cc/150?u=2', nivel: 20, pontos: 0, time: 'nos', pronto: true, isBot: true, cartas: [] },
  { id: 'bot_3', nome: 'Marcos_Pro', avatar: 'https://i.pravatar.cc/150?u=3', nivel: 99, pontos: 0, time: 'eles', pronto: true, isBot: true, cartas: [] }
];

export const useGameStore = create<GameState>((set, get) => ({
  modo: 'paulista',
  status: 'waiting',
  pontoNos: 0,
  pontoEles: 0,
  rodadaAtual: 1,
  mesa: [],
  myUserId: '',
  jogadores: [],

  iniciarPartida: (modo, userId) => {
    // 1. Setup do Baralho
    const baralho = embaralhar(gerarBaralho());
    const vira = baralho.pop()!;
    // Em mineiro o Vira não determina manilha, mas fica visual, ou podemos esconder.
    const deckComManilhas = configurarManilhas(baralho, modo, vira);

    // 2. Setup dos Jogadores
    const userJogador: Jogador = {
      id: userId,
      nome: 'Você',
      avatar: 'https://i.pravatar.cc/150?u=you',
      nivel: 10,
      pontos: 0,
      time: 'nos',
      pronto: true,
      isBot: false,
      cartas: []
    };

    const todosJogadores = [userJogador, ...criarBotsDeZoeira()];

    // 3. Distribuição (3 cartas pra cada)
    const jogadoresComCartas = todosJogadores.map(j => {
      return {
        ...j,
        cartaJogada: undefined,
        cartas: [deckComManilhas.pop()!, deckComManilhas.pop()!, deckComManilhas.pop()!]
      };
    });

    set({
      modo,
      status: 'playing',
      vira,
      jogadores: jogadoresComCartas,
      mesa: [],
      pontoNos: 0,
      pontoEles: 0,
      rodadaAtual: 1,
      myUserId: userId
    });
  },

  jogarCarta: (jogadorId, cartaId) => {
    set(state => {
      // Evita ações duplicadas se já jogou ou sala não em playing
      if (state.status !== 'playing') return state;

      const newJogadores = [...state.jogadores];
      const playerIndex = newJogadores.findIndex(j => j.id === jogadorId);
      if (playerIndex === -1) return state;

      const player = newJogadores[playerIndex];
      const cardIndex = player.cartas.findIndex(c => c.id === cartaId);
      if (cardIndex === -1 || player.cartaJogada) return state;

      const cartaJogada = player.cartas[cardIndex];
      
      // Remove da mão
      const newCartas = [...player.cartas];
      newCartas.splice(cardIndex, 1);

      newJogadores[playerIndex] = {
        ...player,
        cartas: newCartas,
        cartaJogada: cartaJogada
      };

      const newMesa = [...state.mesa, cartaJogada];

      // Poderia checar aqui se a rodada acabou (mesa.length === 4)
      return {
        jogadores: newJogadores,
        mesa: newMesa
      };
    });
  }
}));
