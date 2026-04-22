// ============================================================
// useAmigosRealtime — Arena Truco Premium
// Realtime Subscription Correta (Opção 1)
// Atualiza em tempo real (<100ms) quando status muda
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';
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

  // Buscar amigos inicialmente
  const carregarAmigos = useCallback(async () => {
    console.log('🔍 [useAmigosRealtime] idAtual:', idAtual);
    if (!idAtual) {
      console.warn('⚠️ [useAmigosRealtime] Sem idAtual — abortando');
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

      console.log('🔍 [useAmigosRealtime] query1 (remetente):', query1);
      console.log('🔍 [useAmigosRealtime] query2 (destinatario):', query2);

      const amizades = [
        ...(query1.data || []),
        ...(query2.data || []),
      ];

      console.log('🔍 [useAmigosRealtime] Total amizades aceitas encontradas:', amizades.length, amizades);

      if ((query1.error || query2.error) && amizades.length === 0) {
        console.warn('❌ [useAmigosRealtime] Erro ao buscar amizades:', query1.error?.message || query2.error?.message);
        setLoading(false);
        return;
      }

      // Extrair IDs dos amigos
      const amigoIds = amizades.map((a: any) =>
        a.remetente_id === idAtual ? a.destinatario_id : a.remetente_id
      );

      console.log('🔍 [useAmigosRealtime] IDs dos amigos extraídos:', amigoIds);

      amigoIdsRef.current = amigoIds;

      if (amigoIds.length === 0) {
        console.warn('⚠️ [useAmigosRealtime] Nenhum amigo aceito encontrado');
        setAmigos([]);
        setLoading(false);
        return;
      }

      // Buscar profiles dos amigos (incluindo status REAL)
      const { data: profiles, error: erroProfiles } = await (supabase as any)
        .from('profiles')
        .select('id, nick, avatar_url, status_msg, status_atual, atualizado_status_em, nivel, xp, xp_proximo')
        .in('id', amigoIds);

      console.log('🔍 [useAmigosRealtime] Profiles carregados:', profiles);

      if (erroProfiles) {
        console.warn('❌ [useAmigosRealtime] Erro ao buscar profiles:', erroProfiles.message);
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

      console.log('✅ [useAmigosRealtime] Amigos carregados:', resultado);
      console.log('✅ [useAmigosRealtime] Total online:', resultado.filter(a => a.statusAmigo !== 'offline').length);

      setAmigos(resultado);
      setLoading(false);

      // Inicia subscription Realtime para monitorar mudanças
      iniciarSubscription(amigoIds);
    } catch (err) {
      console.warn('❌ [useAmigosRealtime] Erro ao carregar amigos:', err);
      setLoading(false);
    }
  }, [idAtual]);

  // Iniciar subscription Realtime (monitora mudanças em tempo real)
  const iniciarSubscription = useCallback((amigoIds: string[]) => {
    if (!idAtual || amigoIds.length === 0) return;

    // Remover subscription anterior se existir
    if (subscriptionRef.current) {
      (supabase as any).removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
    }

    // Subscribe em mudanças na tabela profiles (qualquer mudança)
    subscriptionRef.current = (supabase as any)
      .channel(`amigos-realtime-${idAtual}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=in.(${amigoIds.join(',')})`,
        },
        (payload: any) => {
          // Quando status_atual muda, atualiza INSTANTANEAMENTE (<100ms)
          if (payload.new?.status_atual) {
            atualizarAmigoRealtime(payload.new.id, payload.new.status_atual);
          }
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime subscription ativa — Status vai atualizar em tempo real!');
        } else if (status === 'CLOSED') {
          console.warn('⚠️ Realtime subscription desconectada');
        }
      });
  }, [idAtual, atualizarAmigoRealtime]);

  // Atualizar status de um amigo em tempo real (instantâneo)
  const atualizarAmigoRealtime = useCallback((amigoId: string, novoStatus: string) => {
    setAmigos((prev) =>
      prev.map((a) => {
        if (a.id === amigoId) {
          const statusValido = (novoStatus as 'disponivel' | 'jogando' | 'offline') || 'offline';
          return {
            ...a,
            statusAmigo: statusValido,
            ultimaAtividade: formatarUltimaAtividade(statusValido, 0),
            ultimaAtividadeEm: new Date().toISOString(),
          };
        }
        return a;
      })
    );
  }, []);

  // Limpar subscription ao desmontar
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
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
