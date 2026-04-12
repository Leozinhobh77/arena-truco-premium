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
  ranking: number;
  vitorias: number;
  derrotas: number;
  partidas: number;
  clan?: string;
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
  | 'clan-chat'
  | 'configuracoes'
  | 'clan-config'
  | 'criar-clan'
  | 'perfil';

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
