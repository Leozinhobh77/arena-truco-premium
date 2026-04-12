// ============================================================
// STORE — useAuthStore
// Simula Login/Sessão do usuário (sem back-end)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario } from '../types';
import { USUARIO_MOCK } from '../mockData';

interface AuthState {
  usuario: Usuario | null;
  logado: boolean;
  carregando: boolean;

  loginSimulado: (nick: string) => Promise<void>;
  logout: () => void;
  atualizarMoedas: (delta: number) => void;
  atualizarXP: (delta: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,
      logado: false,
      carregando: false,

      loginSimulado: async (nick: string) => {
        set({ carregando: true });
        // Simula delay de rede para o efeito premium
        await new Promise(r => setTimeout(r, 1800));
        set({
          usuario: {
            ...USUARIO_MOCK,
            nick: nick || USUARIO_MOCK.nick,
            nome: nick || USUARIO_MOCK.nome,
          },
          logado: true,
          carregando: false,
        });
      },

      logout: () => set({ usuario: null, logado: false }),

      atualizarMoedas: (delta) => {
        const { usuario } = get();
        if (!usuario) return;
        set({ usuario: { ...usuario, moedas: Math.max(0, usuario.moedas + delta) } });
      },

      atualizarXP: (delta) => {
        const { usuario } = get();
        if (!usuario) return;
        const novoXP = usuario.xp + delta;
        const subiu = novoXP >= usuario.xpProximoNivel;
        set({
          usuario: {
            ...usuario,
            xp: subiu ? novoXP - usuario.xpProximoNivel : novoXP,
            nivel: subiu ? usuario.nivel + 1 : usuario.nivel,
            xpProximoNivel: subiu ? Math.floor(usuario.xpProximoNivel * 1.3) : usuario.xpProximoNivel,
          },
        });
      },
    }),
    {
      name: 'arena-truco-auth',
      partialize: (state) => ({ usuario: state.usuario, logado: state.logado }),
    }
  )
);
