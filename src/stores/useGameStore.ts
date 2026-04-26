import { create } from 'zustand';
import type { Carta, Jogador, ModoJogo, StatusSala } from '../types';
import { gerarBaralho, embaralhar, configurarManilhas } from '../lib/truco/rules';
import { determinarVencedorRodada, rodadaPronta, limparRodada, obterTimeVencedor, type ResultadoRodada } from '../lib/truco/rodada';
import {
  obterProximoTentoMineiro,
  obterProximoTentoPaulista,
  type TentoMineiro,
  type TentoPaulista,
  type ComandoMineiro,
  type ComandoPaulista,
} from '../config/tentosRules';
import {
  validarRespostaTruco,
  calcularPontosRecusa,
  criarTrucoPendente,
  type TrucoPendente,
} from '../lib/truco/trucoLogic';

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

  // Tentos (pontuação da rodada)
  tentoAtual: TentoMineiro | TentoPaulista;
  historicoTrucos: {
    tentosOfertados: (TentoMineiro | TentoPaulista)[];
    quemOfertou: string[];
    comandos: (ComandoMineiro | ComandoPaulista)[];
  };

  // Resultado da rodada (para exibição)
  ultimoResultado?: ResultadoRodada;

  // Truco aguardando resposta
  trucoAguardandoResposta: TrucoPendente | null;

  // Actions
  iniciarPartida: (modo: ModoJogo, userId: string) => void;
  jogarCarta: (jogadorId: string, cartaId: string) => void;
  aumentarTento: (jogadorId: string, comando: ComandoMineiro | ComandoPaulista) => void;
  aceitarTruco: (jogadorId: string) => void;
  recusarTruco: (jogadorId: string) => void;
  determinarVencedor: () => void;
  proximaRodada: () => void;
}

// Cria 3 bots hardcoded para simular uma sala com 4 jogadores
const criarBotsDeZoeira = (): Jogador[] => [
  { id: 'bot_1', nome: 'Bastião', avatar: 'https://i.pravatar.cc/150?u=1', nivel: 40, pontos: 0, time: 'eles', pronto: true, isBot: true, cartas: [] },
  { id: 'bot_2', nome: 'Dona Neves', avatar: 'https://i.pravatar.cc/150?u=2', nivel: 20, pontos: 0, time: 'nos', pronto: true, isBot: true, cartas: [] },
  { id: 'bot_3', nome: 'Marcos_Pro', avatar: 'https://i.pravatar.cc/150?u=3', nivel: 99, pontos: 0, time: 'eles', pronto: true, isBot: true, cartas: [] }
];

export const useGameStore = create<GameState>((set) => ({
  modo: 'paulista',
  status: 'waiting',
  pontoNos: 0,
  pontoEles: 0,
  rodadaAtual: 1,
  mesa: [],
  myUserId: '',
  jogadores: [],
  tentoAtual: 1 as any, // Será atualizado no iniciarPartida
  historicoTrucos: {
    tentosOfertados: [],
    quemOfertou: [],
    comandos: [],
  },
  ultimoResultado: undefined,
  trucoAguardandoResposta: null,

  /**
   * Inicializa uma nova partida: gera e embaralha o baralho, configura
   * as manilhas de acordo com o modo, distribui 3 cartas por jogador
   * e popula a mesa com 3 bots hardcoded.
   * @param modo - 'paulista' (manilha pelo vira) ou 'mineiro' (manilha fixa)
   * @param userId - ID do jogador humano local
   */
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

    // ── Inicializar tentos conforme o modo ──
    const tentoInicial = modo === 'mineiro' ? (2 as TentoMineiro) : (1 as TentoPaulista);

    set({
      modo,
      status: 'playing',
      vira,
      jogadores: jogadoresComCartas,
      mesa: [],
      pontoNos: 0,
      pontoEles: 0,
      rodadaAtual: 1,
      myUserId: userId,
      tentoAtual: tentoInicial,
      historicoTrucos: {
        tentosOfertados: [tentoInicial],
        quemOfertou: ['sistema'],
        comandos: ['inicial'],
      },
    });
  },

  /**
   * Remove uma carta da mão do jogador e a coloca na mesa central.
   * Operação idempotente: ignora se o jogador já jogou ou a sala não
   * está em status 'playing'. A verificação de fim de rodada é TODO Sprint 3.
   * @param jogadorId - ID do jogador que está jogando
   * @param cartaId - ID da carta a ser jogada
   */
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
  },

  /**
   * Aumenta os tentos quando um jogador grita um comando (TRUCO, SEIS, NOVE, DOZE)
   * Cria um TrucoPendente e aguarda resposta do time adversário
   * @param jogadorId ID do jogador que está aumentando
   * @param comando Tipo de aumento (truco, seis, nove, doze)
   */
  aumentarTento: (jogadorId, comando) => {
    set(state => {
      // Já há um truco aguardando resposta?
      if (state.trucoAguardandoResposta?.ativo) {
        console.warn('❌ Há um truco aguardando resposta. Responda primeiro!');
        return state;
      }

      // Determinar o próximo tentos baseado no modo
      let proximoTento: TentoMineiro | TentoPaulista | null;

      if (state.modo === 'mineiro') {
        proximoTento = obterProximoTentoMineiro(state.tentoAtual as TentoMineiro);
      } else {
        proximoTento = obterProximoTentoPaulista(state.tentoAtual as TentoPaulista);
      }

      if (!proximoTento) {
        console.warn('❌ Já está no máximo de tentos (12)');
        return state;
      }

      // Criar o truco pendente
      const trucoPendente = criarTrucoPendente(
        jogadorId,
        state.tentoAtual as number,
        proximoTento as number,
        comando,
        state.jogadores
      );

      const nomeJogador = state.jogadores.find(j => j.id === jogadorId)?.nome || jogadorId;
      console.log(`🎯 ${nomeJogador} gritou "${comando.toUpperCase()}"!`);
      console.log(`📈 Tentos: ${state.tentoAtual} → ${proximoTento}`);
      console.log(`⏳ Aguardando resposta do time ${trucoPendente.timeQueResponde}...`);

      return {
        trucoAguardandoResposta: trucoPendente,
      };
    });
  },

  /**
   * Aceita o truco ofertado
   * Valida que o jogador é do time que precisa responder
   * Aumenta permanentemente os tentos e continua o jogo
   * @param jogadorId ID do jogador que está aceitando
   */
  aceitarTruco: (jogadorId) => {
    set(state => {
      const truco = state.trucoAguardandoResposta;

      if (!truco || !truco.ativo) {
        console.warn('❌ Não há truco pendente para aceitar');
        return state;
      }

      // Validar que o jogador é do time que precisa responder
      if (!validarRespostaTruco(jogadorId, truco.timeQueResponde, state.jogadores)) {
        console.warn('❌ Você não é do time que precisa responder!');
        return state;
      }

      const nomeJogador = state.jogadores.find(j => j.id === jogadorId)?.nome || jogadorId;
      console.log(`✅ ${nomeJogador} ACEITOU O TRUCO!`);
      console.log(`📈 Tentos aumentados para: ${truco.novoTento}`);

      const tentoAtualizado = (state.modo === 'mineiro'
        ? truco.novoTento as TentoMineiro
        : truco.novoTento as TentoPaulista);

      return {
        tentoAtual: tentoAtualizado,
        historicoTrucos: {
          tentosOfertados: [...state.historicoTrucos.tentosOfertados, tentoAtualizado],
          quemOfertou: [...state.historicoTrucos.quemOfertou, truco.jogadorQueOfertou],
          comandos: [...state.historicoTrucos.comandos, truco.comando] as (ComandoMineiro | ComandoPaulista)[],
        },
        trucoAguardandoResposta: null,
      } as Partial<GameState>;
    });
  },

  /**
   * Recusa o truco ofertado
   * Valida que o jogador é do time que precisa responder
   * Time que ofereceu ganha os tentos anteriores (antes do aumento)
   * @param jogadorId ID do jogador que está recusando
   */
  recusarTruco: (jogadorId) => {
    set(state => {
      const truco = state.trucoAguardandoResposta;

      if (!truco || !truco.ativo) {
        console.warn('❌ Não há truco pendente para recusar');
        return state;
      }

      // Validar que o jogador é do time que precisa responder
      if (!validarRespostaTruco(jogadorId, truco.timeQueResponde, state.jogadores)) {
        console.warn('❌ Você não é do time que precisa responder!');
        return state;
      }

      // Time que ofereceu ganha os tentos anteriores
      const pontosGanhos = calcularPontosRecusa(truco.tentoAnterior);
      const newPontoNos = truco.timeQueOfertou === 'nos'
        ? state.pontoNos + pontosGanhos
        : state.pontoNos;
      const newPontoEles = truco.timeQueOfertou === 'eles'
        ? state.pontoEles + pontosGanhos
        : state.pontoEles;

      const nomeJogador = state.jogadores.find(j => j.id === jogadorId)?.nome || jogadorId;
      console.log(`❌ ${nomeJogador} RECUSOU O TRUCO!`);
      console.log(`🏆 Time ${truco.timeQueOfertou} ganha ${pontosGanhos} tentos!`);
      console.log(`📊 Placar: Nós ${newPontoNos} x ${newPontoEles} Eles`);

      return {
        pontoNos: newPontoNos,
        pontoEles: newPontoEles,
        trucoAguardandoResposta: null,
        ultimoResultado: {
          vencedorId: null,
          descricao: `Time ${truco.timeQueOfertou} venceu por recusa do truco!`,
          cartasVencedor: [],
          cartaVencedora: undefined,
          éEmpate: false,
        },
      } as unknown as Partial<GameState>;
    });
  },

  /**
   * Determina o vencedor da rodada comparando as cartas
   * Atualiza o estado com o resultado e registra o ponto (usando tentoAtual)
   */
  determinarVencedor: () => {
    set(state => {
      // Verifica se a rodada está pronta (todos jogaram)
      if (!rodadaPronta(state.jogadores)) {
        console.warn('Rodada não pronta - nem todos jogadores jogaram');
        return state;
      }

      // Calcula o vencedor
      const resultado = determinarVencedorRodada(
        state.jogadores,
        state.modo,
        state.vira
      );

      // Obtém o time do vencedor
      const timeVencedor = obterTimeVencedor(state.jogadores, resultado.vencedorId);

      // Atualiza pontos com os tentos em jogo (não fixo em 1)
      const pontosGanhos = state.tentoAtual;
      const newPontoNos = timeVencedor === 'nos' ? state.pontoNos + pontosGanhos : state.pontoNos;
      const newPontoEles = timeVencedor === 'eles' ? state.pontoEles + pontosGanhos : state.pontoEles;

      console.log(`🎯 Rodada ${state.rodadaAtual}: ${resultado.descricao}`);
      console.log(`🏆 ${resultado.vencedorId ? state.jogadores.find(j => j.id === resultado.vencedorId)?.nome : 'Ninguém'} ganhou ${pontosGanhos} TENTOS!`);
      console.log(`📊 Placar: Nós ${newPontoNos} x ${newPontoEles} Eles`);

      return {
        ultimoResultado: resultado,
        pontoNos: newPontoNos,
        pontoEles: newPontoEles,
      };
    });
  },

  /**
   * Prepara para a próxima rodada: limpa cartas jogadas, avança rodada, reseta truco
   */
  proximaRodada: () => {
    set(state => {
      const jogadoresLimpos = limparRodada(state.jogadores);
      const novaRodada = state.rodadaAtual + 1;

      console.log(`🎴 Próxima rodada: ${novaRodada}`);

      // Reset dos tentos para próxima rodada
      const tentoNovaRodada = state.modo === 'mineiro' ? (2 as TentoMineiro) : (1 as TentoPaulista);

      return {
        jogadores: jogadoresLimpos,
        mesa: [],
        rodadaAtual: novaRodada,
        tentoAtual: tentoNovaRodada,
        historicoTrucos: {
          tentosOfertados: [tentoNovaRodada],
          quemOfertou: ['sistema'],
          comandos: ['inicial'],
        },
        ultimoResultado: undefined,
        trucoAguardandoResposta: null,
      };
    });
  },
}));
