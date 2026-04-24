// ============================================================
// useStatusLikes — Gerencia likes em status com validação BOLA
// ============================================================
// SEC-09: Broken Object Level Authorization protection
// SEC-06: Rate limiting (anti-spam)
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface VerificacaoPermissao {
  temAcesso: boolean;
  motivo?: string;
}

export function useStatusLikes(
  statusOwnerId: string | undefined,
  currentUserId: string | undefined
) {
  const [likesCount, setLikesCount] = useState(0);
  const [jaDeiLike, setJaDeiLike] = useState(false);
  const [loading, setLoading] = useState(true);

  // Rate limiting: último timestamp de toggle bem-sucedido
  const ultimoToggleRef = useRef<number>(0);
  const RATE_LIMIT_MS = 500;

  // Flag para cancelar operações após unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ✅ SEC-09: Verificar permissão antes de qualquer operação
  const verificarAcesso = useCallback(async (): Promise<VerificacaoPermissao> => {
    if (!statusOwnerId || !currentUserId) {
      return { temAcesso: false, motivo: 'IDs ausentes' };
    }

    try {
      // Verificar se o perfil do dono é público OU se currentUser é o dono
      const { data: profile, error } = await (supabase
        .from('profiles')
        .select('id, privado')
        .eq('id', statusOwnerId)
        .single() as any);

      if (error || !profile) {
        return { temAcesso: false, motivo: 'Perfil não encontrado' };
      }

      // Perfil privado: só o dono pode acessar
      if ((profile as any).privado && (profile as any).id !== currentUserId) {
        return { temAcesso: false, motivo: 'Perfil privado' };
      }

      return { temAcesso: true };
    } catch (err) {
      console.error('[useStatusLikes] Erro ao verificar permissão:', err);
      return { temAcesso: false, motivo: 'Erro na validação' };
    }
  }, [statusOwnerId, currentUserId]);

  // Carregar likes do status
  const carregarLikes = useCallback(async () => {
    if (!statusOwnerId || !isMountedRef.current) return;

    try {
      // ✅ SEC-09: Verificar permissão PRIMEIRO
      const permissao = await verificarAcesso();
      if (!permissao.temAcesso) {
        if (isMountedRef.current) {
          setLoading(false);
        }
        return;
      }

      // Contar likes do status
      const { count } = await supabase
        .from('status_likes')
        .select('*', { count: 'exact', head: true })
        .eq('status_owner_id', statusOwnerId);

      if (isMountedRef.current) {
        setLikesCount(count || 0);
      }

      // Verificar se EU já dei like
      if (currentUserId) {
        const { data } = await supabase
          .from('status_likes')
          .select('id')
          .eq('usuario_id', currentUserId)
          .eq('status_owner_id', statusOwnerId)
          .single();

        if (isMountedRef.current) {
          setJaDeiLike(!!data);
        }
      }
    } catch (err) {
      console.error('[useStatusLikes] Erro ao carregar likes:', err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [statusOwnerId, currentUserId, verificarAcesso]);

  // Load on mount ou mudança de IDs
  useEffect(() => {
    if (!statusOwnerId) {
      setLoading(false);
      return;
    }

    carregarLikes();
  }, [statusOwnerId, currentUserId, carregarLikes]);

  // ✅ SEC-06: Toggle com rate limiting
  const toggleLike = useCallback(async () => {
    if (!statusOwnerId || !currentUserId) {
      console.warn('[useStatusLikes] toggleLike bloqueado — IDs ausentes:', {
        statusOwnerId,
        currentUserId,
      });
      return;
    }

    // ✅ SEC-06: Rate limit — máximo 1 toggle a cada 500ms
    const agora = Date.now();
    if (agora - ultimoToggleRef.current < RATE_LIMIT_MS) {
      console.warn('[useStatusLikes] Rate limit ativado — espere 500ms');
      return;
    }
    ultimoToggleRef.current = agora;

    try {
      // ✅ SEC-09: Verificar permissão ANTES de qualquer operação
      const permissao = await verificarAcesso();
      if (!permissao.temAcesso) {
        console.warn(
          '[useStatusLikes] Acesso negado:',
          permissao.motivo
        );
        return; // ← Bloqueia silenciosamente, não revela motivo ao usuário
      }

      if (jaDeiLike) {
        // Remover like
        const { error } = await supabase
          .from('status_likes')
          .delete()
          .eq('usuario_id', currentUserId)
          .eq('status_owner_id', statusOwnerId);

        if (error) {
          console.error('[useStatusLikes] Erro ao remover like:', error);
          ultimoToggleRef.current = 0; // Reset rate limit em caso de erro
          return;
        }

        if (isMountedRef.current) {
          setJaDeiLike(false);
          setLikesCount((prev) => Math.max(0, prev - 1));
        }
      } else {
        // Adicionar like
        const { error } = await (supabase as any)
          .from('status_likes')
          .insert([
            {
              usuario_id: currentUserId,
              status_owner_id: statusOwnerId,
            },
          ]);

        if (error) {
          console.error('[useStatusLikes] Erro ao adicionar like:', error);
          ultimoToggleRef.current = 0; // Reset rate limit em caso de erro
          return;
        }

        if (isMountedRef.current) {
          setJaDeiLike(true);
          setLikesCount((prev) => prev + 1);
        }
      }

      // ✅ Sem setTimeout — state foi atualizado otimisticamente
      // Se precisar sincronizar, carregarLikes() é chamado via dependências
    } catch (err) {
      console.error('[useStatusLikes] Erro ao toggle like:', err);
      ultimoToggleRef.current = 0; // Reset rate limit em caso de erro
    }
  }, [statusOwnerId, currentUserId, jaDeiLike, verificarAcesso]);

  return {
    likesCount,
    jaDeiLike,
    loading,
    toggleLike,
  };
}
