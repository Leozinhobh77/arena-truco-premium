import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pblwmavgqdsiwphtetei.supabase.co'
const SERVICE_KEY  = 'sb_secret_fM1ts8_ntLtTSI3tBmW9dg_jUiIpnzI'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function testRanking() {
  console.log("Fetching ranking...")
  const { data, error } = await supabase
    .from('ranking')
    .select('*')
    .limit(5)
  
  if (error) {
    console.error("Error fetching ranking:")
    console.error(error)
  } else {
    console.log("Ranking data:")
    console.log(data)
  }
}

testRanking()
