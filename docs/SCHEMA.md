# SCHEMA — Arena Truco Premium (Supabase / PostgreSQL)
**Gerado por:** skill-consultor v5.2 | **Data:** 2026-04-15
**Appetite:** M — Fase 1 (Auth + Perfil) integrada na Sprint 3

---

## 📐 Visão Geral das Tabelas

```
auth.users (gerenciada pelo Supabase Auth — não editar diretamente)
    └── profiles          ← extensão pública do usuário
         └── partidas     ← histórico de partidas jogadas (Sprint 5)
              └── ranking ← VIEW computada (Sprint 5)
         └── inventario   ← itens da loja comprados (Sprint 6)
         └── clans        ← clã do jogador (Sprint 8)
```

---

## 🗄️ FASE 1 — Auth & Perfil (Sprint 3) ← IMPLEMENTAR AGORA

### Tabela: `profiles`
Extensão pública de `auth.users`. Criada automaticamente via trigger ao registrar.

```sql
-- ============================================================
-- TABELA: profiles
-- Criada junto com auth.users via trigger automático
-- ============================================================
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  nick        text not null unique,
  avatar_url  text,
  nivel       integer not null default 1,
  xp          integer not null default 0,
  moedas      integer not null default 500,
  modo_favorito text check (modo_favorito in ('mineiro', 'paulista')) default 'paulista',
  criado_em   timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- Índice para buscas por nick (nick único já cria índice implícito)
create index profiles_nivel_idx on public.profiles(nivel desc);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — profiles
-- ============================================================
alter table public.profiles enable row level security;

-- Qualquer um pode ver perfis (ranking público)
create policy "Perfis são públicos para leitura"
  on public.profiles for select
  using (true);

-- Só o próprio usuário pode atualizar seu perfil
create policy "Usuário atualiza seu próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================================
-- TRIGGER: criar profile automaticamente ao registrar
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nick, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nick', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- FUNÇÃO: atualizar campo atualizado_em automaticamente
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
```

---

## 🗄️ FASE 2 — Histórico & Ranking (Sprint 5) ← NÃO IMPLEMENTAR AGORA

### Tabela: `partidas`

```sql
-- ============================================================
-- TABELA: partidas (Sprint 5)
-- ============================================================
create table public.partidas (
  id           uuid primary key default gen_random_uuid(),
  modo         text not null check (modo in ('mineiro', 'paulista')),
  vencedor_id  uuid references public.profiles(id),
  duracao_seg  integer,
  pontos_nos   integer not null default 0,
  pontos_eles  integer not null default 0,
  jogadores    uuid[] not null,  -- array de IDs dos jogadores
  criado_em    timestamptz not null default now()
);

alter table public.partidas enable row level security;

-- Jogadores da partida podem ver ela
create policy "Partida visível para seus jogadores"
  on public.partidas for select
  using (auth.uid() = any(jogadores));

-- ============================================================
-- VIEW: ranking (computada de partidas)
-- ============================================================
create or replace view public.ranking as
  select
    p.id,
    p.nick,
    p.avatar_url,
    p.nivel,
    count(pa.id) filter (where pa.vencedor_id = p.id) as vitorias,
    count(pa.id) as partidas_totais,
    round(
      count(pa.id) filter (where pa.vencedor_id = p.id)::numeric
      / nullif(count(pa.id), 0) * 100, 1
    ) as winrate
  from public.profiles p
  left join public.partidas pa on p.id = any(pa.jogadores)
  group by p.id, p.nick, p.avatar_url, p.nivel
  order by vitorias desc;
```

---

## 🗄️ FASE 3 — Social & Loja (Sprint 6-8) ← FUTURO

### Tabela: `inventario`

```sql
-- Sprint 6: inventario de itens da Loja
create table public.inventario (
  id         uuid primary key default gen_random_uuid(),
  perfil_id  uuid references public.profiles(id) on delete cascade,
  item_id    text not null,           -- ex: 'deck_obsidian', 'avatar_rei'
  tipo       text not null,           -- 'baralho' | 'avatar' | 'tema_mesa'
  equipado   boolean default false,
  comprado_em timestamptz default now()
);

alter table public.inventario enable row level security;

create policy "Inventário visível ao dono"
  on public.inventario for select
  using (auth.uid() = perfil_id);
```

### Tabela: `clans`

```sql
-- Sprint 8: clãs
create table public.clans (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null unique,
  brasao_url text,
  lider_id   uuid references public.profiles(id),
  criado_em  timestamptz default now()
);

-- Coluna no profile (adicionar na Sprint 8)
-- alter table public.profiles add column clan_id uuid references public.clans(id);
```

---

## 📋 Checklist de Setup no Supabase Dashboard

```
[ ] 1. Criar projeto em supabase.com (FREE tier)
[ ] 2. Ir em SQL Editor → New Query
[ ] 3. Colar e rodar o bloco "FASE 1" deste schema
[ ] 4. Ir em Authentication → Providers
[ ] 5. Habilitar: Email/Password e Google OAuth
[ ] 6. Ir em Settings → API → copiar URL + anon key
[ ] 7. Criar .env.local com as duas chaves
[ ] 8. Testar: npm run dev → cadastrar usuário → ver em Table Editor → profiles
```

---

## 🔑 Variáveis de Ambiente

```env
# .env.local (NUNCA sobe para o git)
VITE_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...SUA_ANON_KEY
```
