// ============================================================
// TELA DE LOGIN — LoginScreen.tsx
// Experiência de Login Premium Nível Apple
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';

// Partículas flutuantes de fundo
function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 5 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: Math.random() * 4 + 5,
    color: i % 3 === 0 ? 'var(--gold-400)' : i % 3 === 1 ? 'var(--ruby)' : 'var(--lavender)',
  }));

  return (
    <div className="particles-bg">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: '-10px',
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// Anel giratório
function OrbitRing({ radius, duration, children }: { radius: number; duration: number; children: React.ReactNode }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: radius * 2,
        height: radius * 2,
        borderRadius: '50%',
        border: '1px solid rgba(212,160,23,0.15)',
        top: '50%',
        left: '50%',
        marginTop: -radius,
        marginLeft: -radius,
      }}
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      {children}
    </motion.div>
  );
}

export function LoginScreen() {
  const [nick, setNick] = useState('');
  const [fase, setFase] = useState<'intro' | 'form' | 'loading'>('intro');
  const { loginSimulado, carregando } = useAuthStore();

  const handleEntrar = async () => {
    if (!nick.trim()) return;
    setFase('loading');
    await loginSimulado(nick.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEntrar();
  };

  return (
    <div className="login-screen" style={{ background: 'var(--obsidian-900)' }}>
      <Particles />

      {/* Aneis orbitais */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
        <OrbitRing radius={160} duration={20}>
          <div style={{ position: 'absolute', top: -4, left: '50%', marginLeft: -4, width: 8, height: 8, borderRadius: '50%', background: 'var(--gold-400)', boxShadow: '0 0 10px var(--gold-400)' }} />
        </OrbitRing>
        <OrbitRing radius={220} duration={30}>
          <div style={{ position: 'absolute', bottom: -3, left: '50%', marginLeft: -3, width: 6, height: 6, borderRadius: '50%', background: 'var(--ruby)', boxShadow: '0 0 8px var(--ruby)' }} />
        </OrbitRing>
        <OrbitRing radius={280} duration={45}>
          <div style={{ position: 'absolute', top: '30%', right: -3, width: 6, height: 6, borderRadius: '50%', background: 'var(--lavender)', boxShadow: '0 0 8px var(--lavender)' }} />
        </OrbitRing>
      </div>

      {/* Conteúdo Central */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, padding: '0 24px' }}>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          style={{ textAlign: 'center' }}
        >
          {/* Ícone gigante */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: 80, lineHeight: 1, marginBottom: 16 }}
            className="arena-logo-glow"
          >
            🃏
          </motion.div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 38,
            fontWeight: 900,
            color: 'var(--gold-400)',
            margin: 0,
            letterSpacing: '-0.03em',
            textShadow: '0 0 30px rgba(212,160,23,0.5)',
          }}>
            ARENA TRUCO
          </h1>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-muted)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            margin: '6px 0 0',
          }}>
            Premium · Obsidian & Gold
          </p>
        </motion.div>

        {/* Formulário */}
        <AnimatePresence mode="wait">
          {fase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <button className="btn-primary animate-pulse-gold" onClick={() => setFase('form')}>
                ENTRAR NA ARENA
              </button>
              <button className="btn-secondary">
                Criar Conta
              </button>
            </motion.div>
          )}

          {(fase === 'form') && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 20, pointerEvents: 'none'
                }}>🎮</span>
                <input
                  className="input-field"
                  style={{ paddingLeft: 48 }}
                  placeholder="Seu nick de truqueiro..."
                  value={nick}
                  onChange={e => setNick(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={20}
                  autoFocus
                />
              </div>

              <button
                className="btn-primary"
                onClick={handleEntrar}
                disabled={!nick.trim() || carregando}
                style={{ opacity: nick.trim() ? 1 : 0.4 }}
              >
                ENTRAR 🃏
              </button>

              <button
                className="btn-secondary"
                onClick={() => setFase('intro')}
              >
                ← Voltar
              </button>
            </motion.div>
          )}

          {fase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
            >
              {/* Spinner dourado */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  border: '3px solid rgba(212,160,23,0.2)',
                  borderTop: '3px solid var(--gold-400)',
                  boxShadow: '0 0 20px rgba(212, 160, 23, 0.3)',
                }}
              />
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 15,
                color: 'var(--gold-400)',
                letterSpacing: '0.1em',
                animation: 'glow-pulse 1s ease-in-out infinite',
              }}>
                Entrando na Arena...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rodapé */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}
        >
          Agente Forge v4.0 · Experiência Nível Apple
        </motion.p>
      </div>
    </div>
  );
}
