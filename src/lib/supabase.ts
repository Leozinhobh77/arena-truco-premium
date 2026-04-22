// ============================================================
// SUPABASE CLIENT — Arena Truco Premium
// Gerado por: skill-consultor v5.2
// Inicializa o cliente Supabase com variáveis de ambiente do Vite.
// USE: importe { supabase } em qualquer store ou componente.
// ============================================================

import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Variáveis de ambiente do Supabase não encontradas.\n' +
    'Crie um arquivo .env.local com:\n' +
    '  VITE_SUPABASE_URL=...\n' +
    '  VITE_SUPABASE_ANON_KEY=...\n' +
    'Veja docs/SCHEMA.md para instruções completas.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persiste sessão no localStorage automaticamente
    persistSession: true,
    // Atualiza token em background
    autoRefreshToken: true,
    // Detecta sessão da URL após OAuth redirect (ex: Google)
    detectSessionInUrl: true,
  },
});
