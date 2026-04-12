# AI_CONTEXT — Arena Truco Premium
**Forge v4.0 Titan** | Stack: React/Vite/Tailwind v4 | Fase: Pré-desenvolvimento

## Estado Atual
- Skill ativa: skill-consultor (próxima a ser executada)
- Sentinela: INATIVA (ativar na Janela 2 ao iniciar /skill-construtor)
- Health Score: 20/100

## Arquitetura de Memória
- Core Memory: .skill-memory/working-memory.json (3KB — ler sempre primeiro)
- Sprint Journal: .skill-memory/sprint-journal.json (histórico comprimido)
- Sentinela Channel: .skill-memory/sentinela-channel.json (canal de auditoria)
- Bug-DNA Global: ../../.forge/forge-knowledge-base.json

## Pipeline SDD (Ordem Obrigatória)
1. /skill-inicializador ✅ CONCLUÍDO
2. /skill-consultor ← PRÓXIMO
3. /skill-planner
4. /skill-documentador
5. /skill-construtor (+ /skill-sentinela em Janela 2)
6. /skill-forge-visual
