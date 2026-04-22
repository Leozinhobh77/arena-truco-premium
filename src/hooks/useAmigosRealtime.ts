// ============================================================
// useAmigosRealtime — Arena Truco Premium
// Monitora amigos em tempo real via Supabase Realtime
// Atualiza status quando amigos entram/saem online em 2-5s
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

  // Buscar amigos inicialmente
  const carregarAmigos = useCallback(async () => {
    if (!idAtual) {
      setLoading(false);
      return;
    }

    try {
      // Buscar amizades aceitas (eu enviei ou recebi)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: amizades, error: erroAmizades } = await (supabase as any)
        .from('amizades')
        .select('id, remetente_id, destinatario_id, status')
        .eq('status', 'aceita')
        .or(`remetente_id.eq.${idAtual},destinatario_id.eq.${idAtual}`);

      if (erroAmizades || !amizades) {
        console.warn('Erro ao buscar amizades:', erroAmizades?.message);
        setLoading(false);
        return;
      }

      // Extrair IDs dos amigos
      const amigoIds = amizades.map((a: any) =>
        a.remetente_id === idAtual ? a.destinatario_id : a.remetente_id
      );

      if (amigoIds.length === 0) {
        setAmigos([]);
        setLoading(false);
        return;
      }

      // Buscar profiles dos amigos
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profiles } = await (supabase as any)
        .from('profiles')
        .select('id, nick, avatar_url, status_msg')
        .in('id', amigoIds);

      // Simular status (você vai implementar isso com banco depois)
      // Por enquanto: aleatório para testar
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resultado: Amigo[] = (profiles || []).map((p: any) => {
        const statusRandom = Math.random();
        const status = statusRandom > 0.6 ? 'disponivel' : statusRandom > 0.3 ? 'jogando' : 'offline';
        const tempoMin = Math.floor(Math.random() * 60);

        return {
          id: p.id,
          nick: p.nick,
          nome: p.nick,
          avatar: p.avatar_url ?? `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${p.nick}&backgroundColor=1a1040`,
          statusAmigo: status as 'disponivel' | 'jogando' | 'offline',
          statusMsgAtualizada: p.status_msg ?? undefined,
          modoJogo: status === 'jogando' ? (Math.random() > 0.5 ? 'paulista' : 'mineiro') : undefined,
          tempoJogandoMin: status === 'jogando' ? tempoMin : 0,
          ultimaAtividade: formatarUltimaAtividade(status, tempoMin),
          ultimaAtividadeEm: new Date().toISOString(),
        };
      });

      setAmigos(resultado);
      setLoading(false);

      // Inicia subscription Realtime
      iniciarSubscription(resultado);
    } catch (err) {
      console.warn('Erro ao carregar amigos:', err);
      setLoading(false);
    }
  }, [idAtual]);

  // Iniciar subscription Realtime (monitora mudanças em tempo real)
  const iniciarSubscription = useCallback((amigosCatuais: Amigo[]) => {
    if (!idAtual || subscriptionRef.current) return;

    const amigoIds = amigosCatuais.map(a => a.id);

    // Subscribe em mudanças na tabela profiles dos amigos
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscriptionRef.current = (supabase as any)
      .channel(`amigos-${idAtual}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=in.(${amigoIds.join(',')})`,
        },
        (payload: any) => {
          // Quando um perfil muda, atualiza o status
          atualizarAmigoApos(payload.new?.id);
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime subscription iniciada para amigos');
        }
      });
  }, [idAtual]);

  // Atualizar status de um amigo específico após mudança
  const atualizarAmigoApos = useCallback((amigoId: string) => {
    setAmigos((prev) =>
      prev.map((a) => {
        if (a.id === amigoId) {
          // Simular mudança (depois você integra com status real do banco)
          const rand = Math.random();
          const novoStatus = rand > 0.6 ? 'disponivel' : rand > 0.3 ? 'jogando' : 'offline';
          const tempoMin = Math.floor(Math.random() * 60);
          return {
            ...a,
            statusAmigo: novoStatus as 'disponivel' | 'jogando' | 'offline',
            tempoJogandoMin: novoStatus === 'jogando' ? tempoMin : 0,
            ultimaAtividade: formatarUltimaAtividade(novoStatus, tempoMin),
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
