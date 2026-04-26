// ============================================================
// TESTES — Sistema de Tentos (Mineiro vs Paulista)
// Exemplos de como o sistema funciona
// ============================================================

import {
  TRUCO_MINEIRO_TENTOS,
  obterProximoTentoMineiro,
  obterTentoPorComandoMineiro,
  obterDescricaoTentoMineiro,
} from './mineiro';

import {
  TRUCO_PAULISTA_TENTOS,
  obterProximoTentoPaulista,
  obterTentoPorComandoPaulista,
  obterDescricaoTentoPaulista,
} from './paulista';

/**
 * EXEMPLO 1: Entender as sequências
 */
export function exemplo1_SequenciaCompleta() {
  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 1: Sequências Completas');
  console.log('═══════════════════════════════════════════');

  console.log('\n🎯 MINEIRO (2 → 4 → 8 → 10 → 12):');
  console.log(TRUCO_MINEIRO_TENTOS.sequencia);

  console.log('\n🎯 PAULISTA (1 → 3 → 6 → 9 → 12):');
  console.log(TRUCO_PAULISTA_TENTOS.sequencia);
}

/**
 * EXEMPLO 2: Obter próximo tentos
 */
export function exemplo2_ObterProximo() {
  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 2: Obter Próximo Tentos');
  console.log('═══════════════════════════════════════════');

  console.log('\n🎮 MINEIRO:');
  console.log(`2 → ${obterProximoTentoMineiro(2)} (Truco)`);
  console.log(`4 → ${obterProximoTentoMineiro(4)} (Seis)`);
  console.log(`8 → ${obterProximoTentoMineiro(8)} (Nove)`);
  console.log(`10 → ${obterProximoTentoMineiro(10)} (Doze)`);
  console.log(`12 → ${obterProximoTentoMineiro(12)} (Máximo!)`);

  console.log('\n🎮 PAULISTA:');
  console.log(`1 → ${obterProximoTentoPaulista(1)} (Truco)`);
  console.log(`3 → ${obterProximoTentoPaulista(3)} (Seis)`);
  console.log(`6 → ${obterProximoTentoPaulista(6)} (Nove)`);
  console.log(`9 → ${obterProximoTentoPaulista(9)} (Doze)`);
  console.log(`12 → ${obterProximoTentoPaulista(12)} (Máximo!)`);
}

/**
 * EXEMPLO 3: Mapear comando para tentos
 */
export function exemplo3_ComandoParaTento() {
  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 3: Comando → Tentos');
  console.log('═══════════════════════════════════════════');

  console.log('\n🎮 MINEIRO (quando alguém grita):');
  console.log(`"TRUCO!" → ${obterTentoPorComandoMineiro('truco')} tentos`);
  console.log(`"SEIS!" → ${obterTentoPorComandoMineiro('seis')} tentos`);
  console.log(`"NOVE!" → ${obterTentoPorComandoMineiro('nove')} tentos`);
  console.log(`"DOZE!" → ${obterTentoPorComandoMineiro('doze')} tentos`);

  console.log('\n🎮 PAULISTA (quando alguém grita):');
  console.log(`"TRUCO!" → ${obterTentoPorComandoPaulista('truco')} tentos`);
  console.log(`"SEIS!" → ${obterTentoPorComandoPaulista('seis')} tentos`);
  console.log(`"NOVE!" → ${obterTentoPorComandoPaulista('nove')} tentos`);
  console.log(`"DOZE!" → ${obterTentoPorComandoPaulista('doze')} tentos`);
}

/**
 * EXEMPLO 4: Descrições para exibição
 */
export function exemplo4_Descricoes() {
  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 4: Descrições para Exibição');
  console.log('═══════════════════════════════════════════');

  console.log('\n🎮 MINEIRO:');
  console.log(`2 tentos: ${obterDescricaoTentoMineiro(2)}`);
  console.log(`4 tentos: ${obterDescricaoTentoMineiro(4)}`);
  console.log(`8 tentos: ${obterDescricaoTentoMineiro(8)}`);
  console.log(`10 tentos: ${obterDescricaoTentoMineiro(10)}`);
  console.log(`12 tentos: ${obterDescricaoTentoMineiro(12)}`);

  console.log('\n🎮 PAULISTA:');
  console.log(`1 tentos: ${obterDescricaoTentoPaulista(1)}`);
  console.log(`3 tentos: ${obterDescricaoTentoPaulista(3)}`);
  console.log(`6 tentos: ${obterDescricaoTentoPaulista(6)}`);
  console.log(`9 tentos: ${obterDescricaoTentoPaulista(9)}`);
  console.log(`12 tentos: ${obterDescricaoTentoPaulista(12)}`);
}

/**
 * EXEMPLO 5: Simulação de rodada com tentos
 */
export function exemplo5_SimulacaoRodada() {
  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 5: Simulação de Rodada (MINEIRO)');
  console.log('═══════════════════════════════════════════');

  let tentoAtual = 2;
  console.log(`1️⃣  Começa rodada: ${tentoAtual} tentos`);

  tentoAtual = obterProximoTentoMineiro(tentoAtual) || tentoAtual;
  console.log(`2️⃣  Bot grita "TRUCO!": ${tentoAtual} tentos`);

  tentoAtual = obterProximoTentoMineiro(tentoAtual) || tentoAtual;
  console.log(`3️⃣  Você responde "SEIS!": ${tentoAtual} tentos`);

  tentoAtual = obterProximoTentoMineiro(tentoAtual) || tentoAtual;
  console.log(`4️⃣  Bot grita "NOVE!": ${tentoAtual} tentos`);

  const vencedor = 'Você';
  console.log(`\n✅ ${vencedor} vence a rodada!`);
  console.log(`🎯 Ganha ${tentoAtual} TENTOS (não 2!)`);
}

/**
 * EXEMPLO 6: Comparação visual
 */
export function exemplo6_ComparacaoVisual() {
  console.log('\n═══════════════════════════════════════════');
  console.log('EXEMPLO 6: Comparação Visual');
  console.log('═══════════════════════════════════════════');

  console.log(TRUCO_MINEIRO_TENTOS.hierarquiaCompleta);
  console.log(TRUCO_PAULISTA_TENTOS.hierarquiaCompleta);
}

/**
 * RODAR TODOS OS EXEMPLOS
 */
export function rodarTodosOsExemplosTentos() {
  exemplo1_SequenciaCompleta();
  exemplo2_ObterProximo();
  exemplo3_ComandoParaTento();
  exemplo4_Descricoes();
  exemplo5_SimulacaoRodada();
  exemplo6_ComparacaoVisual();

  console.log('\n✅ Todos os exemplos de TENTOS foram executados!');
  console.log('Veja o console (F12) para os resultados.\n');
}

/**
 * PARA TESTAR:
 *
 * 1. Abra o console do navegador (F12)
 * 2. No seu componente, chame:
 *    import { rodarTodosOsExemplosTentos } from './config/tentosRules/tentos.test';
 *    rodarTodosOsExemplosTentos();
 *
 * 3. Veja os resultados no console
 */
