// ============================================================
// TRUCO RULES ENGINE
// Engine agnóstica para Truco Paulista e Mineiro
// ============================================================

import { Naipe, Valor, Carta, ModoJogo } from '../../types';

// Array de naipes padrão
export const NAIPES: Naipe[] = ['ouros', 'espadas', 'copas', 'paus'];

// Hierarquia padrão do "Baralho Limpo" (menor para maior)
export const VALORES_HIERARQUIA: Valor[] = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];

/**
 * Força natural da carta baseada no índice do array
 */
export function getForcaBase(valor: Valor): number {
  return VALORES_HIERARQUIA.indexOf(valor);
}

/**
 * Gera um baralho completo (40 cartas sem 8, 9, 10, Jokers)
 */
export function gerarBaralho(): Carta[] {
  const baralho: Carta[] = [];
  let id = 1;

  for (const naipe of NAIPES) {
    for (const valor of VALORES_HIERARQUIA) {
      baralho.push({
        id: `card_${id++}`,
        valor,
        naipe,
        forcaBase: getForcaBase(valor),
        ehManilha: false,
      });
    }
  }

  return baralho;
}

/**
 * Embaralha o deck (Algoritmo Fisher-Yates)
 */
export function embaralhar(baralho: Carta[]): Carta[] {
  const clone = [...baralho];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

/**
 * Identifica o valor da Manilha no Truco Paulista
 * (A carta 'acima' do vira)
 */
export function getManilhaPaulistaFallback(vira: Valor): Valor {
  const indiceVira = VALORES_HIERARQUIA.indexOf(vira);
  // Se for 3 (indice 9), volta pro 4 (indice 0)
  const indiceManilha = (indiceVira + 1) % VALORES_HIERARQUIA.length;
  return VALORES_HIERARQUIA[indiceManilha];
}

/**
 * Configura as manilhas de acordo com o Vira e Modo
 */
export function configurarManilhas(
  baralho: Carta[],
  modo: ModoJogo,
  vira?: Carta
): Carta[] {
  return baralho.map((carta) => {
    let ehManilha = false;

    if (modo === 'mineiro') {
      // Manilhas fixas (Zap, Copas, Espadilha, Pica-fumo/Ouros)
      if (carta.valor === '4' && carta.naipe === 'paus') ehManilha = true;
      if (carta.valor === '7' && carta.naipe === 'copas') ehManilha = true;
      if (carta.valor === 'A' && carta.naipe === 'espadas') ehManilha = true;
      if (carta.valor === '7' && carta.naipe === 'ouros') ehManilha = true;
    } else if (modo === 'paulista' && vira) {
      // Manilha de acordo com o vira
      const valorManilha = getManilhaPaulistaFallback(vira.valor);
      if (carta.valor === valorManilha) {
        ehManilha = true;
      }
    }

    return { ...carta, ehManilha };
  });
}

/**
 * Calcula a força absoluta de uma carta em jogo (0 a 14)
 * Força normal (0 a 9)
 * Força das manilhas por naipe (11 a 14) -> Ouros(11), Espadas(12), Copas(13), Paus(14)
 */
export function getForcaAbsoluta(carta: Carta): number {
  if (!carta.ehManilha) return carta.forcaBase;

  // Se é manilha, a força depende do naipe (padrão paulista e mineiro de pesos)
  switch (carta.naipe) {
    case 'ouros': return 11;
    case 'espadas': return 12;
    case 'copas': return 13;
    case 'paus': return 14;
    default: return 10;
  }
}
