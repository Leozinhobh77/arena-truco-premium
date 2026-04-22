# Design & Architecture Patterns — Arena Truco Premium

**Versão:** 1.0 | **Data:** 2026-04-15 | **Criado por:** Sprint-A Amigos Online

Guia de padrões visuais e arquiteturais para manter **consistência visual e arquitetural** ao longo do desenvolvimento.

---

## 🎨 Padrão: Overlays (Modal Sheets)

### Quando usar
- Bottom sheets: listas, seleções, ações secundárias
- Exemplos: SalasOverlay, AmigosOnlineOverlay

### Estrutura CORRETA

```tsx
import { motion } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';

export function MeuOverlay() {
  const { popOverlay } = useNavigationStore();

  return (
    <div className="overlay">                    {/* ← USE ESTA CLASSE */}
      <div className="overlay-backdrop" onClick={popOverlay} />  {/* ← Backdrop padrão */}
      
      <motion.div
        initial={{ y: '100%' }}                 {/* ← Sempre começa embaixo */}
        animate={{ y: 0 }}                      {/* ← Sobe para o topo */}
        exit={{ y: '100%' }}                    {/* ← Sai para baixo */}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        className="modal-sheet"                 {/* ← USE ESTA CLASSE */}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          background: 'var(--obsidian-700)',
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto auto 0',
        }}
      >
        {/* Handle (ganchinho visual) */}
        <div style={{
          width: 36, height: 4,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 2,
          margin: '12px auto 0',
          flexShrink: 0,
        }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px 10px',
          paddingTop: 'max(14px, env(safe-area-inset-top))',
          flexShrink: 0,
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 900,
            color: 'var(--text-primary)',
            margin: 0,
          }}>
            🎯 Título do Overlay
          </h2>
          <button onClick={popOverlay} style={{
            background: 'rgba(255,255,255,0.07)',
            border: 'none',
            width: 32, height: 32,
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: 16,
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            ✕
          </button>
        </div>

        {/* Conteúdo (list-container para scroll) */}
        <div className="list-container" style={{ flex: 1, padding: '0 16px 16px' }}>
          {/* Itens aqui */}
        </div>

        {/* Ação principal (footer) */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
          <button className="btn-primary" style={{ fontSize: 16, padding: '14px 24px', width: '100%' }}>
            Ação Principal
          </button>
        </div>
      </motion.div>
    </div>
  );
}
```

### O QUE NÃO FAZER ❌

```tsx
// ❌ ERRADO: position: fixed ou absolute genérico
<motion.div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>

// ❌ ERRADO: renderizar tudo no mesmo container
<div>
  <Header />
  <Lista />
  <Modal1 />
  <Modal2 />
</div>

// ❌ ERRADO: criar backdrop do zero
<div style={{ position: 'fixed', background: 'rgba(0,0,0,0.5)' }} />
```

### Animação Padrão
- **Type:** `spring`
- **Damping:** 26
- **Stiffness:** 280
- **Direction:** Y axis (y: '100%' → y: 0)

---

## 🏗️ Padrão: Componentes Reutilizáveis

### Quando extrair em arquivo separado

Componente merece arquivo próprio se:
1. **Reusável em múltiplos lugares** — ex: PerfilCard (usado em overlay, pode ser usado em outras telas)
2. **Lógica complexa** — ex: GameOverlay (lógica de jogo, muitos handlers)
3. **Mais de 150 linhas** — separar mantém legibilidade

### Quando manter inline

Mantenha inline (mesmo arquivo) se:
1. **Usado apenas uma vez** — ex: AmigoCard (só em AmigosOnlineOverlay)
2. **Menos de 100 linhas** — ex: StatusDot helper
3. **Tightly coupled** — ex: modals que só abrem dentro de um overlay

---

## 🎯 Padrão: Separação de Conceitos

### Estrutura de um Overlay Completo

```
AmigosOnlineOverlay.tsx (arquivo único)
├── Helpers (funções puras)
│   ├── modoLabel()
│   └── StatusDot() {componente pequeno}
│
├── Componentes internos
│   ├── AmigoCard() {renderiza 1 amigo}
│   └── ActionSheet() {sub-overlay dentro}
│
└── AmigosOnlineOverlay() {main, gerencia estado}
    └── renderiza: overlay → backdrop → modal-sheet → lista → sub-overlays
```

**Regra:** Se um componente interno precisa de muita lógica própria, extraia para arquivo separado.

---

## 📋 Checklist: Novo Overlay

Ao criar novo overlay, siga:

- [ ] Usa `<div className="overlay">` + `overlay-backdrop` + `modal-sheet`
- [ ] Animação spring com damping: 26, stiffness: 280
- [ ] Header com título (h2) + botão fechar (✕)
- [ ] Conteúdo em `<div className="list-container">`
- [ ] CTA principal em footer (section com borderTop)
- [ ] Handle visual no topo (ganchinho)
- [ ] `popOverlay()` para fechar
- [ ] Estilos reutilizam classes CSS existentes (não inline genérico)
- [ ] Safe areas respeitadas: `env(safe-area-inset-*)`
- [ ] AnimatePresence para sub-overlays

---

## 🎨 Tokens CSS Reutilizáveis

**Sempre use essas variáveis:**

```css
--obsidian-700        /* Background padrão de overlay */
--text-primary        /* Texto principal */
--text-secondary      /* Texto secundário */
--text-muted          /* Texto desabilitado/placeholder */
--border-subtle       /* Bordas leves */
--border-gold         /* Destaque */
--gold-400            /* Cor CTA/highlight */
--emerald             /* Sucesso/online */
--ruby                /* Erro/ativo */
--font-display        /* Font para títulos */
```

---

## 💭 Decisões Arquiteturais

| Decisão | Razão | Exemplo |
|---------|-------|---------|
| Padrão CSS de overlay | Consistência visual, menor code | SalasOverlay, AmigosOnlineOverlay |
| Componentes reutilizáveis separados | DRY, testabilidade | PerfilCard.tsx |
| Componentes inline se <100 linhas | Mantém código coeso | AmigoCard dentro de AmigosOnlineOverlay |
| Bottom sheet vs full-screen | Mobile first, UX melhor | Nenhum overlay ocupa a tela inteira |
| AnimatePresence para sub-overlays | Transições suaves | ActionSheet dentro de AmigosOnlineOverlay |

---

## 🚀 Como Expandir

Quando adicionar **novas telas/overlays**:

1. **Copie a estrutura** de SalasOverlay ou AmigosOnlineOverlay
2. **Mantenha as classes CSS** (overlay, modal-sheet, list-container)
3. **Use os mesmos tokens** (--obsidian-700, var(--gold-400), etc)
4. **Respeite safe areas** para iOS/Android notch

**Resultado:** Visual e comportamento **consistentes** em todo o app.

---

**Última atualização:** 2026-04-15 | Sprint-A: Amigos Online
