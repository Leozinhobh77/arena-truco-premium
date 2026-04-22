// ============================================================
// useÚltimosJogadores — Últimos amigos com quem jogou
// ============================================================

import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '../lib/supabase';
import type { Amigo } from '../types';

export function useÚltimosJogadores() {
  const { usuario } = useAuthStore();
  const [últimosJogadores, setÚltimosJogadores] = useState<Amigo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuario?.id) {
      setLoading(false);
      return;
    }

    const carregar = async () => {
      try {
        setLoading(true);

        // Buscar últimas 20 partidas do usuário
        const { data: partidas, error: erroPartidas } = await (supabase
          .from('partidas')
          .select('oponente_id, oponente_nick, oponente_avatar, criado_em')
          .eq('usuario_id', usuario.id) // Assumindo que existe campo usuario_id
          .order('criado_em', { ascending: false })
          .limit(20) as any);

        if (erroPartidas) throw erroPartidas;

        if (!partidas || partidas.length === 0) {
          setÚltimosJogadores([]);
          return;
        }

        // Extrair oponentes únicos (últimos 4)
        const oponentesUnicos = new Map<string, typeof partidas[0]>();
        for (const partida of partidas) {
          if (partida.oponente_id && !oponentesUnicos.has(partida.oponente_id)) {
            oponentesUnicos.set(partida.oponente_id, partida);
          }
          if (oponentesUnicos.size >= 4) break;
        }

        // Buscar dados completos dos oponentes
        const oponenteIds = Array.from(oponentesUnicos.keys());
        if (oponenteIds.length === 0) {
          setÚltimosJogadores([]);
          return;
        }

        const { data: perfis, error: erroPerfis } = await (supabase
          .from('profiles')
          .select('id, nick, avatar_url, nivel, xp, xp_proximo, moedas, gemas, status_msg, criado_em')
          .in('id', oponenteIds) as any);

        if (erroPerfis) throw erroPerfis;

        // Montar array de amigos com dados completos
        const amigos: Amigo[] = (perfis as any[] || [])
          .map((perfil: any) => ({
            id: perfil.id,
            nick: perfil.nick,
            nome: perfil.nick,
            avatar: perfil.avatar_url || '',
            nivel: perfil.nivel,
            xp: perfil.xp,
            xpProximoNivel: perfil.xp_proximo,
            moedas: perfil.moedas,
            gemas: perfil.gemas,
            statusMsg: perfil.status_msg || 'Sem status',
            statusMsgAtualizada: new Date(),
            vitorias: 0,
            derrotas: 0,
            partidas: 0,
            ranking: 0,
            statusAmigo: 'offline' as const,
            clan: undefined,
            modoJogo: undefined,
            tempoJogandoMin: undefined,
          }))
          .sort((a, b) => {
            const indexA = oponenteIds.indexOf(a.id);
            const indexB = oponenteIds.indexOf(b.id);
            return indexA - indexB;
          });

        setÚltimosJogadores(amigos);
      } catch (erro) {
        console.error('❌ Erro ao carregar últimos jogadores:', erro);
        setÚltimosJogadores([]);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [usuario?.id]);

  return { últimosJogadores, loading };
}
