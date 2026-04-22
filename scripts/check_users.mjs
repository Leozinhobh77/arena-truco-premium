import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pblwmavgqdsiwphtetei.supabase.co';
const SERVICE_KEY  = 'sb_secret_fM1ts8_ntLtTSI3tBmW9dg_jUiIpnzI';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function checkUsers() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('Erro:', error.message);
    return;
  }
  console.log('--- USUÁRIOS CADASTRADOS ---');
  data.users.forEach(u => {
    const status = u.email_confirmed_at ? '✅ Confirmado' : '❌ NÃO CONFIRMADO';
    console.log(`- ${u.email} (${status})`);
  });
  console.log('---------------------------');
}

checkUsers();
