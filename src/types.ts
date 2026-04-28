// ============================================================
// TYPES — Arena Truco Premium
// Tipagem central de todo o domínio do app
// ============================================================

export type Naipe = 'paus' | 'copas' | 'espadas' | 'ouros';
export type Valor = '4' | '5' | '6' | '7' | 'Q' | 'J' | 'K' | 'A' | '2' | '3';

export interface Carta {
  id: string;
  valor: Valor;
  naipe: Naipe;
  forcaBase: number;  // força base da carte (0-12)
  ehManilha: boolean;
}

export type ModoJogo = 'paulista' | 'mineiro';

export type StatusSala = 'waiting' | 'playing' | 'finished';

export interface Jogador {
  id: string;
  nome: string;
  avatar: string;
  nivel: number;
  pontos: number;
  time: 'nos' | 'eles';
  pronto: boolean;
  isBot: boolean;
  cartas: Carta[];
  cartaJogada?: Carta;
}

export interface Sala {
  id: string;
  nome: string;
  modo: ModoJogo;
  status: StatusSala;
  jogadores: Jogador[];
  maxJogadores: 2 | 4;
  pontoNos: number;
  pontoEles: number;
  rodadaAtual: number;
  vira?: Carta;
  manilha?: Carta;
  tempoRestante?: number;
}

export interface Usuario {
  id: string;
  nome: string;
  nick: string;
  avatar: string;
  nivel: number;
  xp: number;
  xpProximoNivel: number;
  moedas: number;
  gemas: number;
  pontos: number;
  ranking: number;
  vitorias: number;
  derrotas: number;
  partidas: number;
  clan?: string;
  statusMsg?: string;
  createdAt?: string;
}

export interface MensagemChat {
  id: string;
  autorId: string;
  autorNome: string;
  autorAvatar: string;
  texto: string;
  timestamp: Date;
  tipo: 'chat' | 'sistema' | 'truco';
}

export interface Clan {
  id: string;
  nome: string;
  tag: string;
  descricao: string;
  icone: string;
  cor: string;
  membros: number;
  maxMembros: number;
  ultimaMensagem?: string;
  mensagens: MensagemChat[];
}

export type TelaId =
  | 'loja'
  | 'modos'
  | 'arena'
  | 'ranking'
  | 'clans';

export type OverlayId =
  | 'salas'
  | 'jogo'
  | 'game-room'
  | 'sala-2v2-1'
  | 'cards-gallery'
  | 'amigos-online'
  | 'clan-chat'
  | 'configuracoes'
  | 'clan-config'
  | 'criar-clan'
  | 'perfil'
  | 'friend-action'
  | 'deixar-recado'
  | 'recados'
  | 'arena-menu'
  | 'solicitacoes-amizade'
  | 'status-editor'
  | 'chat-privado';

export type StatusAmizade = 'pendente' | 'aceita' | 'rejeitada' | 'nenhuma';

export interface SolicitacaoAmizade {
  id: string;
  remetenteId: string;
  remetenteNick: string;
  remetenteAvatar: string;
  remetenteNivel: number;
  remetenteVitorias: number;
  remetentePartidas: number;
  status: 'pendente' | 'aceita' | 'rejeitada';
  criadoEm: string;
  atualizadoEm: string;
}

export interface ItemLoja {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  moeda: 'moedas' | 'gemas';
  icone: string;
  destaque?: boolean;
  tag?: string;
}

export interface JogadorRanking {
  posicao: number;
  usuario: Usuario;
  pontos: number;
}

export interface Badge {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  tier: 1 | 2 | 3 | 4;
  conquistado: boolean;
  dataConquista?: Date;
  progressoAtual?: number;
  progressoMax?: number;
}

export interface GameHistory {
  id: string;
  data: Date;
  oponenteId: string;
  oponenteNick: string;
  oponenteAvatar: string;
  resultado: 'vitoria' | 'derrota' | 'abandono';
  pontosGanhos: number;
  modo: ModoJogo;
  duracaoMin: number;
}

export interface PontuacaoDia {
  data: string;   // 'DD/MM'
  pontos: number;
}

export type StatusAmigoOnline = 'disponivel' | 'jogando' | 'offline';

export interface Amigo {
  id: string;
  nick: string;
  nome: string;
  avatar: string;
  nivel: number;
  vitorias: number;
  derrotas: number;
  partidas: number;
  ranking: number;
  clan?: string;
  /** Mensagem de status personalizada pelo usuário */
  statusMsg: string;
  /** Quando o status foi atualizado pela última vez */
  statusMsgAtualizada: Date;
  statusAmigo: StatusAmigoOnline;
  /** Modo em que está jogando — preenchido apenas quando statusAmigo === 'jogando' */
  modoJogo?: ModoJogo;
  /** Há quantos minutos está na partida atual */
  tempoJogandoMin?: number;
  /** Descrição da última atividade (ex: "Jogando Paulista há 5min", "Offline há 2h") */
  ultimaAtividade?: string;
  /** Timestamp da última atividade para ordenação */
  ultimaAtividadeEm?: string;
}

// ── RANKING SYSTEM (Sprint 4.2) ──
export type RankingPeriodo = 'dia' | 'semana' | 'geral' | 'amigos';

export interface RankingStats {
  periodo: RankingPeriodo;
  totalJogadores: number;
  suaPosicao: number;
  seusPontos: number;
  atualizadoEm: string;
}

export interface RankingQueryResponse {
  jogadores: JogadorRanking[];
  stats: RankingStats;
  seu_id: string;
}
