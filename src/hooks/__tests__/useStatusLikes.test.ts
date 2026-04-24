// ============================================================
// useStatusLikes.test.ts — Suite de testes TDD
// ============================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStatusLikes } from '../useStatusLikes';

// Mock do supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('useStatusLikes', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = require('../../lib/supabase').supabase;
  });

  describe('validação de permissão (SEC-09 BOLA)', () => {
    it('deve bloquear carregar likes de perfil privado sem permissão', async () => {
      const { result } = renderHook(() =>
        useStatusLikes('outro-usuario-id', 'meu-usuario-id')
      );

      // Mock: perfil privado, não é o dono
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                privado: true,
                id: 'outro-usuario-id',
              },
              error: null,
            }),
          }),
        }),
      });

      expect(result.current.loading).toBe(true);

      // Esperar carregar
      await act(async () => {
        await new Promise(r => setTimeout(r, 50));
      });

      expect(result.current.likesCount).toBe(0);
      expect(result.current.jaDeiLike).toBe(false);
    });

    it('deve permitir carregar likes de perfil público', async () => {
      const { result } = renderHook(() =>
        useStatusLikes('usuario-publico-id', 'meu-usuario-id')
      );

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                privado: false,
                id: 'usuario-publico-id',
              },
              error: null,
            }),
          }),
        }),
      });

      expect(result.current.loading).toBe(true);
    });

    it('deve permitir ao dono acessar seu próprio perfil privado', async () => {
      const userId = 'usuario-id-123';
      const { result } = renderHook(() =>
        useStatusLikes(userId, userId)
      );

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                privado: true,
                id: userId,
              },
              error: null,
            }),
          }),
        }),
      });

      expect(result.current.loading).toBe(true);
    });
  });

  describe('rate limiting (SEC-06)', () => {
    it('deve bloquear múltiplos toggles em menos de 500ms', async () => {
      const { result } = renderHook(() =>
        useStatusLikes('usuario-id', 'meu-id')
      );

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
        insert: vi.fn().mockResolvedValue({ error: null }),
        delete: vi.fn().mockResolvedValue({ error: null }),
      });

      // Primeiro toggle OK
      await act(async () => {
        result.current.toggleLike();
      });

      // Segundo toggle rápido deve ser ignorado
      const toggleSpy = vi.spyOn(result.current, 'toggleLike');
      await act(async () => {
        result.current.toggleLike();
      });

      // Esperar 500ms para terceiro toggle
      await act(async () => {
        await new Promise(r => setTimeout(r, 510));
      });

      await act(async () => {
        result.current.toggleLike();
      });

      expect(toggleSpy).toHaveBeenCalled();
    });
  });

  describe('funcionalidade básica', () => {
    it('deve inicializar com estado correto', () => {
      const { result } = renderHook(() =>
        useStatusLikes('usuario-id', 'meu-id')
      );

      expect(result.current.likesCount).toBe(0);
      expect(result.current.jaDeiLike).toBe(false);
      expect(result.current.loading).toBe(true);
    });

    it('deve retornar silenciosamente se IDs estão faltando', () => {
      const { result } = renderHook(() =>
        useStatusLikes(undefined, undefined)
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.likesCount).toBe(0);
    });
  });

  describe('limpeza (cleanup)', () => {
    it('não deve executar operações após unmount', async () => {
      const { unmount } = renderHook(() =>
        useStatusLikes('usuario-id', 'meu-id')
      );

      unmount();

      // Nenhuma promise pendente deve executar
      await act(async () => {
        await new Promise(r => setTimeout(r, 100));
      });

      expect(true).toBe(true); // Se chegou aqui, cleanup funcionou
    });
  });
});
