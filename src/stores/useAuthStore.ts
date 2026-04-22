// ============================================================
// STORE — useAuthStore
// Autenticação REAL via Supabase Auth + sincronização de perfil
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { Profile, RankingRow } from '../lib/supabase.types';
import type { Usuario } from '../types';

// Helpers de tipagem para queries do Supabase
type ProfileResult = { data: Profile | null; error: unknown };
type RankingResult = { data: Pick<RankingRow, 'vitorias' | 'derrotas' | 'abandonos' | 'partidas_totais' | 'posicao_ranking'> | null; error: unknown };

// Converte Profile do Supabase → Usuario do app
function profileParaUsuario(profile: Profile, email?: string): Usuario {
  return {
    id: profile.id,
    nome: email?.split('@')[0] ?? profile.nick,
    nick: profile.nick,
    avatar: profile.avatar_url ?? `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${profile.nick}&backgroundColor=1a1040`,
    nivel: profile.nivel,
    xp: profile.xp,
    xpProximoNivel: profile.xp_proximo,
    moedas: profile.moedas,
    gemas: profile.gemas,
    ranking: 0,   // calculado pela VIEW ranking — buscado separado
    vitorias: 0,  // calculado pela VIEW ranking
    derrotas: 0,  // calculado pela VIEW ranking
    partidas: 0,  // calculado pela VIEW ranking
    clan: undefined,
    statusMsg: profile.status_msg ?? undefined,
    createdAt: profile.criado_em,
  };
}

interface AuthState {
  usuario: Usuario | null;
  logado: boolean;
  carregando: boolean;
  erro: string | null;

  // Ações de auth
  signUp: (email: string, senha: string, nick: string) => Promise<void>;
  signIn: (email: string, senha: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;

  // Ações de Perfil / Customização
  uploadAvatar: (file: File) => Promise<string>;
  atualizarPerfil: (dados: { nick?: string; avatar_url?: string; status_msg?: string }) => Promise<void>;

  // Sincronização de sessão (chamada no App.tsx no mount)
  inicializarSessao: () => Promise<void>;

  // Ações de perfil (legadas, usadas em GameOverlay etc.)
  atualizarMoedas: (delta: number) => void;
  atualizarXP: (delta: number) => void;

  // Limpar erro
  limparErro: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,
      logado: false,
      carregando: false,
      erro: null,

      // ── CADASTRO ─────────────────────────────────────────
      signUp: async (email: string, senha: string, nick: string) => {
        set({ carregando: true, erro: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password: senha,
            options: {
              data: { nick: nick.trim() },
            },
          });

          if (error) throw error;
          if (!data.user) throw new Error('Erro ao criar conta. Tente novamente.');

          // Busca o perfil criado pelo trigger
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            set({
              usuario: profileParaUsuario(profile, email),
              logado: true,
              carregando: false,
            });
          } else {
            // Perfil ainda sendo criado pelo trigger, aguarda um pouco
            await new Promise(r => setTimeout(r, 1500));
            const { data: profileRetry } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            set({
              usuario: profileRetry ? profileParaUsuario(profileRetry, email) : null,
              logado: !!profileRetry,
              carregando: false,
            });
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Erro desconhecido';
          set({ carregando: false, erro: traduzirErro(msg) });
        }
      },

      // ── LOGIN ─────────────────────────────────────────────
      signIn: async (email, senha) => {
        set({ carregando: true, erro: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: senha,
          });

          if (error) throw error;
          if (!data.user) throw new Error('Usuário não encontrado.');

          // Busca perfil + stats do ranking em paralelo
          // ranking pode falhar (500) se a VIEW não existir — não bloqueia login
          const [profileRes, rankingRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', data.user.id).single() as unknown as Promise<ProfileResult>,
            (async () => {
              try {
                return await supabase.from('ranking').select('vitorias, derrotas, abandonos, partidas_totais, posicao_ranking').eq('id', data.user.id).single() as unknown as RankingResult;
              } catch {
                return { data: null, error: 'ranking indisponível' } as RankingResult;
              }
            })(),
          ]);

          if (!profileRes.data) throw new Error('Perfil não encontrado. Contate o suporte.');

          const usuario = profileParaUsuario(profileRes.data, email);

          if (rankingRes.data) {
            usuario.vitorias = rankingRes.data.vitorias ?? 0;
            usuario.derrotas = rankingRes.data.derrotas ?? 0;
            usuario.partidas = rankingRes.data.partidas_totais ?? 0;
            usuario.ranking = rankingRes.data.posicao_ranking ?? 0;
          }

          set({ usuario, logado: true, carregando: false });

          // 🟢 Atualizar status para 'disponivel' quando faz login
          await (supabase as any).from('profiles').update({
            status_atual: 'disponivel',
            atualizado_status_em: new Date().toISOString(),
          }).eq('id', data.user.id).catch(() => {});
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Erro desconhecido';
          set({ carregando: false, erro: traduzirErro(msg) });
        }
      },

      // ── LOGIN GOOGLE ──────────────────────────────────────
      signInWithGoogle: async () => {
        set({ carregando: true, erro: null });
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });
          if (error) throw error;
          // O redirecionamento acontece via navegador, por isso não setamos 'logado' aqui
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Erro desconhecido';
          set({ carregando: false, erro: traduzirErro(msg) });
        }
      },

      // ── UPLOAD AVATAR ─────────────────────────────────────
      uploadAvatar: async (file: File) => {
        const user = get().usuario;
        if (!user) throw new Error('Usuário não autenticado');

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        return data.publicUrl;
      },

      // ── ATUALIZAR PERFIL ──────────────────────────────────
      atualizarPerfil: async (dados: { nick?: string; avatar_url?: string; status_msg?: string }) => {
        const user = get().usuario;
        if (!user) return;

        set({ carregando: true, erro: null });
        try {
          const updateData: Record<string, string> = {
            atualizado_em: new Date().toISOString()
          };
          if (dados.nick) updateData.nick = dados.nick;
          if (dados.avatar_url) updateData.avatar_url = dados.avatar_url;
          if (dados.status_msg !== undefined) updateData.status_msg = dados.status_msg;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error } = await (supabase.from('profiles') as any)
            .update(updateData)
            .eq('id', user.id);

          if (error) throw error;

          // Atualiza o estado local
          set({
            usuario: {
              ...user,
              nick: dados.nick ?? user.nick,
              avatar: dados.avatar_url ?? user.avatar,
              statusMsg: dados.status_msg !== undefined ? dados.status_msg : user.statusMsg
            },
            carregando: false
          });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
          set({ carregando: false, erro: msg });
          throw err;
        }
      },

      // ── LOGOUT ────────────────────────────────────────────
      logout: async () => {
        await supabase.auth.signOut();
        set({ usuario: null, logado: false, erro: null });
      },

      // ── INICIALIZAR SESSÃO (App.tsx mount) ───────────────
      inicializarSessao: async () => {
        set({ carregando: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();

          if (!session?.user) {
            set({ carregando: false, logado: false });
            return;
          }

          const [profileRes, rankingRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', session.user.id).single() as unknown as Promise<ProfileResult>,
            (async () => {
              try {
                return await supabase.from('ranking').select('vitorias, derrotas, abandonos, partidas_totais, posicao_ranking').eq('id', session.user.id).single() as unknown as RankingResult;
              } catch {
                return { data: null, error: 'ranking indisponível' } as RankingResult;
              }
            })(),
          ]);

          let profileData = profileRes.data;

          if (!profileData) {
            // Pode ser um novo usuário do Google (OAuth) e o trigger ainda está rodando.
            // Vamos aguardar 1.5s e tentar de novo.
            await new Promise(r => setTimeout(r, 1500));
            const retryRes = await (supabase.from('profiles').select('*').eq('id', session.user.id).single() as unknown as Promise<ProfileResult>);
            if (retryRes.data) {
              profileData = retryRes.data;
            } else {
              set({ carregando: false, logado: false });
              return;
            }
          }

          const usuario = profileParaUsuario(profileData!, session.user.email);
          if (rankingRes.data) {
            usuario.vitorias = rankingRes.data.vitorias ?? 0;
            usuario.derrotas = rankingRes.data.derrotas ?? 0;
            usuario.partidas = rankingRes.data.partidas_totais ?? 0;
            usuario.ranking = rankingRes.data.posicao_ranking ?? 0;
          }

          set({ usuario, logado: true, carregando: false });

          // 🟢 Atualizar status para 'disponivel' ao retomar sessão
          try {
            await (supabase as any).from('profiles').update({
              status_atual: 'disponivel',
              atualizado_status_em: new Date().toISOString(),
            }).eq('id', session.user.id);
          } catch {
            // silenciar erro — não bloquear inicialização
          }
        } catch {
          set({ carregando: false, logado: false });
        }
      },

      // ── AÇÕES DE PERFIL (otimistas — atualiza local + banco) ──
      atualizarMoedas: (delta) => {
        const { usuario } = get();
        if (!usuario) return;
        const novoValor = Math.max(0, usuario.moedas + delta);
        set({ usuario: { ...usuario, moedas: novoValor } });
        // Persiste no banco em background
        (supabase.from('profiles') as unknown as { update: (v: Partial<Profile>) => { eq: (c: string, v: string) => void } })
          .update({ moedas: novoValor }).eq('id', usuario.id);
      },

      atualizarXP: (delta) => {
        const { usuario } = get();
        if (!usuario) return;
        const novoXP = usuario.xp + delta;
        const subiu = novoXP >= usuario.xpProximoNivel;
        const novoNivel = subiu ? usuario.nivel + 1 : usuario.nivel;
        const xpFinal = subiu ? novoXP - usuario.xpProximoNivel : novoXP;
        const xpProximo = subiu ? Math.floor(usuario.xpProximoNivel * 1.3) : usuario.xpProximoNivel;
        set({
          usuario: { ...usuario, xp: xpFinal, nivel: novoNivel, xpProximoNivel: xpProximo },
        });
        // Persiste no banco em background
        (supabase.from('profiles') as unknown as { update: (v: Partial<Profile>) => { eq: (c: string, v: string) => void } })
          .update({ xp: xpFinal, nivel: novoNivel, xp_proximo: xpProximo }).eq('id', usuario.id);
      },

      limparErro: () => set({ erro: null }),
    }),
    {
      name: 'arena-truco-auth',
      partialize: (state) => ({ usuario: state.usuario, logado: state.logado }),
    }
  )
);

// ── Traduz erros do Supabase para português ─────────────────
function traduzirErro(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Email ou senha incorretos.';
  if (msg.includes('Email not confirmed')) return 'Este e-mail ainda não foi confirmado. Verifique sua caixa de entrada!';
  if (msg.includes('User already registered')) return 'Este email já está cadastrado.';
  if (msg.includes('Password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.';
  if (msg.includes('Unable to validate email')) return 'Email inválido.';
  if (msg.includes('duplicate key') && msg.includes('nick')) return 'Este nick já está em uso. Escolha outro.';
  if (msg.includes('Too many requests') || msg.includes('429')) return 'Muitas tentativas! Aguarde um momento para tentar novamente.';
  return msg;
}
