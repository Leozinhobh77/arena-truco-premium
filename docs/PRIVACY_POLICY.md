# 🔒 Política de Privacidade — Arena Truco Premium

**Última atualização:** 24 de abril de 2026  
**Versão:** 1.0  
**Responsável:** Arena Truco Premium Team

---

## 📋 Introdução

Bem-vindo à Política de Privacidade do **Arena Truco Premium** ("**Aplicação**", "**nós**", "**nosso**").

Estamos comprometidos com a proteção de seus dados pessoais. Esta política descreve como coletamos, utilizamos, armazenamos e protegemos suas informações pessoais, em conformidade com a **Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018)** e as melhores práticas de privacidade e segurança.

---

## 1️⃣ Quais dados você coleta?

Coletamos os seguintes dados pessoais quando você usa nossa Aplicação:

### 📧 Durante o Cadastro/Login:
- **Email** — Para autenticação e recuperação de conta
- **Senha** — Criptografada via bcrypt (nunca armazenamos em texto plano)

### 👤 Informações de Perfil (voluntárias):
- **Apelido/Nick** — Identificador público no jogo
- **Avatar** — Foto de perfil (armazenada em servidor seguro)
- **Modo favorito** — Sua preferência de jogo (Mineiro/Paulista)

### 🎮 Dados de Gameplay (automáticos):
- **Histórico de partidas** — Resultado, duração, modo jogado
- **Pontuação diária** — Seu desempenho por dia
- **Nível e XP** — Progresso no jogo
- **Moedas virtuais** — Saldo de moeda in-game
- **Conquistas/Badges** — Trofeus desbloqueados

### 👥 Dados de Relacionamento:
- **Lista de amigos** — Quem você adicionou como amigo
- **Status de amizade** — Pendente, aceita ou rejeitada

### 🔐 Dados Técnicos (automáticos):
- **ID do usuário** — Identificador único (UUID)
- **Data/hora de login** — Quando você acessou a app
- **Data de criação da conta** — Quando se cadastrou

---

## 2️⃣ Por que você coleta esses dados?

Coletamos dados para os seguintes **fins legítimos**:

### 🔐 Autenticação e Segurança:
- Email e senha para login seguro
- Proteger sua conta de acesso não autorizado

### 🎮 Funcionalidade da Aplicação:
- Histórico de partidas para estatísticas e ranking
- Dados de gameplay para calcular nível e pontuação
- Lista de amigos para jogo multiplayer (futuro)

### 📊 Melhoria de Serviço:
- Analisar como você usa a app (anônimo, sem rastrear indivíduos)
- Identificar bugs e problemas de performance
- Desenvolver novas features

### 📧 Comunicação:
- Email para avisos críticos (recuperação de conta, mudanças de política)
- NUNCA enviamos publicidade sem consentimento

---

## 3️⃣ Como você armazena os dados?

Seus dados são armazenados com as seguintes protecções:

### 🔐 Criptografia:
- **Em repouso:** Base de dados PostgreSQL criptografado (Supabase)
- **Em trânsito:** HTTPS/TLS em todas as comunicações
- **Senhas:** Hashed com bcrypt (nunca descriptografáveis)

### 🏢 Armazenamento:
- **Provedor:** Supabase (Data Center Brasil/Américas)
- **Backup:** Automático e criptografado
- **Acesso:** Apenas nosso time de engenharia (via logs auditados)

### ⏱️ Retenção:
- **Dados de login:** Mantidos enquanto sua conta existir
- **Histórico de partidas:** Mantido por tempo indefinido (seu registro de jogo)
- **Logs técnicos:** Deletados após 30 dias (para conformidade)

---

## 4️⃣ Quais são seus direitos?

Conforme a LGPD, você tem o direito de:

### ✅ Acessar seus dados:
- Solicitar uma cópia completa de todos os seus dados
- Envie email para: [email do responsável — adicionar]

### ✅ Corrigir dados inexatos:
- Editar seu email, apelido, avatar diretamente na app
- Ou solicitar ajuda via email

### ✅ Deletar sua conta e dados:
- Solicitar exclusão completa (em breve, via settings da app)
- Dados serão deletados em até 30 dias
- Relacionamentos com outros usuários permanecerão anônimos

### ✅ Revogar consentimento:
- Pode deixar de usar a app a qualquer momento
- Dados não serão compartilhados após revogação

### ✅ Portabilidade de dados:
- Pode solicitar seus dados em formato comum (JSON/CSV)

### 📧 Para exercer seus direitos:
Envie email para: **[seu-email@arena-truco.com]**  
Responderemos em até 10 dias úteis.

---

## 5️⃣ Compartilhamos seus dados com terceiros?

**NÃO** compartilhamos seus dados pessoais com terceiros, EXCETO:

### ✅ Casos permitidos:
- **Supabase:** Provedor de backend (Data Processing Agreement assinado)
- **Conformidade legal:** Se obrigados por lei ou ordem judicial
- **Proteção de direitos:** Se necessário proteger nós ou outros usuários

### ❌ Nunca vendemos ou alugamos:
- Sua lista de contatos
- Seu histórico de jogo
- Seu email para marketers

---

## 6️⃣ Segurança dos dados

Implementamos medidas de segurança para proteger seus dados:

- ✅ HTTPS/TLS em toda comunicação
- ✅ Autenticação via Supabase Auth (OAuth seguro)
- ✅ Row-Level Security (RLS) no banco de dados
- ✅ Senhas hashed com bcrypt
- ✅ Logs de acesso auditados
- ✅ Backup automático e criptografado

**Nenhum sistema é 100% seguro.** Se suspeitar de vazamento, notifique-nos imediatamente.

---

## 7️⃣ Retenção de dados

Retemos seus dados conforme:

| Tipo de Dado | Retenção | Motivo |
|---|---|---|
| Email/Senha | Até deleção da conta | Autenticação |
| Perfil (Nick, Avatar) | Até deleção da conta | Identidade pública |
| Histórico de partidas | Indefinido | Seu registro permanente |
| Estatísticas (XP, Moedas) | Até deleção da conta | Progresso do jogo |
| Logs técnicos | 30 dias | Debugging/Security |
| Cookies de sessão | 1 hora | Autenticação |

**Ao deletar sua conta:**
- Email, senha, avatar são deletados
- Histórico de partidas é anonimizado
- Amigos verão você como "Jogador deletado"

---

## 8️⃣ Cookies e rastreamento

Usamos cookies para:
- ✅ Manter você logado (session token)
- ✅ Salvar suas preferências (tema, idioma)
- ✅ Lembrar seu último jogo

**Não usamos:**
- ❌ Google Analytics ou rastreadores de terceiros
- ❌ Pixel tracking ou fingerprinting
- ❌ Vendedores de dados

Você pode desabilitar cookies no seu navegador (vai precisar fazer login a cada acesso).

---

## 9️⃣ Menores de idade

Não coletamos dados de menores de 18 anos INTENCIONALMENTE.

Se descobrirmos que um usuário é menor de 18:
1. Pediremos consentimento dos pais/responsável
2. OU deletaremos a conta automaticamente

Se você é menor de 18, peça permissão dos pais antes de usar.

---

## 🔟 Mudanças nesta política

Podemos atualizar esta política ocasionalmente. Quando fizermos:

- ✅ Avisaremos via email (para mudanças materiais)
- ✅ Pediremos re-consentimento se necessário
- ✅ Atualizaremos a data no topo

Sua continuidade de uso = aceitar mudanças.

---

## 1️⃣1️⃣ Contato e dúvidas

Se tiver dúvidas sobre esta política:

📧 **Email:** [seu-email@arena-truco.com]  
📱 **Suporte in-app:** Menu Settings → Privacy & Help  
⚖️ **ANPD (Autoridade Nacional de Proteção de Dados):** www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd

---

## 1️⃣2️⃣ Conformidade

Esta política está em conformidade com:
- ✅ Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018)
- ✅ Regulamento Geral de Proteção de Dados (GDPR — se aplicável)
- ✅ Melhores práticas internacionais de privacidade

---

**Última revisão:** 24 de abril de 2026  
**Próxima revisão planejada:** 24 de outubro de 2026  

🔒 Obrigado por confiar em Arena Truco Premium.
