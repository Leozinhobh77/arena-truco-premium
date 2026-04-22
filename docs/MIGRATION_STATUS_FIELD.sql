-- ============================================================
-- MIGRATION: Adicionar Campo de Status a Profiles
-- Arena Truco Premium — Para Realtime Subscription funcionar
-- ============================================================
-- Executar no Supabase Dashboard → SQL Editor
-- ============================================================

-- Adicionar coluna de status à tabela profiles
alter table public.profiles
add column if not exists status_atual text not null default 'offline'
check (status_atual in ('disponivel', 'jogando', 'offline'));

-- Adicionar coluna de timestamp de última atualização de status
alter table public.profiles
add column if not exists atualizado_status_em timestamptz not null default now();

-- Criar índice para queries de status (performance)
create index if not exists profiles_status_idx on public.profiles(status_atual);

-- Atualizar RLS se necessário (optional - status é público)
-- Qualquer um pode ver status de amigos
create policy "Status visível" on public.profiles for select using (true);

-- User pode atualizar seu próprio status
create policy "User atualiza seu status" on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- ============================================================
-- NOTAS:
-- ============================================================
-- 1. Todos começam como 'offline' por padrão
-- 2. Usuario app atualiza seu status quando:
--    - Abre o app → 'disponivel'
--    - Clica em "Jogar" → 'jogando'
--    - Fecha app → 'offline'
-- 3. Realtime subscription monitora mudanças instantaneamente
-- ============================================================
