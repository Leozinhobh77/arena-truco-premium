// ================================================================
// SEED SCRIPT — Arena Truco Premium
// Cria 30 jogadores bots com histórico realista para testes
// Como rodar: npm run seed
// ================================================================

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pblwmavgqdsiwphtetei.supabase.co'
const SERVICE_KEY  = 'sb_secret_fM1ts8_ntLtTSI3tBmW9dg_jUiIpnzI'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// ── 30 Bots (10 iniciantes · 10 intermediários · 10 experts) ─
const BOTS_DATA = [
  // --- INICIANTES (nível 1-20) ---
  { nick: 'ZeDoBaralho',   nivel:  8, xp:  580, xp_prox:  9000, moedas:  1200, gemas:  0, modo: 'paulista', status: 'Ainda aprendendo 😅',             wins:  8, losses: 12 },
  { nick: 'PrimeiraVez',   nivel:  5, xp:  320, xp_prox:  4000, moedas:   800, gemas:  0, modo: 'mineiro',  status: 'Truco é difícil hein',             wins:  3, losses:  8 },
  { nick: 'NoobMas10',     nivel: 12, xp: 1100, xp_prox: 13000, moedas:  2100, gemas:  2, modo: 'paulista', status: 'Aprendendo cada dia',              wins: 15, losses: 18 },
  { nick: 'TrucoNovato',   nivel:  7, xp:  450, xp_prox:  7000, moedas:   900, gemas:  0, modo: 'mineiro',  status: 'Vamos jogar!',                     wins:  6, losses: 10 },
  { nick: 'Iniciante01',   nivel: 15, xp: 1400, xp_prox: 16000, moedas:  2500, gemas:  3, modo: 'paulista', status: 'Cheguei pra aprender!',            wins: 20, losses: 22 },
  { nick: 'CaboDeVela',    nivel: 18, xp: 1800, xp_prox: 19000, moedas:  3200, gemas:  5, modo: 'mineiro',  status: 'Todo dia eu jogo!',                wins: 25, losses: 28 },
  { nick: 'Tiozinho',      nivel: 10, xp:  850, xp_prox: 10000, moedas:  1600, gemas:  1, modo: 'paulista', status: 'Jogo muito mas ganho pouco',       wins: 10, losses: 15 },
  { nick: 'AprendendoSo',  nivel:  3, xp:  180, xp_prox:  2000, moedas:   600, gemas:  0, modo: 'mineiro',  status: 'Primeiro app de truco!',           wins:  2, losses:  6 },
  { nick: 'PedroPanza',    nivel: 20, xp: 2100, xp_prox: 21000, moedas:  3800, gemas:  6, modo: 'paulista', status: 'Crescendo devagar 📈',              wins: 32, losses: 30 },
  { nick: 'VitoriaUm',     nivel: 16, xp: 1600, xp_prox: 17000, moedas:  2900, gemas:  4, modo: 'mineiro',  status: 'Primeira vitória foi especial ❤️',  wins: 22, losses: 25 },
  // --- INTERMEDIÁRIOS (nível 21-45) ---
  { nick: 'TrucoMestre',   nivel: 42, xp: 6200, xp_prox: 44000, moedas: 11500, gemas: 28, modo: 'paulista', status: 'Pronto pra dar truco! 🃏',         wins: 380, losses: 140 },
  { nick: 'RainhaTruco',   nivel: 38, xp: 5100, xp_prox: 40000, moedas:  9800, gemas: 22, modo: 'mineiro',  status: 'Ninguém me para',                  wins: 290, losses: 120 },
  { nick: 'Ferreiro77',    nivel: 31, xp: 3800, xp_prox: 33000, moedas:  6200, gemas: 14, modo: 'paulista', status: 'Ferreiro de carteirinha 🔧',        wins: 220, losses: 195 },
  { nick: 'ZeroMedo',      nivel: 45, xp: 7800, xp_prox: 47000, moedas: 14200, gemas: 35, modo: 'paulista', status: 'Sem medo de truco!',               wins: 500, losses: 180 },
  { nick: 'ManilhaMax',    nivel: 29, xp: 3200, xp_prox: 31000, moedas:  5400, gemas: 11, modo: 'mineiro',  status: 'Manilha é vida 🂡',                 wins: 180, losses: 155 },
  { nick: 'FerTruco',      nivel: 44, xp: 7500, xp_prox: 46000, moedas: 13800, gemas: 33, modo: 'mineiro',  status: 'Mineiro é o melhor modo',          wins: 390, losses: 170 },
  { nick: 'Julinha11',     nivel: 35, xp: 4600, xp_prox: 37000, moedas:  8100, gemas: 19, modo: 'paulista', status: '😎 Truco é vida',                   wins: 470, losses: 182 },
  { nick: 'DiegoFull',     nivel: 38, xp: 5200, xp_prox: 40000, moedas:  9200, gemas: 23, modo: 'mineiro',  status: 'Full no truco todo dia',           wins: 290, losses: 210 },
  { nick: 'Baralho23',     nivel: 22, xp: 2300, xp_prox: 23000, moedas:  4100, gemas:  8, modo: 'paulista', status: 'Estudando as manilhas 📚',          wins: 140, losses: 130 },
  { nick: 'TrucoRio',      nivel: 28, xp: 3000, xp_prox: 30000, moedas:  5100, gemas: 10, modo: 'mineiro',  status: 'Do Rio com amor ❤️',               wins: 170, losses: 145 },
  // --- EXPERTS (nível 46-70+) ---
  { nick: 'ZapaDor',       nivel: 70, xp: 9800, xp_prox: 100000, moedas: 32000, gemas: 88, modo: 'paulista', status: 'Lendário do truco 👑',            wins: 688, losses: 220 },
  { nick: 'MariaBolada',   nivel: 62, xp: 8100, xp_prox:  80000, moedas: 18500, gemas: 45, modo: 'mineiro',  status: 'Aqui quem manda sou eu!',         wins: 589, losses: 201 },
  { nick: 'ZeMineiro',     nivel: 55, xp: 7200, xp_prox:  70000, moedas: 15800, gemas: 38, modo: 'mineiro',  status: 'Mineiro de coração ❤',            wins: 503, losses: 198 },
  { nick: 'CobraDAgua',    nivel: 67, xp: 9200, xp_prox:  90000, moedas: 24500, gemas: 62, modo: 'paulista', status: 'Silencioso mas eficiente 🐍',     wins: 612, losses: 201 },
  { nick: 'TrucoKingPRO',  nivel: 58, xp: 7800, xp_prox:  75000, moedas: 20100, gemas: 52, modo: 'paulista', status: 'Pro player desde sempre 🎮',      wins: 501, losses: 190 },
  { nick: 'ElitePlayer',   nivel: 63, xp: 8500, xp_prox:  82000, moedas: 21500, gemas: 55, modo: 'mineiro',  status: 'Elite do elite 💎',                wins: 540, losses: 195 },
  { nick: 'OPardal',       nivel: 48, xp: 7100, xp_prox:  62000, moedas: 16800, gemas: 40, modo: 'paulista', status: 'Pega esse 6 mineiro! 🃏',         wins: 410, losses: 188 },
  { nick: 'LendaBR',       nivel: 69, xp: 9700, xp_prox:  98000, moedas: 29800, gemas: 75, modo: 'paulista', status: 'A lenda está aqui! 🔥',           wins: 660, losses: 215 },
  { nick: 'TrucoGod',      nivel: 65, xp: 9000, xp_prox:  86000, moedas: 23000, gemas: 60, modo: 'mineiro',  status: 'God do truco, simples assim 🙏',  wins: 590, losses: 200 },
  { nick: 'MisterTruco',   nivel: 52, xp: 7400, xp_prox:  68000, moedas: 17200, gemas: 43, modo: 'paulista', status: 'Misterioso mas letal 🎭',         wins: 450, losses: 188 },
]

// ── Utilitários ───────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms))

function avatarUrl(nick) {
  return `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${nick}&backgroundColor=1a1040`
}

function dataAleatoria(maxDaysAgo = 30) {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * maxDaysAgo))
  d.setHours(Math.floor(Math.random() * 22) + 1, Math.floor(Math.random() * 59), 0, 0)
  return d.toISOString()
}

// ── Funções Principais ────────────────────────────────────────

async function criarBot(bot, index) {
  const email = `bot_${bot.nick.toLowerCase().replace(/[^a-z0-9]/g, '')}@arenatruco.bot`
  process.stdout.write(`[${String(index + 1).padStart(2, '0')}/30] ${bot.nick.padEnd(14)} `)

  // Verifica se já existe
  const { data: lista } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  const jaExiste = lista?.users?.find(u => u.email === email)

  if (jaExiste) {
    await atualizarPerfil(jaExiste.id, bot)
    process.stdout.write(`→ já existe (atualizado)\n`)
    return { id: jaExiste.id, ...bot }
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: 'BotTruco@2026!',
    user_metadata: { nick: bot.nick },
    email_confirm: true,
  })

  if (error) {
    process.stdout.write(`→ ERRO: ${error.message}\n`)
    return null
  }

  await sleep(700) // aguarda trigger criar o perfil
  await atualizarPerfil(data.user.id, bot)
  process.stdout.write(`→ ✅ criado\n`)
  return { id: data.user.id, ...bot }
}

async function atualizarPerfil(userId, bot) {
  await supabase.from('profiles').update({
    nivel: bot.nivel,
    xp: bot.xp,
    xp_proximo: bot.xp_prox,
    moedas: bot.moedas,
    gemas: bot.gemas,
    modo_favorito: bot.modo,
    status_msg: bot.status,
    avatar_url: avatarUrl(bot.nick),
  }).eq('id', userId)
}

async function criarPartidas(bots) {
  console.log('\n🎮 Criando partidas entre os bots...')
  const modos = ['paulista', 'mineiro']
  const partidas = []

  for (let i = 0; i < bots.length; i++) {
    const bot = bots[i]
    const numOponentes = 5 + Math.floor(Math.random() * 5)
    const oponentes = bots
      .filter((_, j) => j !== i)
      .sort(() => Math.random() - 0.5)
      .slice(0, numOponentes)

    for (const oponente of oponentes) {
      const numPartidas = 2 + Math.floor(Math.random() * 3)
      for (let p = 0; p < numPartidas; p++) {
        const modo = modos[Math.random() > 0.5 ? 1 : 0]
        // Nível influencia probabilidade de vitória (com fator aleatório)
        const probVitoria = (bot.nivel / (bot.nivel + oponente.nivel)) * 1.15
        const venceu = Math.random() < probVitoria
        const resultado = venceu ? 'vitoria' : (Math.random() < 0.08 ? 'abandono' : 'derrota')
        const pontosGanhos = resultado === 'vitoria'
          ? Math.floor(Math.random() * 150) + 50
          : resultado === 'abandono'
            ? -(Math.floor(Math.random() * 40) + 20)
            : -(Math.floor(Math.random() * 100) + 30)

        partidas.push({
          modo,
          resultado,
          oponente_id: oponente.id,
          oponente_nick: oponente.nick,
          oponente_avatar: avatarUrl(oponente.nick),
          pontos_ganhos: pontosGanhos,
          duracao_min: Math.floor(Math.random() * 18) + 4,
          jogadores: [bot.id, oponente.id],
          criado_em: dataAleatoria(30),
        })
      }
    }
  }

  // Insere em lotes de 100
  for (let i = 0; i < partidas.length; i += 100) {
    const lote = partidas.slice(i, i + 100)
    const { error } = await supabase.from('partidas').insert(lote)
    if (error) console.error(`  Erro no lote ${Math.ceil(i/100)+1}: ${error.message}`)
    else process.stdout.write(`  ✅ Lote ${Math.ceil(i/100)+1}: ${lote.length} partidas\n`)
  }
  console.log(`  → Total: ${partidas.length} partidas criadas`)
}

async function criarPontuacoes(bots) {
  console.log('\n📊 Criando pontuação diária (14 dias)...')
  const registros = []
  const hoje = new Date()

  for (const bot of bots) {
    for (let d = 0; d < 14; d++) {
      const data = new Date(hoje)
      data.setDate(data.getDate() - d)
      const dateStr = data.toISOString().split('T')[0]
      const base = bot.nivel * 10
      // Alguns dias o bot não joga (pontos 0)
      const jogou = Math.random() > 0.3
      const pontos = jogou ? Math.max(50, Math.floor(Math.random() * base) + Math.floor(base * 0.2)) : 0

      registros.push({ perfil_id: bot.id, data: dateStr, pontos })
    }
  }

  const { error } = await supabase.from('pontuacao_diaria').upsert(registros, {
    onConflict: 'perfil_id,data',
  })
  if (error) console.error(`  Erro: ${error.message}`)
  else console.log(`  ✅ ${registros.length} registros inseridos (${bots.length} bots × 14 dias)`)
}

async function atualizarConquistas(bots) {
  console.log('\n🏆 Atualizando conquistas...')
  let total = 0

  for (const bot of bots) {
    const atualizacoes = [
      { badge_id: 'first_game',    conquistado: true,           progresso: 1,                         em: new Date(Date.now() - 86400000 * 30).toISOString() },
      { badge_id: 'wins_10',       conquistado: bot.wins >= 10, progresso: Math.min(bot.wins, 10),    em: bot.wins >= 10  ? new Date(Date.now() - 86400000 * 20).toISOString() : null },
      { badge_id: 'level_25',      conquistado: bot.nivel >= 25, progresso: Math.min(bot.nivel, 25),  em: bot.nivel >= 25 ? new Date(Date.now() - 86400000 * 15).toISOString() : null },
      { badge_id: 'top_500',       conquistado: bot.wins >= 50, progresso: Math.min(bot.wins * 5, 500), em: bot.wins >= 50 ? new Date(Date.now() - 86400000 * 10).toISOString() : null },
      { badge_id: 'wins_100',      conquistado: bot.wins >= 100, progresso: Math.min(bot.wins, 100),  em: bot.wins >= 100 ? new Date(Date.now() - 86400000 * 8).toISOString() : null },
      { badge_id: 'top_100',       conquistado: bot.wins >= 400, progresso: Math.min(Math.floor(bot.wins / 4), 100), em: bot.wins >= 400 ? new Date(Date.now() - 86400000 * 3).toISOString() : null },
      { badge_id: 'level_50',      conquistado: bot.nivel >= 50, progresso: Math.min(bot.nivel, 50),  em: bot.nivel >= 50 ? new Date(Date.now() - 86400000 * 5).toISOString() : null },
      { badge_id: 'truco_master',  conquistado: false,           progresso: Math.min(bot.nivel * 15, 999), em: null },
    ]

    for (const a of atualizacoes) {
      await supabase.from('conquistas')
        .update({ conquistado: a.conquistado, progresso_atual: a.progresso, conquistado_em: a.em })
        .eq('perfil_id', bot.id)
        .eq('badge_id', a.badge_id)
      total++
    }
  }

  console.log(`  ✅ ${total} conquistas atualizadas`)
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Arena Truco Premium — Seed Script')
  console.log('======================================\n')

  // 1. Criar bots
  console.log('👥 Criando 30 jogadores bots...\n')
  const bots = []
  for (let i = 0; i < BOTS_DATA.length; i++) {
    const bot = await criarBot(BOTS_DATA[i], i)
    if (bot) bots.push(bot)
    await sleep(300)
  }

  console.log(`\n✅ ${bots.length}/30 bots prontos!`)
  if (bots.length === 0) { console.error('Nenhum bot criado. Abortando.'); process.exit(1) }

  // 2. Criar partidas
  await criarPartidas(bots)

  // 3. Criar pontuações diárias
  await criarPontuacoes(bots)

  // 4. Atualizar conquistas
  await atualizarConquistas(bots)

  console.log('\n\n🎉 SEED COMPLETO!')
  console.log(`  ✅ ${bots.length} bots criados`)
  console.log('  ✅ Histórico de partidas gerado')
  console.log('  ✅ Pontuação diária (14 dias) gerada')
  console.log('  ✅ Conquistas atualizadas')
  console.log('\nAbra o app e veja os dados reais nas abas do Perfil! 🃏')
  process.exit(0)
}

main().catch(e => { console.error('\n💥 Erro fatal:', e); process.exit(1) })
