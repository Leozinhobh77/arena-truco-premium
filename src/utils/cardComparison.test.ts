// ============================================================
// TESTES — Card Comparison System
// Exemplos de como o sistema funciona na prática
// ============================================================

import {
  comparaCartas,
  obterForçaCarta,
  éManilha,
  obterNomeManilha,
  exibirComparacaoDebug,
} from './cardComparison';
import type { Carta } from '../types';

/**
 * EXEMPLOS DE USO DO SISTEMA DE COMPARAÇÃO
 * Descomente a função e rode para ver os resultados
 */

// ── EXEMPLO 1: Manilha vs Carta Normal ──
export function exemplo1_ManilhaVsNormal() {
  const zapPaus: Carta = { id: '1', valor: '4', naipe: 'paus', forcaBase: 0, ehManilha: true };
  const tresNormal: Carta = { id: '2', valor: '3', naipe: 'copas', forcaBase: 0, ehManilha: false };

  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 1: Manilha (4 de Paus) vs 3 Normal');
  console.log('═══════════════════════════════════════════');
  exibirComparacaoDebug(zapPaus, tresNormal);
  // Resultado: 4 de Paus vence (é manilha)
}

// ── EXEMPLO 2: Carta Normal vs Carta Normal ──
export function exemplo2_CartaNormalVsNormal() {
  const asEspadas: Carta = { id: '1', valor: 'A', naipe: 'espadas', forcaBase: 0, ehManilha: false };
  const reiOuros: Carta = { id: '2', valor: 'K', naipe: 'ouros', forcaBase: 0, ehManilha: false };

  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 2: Ás de Espadas vs Rei de Ouros');
  console.log('═══════════════════════════════════════════');
  exibirComparacaoDebug(asEspadas, reiOuros);
  // Resultado: Ás vence (força 8 > força 7)
}

// ── EXEMPLO 3: Duas Manilhas ──
export function exemplo3_DuasManilhas() {
  const zapPaus: Carta = { id: '1', valor: '4', naipe: 'paus', forcaBase: 0, ehManilha: true };
  const espadilha: Carta = { id: '2', valor: 'A', naipe: 'espadas', forcaBase: 0, ehManilha: true };

  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 3: 4 de Paus vs Ás de Espadas');
  console.log('═══════════════════════════════════════════');
  exibirComparacaoDebug(zapPaus, espadilha);
  // Resultado: 4 de Paus vence (manilha mais forte)
}

// ── EXEMPLO 4: Empate ──
export function exemplo4_Empate() {
  const asEspadas1: Carta = { id: '1', valor: 'A', naipe: 'espadas', forcaBase: 0, ehManilha: false };
  const asEspadas2: Carta = { id: '2', valor: 'A', naipe: 'espadas', forcaBase: 0, ehManilha: false };

  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 4: Ás de Espadas vs Ás de Espadas');
  console.log('═══════════════════════════════════════════');
  exibirComparacaoDebug(asEspadas1, asEspadas2);
  // Resultado: Empate
}

// ── EXEMPLO 5: Verificar se é manilha ──
export function exemplo5_VerificarManilha() {
  const zapPaus: Carta = { id: '1', valor: '4', naipe: 'paus', forcaBase: 0, ehManilha: true };
  const tresNormal: Carta = { id: '2', valor: '3', naipe: 'copas', forcaBase: 0, ehManilha: false };

  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 5: Verificar se é Manilha');
  console.log('═══════════════════════════════════════════');
  console.log(`4 de Paus é manilha? ${éManilha(zapPaus)} ✓`);
  console.log(`Nome: ${obterNomeManilha(zapPaus)}`);
  console.log(`3 de Copas é manilha? ${éManilha(tresNormal)} ✗`);
}

// ── EXEMPLO 6: Obter força detalhada ──
export function exemplo6_ObtérForçaDetalhada() {
  const zapPaus: Carta = { id: '1', valor: '4', naipe: 'paus', forcaBase: 0, ehManilha: true };
  const tresNormal: Carta = { id: '2', valor: '3', naipe: 'copas', forcaBase: 0, ehManilha: false };

  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 6: Força Detalhada');
  console.log('═══════════════════════════════════════════');
  const força1 = obterForçaCarta(zapPaus);
  const força2 = obterForçaCarta(tresNormal);

  console.log('4 de Paus:', força1);
  console.log('3 de Copas:', força2);
}

// ── FUNÇÃO PARA RODAR TODOS OS EXEMPLOS ──
export function rodarTodosOsExemplos() {
  exemplo1_ManilhaVsNormal();
  exemplo2_CartaNormalVsNormal();
  exemplo3_DuasManilhas();
  exemplo4_Empate();
  exemplo5_VerificarManilha();
  exemplo6_ObtérForçaDetalhada();

  console.log('\n✅ Todos os exemplos foram executados!');
  console.log('Veja o console (F12) para os resultados.\n');
}

/**
 * PARA TESTAR:
 *
 * 1. Abra o console do navegador (F12)
 * 2. No seu componente, chame:
 *    import { rodarTodosOsExemplos } from './utils/cardComparison.test';
 *    rodarTodosOsExemplos();
 *
 * 3. Veja os resultados no console
 */
