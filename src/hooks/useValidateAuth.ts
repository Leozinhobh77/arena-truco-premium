// ============================================================
// useValidateAuth — Validação em tempo real (email + nick)
// ============================================================

import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { normalizeNick } from '../lib/normalize';

export interface ValidationError {
  type: 'email_exists' | 'nick_exists' | 'nick_invalid';
  message: string;
  suggestions?: string[];
}

export function useValidateAuth() {
  const [emailError, setEmailError] = useState<ValidationError | null>(null);
  const [nickError, setNickError] = useState<ValidationError | null>(null);
  const [validating, setValidating] = useState(false);

  const validateEmail = useCallback(async (email: string): Promise<ValidationError | null> => {
    if (!email.trim()) {
      setEmailError(null);
      return null;
    }

    setValidating(true);
    try {
      const { data } = await (supabase as any)
        .from('profiles')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (data) {
        const err: ValidationError = {
          type: 'email_exists',
          message: 'Você já tem uma conta com esse email',
        };
        setEmailError(err);
        setValidating(false);
        return err;
      }

      setEmailError(null);
      setValidating(false);
      return null;
    } catch {
      // Erro 406 = não encontrou (OK, email disponível)
      setEmailError(null);
      setValidating(false);
      return null;
    }
  }, []);

  const validateNick = useCallback(async (nick: string): Promise<ValidationError | null> => {
    if (!nick.trim()) {
      setNickError(null);
      return null;
    }

    if (nick.length < 3) {
      const err: ValidationError = {
        type: 'nick_invalid',
        message: 'Nick deve ter no mínimo 3 caracteres',
      };
      setNickError(err);
      return err;
    }

    setValidating(true);
    try {
      const normalizado = normalizeNick(nick);
      const { data } = await (supabase as any)
        .from('profiles')
        .select('nick')
        .eq('nick_normalizado', normalizado)
        .single();

      if (data) {
        const suggestions = [
          `${nick}_${Math.floor(Math.random() * 100)}`,
          `${nick}${new Date().getFullYear()}`,
          `${nick}Pro`,
          `${nick}Master`,
        ];
        const err: ValidationError = {
          type: 'nick_exists',
          message: `Esse nick (${nick}) já está em uso`,
          suggestions,
        };
        setNickError(err);
        setValidating(false);
        return err;
      }

      setNickError(null);
      setValidating(false);
      return null;
    } catch {
      // Erro 406 = não encontrou (OK, nick disponível)
      setNickError(null);
      setValidating(false);
      return null;
    }
  }, []);

  const clearErrors = useCallback(() => {
    setEmailError(null);
    setNickError(null);
  }, []);

  return {
    emailError,
    nickError,
    validating,
    validateEmail,
    validateNick,
    clearErrors,
  };
}
