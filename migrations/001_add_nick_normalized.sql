-- ============================================================
-- Migration: Adicionar coluna nick_normalizado para busca case-insensitive
-- ============================================================

-- Adicionar coluna nick_normalizado
ALTER TABLE profiles
ADD COLUMN nick_normalizado TEXT;

-- Criar função para normalizar nick (remove acentos, converte pra minúscula)
CREATE OR REPLACE FUNCTION normalize_nick(nick TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(nick, '[àáâãäå]', 'a', 'g'),
      '[èéêë]', 'e', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Popular coluna nick_normalizado com todos os nicks existentes
UPDATE profiles
SET nick_normalizado = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(nick, '[àáâãäå]', 'a', 'g'),
          '[èéêë]', 'e', 'g'
        ),
        '[ìíîï]', 'i', 'g'
      ),
      '[òóôõö]', 'o', 'g'
    ),
    '[ùúûü]', 'u', 'g'
  )
)
WHERE nick_normalizado IS NULL;

-- Criar índice único em nick_normalizado para performance
CREATE UNIQUE INDEX idx_profiles_nick_normalizado
ON profiles(nick_normalizado);

-- Criar trigger para preencher nick_normalizado automaticamente ao inserir/atualizar
CREATE OR REPLACE FUNCTION update_nick_normalizado()
RETURNS TRIGGER AS $$
BEGIN
  NEW.nick_normalizado := LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(NEW.nick, '[àáâãäå]', 'a', 'g'),
            '[èéêë]', 'e', 'g'
          ),
          '[ìíîï]', 'i', 'g'
        ),
        '[òóôõö]', 'o', 'g'
      ),
      '[ùúûü]', 'u', 'g'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_nick_normalizado ON profiles;

CREATE TRIGGER trigger_update_nick_normalizado
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_nick_normalizado();
