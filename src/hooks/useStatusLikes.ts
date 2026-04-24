// ============================================================
// useStatusLikes — Gerencia likes em status
// ============================================================
// SEC-06: Rate limiting (anti-spam)
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

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

  // Carregar likes do status
  const carregarLikes = useCallback(async () => {
    if (!statusOwnerId || !isMountedRef.current) return;

    try {
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
  }, [statusOwnerId, currentUserId]);

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
      if (jaDeiLike) {
        // Remover like
        const { error } = await supabase
          .from('status_likes')
          .delete()
          .eq('usuario_id', currentUserId)
          .eq('status_owner_id', statusOwnerId);

        if (error) {
          console.error('[useStatusLikes] Erro ao remover like:', error);
          ultimoToggleRef.current = 0;
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
          ultimoToggleRef.current = 0;
          return;
        }

        if (isMountedRef.current) {
          setJaDeiLike(true);
          setLikesCount((prev) => prev + 1);
        }
      }
    } catch (err) {
      console.error('[useStatusLikes] Erro ao toggle like:', err);
      ultimoToggleRef.current = 0;
    }
  }, [statusOwnerId, currentUserId, jaDeiLike]);

  return {
    likesCount,
    jaDeiLike,
    loading,
    toggleLike,
  };
}
