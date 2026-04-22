import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pblwmavgqdsiwphtetei.supabase.co'
const SERVICE_KEY  = 'sb_secret_fM1ts8_ntLtTSI3tBmW9dg_jUiIpnzI'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function limparDados() {
  console.log("🧹 Iniciando limpeza profunda do banco de dados...");

  // 1. Apagar todos os bots
  console.log("Apagando bots do auth.users...");
  const { data: lista } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const bots = lista?.users?.filter(u => u.email?.endsWith('@arenatruco.bot')) || [];
  
  for (const bot of bots) {
    // Isso também apaga o profile por causa do ON DELETE CASCADE
    await supabase.auth.admin.deleteUser(bot.id);
  }
  console.log(`✅ ${bots.length} bots deletados.`);

  // 2. Limpar pontuação e conquistas fakes do usuário real
  console.log("Limpando pontuações, partidas e conquistas falsas...");
  
  // Limpar tabelas de registros temporários de TODO MUNDO (inclusive do usuário real)
  // Já tínhamos limpado partidas, mas vamos garantir
  await supabase.from('partidas').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('pontuacao_diaria').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  // As conquistas nós mantemos os registros, mas zeramos o progresso.
  // UPDATE conquistas SET progresso_atual = 0, conquistado = false, conquistado_em = null
  await supabase.from('conquistas').update({
    progresso_atual: 0,
    conquistado: false,
    conquistado_em: null
  }).neq('id', '00000000-0000-0000-0000-000000000000');

  // 3. Zerar vitórias/derrotas no profile do usuário real
  console.log("Zerando stats no perfil do usuário...");
  await supabase.from('profiles').update({
    vitorias: 0,
    derrotas: 0,
    abandonos: 0,
    moedas: 0,
    gemas: 0,
    xp: 0,
    nivel: 1
  }).neq('id', '00000000-0000-0000-0000-000000000000');

  console.log("🎉 Limpeza concluída! O banco está 100% real e zerado para jogar.");
}

limparDados().catch(console.error);
