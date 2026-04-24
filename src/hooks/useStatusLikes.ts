// ============================================================
// useStatusLikes — Gerencia likes no status
// ============================================================

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useStatusLikes(statusOwnerIdId: string | undefined, currentUserId: string | undefined) {
  const [likesCount, setLikesCount] = useState(0);
  const [jaDeiLike, setJaDeiLike] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar likes ao montar
  useEffect(() => {
    if (!statusOwnerIdId) {
      setLoading(false);
      return;
    }

    carregarLikes();
  }, [statusOwnerIdId, currentUserId]);

  const carregarLikes = async () => {
    if (!statusOwnerIdId) return;

    try {
      // Contar likes do status
      const { count } = await supabase
        .from('status_likes')
        .select('*', { count: 'exact', head: true })
        .eq('status_owner_id', statusOwnerIdId);

      setLikesCount(count || 0);

      // Verificar se EU já dei like
      if (currentUserId) {
        const { data } = await supabase
          .from('status_likes')
          .select('id')
          .eq('usuario_id', currentUserId)
          .eq('status_owner_id', statusOwnerIdId)
          .single();

        setJaDeiLike(!!data);
      }
    } catch (err) {
      console.error('Erro ao carregar likes:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    if (!statusOwnerIdId || !currentUserId) return;

    try {
      if (jaDeiLike) {
        // Remover like
        const { error } = await supabase
          .from('status_likes')
          .delete()
          .eq('usuario_id', currentUserId)
          .eq('status_owner_id', statusOwnerIdId);

        if (error) {
          console.error('Erro ao remover like:', error);
          return;
        }

        setJaDeiLike(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        // Adicionar like
        const { error } = await (supabase
          .from('status_likes')
          .insert([
            {
              usuario_id: currentUserId,
              status_owner_id: statusOwnerIdId,
            },
          ]) as Promise<{ data: unknown; error: unknown }>);

        if (error) {
          console.error('Erro ao adicionar like:', error);
          return;
        }

        setJaDeiLike(true);
        setLikesCount((prev) => prev + 1);
      }

      // Recarregar dados do servidor para garantir sincronização
      setTimeout(() => {
        carregarLikes();
      }, 300);
    } catch (err) {
      console.error('Erro ao toggle like:', err);
    }
  };

  return { likesCount, jaDeiLike, loading, toggleLike };
}
