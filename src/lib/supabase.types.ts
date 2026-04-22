// ============================================================
// SUPABASE TYPES — Arena Truco Premium
// Atualizado para o Schema Completo (Fase 1 + Fase 2)
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ── ROW TYPES ──────────────────────────────────────────────

export interface Profile {
  id: string;
  nick: string;
  avatar_url: string | null;
  nivel: number;
  xp: number;
  xp_proximo: number;
  moedas: number;
  gemas: number;
  modo_favorito: 'mineiro' | 'paulista' | null;
  status_msg: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface Partida {
  id: string;
  modo: 'mineiro' | 'paulista';
  resultado: 'vitoria' | 'derrota' | 'abandono';
  oponente_id: string | null;
  oponente_nick: string | null;
  oponente_avatar: string | null;
  pontos_ganhos: number;
  duracao_min: number;
  jogadores: string[];
  criado_em: string;
}

export interface PontuacaoDiaria {
  id: string;
  perfil_id: string;
  data: string; // 'YYYY-MM-DD'
  pontos: number;
}

export interface BadgeCatalogo {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  tier: 1 | 2 | 3 | 4;
  progresso_max: number | null;
}

export interface Conquista {
  id: string;
  perfil_id: string;
  badge_id: string;
  conquistado: boolean;
  progresso_atual: number;
  conquistado_em: string | null;
}

export interface Amizade {
  id: string;
  remetente_id: string;
  destinatario_id: string;
  status: 'pendente' | 'aceita' | 'rejeitada';
  criado_em: string;
  atualizado_em: string;
}

export interface Recado {
  id: string;
  remetente_id: string;
  destinatario_id: string;
  mensagem: string;
  lido: boolean;
  criado_em: string;
}

export interface Chat {
  id: string;
  usuario1_id: string;
  usuario2_id: string;
  criado_em: string;
}

export interface RankingRow {
  id: string;
  nick: string;
  avatar_url: string | null;
  nivel: number;
  moedas: number;
  vitorias: number;
  derrotas: number;
  abandonos: number;
  partidas_totais: number;
  winrate: number | null;
  posicao_ranking: number;
}

// ── INSERT / UPDATE TYPES ───────────────────────────────────

export type ProfileInsert = Pick<Profile, 'id' | 'nick'> &
  Partial<Omit<Profile, 'id' | 'nick' | 'criado_em' | 'atualizado_em'>>;

export type ProfileUpdate = Partial<
  Pick<Profile, 'nick' | 'avatar_url' | 'nivel' | 'xp' | 'xp_proximo' | 'moedas' | 'gemas' | 'modo_favorito' | 'status_msg'>
>;

export type PartidaInsert = Omit<Partida, 'id' | 'criado_em'>;

export type ConquistaUpdate = Partial<Pick<Conquista, 'conquistado' | 'progresso_atual' | 'conquistado_em'>>;

export type AmizadeInsert = Pick<Amizade, 'remetente_id' | 'destinatario_id'> &
  Partial<Pick<Amizade, 'status'>>;

export type AmizadeUpdate = Partial<Pick<Amizade, 'status'>>;

export type RecadoInsert = Pick<Recado, 'remetente_id' | 'destinatario_id' | 'mensagem'> &
  Partial<Pick<Recado, 'lido'>>;

export type RecadoUpdate = Partial<Pick<Recado, 'lido'>>;

export type ChatInsert = Pick<Chat, 'usuario1_id' | 'usuario2_id'>;

export type ChatUpdate = Partial<Chat>;

// ── DATABASE SCHEMA ─────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      partidas: {
        Row: Partida;
        Insert: PartidaInsert;
        Update: Partial<PartidaInsert>;
      };
      pontuacao_diaria: {
        Row: PontuacaoDiaria;
        Insert: Omit<PontuacaoDiaria, 'id'>;
        Update: Pick<PontuacaoDiaria, 'pontos'>;
      };
      badges_catalogo: {
        Row: BadgeCatalogo;
        Insert: BadgeCatalogo;
        Update: Partial<BadgeCatalogo>;
      };
      conquistas: {
        Row: Conquista;
        Insert: Omit<Conquista, 'id'>;
        Update: ConquistaUpdate;
      };
      amizades: {
        Row: Amizade;
        Insert: AmizadeInsert;
        Update: AmizadeUpdate;
      };
      recados: {
        Row: Recado;
        Insert: RecadoInsert;
        Update: RecadoUpdate;
      };
      chats_privados: {
        Row: Chat;
        Insert: ChatInsert;
        Update: ChatUpdate;
      };
    };
    Views: {
      ranking: {
        Row: RankingRow;
      };
    };
    Functions: {
      registrar_pontos_dia: {
        Args: { p_perfil_id: string; p_pontos: number };
        Returns: void;
      };
      inicializar_conquistas: {
        Args: { p_perfil_id: string };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
  };
}
