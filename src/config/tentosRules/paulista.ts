// ============================================================
// TRUCO PAULISTA — Sistema de Tentos/Pontuação
// Sequência: 1 → 3 → 6 → 9 → 12
// ============================================================

/**
 * Valores de tentos possíveis no Truco Paulista
 */
export type TentoPaulista = 1 | 3 | 6 | 9 | 12;

/**
 * Tipo de aumento (comando do jogador)
 */
export type ComandoPaulista = 'inicial' | 'truco' | 'seis' | 'nove' | 'doze';

export const TRUCO_PAULISTA_TENTOS = {
  // Sequência de tentos (em ordem)
  sequencia: [1, 3, 6, 9, 12] as TentoPaulista[],

  // Mapeamento: valor atual → próximo valor
  proximoTento: {
    1: 3,
    3: 6,
    6: 9,
    9: 12,
    12: null, // Máximo alcançado
  } as Record<number, TentoPaulista | null>,

  // Mapeamento: comando → valor de tentos
  comandoParaTento: {
    'inicial': 1,    // Começa com 1
    'truco': 3,      // Grita TRUCO = 3
    'seis': 6,       // Grita SEIS = 6
    'nove': 9,       // Grita NOVE = 9
    'doze': 12,      // Grita DOZE = 12
  } as Record<ComandoPaulista, TentoPaulista>,

  // Descrição visual para exibição
  descricoes: {
    1: '1 Tento (inicial)',
    3: '3 Tentos (Truco)',
    6: '6 Tentos (Seis)',
    9: '9 Tentos (Nove)',
    12: '12 Tentos (Doze) - MÁXIMO',
  } as Record<TentoPaulista, string>,

  // Hierarquia visual
  hierarquiaCompleta: `
    ╔════════════════════════════════════════════╗
    ║   SEQUÊNCIA DE TENTOS — TRUCO PAULISTA     ║
    ╠════════════════════════════════════════════╣
    ║ 1. Começa     → 1 TENTO (vale 1 ponto)     ║
    ║ 2. TRUCO      → 3 TENTOS (vale 3 pontos)   ║
    ║ 3. SEIS       → 6 TENTOS (vale 6 pontos)   ║
    ║ 4. NOVE       → 9 TENTOS (vale 9 pontos)   ║
    ║ 5. DOZE       → 12 TENTOS (MÁXIMO)         ║
    ╚════════════════════════════════════════════╝
  `,
};

/**
 * Obtém o próximo valor de tentos
 * @param tentoAtual Valor atual de tentos
 * @returns Próximo valor ou null se já está no máximo
 */
export function obterProximoTento(tentoAtual: number): TentoPaulista | null {
  return TRUCO_PAULISTA_TENTOS.proximoTento[tentoAtual] || null;
}

/**
 * Obtém o valor de tentos para um comando
 * @param comando Comando gritado pelo jogador
 * @returns Valor de tentos correspondente
 */
export function obterTentoPorComando(comando: ComandoPaulista): TentoPaulista {
  return TRUCO_PAULISTA_TENTOS.comandoParaTento[comando];
}

/**
 * Obtém a descrição de um valor de tentos
 * @param tentos Valor de tentos
 * @returns Descrição formatada
 */
export function obterDescricaoTento(tentos: TentoPaulista): string {
  return TRUCO_PAULISTA_TENTOS.descricoes[tentos] || 'Desconhecido';
}

/**
 * Verifica se já alcançou o máximo de tentos
 */
export function éMaximoTento(tentos: number): boolean {
  return tentos === 12;
}

/**
 * Valida se um valor é válido para o Paulista
 */
export function éTentoValido(tentos: number): tentos is TentoPaulista {
  return [1, 3, 6, 9, 12].includes(tentos);
}
