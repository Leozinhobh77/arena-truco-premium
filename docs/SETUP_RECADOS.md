# 📬 Setup do Sistema de Recados — Arena Truco Premium

## O que foi implementado?

✅ **Hooks de Recados** — `src/hooks/useRecados.ts`
- `useRecados()` — busca recados recebidos do usuário atual
- `useSendRecado()` — envia recado para outro usuário
- `useMarcarRecadoLido()` — marca um recado como lido

✅ **Components Atualizados**
- `RecadosOverlay.tsx` — mostra recados reais do Supabase em vez de mock
- `DeixarRecadoOverlay.tsx` — envia recados reais para o Supabase

✅ **Tipos TypeScript** — `src/lib/supabase.types.ts`
- Interface `Recado` com `id, remetente_id, destinatario_id, mensagem, lido, criado_em`
- Tipos `RecadoInsert` e `RecadoUpdate`

✅ **Schema SQL** — `docs/MIGRATION_RECADOS.sql`
- Tabela `amizades` para relações de amizade
- Tabela `recados` com RLS (Row Level Security)

---

## ⚠️ PRÓXIMA ETAPA: Execute a Migration no Supabase

### Passo 1: Abra o Supabase Dashboard
1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Selecione seu projeto "arena-truco-premium"
3. Vá em **SQL Editor** → clique em **"New Query"**

### Passo 2: Cole e Execute o SQL
1. Abra o arquivo: `docs/MIGRATION_RECADOS.sql`
2. Copie TODO o conteúdo (de `--` até o final)
3. Cole no SQL Editor do Supabase
4. Clique em **"RUN"** (botão azul)

✅ Se vir "Query executing" e depois nenhum erro em vermelho = sucesso!

### Passo 3: Verifique as Tabelas Criadas
1. Vá em **Table Editor** (esquerda)
2. Procure por `amizades` → clique para ver a tabela criada
3. Procure por `recados` → clique para ver a tabela criada
4. Ambas devem aparecer com as colunas corretas

---

## 🧪 Teste Agora

### Teste 1: Criar Amizades
1. Abra o app em dois navegadores (ou abas anônimas) com 2 contas diferentes
2. Na conta A, vá ao Ranking e clique num jogador da conta B
3. Clique em **"Enviar Solicitação de Amizade"**
4. Na conta B, vá ao seu overlay de **Amizades** e aceite

✅ Devem aparecer na lista de amigos de ambas as contas

### Teste 2: Enviar Recados
1. Na conta A, clique num jogador (que seja amigo ou não)
2. Clique em **"Deixar Recado"**
3. Escreva algo como: "Ó bora jogar! 🎮⚔️"
4. Clique em **"📬 Enviar Recado"**
5. Vá para a conta B e abra **"📬 Meus Recados"**

✅ O recado deve aparecer na lista com badge "Novo"

### Teste 3: Marcar como Lido
1. Clique no recado (ou teste clicando para marcar como lido)
2. O badge "Novo" deve desaparecer
3. Volte para a conta A e clique no mesmo jogador novamente
4. Confirme que o recado foi salvo

✅ Recados devem ser persistidos no banco

---

## 📋 Checklist de Conclusão

- [ ] SQL foi executado no Supabase sem erros
- [ ] Tabela `amizades` aparece no Table Editor
- [ ] Tabela `recados` aparece no Table Editor
- [ ] Teste 1 (Amizades) funcionou
- [ ] Teste 2 (Enviar Recados) funcionou
- [ ] Teste 3 (Marcar como Lido) funcionou

Após completar todos, o sistema de recados estará 100% funcional! 🎉

---

## 🐛 Troubleshooting

### "Erro: table 'recados' does not exist"
- Significa que a migration não foi executada ou falhou
- Volte ao Passo 2 e rode o SQL novamente
- Verifique se há erros em vermelho no SQL Editor

### "Recados aparecem mas não salvam"
- Verifique se seu usuário está autenticado (`usuario` em `useAuthStore`)
- Abra o DevTools → Network → veja se a request ao Supabase é 200 (sucesso)

### "Não consigo enviar recado"
- Verifique se o `amigoId` está sendo passado corretamente
- Abra Console → procure por erros
- Confirme que a RLS da tabela `recados` está habilitada

---

## 📞 Arquivos Relacionados

- `src/hooks/useRecados.ts` — Lógica de busca e envio
- `src/overlays/RecadosOverlay.tsx` — Tela de recados
- `src/overlays/DeixarRecadoOverlay.tsx` — Tela de envio
- `docs/SCHEMA.md` — Documentação completa do schema
- `docs/MIGRATION_RECADOS.sql` — SQL para executar no Supabase

