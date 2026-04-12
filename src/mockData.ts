// ============================================================
// MOCK DATA — Arena Truco Premium
// Dados de demonstração de alto nível para todas as telas
// ============================================================

import type { Usuario, Clan, Sala, JogadorRanking, ItemLoja, MensagemChat } from './types';

// ── Usuário Logado (Mock de Sessão) ──────────────────────────
export const USUARIO_MOCK: Usuario = {
  id: 'user-001',
  nome: 'Jhonatan',
  nick: 'TrucoKing',
  avatar: `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=TrucoKing&backgroundColor=1a1040`,
  nivel: 47,
  xp: 6800,
  xpProximoNivel: 10000,
  moedas: 12450,
  gemas: 88,
  ranking: 312,
  vitorias: 487,
  derrotas: 214,
  partidas: 701,
  clan: 'Truqueiros do Brasil',
};

// ── Avatares dos Bots ────────────────────────────────────────
const BOTS = [
  { id: 'bot-001', nome: 'Zé Mineiro',   nick: 'ZeMineiro',   avatar: `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=ZeMineiro&backgroundColor=2d1b69`,   nivel: 35, pontos: 4200, vitorias: 301, derrotas: 140, partidas: 441, moedas: 0, gemas: 0, ranking: 890, xp: 3000, xpProximoNivel: 5000 },
  { id: 'bot-002', nome: 'Maria Bolada', nick: 'MariaBolada', avatar: `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=MariaBolada&backgroundColor=880e4f`, nivel: 62, pontos: 7800, vitorias: 589, derrotas: 201, partidas: 790, moedas: 0, gemas: 0, ranking: 89,  xp: 8000, xpProximoNivel: 9000 },
  { id: 'bot-003', nome: 'Pardal',       nick: 'OPardal',     avatar: `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=OPardal&backgroundColor=1b5e20`,     nivel: 28, pontos: 2900, vitorias: 203, derrotas: 188, partidas: 391, moedas: 0, gemas: 0, ranking: 1400, xp: 1200, xpProximoNivel: 3000 },
  { id: 'bot-004', nome: 'Cobra D\'Água', nick: 'CobraDAgua',  avatar: `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=CobraDAgua&backgroundColor=37474f`,  nivel: 55, pontos: 6600, vitorias: 502, derrotas: 190, partidas: 692, moedas: 0, gemas: 0, ranking: 155, xp: 6500, xpProximoNivel: 8000 },
];

// ── Salas para o Lobby ───────────────────────────────────────
export const SALAS_INICIAIS: Sala[] = [
  {
    id: 'sala-001',
    nome: 'Mesa dos Campeões',
    modo: 'paulista',
    status: 'waiting',
    maxJogadores: 4,
    pontoNos: 0,
    pontoEles: 0,
    rodadaAtual: 1,
    jogadores: [
      { ...BOTS[0], time: 'nos',  pronto: true,  isBot: true, cartas: [] },
      { ...BOTS[1], time: 'eles', pronto: false, isBot: true, cartas: [] },
    ],
  },
  {
    id: 'sala-002',
    nome: 'Forró e Truco',
    modo: 'mineiro',
    status: 'playing',
    maxJogadores: 4,
    pontoNos: 6,
    pontoEles: 9,
    rodadaAtual: 3,
    jogadores: [
      { ...BOTS[1], time: 'nos',  pronto: true, isBot: true, cartas: [] },
      { ...BOTS[2], time: 'nos',  pronto: true, isBot: true, cartas: [] },
      { ...BOTS[3], time: 'eles', pronto: true, isBot: true, cartas: [] },
      { ...BOTS[0], time: 'eles', pronto: true, isBot: true, cartas: [] },
    ],
  },
  {
    id: 'sala-003',
    nome: 'Baralho Aberto',
    modo: 'paulista',
    status: 'waiting',
    maxJogadores: 2,
    pontoNos: 0,
    pontoEles: 0,
    rodadaAtual: 1,
    jogadores: [
      { ...BOTS[3], time: 'nos', pronto: true, isBot: true, cartas: [] },
    ],
  },
  {
    id: 'sala-004',
    nome: 'Tô de Boa',
    modo: 'mineiro',
    status: 'playing',
    maxJogadores: 4,
    pontoNos: 11,
    pontoEles: 10,
    rodadaAtual: 6,
    jogadores: [
      { ...BOTS[2], time: 'nos',  pronto: true, isBot: true, cartas: [] },
      { ...BOTS[3], time: 'nos',  pronto: true, isBot: true, cartas: [] },
      { ...BOTS[0], time: 'eles', pronto: true, isBot: true, cartas: [] },
      { ...BOTS[1], time: 'eles', pronto: true, isBot: true, cartas: [] },
    ],
  },
  {
    id: 'sala-005',
    nome: 'Apenas os Brutos',
    modo: 'paulista',
    status: 'waiting',
    maxJogadores: 4,
    pontoNos: 0,
    pontoEles: 0,
    rodadaAtual: 1,
    jogadores: [
      { ...BOTS[0], time: 'nos',  pronto: true,  isBot: true, cartas: [] },
      { ...BOTS[1], time: 'nos',  pronto: false, isBot: true, cartas: [] },
      { ...BOTS[2], time: 'eles', pronto: true,  isBot: true, cartas: [] },
    ],
  },
];

// ── Clãs Mock ────────────────────────────────────────────────
const MSGS_CLAN: MensagemChat[] = [
  { id: 'm1', autorId: 'bot-001', autorNome: 'Zé Mineiro',   autorAvatar: BOTS[0].avatar, texto: 'Boa tarde galera! Alguém quer uma partidinha?', timestamp: new Date(Date.now() - 1000 * 60 * 30), tipo: 'chat' },
  { id: 'm2', autorId: 'bot-002', autorNome: 'Maria Bolada', autorAvatar: BOTS[1].avatar, texto: 'To dentro! Paulista ou Mineiro?',                  timestamp: new Date(Date.now() - 1000 * 60 * 25), tipo: 'chat' },
  { id: 'm3', autorId: 'bot-001', autorNome: 'Zé Mineiro',   autorAvatar: BOTS[0].avatar, texto: 'Paulista! E TRUCO na primeira mão 🃏',              timestamp: new Date(Date.now() - 1000 * 60 * 20), tipo: 'chat' },
  { id: 'm4', autorId: 'bot-003', autorNome: 'Pardal',       autorAvatar: BOTS[2].avatar, texto: 'Kkkk esse Zé é maluco demais',                      timestamp: new Date(Date.now() - 1000 * 60 * 15), tipo: 'chat' },
  { id: 'm5', autorId: 'user-001', autorNome: 'TrucoKing',   autorAvatar: USUARIO_MOCK.avatar, texto: 'Boa tarde! Cheguei 🔥',                        timestamp: new Date(Date.now() - 1000 * 60 * 5),  tipo: 'chat' },
];

export const CLANS_MOCK: Clan[] = [
  {
    id: 'clan-001',
    nome: 'Truqueiros do Brasil',
    tag: 'TRB',
    descricao: 'Os melhores truqueiros reunidos. Entre só se for bom mesmo.',
    icone: '🃏',
    cor: '#d4a017',
    membros: 48,
    maxMembros: 50,
    ultimaMensagem: 'Boa tarde! Cheguei 🔥',
    mensagens: MSGS_CLAN,
  },
  {
    id: 'clan-002',
    nome: 'Escola do Truco',
    tag: 'EDT',
    descricao: 'Para iniciantes que querem aprender com os mestres.',
    icone: '📚',
    cor: '#4361ee',
    membros: 23,
    maxMembros: 50,
    ultimaMensagem: 'Boa tarde galera!',
    mensagens: [],
  },
  {
    id: 'clan-003',
    nome: 'Cobra D\'Água FC',
    tag: 'CDF',
    descricao: 'Somos sorrateiros como cobra d\'água. Ninguém nos para.',
    icone: '🐍',
    cor: '#2dc653',
    membros: 35,
    maxMembros: 40,
    ultimaMensagem: 'Ganhamos mais 3 hoje!',
    mensagens: [],
  },
];

// ── Ranking Mock ─────────────────────────────────────────────
export const RANKING_MOCK: JogadorRanking[] = [
  { posicao: 1,  usuario: { ...BOTS[1],  id: BOTS[1].id, nome: BOTS[1].nome,   nick: BOTS[1].nick,   avatar: BOTS[1].avatar,   clan: 'TRB' } as typeof USUARIO_MOCK, pontos: 15800 },
  { posicao: 2,  usuario: { ...BOTS[3],  id: BOTS[3].id, nome: BOTS[3].nome,   nick: BOTS[3].nick,   avatar: BOTS[3].avatar,   clan: 'CDF' } as typeof USUARIO_MOCK, pontos: 14200 },
  { posicao: 3,  usuario: { ...BOTS[0],  id: BOTS[0].id, nome: BOTS[0].nome,   nick: BOTS[0].nick,   avatar: BOTS[0].avatar,   clan: 'EDT' } as typeof USUARIO_MOCK, pontos: 11900 },
  { posicao: 4,  usuario: { ...BOTS[2],  id: BOTS[2].id, nome: BOTS[2].nome,   nick: BOTS[2].nick,   avatar: BOTS[2].avatar,   clan: 'TRB' } as typeof USUARIO_MOCK, pontos: 9400  },
  ...Array.from({length: 10}, (_, i) => ({
    posicao: i + 5,
    usuario: {
      id: `rand-${i}`,
      nome: ['Carlos', 'José', 'Ana', 'Pedro', 'Lucia', 'Marcos', 'Fernanda', 'Ricardo', 'Juliana', 'Diego'][i],
      nick: ['TrucoMestre', 'ZapaDor', 'NaTora', 'Ferreiro', 'Baralho23', 'ZeroMedo', 'RainhaTruco', 'ManilhaMax', 'Julinha11', 'DiegoFull'][i],
      avatar: `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=rand${i}&backgroundColor=1a1040`,
      nivel: 20 + i * 3,
      pontos: 8000 - i * 400,
      vitorias: 150 - i*5,
      derrotas: 80 + i*3,
      partidas: 230 - i*2,
      moedas: 0, gemas: 0, ranking: i + 5, xp: 2000, xpProximoNivel: 5000,
    } as typeof USUARIO_MOCK,
    pontos: 8000 - i * 400,
  })),
  { posicao: 312, usuario: USUARIO_MOCK, pontos: 4800 },
];

// ── Loja Mock ────────────────────────────────────────────────
export const LOJA_ITEMS: ItemLoja[] = [
  { id: 'l1', nome: 'Baú Bronze',       descricao: '50 moedas garantidas',         preco: 30,   moeda: 'moedas', icone: '📦', tag: 'Popular' },
  { id: 'l2', nome: 'Baú Prata',        descricao: '150 moedas + chance de gemas', preco: 80,   moeda: 'moedas', icone: '🪙', destaque: true, tag: 'Oferta' },
  { id: 'l3', nome: 'Baú Ouro',         descricao: '500 moedas + 5 gemas',         preco: 250,  moeda: 'moedas', icone: '🏆', destaque: true },
  { id: 'l4', nome: 'Baú Diamante',     descricao: '2000 moedas + 25 gemas',       preco: 20,   moeda: 'gemas',  icone: '💎', tag: 'Premium' },
  { id: 'l5', nome: 'Mesa Verde Elite', descricao: 'Skin premium da mesa verde',    preco: 15,   moeda: 'gemas',  icone: '🟢' },
  { id: 'l6', nome: 'Baralho Nobre',    descricao: 'Verso dourado do baralho',      preco: 25,   moeda: 'gemas',  icone: '🎴', destaque: true, tag: 'Exclusivo' },
  { id: 'l7', nome: 'Mesa Roxo Titan',  descricao: 'Skin mesa roxa premium',        preco: 40,   moeda: 'gemas',  icone: '🟣' },
  { id: 'l8', nome: 'Pack 100 Gemas',   descricao: '100 gemas para gastar na loja', preco: 1000, moeda: 'moedas', icone: '✨', destaque: true },
];
