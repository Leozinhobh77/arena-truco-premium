// ============================================================
// ARENA MENU OVERLAY — Arena Truco Premium
// Visualização de teste da Arena em perspectiva drone
// ============================================================

import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';

// Lazy import: Three.js (~350KB gzip) só carrega quando este overlay abre
const Arena3D = lazy(() => import('../components/Arena3D').then(m => ({ default: m.Arena3D })));

function Arena3DFallback() {
  return (
    <div style={{
      width: '100%', height: '100%', minHeight: 300,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 12, background: 'linear-gradient(135deg, #0a0a14 0%, #1a1a2e 100%)',
      borderRadius: 12,
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid rgba(212,160,23,0.2)',
          borderTop: '3px solid var(--gold-400)',
        }}
      />
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Carregando Arena 3D...</span>
    </div>
  );
}

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

        {/* Conteúdo — Renderização 3D */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <div style={{
            flex: 1,
            borderRadius: 12,
            border: '1px solid rgba(255,180,0,0.2)',
            overflow: 'hidden',
          }}>
            <Suspense fallback={<Arena3DFallback />}>
              <Arena3D />
            </Suspense>
          </div>

          <div style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            textAlign: 'center',
            padding: '0 8px',
            lineHeight: 1.5,
          }}>
            Renderização 3D realista · Iluminação dramática · Marca Arena Truco
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
