// ============================================================
// ARENA MENU OVERLAY — Arena Truco Premium
// Laboratório de testes — espaço vazio para experimentos
// ============================================================

import { motion } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';

// ── MAIN OVERLAY ─────────────────────────────────────────────
export function ArenaMenuOverlay() {
  const { popOverlay } = useNavigationStore();

  return (
    <div className="overlay" style={{ alignItems: 'stretch' }}>
      <div className="overlay-backdrop" onClick={popOverlay} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        className="modal-sheet"
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
        {/* Handle */}
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
            🏟️ Arena Truco 3D
          </h2>
        </div>

        {/* Conteúdo — Laboratório de Testes (vazio) */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}>
            🧪 Laboratório de Testes
          </div>
        </div>

        {/* Rodapé */}
        <div style={{
          padding: '12px 16px 16px',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          flexShrink: 0,
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <button
            onClick={popOverlay}
            className="btn-secondary"
            style={{ width: '100%', padding: '10px 16px', fontSize: 13 }}
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
