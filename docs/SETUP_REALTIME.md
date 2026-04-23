# ATIVAÇÃO: Realtime Subscription para Status em Tempo Real

**Data:** 2026-04-22  
**Status:** PRONTO PARA ATIVAR  
**Impacto:** Status de amigos vai atualizar em <100ms (instantâneo!)

---

## ⚡ COMO ATIVAR (3 PASSOS)

### **Passo 1: Executar Migration no Supabase**

1. Abra [Supabase Dashboard](https://supabase.com) → Seu Projeto
2. Vá para **SQL Editor** → **New Query**
3. **Cole este código:**

```sql
-- Adicionar campos de status à tabela profiles
alter table public.profiles
add column if not exists status_atual text not null default 'offline'
check (status_atual in ('disponivel', 'jogando', 'offline'));

alter table public.profiles
add column if not exists atualizado_status_em timestamptz not null default now();

-- Índices para performance
create index if not exists profiles_status_idx on public.profiles(status_atual);

-- RLS policies
create policy "Status visível" on public.profiles for select using (true);
create policy "User atualiza status" on public.profiles for update
using (auth.uid() = id) with check (auth.uid() = id);
```

4. Clique em **RUN**
5. ✅ Pronto! Campos criados

---

### **Passo 2: Atualizar Status do Usuário**

Agora você precisa **atualizar o `status_atual`** quando o usuário:

**Entra online** (abre o app):
```typescript
// Em LoginScreen ou durante inicialização
await supabase
  .from('profiles')
  .update({ status_atual: 'disponivel', atualizado_status_em: new Date().toISOString() })
  .eq('id', usuario.id);
```

**Começa a jogar** (clica em "Jogar"):
```typescript
// Em GameOverlay ou antes de entrar em uma sala
await supabase
  .from('profiles')
  .update({ status_atual: 'jogando', atualizado_status_em: new Date().toISOString() })
  .eq('id', usuario.id);
```

**Sai offline** (fecha o app / tab):
```typescript
// Em window.beforeunload ou useEffect cleanup
await supabase
  .from('profiles')
  .update({ status_atual: 'offline', atualizado_status_em: new Date().toISOString() })
  .eq('id', usuario.id);
```

---

### **Passo 3: Testar**

1. Abra a app em **2 abas/janelas** diferentes com **2 contas diferentes**
2. Na Aba 1: Mude seu status para "disponivel"
3. Na Aba 2: Abra "Amigos Online"
4. **Você deveria ver a mudança em < 100ms!** ⚡

---

## 🎯 O QUE MUDA

| Antes | Depois |
|-------|--------|
| Atraso de 5-30 segundos | Atraso < 100ms |
| Simula status aleatório | Status REAL do banco |
| Precisa recarregar página | Atualiza automaticamente |
| Chato usar | Super rápido! ⚡ |

---

## 📝 CHECKLIST

- [ ] Migration executada no Supabase (campos `status_atual` e `atualizado_status_em` criados)
- [ ] Código adicionado para atualizar status em:
  - [ ] Login/Inicialização: → 'disponivel'
  - [ ] Antes de jogar: → 'jogando'
  - [ ] Logout/Fechar: → 'offline'
- [ ] Testado em 2 abas: status muda em <100ms
- [ ] Amigos vêm a mudança instantaneamente

---

## 🚀 FUTURA MIGRAÇÃO

Quando tiver **5-10k jogadores online**, migre para **Opção 3** (tabela `user_status` dedicada):

Ver: `docs/MIGRATION_STATUS_REALTIME.md`

---

## ⚠️ IMPORTANT NOTES

1. **Supabase Realtime precisa estar ativado** no projeto
   - Vá em **Project Settings** → **Realtime** → verifique que está ON
2. **RLS deve permitir updates** (já configurado na migration)
3. **status_atual só pode ser: 'disponivel', 'jogando', 'offline'**

---

**Dúvidas?** Vê a migration SQL em `docs/MIGRATION_STATUS_FIELD.sql`
