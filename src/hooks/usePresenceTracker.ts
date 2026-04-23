// ============================================================
// usePresenceTracker — Rastreia presença multi-device via Supabase
// ============================================================

import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export function usePresenceTracker(userId: string | undefined) {
  const presenceChannelRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) return;

    const channelName = `presence-${userId}`;

    presenceChannelRef.current = supabase.channel(channelName, {
      config: {
        presence: {
          key: `${userId}-${Math.random()}`,
        },
      },
    });

    presenceChannelRef.current
      .on('presence', { event: 'sync' }, () => {
        console.log(`✅ [Presence] ${userId}: presença sincronizada`);
      })
      .on('presence', { event: 'join' }, () => {
        console.log(`✅ [Presence] ${userId}: novo dispositivo entrou`);
      })
      .on('presence', { event: 'leave' }, () => {
        console.log(`⚫ [Presence] ${userId}: dispositivo saiu`);
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannelRef.current.track({
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
