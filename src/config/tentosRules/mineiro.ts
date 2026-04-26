// ============================================================
// TRUCO MINEIRO — Sistema de Tentos/Pontuação
// Sequência: 2 → 4 → 8 → 10 → 12
// ============================================================

/**
 * Valores de tentos possíveis no Truco Mineiro
 */
export type TentoMineiro = 2 | 4 | 8 | 10 | 12;

/**
 * Tipo de aumento (comando do jogador)
 */
export type ComandoMineiro = 'inicial' | 'truco' | 'seis' | 'nove' | 'doze';

export const TRUCO_MINEIRO_TENTOS = {
  // Sequência de tentos (em ordem)
  sequencia: [2, 4, 8, 10, 12] as TentoMineiro[],

  // Mapeamento: valor atual → próximo valor
  proximoTento: {
    2: 4,
    4: 8,
    8: 10,
    10: 12,
    12: null, // Máximo alcançado
  } as Record<number, TentoMineiro | null>,

  // Mapeamento: comando → valor de tentos
  comandoParaTento: {
    'inicial': 2,    // Começa com 2
    'truco': 4,      // Grita TRUCO = 4
    'seis': 8,       // Grita SEIS = 8
    'nove': 10,      // Grita NOVE = 10
    'doze': 12,      // Grita DOZE = 12
  } as Record<ComandoMineiro, TentoMineiro>,

  // Descrição visual para exibição
  descricoes: {
    2: '2 Tentos (inicial)',
    4: '4 Tentos (Truco)',
    8: '8 Tentos (Seis)',
    10: '10 Tentos (Nove)',
    12: '12 Tentos (Doze) - MÁXIMO',
  } as Record<TentoMineiro, string>,

  // Hierarquia visual
  hierarquiaCompleta: `
    ╔════════════════════════════════════════════╗
    ║   SEQUÊNCIA DE TENTOS — TRUCO MINEIRO      ║
    ╠════════════════════════════════════════════╣
    ║ 1. Começa     → 2 TENTOS (vale 2 pontos)   ║
    ║ 2. TRUCO      → 4 TENTOS (vale 4 pontos)   ║
    ║ 3. SEIS       → 8 TENTOS (vale 8 pontos)   ║
    ║ 4. NOVE       → 10 TENTOS (vale 10 pontos) ║
    ║ 5. DOZE       → 12 TENTOS (MÁXIMO)         ║
    ╚════════════════════════════════════════════╝
  `,
};

/**
 * Obtém o próximo valor de tentos
 * @param tentoAtual Valor atual de tentos
 * @returns Próximo valor ou null se já está no máximo
 */
export function obterProximoTento(tentoAtual: number): TentoMineiro | null {
  return TRUCO_MINEIRO_TENTOS.proximoTento[tentoAtual] || null;
}

/**
 * Obtém o valor de tentos para um comando
 * @param comando Comando gritado pelo jogador
 * @returns Valor de tentos correspondente
 */
export function obterTentoPorComando(comando: ComandoMineiro): TentoMineiro {
  return TRUCO_MINEIRO_TENTOS.comandoParaTento[comando];
}

/**
 * Obtém a descrição de um valor de tentos
 * @param tentos Valor de tentos
 * @returns Descrição formatada
 */
export function obterDescricaoTento(tentos: TentoMineiro): string {
  return TRUCO_MINEIRO_TENTOS.descricoes[tentos] || 'Desconhecido';
}

/**
 * Verifica se já alcançou o máximo de tentos
 */
export function éMaximoTento(tentos: number): boolean {
  return tentos === 12;
}

/**
 * Valida se um valor é válido para o Mineiro
 */
export function éTentoValido(tentos: number): tentos is TentoMineiro {
  return [2, 4, 8, 10, 12].includes(tentos);
}
