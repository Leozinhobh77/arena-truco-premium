// ============================================================
// AMIGOS ONLINE OVERLAY — Arena Truco Premium
// Bottom sheet: lista de amigos online, jogando e offline
// Mesmo padrão visual que SalasOverlay
// ============================================================

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useAmigosRealtime } from '../hooks/useAmigosRealtime';
import type { Amigo } from '../types';

// ── Helpers ──────────────────────────────────────────────────
function modoLabel(modo?: string): string {
  if (!modo) return '';
  return modo === 'paulista' ? 'Paulista' : 'Mineiro';
}

function StatusDot({ status, size = 10 }: { status: Amigo['statusAmigo']; size?: number }) {
  const cor =
    status === 'disponivel' ? '#2dc653'
    : status === 'jogando' ? '#f5a623'
    : 'rgba(255,255,255,0.18)';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: cor, border: '2px solid rgba(10,8,30,0.9)',
      flexShrink: 0,
    }} />
  );
}

// ── AmigoCard ────────────────────────────────────────────────
function AmigoCard({ amigo, onSelect }: {
  amigo: Amigo;
  onSelect: (a: Amigo) => void;
}) {
  const isOffline = amigo.statusAmigo === 'offline';

  const subTexto = useMemo(() => {
    if (amigo.statusAmigo === 'jogando') return `Truco ${modoLabel(amigo.modoJogo)} • há ${amigo.tempoJogandoMin}min`;
    if (amigo.statusAmigo === 'disponivel') return 'Disponível para jogar';
    return 'Offline';
  }, [amigo.statusAmigo, amigo.modoJogo, amigo.tempoJogandoMin]);

  const borderColor =
    amigo.statusAmigo === 'disponivel' ? '#2dc653'
    : amigo.statusAmigo === 'jogando' ? '#f5a623'
    : 'rgba(255,255,255,0.1)';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 0',
        cursor: isOffline ? 'default' : 'pointer',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        opacity: isOffline ? 0.65 : 1,
      }}
      whileTap={isOffline ? undefined : { opacity: 0.75 }}
      onClick={() => !isOffline && onSelect(amigo)}
    >
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img
          src={amigo.avatar}
          alt={amigo.nick}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            border: `2px solid ${borderColor}`,
            display: 'block',
          }}
        />
        <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
          <StatusDot status={amigo.statusAmigo} />
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
          color: isOffline ? 'var(--text-muted)' : 'var(--text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          marginBottom: 2,
        }}>
          {amigo.nick}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {amigo.ultimaAtividade || subTexto}
        </div>
      </div>

      {/* Ícone conforme status */}
      {amigo.statusAmigo === 'jogando' && (
        <span style={{ color: 'var(--gold-400)', fontSize: 16, flexShrink: 0, position: 'relative' }}>
          👁️
          {/* Espaço para contador de espectadores será adicionado depois */}
        </span>
      )}
      {amigo.statusAmigo !== 'offline' && (
        <span style={{ color: 'var(--text-muted)', fontSize: 16, flexShrink: 0 }}>›</span>
      )}
    </motion.div>
  );
}

// ── AmigosOnlineOverlay (main) ────────────────────────────────
export function AmigosOnlineOverlay() {
  const { popOverlay, pushOverlay } = useNavigationStore();
  const { usuario } = useAuthStore();
  const { amigos, totalOnline, loading } = useAmigosRealtime(usuario?.id);

  const disponivel = useMemo(() => amigos.filter(a => a.statusAmigo === 'disponivel'), [amigos]);
  const jogando = useMemo(() => amigos.filter(a => a.statusAmigo === 'jogando'), [amigos]);
  const offline = useMemo(() => amigos.filter(a => a.statusAmigo === 'offline'), [amigos]);

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
            👥 Amigos Online
          </h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{
              fontSize: 11,
              color: 'var(--emerald)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              background: 'rgba(45,198,83,0.1)',
              padding: '3px 10px',
              borderRadius: 20,
              border: '1px solid rgba(45,198,83,0.25)',
            }}>
              {totalOnline > 99 ? '+99' : totalOnline} online
            </span>
            <button
              onClick={popOverlay}
              style={{
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
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Lista */}
        <div className="list-container" style={{ flex: 1, padding: '0 16px 16px', overflow: 'auto' }}>
          {loading && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              minHeight: '200px',
            }}>
              <div style={{ fontSize: 24 }}>⏳</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Carregando amigos...</div>
            </div>
          )}

          {!loading && (
            <AnimatePresence mode="wait">
              {disponivel.length > 0 && (
                <motion.div
                  key="disponivel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div style={{
                    fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700,
                    marginBottom: 8, marginTop: 8, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: 'var(--emerald)',
                  }}>
                    🟢 Disponíveis ({disponivel.length})
                  </div>
                  {disponivel.map(a => (
                    <AmigoCard
                      key={a.id}
                      amigo={a}
                      onSelect={a => pushOverlay('friend-action', { amigo: a, status: 'disponivel' })}
                    />
                  ))}
                </motion.div>
              )}

              {jogando.length > 0 && (
                <motion.div
                  key="jogando"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div style={{
                    fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700,
                    marginBottom: 8, marginTop: 10, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: 'var(--ruby)',
                  }}>
                    🟡 Jogando ({jogando.length})
                  </div>
                  {jogando.map(a => (
                    <AmigoCard
                      key={a.id}
                      amigo={a}
                      onSelect={a => pushOverlay('friend-action', { amigo: a, status: 'jogando' })}
                    />
                  ))}
                </motion.div>
              )}

              {offline.length > 0 && (
                <motion.div
                  key="offline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div style={{
                    fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700,
                    marginBottom: 8, marginTop: 10, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: 'var(--text-muted)',
                  }}>
                    ⚫ Offline ({offline.length})
                  </div>
                  {offline.map(a => (
                    <AmigoCard
                      key={a.id}
                      amigo={a}
                      onSelect={a => pushOverlay('friend-action', { amigo: a, status: 'offline' })}
                    />
                  ))}
                </motion.div>
              )}

              {!loading && amigos.length === 0 && (
                <motion.div
                  key="vazio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}
                >
                  <div style={{ fontSize: 24, marginBottom: 12 }}>👥</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Nenhum amigo ainda</div>
                  <div style={{ fontSize: 11 }}>Adicione amigos para vê-los aqui</div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>

    </div>
  );
}
