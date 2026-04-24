// ============================================================
// validateEmail — Validação profissional de emails
// ============================================================

// Regex mais robusto para validar formato de email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface EmailValidationError {
  type: 'invalid_format' | 'empty' | 'already_exists';
  message: string;
}

export function isValidEmailFormat(email: string): EmailValidationError | null {
  const trimmed = email.trim();

  if (!trimmed) {
    return {
      type: 'empty',
      message: 'Email é obrigatório',
    };
  }

  if (trimmed.length > 254) {
    return {
      type: 'invalid_format',
      message: 'Email muito longo (máx 254 caracteres)',
    };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      type: 'invalid_format',
      message: 'Formato de email inválido (ex: seu@email.com)',
    };
  }

  return null;
}

// Exemplos:
// isValidEmailFormat('leo@email') → { type: 'invalid_format', message: '...' }
// isValidEmailFormat('leo@email.com') → null ✅
// isValidEmailFormat('') → { type: 'empty', message: '...' }
