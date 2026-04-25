// ============================================================
// useChatConvite — Escuta convites de chat em broadcast
// ============================================================
// Realtime Supabase Broadcast — sem persistência no banco
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Convite {
  deId: string;
  deNick: string;
  deAvatar: string;
}

export function useChatConvite(meuId: string | undefined) {
  const [convitePendente, setConvitePendente] = useState<Convite | null>(null);
  const channelRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (!meuId || !isMountedRef.current) return;

    // Subscribe no channel de convites para este usuário
    const channel = supabase.channel(`convite-${meuId}`);

    channel
      .on(
        'broadcast',
        { event: 'convite-chat' },
        ({ payload }) => {
          if (isMountedRef.current) {
            setConvitePendente(payload as Convite);
            // Toca som de notificação
            tocarSom();
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meuId]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const limparConvite = useCallback(() => {
    setConvitePendente(null);
  }, []);

  return { convitePendente, limparConvite };
}

// ============================================================
// Web Audio API — Som de notificação (880Hz, 0.4s)
// ============================================================
function tocarSom() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.frequency.value = 880; // A5
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);

    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.4);
  } catch (err) {
    console.warn('[useChatConvite] Não foi possível tocar som:', err);
  }
}
