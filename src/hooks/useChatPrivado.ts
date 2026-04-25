// ============================================================
// useChatPrivado — Chat em tempo real entre amigos
// ============================================================
// Carrega mensagens, realtime subscription, envia novas msg
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface MensagemPrivada {
  id: string;
  sala_id: string;
  remetente_id: string;
  texto: string;
  criado_em: string;
}

export function useChatPrivado(meuId: string | undefined, amigoId: string | undefined) {
  const [mensagens, setMensagens] = useState<MensagemPrivada[]>([]);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  // Gera sala_id consistente: sort dos IDs unidos com underscore
  const salaId = meuId && amigoId
    ? [meuId, amigoId].sort().join('_')
    : null;

  // Carrega últimas 50 mensagens
  const carregarMensagens = useCallback(async () => {
    if (!salaId || !isMountedRef.current) return;

    try {
      const { data, error } = await supabase
        .from('mensagens_chat')
        .select('*')
        .eq('sala_id', salaId)
        .order('criado_em', { ascending: true })
        .limit(50);

      if (error) {
        console.error('[useChatPrivado] Erro ao carregar mensagens:', error);
        return;
      }

      if (isMountedRef.current) {
        setMensagens(data as MensagemPrivada[]);
        setLoading(false);
      }
    } catch (err) {
      console.error('[useChatPrivado] Erro:', err);
      if (isMountedRef.current) setLoading(false);
    }
  }, [salaId]);

  // Carregar ao montar e inscrever em realtime
  useEffect(() => {
    if (!salaId) {
      setLoading(false);
      return;
    }

    carregarMensagens();

    // Subscribe em INSERT — quando alguém envia msg
    const subscription = supabase
      .channel(`chat-${salaId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagens_chat',
          filter: `sala_id=eq.${salaId}`,
        },
        (payload) => {
          if (isMountedRef.current) {
            setMensagens((prev) => [...prev, payload.new as MensagemPrivada]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [salaId, carregarMensagens]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Enviar mensagem
  const enviarMensagem = useCallback(
    async (texto: string) => {
      if (!salaId || !meuId || !texto.trim()) return;

      try {
        const { error } = await (supabase as any)
          .from('mensagens_chat')
          .insert([
            {
              sala_id: salaId,
              remetente_id: meuId,
              texto: texto.trim(),
            },
          ]);

        if (error) {
          console.error('[useChatPrivado] Erro ao enviar:', error);
        }
      } catch (err) {
        console.error('[useChatPrivado] Erro ao enviar msg:', err);
      }
    },
    [salaId, meuId]
  );

  return {
    mensagens,
    loading,
    enviarMensagem,
  };
}
