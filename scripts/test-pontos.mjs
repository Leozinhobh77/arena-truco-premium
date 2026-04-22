import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pblwmavgqdsiwphtetei.supabase.co'
const SERVICE_KEY  = 'sb_secret_fM1ts8_ntLtTSI3tBmW9dg_jUiIpnzI'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function testQuery() {
  const { count } = await supabase.from('pontuacao_diaria').select('*', { count: 'exact', head: true });
  console.log("Linhas em pontuacao_diaria:", count);
}

testQuery();
