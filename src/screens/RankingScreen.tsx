// ============================================================
// TELA RANKING — RankingScreen.tsx
// Classificação com 4 abas: Dia | Semana | Geral | Amigos
// ============================================================

import { useState, useMemo, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useRankingDia, useRankingSemana, useRankingGeral, useRankingAmigos, useRankingStatus } from '../hooks/useRankingData';
import type { Usuario, JogadorRanking, Amigo } from '../types';

const RANK_ICONS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

// Estilos constantes para evitar recriação em cada render
const STYLES = {
  rankingCardBase: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    borderRadius: 12,
    marginBottom: 6,
    cursor: 'pointer',
  } as const,
  rankingCardMe: (isMe: boolean) => ({
    background: isMe ? 'rgba(212,160,23,0.08)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${isMe ? 'var(--border-gold)' : 'var(--border-card)'}`,
    cursor: isMe ? 'default' : 'pointer',
  } as const),
  posicaoSpan: {
    fontFamily: 'var(--font-display)',
    fontSize: 14,
    fontWeight: 900,
    minWidth: 28,
    textAlign: 'center' as const,
  },
  avatar: (tier: any) => ({
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: `1.5px solid ${tier.cor}`,
  } as const),
  nomeDiv: (isMe: boolean) => ({
    fontFamily: 'var(--font-display)',
    fontSize: 14,
    fontWeight: 700,
    color: isMe ? 'var(--gold-400)' : 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  }),
  tierDiv: (tierColor: string) => ({
    fontSize: 10,
    color: tierColor,
  } as const),
  pontosDiv: (tierColor: string) => ({
    fontFamily: 'var(--font-display)',
    fontSize: 14,
    fontWeight: 800,
    color: tierColor,
  } as const),
};

function usuarioToAmigo(usuario: Usuario): Amigo {
  return {
    id: usuario.id,
    nick: usuario.nick,
    nome: usuario.nome,
    avatar: usuario.avatar,
    nivel: usuario.nivel,
    vitorias: usuario.vitorias,
    derrotas: usuario.derrotas,
    partidas: usuario.partidas,
    ranking: usuario.ranking,
    clan: usuario.clan,
    statusMsg: usuario.statusMsg ?? '',
    statusMsgAtualizada: new Date(),
    statusAmigo: 'offline',
    modoJogo: undefined,
    tempoJogandoMin: undefined,
  };
}

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

// Card de jogador no ranking
const RankingCard = memo(function RankingCard({ item, isMe, onPressMe, onPressOther }: {
  item: JogadorRanking;
  isMe: boolean;
  onPressMe: (usuario: Usuario) => void;
  onPressOther: (usuario: Usuario) => void;
}) {
  const tier = getTier(item.pontos);

  return (
    <motion.div
      onClick={() => isMe ? onPressMe(item.usuario) : onPressOther(item.usuario)}
      whileTap={!isMe ? { scale: 0.98 } : undefined}
      style={{ ...STYLES.rankingCardBase, ...STYLES.rankingCardMe(isMe) }}
    >
      <span style={{ ...STYLES.posicaoSpan, color: item.posicao <= 3 ? 'var(--gold-400)' : 'var(--text-muted)' }}>
        {RANK_ICONS[item.posicao] || `#${item.posicao}`}
      </span>

      <img
        src={item.usuario.avatar}
        alt=""
        loading="lazy"
        style={STYLES.avatar(tier)}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={STYLES.nomeDiv(isMe)}>
          {item.usuario.nick} {isMe && '(Você)'}
        </div>
        <div style={STYLES.tierDiv(tier.cor)}>
          {tier.icone} {tier.nome} · Lv {item.usuario.nivel}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={STYLES.pontosDiv(tier.cor)}>
          {item.pontos.toLocaleString()}
        </div>
        {!isMe && (
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>›</span>
        )}
      </div>
    </motion.div>
  );
});

// ── Aba única com lista de ranking ──
const RankingTabContent = memo(function RankingTabContent({
  jogadores,
  loading,
  onAbrirPerfil,
  onAbrirAmigo,
}: {
  jogadores: JogadorRanking[];
  loading: boolean;
  onAbrirPerfil: (u: Usuario) => void;
  onAbrirAmigo: (u: Usuario) => void;
}) {
  const usuario_id = useAuthStore(state => state.usuario?.id);

  return (
    <div className="list-container" style={{ flex: 1, padding: '0 16px 16px', overflowY: 'auto' }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
          ⏳ Carregando ranking...
        </div>
      ) : jogadores.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 300,
          color: 'var(--text-muted)',
        }}>
          <span style={{ fontSize: 48, marginBottom: 12 }}>📊</span>
          <p>Nenhum jogador neste período</p>
        </div>
      ) : (
        jogadores.map((item) => (
          <RankingCard
            key={item.usuario.id}
            item={item}
            isMe={item.usuario.id === usuario_id}
            onPressMe={onAbrirPerfil}
            onPressOther={onAbrirAmigo}
          />
        ))
      )}
    </div>
  );
});

// ── Podium (top 3) — apenas em abas com mais jogadores ──
const Podium = memo(function Podium({
  top3,
  onAbrirPerfil,
  onAbrirAmigo,
}: {
  top3: JogadorRanking[];
  onAbrirPerfil: (u: Usuario) => void;
  onAbrirAmigo: (u: Usuario) => void;
}) {
  const usuario_id = useAuthStore(state => state.usuario?.id);
  if (top3.length === 0) return null;

  const ordem = [1, 0, 2]; // 2°, 1°, 3° (da esquerda para direita)
  const posicoes = [
    { altura: 50, medal: '🥈', size: 20, border: '#c0c0c0' },
    { altura: 70, medal: '🥇', size: 26, border: 'var(--gold-400)' },
    { altura: 38, medal: '🥉', size: 18, border: '#cd7f32' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        gap: 12, padding: '12px 16px 16px', flexShrink: 0,
        background: 'linear-gradient(180deg, rgba(123,45,139,0.08) 0%, transparent 100%)',
      }}
    >
      {ordem.map((rankIdx, i) => {
        const item = top3[rankIdx];
        if (!item) return null;

        const pos = posicoes[i];
        const sizeMultiplier = i === 1 ? 16 : (i === 0 ? 8 : 0);

        const isMe = item.usuario.id === usuario_id;
        const handleClick = isMe ? onAbrirPerfil : onAbrirAmigo;

        return (
          <motion.div
            key={item.usuario.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(item.usuario)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: pos.size }}>{pos.medal}</span>
            <img
              src={item.usuario.avatar}
              alt=""
              loading="lazy"
              style={{
                width: 44 + sizeMultiplier,
                height: 44 + sizeMultiplier,
                borderRadius: '50%',
                border: `2px solid ${pos.border}`,
                boxShadow: i === 1 ? 'var(--shadow-gold)' : undefined,
              }}
            />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 10 + i,
              fontWeight: 700,
              color: pos.border,
              textAlign: 'center',
              maxWidth: 60,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {item.usuario.nick}
            </span>
            <div style={{
              width: 60 + i * 5,
              height: pos.altura,
              background: `linear-gradient(180deg, rgba(212,160,23,${0.1 + i * 0.05}) 0%, transparent 100%)`,
              borderRadius: '6px 6px 0 0',
              border: `1px solid ${pos.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 700 + i,
              fontSize: 10 + i,
              color: pos.border,
            }}>
              {item.pontos.toLocaleString()}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
});

// ════════════════════════════════════════════════════════════════
// STATUS RANKING CONTENT — Componentes especiais pra aba Status
// ════════════════════════════════════════════════════════════════

const StatusRankingTop3 = memo(function({ top3, onAbrirPerfil, onAbrirAmigo }: {
  top3: JogadorRanking[];
  onAbrirPerfil: (u: Usuario) => void;
  onAbrirAmigo: (u: Usuario) => void;
}) {
  const { usuario: usuarioLogado } = useAuthStore();
  const medalhas = ['🥇', '🥈', '🥉'];
  const cores = ['#f5c518', '#c0c0c0', '#cd7f32'];

  return (
    <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
      {top3.map((item, i) => {
        const isMe = item.usuario.id === usuarioLogado?.id;
        return (
          <motion.div
            key={item.usuario.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => isMe ? onAbrirPerfil(item.usuario) : onAbrirAmigo(item.usuario)}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '14px', borderRadius: 14,
              background: `rgba(${cores[i] === '#f5c518' ? '245,197,24' : cores[i] === '#c0c0c0' ? '192,192,192' : '205,127,50'},0.08)`,
              border: `1.5px solid ${cores[i]}`,
              cursor: isMe ? 'default' : 'pointer',
              display: 'flex', gap: 12, alignItems: 'stretch',
            }}
          >
            {/* Badge de medalha */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minWidth: 44, fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 24,
            }}>
              {medalhas[i]}
            </div>

            {/* Avatar + info */}
            <div style={{ flex: 1, display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
              <img
                src={item.usuario.avatar}
                alt={item.usuario.nick}
                style={{
                  width: 52, height: 52, borderRadius: '50%',
                  border: `2px solid ${cores[i]}`, flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
                  color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {item.usuario.nick}
                </div>
                <div style={{
                  fontSize: 12, color: 'var(--text-muted)', marginTop: 2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: 'italic',
                }}>
                  "{item.usuario.statusMsg || '—'}"
                </div>
              </div>
            </div>

            {/* Like count grande */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minWidth: 50, fontFamily: 'var(--font-display)',
            }}>
              <div style={{ fontSize: 20 }}>❤️</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#e63946', marginTop: 2 }}>
                {item.pontos}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

const StatusRankingList = memo(function({ jogadores, onAbrirPerfil, onAbrirAmigo }: {
  jogadores: JogadorRanking[];
  onAbrirPerfil: (u: Usuario) => void;
  onAbrirAmigo: (u: Usuario) => void;
}) {
  const { usuario: usuarioLogado } = useAuthStore();

  if (jogadores.length === 0) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 16px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>💭</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Nenhum status curtido ainda
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Seja o primeiro a curtir um status!
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {jogadores.slice(3).map((item, idx) => {
        const posicao = idx + 4;
        const isMe = item.usuario.id === usuarioLogado?.id;
        return (
          <motion.div
            key={item.usuario.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (idx + 3) * 0.05 }}
            onClick={() => isMe ? onAbrirPerfil(item.usuario) : onAbrirAmigo(item.usuario)}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 10, cursor: isMe ? 'default' : 'pointer',
              background: isMe ? 'rgba(212,160,23,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isMe ? 'var(--border-gold)' : 'var(--border-card)'}`,
            }}
          >
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
              minWidth: 24, textAlign: 'center', color: 'var(--text-muted)',
            }}>
              #{posicao}
            </span>
            <img
              src={item.usuario.avatar}
              alt={item.usuario.nick}
              style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border-card)' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 600, color: isMe ? 'var(--gold-400)' : 'var(--text-primary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {item.usuario.nick}
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {item.usuario.statusMsg?.substring(0, 20)}...
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 45, justifyContent: 'flex-end' }}>
              <span>❤️</span>
              <span style={{ fontWeight: 700, color: '#e63946', fontSize: 12 }}>
                {item.pontos}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

const StatusRankingContent = function({ jogadores, loading, onAbrirPerfil, onAbrirAmigo }: {
  jogadores: JogadorRanking[];
  loading: boolean;
  onAbrirPerfil: (u: Usuario) => void;
  onAbrirAmigo: (u: Usuario) => void;
}) {
  const top3 = jogadores.slice(0, 3);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header especial */}
      <div style={{
        padding: '16px', flexShrink: 0, background: 'rgba(212,160,23,0.05)',
        borderBottom: '1px solid rgba(212,160,23,0.2)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold-400)' }}>
          🏆 Os Status Mais Curtidos
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
          {jogadores.length} status no ranking
        </div>
      </div>

      {/* Top 3 em destaque */}
      {top3.length > 0 && (
        <StatusRankingTop3 top3={top3} onAbrirPerfil={onAbrirPerfil} onAbrirAmigo={onAbrirAmigo} />
      )}

      {/* Resto da lista */}
      <StatusRankingList jogadores={jogadores} onAbrirPerfil={onAbrirPerfil} onAbrirAmigo={onAbrirAmigo} />

      {loading && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div style={{ fontSize: 32 }}>⏳</div>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════
export function RankingScreen() {
  const [aba, setAba] = useState<'dia' | 'semana' | 'geral' | 'amigos' | 'status'>('dia');
  const { usuario } = useAuthStore();
  const { pushOverlay } = useNavigationStore();

  // Carregar dados de cada aba
  const dia = useRankingDia(usuario?.id);
  const semana = useRankingSemana(usuario?.id);
  const geral = useRankingGeral(usuario?.id);
  const amigos = useRankingAmigos(usuario?.id);
  const status = useRankingStatus(usuario?.id);

  // Selecionar dados baseado na aba
  const abaData = useMemo(() => {
    switch (aba) {
      case 'dia': return dia;
      case 'semana': return semana;
      case 'geral': return geral;
      case 'amigos': return amigos;
      case 'status': return status;
    }
  }, [aba, dia, semana, geral, amigos, status]);

  // Top 3 para podium (mostrar em todas as abas)
  const top3 = useMemo(() => abaData.jogadores.slice(0, 3), [abaData.jogadores]);

  const abrirPerfilMeu = useCallback((u: Usuario) => {
    pushOverlay('perfil', { usuarioId: u.id });
  }, [pushOverlay]);

  const abrirAmigoActions = useCallback((u: Usuario) => {
    pushOverlay('friend-action', { amigo: usuarioToAmigo(u) });
  }, [pushOverlay]);

  const abas = [
    { id: 'dia' as const, label: '📅 Dia', icone: '📅' },
    { id: 'semana' as const, label: '📆 Semana', icone: '📆' },
    { id: 'geral' as const, label: '🌎 Geral', icone: '🌎' },
    { id: 'amigos' as const, label: '👥 Amigos', icone: '👥' },
    { id: 'status' as const, label: '❤️ Status', icone: '❤️' },
  ];

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

        {/* Tabs — 5 abas compactadas */}
        <div style={{
          display: 'flex', gap: 6, background: 'rgba(255,255,255,0.05)',
          borderRadius: 12, padding: 3, marginBottom: 12,
        }}>
          {abas.map(tab => (
            <button
              key={tab.id}
              onClick={() => setAba(tab.id)}
              style={{
                flex: 1, padding: '6px 4px', borderRadius: 8, border: 'none',
                fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                background: aba === tab.id ? 'var(--gold-gradient)' : 'transparent',
                color: aba === tab.id ? '#0a0a0f' : 'var(--text-muted)',
                overflow: 'hidden', textOverflow: 'ellipsis',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Seu card em destaque */}
      {abaData.seu_ranking && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            margin: '0 16px 8px', padding: '10px 14px', borderRadius: 12,
            background: 'rgba(212,160,23,0.08)', border: '1px solid var(--border-gold)',
            display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
          }}
        >
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 900,
            color: 'var(--gold-400)', minWidth: 32,
          }}>
            #{abaData.seu_ranking.posicao}
          </span>
          <img
            src={abaData.seu_ranking.usuario.avatar}
            alt=""
            style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--border-gold)' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
              color: 'var(--gold-400)',
            }}>
              Você · {abaData.seu_ranking.usuario.nick}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {getTier(abaData.seu_ranking.pontos).icone} {getTier(abaData.seu_ranking.pontos).nome}
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            color: 'var(--gold-400)', fontSize: 15,
          }}>
            {abaData.seu_ranking.pontos.toLocaleString()}
          </div>
        </motion.div>
      )}

      {aba === 'status' ? (
        <StatusRankingContent
          jogadores={abaData.jogadores}
          loading={abaData.loading}
          onAbrirPerfil={abrirPerfilMeu}
          onAbrirAmigo={abrirAmigoActions}
        />
      ) : (
        <>
          {/* Podium (Top 3) */}
          <Podium top3={top3} onAbrirPerfil={abrirPerfilMeu} onAbrirAmigo={abrirAmigoActions} />

          {/* Lista de ranking */}
          <RankingTabContent
            jogadores={abaData.jogadores}
            loading={abaData.loading}
            onAbrirPerfil={abrirPerfilMeu}
            onAbrirAmigo={abrirAmigoActions}
          />
        </>
      )}
    </div>
  );
}
