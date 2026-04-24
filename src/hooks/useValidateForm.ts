// ============================================================
// useValidateForm — Validação completa de login/signup
// Email + Senha com feedback em tempo real
// ============================================================

import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
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
  const [validating, setValidating] = useState(false);
  const [emailError, setEmailError] = useState<EmailValidationError | null>(null);
  const [senhaError, setSenhaError] = useState<{ message: string } | null>(null);

  // Valida FORMAT do email (sem consultar banco)
  const validateEmailFormat = useCallback((email: string) => {
    const err = isValidEmailFormat(email);
    setEmailError(err);
    return err;
  }, []);

  // Valida se EMAIL JÁ EXISTE no banco
  const validateEmailExists = useCallback(async (email: string): Promise<EmailValidationError | null> => {
    const formatErr = isValidEmailFormat(email);
    if (formatErr) {
      setEmailError(formatErr);
      return formatErr;
    }

    setValidating(true);
    try {
      // Usa maybeSingle() em vez de single() para não lançar erro 406
      const { data } = await (supabase as any)
        .from('profiles')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (data) {
        // Email já existe
        const err: EmailValidationError = {
          type: 'already_exists',
          message: 'Este email já tem uma conta cadastrada',
        };
        setEmailError(err);
        setValidating(false);
        return err;
      }

      // Email não encontrado ou erro - considera disponível
      setEmailError(null);
      setValidating(false);
      return null;
    } catch {
      // Erro na query - considera disponível (deixa servidor validar)
      setEmailError(null);
      setValidating(false);
      return null;
    }
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
    validating,
    emailError,
    senhaError,
    validateEmailFormat,
    validateEmailExists,
    validateSenha,
    clearErrors,
  };
}
