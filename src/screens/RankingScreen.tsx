// ============================================================
// TELA RANKING — RankingScreen.tsx
// Classificação Global e de Amigos
// ============================================================

import { useState, useMemo, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useRankingGlobal, useAmigosRanking } from '../hooks/useProfileData';
import type { Usuario } from '../types';

const RANK_ICONS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

const TIER_CONFIG = [
  { nome: 'Lenda',    min: 15000, cor: '#f5c518', icone: '👑' },
  { nome: 'Diamante', min: 10000, cor: '#b0d4ff', icone: '💎' },
  { nome: 'Platina',  min: 7000,  cor: '#e0e0e0', icone: '⚡' },
  { nome: 'Ouro',     min: 4000,  cor: '#d4a017', icone: '🏆' },
  { nome: 'Prata',    min: 2000,  cor: '#a0a0b5', icone: '🪙' },
  { nome: 'Bronze',   min: 0,     cor: '#cd7f32', icone: '🔰' },
];

function getTier(pontos: number) {
  return TIER_CONFIG.find(t => pontos >= t.min) || TIER_CONFIG[TIER_CONFIG.length - 1];
}

// Status dot para aba amigos
const StatusDot = memo(function StatusDot({ status }: { status: Amigo['statusAmigo'] }) {
  const cor =
    status === 'disponivel' ? '#2dc653'
    : status === 'jogando' ? '#f5a623'
    : 'rgba(255,255,255,0.2)';
  return (
    <div style={{
      width: 9, height: 9, borderRadius: '50%',
      background: cor, border: '1.5px solid rgba(10,8,30,0.9)',
      flexShrink: 0,
    }} />
  );
});

// Card de jogador global (clicável → ProfileOverlay direto)
const GlobalCard = memo(function GlobalCard({ item, isMe, onPress }: {
  item: { posicao: number; usuario: Usuario; pontos: number };
  isMe: boolean;
  onPress: (usuario: Usuario) => void;
}) {
  const tier = getTier(item.pontos);

  return (
    <motion.div
      key={item.usuario.id}
      onClick={() => !isMe && onPress(item.usuario)}
      whileTap={!isMe ? { scale: 0.98 } : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        borderRadius: 12,
        marginBottom: 6,
        background: isMe ? 'rgba(212,160,23,0.08)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isMe ? 'var(--border-gold)' : 'var(--border-card)'}`,
        cursor: isMe ? 'default' : 'pointer',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: 14, fontWeight: 900,
        color: item.posicao <= 3 ? 'var(--gold-400)' : 'var(--text-muted)',
        minWidth: 28, textAlign: 'center',
      }}>
        {RANK_ICONS[item.posicao] || `#${item.posicao}`}
      </span>

      <img src={item.usuario.avatar} alt="" loading="lazy" style={{ width: 36, height: 36, borderRadius: '50%', border: `1.5px solid ${tier.cor}` }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
          color: isMe ? 'var(--gold-400)' : 'var(--text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.usuario.nick} {isMe && '(Você)'}
        </div>
        <div style={{ fontSize: 10, color: tier.cor }}>
          {tier.icone} {tier.nome} · Lv {item.usuario.nivel}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: tier.cor }}>
          {item.pontos.toLocaleString()}
        </div>
        {!isMe && (
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>›</span>
        )}
      </div>
    </motion.div>
  );
});

// Aba Amigos — mostra lista de amigos ordenados por ranking
const AmigosTab = memo(function AmigosTab({ usuarioId, onAbrirPerfil }: {
  usuarioId: string | undefined;
  onAbrirPerfil: (u: Usuario) => void;
}) {
  const { amigos, loading } = useAmigosRanking(usuarioId);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
        ⏳ Carregando amigos...
      </div>
    );
  }

  if (amigos.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        color: 'var(--text-muted)',
      }}>
        <span style={{ fontSize: 48, marginBottom: 12 }}>👥</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 8, color: 'var(--text-primary)' }}>
          Sem amigos ainda
        </h2>
        <p style={{ fontSize: 13, textAlign: 'center', maxWidth: 200 }}>
          Você ainda não tem amigos adicionados
        </p>
      </div>
    );
  }

  return (
    <>
      {amigos.map((amigo) => (
        <GlobalCard
          key={amigo.id}
          item={{
            posicao: amigo.ranking,
            usuario: amigo,
            pontos: 0, // TODO: adicionar pontos de hoje ou semanal
          }}
          isMe={false}
          onPress={onAbrirPerfil}
        />
      ))}
    </>
  );
});

export function RankingScreen() {
  const [aba, setAba] = useState<'global' | 'amigos'>('global');
  const { usuario } = useAuthStore();
  const { pushOverlay } = useNavigationStore();
  const { ranking, loading } = useRankingGlobal();

  const meuRanking = useMemo(
    () => ranking.find(r => r.usuario.id === usuario?.id),
    [ranking, usuario?.id]
  );

  const abrirPerfilGlobal = useCallback((u: Usuario) => {
    pushOverlay('perfil', { usuarioId: u.id });
  }, [pushOverlay]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '20px 16px 0',
        flexShrink: 0,
        background: 'var(--obsidian-900)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900,
          color: 'var(--text-primary)', margin: '0 0 14px', letterSpacing: '-0.02em',
        }}>
          🏆 Classificação
        </h1>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.05)',
          borderRadius: 12, padding: 4, marginBottom: 12,
        }}>
          {(['global', 'amigos'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setAba(tab)}
              style={{
                flex: 1, padding: '9px', borderRadius: 9, border: 'none',
                fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s ease',
                background: aba === tab ? 'var(--gold-gradient)' : 'transparent',
                color: aba === tab ? '#0a0a0f' : 'var(--text-muted)',
              }}
            >
              {tab === 'global' ? '🌎 Global' : '👥 Amigos'}
            </button>
          ))}
        </div>
      </div>

      {/* Podium Top 3 — só aba Global */}
      {aba === 'global' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
            gap: 12, padding: '12px 16px 16px', flexShrink: 0,
            background: 'linear-gradient(180deg, rgba(123,45,139,0.08) 0%, transparent 100%)',
          }}
        >
          {/* 2° */}
          {ranking[1] && (
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => abrirPerfilGlobal(ranking[1].usuario)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
            >
              <span style={{ fontSize: 20 }}>🥈</span>
              <img src={ranking[1].usuario.avatar} alt="" loading="lazy" style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #c0c0c0' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, color: '#c0c0c0' }}>{ranking[1].usuario.nick}</span>
              <div style={{ width: 60, height: 50, background: 'linear-gradient(180deg, rgba(192,192,192,0.15) 0%, transparent 100%)', borderRadius: '6px 6px 0 0', border: '1px solid rgba(192,192,192,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, color: '#c0c0c0' }}>{ranking[1].pontos.toLocaleString()}</div>
            </motion.div>
          )}
          {/* 1° */}
          {ranking[0] && (
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => abrirPerfilGlobal(ranking[0].usuario)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
            >
              <span style={{ fontSize: 26 }}>🥇</span>
              <img src={ranking[0].usuario.avatar} alt="" loading="lazy" style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid var(--gold-400)', boxShadow: 'var(--shadow-gold)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 800, color: 'var(--gold-400)' }}>{ranking[0].usuario.nick}</span>
              <div style={{ width: 60, height: 70, background: 'linear-gradient(180deg, rgba(212,160,23,0.2) 0%, transparent 100%)', borderRadius: '6px 6px 0 0', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, color: 'var(--gold-400)' }}>{ranking[0].pontos.toLocaleString()}</div>
            </motion.div>
          )}
          {/* 3° */}
          {ranking[2] && (
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => abrirPerfilGlobal(ranking[2].usuario)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
            >
              <span style={{ fontSize: 18 }}>🥉</span>
              <img src={ranking[2].usuario.avatar} alt="" loading="lazy" style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #cd7f32' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, color: '#cd7f32' }}>{ranking[2].usuario.nick}</span>
              <div style={{ width: 60, height: 38, background: 'linear-gradient(180deg, rgba(205,127,50,0.12) 0%, transparent 100%)', borderRadius: '6px 6px 0 0', border: '1px solid rgba(205,127,50,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, color: '#cd7f32' }}>{ranking[2].pontos.toLocaleString()}</div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Sua posição em destaque */}
      {meuRanking && (
        <div style={{
          margin: '0 16px 8px', padding: '10px 14px', borderRadius: 12,
          background: 'rgba(212,160,23,0.08)', border: '1px solid var(--border-gold)',
          display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
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
      <div className="list-container" style={{ flex: 1, padding: '0 16px 16px', overflowY: 'auto' }}>

        {/* ── ABA GLOBAL ── */}
        {aba === 'global' && (
          <>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                ⏳ Carregando ranking...
              </div>
            ) : ranking.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                Nenhum jogador no ranking ainda
              </div>
            ) : (
              ranking.slice(3).map((item) => (
                <GlobalCard
                  key={item.usuario.id}
                  item={item}
                  isMe={item.usuario.id === usuario?.id}
                  onPress={abrirPerfilGlobal}
                />
              ))
            )}
          </>
        )}

        {/* ── ABA AMIGOS ── */}
        {aba === 'amigos' && <AmigosTab usuarioId={usuario?.id} onAbrirPerfil={abrirPerfilGlobal} />}
      </div>

    </div>
  );
}
