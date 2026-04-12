// ============================================================
// TELA RANKING — RankingScreen.tsx
// Classificação Global e de Amigos
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';
import { RANKING_MOCK } from '../mockData';

const RANK_ICONS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

const TIER_CONFIG = [
  { nome: 'Lenda', min: 15000, cor: '#f5c518', icone: '👑' },
  { nome: 'Diamante', min: 10000, cor: '#b0d4ff', icone: '💎' },
  { nome: 'Platina', min: 7000,  cor: '#e0e0e0', icone: '⚡' },
  { nome: 'Ouro',    min: 4000,  cor: '#d4a017', icone: '🏆' },
  { nome: 'Prata',   min: 2000,  cor: '#a0a0b5', icone: '🪙' },
  { nome: 'Bronze',  min: 0,     cor: '#cd7f32', icone: '🔰' },
];

function getTier(pontos: number) {
  return TIER_CONFIG.find(t => pontos >= t.min) || TIER_CONFIG[TIER_CONFIG.length - 1];
}

export function RankingScreen() {
  const [aba, setAba] = useState<'global' | 'amigos'>('global');
  const { usuario } = useAuthStore();

  const meuRanking = RANKING_MOCK.find(r => r.usuario.id === usuario?.id);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '20px 16px 0',
        flexShrink: 0,
        background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(10px)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          fontWeight: 900,
          color: 'var(--text-primary)',
          margin: '0 0 14px',
          letterSpacing: '-0.02em',
        }}>
          🏆 Classificação
        </h1>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 12,
          padding: 4,
          marginBottom: 12,
        }}>
          {(['global', 'amigos'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setAba(tab)}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: 9,
                border: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: aba === tab ? 'var(--gold-gradient)' : 'transparent',
                color: aba === tab ? '#0a0a0f' : 'var(--text-muted)',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'global' ? '🌎 Global' : '👥 Amigos'}
            </button>
          ))}
        </div>
      </div>

      {/* Podium Top 3 */}
      {aba === 'global' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: 12,
            padding: '12px 16px 16px',
            flexShrink: 0,
            background: 'linear-gradient(180deg, rgba(123,45,139,0.08) 0%, transparent 100%)',
          }}
        >
          {/* 2° lugar */}
          {RANKING_MOCK[1] && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 20 }}>🥈</span>
              <img src={RANKING_MOCK[1].usuario.avatar} alt="" style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #c0c0c0' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, color: '#c0c0c0' }}>{RANKING_MOCK[1].usuario.nick}</span>
              <div style={{ width: 60, height: 50, background: 'linear-gradient(180deg, rgba(192,192,192,0.15) 0%, transparent 100%)', borderRadius: '6px 6px 0 0', border: '1px solid rgba(192,192,192,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, color: '#c0c0c0' }}>{RANKING_MOCK[1].pontos.toLocaleString()}</div>
            </div>
          )}
          {/* 1° lugar */}
          {RANKING_MOCK[0] && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 26 }}>🥇</span>
              <img src={RANKING_MOCK[0].usuario.avatar} alt="" style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid var(--gold-400)', boxShadow: 'var(--shadow-gold)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 800, color: 'var(--gold-400)' }}>{RANKING_MOCK[0].usuario.nick}</span>
              <div style={{ width: 60, height: 70, background: 'linear-gradient(180deg, rgba(212,160,23,0.2) 0%, transparent 100%)', borderRadius: '6px 6px 0 0', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, color: 'var(--gold-400)' }}>{RANKING_MOCK[0].pontos.toLocaleString()}</div>
            </div>
          )}
          {/* 3° lugar */}
          {RANKING_MOCK[2] && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 18 }}>🥉</span>
              <img src={RANKING_MOCK[2].usuario.avatar} alt="" style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #cd7f32' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, color: '#cd7f32' }}>{RANKING_MOCK[2].usuario.nick}</span>
              <div style={{ width: 60, height: 38, background: 'linear-gradient(180deg, rgba(205,127,50,0.12) 0%, transparent 100%)', borderRadius: '6px 6px 0 0', border: '1px solid rgba(205,127,50,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, color: '#cd7f32' }}>{RANKING_MOCK[2].pontos.toLocaleString()}</div>
            </div>
          )}
        </motion.div>
      )}

      {/* Sua posição em destaque */}
      {meuRanking && (
        <div style={{
          margin: '0 16px 8px',
          padding: '10px 14px',
          borderRadius: 12,
          background: 'rgba(212,160,23,0.08)',
          border: '1px solid var(--border-gold)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 900, color: 'var(--gold-400)', minWidth: 32 }}>#{meuRanking.posicao}</span>
          <img src={meuRanking.usuario.avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--border-gold)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--gold-400)' }}>Você · {meuRanking.usuario.nick}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{getTier(meuRanking.pontos).icone} {getTier(meuRanking.pontos).nome}</div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold-400)', fontSize: 15 }}>
            {meuRanking.pontos.toLocaleString()}
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="list-container" style={{ flex: 1, padding: '0 16px 16px' }}>
        {(aba === 'global' ? RANKING_MOCK.slice(3) : RANKING_MOCK.filter((_, i) => i === 0 || i === 4 || i === 7)).map((item, i) => {
          const tier = getTier(item.pontos);
          const isMe = item.usuario.id === usuario?.id;

          return (
            <motion.div
              key={item.usuario.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 12,
                marginBottom: 6,
                background: isMe ? 'rgba(212,160,23,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isMe ? 'var(--border-gold)' : 'var(--border-card)'}`,
              }}
            >
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 900,
                color: item.posicao <= 3 ? 'var(--gold-400)' : 'var(--text-muted)',
                minWidth: 28,
                textAlign: 'center',
              }}>
                {RANK_ICONS[item.posicao] || `#${item.posicao}`}
              </span>

              <img src={item.usuario.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', border: `1.5px solid ${tier.cor}` }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 14,
                  fontWeight: 700,
                  color: isMe ? 'var(--gold-400)' : 'var(--text-primary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {item.usuario.nick} {isMe && '(Você)'}
                </div>
                <div style={{ fontSize: 10, color: tier.cor }}>
                  {tier.icone} {tier.nome} · Lv {item.usuario.nivel}
                </div>
              </div>

              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 800,
                color: tier.cor,
              }}>
                {item.pontos.toLocaleString()}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
