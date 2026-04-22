import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pblwmavgqdsiwphtetei.supabase.co'
const SERVICE_KEY  = 'sb_secret_fM1ts8_ntLtTSI3tBmW9dg_jUiIpnzI'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function checkQuery() {
  const meuId = '975765a0-23d4-4899-9c04-d25884072a1a'
  const outroId = '427163d0-fc02-48b7-9e68-e088cc2e7b9e'
  
  console.log("Consultando com OR/AND aninhados...")
  const filterString = `and(remetente_id.eq.${meuId},destinatario_id.eq.${outroId}),and(remetente_id.eq.${outroId},destinatario_id.eq.${meuId})`
  
  const { data, error } = await supabase.from('amizades')
    .select('*')
    .or(filterString)
    
  console.log("Data:", data)
  console.log("Error:", error)
}

checkQuery()
