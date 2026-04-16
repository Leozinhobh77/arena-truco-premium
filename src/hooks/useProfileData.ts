// ============================================================
// useProfileData — Arena Truco Premium
// Hooks para buscar dados reais do Supabase nas abas do Perfil
// ============================================================

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { GameHistory, PontuacaoDia, Badge } from '../types';

// ── Aba "Meus Jogos": últimas 20 partidas do usuário ──
export function useMinhasPartidas(userId: string | undefined = undefined) {
  const [partidas, setPartidas] = useState<GameHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se não houver userId, apenas retorna dados vazios
    if (!userId) {
      setLoading(false);
      return;
    }

    supabase
      .from('partidas')
      .select('*')
      .eq('perfil_id', userId)
      .order('criado_em', { ascending: false })
      .limit(20)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data, error }: any) => {
        if (!error && data) {
          setPartidas(data.map((p: any) => ({
            id: p.id,
            data: new Date(p.criado_em),
            oponenteId: p.oponente_id ?? 'bot',
            oponenteNick: p.oponente_nick ?? 'Desconhecido',
            oponenteAvatar: p.oponente_avatar
              ?? `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=unknown&backgroundColor=1a1040`,
            resultado: p.resultado,
            pontosGanhos: p.pontos_ganhos,
            modo: p.modo,
            duracaoMin: p.duracao_min,
          })));
        }
        setLoading(false);
      });
  }, [userId]);

  return { partidas, loading };
}

// ── Aba "Stats": pontuação dos últimos 7 dias ────────────────
export function usePontuacaoSemanal(userId: string | undefined) {
  const [pontuacao, setPontuacao] = useState<PontuacaoDia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 6);
    const dataMin = seteDiasAtras.toISOString().split('T')[0];

    supabase
      .from('pontuacao_diaria')
      .select('data, pontos')
      .eq('perfil_id', userId)
      .gte('data', dataMin)
      .order('data', { ascending: true })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data, error }: any) => {
        if (!error && data) {
          setPontuacao(data.map((p: any) => {
            const [, mes, dia] = (p.data as string).split('-');
            return { data: `${dia}/${mes}`, pontos: p.pontos as number };
          }));
        }
        setLoading(false);
      });
  }, [userId]);

  return { pontuacao, loading };
}

// ── Aba "Conquistas": badges com progresso do usuário ────────
export function useMinhasConquistas(userId: string | undefined) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    supabase
      .from('conquistas')
      .select(`
        badge_id,
        conquistado,
        progresso_atual,
        conquistado_em,
        badges_catalogo (
          nome,
          descricao,
          icone,
          tier,
          progresso_max
        )
      `)
      .eq('perfil_id', userId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data, error }: any) => {
        if (!error && data) {
          setBadges(data.map((c: any) => ({
            id: c.badge_id,
            nome: c.badges_catalogo?.nome ?? c.badge_id,
            descricao: c.badges_catalogo?.descricao ?? '',
            icone: c.badges_catalogo?.icone ?? '🏅',
            tier: (c.badges_catalogo?.tier ?? 1) as 1 | 2 | 3 | 4,
            conquistado: c.conquistado,
            dataConquista: c.conquistado_em ? new Date(c.conquistado_em) : undefined,
            progressoAtual: c.progresso_atual,
            progressoMax: c.badges_catalogo?.progresso_max ?? undefined,
          })));
        }
        setLoading(false);
      });
  }, [userId]);

  return { badges, loading };
}
