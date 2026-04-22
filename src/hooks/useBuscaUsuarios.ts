// ============================================================
// useBuscaUsuarios — Busca de usuários com filtros
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '../lib/supabase';
import type { Amigo } from '../types';

type FiltroUsuario = 'tudo' | 'mesmo-nivel' | 'clans';

export interface UsuarioResultado extends Amigo {
  winRate: number;
  jaAmigo?: boolean;
}

export function useBuscaUsuarios(filtro: FiltroUsuario = 'tudo') {
  const { usuario } = useAuthStore();
  const [resultados, setResultados] = useState<UsuarioResultado[]>([]);
  const [loading, setLoading] = useState(false);
  const [termo, setTermo] = useState('');

  // Buscar amigos atuais para saber quem já é amigo
  const [amigosAtuais, setAmigosAtuais] = useState<string[]>([]);

  useEffect(() => {
    if (!usuario?.id) return;

    const carregarAmigos = async () => {
      try {
        const { data, error } = await (supabase
          .from('amizades')
          .select('remetente_id, destinatario_id')
          .or(`remetente_id.eq.${usuario.id},destinatario_id.eq.${usuario.id}`)
          .eq('status', 'aceita') as any);

        if (error) throw error;

        const amigos = new Set<string>();
        ((data as any[]) || []).forEach((amizade: any) => {
          if (amizade.remetente_id === usuario.id) amigos.add(amizade.destinatario_id);
          if (amizade.destinatario_id === usuario.id) amigos.add(amizade.remetente_id);
        });

        setAmigosAtuais(Array.from(amigos));
      } catch (erro) {
        console.error('❌ Erro ao carregar amigos atuais:', erro);
      }
    };

    carregarAmigos();
  }, [usuario?.id]);

  const buscar = useCallback(async (searchTerm: string) => {
    if (!usuario?.id) return;
    if (searchTerm.trim().length < 2) {
      setResultados([]);
      return;
    }

    try {
      setLoading(true);
      setTermo(searchTerm);

      // Query base
      let query: any = supabase
        .from('profiles')
        .select('id, nick, avatar_url, nivel, xp, xp_proximo, moedas, gemas, status_msg')
        .neq('id', usuario.id) // Não mostrar a si mesmo
        .ilike('nick', `%${searchTerm}%`) // Busca case-insensitive
        .limit(20);

      // Aplicar filtro
      if (filtro === 'mesmo-nivel') {
        const minNivel = Math.max(1, usuario.nivel - 2);
        const maxNivel = usuario.nivel + 2;
        query = query
          .gte('nivel', minNivel)
          .lte('nivel', maxNivel);
      }

      const { data: perfis, error } = await query;

      if (error) throw error;

      // Buscar dados de ranking
      const { data: ranking, error: erroRanking } = await (supabase
        .from('ranking')
        .select('id, vitorias, derrotas, partidas_totais, winrate, posicao_ranking')
        .in('id', ((perfis as any[]) || []).map((p: any) => p.id)) as any);

      if (erroRanking) throw erroRanking;

      // Montar resultado
      const resultadosFormatados: UsuarioResultado[] = (perfis as any[] || []).map((perfil: any) => {
        const dadosRanking = (ranking as any[] || []).find((r: any) => r.id === perfil.id);
        const jaAmigo = amigosAtuais.includes(perfil.id);

        return {
          id: perfil.id,
          nick: perfil.nick,
          nome: perfil.nick,
          avatar: perfil.avatar_url || '',
          nivel: perfil.nivel,
          xp: perfil.xp,
          xpProximoNível: perfil.xp_proximo,
          moedas: perfil.moedas,
          gemas: perfil.gemas,
          statusMsg: perfil.status_msg || 'Sem status',
          statusMsgAtualizada: new Date(),
          vitorias: dadosRanking?.vitorias || 0,
          derrotas: dadosRanking?.derrotas || 0,
          partidas: dadosRanking?.partidas_totais || 0,
          ranking: dadosRanking?.posicao_ranking || 0,
          winRate: dadosRanking?.winrate || 0,
          statusAmigo: 'offline' as const,
          jaAmigo,
        } as UsuarioResultado;
      });

      setResultados(resultadosFormatados);
    } catch (erro) {
      console.error('❌ Erro ao buscar usuários:', erro);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }, [usuario?.id, amigosAtuais, filtro]);

  const limpar = useCallback(() => {
    setTermo('');
    setResultados([]);
  }, []);

  return { resultados, loading, buscar, limpar, termo };
}
