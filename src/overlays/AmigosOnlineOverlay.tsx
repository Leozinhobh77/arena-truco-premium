// ============================================================
// AMIGOS ONLINE OVERLAY — Arena Truco Premium
// Bottom sheet: lista de amigos online, jogando e offline
// Mesmo padrão visual que SalasOverlay
// ============================================================

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useAmigosRanking } from '../hooks/useProfileData';
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
function AmigoCard({ amigo, onSelect, onConvidar }: {
  amigo: Amigo;
  onSelect: (a: Amigo) => void;
  onConvidar: (a: Amigo) => void;
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
          {subTexto}
        </div>
      </div>

      {/* Botão ou chevron */}
      {amigo.statusAmigo === 'disponivel' && (
        <button
          className="btn-secondary"
          style={{ padding: '5px 10px', fontSize: 11, flexShrink: 0 }}
          onClick={(e) => { e.stopPropagation(); onConvidar(amigo); }}
        >
          Convidar
        </button>
      )}
      {amigo.statusAmigo === 'jogando' && (
        <span style={{ color: 'var(--text-muted)', fontSize: 16, flexShrink: 0 }}>›</span>
      )}
    </motion.div>
  );
}

// ── AmigosOnlineOverlay (main) ────────────────────────────────
export function AmigosOnlineOverlay() {
  const { popOverlay, pushOverlay } = useNavigationStore();
  const [search, setSearch] = useState('');
  const { usuario } = useAuthStore();
  const { amigos } = useAmigosRanking(usuario?.id);

  const filtrados = useMemo(() => {
    if (!search.trim()) return amigos;
    const q = search.toLowerCase();
    return amigos.filter(a =>
      a.nick.toLowerCase().includes(q) || a.nome.toLowerCase().includes(q)
    );
  }, [search, amigos]);

  const disponivel = filtrados.filter(a => a.statusAmigo === 'disponivel');
  const jogando = filtrados.filter(a => a.statusAmigo === 'jogando');
  const offline = filtrados.filter(a => a.statusAmigo === 'offline');

  const totalOnline = amigos.filter(a => a.statusAmigo !== 'offline').length;

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

        {/* Busca */}
        <div style={{ padding: '10px 16px', flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)', fontSize: 15, opacity: 0.4,
              pointerEvents: 'none',
            }}>
              🔍
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar amigo..."
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10, color: 'var(--text-primary)',
                fontSize: 13, padding: '8px 12px 8px 36px',
                fontFamily: 'inherit', outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Lista */}
        <div className="list-container" style={{ flex: 1, padding: '0 16px 16px' }}>
          {disponivel.length > 0 && (
            <>
              <div style={{
                fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700,
                marginBottom: 8, marginTop: 8, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--emerald)',
              }}>
                🟢 Disponíveis ({disponivel.length})
              </div>
              {disponivel.map(a => (
                <AmigoCard key={a.id} amigo={a} onSelect={a => pushOverlay('friend-action', { amigo: a })} onConvidar={a => pushOverlay('friend-action', { amigo: a })} />
              ))}
            </>
          )}

          {jogando.length > 0 && (
            <>
              <div style={{
                fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700,
                marginBottom: 8, marginTop: 10, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--ruby)',
              }}>
                🟡 Jogando ({jogando.length})
              </div>
              {jogando.map(a => (
                <AmigoCard key={a.id} amigo={a} onSelect={a => pushOverlay('friend-action', { amigo: a })} onConvidar={a => pushOverlay('friend-action', { amigo: a })} />
              ))}
            </>
          )}

          {offline.length > 0 && (
            <>
              <div style={{
                fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700,
                marginBottom: 8, marginTop: 10, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--text-muted)',
              }}>
                ⚫ Offline ({offline.length})
              </div>
              {offline.map(a => (
                <AmigoCard key={a.id} amigo={a} onSelect={() => {}} onConvidar={() => {}} />
              ))}
            </>
          )}

          {filtrados.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
              Nenhum amigo encontrado
            </div>
          )}
        </div>
      </motion.div>

    </div>
  );
}
