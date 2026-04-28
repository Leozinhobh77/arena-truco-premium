// ============================================================
// TRUCO MINEIRO — Regras de Cartas e Manilhas Fixas
// ============================================================

export interface Manilha {
  valor: '4' | '7' | 'A';
  naipe: 'paus' | 'copas' | 'espadas' | 'ouros';
  forçaManilha: number;
  nome: string;
  descricao: string;
}

export const TRUCO_MINEIRO_RULES = {
  // ── MANILHAS FIXAS (ordem de força de maior para menor) ──
  manilhas: [
    {
      valor: '4',
      naipe: 'paus',
      forçaManilha: 4,
      nome: 'Zap',
      descricao: '4 de Paus - Manilha mais forte',
    },
    {
      valor: '7',
      naipe: 'copas',
      forçaManilha: 3,
      nome: 'Coração',
      descricao: '7 de Copas',
    },
    {
      valor: 'A',
      naipe: 'espadas',
      forçaManilha: 2,
      nome: 'Espadilha',
      descricao: 'Ás de Espadas',
    },
    {
      valor: '7',
      naipe: 'ouros',
      forçaManilha: 1,
      nome: 'Sete de Ouro',
      descricao: '7 de Ouros - Manilha mais fraca',
    },
  ] as Manilha[],

  // ── ORDEM DAS CARTAS NORMAIS (de mais fraca para mais forte) ──
  // Índice = força. Quanto maior o número, mais forte a carta.
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
  } as Record<string, number>,

  // ── NAIPES (para desempate entre manilhas) ──
  // Quando duas manilhas se enfrentam, ganha a ordem de naipes
  naipes: {
    'paus': 1,      // Mais fraco
    'espadas': 2,
    'ouros': 3,
    'copas': 4,     // Mais forte
  } as Record<string, number>,

  // ── HIERARQUIA SIMPLIFICADA (referência visual) ──
  hierarquiaCompleta: `
    ╔════════════════════════════════════════════════╗
    ║   HIERARQUIA COMPLETA — TRUCO MINEIRO         ║
    ╠════════════════════════════════════════════════╣
    ║ MANILHAS (sempre vencem):                      ║
    ║   1. 4 de Paus (Zap)        ← MAIS FORTE      ║
    ║   2. 7 de Copas (Coração)                      ║
    ║   3. Ás de Espadas (Espadilha)                 ║
    ║   4. 7 de Ouros                                ║
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

// ── TIPO EXPORTADO PARA REUTILIZAÇÃO ──
export type CardHierarchyMineiro = typeof TRUCO_MINEIRO_RULES;
