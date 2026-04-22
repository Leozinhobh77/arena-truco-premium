// ============================================================
// useAmizade — Arena Truco Premium
// Hook completo para o sistema de amizades:
// enviar, aceitar, recusar, remover, verificar status, listar
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';
import type { StatusAmizade, SolicitacaoAmizade } from '../types';

// ── Verificar status de amizade entre dois jogadores ────────
export function useStatusAmizade(outroId: string | undefined) {
  const { usuario } = useAuthStore();
  const meuId = usuario?.id;

  const [status, setStatus] = useState<StatusAmizade>('nenhuma');
  const [amizadeId, setAmizadeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Cooldown: timestamp de quando a rejeição expira
  const [cooldownAte, setCooldownAte] = useState<Date | null>(null);

  const verificar = useCallback(async () => {
    if (!meuId || !outroId || meuId === outroId) {
      setStatus('nenhuma');
      setLoading(false);
      return;
    }

    try {
      // Busca qualquer relação entre os dois jogadores (em qualquer direção)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('amizades')
        .select('id, remetente_id, destinatario_id, status, atualizado_em')
        .in('remetente_id', [meuId, outroId])
        .in('destinatario_id', [meuId, outroId]);

      if (error) {
        console.warn('Erro ao verificar amizade:', error.message);
        setStatus('nenhuma');
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setStatus('nenhuma');
        setAmizadeId(null);
        setLoading(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const relacao = data[0] as any;
      setAmizadeId(relacao.id);

      if (relacao.status === 'aceita') {
        setStatus('aceita');
      } else if (relacao.status === 'pendente') {
        setStatus('pendente');
      } else if (relacao.status === 'rejeitada') {
        // Verifica cooldown de 24h
        const rejeitadoEm = new Date(relacao.atualizado_em);
        const expira = new Date(rejeitadoEm.getTime() + 24 * 60 * 60 * 1000);
        const agora = new Date();

        if (agora < expira && relacao.remetente_id === meuId) {
          // Eu fui rejeitado e o cooldown ainda está ativo
          setCooldownAte(expira);
          setStatus('rejeitada');
        } else if (agora >= expira) {
          // Cooldown expirou — deletar registro para permitir novo pedido
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from('amizades')
            .delete()
            .eq('id', relacao.id);
          setStatus('nenhuma');
          setAmizadeId(null);
          setCooldownAte(null);
        } else {
          setStatus('rejeitada');
        }
      }
    } catch (err) {
      console.warn('Erro ao verificar amizade:', err);
      setStatus('nenhuma');
    }

    setLoading(false);
  }, [meuId, outroId]);

  useEffect(() => {
    verificar();
  }, [verificar]);

  // Quem enviou a solicitação? (para saber se mostro "Aceitar" ou "Aguardando")
  const [euEnviei, setEuEnviei] = useState(false);
  useEffect(() => {
    if (!meuId || !outroId) return;
    // Buscar novamente para determinar direção
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from('amizades')
      .select('remetente_id')
      .in('remetente_id', [meuId, outroId])
      .in('destinatario_id', [meuId, outroId])
      .limit(1)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }: any) => {
        if (data?.[0]) {
          setEuEnviei(data[0].remetente_id === meuId);
        }
      })
      .catch((err) => {
        console.warn('Erro ao verificar quem enviou a solicitação:', err);
      });
  }, [meuId, outroId, status]);

  return { status, amizadeId, loading, cooldownAte, euEnviei, recarregar: verificar };
}

// ── Ações de amizade ────────────────────────────────────────
export function useAmizadeActions() {
  const { usuario } = useAuthStore();
  const meuId = usuario?.id;
  const [loading, setLoading] = useState(false);

  const enviarSolicitacao = useCallback(async (destinatarioId: string): Promise<{ ok: boolean; erro?: string }> => {
    if (!meuId) return { ok: false, erro: 'Não autenticado' };
    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('amizades')
        .insert({
          remetente_id: meuId,
          destinatario_id: destinatarioId,
          status: 'pendente',
        });

      setLoading(false);
      if (error) {
        if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
          return { ok: false, erro: 'Solicitação já enviada' };
        }
        return { ok: false, erro: error.message };
      }
      return { ok: true };
    } catch (err) {
      setLoading(false);
      return { ok: false, erro: 'Erro ao enviar solicitação' };
    }
  }, [meuId]);

  const aceitarSolicitacao = useCallback(async (amizadeId: string): Promise<{ ok: boolean }> => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('amizades')
        .update({ status: 'aceita' })
        .eq('id', amizadeId);

      setLoading(false);
      return { ok: !error };
    } catch {
      setLoading(false);
      return { ok: false };
    }
  }, []);

  const recusarSolicitacao = useCallback(async (amizadeId: string): Promise<{ ok: boolean }> => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('amizades')
        .update({ status: 'rejeitada' })
        .eq('id', amizadeId);

      setLoading(false);
      return { ok: !error };
    } catch {
      setLoading(false);
      return { ok: false };
    }
  }, []);

  const removerAmigo = useCallback(async (amizadeId: string): Promise<{ ok: boolean }> => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('amizades')
        .delete()
        .eq('id', amizadeId);

      setLoading(false);
      return { ok: !error };
    } catch {
      setLoading(false);
      return { ok: false };
    }
  }, []);

  return { enviarSolicitacao, aceitarSolicitacao, recusarSolicitacao, removerAmigo, loading };
}

// ── Listar solicitações pendentes recebidas ─────────────────
export function useSolicitacoesPendentes() {
  const { usuario } = useAuthStore();
  const meuId = usuario?.id;
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoAmizade[]>([]);
  const [loading, setLoading] = useState(true);

  const recarregar = useCallback(async () => {
    if (!meuId) { setLoading(false); return; }

    try {
      // Solicitações pendentes onde EU sou o destinatário
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('amizades')
        .select('id, remetente_id, status, criado_em, atualizado_em')
        .eq('destinatario_id', meuId)
        .eq('status', 'pendente')
        .order('criado_em', { ascending: false });

      if (error || !data) {
        console.warn('Erro ao buscar solicitações:', error?.message);
        setLoading(false);
        return;
      }

      // Buscar perfis dos remetentes
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const remetenteIds = data.map((s: any) => s.remetente_id);
      if (remetenteIds.length === 0) {
        setSolicitacoes([]);
        setLoading(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: perfis } = await (supabase as any)
        .from('profiles')
        .select('id, nick, avatar_url, nivel')
        .in('id', remetenteIds);

      // Buscar stats do ranking
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: rankings } = await (supabase as any)
        .from('ranking')
        .select('id, vitorias, partidas_totais')
        .in('id', remetenteIds);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const perfilMap = new Map((perfis || []).map((p: any) => [p.id, p]));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rankMap = new Map((rankings || []).map((r: any) => [r.id, r]));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resultado: SolicitacaoAmizade[] = data.map((s: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const perfil = perfilMap.get(s.remetente_id) as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rank = rankMap.get(s.remetente_id) as any;
        return {
          id: s.id,
          remetenteId: s.remetente_id,
          remetenteNick: perfil?.nick ?? 'Jogador',
          remetenteAvatar: perfil?.avatar_url ?? `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=unknown&backgroundColor=1a1040`,
          remetenteNivel: perfil?.nivel ?? 1,
          remetenteVitorias: rank?.vitorias ?? 0,
          remetentePartidas: rank?.partidas_totais ?? 0,
          status: s.status,
          criadoEm: s.criado_em,
          atualizadoEm: s.atualizado_em,
        };
      });

      setSolicitacoes(resultado);
    } catch (err) {
      console.warn('Erro ao buscar solicitações:', err);
    }
    setLoading(false);
  }, [meuId]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { solicitacoes, loading, recarregar };
}

// ── Contador de solicitações pendentes (para badge) ─────────
export function useContadorSolicitacoes() {
  const { usuario } = useAuthStore();
  const meuId = usuario?.id;
  const [contador, setContador] = useState(0);

  // Também verifica recusas não vistas (onde EU enviei e fui rejeitado)
  const [recusasNovas, setRecusasNovas] = useState(0);

  const recarregar = useCallback(async () => {
    if (!meuId) return;

    try {
      // Pendentes recebidas
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count: pendentes } = await (supabase as any)
        .from('amizades')
        .select('id', { count: 'exact', head: true })
        .eq('destinatario_id', meuId)
        .eq('status', 'pendente');

      setContador(pendentes ?? 0);

      // Recusas recebidas (onde EU enviei)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count: recusas } = await (supabase as any)
        .from('amizades')
        .select('id', { count: 'exact', head: true })
        .eq('remetente_id', meuId)
        .eq('status', 'rejeitada');

      setRecusasNovas(recusas ?? 0);
    } catch (err) {
      console.warn('Erro ao contar solicitações:', err);
    }
  }, [meuId]);

  useEffect(() => {
    recarregar();
    // Recarrega a cada 30 segundos
    const interval = setInterval(recarregar, 30000);
    return () => clearInterval(interval);
  }, [recarregar]);

  return { contador, recusasNovas, total: contador + recusasNovas, recarregar };
}

// ── Listar minhas solicitações enviadas (para ver recusas) ──
export function useMinhasSolicitacoesEnviadas() {
  const { usuario } = useAuthStore();
  const meuId = usuario?.id;
  const [recusadas, setRecusadas] = useState<SolicitacaoAmizade[]>([]);
  const [loading, setLoading] = useState(true);

  const recarregar = useCallback(async () => {
    if (!meuId) { setLoading(false); return; }

    try {
      // Solicitações rejeitadas que EU enviei
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('amizades')
        .select('id, destinatario_id, status, criado_em, atualizado_em')
        .eq('remetente_id', meuId)
        .eq('status', 'rejeitada')
        .order('atualizado_em', { ascending: false });

      if (error || !data || data.length === 0) {
        setRecusadas([]);
        setLoading(false);
        return;
      }

      // Buscar perfis dos destinatários (quem recusou)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const destIds = data.map((s: any) => s.destinatario_id);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: perfis } = await (supabase as any)
        .from('profiles')
        .select('id, nick, avatar_url, nivel')
        .in('id', destIds);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const perfilMap = new Map((perfis || []).map((p: any) => [p.id, p]));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resultado: SolicitacaoAmizade[] = data.map((s: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const perfil = perfilMap.get(s.destinatario_id) as any;
        return {
          id: s.id,
          remetenteId: s.destinatario_id, // quem recusou
          remetenteNick: perfil?.nick ?? 'Jogador',
          remetenteAvatar: perfil?.avatar_url ?? '',
          remetenteNivel: perfil?.nivel ?? 1,
          remetenteVitorias: 0,
          remetentePartidas: 0,
          status: 'rejeitada' as const,
          criadoEm: s.criado_em,
          atualizadoEm: s.atualizado_em,
        };
      });

      setRecusadas(resultado);
    } catch (err) {
      console.warn('Erro ao buscar recusas:', err);
    }
    setLoading(false);
  }, [meuId]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { recusadas, loading, recarregar };
}
