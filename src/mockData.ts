// ============================================================
// MOCK DATA — Arena Truco Premium
// Dados de demonstração de alto nível para todas as telas
// ============================================================

import type { Usuario, Clan, Sala, JogadorRanking, ItemLoja, MensagemChat, Amigo, Badge, GameHistory, PontuacaoDia } from './types';

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

// ── Amigos Mock ──────────────────────────────────────────────
export const AMIGOS_MOCK: Amigo[] = [
  // ── Disponíveis (online, sem jogo ativo) ─────────────────
  {
    id: '00000000-0000-0000-0000-000000000001', nome: 'Carlos Silva', nick: 'TrucoMestre',
    avatar: 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=TrucoMestre&backgroundColor=1a1040',
    nivel: 42, vitorias: 380, derrotas: 140, partidas: 520, ranking: 88, clan: 'TRB',
    statusMsg: 'Pronto pra dar truco em qualquer um 🃏',
    statusMsgAtualizada: new Date(Date.now() - 1000 * 60 * 60 * 2),
    statusAmigo: 'disponivel',
  },
  {
    id: '00000000-0000-0000-0000-000000000002', nome: 'Ana Lima', nick: 'RainhaTruco',
    avatar: 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=RainhaTruco&backgroundColor=880e4f',
    nivel: 58, vitorias: 511, derrotas: 198, partidas: 709, ranking: 45,
    statusMsg: 'Eu sou o melhor do truco ninguem ganhe de mim kkkk',
    statusMsgAtualizada: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    statusAmigo: 'disponivel',
  },
  {
    id: '00000000-0000-0000-0000-000000000003', nome: 'Pedro Rocha', nick: 'Ferreiro77',
    avatar: 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=Ferreiro77&backgroundColor=1b5e20',
    nivel: 31, vitorias: 220, derrotas: 195, partidas: 415, ranking: 401, clan: 'EDT',
    statusMsg: 'Voltei! Vamos nessa 🔥',
    statusMsgAtualizada: new Date(Date.now() - 1000 * 60 * 30),
    statusAmigo: 'disponivel',
  },
  // ── Jogando (em partida ativa) ───────────────────────────
  {
    id: '00000000-0000-0000-0000-000000000004', nome: 'Marcos Costa', nick: 'ZeroMedo',
    avatar: 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=ZeroMedo&backgroundColor=2d1b69',
    nivel: 67, vitorias: 612, derrotas: 201, partidas: 813, ranking: 12,
    statusMsg: 'Ninguém me para no Paulista 💪',
    statusMsgAtualizada: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    statusAmigo: 'jogando', modoJogo: 'paulista', tempoJogandoMin: 18,
  },
  {
    id: '00000000-0000-0000-0000-000000000005', nome: 'Fernanda Alves', nick: 'FerTruco',
    avatar: 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=FerTruco&backgroundColor=37474f',
    nivel: 44, vitorias: 390, derrotas: 170, partidas: 560, ranking: 77,
    statusMsg: 'Mineiro é o melhor modo, ponto final.',
    statusMsgAtualizada: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    statusAmigo: 'jogando', modoJogo: 'mineiro', tempoJogandoMin: 5,
  },
  {
    id: '00000000-0000-0000-0000-000000000006', nome: 'Ricardo Nunes', nick: 'ManilhaMax',
    avatar: 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=ManilhaMax&backgroundColor=1a237e',
    nivel: 29, vitorias: 180, derrotas: 155, partidas: 335, ranking: 660,
    statusMsg: 'Aprendendo cada dia mais...',
    statusMsgAtualizada: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    statusAmigo: 'jogando', modoJogo: 'paulista', tempoJogandoMin: 31,
  },
  {
    id: '00000000-0000-0000-0000-000000000007', nome: 'Juliana Melo', nick: 'Julinha11',
    avatar: 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=Julinha11&backgroundColor=4a148c',
    nivel: 53, vitorias: 470, derrotas: 182, partidas: 652, ranking: 55, clan: 'CDF',
    statusMsg: '😎 Truco é vida',
    statusMsgAtualizada: new Date(Date.now() - 1000 * 60 * 60 * 24),
    statusAmigo: 'jogando', modoJogo: 'mineiro', tempoJogandoMin: 44,
  },
  // ── Offline ──────────────────────────────────────────────
  {
    id: '00000000-0000-0000-0000-000000000008', nome: 'Diego Pinto', nick: 'DiegoFull',
    avatar: 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=DiegoFull&backgroundColor=212121',
    nivel: 38, vitorias: 290, derrotas: 210, partidas: 500, ranking: 280,
    statusMsg: 'Voltarei em breve, aguardem 🤙',
    statusMsgAtualizada: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    statusAmigo: 'offline',
  },
  {
    id: '00000000-0000-0000-0000-000000000009', nome: 'Lucia Ramos', nick: 'Baralho23',
    avatar: 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=Baralho23&backgroundColor=263238',
    nivel: 22, vitorias: 140, derrotas: 130, partidas: 270, ranking: 890, clan: 'EDT',
    statusMsg: 'Estudando as manilhas 📚',
    statusMsgAtualizada: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    statusAmigo: 'offline',
  },
  {
    id: '00000000-0000-0000-0000-000000000010', nome: 'José Cardoso', nick: 'ZapaDor',
    avatar: 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=ZapaDor&backgroundColor=1a1040',
    nivel: 71, vitorias: 688, derrotas: 220, partidas: 908, ranking: 8, clan: 'TRB',
    statusMsg: 'Lendário do truco 👑',
    statusMsgAtualizada: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    statusAmigo: 'offline',
  },
];

// ── Badges Mock ──────────────────────────────────────────────
export const BADGES_MOCK: Badge[] = [
  { id: 'b1', nome: 'Primeira Partida', descricao: 'Completou a primeira partida da carreira', icone: '🎴', tier: 1, conquistado: true, dataConquista: new Date('2026-04-12') },
  { id: 'b2', nome: '10 Vitórias', descricao: 'Conquistou 10 vitórias no total', icone: '🏆', tier: 1, conquistado: true, dataConquista: new Date('2026-04-12') },
  { id: 'b3', nome: 'Sobe Nível', descricao: 'Atingiu o nível 25', icone: '⭐', tier: 2, conquistado: true, dataConquista: new Date('2026-04-13') },
  { id: 'b4', nome: 'Top 500', descricao: 'Entrou no top 500 do ranking global', icone: '📊', tier: 2, conquistado: true, dataConquista: new Date('2026-04-13') },
  { id: 'b5', nome: '100 Vitórias', descricao: 'Acumulou 100 vitórias históricas', icone: '💎', tier: 2, conquistado: true, dataConquista: new Date('2026-04-14') },
  { id: 'b6', nome: 'Top 100', descricao: 'Entre os 100 melhores do ranking', icone: '👑', tier: 3, conquistado: false, progressoAtual: 312, progressoMax: 100 },
  { id: 'b7', nome: 'Nível 50', descricao: 'Atingiu o nível 50 — semi-lendário', icone: '🚀', tier: 3, conquistado: false, progressoAtual: 47, progressoMax: 50 },
  { id: 'b8', nome: 'Truco Master', descricao: '1.000 pontos em um único dia', icone: '⚡', tier: 4, conquistado: false, progressoAtual: 480, progressoMax: 1000 },
];

// ── Pontuação Semanal Mock ────────────────────────────────────
export const PONTUACAO_SEMANAL_MOCK: PontuacaoDia[] = [
  { data: '09/04', pontos: 340 },
  { data: '10/04', pontos: 180 },
  { data: '11/04', pontos: 520 },
  { data: '12/04', pontos: 95  },
  { data: '13/04', pontos: 410 },
  { data: '14/04', pontos: 280 },
  { data: '15/04', pontos: 480 },
];

// ── Histórico de Partidas Mock ────────────────────────────────
const _av = (seed: string) => `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${seed}&backgroundColor=1a1040`;
export const GAME_HISTORY_MOCK: GameHistory[] = [
  { id: 'g01', data: new Date('2026-04-15T22:30:00'), oponenteId: 'amigo-001', oponenteNick: 'TrucoMestre', oponenteAvatar: _av('TrucoMestre'), resultado: 'vitoria',  pontosGanhos:  120, modo: 'paulista', duracaoMin: 12 },
  { id: 'g02', data: new Date('2026-04-15T21:00:00'), oponenteId: 'amigo-002', oponenteNick: 'RainhaTruco', oponenteAvatar: _av('RainhaTruco'), resultado: 'derrota',  pontosGanhos:  -80, modo: 'mineiro',  duracaoMin:  8 },
  { id: 'g03', data: new Date('2026-04-15T19:00:00'), oponenteId: 'oponente-ZeroMedo', oponenteNick: 'ZeroMedo',    oponenteAvatar: _av('ZeroMedo'),    resultado: 'vitoria',  pontosGanhos:  95,  modo: 'paulista', duracaoMin: 15 },
  { id: 'g04', data: new Date('2026-04-14T23:10:00'), oponenteId: 'amigo-003', oponenteNick: 'Ferreiro77',  oponenteAvatar: _av('Ferreiro77'),  resultado: 'vitoria',  pontosGanhos: 140,  modo: 'mineiro',  duracaoMin: 11 },
  { id: 'g05', data: new Date('2026-04-14T21:00:00'), oponenteId: 'oponente-ManilhaMax', oponenteNick: 'ManilhaMax',  oponenteAvatar: _av('ManilhaMax'),  resultado: 'derrota',  pontosGanhos:  -60, modo: 'paulista', duracaoMin:  7 },
  { id: 'g06', data: new Date('2026-04-14T19:30:00'), oponenteId: 'oponente-FerTruco', oponenteNick: 'FerTruco',    oponenteAvatar: _av('FerTruco'),    resultado: 'abandono', pontosGanhos:  -30, modo: 'mineiro',  duracaoMin:  3 },
  { id: 'g07', data: new Date('2026-04-13T22:00:00'), oponenteId: 'oponente-Julinha11', oponenteNick: 'Julinha11',   oponenteAvatar: _av('Julinha11'),   resultado: 'vitoria',  pontosGanhos: 110,  modo: 'paulista', duracaoMin: 14 },
  { id: 'g08', data: new Date('2026-04-13T20:00:00'), oponenteId: 'oponente-ZapaDor', oponenteNick: 'ZapaDor',     oponenteAvatar: _av('ZapaDor'),     resultado: 'derrota',  pontosGanhos:  -90, modo: 'mineiro',  duracaoMin:  9 },
  { id: 'g09', data: new Date('2026-04-13T18:00:00'), oponenteId: 'oponente-DiegoFull', oponenteNick: 'DiegoFull',   oponenteAvatar: _av('DiegoFull'),   resultado: 'vitoria',  pontosGanhos:  75,  modo: 'paulista', duracaoMin: 16 },
  { id: 'g10', data: new Date('2026-04-12T22:00:00'), oponenteId: 'oponente-Baralho23', oponenteNick: 'Baralho23',   oponenteAvatar: _av('Baralho23'),   resultado: 'vitoria',  pontosGanhos:  90,  modo: 'mineiro',  duracaoMin: 13 },
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
