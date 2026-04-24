// ============================================================
// useProfileData — Arena Truco Premium
// Hooks para buscar dados reais do Supabase nas abas do Perfil
// ============================================================

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { GameHistory, PontuacaoDia, Badge, Usuario, JogadorRanking, Amigo } from '../types';

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
          // Criar array de 7 dias completos (mesmo que não tenha dados)
          const diasCompletos: PontuacaoDia[] = [];
          for (let i = 0; i < 7; i++) {
            const data_atual = new Date();
            data_atual.setDate(data_atual.getDate() - (6 - i));
            const dataFormatada = data_atual.toISOString().split('T')[0];
            const [, mes, dia] = dataFormatada.split('-');

            // Procura dados para este dia
            const dadosDia = data.find((p: any) => p.data === dataFormatada);
            diasCompletos.push({
              data: `${dia}/${mes}`,
              pontos: dadosDia ? (dadosDia.pontos as number) : 0
            });
          }
          setPontuacao(diasCompletos);
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

// ── Global Ranking: todos os jogadores ordenados por posição ────
export function useRankingGlobal() {
  const [ranking, setRanking] = useState<JogadorRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('ranking')
      .select('id, nick, avatar_url, nivel, moedas, vitorias, derrotas, partidas_totais, posicao_ranking, pontuacao_total')
      .order('posicao_ranking', { ascending: true })
      .limit(100)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data, error }: any) => {
        if (error) {
          console.warn('Erro ao buscar ranking global:', error.message ?? error);
          setLoading(false);
          return;
        }
        if (data) {
          setRanking(data.map((r: any) => ({
            posicao: r.posicao_ranking ?? 0,
            pontos: r.pontuacao_total ?? r.moedas ?? 0,
            usuario: {
              id: r.id,
              nome: r.nick,
              nick: r.nick,
              avatar: r.avatar_url ?? `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${r.nick}&backgroundColor=1a1040`,
              nivel: r.nivel ?? 1,
              xp: 0,
              xpProximoNivel: 1000,
              moedas: r.moedas ?? 0,
              gemas: 0,
              ranking: r.posicao_ranking ?? 0,
              vitorias: r.vitorias ?? 0,
              derrotas: r.derrotas ?? 0,
              partidas: r.partidas_totais ?? 0,
            } as Usuario,
          })));
        }
        setLoading(false);
      });
  }, []);

  return { ranking, loading };
}

// ── Perfil Público: busca dados de qualquer usuário ──────────────
export function usePerfilPublico(userId: string | undefined) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('ranking')
        .select('vitorias, derrotas, partidas_totais, posicao_ranking, pontuacao_total')
        .eq('id', userId).single(),
    ])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(([profileRes, rankingRes]: any) => {
        if (!profileRes.error && profileRes.data) {
          const p = profileRes.data;
          const r = rankingRes.data;
          setUsuario({
            id: p.id,
            nome: p.nick,
            nick: p.nick,
            avatar: p.avatar_url ?? `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${p.nick}&backgroundColor=1a1040`,
            nivel: p.nivel,
            xp: p.xp,
            xpProximoNivel: p.xp_proximo,
            moedas: p.moedas ?? 0,
            gemas: p.gemas ?? 0,
            ranking: r?.posicao_ranking ?? 0,
            vitorias: r?.vitorias ?? 0,
            derrotas: r?.derrotas ?? 0,
            partidas: r?.partidas_totais ?? 0,
            statusMsg: p.status_msg ?? undefined,
            createdAt: p.criado_em,
          });
        }
        setLoading(false);
      });
  }, [userId]);

  return { usuario, loading };
}

// ── Converter Usuario → Amigo com defaults ──
function usuarioParaAmigo(usuario: Usuario): Amigo {
  return {
    ...usuario,
    statusMsg: usuario.statusMsg ?? 'Jogador',
    statusMsgAtualizada: new Date(),
    statusAmigo: 'offline',
    modoJogo: undefined,
    tempoJogandoMin: undefined,
  };
}

// ── Ranking de Amigos: lista de amigos ordenados por ranking ────
export function useAmigosRanking(userId: string | undefined) {
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Busca na tabela amizades todos os amigos ACEITOS do usuário
    supabase
      .from('amizades')
      .select('remetente_id, destinatario_id')
      .eq('status', 'aceita')
      .or(`remetente_id.eq.${userId},destinatario_id.eq.${userId}`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data: amigosData, error: amigosError }: any) => {
        if (amigosError || !amigosData) {
          // Tabela amizades pode não existir ainda — não é erro crítico
          if (amigosError?.code !== '42P01') {
            console.warn('Erro ao buscar amizades:', amigosError?.message ?? amigosError);
          }
          setAmigos([]);
          setLoading(false);
          return;
        }

        // Extrai os IDs dos amigos (o outro lado da amizade)
        const amigoIds = amigosData.map((a: any) =>
          a.remetente_id === userId ? a.destinatario_id : a.remetente_id
        );

        if (amigoIds.length === 0) {
          setAmigos([]);
          setLoading(false);
          return;
        }

        // Busca dados dos amigos na tabela ranking
        supabase
          .from('ranking')
          .select('id, nick, avatar_url, nivel, moedas, vitorias, derrotas, partidas_totais, posicao_ranking, pontuacao_total')
          .in('id', amigoIds)
          .order('pontuacao_total', { ascending: false })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .then(({ data: rankingData, error: rankingError }: any) => {
            if (rankingError) {
              console.warn('Erro ao buscar ranking de amigos:', rankingError?.message ?? rankingError);
            } else if (rankingData) {
              const usuarios = rankingData.map((r: any) => ({
                id: r.id,
                nome: r.nick,
                nick: r.nick,
                avatar: r.avatar_url ?? `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${r.nick}&backgroundColor=1a1040`,
                nivel: r.nivel ?? 1,
                xp: 0,
                xpProximoNivel: 1000,
                moedas: r.moedas ?? 0,
                gemas: 0,
                ranking: r.posicao_ranking ?? 0,
                vitorias: r.vitorias ?? 0,
                derrotas: r.derrotas ?? 0,
                partidas: r.partidas_totais ?? 0,
              } as Usuario));
              setAmigos(usuarios.map(usuarioParaAmigo));
            }
            setLoading(false);
          });
      });
  }, [userId]);

  return { amigos, loading };
}
