import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pblwmavgqdsiwphtetei.supabase.co'
const SERVICE_KEY  = 'sb_secret_fM1ts8_ntLtTSI3tBmW9dg_jUiIpnzI'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function checkAmizades() {
  const { data, error } = await supabase.from('amizades').select('*')
  console.log("Todas as amizades:", data)
  console.log("Erro:", error)

  if (data && data.length > 0) {
    const a = data[0].remetente_id
    const b = data[0].destinatario_id
    
    // Testa o filtro OR
    const filter = `and(remetente_id.eq.${a},destinatario_id.eq.${b}),and(remetente_id.eq.${b},destinatario_id.eq.${a})`
    console.log("Testando filtro:", filter)
    const { data: d2, error: e2 } = await supabase.from('amizades').select('*').or(filter)
    console.log("Resultado or:", d2)
    console.log("Erro or:", e2)
  }
}

checkAmizades()
