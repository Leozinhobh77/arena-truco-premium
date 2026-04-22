-- ============================================================
-- FIX RANKING VIEW — Arena Truco Premium
-- Otimização da View para evitar Statement Timeout
-- ============================================================

DROP VIEW IF EXISTS public.ranking;

CREATE OR REPLACE VIEW public.ranking AS
WITH estatisticas AS (
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
    COALESCE(SUM(pa.pontos_ganhos), 0) AS pontuacao_total
  FROM public.profiles p
  LEFT JOIN public.partidas pa ON p.id = pa.perfil_id
  GROUP BY p.id, p.nick, p.avatar_url, p.nivel, p.moedas
)
SELECT
  id,
  nick,
  avatar_url,
  nivel,
  moedas,
  vitorias,
  derrotas,
  abandonos,
  partidas_totais,
  ROUND(vitorias::numeric / NULLIF(partidas_totais, 0) * 100, 1) AS winrate,
  pontuacao_total,
  ROW_NUMBER() OVER (ORDER BY pontuacao_total DESC)::int AS posicao_ranking
FROM estatisticas
ORDER BY pontuacao_total DESC;
