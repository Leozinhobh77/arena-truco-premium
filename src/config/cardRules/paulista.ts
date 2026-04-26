// ============================================================
// TRUCO PAULISTA — Regras de Cartas e Manilhas Variáveis
// ============================================================

import type { Valor, Naipe } from '../../types';

/**
 * Interface para as manilhas dinâmicas do Paulista
 */
export interface ManilhaPaulista {
  valor: Valor;
  naipe: Naipe;
  forçaManilha: number;
  nome: string;
}

/**
 * Gera as manilhas do Paulista baseado na vira
 * @param vira Carta que foi virada (determina a manilha)
 * @returns Array com as 4 manilhas em ordem de força
 */
export function gerarManilhasPaulista(vira: Valor): ManilhaPaulista[] {
  // A manilha é a próxima carta na sequência
  const manilhaValor = proximaCartaNaSequencia(vira);

  return [
    {
      valor: manilhaValor,
      naipe: 'paus',
      forçaManilha: 4,
      nome: `${manilhaValor} de Paus (Zap)`,
    },
    {
      valor: manilhaValor,
      naipe: 'copas',
      forçaManilha: 3,
      nome: `${manilhaValor} de Copas`,
    },
    {
      valor: manilhaValor,
      naipe: 'espadas',
      forçaManilha: 2,
      nome: `${manilhaValor} de Espadas`,
    },
    {
      valor: manilhaValor,
      naipe: 'ouros',
      forçaManilha: 1,
      nome: `${manilhaValor} de Ouros`,
    },
  ];
}

/**
 * Obtém a próxima carta na sequência (para calcular manilha)
 * Sequência: 4 → 5 → 6 → 7 → Q → J → K → A → 2 → 3 → 4...
 */
function proximaCartaNaSequencia(cartaAtual: Valor): Valor {
  const sequencia: Valor[] = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
  const indice = sequencia.indexOf(cartaAtual);

  if (indice === -1) {
    throw new Error(`Carta inválida: ${cartaAtual}`);
  }

  return sequencia[(indice + 1) % sequencia.length];
}

/**
 * Configuração base do Truco Paulista
 */
export const TRUCO_PAULISTA_BASE = {
  // ── ORDEM DAS CARTAS NORMAIS (de mais fraca para mais forte) ──
  // Índice = força. Quanto maior o número, mais forte a carta.
  // IMPORTANTE: NO PAULISTA A ORDEM É DIFERENTE DO MINEIRO!
  cartasNormais: {
    '4': 1,   // Mais fraca
    '5': 2,
    '6': 3,
    '7': 4,
    'Q': 5,   // Dama
    'J': 6,   // Valete
    'K': 7,   // Rei
    'A': 8,   // Ás
    '2': 9,   // Segunda mais forte (fora manilhas)
    '3': 10,  // Mais forte (fora manilhas)
  } as Record<Valor, number>,

  // ── NAIPES (para desempate entre manilhas) ──
  naipes: {
    'paus': 4,      // Mais forte (Zap)
    'copas': 3,
    'espadas': 2,
    'ouros': 1,     // Mais fraca
  } as Record<Naipe, number>,

  // ── HIERARQUIA SIMPLIFICADA (referência visual) ──
  hierarquiaCompleta: (vira: Valor) => `
    ╔════════════════════════════════════════════════╗
    ║   HIERARQUIA PAULISTA (Vira = ${vira})${' '.repeat(30 - vira.length)}║
    ╠════════════════════════════════════════════════╣
    ║ MANILHA: ${proximaCartaNaSequencia(vira)} (VARIÁVEL - determina pelo vira)      ║
    ║                                                ║
    ║ MANILHAS (sempre vencem):                      ║
    ║   1. ${proximaCartaNaSequencia(vira)} de Paus (Zap)        ← MAIS FORTE      ║
    ║   2. ${proximaCartaNaSequencia(vira)} de Copas                            ║
    ║   3. ${proximaCartaNaSequencia(vira)} de Espadas                          ║
    ║   4. ${proximaCartaNaSequencia(vira)} de Ouros                            ║
    ║                                                ║
    ║ CARTAS NORMAIS (fora manilhas):                ║
    ║   1. 4                      ← MAIS FRACA      ║
    ║   2. 5                                         ║
    ║   3. 6                                         ║
    ║   4. 7                                         ║
    ║   5. Q (Dama)                                  ║
    ║   6. J (Valete) ← mata Dama                    ║
    ║   7. K (Rei)    ← mata Valete                  ║
    ║   8. A (Ás)     ← mata Rei                     ║
    ║   9. 2          ← 2ª mais forte                ║
    ║   10. 3         ← MAIS FORTE (fora manilhas)  ║
    ╚════════════════════════════════════════════════╝
  `,
};

/**
 * Classe para gerenciar as regras dinâmicas do Paulista
 */
export class TrucoPaulistaRegras {
  private vira: Valor;
  private manilhas: ManilhaPaulista[];

  constructor(vira: Valor) {
    this.vira = vira;
    this.manilhas = gerarManilhasPaulista(vira);
  }

  /**
   * Obtém a vira atual
   */
  obterVira(): Valor {
    return this.vira;
  }

  /**
   * Obtém a manilha atual (valor da manilha)
   */
  obterManilha(): Valor {
    return proximaCartaNaSequencia(this.vira);
  }

  /**
   * Obtém todas as 4 manilhas
   */
  obterManilhas(): ManilhaPaulista[] {
    return this.manilhas;
  }

  /**
   * Verifica se uma carta é manilha
   */
  éManilha(valor: Valor, naipe: Naipe): boolean {
    return this.manilhas.some(m => m.valor === valor && m.naipe === naipe);
  }

  /**
   * Obtém a força de uma manilha (se for manilha)
   * Retorna null se não for manilha
   */
  obterForçaManilha(valor: Valor, naipe: Naipe): number | null {
    const manilha = this.manilhas.find(m => m.valor === valor && m.naipe === naipe);
    return manilha?.forçaManilha || null;
  }

  /**
   * Obtém a força de uma carta normal
   */
  obterForçaCartaNormal(valor: Valor): number {
    return TRUCO_PAULISTA_BASE.cartasNormais[valor] || 0;
  }

  /**
   * Obtém a força de um naipe
   */
  obterForçaNaipe(naipe: Naipe): number {
    return TRUCO_PAULISTA_BASE.naipes[naipe] || 0;
  }

  /**
   * Exibe a hierarquia completa no console
   */
  exibirHierarquia(): void {
    console.log(TRUCO_PAULISTA_BASE.hierarquiaCompleta(this.vira));
  }
}
