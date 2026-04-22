-- ============================================================
-- FIX DATABASE + SISTEMA DE AMIZADES — Arena Truco Premium
-- Rode este script INTEIRO no SQL Editor do Supabase
-- Dashboard → SQL Editor → New Query → Cole tudo → Run
-- ============================================================

-- ══════════════════════════════════════════════════════════════
-- 1. GARANTIR COLUNA perfil_id NA TABELA partidas
-- ══════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'partidas'
      AND column_name = 'perfil_id'
  ) THEN
    ALTER TABLE public.partidas
      ADD COLUMN perfil_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Preencher perfil_id com o primeiro elemento de jogadores[]
UPDATE public.partidas
SET perfil_id = jogadores[1]
WHERE perfil_id IS NULL AND jogadores IS NOT NULL AND array_length(jogadores, 1) > 0;

CREATE INDEX IF NOT EXISTS partidas_perfil_id_idx ON public.partidas(perfil_id);

-- ══════════════════════════════════════════════════════════════
-- 2. RECRIAR A VIEW ranking COM TODAS AS COLUNAS ESPERADAS
-- ══════════════════════════════════════════════════════════════

DROP VIEW IF EXISTS public.ranking;

CREATE OR REPLACE VIEW public.ranking AS
SELECT
  p.id,
  p.nick,
  p.avatar_url,
  p.nivel,
  p.moedas,
  COUNT(pa.id) FILTER (WHERE pa.resultado = 'vitoria')  AS vitorias,
  COUNT(pa.id) FILTER (WHERE pa.resultado = 'derrota')  AS derrotas,
  COUNT(pa.id) FILTER (WHERE pa.resultado = 'abandono') AS abandonos,
  COUNT(pa.id) AS partidas_totais,
  ROUND(
    COUNT(pa.id) FILTER (WHERE pa.resultado = 'vitoria')::numeric
    / NULLIF(COUNT(pa.id), 0) * 100, 1
  ) AS winrate,
  COALESCE(SUM(pa.pontos_ganhos), 0) AS pontuacao_total,
  ROW_NUMBER() OVER (
    ORDER BY COALESCE(SUM(pa.pontos_ganhos), 0) DESC
  )::int AS posicao_ranking
FROM public.profiles p
LEFT JOIN public.partidas pa ON p.id = pa.perfil_id
GROUP BY p.id, p.nick, p.avatar_url, p.nivel, p.moedas
ORDER BY pontuacao_total DESC;

-- ══════════════════════════════════════════════════════════════
-- 3. SISTEMA DE AMIZADES — Tabela com solicitação + status
-- ══════════════════════════════════════════════════════════════

-- Dropar tabela antiga se existir (schema diferente)
DROP TABLE IF EXISTS public.amizades;

CREATE TABLE public.amizades (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  remetente_id    uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  destinatario_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status          text NOT NULL DEFAULT 'pendente'
                    CHECK (status IN ('pendente', 'aceita', 'rejeitada')),
  criado_em       timestamptz DEFAULT now(),
  atualizado_em   timestamptz DEFAULT now(),

  -- Evitar solicitação duplicada (mesma direção)
  CONSTRAINT amizades_unique UNIQUE (remetente_id, destinatario_id),
  -- Evitar amigo de si mesmo
  CONSTRAINT amizades_self CHECK (remetente_id != destinatario_id)
);

-- RLS
ALTER TABLE public.amizades ENABLE ROW LEVEL SECURITY;

-- Leitura: ver amizades onde sou parte (como remetente ou destinatário)
CREATE POLICY "Ver minhas amizades"
  ON public.amizades FOR SELECT
  USING (auth.uid() = remetente_id OR auth.uid() = destinatario_id);

-- Inserção: só posso enviar solicitação como remetente
CREATE POLICY "Enviar solicitação de amizade"
  ON public.amizades FOR INSERT
  WITH CHECK (auth.uid() = remetente_id);

-- Atualização: só o destinatário pode aceitar/recusar
CREATE POLICY "Destinatário aceita ou recusa"
  ON public.amizades FOR UPDATE
  USING (auth.uid() = destinatario_id);

-- Deleção: qualquer uma das partes pode desfazer a amizade
CREATE POLICY "Remover amizade"
  ON public.amizades FOR DELETE
  USING (auth.uid() = remetente_id OR auth.uid() = destinatario_id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS amizades_remetente_idx ON public.amizades(remetente_id);
CREATE INDEX IF NOT EXISTS amizades_destinatario_idx ON public.amizades(destinatario_id);
CREATE INDEX IF NOT EXISTS amizades_status_idx ON public.amizades(status);

-- Trigger para atualizar atualizado_em automaticamente
CREATE OR REPLACE FUNCTION public.handle_amizade_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER amizades_updated_at
  BEFORE UPDATE ON public.amizades
  FOR EACH ROW EXECUTE PROCEDURE public.handle_amizade_updated_at();

-- ══════════════════════════════════════════════════════════════
-- 4. VERIFICAÇÃO — Todos devem retornar ok = true
-- ══════════════════════════════════════════════════════════════

SELECT 'partidas.perfil_id' AS check_item,
       EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_name = 'partidas' AND column_name = 'perfil_id'
       ) AS ok
UNION ALL
SELECT 'ranking view',
       EXISTS (
         SELECT 1 FROM information_schema.views
         WHERE table_name = 'ranking'
       )
UNION ALL
SELECT 'amizades table',
       EXISTS (
         SELECT 1 FROM information_schema.tables
         WHERE table_name = 'amizades'
       )
UNION ALL
SELECT 'amizades.status column',
       EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_name = 'amizades' AND column_name = 'status'
       );
