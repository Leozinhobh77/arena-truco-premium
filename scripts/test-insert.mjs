import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pblwmavgqdsiwphtetei.supabase.co'
const SERVICE_KEY  = 'sb_secret_fM1ts8_ntLtTSI3tBmW9dg_jUiIpnzI'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function checkInsertError() {
  // Pega um usuário qualquer
  const { data: users } = await supabase.from('profiles').select('id').limit(2)
  if (!users || users.length < 2) {
    console.log("Menos de 2 usuários")
    return
  }

  const u1 = users[0].id
  const u2 = users[1].id

  console.log("Tentando inserir amizade entre:", u1, "e", u2)
  const { data, error } = await supabase.from('amizades').insert({
    remetente_id: u1,
    destinatario_id: u2,
    status: 'pendente'
  }).select('*')

  if (error) {
    console.error("ERRO NO INSERT:", error)
  } else {
    console.log("INSERIDO COM SUCESSO:", data)
  }
}

checkInsertError()
