// ============================================================
// useRankingData — Ranking por Período
// Dia | Semana | Geral | Amigos
// ============================================================

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { JogadorRanking } from '../types';

// ── HELPER: Mapear PontuacaoDiaria + Profile → JogadorRanking ──
function mapToJogadorRanking(
  perfil_id: string,
  nick: string,
  avatar_url: string | null,
  nivel: number,
  pontos: number,
  posicao: number,
  statusMsg?: string
): JogadorRanking {
  return {
    posicao,
    usuario: {
      id: perfil_id,
      nome: nick,
      nick,
      avatar: avatar_url || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${perfil_id}&backgroundColor=1a1040`,
      nivel,
      xp: 0,
      xpProximoNivel: 0,
      moedas: 0,
      gemas: 0,
      pontos,
      ranking: posicao,
      vitorias: 0,
      derrotas: 0,
      partidas: 0,
      statusMsg,
    },
    pontos,
  };
}

// ── HELPER: Ordenar por pontos DESC, nome ASC + Retornar com posições ──
function ordenarERetornarRanking(
  items: Array<{ perfil_id: string; nick: string; avatar_url: string | null; nivel: number; pontos: number; statusMsg?: string }>,
  seu_id: string,
  limite: number = 100
): { jogadores: JogadorRanking[]; seu_ranking: JogadorRanking | null; total: number } {
  // Ordenar por pontos DESC, depois nome ASC (cópia para não mutar original)
  const ordenado = [...items].sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    return a.nick.localeCompare(b.nick);
  });

  // Pegar seu ranking (sempre incluindo)
  const seuIndex = ordenado.findIndex(r => r.perfil_id === seu_id);
  let seu_ranking: JogadorRanking | null = null;

  if (seuIndex !== -1) {
    seu_ranking = mapToJogadorRanking(
      ordenado[seuIndex].perfil_id,
      ordenado[seuIndex].nick,
      ordenado[seuIndex].avatar_url,
      ordenado[seuIndex].nivel,
      ordenado[seuIndex].pontos,
      seuIndex + 1,
      ordenado[seuIndex].statusMsg
    );
  }

  // Retornar TOP N (ou todos se for amigos)
  const jogadores = ordenado.slice(0, limite).map((item, idx) =>
    mapToJogadorRanking(
      item.perfil_id,
      item.nick,
      item.avatar_url,
      item.nivel,
      item.pontos,
      idx + 1,
      item.statusMsg
    )
  );

  return { jogadores, seu_ranking, total: ordenado.length };
}

// ════════════════════════════════════════════════════════════════
// ── RANKING DIA (hoje, 00:00-23:59) ──
// ════════════════════════════════════════════════════════════════
export function useRankingDia(seu_id: string | undefined) {
  const [jogadores, setJogadores] = useState<JogadorRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [seu_ranking, setSeuRanking] = useState<JogadorRanking | null>(null);

  useEffect(() => {
    if (!seu_id) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // Query: Pontuação diária de hoje
        const hoje = new Date().toISOString().split('T')[0];
        const { data: pontuacaoHoje, error: erro1 } = await supabase
          .from('pontuacao_diaria')
          .select('perfil_id, pontos')
          .eq('data', hoje) as any;

        if (erro1) throw erro1;

        // Pegar perfis correspondentes
        const perfil_ids = [...new Set((pontuacaoHoje || []).map((p: any) => p.perfil_id))];

        if (perfil_ids.length === 0) {
          setJogadores([]);
          setSeuRanking(null);
          setLoading(false);
          return;
        }

        const [{ data: perfis, error: erro2 }] = await Promise.all([
          supabase
            .from('profiles')
            .select('id, nick, avatar_url, nivel, status_msg')
            .in('id', perfil_ids) as any,
        ]);

        if (erro2) throw erro2;

        // Agrupar pontos por perfil_id
        const mapa: Record<string, { pontos: number; nick: string; avatar_url: string | null; nivel: number; statusMsg?: string }> = {};
        (perfis as any[])?.forEach((p: any) => {
          mapa[p.id] = { pontos: 0, nick: p.nick, avatar_url: p.avatar_url, nivel: p.nivel, statusMsg: p.status_msg ?? undefined };
        });

        (pontuacaoHoje || []).forEach((p: any) => {
          if (mapa[p.perfil_id]) {
            mapa[p.perfil_id].pontos += p.pontos;
          }
        });

        const items = Object.entries(mapa).map(([perfil_id, { pontos, nick, avatar_url, nivel, statusMsg }]) => ({
          perfil_id,
          nick,
          avatar_url,
          nivel,
          pontos,
          statusMsg,
        }));

        const { jogadores: ranking, seu_ranking: seuRank } = ordenarERetornarRanking(items, seu_id, 100);
        setJogadores(ranking);
        setSeuRanking(seuRank);
      } catch (err) {
        console.error('Erro ao carregar ranking dia:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [seu_id]);

  return { jogadores, seu_ranking, loading };
}

// ════════════════════════════════════════════════════════════════
// ── RANKING SEMANA (seg 00:00 até dom 23:59) ──
// ════════════════════════════════════════════════════════════════
export function useRankingSemana(seu_id: string | undefined) {
  const [jogadores, setJogadores] = useState<JogadorRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [seu_ranking, setSeuRanking] = useState<JogadorRanking | null>(null);

  useEffect(() => {
    if (!seu_id) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // Calcular segunda-feira desta semana
        const hoje = new Date();
        const diaSemana = hoje.getDay(); // 0=dom, 1=seg, ..., 6=sab
        const diasAtrasSegunda = diaSemana === 0 ? 6 : diaSemana - 1;
        const segunda = new Date(hoje);
        segunda.setDate(segunda.getDate() - diasAtrasSegunda);
        segunda.setHours(0, 0, 0, 0);
        const dataSegunda = segunda.toISOString().split('T')[0];

        // Domingo 23:59 é antes de segunda 00:00, então pegamos até hoje
        const dataDomingo = hoje.toISOString().split('T')[0];

        // Query: Pontuação de segunda até hoje
        const { data: pontuacaoSemana, error: erro1 } = await supabase
          .from('pontuacao_diaria')
          .select('perfil_id, pontos')
          .gte('data', dataSegunda)
          .lte('data', dataDomingo) as any;

        if (erro1) throw erro1;

        const perfil_ids = [...new Set((pontuacaoSemana || []).map((p: any) => p.perfil_id))];

        if (perfil_ids.length === 0) {
          setJogadores([]);
          setSeuRanking(null);
          setLoading(false);
          return;
        }

        const [{ data: perfis, error: erro2 }] = await Promise.all([
          supabase
            .from('profiles')
            .select('id, nick, avatar_url, nivel, status_msg')
            .in('id', perfil_ids) as any,
        ]);

        if (erro2) throw erro2;

        // Agrupar pontos por perfil_id (soma semanal)
        const mapa: Record<string, { pontos: number; nick: string; avatar_url: string | null; nivel: number; statusMsg?: string }> = {};
        (perfis as any[])?.forEach((p: any) => {
          mapa[p.id] = { pontos: 0, nick: p.nick, avatar_url: p.avatar_url, nivel: p.nivel, statusMsg: p.status_msg ?? undefined };
        });

        (pontuacaoSemana || []).forEach((p: any) => {
          if (mapa[p.perfil_id]) {
            mapa[p.perfil_id].pontos += p.pontos;
          }
        });

        const items = Object.entries(mapa).map(([perfil_id, { pontos, nick, avatar_url, nivel, statusMsg }]) => ({
          perfil_id,
          nick,
          avatar_url,
          nivel,
          pontos,
          statusMsg,
        }));

        const { jogadores: ranking, seu_ranking: seuRank } = ordenarERetornarRanking(items, seu_id, 100);
        setJogadores(ranking);
        setSeuRanking(seuRank);
      } catch (err) {
        console.error('Erro ao carregar ranking semana:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [seu_id]);

  return { jogadores, seu_ranking, loading };
}

// ════════════════════════════════════════════════════════════════
// ── RANKING GERAL (all-time) ──
// ════════════════════════════════════════════════════════════════
export function useRankingGeral(seu_id: string | undefined) {
  const [jogadores, setJogadores] = useState<JogadorRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [seu_ranking, setSeuRanking] = useState<JogadorRanking | null>(null);

  useEffect(() => {
    if (!seu_id) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // Query: Vista ranking (já ordenada por posição)
        const result = await supabase
          .from('ranking')
          .select('*') as any;

        const { data: ranking, error: erro } = result;

        if (erro) throw erro;

        if (!ranking || ranking.length === 0) {
          setJogadores([]);
          setSeuRanking(null);
          setLoading(false);
          return;
        }

        // Buscar status_msg dos profiles (view 'ranking' pode não expor)
        const idsRanking = (ranking as any[]).map((r: any) => r.id);
        const { data: perfisStatus } = await supabase
          .from('profiles')
          .select('id, status_msg')
          .in('id', idsRanking) as any;

        const statusMap: Record<string, string | undefined> = {};
        (perfisStatus as any[] | null)?.forEach((p: any) => {
          statusMap[p.id] = p.status_msg ?? undefined;
        });

        // Usar posicao_ranking como ordem
        const ranked = (ranking as any[]).map((r: any) => ({
          perfil_id: r.id,
          nick: r.nick,
          avatar_url: r.avatar_url,
          nivel: r.nivel,
          pontos: (100 - r.posicao_ranking) * 100, // Inverter para maior posição = mais "pontos"
          statusMsg: statusMap[r.id],
        }));

        const { jogadores: jogs, seu_ranking: seuRank } = ordenarERetornarRanking(ranked, seu_id, 100);
        setJogadores(jogs);
        setSeuRanking(seuRank);
      } catch (err) {
        console.error('Erro ao carregar ranking geral:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [seu_id]);

  return { jogadores, seu_ranking, loading };
}

// ════════════════════════════════════════════════════════════════
// ── RANKING AMIGOS (seus amigos + você) ──
// ════════════════════════════════════════════════════════════════
export function useRankingAmigos(seu_id: string | undefined) {
  const [jogadores, setJogadores] = useState<JogadorRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [seu_ranking, setSeuRanking] = useState<JogadorRanking | null>(null);

  useEffect(() => {
    if (!seu_id) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // Query: Amizades aceitas
        const { data: amizades, error: erro1 } = await supabase
          .from('amizades')
          .select('remetente_id, destinatario_id')
          .eq('status', 'aceita')
          .or(`remetente_id.eq.${seu_id},destinatario_id.eq.${seu_id}`) as any;

        if (erro1) throw erro1;

        // Coletar IDs dos amigos (excluindo você)
        const amigos_set = new Set<string>();
        (amizades || []).forEach((a: any) => {
          if (a.remetente_id !== seu_id) amigos_set.add(a.remetente_id);
          if (a.destinatario_id !== seu_id) amigos_set.add(a.destinatario_id);
        });

        // Sempre incluir você mesmo
        amigos_set.add(seu_id);

        if (amigos_set.size === 0) {
          setJogadores([]);
          setSeuRanking(null);
          setLoading(false);
          return;
        }

        // Query: Ranking dos amigos
        const result2 = await supabase
          .from('ranking')
          .select('*')
          .in('id', Array.from(amigos_set)) as any;

        const { data: ranking, error: erro2 } = result2;

        if (erro2) throw erro2;

        if (!ranking || ranking.length === 0) {
          setJogadores([]);
          setSeuRanking(null);
          setLoading(false);
          return;
        }

        // Buscar status_msg dos profiles (view 'ranking' pode não expor)
        const idsRanking = (ranking as any[]).map((r: any) => r.id);
        const { data: perfisStatus } = await supabase
          .from('profiles')
          .select('id, status_msg')
          .in('id', idsRanking) as any;

        const statusMap: Record<string, string | undefined> = {};
        (perfisStatus as any[] | null)?.forEach((p: any) => {
          statusMap[p.id] = p.status_msg ?? undefined;
        });

        // Converter para nosso formato (usar posição como proxy de pontos)
        const items = (ranking as any[]).map((r: any) => ({
          perfil_id: r.id,
          nick: r.nick,
          avatar_url: r.avatar_url,
          nivel: r.nivel,
          pontos: (100 - r.posicao_ranking) * 100, // Inverter para maior posição = mais "pontos"
          statusMsg: statusMap[r.id],
        }));

        const { jogadores: jogs, seu_ranking: seuRank } = ordenarERetornarRanking(
          items,
          seu_id,
          999 // Sem limite para amigos
        );
        setJogadores(jogs);
        setSeuRanking(seuRank);
      } catch (err) {
        console.error('Erro ao carregar ranking amigos:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [seu_id]);

  return { jogadores, seu_ranking, loading };
}

// ════════════════════════════════════════════════════════════════
// ── RANKING STATUS (ordenado por likes) ──
// ════════════════════════════════════════════════════════════════
export function useRankingStatus(seu_id: string | undefined) {
  const [jogadores, setJogadores] = useState<JogadorRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [seu_ranking, setSeuRanking] = useState<JogadorRanking | null>(null);

  useEffect(() => {
    if (!seu_id) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // 1. Buscar todos os likes (somente a coluna necessária)
        const { data: likes } = await supabase
          .from('status_likes')
          .select('status_owner_id') as any;

        if (!likes || likes.length === 0) {
          setJogadores([]);
          setSeuRanking(null);
          setLoading(false);
          return;
        }

        // 2. Agregar: contar likes por owner
        const contagem: Record<string, number> = {};
        (likes as any[]).forEach((l: any) => {
          contagem[l.status_owner_id] = (contagem[l.status_owner_id] || 0) + 1;
        });

        // 3. Top 50 por likes DESC
        const topIds = Object.entries(contagem)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 50)
          .map(([id]) => id);

        // 4. Buscar profiles dos top N
        const { data: perfis } = await supabase
          .from('profiles')
          .select('id, nick, avatar_url, nivel, status_msg')
          .in('id', topIds) as any;

        // 5. Montar items (apenas quem tem status_msg)
        const items = topIds
          .map((id) => {
            const p = (perfis as any[])?.find((x: any) => x.id === id);
            if (!p || !p.status_msg) return null;
            return {
              perfil_id: id,
              nick: p.nick,
              avatar_url: p.avatar_url,
              nivel: p.nivel,
              pontos: contagem[id],
              statusMsg: p.status_msg,
            };
          })
          .filter(Boolean) as any[];

        const { jogadores: jogs, seu_ranking: seuRank } = ordenarERetornarRanking(items, seu_id, 50);
        setJogadores(jogs);
        setSeuRanking(seuRank);
      } catch (err) {
        console.error('Erro ao carregar ranking status:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [seu_id]);

  return { jogadores, seu_ranking, loading };
}
