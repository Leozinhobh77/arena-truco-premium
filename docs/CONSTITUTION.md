# Constitution: Arena Truco Premium (v2.0)

Este documento define as **28 Leis Invioláveis** que regem o desenvolvimento, a ética e a estabilidade técnica deste projeto. Nenhuma funcionalidade deve ser implementada se violar qualquer uma destas leis.

---

## 🏛️ Camada 1: Leis Fundamentais (Agente Forge Standard)

1.  **Pipeline SDD Obrigatória:** O fluxo PRD → SPEC → PLAN → Código é mandatório. Pular etapas é falha crítica.
2.  **Memória Hierárquica L1:** O arquivo `working-memory.json` deve ser mantido abaixo de 5KB para eficiência de contexto.
3.  **Memória Hierárquica L2:** Logs de Sprints devem ser comprimidos no `sprint-journal.json` após cada conclusão.
4.  **Imutabilidade do Histórico:** Tasks concluídas e logs de bugs nunca devem ser apagados; apenas arquivados ou comprimidos.
5.  **Auditória Sentinela (T2):** Todo código produzido pelo Construtor deve ser validado pela lógica da Sentinela em terminal paralelo.
6.  **Timestamp Universal:** Todos os registros temporais (logs, saves) devem usar o formato ISO 8601.
7.  **Transparência de Metadados:** Cada arquivo deve conter sua "genealogia" em `forge-docs.json`.
8.  **Segurança de Dados:** Nunca registrar ou persistir dados sensíveis sem confirmação explícita do usuário.
9.  **Código Auto-Documentado:** Comentários JSDoc são obrigatórios para toda função de lógica de negócio ou motor de jogo.
10. **Resiliência de Contexto:** Em caso de perda de conexão, o sistema deve ser capaz de retomar exatamente da última task via `working-memory.json`.

---

## ⚙️ Camada 2: Leis Técnicas (Titan Engine)

11. **Strict TypeScript:** O `tsconfig` deve manter `strict: true`. Erros de tipagem barram o build imediatamente.
12. **React 19 Clean Architecture:** Uso obrigatório de Hooks modernos e isolamento total entre lógica (Rules) e visual (Components).
13. **Zustand Atomic Stores:** O estado global deve ser dividido em stores atômicas para evitar re-renderizações desnecessárias.
14. **Performance 60FPS:** Animações complexas (Framer Motion) devem ser otimizadas para não degradar a experiência em dispositivos mobile.
15. **Offline-First Ready:** Toda a lógica de jogo (Rules) deve funcionar 100% no cliente, independente de conexão externa.
16. **TDD em Lógica Core:** O motor de regras (`rules.ts`) deve possuir cobertura de testes unitários mínima de 90%.
17. **Isolated Modules (Vite):** Todo import de tipos deve usar explicitamente `import type`.
18. **Utility-First Design:** Proibido o uso de CSS Inline. Todo estilo deve ser via Tailwind v4 ou classes declaradas no `index.css`.
19. **Mobile Safe-Area:** Headers e Footers devem obrigatoriamente respeitar `env(safe-area-inset-top/bottom)` para notch/gestos.
20. **Zero Placeholders:** Proibido o uso de componentes "mock" vazios. Todo componente deve ter feedback visual de carregamento ou erro.

---

## 💎 Camada 3: Leis de Negócio & UX (Obsidian & Gold)

21. **Apple Level Experience:** A navegação deve ser fluida (Swipe/Gestos), nunca utilizando recarregamentos de página (SPA Real).
22. **Inviolabilidade do Baralho:** O motor de cartas deve garantir a aleatoriedade e integridade total. Cartas não podem ser duplicadas na mesa.
23. **Hegemonia Dark Mode:** O tema "Obsidian & Gold" é a identidade única. Temas claros são terminantemente proibidos.
24. **IA como Parceiro (Gemini):** Bots não devem ser meros oponentes, mas devem interagir com falas táticas via Prompt Engineering.
25. **Feedback Tátil Visual:** Toda ação de toque (Cards, Botões) deve ter uma resposta visual instantânea de escala ou brilho.
26. **Hierarquia de Cores:** `Gold` para vitória/CTA, `Red` para adversários, `Blue` para aliados, `Purple` para IA.
27. **Acessibilidade WCAG AA:** Contrastes de texto devem seguir o padrão de acessibilidade, mesmo sob o tema escuro.
28. **Modo "Zen" de Jogo:** A interface de jogo deve ser limpa. Elementos de lobby (Loja, Clãs) não devem poluir a visão da mesa.

---
**Data de Promulgação:** 2026-04-12  
**Versão:** 2.0 (Titan Ready)
