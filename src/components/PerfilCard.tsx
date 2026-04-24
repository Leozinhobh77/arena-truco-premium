// ============================================================
// PERFIL CARD — Arena Truco Premium
// Card completo do perfil de um amigo: avatar, status, stats
// ============================================================

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Amigo } from '../types';
import { useStatusLikes } from '../hooks/useStatusLikes';
import { useAuthStore } from '../stores/useAuthStore';

/** Retorna string de tempo relativo humanizada */
function tempoRelativo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'agora mesmo';
  if (min < 60) return `há ${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  return `há ${d} dia${d > 1 ? 's' : ''}`;
}

function StatusDot({ status }: { status: Amigo['statusAmigo'] }) {
  const cor =
    status === 'disponivel' ? '#2dc653'
    : status === 'jogando' ? '#f5a623'
    : 'rgba(255,255,255,0.18)';
  return (
    <div style={{
      width: 14, height: 14, borderRadius: '50%',
      background: cor, border: '2px solid rgba(10,8,30,0.9)',
    }} />
  );
}

interface StatItem {
  label: string;
  value: string | number;
  color: string;
}

interface PerfilCardProps {
  amigo: Amigo;
  /** Callback ao fechar o card (botão ← ou área externa) */
  onClose: () => void;
  /** Callback ao clicar pra ver perfil completo (abre ProfileOverlay) */
  onOpenFullProfile?: () => void;
}

/**
 * Card de perfil completo de um amigo.
 * Exibe: foto, nick, clan, nível, status-msg com timestamp e estatísticas.
 */
export function PerfilCard({ amigo, onClose, onOpenFullProfile }: PerfilCardProps) {
  const { usuario } = useAuthStore();
  const { likesCount, jaDeiLike, loading, toggleLike } = useStatusLikes(amigo.id, usuario?.id);
  const [isLoadingLike, setIsLoadingLike] = useState(false);

  const handleLikeClick = async () => {
    setIsLoadingLike(true);
    await toggleLike();
    setIsLoadingLike(false);
  };

  const winRate = Math.round((amigo.vitorias / Math.max(amigo.partidas, 1)) * 100);

  const statusLabel =
    amigo.statusAmigo === 'disponivel' ? '🟢 Online — disponível'
    : amigo.statusAmigo === 'jogando' ? '🟡 Em partida agora'
    : '⚫ Offline';

  const stats: StatItem[] = [
    { label: 'Win Rate', value: `${winRate}%`, color: '#2dc653' },
    { label: 'Vitórias', value: amigo.vitorias, color: 'var(--text-primary)' },
    { label: 'Partidas', value: amigo.partidas, color: 'var(--text-primary)' },
    { label: 'Ranking', value: `#${amigo.ranking}`, color: 'var(--gold-400)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      style={{
        position: 'absolute', inset: 0, zIndex: 30,
        background: 'linear-gradient(180deg, #0a081e 0%, #120d2e 100%)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 16px 10px', flexShrink: 0,
      }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)', fontSize: 18, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ←
        </motion.button>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 16,
          fontWeight: 700, color: 'var(--text-primary)',
        }}>
          Perfil
        </span>
      </div>

      {/* Avatar + identidade */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '20px 16px 12px',
      }}>
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={onOpenFullProfile}
          style={{
            position: 'relative', marginBottom: 12,
            cursor: onOpenFullProfile ? 'pointer' : 'default',
          }}
        >
          <img
            src={amigo.avatar}
            alt={amigo.nick}
            style={{
              width: 84, height: 84, borderRadius: '50%',
              border: '3px solid var(--gold-400)',
              display: 'block',
            }}
          />
          <div style={{ position: 'absolute', bottom: 2, right: 2 }}>
            <StatusDot status={amigo.statusAmigo} />
          </div>
        </motion.div>

        {/* Nick */}
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 24,
          fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4,
        }}>
          {amigo.nick}
        </div>

        {/* Status de conexão */}
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
          {statusLabel}
        </div>

        {/* Clan */}
        {amigo.clan && (
          <div style={{
            fontSize: 12, color: 'var(--gold-400)', marginBottom: 8,
          }}>
            🏠 {amigo.clan}
          </div>
        )}

        {/* Nível */}
        <span style={{
          fontSize: 11, padding: '3px 12px', borderRadius: 20,
          background: 'rgba(212,160,23,0.15)',
          border: '1px solid rgba(212,160,23,0.3)',
          color: 'var(--gold-400)', fontWeight: 700,
        }}>
          Nível {amigo.nivel}
        </span>
      </div>

      {/* Status message */}
      <div className="glass-card-gold" style={{ margin: '0 16px 14px', padding: '14px 16px' }}>
        <div style={{
          fontSize: 13, color: 'var(--text-primary)',
          fontStyle: 'italic', lineHeight: 1.5, marginBottom: 8,
        }}>
          "{amigo.statusMsg}"
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(212,160,23,0.2)',
        }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            atualizado {tempoRelativo(amigo.statusMsgAtualizada)}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLikeClick}
            disabled={loading || isLoadingLike}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 20,
              background: jaDeiLike ? 'rgba(212,160,23,0.3)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${jaDeiLike ? 'rgba(212,160,23,0.5)' : 'rgba(212,160,23,0.2)'}`,
              color: jaDeiLike ? 'var(--gold-400)' : 'var(--text-secondary)',
              fontSize: 12, fontWeight: 600,
              cursor: loading || isLoadingLike ? 'not-allowed' : 'pointer',
              opacity: loading || isLoadingLike ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            <span>{jaDeiLike ? '❤️' : '🤍'}</span>
            <span>{likesCount}</span>
          </motion.button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="glass-card-gold" style={{ margin: '0 16px 24px', padding: 16 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.09em',
          textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14,
        }}>
          Estatísticas
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
        }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 16,
                fontWeight: 800, color: s.color, lineHeight: 1,
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: 9, color: 'var(--text-muted)',
                marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safe area bottom */}
      <div style={{ height: 'env(safe-area-inset-bottom)', minHeight: 16 }} />
    </motion.div>
  );
}
