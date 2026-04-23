// ============================================================
// usePresenceTracker — Rastreia presença multi-device (canal arena global)
// ============================================================

import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export function usePresenceTracker(userId: string | undefined) {
  const presenceChannelRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) return;

    presenceChannelRef.current = supabase.channel('presence-arena', {
      config: {
        presence: {
          key: `user-${userId}`,
        },
      },
    });

    presenceChannelRef.current.subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        await presenceChannelRef.current.track({
          user_id: userId,
          online_at: new Date().toISOString(),
        });
      }
    });

    return () => {
      if (presenceChannelRef.current) {
        supabase.removeChannel(presenceChannelRef.current);
        presenceChannelRef.current = null;
      }
    };
  }, [userId]);
}
