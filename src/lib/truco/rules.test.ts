import { describe, it, expect } from 'vitest';
import {
  gerarBaralho,
  embaralhar,
  getForcaBase,
  getForcaAbsoluta,
  configurarManilhas,
  getManilhaPaulistaFallback,
  VALORES_HIERARQUIA,
  NAIPES,
} from './rules';
import type { Carta } from '../../types';

// ─────────────────────────────────────────────
// gerarBaralho
// ─────────────────────────────────────────────
describe('gerarBaralho', () => {
  it('deve gerar exatamente 40 cartas', () => {
    expect(gerarBaralho()).toHaveLength(40);
  });

  it('não deve ter cartas com id duplicado', () => {
    const baralho = gerarBaralho();
    const ids = new Set(baralho.map(c => c.id));
    expect(ids.size).toBe(40);
  });

  it('deve conter todas as combinações de valor × naipe', () => {
    const baralho = gerarBaralho();
    for (const naipe of NAIPES) {
      for (const valor of VALORES_HIERARQUIA) {
        const found = baralho.some(c => c.naipe === naipe && c.valor === valor);
        expect(found, `${valor} de ${naipe} não encontrado`).toBe(true);
      }
    }
  });

  it('deve inicializar todas as cartas com ehManilha = false', () => {
    const baralho = gerarBaralho();
    expect(baralho.every(c => c.ehManilha === false)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// embaralhar
// ─────────────────────────────────────────────
describe('embaralhar', () => {
  it('deve retornar um array com o mesmo número de cartas', () => {
    const baralho = gerarBaralho();
    expect(embaralhar(baralho)).toHaveLength(40);
  });

  it('não deve modificar o array original (imutabilidade)', () => {
    const baralho = gerarBaralho();
    const snapshot = baralho.map(c => c.id);
    embaralhar(baralho);
    expect(baralho.map(c => c.id)).toEqual(snapshot);
  });

  it('deve conter as mesmas cartas após o embaralhamento', () => {
    const baralho = gerarBaralho();
    const embaralhado = embaralhar(baralho);
    const idsOriginais = new Set(baralho.map(c => c.id));
    const idsEmbaralhados = new Set(embaralhado.map(c => c.id));
    expect(idsOriginais).toEqual(idsEmbaralhados);
  });
});

// ─────────────────────────────────────────────
// getForcaBase
// ─────────────────────────────────────────────
describe('getForcaBase', () => {
  it('deve retornar 0 para o 4 (menor carta do baralho)', () => {
    expect(getForcaBase('4')).toBe(0);
  });

  it('deve retornar 9 para o 3 (maior carta base)', () => {
    expect(getForcaBase('3')).toBe(9);
  });

  it('deve respeitar a hierarquia completa de 4 ao 3', () => {
    for (let i = 0; i < VALORES_HIERARQUIA.length; i++) {
      expect(getForcaBase(VALORES_HIERARQUIA[i])).toBe(i);
    }
  });
});

// ─────────────────────────────────────────────
// getForcaAbsoluta
// ─────────────────────────────────────────────
describe('getForcaAbsoluta', () => {
  it('deve retornar forcaBase para cartas que não são manilha', () => {
    const carta: Carta = { id: '1', valor: '3', naipe: 'paus', forcaBase: 9, ehManilha: false };
    expect(getForcaAbsoluta(carta)).toBe(9);
  });

  it('deve retornar 14 para manilha de paus (Zap — a mais forte)', () => {
    const zap: Carta = { id: '1', valor: '4', naipe: 'paus', forcaBase: 0, ehManilha: true };
    expect(getForcaAbsoluta(zap)).toBe(14);
  });

  it('deve retornar 13 para manilha de copas', () => {
    const copas: Carta = { id: '1', valor: '4', naipe: 'copas', forcaBase: 0, ehManilha: true };
    expect(getForcaAbsoluta(copas)).toBe(13);
  });

  it('deve retornar 12 para manilha de espadas', () => {
    const espadas: Carta = { id: '1', valor: '4', naipe: 'espadas', forcaBase: 0, ehManilha: true };
    expect(getForcaAbsoluta(espadas)).toBe(12);
  });

  it('deve retornar 11 para manilha de ouros (a mais fraca)', () => {
    const ouros: Carta = { id: '1', valor: '4', naipe: 'ouros', forcaBase: 0, ehManilha: true };
    expect(getForcaAbsoluta(ouros)).toBe(11);
  });

  it('manilha de paus deve ser sempre mais forte que manilha de ouros', () => {
    const zap: Carta = { id: '1', valor: '4', naipe: 'paus', forcaBase: 0, ehManilha: true };
    const ouros: Carta = { id: '2', valor: '4', naipe: 'ouros', forcaBase: 0, ehManilha: true };
    expect(getForcaAbsoluta(zap)).toBeGreaterThan(getForcaAbsoluta(ouros));
  });
});

// ─────────────────────────────────────────────
// getManilhaPaulistaFallback
// ─────────────────────────────────────────────
describe('getManilhaPaulistaFallback', () => {
  it('deve retornar 5 quando o vira é 4', () => {
    expect(getManilhaPaulistaFallback('4')).toBe('5');
  });

  it('deve retornar Q quando o vira é 7', () => {
    expect(getManilhaPaulistaFallback('7')).toBe('Q');
  });

  it('deve fazer wrap-around: retornar 4 quando o vira é 3', () => {
    expect(getManilhaPaulistaFallback('3')).toBe('4');
  });

  it('deve retornar um valor válido para qualquer carta da hierarquia', () => {
    for (const valor of VALORES_HIERARQUIA) {
      const manilha = getManilhaPaulistaFallback(valor);
      expect(VALORES_HIERARQUIA).toContain(manilha);
    }
  });
});

// ─────────────────────────────────────────────
// configurarManilhas
// ─────────────────────────────────────────────
describe('configurarManilhas', () => {
  it('modo paulista: deve marcar exatamente 4 cartas como manilha', () => {
    const baralho = gerarBaralho();
    const vira = baralho.find(c => c.valor === '4')!;
    const resultado = configurarManilhas(baralho, 'paulista', vira);
    expect(resultado.filter(c => c.ehManilha)).toHaveLength(4);
  });

  it('modo paulista: a manilha deve ser o valor seguinte ao vira', () => {
    const baralho = gerarBaralho();
    const vira = baralho.find(c => c.valor === '4')!;
    const resultado = configurarManilhas(baralho, 'paulista', vira);
    const manilhas = resultado.filter(c => c.ehManilha);
    expect(manilhas.every(c => c.valor === '5')).toBe(true);
  });

  it('modo mineiro: deve marcar exatamente 4 manilhas fixas', () => {
    const baralho = gerarBaralho();
    const resultado = configurarManilhas(baralho, 'mineiro');
    expect(resultado.filter(c => c.ehManilha)).toHaveLength(4);
  });

  it('modo mineiro: deve marcar o 4 de paus (Zap) como manilha', () => {
    const baralho = gerarBaralho();
    const resultado = configurarManilhas(baralho, 'mineiro');
    const zap = resultado.find(c => c.valor === '4' && c.naipe === 'paus');
    expect(zap?.ehManilha).toBe(true);
  });

  it('não deve alterar o array original (imutabilidade)', () => {
    const baralho = gerarBaralho();
    const snapshot = baralho.map(c => c.ehManilha);
    configurarManilhas(baralho, 'mineiro');
    expect(baralho.map(c => c.ehManilha)).toEqual(snapshot);
  });
});
