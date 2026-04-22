---
name: Codebase Anatomy Blueprint
description: Template para regenerar análises estruturais do Arena Truco Premium
type: analysis-template
version: 1.0
---

# 🏗️ BLUEPRINT — Codebase Anatomy Analysis

**Objetivo:** Servir como template para ANY IA regenerar análises estruturais completas do Arena Truco Premium.

---

## 📋 COMO USAR ESTE BLUEPRINT

### Para uma AI regenerar a análise:

```
Você:    "Gera nova análise de anatomia do Arena Truco"
AI lê:   Este arquivo (BLUEPRINT.md)
AI executa: Os passos abaixo
AI cria: novo [DATA-anatomia-completa.md]
AI atualiza: o HTML + reports.json
```

---

## 🔍 PASSOS PARA REGENERAR ANÁLISE

### PASSO 1: MAPEAR ESTRUTURA
```bash
find src -type f \( -name "*.tsx" -o -name "*.ts" \) \
  ! -path "*/skill-performance/*" \
  ! -path "*/node_modules/*" \
  ! -path "*/dist/*" \
  | while read f; do wc -l "$f"; done | sort -rn
```

**Output esperado:**
- Lista de arquivos com linhas de código
- Ordenado do maior para o menor
- Filtra node_modules, dist, skill-performance

---

### PASSO 2: CALCULAR MÉTRICAS

Para cada arquivo encontrado:
- **LOC** (Lines of Code) — do output do passo 1
- **Categoria** — deduzir de src/ path:
  - `src/screens/*` → Screens
  - `src/components/*` → Components
  - `src/overlays/*` → Overlays
  - `src/stores/*` → State Management
  - `src/hooks/*` → Data Layer
  - `src/lib/*` → Logic/Rules
  - `src/types.ts` → Infrastructure
  - `src/mockData.ts` → Mock Data

**Cálculos:**
```
Total LOC = Σ de todos os LOC
Média por arquivo = Total / número de arquivos
% por categoria = (LOC_categoria / Total LOC) × 100
```

---

### PASSO 3: GERAR VISUALIZAÇÕES

Criar 5 seções de visualização:

#### 3.1 MAPA VISUAL (ASCII Art)
- Mostrar hierarquia: Entry → Screens → Components → Overlays → Stores → Data → Infrastructure
- Colocar LOC ao lado de cada item
- Usar caracteres para "peso" (maior = mais caracteres)

**Padrão:**
```
┌──────────────────────────┐
│   [CAMADA]               │
│                          │
│  • arquivo.tsx  (LOC)    │
│  • arquivo.tsx  (LOC)    │
│                          │
└──────────────────────────┘
```

#### 3.2 TABELA DE MÉTRICAS
```
| Métrica | Valor | Gráfico |
|---------|-------|---------|
| Total LOC | X | ██████ |
| Arquivos | Y | ███ |
| Média | Z | ████ |
```

#### 3.3 DISTRIBUIÇÃO POR CAMADA (barra horizontal)
```
Screens    : 1,646 LOC | ████████░░░░░░░░░░░░ 29.0%
Overlays   : 1,159 LOC | █████░░░░░░░░░░░░░░░ 20.4%
...
```

#### 3.4 FLUXO DE DADOS (ASCII diagram)
```
[App.tsx] ← Router
    ├─→ [useAuthStore]
    ├─→ [useGameStore]
    └─→ [Screens]
        ├─→ [Components]
        └─→ [Overlays]
```

#### 3.5 HEALTH SCORE (1-10)
Avaliar:
- ✅ Separação de responsabilidades
- ✅ Type safety (presença de types)
- ⚠️ Cobertura de testes
- ⚠️ Tamanho de arquivos

**Score = (critério1 + critério2 + ...) / número_critérios**

---

### PASSO 4: GERAR ANÁLISE EM MARKDOWN

Estrutura do arquivo `[DATA]-anatomia-completa.md`:

```markdown
# 📊 ANATOMIA COMPLETA — Arena Truco Premium
**Data:** 2026-04-16
**Versão:** [versão do projeto]
**Total LOC:** X
**Arquivos:** Y

## PARTE 1: MAPA VISUAL
[resultado passo 3.1]

## PARTE 2: MÉTRICAS PROFUNDAS
[resultado passo 3.2 + 3.3]

## PARTE 3: MAPA DE DEPENDÊNCIAS
[resultado passo 3.4]

## PARTE 4: SAÚDE DO CÓDIGO
[resultado passo 3.5 + análise qualitativa]

## PARTE 5: DIAGRAMA VISUAL DE PESO
[gráfico comparativo]

## 🎬 CONCLUSÃO EXECUTIVA
[resumo 1 parágrafo]
```

---

### PASSO 5: ATUALIZAR HTML + JSON

#### 5.1 Atualizar `reports.json`
```json
{
  "reports": [
    {
      "date": "2026-04-16",
      "totalLOC": 5678,
      "totalFiles": 23,
      "healthScore": 7.2,
      "topFile": { "name": "ProfileOverlay.tsx", "loc": 967 },
      "timestamp": "2026-04-16T00:00:00Z"
    },
    {
      "date": "2026-04-23",
      "totalLOC": 5800,
      "totalFiles": 24,
      "healthScore": 7.5,
      "topFile": { "name": "ProfileOverlay.tsx", "loc": 945 },
      "timestamp": "2026-04-23T00:00:00Z"
    }
  ]
}
```

#### 5.2 Atualizar `index.html`
- Ler reports.json
- Popular menu sidebar com datas
- Carregar análise do arquivo `.md` correspondente
- Atualizar gráficos dinamicamente

---

## 📊 COMPARADORES (para 2+ datas)

Quando tiver 2 datas, mostrar:

```
MÉTRICA              | 2026-04-16 | 2026-04-23 | DELTA | TREND
──────────────────────────────────────────────────────────────
Total LOC            | 5,678      | 5,800      | +122  | ↗️ +2.1%
Arquivos             | 23         | 24         | +1    | ↗️ +4.3%
Health Score         | 7.2        | 7.5        | +0.3  | ↗️ Melhorando
Top File             | 967 LOC    | 945 LOC    | -22   | ↘️ Refatorando
ProfileOverlay.tsx   | 967        | 945        | -22   | ↘️ -2.3%
```

---

## 🎓 GLOSSÁRIO (Para leigos)

Manter lista de termos explicados:

| Termo | O que é | Exemplo |
|-------|---------|---------|
| **LOC** | Linhas de Código | `LoginScreen.tsx tem 418 LOC` |
| **TSX** | TypeScript + React | Arquivo que mistura código + HTML |
| **Component** | Peça reutilizável da UI | `Button`, `Card`, `Avatar` |
| **Hook** | Função que "engancha" estado | `useState`, `useEffect`, `useProfileData` |
| **Store** | Local que guarda estado global | `useAuthStore` (quem está logado) |
| **Overlay** | Janela flutuante | `ProfileOverlay` (janela de perfil) |
| **Screen** | Tela inteira | `LoginScreen`, `ArenaScreen` |
| **Zustand** | Biblioteca de estado | Alternativa ao Redux, mais simples |
| **Supabase** | Banco de dados na nuvem | Onde estão os dados (partidas, perfis, etc) |
| **Type Safety** | Garantir tipos corretos | TypeScript avisa se você fez algo errado |

---

## ⚙️ CONFIGURAÇÕES

### Frequência de geração
- **Recomendado:** 1x semana (toda segunda-feira)
- **Ou:** Quando há mudança significativa (5+ arquivos novos)

### Automação futura
```bash
# Rodar toda semana automaticamente
0 9 * * 1 ./generate-anatomy.sh
```

### Alertas
Se alguma métrica muda > 10%, highlight visual no HTML

---

## 🔄 VERSIONAMENTO

Histórico de análises:
- `.anatomia/2026-04-16.md`
- `.anatomia/2026-04-23.md`
- `.anatomia/2026-04-30.md`
- etc...

Menu HTML carrega todas as datas e permite navegação.

---

## ✅ CHECKLIST PARA REGENERAR

Ao criar nova análise, verificar:

- [ ] Arquivo nomeado como `[YYYY-MM-DD]-anatomia-completa.md`
- [ ] Contém todas as 5 partes (Mapa, Métricas, Dependências, Health, Conclusão)
- [ ] LOC total bate com soma dos arquivos
- [ ] Percentuais somam 100%
- [ ] reports.json atualizado com nova entrada
- [ ] index.html reflete a nova data no menu
- [ ] Gráficos são comparativos (se 2+ datas)
- [ ] Glossário atualizado com novos termos
- [ ] Health Score justificado

---

## 🎯 EXEMPLO DE EXECUÇÃO

```
AI: "Detectei que temos agora 24 arquivos (era 23)"
AI: "ProfileOverlay diminuiu para 945 LOC (refatoração detectada!)"
AI: "Criando novo relatório..."
AI: "[ESCRITA] 2026-04-23-anatomia-completa.md"
AI: "[UPDATE] reports.json com nova entrada"
AI: "[UPDATE] index.html menu"
AI: "✅ Análise 2026-04-23 gerada com sucesso!"
AI: "📊 Comparação automática: LOC ↗️ +2.1% | Health ↗️ +0.3"
```

---

## 📞 SUPORTE

Se tiver dúvida ao regenerar:
1. Releia este arquivo
2. Verifique exemplo em `2026-04-16-anatomia-completa.md`
3. Rode os comandos do PASSO 1 manualmente
4. Copie a estrutura mas adapte os números

---

**Criado em:** 2026-04-16  
**Próxima análise sugerida:** 2026-04-23  
**Mantido por:** Agente Forge v5.2
