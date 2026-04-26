// ============================================================
// TESTES — Card Comparison System (PAULISTA)
// Exemplos de como o sistema funciona com manilhas variáveis
// ============================================================

import {
  comparaCartasPaulista,
  obterForçaCartaPaulista,
  exibirComparacaoDebug,
} from './cardComparison';
import { TrucoPaulistaRegras } from '../config/cardRules/paulista';
import type { Carta } from '../types';

/**
 * EXEMPLOS DE USO DO SISTEMA PAULISTA COM MANILHAS VARIÁVEIS
 * Descomente a função e rode para ver os resultados
 */

// ── EXEMPLO 1: Vira = 5, logo Manilha = 6 ──
export function exemplo1_Vira5Manilha6() {
  const regras = new TrucoPaulistaRegras('5');

  const seisPaus: Carta = { id: '1', valor: '6', naipe: 'paus', forcaBase: 0, ehManilha: true };
  const tresNormal: Carta = { id: '2', valor: '3', naipe: 'copas', forcaBase: 0, ehManilha: false };

  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 1: Vira = 5 (Manilha = 6)');
  console.log('Comparação: 6 de Paus (Manilha) vs 3 de Copas (Normal)');
  console.log('═══════════════════════════════════════════');
  exibirComparacaoDebug(seisPaus, tresNormal, 'paulista', regras);
  // Resultado: 6 de Paus vence (é manilha)
}

// ── EXEMPLO 2: Vira = K, logo Manilha = A ──
export function exemplo2_ViraKManilhaA() {
  const regras = new TrucoPaulistaRegras('K');

  const asOuros: Carta = { id: '1', valor: 'A', naipe: 'ouros', forcaBase: 0, ehManilha: true };
  const doiseEspadas: Carta = { id: '2', valor: '2', naipe: 'espadas', forcaBase: 0, ehManilha: false };

  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 2: Vira = K (Manilha = A)');
  console.log('Comparação: A de Ouros (Manilha) vs 2 de Espadas (Normal)');
  console.log('═══════════════════════════════════════════');
  exibirComparacaoDebug(asOuros, doiseEspadas, 'paulista', regras);
  // Resultado: A de Ouros vence (é manilha)
}

// ── EXEMPLO 3: Duas Manilhas com Vira = 6 ──
export function exemplo3_DuasManilhasVira6() {
  const regras = new TrucoPaulistaRegras('6');

  const setePaus: Carta = { id: '1', valor: '7', naipe: 'paus', forcaBase: 0, ehManilha: true };
  const seteOuros: Carta = { id: '2', valor: '7', naipe: 'ouros', forcaBase: 0, ehManilha: true };

  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 3: Vira = 6 (Manilha = 7)');
  console.log('Comparação: 7 de Paus vs 7 de Ouros (ambas manilhas)');
  console.log('═══════════════════════════════════════════');
  exibirComparacaoDebug(setePaus, seteOuros, 'paulista', regras);
  // Resultado: 7 de Paus vence (Paus > Ouros em manilhas)
}

// ── EXEMPLO 4: Cartas Normais (Vira = 7) ──
export function exemplo4_CartasNormaisVira7() {
  const regras = new TrucoPaulistaRegras('7');

  const asEspadas: Carta = { id: '1', valor: 'A', naipe: 'espadas', forcaBase: 0, ehManilha: false };
  const reiOuros: Carta = { id: '2', valor: 'K', naipe: 'ouros', forcaBase: 0, ehManilha: false };

  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 4: Vira = 7 (Manilha = Q)');
  console.log('Comparação: A de Espadas vs K de Ouros (ambas normais)');
  console.log('═══════════════════════════════════════════');
  exibirComparacaoDebug(asEspadas, reiOuros, 'paulista', regras);
  // Resultado: A vence (força 8 > força 7 no Paulista)
}

// ── EXEMPLO 5: Manilha vs Manilha - Ordem de Naipes ──
export function exemplo5_ManilhasNaipesDiferentes() {
  const regras = new TrucoPaulistaRegras('2');

  const trescopas: Carta = { id: '1', valor: '3', naipe: 'copas', forcaBase: 0, ehManilha: true };
  const tresEspadas: Carta = { id: '2', valor: '3', naipe: 'espadas', forcaBase: 0, ehManilha: true };

  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 5: Vira = 2 (Manilha = 3)');
  console.log('Comparação: 3 de Copas vs 3 de Espadas (manilhas diferentes)');
  console.log('═══════════════════════════════════════════');
  exibirComparacaoDebug(trescopas, tresEspadas, 'paulista', regras);
  // Resultado: 3 de Copas vence (Copas > Espadas em manilhas)
}

// ── EXEMPLO 6: Informações detalhadas da vira/manilha ──
export function exemplo6_InformacoesManilha() {
  const vira = '4';
  const regras = new TrucoPaulistaRegras(vira);

  console.log('\n═══════════════════════════════════════════');
  console.log(`EXEMPLO 6: Informações Detalhadas (Vira = ${vira})`);
  console.log('═══════════════════════════════════════════');
  console.log(`Vira: ${regras.obterVira()}`);
  console.log(`Manilha: ${regras.obterManilha()}`);
  console.log('Todas as Manilhas:');

  regras.obterManilhas().forEach((m, i) => {
    console.log(`  ${i + 1}. ${m.nome} (força ${m.forçaManilha})`);
  });

  console.log('\nVerificações:');
  const cartaTeste1: Carta = { id: '1', valor: '5', naipe: 'paus', forcaBase: 0, ehManilha: true };
  const cartaTeste2: Carta = { id: '2', valor: '3', naipe: 'ouros', forcaBase: 0, ehManilha: false };

  console.log(`5 de Paus é manilha? ${regras.éManilha(cartaTeste1.valor, cartaTeste1.naipe)}`);
  console.log(`3 de Ouros é manilha? ${regras.éManilha(cartaTeste2.valor, cartaTeste2.naipe)}`);
}

// ── EXEMPLO 7: Hierarquia Visual ──
export function exemplo7_HierarquiaVisual() {
  const vira = '6';
  const regras = new TrucoPaulistaRegras(vira);

  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 7: Hierarquia Visual');
  console.log('═══════════════════════════════════════════');
  regras.exibirHierarquia();
}

// ── FUNÇÃO PARA RODAR TODOS OS EXEMPLOS ──
export function rodarTodosOsExemplosPaulista() {
  exemplo1_Vira5Manilha6();
  exemplo2_ViraKManilhaA();
  exemplo3_DuasManilhasVira6();
  exemplo4_CartasNormaisVira7();
  exemplo5_ManilhasNaipesDiferentes();
  exemplo6_InformacoesManilha();
  exemplo7_HierarquiaVisual();

  console.log('\n✅ Todos os exemplos PAULISTA foram executados!');
  console.log('Veja o console (F12) para os resultados.\n');
}

/**
 * PARA TESTAR:
 *
 * 1. Abra o console do navegador (F12)
 * 2. No seu componente, chame:
 *    import { rodarTodosOsExemplosPaulista } from './utils/cardComparison.paulista.test';
 *    rodarTodosOsExemplosPaulista();
 *
 * 3. Veja os resultados no console
 */
