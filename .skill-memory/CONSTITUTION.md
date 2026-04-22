# ⚖️ CONSTITUTION — skill-performance v5.2

**Leis invioláveis que governam o desenvolvimento e operação da skill**

*Baseado em diagnóstico aprovado pelo Orquestrador e Board Executivo*

**Data:** 2026-04-15 | **Versão:** 5.2.0 | **Nível:** ENTERPRISE | **Appetite:** L (4 semanas)

---

## SEÇÃO 1: LEIS DO PRODUTO (Derive do PRD)

### LEI-P01: Foco em Detecção Proativa

**Enunciado:** skill-performance deve PREVENIR problemas, não apenas detectá-los. Análises devem rodar PRÉ-BUILD, não pós-problema.

**Quando:** Toda feature proposta passa por: "Isto avisa o dev antes dele descobrir no Lighthouse?"

**Consequência:** Features puramente reativas (análise após performance degradada) são vetadas.

**Exemplo:**
- ✅ PRÉ-BUILD analyzer (previne antes)
- ❌ Apenas Lighthouse ao final (muito tarde)

---

### LEI-P02: Recomendações Sempre Específicas

**Enunciado:** Nunca output genérico. Sempre: arquivo:linha + fix específica.

**Quando:** Ao gerar relatório, cada recomendação verifica: "Um dev consegue implementar sem pesquisa?"

**Consequência:** Se não conseguir ser específico, não recomenda (marque como "needs manual review").

**Exemplo:**
- ❌ BAD: "Reduzir tamanho de bundle"
- ✅ GOOD: "RankingScreen.tsx:145 — abrirPerfilGlobal não usa useCallback. Envolver em useCallback([amigoId], [deps])"

---

### LEI-P03: Sem Falsos Positivos > Sem Verdadeiros Positivos

**Enunciado:** Melhor não avisar de um problema real do que avisar algo que não importa.

**Quando:** Ao tunar detectors, false-positive-rate máximo = 10%.

**Consequência:** Threshold de confiança > 80% para qualquer recomendação HIGH/MEDIUM.

**Justificativa:** Dev perde confiança se skill grita por coisas irrelevantes.

---

### LEI-P04: Integrado ao Pipeline Forge, Não Standalone

**Enunciado:** skill-performance é parte da pipeline, não ferramenta separada. Roda em Janela 2 paralela ao Construtor.

**Quando:** Invocação sempre via `/skill-performance` dentro de sessão Forge, nunca standalone.

**Consequência:** Depende de .skill-memory/working-memory.json, decision-log.json, etc.

---

### LEI-P05: Sem Modificação Automática de Código

**Enunciado:** skill-performance NUNCA modifica código. Apenas avisa e recomenda.

**Quando:** Saída sempre read-only (JSON reports, não diffs).

**Consequência:** Implementação de recomendações é responsabilidade de skill-construtor.

**Exceção:** Pode gerar `.skill-memory/performance-suggestions.json` que o Construtor lê opcionalmente.

---

## SEÇÃO 2: 5 LEIS FORGE v5.0 (Invioláveis)

### LEI-F01: Prioridade Sobre Perfeição

**Aplica-se a:** skill-performance — MVP deve rodar, não ser perfeito.

**Enunciado:** Fase 1 (PRÉ-BUILD) deve ser funcional em 1 semana, mesmo que Fase 2 e 3 existam. Melhor MVP agora do que produto perfeito em 8 semanas.

---

### LEI-F02: Testes Antes de Features

**Aplica-se a:** Toda análise implementada tem teste (unit + integration).

**Enunciado:** Não adicione detector novo sem teste caso que valide (true-positive) E caso que demonstre false-negative não ocorre.

---

### LEI-F03: Documentação Como Código

**Aplica-se a:** Cada feature tem docs atualizada no PRD + CONSTITUTION.

**Enunciado:** Se feature não está documentada, não existe para o usuário.

---

### LEI-F04: Decisões Auditáveis

**Aplica-se a:** Toda decisão técnica vai no decision-log.json.

**Enunciado:** Alguém lendo decision-log em 6 meses consegue entender por que escolhemos Node.js + Lighthouse, não Python + PageSpeed API.

---

### LEI-F05: Appetite é Inviolável

**Aplica-se a:** skill-performance tem appetite L (4 semanas). Não pode expandir.

**Enunciado:** Se escopo crescer (ex: "adiciona suporte Vue.js"), requer nova sessão com Orquestrador + renegociação de appetite.

**Proteção:** Sentinela bloqueia commit se timeline vai além de 4 semanas.

---

## SEÇÃO 3: LEIS DE SEGURANÇA (SEC-01 a SEC-11)

### SEC-03: HttpOnly Cookies (N/A)

**Status:** N/A — skill-performance é CLI, não toca cookies. ✅

---

### SEC-05: Secrets & Environment

**Enunciado:** skill-performance NUNCA loga, armazena ou transmite:
- API keys (Google PageSpeed API key)
- Tokens de acesso
- URLs sensíveis de produção

**Implementação:**
- API key lido de .env local apenas (não committed)
- Relatórios são JSON sem identidade (anônimizados)
- Alertas não enviam dados externos (local storage apenas)

**Compliance:** ✅ LGPD-ready

---

### SEC-08: Dependency Audit

**Enunciado:** skill-performance deve rodar `npm audit` antes de cada release.

**Target:** Zero vulnerabilidades CRITICAL/HIGH no bundle.

---

### SEC-09: BOLA (Broken Object Level Authorization)

**Status:** N/A — skill-performance não toca rotas de API. ✅

---

### SEC-10: Supply Chain

**Enunciado:** Dependências de skill-performance (lighthouse, bundlesize, clinic.js) devem ter > 100k downloads/semana.

**Audit:** npm audit --audit-level=moderate (aceita LOW, rejeita MEDIUM+)

---

### SEC-11: AI-Specific

**Enunciado:** skill-performance não executa código gerado por LLM sem sandbox.

**Implementação:** Análise estática apenas, sem eval() ou execução dinâmica.

---

## SEÇÃO 4: 4 LEIS DE PRODUTO v5.1 (Forge Alignment)

### PRODUTO-01: MVP First

**Enunciado:** Fase 1 (PRÉ-BUILD analyzer) é suficiente para agregar valor. Não adie launch.

---

### PRODUTO-02: Validação Contínua

**Enunciado:** A cada sprint, skill-performance é validada em 1+ projeto real (Arena Truco primeiro).

**Target:** 100% taxa de validação antes de Fase 2.

---

### PRODUTO-03: Métricas Definem Sucesso

**Enunciado:** skill-performance é bem-sucedida se:
1. 8/10 recomendações resultam em melhoria Lighthouse > 5 pontos
2. Análise completa roda em < 2 minutos
3. 9/10 recomendações são actionable (sem ambiguidade)

---

### PRODUTO-04: Roadmap Público

**Enunciado:** Fases 2 e 3 estão documentadas em PRD.md. Dev sabe o que vem.

---

## SEÇÃO 5: PERMISSÕES DO AGENTE (Always/Ask/Never) — 🆕 v5.2

### SEMPRE PODE (sem pedir confirmação)

✅ Criar novos arquivos em:
- `src/` — arquivos TypeScript da skill
- `tests/` — testes unitários + integration
- `docs/` — documentação
- `.skill-memory/` — relatórios, decision-log

✅ Instalar dependências que estão no PRD aprovado
- ex: `npm install lighthouse clinic.js` (estava no PRD)

✅ Rodar sensores:
- TypeScript: `tsc --noEmit`
- ESLint: `eslint src/`
- Jest: `jest`

✅ Ler qualquer arquivo do projeto (read-only)

✅ Atualizar `.skill-memory/working-memory.json` com health score

✅ Registrar decisões em `.skill-memory/decision-log.json`

✅ Executar `git status` e `git diff` (leitura apenas)

---

### PERGUNTAR ANTES ([CONFIRMAR] explícito necessário)

⚠️ Adicionar dependência NÃO listada no PRD
- Justificativa: PRD foi aprovado com stack específica
- Procedimento: Perguntar antes, registrar no decision-log se aprovado

⚠️ Modificar `PRD.md` ou `CONSTITUTION.md`
- Justificativa: Leis e escopo mudam raramente, requer novo ciclo Consultor
- Procedimento: Se mudança necessária, volta para /skill-consultor

⚠️ Deletar qualquer arquivo ou pasta existente
- Justificativa: Pode perder histórico/insights
- Procedimento: Arquivar em `_archived/` em vez de deletar

⚠️ Mudar nome de funções, componentes, classes (refactoring estrutural)
- Justificativa: Pode quebrar importações em outras skills
- Procedimento: Se necessário, fazer após aprovação

⚠️ Criar nova skill dentro de skill-performance
- Justificativa: skill-performance é atômica, não deve gerar sub-skills
- Procedimento: Discussão no Orquestrador

---

### NUNCA PODE (bloqueio absoluto)

❌ Mudar a stack principal aprovada no PRD
- Ex: trocar Node.js por Python
- Consequência: BLOQUEIO IMEDIATO — requer nova sessão Orquestrador

❌ Deletar pastas críticas:
- `src/` (código-fonte)
- `.skill-memory/` (histórico)
- `docs/` (documentação)

❌ Fazer push em git sem aprovação explícita
- Procedimento: sempre avisar "ready to push, approve?"

❌ Remover leis da CONSTITUTION.md
- Consequência: BLOQUEIO IMEDIATO

❌ Ignorar `file_lock_ativo` da Sentinela
- Se Sentinela está auditando, espera (read-only mode)

❌ Alterar decisões aprovadas sem registrar no decision-log
- Toda mudança de direção necessita entrada nova

❌ Deploy em produção sem aprovação de skill-segurança
- skill-performance pode recomendar, mas skill-segurança aprova

---

## SEÇÃO 6: CHECKLIST DE CONFORMIDADE

Antes de cada fase ser considerada "DONE":

### PRÉ-DESENVOLVIMENTO

- [ ] PRD.md está completo (12 seções)
- [ ] CONSTITUTION.md está assinado
- [ ] decision-log.json registra decisões iniciais
- [ ] Appetite L (4 semanas) confirmado
- [ ] Board de especialistas nomeado

### DURANTE DESENVOLVIMENTO (por sprint)

- [ ] TypeScript compila sem erros (`tsc --noEmit`)
- [ ] ESLint passa (`npm run lint`)
- [ ] Testes cobrem nova lógica (`jest` > 80% coverage)
- [ ] Toda nova função tem tipo TypeScript
- [ ] Segurança: nenhuma API key logada
- [ ] Documentação updada no PRD

### PRÉ-RELEASE

- [ ] `npm audit` retorna zero vulnerabilidades CRITICAL/HIGH
- [ ] decision-log.json completado para a fase
- [ ] Validação em 1+ projeto real (Arena Truco)
- [ ] Relatório de validação em .skill-memory/
- [ ] Health score atualizado (working-memory.json)

### PÓS-RELEASE

- [ ] v1.0 ou v1.1 taggado em git
- [ ] Release notes documentadas
- [ ] Feedback coletado (qual feature foi mais útil?)

---

## SEÇÃO 7: GOVERNANÇA & APPROVAL

### Quem Aprova o Quê

| Decisão | Quem Aprova | Procedimento |
|---------|-------------|--------------|
| Escopo feature nova | Orquestrador | Requer nova sessão |
| Stack technology | Consultor + CTO | Matriz decisão |
| Priorização de features | Planner (CPO) | Sprint planning |
| Código implementado | Sentinela (Janela 2) | Auditoria contínua |
| Segurança | skill-segurança | Pré-release audit |
| Deploy em produção | skill-segurança | Final approval |

---

### Escalation Path

```
Dev (você) descobre problema
        ↓
[Se bugno de código] → Construtor corrige, Sentinela valida
        ↓
[Se mudança de escopo] → Orquestrador renegocia appetite
        ↓
[Se decisão arquitetural] → Consultor revê, decision-log atualizado
        ↓
[Se bloqueio de release] → skill-segurança, resolve pré-requisitos
```

---

## SEÇÃO 8: LIFECYCLE & DEPRECATION

### Version Bumping

- **v1.0:** PRÉ-BUILD analyzer funcional, MVP
- **v1.1:** DURANTE BUILD + PRÉ-DEPLOY checks adicionados
- **v2.0:** Monitoramento pós-deploy (Fase 3)
- **v3.0+:** Suporte Vue.js, Angular, Svelte

### Deprecation Policy

Nenhuma lei ou feature é removida sem 2 semanas de aviso prévio no decision-log.

---

## SEÇÃO 9: COMUNICAÇÃO COM DEV

### Daily Standup Template

```
[skill-performance — Daily Update]

Sprint: [X/4]
Health: [X/100]
Bloqueadores: [lista ou "nenhum"]

DONE:
  ✅ [task]
  ✅ [task]

IN PROGRESS:
  🔄 [task]

TODO (próximas 24h):
  ⏳ [task]

Preciso de aprovação para: [item ou "nada"]
```

### Release Template

```
[skill-performance v1.0 — Release]

Fase: PRÉ-BUILD Analyzer
Tempo investido: 160h
Features implementadas: [X]
Bugs encontrados/fixados: [X]

Validação em Arena Truco: ✅ [resultado]

CLI:
  /skill-performance [projeto] --analyze-architecture

Próxima release: [versão + ETA]
```

---

## SEÇÃO 10: REVISÃO & UPDATES

**Esta CONSTITUTION é viva.** Atualizar quando:
- Novas leis necessárias (registrar em decision-log)
- Mudança de appetite (requer Orquestrador)
- Remoção de leis (2 semanas notice + decision-log)

**Próxima revisão:** 2026-05-15 (após 1 mês de operação)

---

## ASSINATURA DE APROVAÇÃO

```
Documento: CONSTITUTION v5.2 — skill-performance
Aprovado por: Board Executivo (CEO, CTO, CPO, CFO, Auditor)
Data aprovação: 2026-04-15
Vigência: até 2026-05-15

Desenvolvedor (você): ✅ ACEITA as leis acima
Próximo passo: /skill-planner (quebrar em tasks)
```

---

**Criado por:** /skill-consultor v5.2  
**LLM:** Opus 4.6  
**Versão:** 5.2.0  
**Data:** 2026-04-15
