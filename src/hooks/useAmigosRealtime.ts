// ============================================================
// useAmigosRealtime — Arena Truco Premium
// Realtime Subscription Correta (Opção 1)
// Atualiza em tempo real (<100ms) quando status muda
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';
import { usePresenceTracker } from './usePresenceTracker';
import type { Amigo } from '../types';

function formatarUltimaAtividade(statusAmigo: string, tempoJogandoMin?: number): string {
  if (statusAmigo === 'disponivel') return 'Disponível para jogar';
  if (statusAmigo === 'jogando') return `Jogando há ${tempoJogandoMin ?? 0}min`;
  if (statusAmigo === 'offline') return 'Offline agora';
  return '';
}

export function useAmigosRealtime(meuId: string | undefined) {
  const { usuario } = useAuthStore();
  const idAtual = meuId || usuario?.id;
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [loading, setLoading] = useState(true);
  const subscriptionRef = useRef<any>(null);
  const amigoIdsRef = useRef<string[]>([]);
  const presenceChannelsRef = useRef<Map<string, any>>(new Map());

  usePresenceTracker(idAtual);

  // Buscar amigos inicialmente
  const carregarAmigos = useCallback(async () => {
    if (!idAtual) {
      setLoading(false);
      return;
    }

    try {
      // Buscar amizades aceitas (eu enviei ou recebi) — em paralelo
      const [query1, query2] = await Promise.all([
        (supabase as any)
          .from('amizades')
          .select('id, remetente_id, destinatario_id, status')
          .eq('status', 'aceita')
          .eq('remetente_id', idAtual),
        (supabase as any)
          .from('amizades')
          .select('id, remetente_id, destinatario_id, status')
          .eq('status', 'aceita')
          .eq('destinatario_id', idAtual),
      ]);

      const amizades = [
        ...(query1.data || []),
        ...(query2.data || []),
      ];

      if ((query1.error || query2.error) && amizades.length === 0) {
        console.warn('❌ Erro ao buscar amizades:', query1.error?.message || query2.error?.message);
        setLoading(false);
        return;
      }

      // Extrair IDs dos amigos
      const amigoIds = amizades.map((a: any) =>
        a.remetente_id === idAtual ? a.destinatario_id : a.remetente_id
      );

      amigoIdsRef.current = amigoIds;

      if (amigoIds.length === 0) {
        setAmigos([]);
        setLoading(false);
        return;
      }

      // Buscar profiles dos amigos (incluindo status REAL)
      const { data: profiles, error: erroProfiles } = await (supabase as any)
        .from('profiles')
        .select('id, nick, avatar_url, status_msg, status_atual, atualizado_status_em, nivel, xp, xp_proximo')
        .in('id', amigoIds);

      if (erroProfiles) {
        console.warn('❌ Erro ao buscar profiles:', erroProfiles.message);
        setLoading(false);
        return;
      }

      // Construir array de amigos com status real
      const resultado: Amigo[] = (profiles as any[] || []).map((p: any) => ({
        id: p.id,
        nick: p.nick,
        nome: p.nick,
        avatar: p.avatar_url ?? `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${p.nick}&backgroundColor=1a1040`,
        nivel: p.nivel || 1,
        xp: p.xp || 0,
        xpProximoNivel: p.xp_proximo || 100,
        statusAmigo: (p.status_atual || 'offline') as 'disponivel' | 'jogando' | 'offline',
        statusMsg: p.status_msg || 'Sem status',
        statusMsgAtualizada: new Date(p.atualizado_status_em || new Date()),
        modoJogo: undefined,
        tempoJogandoMin: 0,
        ultimaAtividade: formatarUltimaAtividade(p.status_atual || 'offline', 0),
        ultimaAtividadeEm: new Date().toISOString(),
        vitorias: 0,
        derrotas: 0,
        partidas: 0,
        ranking: 0,
        moedas: 0,
        gemas: 0,
        clan: undefined,
      }));

      setAmigos(resultado);
      setLoading(false);

      // Inicia subscription Realtime para monitorar mudanças
      iniciarSubscription(amigoIds);
    } catch (err) {
      console.warn('❌ Erro ao carregar amigos:', err);
      setLoading(false);
    }
  }, [idAtual]);

  // Atualizar status de um amigo em tempo real (instantâneo)
  const atualizarAmigoRealtime = useCallback((amigoId: string, novoStatus: string) => {
    setAmigos((prev) =>
      prev.map((a) => {
        if (a.id !== amigoId) return a;
        const statusValido = (novoStatus as 'disponivel' | 'jogando' | 'offline') || 'offline';
        return {
          ...a,
          statusAmigo: statusValido,
          ultimaAtividade: formatarUltimaAtividade(statusValido, 0),
          ultimaAtividadeEm: new Date().toISOString(),
        };
      })
    );
  }, []);

  // Monitorar presença global (1 canal para todos os amigos)
  const monitorarPresencaAmigos = useCallback((amigoIds: string[]) => {
    if (presenceChannelsRef.current.has('arena')) return;

    const arenaPresence = supabase.channel('presence-arena', {
      config: { presence: { key: `user-${idAtual}` } },
    });

    arenaPresence
      .on('presence', { event: 'sync' }, () => {
        const state = arenaPresence.presenceState();
        const usuariosAtivos = new Set(
          Object.keys(state).map(key => key.split('-')[1])
        );

        amigoIds.forEach(amigoId => {
          const estaOnline = usuariosAtivos.has(amigoId);
          if (!estaOnline) {
            atualizarAmigoRealtime(amigoId, 'offline');
          }
        });
      })
      .on('presence', { event: 'leave' }, () => {
        setTimeout(() => {
          const state = arenaPresence.presenceState();
          const usuariosAtivos = new Set(
            Object.keys(state).map(key => key.split('-')[1])
          );

          amigoIds.forEach(amigoId => {
            const estaOnline = usuariosAtivos.has(amigoId);
            if (!estaOnline) {
              atualizarAmigoRealtime(amigoId, 'offline');
            }
          });
        }, 100);
      })
      .subscribe();

    presenceChannelsRef.current.set('arena', arenaPresence);
  }, [idAtual, atualizarAmigoRealtime]);

  // Iniciar subscription Realtime (monitora mudanças em tempo real)
  const iniciarSubscription = useCallback((amigoIds: string[]) => {
    if (!idAtual || amigoIds.length === 0) return;

    // Se já existe subscription para este idAtual, não criar nova
    if (subscriptionRef.current) return;

    const channelName = `amigos-realtime-${idAtual}`;

    subscriptionRef.current = (supabase as any)
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles' },
        (payload: any) => {
          if (payload.new?.id && amigoIds.includes(payload.new.id) && payload.new?.status_atual) {
            atualizarAmigoRealtime(payload.new.id, payload.new.status_atual);
          }
        }
      )
      .subscribe();

    monitorarPresencaAmigos(amigoIds);
  }, [idAtual, monitorarPresencaAmigos]);

  // Limpar subscription ao desmontar
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
      const arenaChannel = presenceChannelsRef.current.get('arena');
      if (arenaChannel) {
        supabase.removeChannel(arenaChannel);
      }
      presenceChannelsRef.current.clear();
    };
  }, []);

  // Carregar amigos ao montar
  useEffect(() => {
    carregarAmigos();
  }, [carregarAmigos]);

  const totalOnline = amigos.filter(a => a.statusAmigo !== 'offline').length;

  return {
    amigos,
    totalOnline,
    loading,
    recarregar: carregarAmigos,
  };
}
