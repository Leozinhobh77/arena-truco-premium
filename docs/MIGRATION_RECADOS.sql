-- ============================================================
-- MIGRATION: Tabela de Recados (Mensagens entre Amigos)
-- Arena Truco Premium — Sprint 4
-- ============================================================
-- Executar no Supabase Dashboard → SQL Editor → New Query
-- Cole o código abaixo e clique em RUN
-- ============================================================

-- ============================================================
-- TABELA: amizades (Relação bidirecional de amizade)
-- ============================================================
create table public.amizades (
  id              uuid primary key default gen_random_uuid(),
  remetente_id    uuid not null references public.profiles(id) on delete cascade,
  destinatario_id uuid not null references public.profiles(id) on delete cascade,
  status          text not null check (status in ('pendente', 'aceita', 'rejeitada')) default 'pendente',
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now(),
  unique(remetente_id, destinatario_id)
);

alter table public.amizades enable row level security;

-- Qualquer um pode ver suas próprias amizades (como remetente ou destinatário)
create policy "Amizades visíveis aos envolvidos"
  on public.amizades for select
  using (auth.uid() = remetente_id or auth.uid() = destinatario_id);

-- Só remetente pode enviar (insert) sua própria solicitação
create policy "Remetente pode criar amizade"
  on public.amizades for insert
  with check (auth.uid() = remetente_id);

-- Só destinatário pode aceitar/rejeitar sua própria solicitação
create policy "Destinatário pode atualizar sua solicitação"
  on public.amizades for update
  using (auth.uid() = destinatario_id);

-- ============================================================
-- TABELA: recados (Mensagens entre amigos)
-- ============================================================
create table public.recados (
  id              uuid primary key default gen_random_uuid(),
  remetente_id    uuid not null references public.profiles(id) on delete cascade,
  destinatario_id uuid not null references public.profiles(id) on delete cascade,
  mensagem        text not null,
  lido            boolean not null default false,
  criado_em       timestamptz not null default now()
);

-- Índice para buscar recados do usuário rapidamente
create index recados_destinatario_idx on public.recados(destinatario_id, criado_em desc);

alter table public.recados enable row level security;

-- Apenas o destinatário pode ver seus próprios recados
create policy "Recados visíveis ao destinatário"
  on public.recados for select
  using (auth.uid() = destinatario_id);

-- Qualquer um autenticado pode enviar recado (limitado por RLS)
create policy "Remetente pode enviar recado"
  on public.recados for insert
  with check (auth.uid() = remetente_id);

-- Destinatário pode marcar como lido
create policy "Destinatário marca recado como lido"
  on public.recados for update
  using (auth.uid() = destinatario_id);

-- ============================================================
-- TABELA: chats_privados (Conversas privadas entre usuários)
-- ============================================================
create table public.chats_privados (
  id uuid primary key default gen_random_uuid(),
  usuario1_id uuid not null references public.profiles(id) on delete cascade,
  usuario2_id uuid not null references public.profiles(id) on delete cascade,
  criado_em timestamptz not null default now(),
  unique(usuario1_id, usuario2_id)
);

-- Índice para buscar chats do usuário
create index chats_privados_usuario1_idx on public.chats_privados(usuario1_id);
create index chats_privados_usuario2_idx on public.chats_privados(usuario2_id);

alter table public.chats_privados enable row level security;

-- Apenas usuários envolvidos podem ver o chat
create policy "Chat visível aos envolvidos"
  on public.chats_privados for select
  using (auth.uid() = usuario1_id or auth.uid() = usuario2_id);

-- Usuário cria chat
create policy "Usuário cria chat"
  on public.chats_privados for insert
  with check (auth.uid() = usuario1_id or auth.uid() = usuario2_id);

-- ============================================================
-- ATUALIZAR profile: adicionar campos faltantes
-- ============================================================
-- Se status_msg e xp_proximo não existirem, descomente abaixo:
-- alter table public.profiles add column status_msg text;
-- alter table public.profiles add column xp_proximo integer not null default 100;
-- alter table public.profiles add column gemas integer not null default 0;

-- ============================================================
-- TESTE (OPCIONAL): Inserir dados de teste
-- ============================================================
-- Descomente abaixo para testar com dados fake
-- (Nota: substitua os UUIDs pelos user IDs reais)

-- INSERT INTO public.amizades (remetente_id, destinatario_id, status)
-- VALUES ('user-id-1', 'user-id-2', 'aceita');

-- INSERT INTO public.recados (remetente_id, destinatario_id, mensagem)
-- VALUES ('user-id-2', 'user-id-1', 'Ó bora jogar uma aí! 🎮⚔️');

-- ============================================================
-- FIM DA MIGRATION
-- ============================================================
