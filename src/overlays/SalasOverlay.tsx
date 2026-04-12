// ============================================================
// OVERLAY: LISTA DE SALAS — SalasOverlay.tsx
// Lobby com simulação dinâmica de salas em tempo real
// ============================================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useAuthStore } from '../stores/useAuthStore';
import { SALAS_INICIAIS } from '../mockData';
import type { Sala } from '../types';

function SalaCard({ sala, onEntrar }: { sala: Sala; onEntrar: () => void }) {
  const aguardando = sala.status === 'waiting';
  const emJogo = sala.status === 'playing';
  const ocupacao = `${sala.jogadores.length}/${sala.maxJogadores}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="room-card"
      onClick={aguardando ? onEntrar : undefined}
      style={{ opacity: emJogo ? 0.7 : 1, cursor: aguardando ? 'pointer' : 'default' }}
    >
      {/* Modo Icon */}
      <div style={{
        width: 48, height: 48,
        borderRadius: 12,
        background: sala.modo === 'paulista'
          ? 'rgba(67,97,238,0.15)' : 'rgba(212,160,23,0.12)',
        border: `1px solid ${sala.modo === 'paulista' ? 'rgba(67,97,238,0.4)' : 'var(--border-gold)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
      }}>
        {sala.modo === 'paulista' ? '🏙️' : '⛏️'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          marginBottom: 4,
        }}>
          {sala.nome}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Avatares */}
          <div className="avatar-stack">
            {sala.jogadores.slice(0, 4).map(j => (
              <img key={j.id} src={j.avatar} alt={j.nome}
                style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid var(--obsidian-800)' }} />
            ))}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ocupacao}</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
            {sala.modo === 'paulista' ? 'Paulista' : 'Mineiro'}
          </span>
        </div>
      </div>

      {/* Status & Placar */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontSize: 10,
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: 20,
          background: aguardando ? 'rgba(45,198,83,0.12)' : 'rgba(230,57,70,0.12)',
          border: `1px solid ${aguardando ? 'rgba(45,198,83,0.3)' : 'rgba(230,57,70,0.3)'}`,
          color: aguardando ? 'var(--emerald)' : 'var(--ruby)',
          marginBottom: 4,
        }}>
          {aguardando ? '● Aguardando' : '🔴 Em Jogo'}
        </div>
        {emJogo && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {sala.pontoNos} <span style={{ color: 'var(--text-muted)' }}>×</span> {sala.pontoEles}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function SalasOverlay() {
  const { popOverlay, pushOverlay } = useNavigationStore();
  const [salas, setSalas] = useState<Sala[]>(SALAS_INICIAIS);
  const [filtro, setFiltro] = useState<'todas' | 'paulista' | 'mineiro'>('todas');

  // Simulação dinâmica de salas (lobbies "vivos")
  useEffect(() => {
    const interval = setInterval(() => {
      setSalas(prev => prev.map(sala => {
        if (Math.random() < 0.15) {
          // Simula jogador entrando ou saindo em sala waiting
          if (sala.status === 'waiting' && sala.jogadores.length < sala.maxJogadores && Math.random() < 0.5) {
            return sala; // simplificado
          }
          // Simula jogo começando
          if (sala.status === 'waiting' && sala.jogadores.length === sala.maxJogadores) {
            return { ...sala, status: 'playing' };
          }
          // Simula jogo terminando
          if (sala.status === 'playing' && Math.random() < 0.2) {
            return { ...sala, status: 'waiting', pontoNos: 0, pontoEles: 0, jogadores: sala.jogadores.slice(0, 2) };
          }
        }
        return sala;
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const salasFiltradas = salas.filter(s => filtro === 'todas' || s.modo === filtro);
  const aguardando = salasFiltradas.filter(s => s.status === 'waiting');
  const emJogo = salasFiltradas.filter(s => s.status === 'playing');

  return (
    <div className="overlay" style={{ alignItems: 'stretch' }}>
      <div className="overlay-backdrop" onClick={popOverlay} />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          height: '90vh',
          background: 'var(--obsidian-700)',
          borderRadius: '24px 24px 0 0',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          margin: '0 auto',
          zIndex: 1,
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
            🎯 Salas Disponíveis
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
              {aguardando.length} abertas
            </span>
            <button onClick={popOverlay} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 8, padding: '10px 16px', flexShrink: 0 }}>
          {(['todas', 'paulista', 'mineiro'] as const).map(f => (
            <button key={f} onClick={() => setFiltro(f)} style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: `1px solid ${filtro === f ? 'var(--gold-400)' : 'var(--border-subtle)'}`,
              background: filtro === f ? 'rgba(212,160,23,0.15)' : 'transparent',
              color: filtro === f ? 'var(--gold-400)' : 'var(--text-muted)',
              fontFamily: 'var(--font-display)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}>
              {f === 'todas' ? 'Todas' : f === 'paulista' ? '🏙️ Paulista' : '⛏️ Mineiro'}
            </button>
          ))}
        </div>

        {/* Lista de Salas */}
        <div className="list-container" style={{ flex: 1, padding: '0 16px 16px' }}>
          {aguardando.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: 'var(--emerald)', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                ● Aguardando Jogadores
              </div>
              {aguardando.map(s => (
                <SalaCard key={s.id} sala={s} onEntrar={() => { pushOverlay('jogo'); }} />
              ))}
            </>
          )}
          {emJogo.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: 'var(--ruby)', fontFamily: 'var(--font-display)', fontWeight: 700, margin: '12px 0 8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                🔴 Em Andamento
              </div>
              {emJogo.map(s => (
                <SalaCard key={s.id} sala={s} onEntrar={() => {}} />
              ))}
            </>
          )}
        </div>

        {/* CTA Jogar vs Bot */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
          <button
            className="btn-primary"
            style={{ fontSize: 16, padding: '14px 24px' }}
            onClick={() => pushOverlay('jogo')}
          >
            🤖 Jogar vs Bot Agora
          </button>
        </div>
      </motion.div>
    </div>
  );
}
