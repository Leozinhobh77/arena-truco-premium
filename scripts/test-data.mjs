import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pblwmavgqdsiwphtetei.supabase.co'
const SERVICE_KEY  = 'sb_secret_fM1ts8_ntLtTSI3tBmW9dg_jUiIpnzI'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function checkData() {
  console.log("Checking profiles count...")
  const { count: c1, error: e1 } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  console.log("Profiles count:", c1, e1)

  console.log("Checking partidas count...")
  const { count: c2, error: e2 } = await supabase.from('partidas').select('*', { count: 'exact', head: true })
  console.log("Partidas count:", c2, e2)

  console.log("Fetching ranking again just in case...")
  const { data, error } = await supabase.from('ranking').select('*').limit(3)
  console.log("Ranking:", data?.length, error)
}

checkData()
