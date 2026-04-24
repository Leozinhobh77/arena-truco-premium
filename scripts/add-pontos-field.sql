-- ============================================================
-- SPRINT 6: Adicionar Campo PONTOS na Tabela PROFILES
-- ============================================================

-- 1. Adicionar coluna pontos na tabela profiles
ALTER TABLE profiles
ADD COLUMN pontos INT DEFAULT 0;

-- 2. Atualizar pontos existentes (soma de pontos_ganhos de todas as partidas)
UPDATE profiles p
SET pontos = (
  SELECT COALESCE(SUM(pontos_ganhos), 0)
  FROM partidas
  WHERE perfil_id = p.id
);

-- 3. Criar TRIGGER que atualiza pontos ao inserir partida
CREATE OR REPLACE FUNCTION atualizar_pontos_ao_registrar_partida()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza pontos do jogador
  UPDATE profiles
  SET pontos = pontos + NEW.pontos_ganhos
  WHERE id = NEW.perfil_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Criar trigger na tabela partidas
DROP TRIGGER IF EXISTS trigger_atualizar_pontos ON partidas;
CREATE TRIGGER trigger_atualizar_pontos
AFTER INSERT ON partidas
FOR EACH ROW
EXECUTE FUNCTION atualizar_pontos_ao_registrar_partida();

-- 5. Criar índice para otimizar queries de pontos
CREATE INDEX IF NOT EXISTS idx_profiles_pontos ON profiles(pontos DESC);

-- Confirmação
SELECT 'Script executado com sucesso!' as status;
