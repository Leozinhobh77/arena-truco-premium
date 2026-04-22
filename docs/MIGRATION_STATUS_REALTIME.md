# MIGRAÇÃO FUTURA: Status em Tempo Real (Opção 3)

**Data de Criação:** 2026-04-22  
**Status:** PLANEJADO (executar quando ultrapasse 5-10k jogadores online)  
**Prioridade:** MÉDIA (baixa agora, ALTA quando crescer)

---

## 🎯 POR QUE FAZER ESSA MIGRAÇÃO?

Atualmente usamos Realtime Subscription na tabela `profiles` (Opção 1), que funciona bem até 5-10k jogadores simultâneos. Acima disso, fica lento porque cada mudança em XP/moedas/nível gera notificação.

A Opção 3 (tabela `user_status` dedicada) escala até 100k+ jogadores porque isola as mudanças de status do ruído de outras operações.

---

## 📋 CHECKLIST DE MIGRAÇÃO

### Passo 1: Criar tabela `user_status`
```sql
-- Adicionar em MIGRATION_USER_STATUS.sql
create table public.user_status (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  status text not null check (status in ('disponivel', 'jogando', 'offline')) default 'offline',
  modo_jogo text,  -- 'paulista' ou 'mineiro'
  tempo_jogando_min integer,
  ultima_atividade_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- RLS
alter table public.user_status enable row level security;

-- Qualquer um pode ver status dos amigos (público)
create policy "Status visível" on public.user_status for select using (true);

-- User atualiza seu próprio status
create policy "User atualiza seu status" on public.user_status for update using (auth.uid() = user_id);

-- Índices
create index user_status_user_idx on public.user_status(user_id);
create index user_status_status_idx on public.user_status(status);
create index user_status_atualizado_idx on public.user_status(atualizado_em desc);
```

### Passo 2: Migrar dados históricos
```sql
-- Insert status inicial para todos os users
insert into public.user_status (user_id, status)
select id, 'offline' from public.profiles
on conflict (user_id) do nothing;
```

### Passo 3: Atualizar hook `useAmigosRealtime`
**Arquivo:** `src/hooks/useAmigosRealtime.ts`

**Mudanças:**
- Trocar subscription de `profiles` para `user_status`
- Buscar dados expandidos (join com profiles)
- Filtrar amigos offline/online/jogando da tabela `user_status`

**Antes:**
```typescript
.from('profiles')
.select('id, nick, ...')
.on('postgres_changes', { table: 'profiles', ... })
```

**Depois:**
```typescript
.from('user_status')
.select('*, profile:user_id(...)')
.on('postgres_changes', { table: 'user_status', ... })
```

### Passo 4: Atualizar `useÚltimosJogadores`
- Continuar usando `partidas` para pegar histórico
- Mas buscar status atual de `user_status`

### Passo 5: Testar
- [ ] Status atualiza em < 100ms
- [ ] Nenhum atraso mesmo com 10k+ amigos online
- [ ] Sem ruído de mudanças de XP/moedas

### Passo 6: Deploy gradual
- Primeiro: Deploy nova tabela + código antigo (dual-write)
- Depois: Migrar todas as queries
- Depois: Remover Realtime de `profiles`

---

## ⚠️ NOTES IMPORTANTES

1. **Não quebra código atual** — pode fazer essa migração sem alterar UI
2. **Pode fazer quando tiver time** — não é urgent agora
3. **Teste de carga ANTES de deploy** — com 10k+ conexões Realtime
4. **Heartbeat automático:** considerar função Postgres que desconecta quem ficou offline > 30min

---

## 📞 PRÓXIMOS PASSOS

**Quando ver sinais de crescimento (5k+ jogadores):**
1. Executar Passo 1-3 acima
2. Rodar testes de carga
3. Deploy gradual com feature flag
4. Monitor de latência

**Slack/Email de trigger:** Quando atingir 3-4k jogadores simultâneos, rever essa migração.

---

**Criado por:** Claude  
**Próxima revisão:** Quando tiver 2-3k jogadores simultâneos
