// ============================================================
// useValidateForm — Validação completa de login/signup
// Email + Senha com feedback em tempo real
// ============================================================

import { useState, useCallback } from 'react';
import { isValidEmailFormat, type EmailValidationError } from '../lib/validateEmail';

export interface FormValidationState {
  email: {
    error: EmailValidationError | null;
    validating: boolean;
  };
  senha: {
    error: { message: string } | null;
    length: number;
  };
}

export function useValidateForm() {
  const [emailError, setEmailError] = useState<EmailValidationError | null>(null);
  const [senhaError, setSenhaError] = useState<{ message: string } | null>(null);

  // Valida FORMAT do email (sem consultar banco)
  const validateEmailFormat = useCallback((email: string) => {
    const err = isValidEmailFormat(email);
    setEmailError(err);
    return err;
  }, []);

  // Valida formato do email (a detecção de email duplicado ocorre via erro do signUp)
  const validateEmailExists = useCallback(async (email: string): Promise<EmailValidationError | null> => {
    const formatErr = isValidEmailFormat(email);
    if (formatErr) {
      setEmailError(formatErr);
      return formatErr;
    }
    setEmailError(null);
    return null;
  }, []);

  // Valida SENHA (apenas tamanho e feedback visual)
  const validateSenha = useCallback((senha: string) => {
    if (senha.length < 6) {
      setSenhaError({
        message: `Apenas ${senha.length} caracteres... mínimo 6`,
      });
      return false;
    }

    setSenhaError(null);
    return true;
  }, []);

  const clearErrors = useCallback(() => {
    setEmailError(null);
    setSenhaError(null);
  }, []);

  return {
    emailError,
    senhaError,
    validateEmailFormat,
    validateEmailExists,
    validateSenha,
    clearErrors,
  };
}
