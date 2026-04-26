// ============================================================
// LÓGICA DE TRUCO — Sistema de Aceitar/Recusar
// ============================================================

import type { Jogador } from '../../types';

/**
 * Estado de um truco pendente (aguardando resposta)
 */
export interface TrucoPendente {
  ativo: boolean;
  jogadorQueOfertou: string; // ID de quem gritou TRUCO
  timeQueOfertou: 'nos' | 'eles'; // Time de quem ofereceu
  timeQueResponde: 'nos' | 'eles'; // Time que precisa responder
  tentoAnterior: number; // Tentos ANTES do truco (para recusa)
  novoTento: number; // Tentos DO truco (se aceitar)
  comando: string; // 'truco', 'seis', 'nove', 'doze'
}

/**
 * Valida se o jogador que está respondendo é do time adversário
 * @param jogadorId ID do jogador que quer responder
 * @param timeQueResponde Time que precisa responder
 * @param jogadores Lista de jogadores
 * @returns true se é válido responder
 */
export function validarRespostaTruco(
  jogadorId: string,
  timeQueResponde: 'nos' | 'eles',
  jogadores: Jogador[]
): boolean {
  const jogador = jogadores.find(j => j.id === jogadorId);
  if (!jogador) return false;

  // Verifica se o jogador é do time que precisa responder
  return jogador.time === timeQueResponde;
}

/**
 * Calcula pontos ganhos se o truco for recusado
 * O time que ofereceu ganha os tentos ANTERIORES (antes do aumento)
 * @param tentoAnterior Valor de tentos antes do truco
 * @returns Pontos ganhos pelo time que ofereceu
 */
export function calcularPontosRecusa(tentoAnterior: number): number {
  return tentoAnterior;
}

/**
 * Cria um objeto de truco pendente
 */
export function criarTrucoPendente(
  jogadorQueOfertou: string,
  tentoAnterior: number,
  novoTento: number,
  comando: string,
  jogadores: Jogador[]
): TrucoPendente {
  const jogador = jogadores.find(j => j.id === jogadorQueOfertou);
  if (!jogador) {
    throw new Error(`Jogador ${jogadorQueOfertou} não encontrado`);
  }

  const timeQueOfertou = jogador.time;
  const timeQueResponde = timeQueOfertou === 'nos' ? 'eles' : 'nos';

  return {
    ativo: true,
    jogadorQueOfertou,
    timeQueOfertou,
    timeQueResponde,
    tentoAnterior,
    novoTento,
    comando,
  };
}

/**
 * Obtém o time que precisa responder
 */
export function obterTimeQueResponde(timeQueOfertou: 'nos' | 'eles'): 'nos' | 'eles' {
  return timeQueOfertou === 'nos' ? 'eles' : 'nos';
}

/**
 * Descrição legível do truco pendente
 */
export function descricaoTrucoPendente(truco: TrucoPendente): string {
  const nomeOfertante = `Time ${truco.timeQueOfertou}`;
  const nomeQuResponde = `Time ${truco.timeQueResponde}`;

  return `${nomeOfertante} ofereceu "${truco.comando.toUpperCase()}" (${truco.tentoAnterior} → ${truco.novoTento} tentos). ${nomeQuResponde} precisa responder!`;
}
