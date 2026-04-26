// ============================================================
// CARD COMPARISON — Sistema de Comparação de Cartas
// Banco de Consulta Rápida (O(1)) para o Truco Mineiro
// ============================================================

import { TRUCO_MINEIRO_RULES } from '../config/cardRules/mineiro';
import type { Carta, Naipe, Valor } from '../types';

/**
 * Resultado da comparação entre duas cartas
 */
export type CartaComparacaoResultado = 'carta1' | 'carta2' | 'empate';

/**
 * Força numérica de uma carta (usada internamente para comparação rápida)
 */
export interface CartaForça {
  valor: Valor;
  naipe: Naipe;
  forçaTotal: number;
  éManilha: boolean;
  forçaInterna: number; // força da manilha ou força normal
}

/**
 * Compara duas cartas e retorna qual é mais forte
 * @param carta1 Primeira carta a comparar
 * @param carta2 Segunda carta a comparar
 * @returns 'carta1' se carta1 vence, 'carta2' se carta2 vence, 'empate' se são iguais
 */
export function comparaCartas(
  carta1: Carta,
  carta2: Carta
): CartaComparacaoResultado {
  const forçaCarta1 = obterForçaCarta(carta1);
  const forçaCarta2 = obterForçaCarta(carta2);

  if (forçaCarta1.forçaTotal > forçaCarta2.forçaTotal) {
    return 'carta1';
  }

  if (forçaCarta2.forçaTotal > forçaCarta1.forçaTotal) {
    return 'carta2';
  }

  // Se as forças são iguais, é empate
  return 'empate';
}

/**
 * Obtém a força numérica de uma carta
 * @param carta Carta a analisar
 * @returns Objeto com informações completas da força da carta
 */
export function obterForçaCarta(carta: Carta): CartaForça {
  const rules = TRUCO_MINEIRO_RULES;

  // ── PASSO 1: Verificar se é manilha ──
  const manilhaEncontrada = rules.manilhas.find(
    m => m.valor === carta.valor && m.naipe === carta.naipe
  );

  if (manilhaEncontrada) {
    // Manilhas têm força base de 1000+
    // Quanto maior o forçaManilha, mais forte a manilha
    // Ex: 4 de Paus = 1000 + 4 = 1004 (mais forte)
    // Ex: 7 de Ouros = 1000 + 1 = 1001 (mais fraca)
    const forçaTotal = 1000 + manilhaEncontrada.forçaManilha;

    return {
      valor: carta.valor,
      naipe: carta.naipe,
      forçaTotal,
      éManilha: true,
      forçaInterna: manilhaEncontrada.forçaManilha,
    };
  }

  // ── PASSO 2: Se não é manilha, usar força normal ──
  const forçaNormal = rules.cartasNormais[carta.valor] || 0;

  return {
    valor: carta.valor,
    naipe: carta.naipe,
    forçaTotal: forçaNormal,
    éManilha: false,
    forçaInterna: forçaNormal,
  };
}

/**
 * Obtém a ordem de força de um naipe (para futuros desempates de manilhas)
 * @param naipe Naipe a verificar
 * @returns Número representando força do naipe
 */
export function obterForçaNaipe(naipe: Naipe): number {
  return TRUCO_MINEIRO_RULES.naipes[naipe] || 0;
}

/**
 * Verifica se uma carta é manilha
 * @param carta Carta a verificar
 * @returns true se é manilha, false caso contrário
 */
export function éManilha(carta: Carta): boolean {
  return TRUCO_MINEIRO_RULES.manilhas.some(
    m => m.valor === carta.valor && m.naipe === carta.naipe
  );
}

/**
 * Obtém o nome da manilha (se for uma)
 * @param carta Carta a verificar
 * @returns Nome da manilha ou null
 */
export function obterNomeManilha(carta: Carta): string | null {
  const manilha = TRUCO_MINEIRO_RULES.manilhas.find(
    m => m.valor === carta.valor && m.naipe === carta.naipe
  );
  return manilha?.nome || null;
}

/**
 * Exibe no console uma comparação detalhada de duas cartas (DEBUG)
 * @param carta1 Primeira carta
 * @param carta2 Segunda carta
 */
export function exibirComparacaoDebug(carta1: Carta, carta2: Carta): void {
  const força1 = obterForçaCarta(carta1);
  const força2 = obterForçaCarta(carta2);
  const resultado = comparaCartas(carta1, carta2);

  console.log('╔════════════════════════════════════════════╗');
  console.log('║  COMPARAÇÃO DE CARTAS (DEBUG)             ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log(`Carta 1: ${carta1.valor} de ${carta1.naipe}`);
  console.log(`  → Força Total: ${força1.forçaTotal}`);
  console.log(`  → É Manilha: ${força1.éManilha}`);
  console.log('');
  console.log(`Carta 2: ${carta2.valor} de ${carta2.naipe}`);
  console.log(`  → Força Total: ${força2.forçaTotal}`);
  console.log(`  → É Manilha: ${força2.éManilha}`);
  console.log('');
  console.log(`RESULTADO: ${resultado === 'carta1' ? '🎴 Carta 1 vence!' : resultado === 'carta2' ? '🎴 Carta 2 vence!' : '⚡ Empate!'}`);
  console.log('╚════════════════════════════════════════════╝');
}
