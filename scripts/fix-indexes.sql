-- ============================================================
-- FIX TIMEOUT — Arena Truco Premium
-- Índices para suportar 600k+ linhas na tabela partidas
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_partidas_perfil_resultado 
ON public.partidas (perfil_id, resultado);

CREATE INDEX IF NOT EXISTS idx_partidas_perfil_pontos 
ON public.partidas (perfil_id, pontos_ganhos);
