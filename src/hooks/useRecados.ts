import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';

export interface Recado {
  id: string;
  amigoId: string;
  amigoNick: string;
  amigoAvatar: string;
  mensagem: string;
  dataCriacao: string;
  lido: boolean;
}

// Buscar recados recebidos pelo usuário atual
export function useRecados() {
  const { usuario } = useAuthStore();
  const meuId = usuario?.id;
  const [recados, setRecados] = useState<Recado[]>([]);
  const [loading, setLoading] = useState(true);

  const recarregar = useCallback(async () => {
    if (!meuId) {
      setLoading(false);
      return;
    }

    try {
      // Buscar todos os recados para o usuário atual
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('recados')
        .select('id, remetente_id, mensagem, criado_em, lido')
        .eq('destinatario_id', meuId)
        .order('criado_em', { ascending: false });

      if (error) {
        console.warn('Erro ao buscar recados:', error.message);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setRecados([]);
        setLoading(false);
        return;
      }

      // Buscar perfis dos remetentes
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const remetenteIds = data.map((r: any) => r.remetente_id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: perfis } = await (supabase as any)
        .from('profiles')
        .select('id, nick, avatar_url')
        .in('id', remetenteIds);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const perfilMap = new Map((perfis || []).map((p: any) => [p.id, p]));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resultado: Recado[] = data.map((r: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const perfil = perfilMap.get(r.remetente_id) as any;
        return {
          id: r.id,
          amigoId: r.remetente_id,
          amigoNick: perfil?.nick ?? 'Jogador',
          amigoAvatar: perfil?.avatar_url ?? `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=unknown&backgroundColor=1a1040`,
          mensagem: r.mensagem,
          dataCriacao: r.criado_em,
          lido: r.lido ?? false,
        };
      });

      setRecados(resultado);
    } catch (err) {
      console.warn('Erro ao buscar recados:', err);
    }
    setLoading(false);
  }, [meuId]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { recados, loading, recarregar };
}

// Enviar um recado para outro usuário
export function useSendRecado() {
  const { usuario } = useAuthStore();
  const meuId = usuario?.id;
  const [enviando, setEnviando] = useState(false);

  const enviarRecado = useCallback(
    async (destinatarioId: string, mensagem: string): Promise<{ ok: boolean; erro?: string }> => {
      if (!meuId) return { ok: false, erro: 'Não autenticado' };
      if (!mensagem.trim()) return { ok: false, erro: 'Mensagem vazia' };

      setEnviando(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('recados')
          .insert({
            remetente_id: meuId,
            destinatario_id: destinatarioId,
            mensagem: mensagem.trim(),
            lido: false,
          });

        setEnviando(false);
        if (error) {
          return { ok: false, erro: error.message };
        }
        return { ok: true };
      } catch (err) {
        setEnviando(false);
        return { ok: false, erro: 'Erro ao enviar recado' };
      }
    },
    [meuId]
  );

  return { enviarRecado, enviando };
}

// Marcar recado como lido
export function useMarcarRecadoLido() {
  const marcarLido = useCallback(async (recadoId: string): Promise<boolean> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('recados')
        .update({ lido: true })
        .eq('id', recadoId);

      return !error;
    } catch {
      return false;
    }
  }, []);

  return { marcarLido };
}

// Contar recados não lidos (para badge)
export function useContadorRecados() {
  const { usuario } = useAuthStore();
  const meuId = usuario?.id;
  const [contador, setContador] = useState(0);

  const recarregar = useCallback(async () => {
    if (!meuId) {
      setContador(0);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count } = await (supabase as any)
        .from('recados')
        .select('id', { count: 'exact', head: true })
        .eq('destinatario_id', meuId)
        .eq('lido', false);

      setContador(count ?? 0);
    } catch (err) {
      console.warn('Erro ao contar recados:', err);
    }
  }, [meuId]);

  useEffect(() => {
    recarregar();
    // Recarrega a cada 30 segundos
    const interval = setInterval(recarregar, 30000);
    return () => clearInterval(interval);
  }, [recarregar]);

  return { contador, recarregar };
}
