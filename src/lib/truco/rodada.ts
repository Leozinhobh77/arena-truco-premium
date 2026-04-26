// ============================================================
// LÓGICA DE RODADA — Comparação de Cartas e Vencedor
// Integra o sistema de comparação com a lógica do jogo
// ============================================================

import { comparaCartas, comparaCartasPaulista } from '../../utils/cardComparison';
import { TrucoPaulistaRegras } from '../../config/cardRules/paulista';
import type { Carta, Jogador, ModoJogo } from '../../types';

/**
 * Resultado de uma rodada de cartas
 */
export interface ResultadoRodada {
  vencedorId: string | null; // null = empate
  cartaVencedora: Carta;
  cartaPerdedora?: Carta;
  descricao: string;
  éEmpate: boolean;
}

/**
 * Determina qual jogador vence a rodada comparando as cartas
 * @param jogadores Jogadores que jogaram nesta rodada
 * @param modo Modo de jogo ('mineiro' ou 'paulista')
 * @param vira Carta virada (necessária para Paulista)
 * @returns Resultado da rodada
 */
export function determinarVencedorRodada(
  jogadores: Jogador[],
  modo: ModoJogo,
  vira?: Carta
): ResultadoRodada {
  // Filtra jogadores que jogaram carta nesta rodada
  const jogadoresComCarta = jogadores.filter(j => j.cartaJogada);

  if (jogadoresComCarta.length === 0) {
    return {
      vencedorId: null,
      cartaVencedora: null as any,
      descricao: 'Nenhum jogador jogou carta',
      éEmpate: true,
    };
  }

  if (jogadoresComCarta.length === 1) {
    return {
      vencedorId: jogadoresComCarta[0].id,
      cartaVencedora: jogadoresComCarta[0].cartaJogada!,
      descricao: 'Apenas um jogador na rodada',
      éEmpate: false,
    };
  }

  // ── COMPARAR AS CARTAS ──
  const carta1 = jogadoresComCarta[0].cartaJogada!;
  const carta2 = jogadoresComCarta[1].cartaJogada!;
  const jogador1 = jogadoresComCarta[0];
  const jogador2 = jogadoresComCarta[1];

  // Usa a função apropriada baseado no modo
  let resultado: 'carta1' | 'carta2' | 'empate';

  if (modo === 'paulista' && vira) {
    const regras = new TrucoPaulistaRegras(vira.valor as any);
    resultado = comparaCartasPaulista(carta1, carta2, regras);
  } else {
    resultado = comparaCartas(carta1, carta2);
  }

  // ── PROCESSAR RESULTADO ──
  if (resultado === 'empate') {
    return {
      vencedorId: null,
      cartaVencedora: carta1,
      cartaPerdedora: carta2,
      descricao: `Empate entre ${descricaoCarta(carta1)} e ${descricaoCarta(carta2)}`,
      éEmpate: true,
    };
  }

  if (resultado === 'carta1') {
    return {
      vencedorId: jogador1.id,
      cartaVencedora: carta1,
      cartaPerdedora: carta2,
      descricao: `${jogador1.nome} vence com ${descricaoCarta(carta1)}`,
      éEmpate: false,
    };
  }

  // resultado === 'carta2'
  return {
    vencedorId: jogador2.id,
    cartaVencedora: carta2,
    cartaPerdedora: carta1,
    descricao: `${jogador2.nome} vence com ${descricaoCarta(carta2)}`,
    éEmpate: false,
  };
}

/**
 * Descreve uma carta em português (para exibição)
 */
function descricaoCarta(carta: Carta): string {
  const valores: Record<string, string> = {
    '4': 'Quatro',
    '5': 'Cinco',
    '6': 'Seis',
    '7': 'Sete',
    'Q': 'Dama',
    'J': 'Valete',
    'K': 'Rei',
    'A': 'Ás',
    '2': 'Dois',
    '3': 'Três',
  };

  const naipes: Record<string, string> = {
    'paus': '♠ Paus',
    'copas': '♥ Copas',
    'espadas': '♠ Espadas',
    'ouros': '♦ Ouros',
  };

  return `${valores[carta.valor]} de ${naipes[carta.naipe]}`;
}

/**
 * Verifica se uma rodada está pronta (todos os 4 jogadores jogaram)
 */
export function rodadaPronta(jogadores: Jogador[]): boolean {
  return jogadores.every(j => j.cartaJogada !== undefined);
}

/**
 * Limpa as cartas jogadas de todos os jogadores (para próxima rodada)
 */
export function limparRodada(jogadores: Jogador[]): Jogador[] {
  return jogadores.map(j => ({
    ...j,
    cartaJogada: undefined,
  }));
}

/**
 * Obtém o time do vencedor (para registrar ponto)
 */
export function obterTimeVencedor(
  jogadores: Jogador[],
  vencedorId: string | null
): 'nos' | 'eles' | null {
  if (!vencedorId) return null;

  const vencedor = jogadores.find(j => j.id === vencedorId);
  return vencedor?.time || null;
}
