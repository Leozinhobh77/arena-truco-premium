// ============================================================
// usePresenceTracker — Rastreia presença + escuta amigos online
// Canal único: presence-arena (track + listeners juntos)
// ============================================================

import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

type OnPresenceSyncCallback = (usuariosAtivos: Set<string>) => void;

export function usePresenceTracker(
  userId: string | undefined,
  onPresenceSync?: OnPresenceSyncCallback
) {
  const presenceChannelRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) return;

    // Remover canal anterior se existir
    if (presenceChannelRef.current) {
      supabase.removeChannel(presenceChannelRef.current);
      presenceChannelRef.current = null;
    }

    // Criar canal com listeners ANTES de subscribe
    const channel = supabase.channel('presence-arena', {
      config: { presence: { key: `user-${userId}` } },
    });

    // Listener de sync — chamado quando presença é atualizada
    channel.on('presence', { event: 'sync' }, () => {
      if (onPresenceSync) {
        const state = channel.presenceState();
        const ativos = new Set(Object.keys(state).map(k => k.split('-')[1]));
        onPresenceSync(ativos);
      }
    });

    // Listener de leave — alguém saiu
    channel.on('presence', { event: 'leave' }, () => {
      setTimeout(() => {
        if (onPresenceSync) {
          const state = channel.presenceState();
          const ativos = new Set(Object.keys(state).map(k => k.split('-')[1]));
          onPresenceSync(ativos);
        }
      }, 100);
    });

    // Subscribe e track após registrar listeners
    channel.subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
        });
      }
    });

    presenceChannelRef.current = channel;

    return () => {
      if (presenceChannelRef.current) {
        supabase.removeChannel(presenceChannelRef.current);
        presenceChannelRef.current = null;
      }
    };
  }, [userId]);
}
