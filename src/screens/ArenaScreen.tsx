// ============================================================
// TELA ARENA (Hub Central) — ArenaScreen.tsx
// Perfil, Recursos, Botão Jogar
// ============================================================

import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigationStore } from '../stores/useNavigationStore';

// Componente de barra XP circular em SVG
function CircularXP({ xp, max, nivel }: { xp: number; max: number; nivel: number }) {
  const pct = Math.min(xp / max, 1);
  const r = 40;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ * (1 - pct);

  return (
    <div style={{ position: 'relative', width: 96, height: 96 }}>
      <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1.2s ease' }}
        />
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f5c518" />
            <stop offset="100%" stopColor="#d4a017" />
          </linearGradient>
        </defs>
      </svg>
      {/* Nível no centro */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: 'var(--gold-400)', lineHeight: 1 }}>{nivel}</span>
        <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Lv</span>
      </div>
    </div>
  );
}

// Carta virada para baixo decorativa
function CardBack({ delay = 0, rotate = 0 }: { delay?: number; rotate?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      style={{
        width: 52,
        height: 78,
        borderRadius: 8,
        background: 'linear-gradient(135deg, #1a1040 0%, #0f0f1a 100%)',
        border: '1.5px solid var(--border-gold)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        color: 'var(--gold-400)',
        opacity: 0.7,
        transform: `rotate(${rotate}deg)`,
        boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
        flexShrink: 0,
      }}
    >
      ♠
    </motion.div>
  );
}

export function ArenaScreen() {
  const { usuario } = useAuthStore();
  const { pushOverlay } = useNavigationStore();

  if (!usuario) return null;

  const winRate = Math.round((usuario.vitorias / Math.max(usuario.partidas, 1)) * 100);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Fundo gradiente radial */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 20%, rgba(123,45,139,0.25) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* HEADER — Recursos e Config */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px 8px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Moedas e Gemas */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="resource-pill">
            <span>🪙</span>
            <span>{usuario.moedas.toLocaleString('pt-BR')}</span>
          </div>
          <div className="resource-pill">
            <span>💎</span>
            <span>{usuario.gemas}</span>
          </div>
        </div>

        {/* Configurações */}
        <button
          onClick={() => pushOverlay('configuracoes')}
          style={{
            width: 40, height: 40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid var(--border-subtle)',
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ⚙️
        </button>
      </motion.div>

      {/* PERFIL DO JOGADOR */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="glass-card-gold"
        style={{
          margin: '8px 16px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexShrink: 0,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Avatar + XP Ring */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <CircularXP xp={usuario.xp} max={usuario.xpProximoNivel} nivel={usuario.nivel} />
          <img
            src={usuario.avatar}
            alt={usuario.nick}
            className="avatar"
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 60, height: 60,
            }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 800,
              color: 'var(--text-primary)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {usuario.nick}
            </span>
            {usuario.clan && (
              <span className="chip chip-gold">🏠 {usuario.clan.split(' ')[0]}</span>
            )}
          </div>

          {/* Stats compactos */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--emerald)' }}>{winRate}%</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Win Rate</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{usuario.vitorias}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Vitórias</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--gold-400)' }}>#{usuario.ranking}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ranking</div>
            </div>
          </div>

          {/* Barra XP linear */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>XP {usuario.xp.toLocaleString('pt-BR')}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{usuario.xpProximoNivel.toLocaleString('pt-BR')}</span>
            </div>
            <div className="xp-bar-track">
              <motion.div
                className="xp-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(usuario.xp / usuario.xpProximoNivel) * 100}%` }}
                transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ARENA CENTRAL — Logo Flutuante */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Halo de fundo */}
        <div style={{
          position: 'absolute',
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,160,23,0.12) 0%, transparent 70%)',
          animation: 'glow-pulse 3s ease-in-out infinite',
        }} />

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ textAlign: 'center', position: 'relative' }}
        >
          <div className="arena-logo-glow" style={{ fontSize: 72, lineHeight: 1, marginBottom: 8 }}>🃏</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            fontWeight: 900,
            color: 'var(--gold-400)',
            letterSpacing: '-0.02em',
            textShadow: '0 0 20px rgba(212,160,23,0.4)',
          }}>
            ARENA TRUCO
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 11,
            color: 'var(--text-muted)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginTop: 4,
          }}>
            Premium
          </div>
        </motion.div>
      </div>

      {/* RODAPÉ — Cartas decorativas + CTA JOGAR */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          padding: '0 16px 16px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* 3 cartas viradas para baixo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: 12,
          marginBottom: 16,
        }}>
          <CardBack delay={0.4} rotate={-8} />
          <CardBack delay={0.5} rotate={0} />
          <CardBack delay={0.6} rotate={8} />
        </div>

        {/* BOTÃO JOGAR */}
        <motion.button
          className="btn-primary animate-pulse-gold"
          onClick={() => pushOverlay('salas')}
          whileTap={{ scale: 0.96 }}
          style={{ fontSize: 22, padding: '18px 32px', letterSpacing: '0.1em' }}
        >
          ⚔️ &nbsp; JOGAR
        </motion.button>

        {/* Sub-ação */}
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button
            className="btn-secondary"
            style={{ flex: 1, fontSize: 13 }}
            onClick={() => pushOverlay('salas')}
          >
            🎯 Salas Online
          </button>
          <button
            className="btn-secondary"
            style={{ flex: 1, fontSize: 13 }}
            onClick={() => pushOverlay('jogo')}
          >
            🤖 vs Bot
          </button>
        </div>
      </motion.div>
    </div>
  );
}
