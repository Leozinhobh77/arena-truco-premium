// ============================================================
// useRecadosNaoLidosPorAmigo — Contagem de recados não lidos
// ============================================================

import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '../lib/supabase';

export function useRecadosNaoLidosPorAmigo() {
  const { usuario } = useAuthStore();
  const [recadosPorAmigo, setRecadosPorAmigo] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!usuario?.id) return;

    const carregar = async () => {
      try {
        const { data: recados, error } = await supabase
          .from('recados')
          .select('remetente_id, lido')
          .eq('destinatario_id', usuario.id)
          .eq('lido', false);

        if (error) throw error;

        // Contar recados não lidos por remetente
        const contagem: Record<string, number> = {};
        (recados as any[] || []).forEach((recado: any) => {
          contagem[recado.remetente_id] = (contagem[recado.remetente_id] || 0) + 1;
        });

        setRecadosPorAmigo(contagem);
      } catch (erro) {
        console.error('❌ Erro ao carregar recados não lidos:', erro);
      }
    };

    carregar();

    // Subscribe a mudanças em tempo real
    const subscription = supabase
      .channel(`recados-${usuario.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'recados', filter: `destinatario_id=eq.${usuario.id}` },
        () => carregar(),
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [usuario?.id]);

  const obterContagem = (amigoId: string) => recadosPorAmigo[amigoId] || 0;

  return { recadosPorAmigo, obterContagem };
}
