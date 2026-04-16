// ============================================================
// PROFILE OVERLAY — Arena Truco Premium
// Perfil completo do usuário: 4 abas navegáveis
// Perfil | Stats | Conquistas | Meus Jogos
// ============================================================

import { useState, createContext, useContext, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigationStore } from '../stores/useNavigationStore';
import {
  useMinhasPartidas,
  usePontuacaoSemanal,
  useMinhasConquistas,
  usePerfilPublico,
} from '../hooks/useProfileData';
import type { Badge, GameHistory, Usuario } from '../types';

// ── Helpers ──────────────────────────────────────────────────
function dataFormatada(date: Date): string {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function horaFormatada(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// ── Gráfico de Linha SVG ─────────────────────────────────────
function LineChart({ data }: { data: { data: string; pontos: number }[] }) {
  const W = 300, H = 110;
  const PAD = { t: 12, r: 12, b: 26, l: 12 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  const { linePath, areaPath, pts } = useMemo(() => {
    const maxVal = Math.max(...data.map(d => d.pontos));
    const minVal = Math.min(...data.map(d => d.pontos));
    const range = maxVal - minVal || 1;

    const xPos = (i: number) => PAD.l + (i / Math.max(data.length - 1, 1)) * cW;
    const yPos = (v: number) => PAD.t + (1 - (v - minVal) / range) * cH;

    const calculatedPts = data.map((d, i) => ({
      x: xPos(i), y: yPos(d.pontos),
      label: d.data, val: d.pontos,
    }));

    const calculatedLinePath = calculatedPts.map((p, i) =>
      `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`
    ).join(' ');

    const calculatedAreaPath = [
      calculatedLinePath,
      `L ${calculatedPts[calculatedPts.length - 1].x.toFixed(1)},${(H - PAD.b).toFixed(1)}`,
      `L ${calculatedPts[0].x.toFixed(1)},${(H - PAD.b).toFixed(1)} Z`,
    ].join(' ');

    return { linePath: calculatedLinePath, areaPath: calculatedAreaPath, pts: calculatedPts };
  }, [data, PAD.l, PAD.t, PAD.b, cW, cH]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: 110 }}
    >
      <defs>
        <linearGradient id="pgLineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a017" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#d4a017" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid linhas horizontais */}
      {[0.25, 0.5, 0.75].map(r => (
        <line
          key={r}
          x1={PAD.l} y1={PAD.t + r * cH}
          x2={W - PAD.r} y2={PAD.t + r * cH}
          stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"
        />
      ))}

      {/* Área preenchida */}
      <path d={areaPath} fill="url(#pgLineGrad)" />

      {/* Linha */}
      <path
        d={linePath} fill="none"
        stroke="#d4a017" strokeWidth="1.8"
        strokeLinejoin="round" strokeLinecap="round"
      />

      {/* Pontos + labels */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#0a081e" stroke="#d4a017" strokeWidth="1.8" />
          <text
            x={p.x} y={H - 6}
            textAnchor="middle"
            fill="rgba(255,255,255,0.38)"
            fontSize="7"
            fontFamily="system-ui"
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ── Tab Bar ──────────────────────────────────────────────────
const TAB_LABELS = ['Perfil', 'Stats', 'Conquistas', 'Meus Jogos'];

const TabBar = memo(function TabBar({ active, onChange }: { active: number; onChange: (i: number) => void }) {
  return (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      flexShrink: 0,
    }}>
      {TAB_LABELS.map((label, i) => (
        <button
          key={label}
          onClick={() => onChange(i)}
          style={{
            flex: 1,
            padding: '10px 4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 11,
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: active === i ? 'var(--gold-400)' : 'var(--text-muted)',
            position: 'relative',
            transition: 'color 0.2s',
            letterSpacing: '0.02em',
          }}
        >
          {label}
          {active === i && (
            <motion.div
              layoutId="tab-underline"
              style={{
                position: 'absolute', bottom: 0, left: 4, right: 4, height: 2,
                background: 'var(--gold-gradient)',
                borderRadius: 2,
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
});

// ── Context pra perfil do jogador exibido ───────────────────
const ProfileContext = createContext<Usuario | null>(null);

const useProfileUser = () => {
  const ctx = useContext(ProfileContext);
  const { usuario } = useAuthStore();
  return (ctx || usuario) as Usuario;
};

// ── ABA: PERFIL ──────────────────────────────────────────────
function PerfilTab({ editModeOriginal = false }: { editModeOriginal?: boolean }) {
  const usuario = useProfileUser();
  const { usuario: usuarioLogado, atualizarPerfil, uploadAvatar, carregando: authCarregando } = useAuthStore();
  
  const ehProprio = usuario?.id === usuarioLogado?.id;
  
  const [editando, setEditando] = useState(editModeOriginal);
  const [novoNick, setNovoNick] = useState(usuario?.nick || '');
  const [statusMsg, setStatusMsg] = useState('Aqui pra ganhar de todos! 🃏');
  const [statusTemp, setStatusTemp] = useState(statusMsg);
  const [uploading, setUploading] = useState(false);

  if (!usuario) return null;

  const handleFotoClick = () => {
    if (!ehProprio) return;
    document.getElementById('avatar-upload')?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const publicUrl = await uploadAvatar(file);
      await atualizarPerfil({ avatar_url: publicUrl });
    } catch (err) {
      console.error('Erro no upload:', err);
      alert('Falha ao subir foto. Verifique o Storage do Supabase.');
    } finally {
      setUploading(false);
    }
  };

  const handleSalvarNick = async () => {
    if (!novoNick.trim() || novoNick === usuario.nick) {
      setEditando(false);
      return;
    }
    try {
      await atualizarPerfil({ nick: novoNick.trim() });
      setEditando(false);
    } catch (err) {
      console.error('Erro ao mudar nick:', err);
    }
  };

  // Memoizar cálculos para evitar recalcular em cada render
  const { winRate } = useMemo(() => ({
    winRate: Math.round((usuario.vitorias / Math.max(usuario.partidas, 1)) * 100),
  }), [usuario]);

  return (
    <div style={{ padding: '16px 16px 24px' }}>
      <input 
        type="file" id="avatar-upload" hidden accept="image/*" 
        onChange={handleFileChange} 
      />

      {/* Avatar + identidade */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
        {/* Avatar com anel de XP */}
        <div 
          onClick={handleFotoClick}
          style={{ 
            position: 'relative', marginBottom: 10, 
            cursor: ehProprio ? 'pointer' : 'default' 
          }}
        >
          <svg width="88" height="88" viewBox="0 0 88 88" style={{ position: 'absolute', top: -4, left: -4, transform: 'rotate(-90deg)' }}>
            <circle cx="44" cy="44" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
            <circle
              cx="44" cy="44" r="40" fill="none"
              stroke="url(#xpRingGrad)" strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - usuario.xp / usuario.xpProximoNivel)}
            />
            <defs>
              <linearGradient id="xpRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f5c518" />
                <stop offset="100%" stopColor="#d4a017" />
              </linearGradient>
            </defs>
          </svg>
          
          <div style={{ position: 'relative' }}>
            <img
              src={usuario.avatar}
              alt={usuario.nick}
              style={{
                width: 80, height: 80, borderRadius: '50%',
                border: '3px solid var(--gold-400)',
                display: 'block',
                opacity: (uploading || authCarregando) ? 0.5 : 1,
                transition: 'opacity 0.3s'
              }}
            />
            {ehProprio && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.3)', opacity: 0, transition: 'opacity 0.2s',
              }} className="hover-show">
                <span style={{ fontSize: 24 }}>📷</span>
              </div>
            )}
            {(uploading || authCarregando) && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div className="animate-spin-slow" style={{ fontSize: 20 }}>⏳</div>
              </div>
            )}
          </div>
        </div>

        {/* Estilo para hover do avatar */}
        <style>{`
          div:hover > .hover-show { opacity: 1 !important; }
        `}</style>

        {/* Nick + Level */}
        {editando ? (
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <input 
                value={novoNick}
                onChange={e => setNovoNick(e.target.value.slice(0, 15))}
                placeholder="Seu Nick"
                style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid var(--gold-500)',
                  borderRadius: 8, padding: '6px 12px', color: 'white',
                  fontFamily: 'var(--font-display)', fontSize: 18, textAlign: 'center',
                  outline: 'none', width: 160
                }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: 11 }} onClick={() => setEditando(false)}>Cancelar</button>
                <button className="btn-primary" style={{ padding: '4px 12px', fontSize: 11 }} onClick={handleSalvarNick}>Salvar Nick</button>
              </div>
           </div>
        ) : (
          <div 
            onClick={() => ehProprio && setEditando(true)}
            style={{
              fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900,
              color: 'var(--text-primary)', marginBottom: 2, cursor: ehProprio ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            {usuario.nick} {ehProprio && <span style={{ fontSize: 14, opacity: 0.5 }}>✏️</span>}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, marginTop: editando ? 12 : 0 }}>
          <span style={{
            fontSize: 11, padding: '2px 10px', borderRadius: 20,
            background: 'rgba(212,160,23,0.15)', color: 'var(--gold-400)', fontWeight: 700,
          }}>
            Nível {usuario.nivel}
          </span>
          {usuario.clan && (
            <span style={{
              fontSize: 11, padding: '2px 10px', borderRadius: 20,
              background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontWeight: 600,
            }}>
              🏠 {usuario.clan}
            </span>
          )}
        </div>

        {/* Ranking */}
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Ranking Global <span style={{ color: 'var(--gold-400)', fontWeight: 700 }}>#{usuario.ranking}</span>
        </div>
      </div>

      {/* Status editável */}
      <div className="glass-card-gold" style={{ padding: '10px 14px', marginBottom: 16 }}>
        {editando ? (
          <div>
            <input
              autoFocus
              value={statusTemp}
              onChange={e => setStatusTemp(e.target.value.slice(0, 120))}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'transparent', border: 'none',
                color: 'var(--text-primary)', fontSize: 13,
                fontFamily: 'inherit', outline: 'none',
                marginBottom: 8,
              }}
            />
            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                style={{ padding: '4px 12px', fontSize: 11 }}
                onClick={() => { setStatusTemp(statusMsg); setEditando(false); }}
              >
                Cancelar
              </button>
              <button
                className="btn-primary"
                style={{ padding: '4px 12px', fontSize: 11 }}
                onClick={() => { setStatusMsg(statusTemp); setEditando(false); }}
              >
                Salvar
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-primary)', fontStyle: 'italic', flex: 1 }}>
              "{statusMsg}"
            </span>
            <button
              onClick={() => { setStatusTemp(statusMsg); setEditando(true); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 14, opacity: 0.5, flexShrink: 0,
              }}
            >
              ✏️
            </button>
          </div>
        )}
      </div>

      {/* Pontos + Amigos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div className="glass-card-gold" style={{ padding: 14, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: 'var(--gold-400)' }}>
            {usuario.moedas.toLocaleString('pt-BR')}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            🪙 Pontos
          </div>
        </div>
        <div className="glass-card-gold" style={{ padding: 14, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>
            {amigosTotal}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            👥 Amigos
          </div>
        </div>
      </div>

      {/* V / D / A */}
      <div className="glass-card-gold" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: 'Win Rate', value: `${winRate}%`, color: '#2dc653' },
            { label: 'Vitórias', value: usuario.vitorias, color: 'var(--text-primary)' },
            { label: 'Derrotas', value: usuario.derrotas, color: 'var(--ruby, #e63946)' },
            { label: 'Abandonos', value: abandonos, color: 'var(--text-muted)' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, color: s.color }}>
                {s.value}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ABA: STATS ───────────────────────────────────────────────
function StatsTab() {
  const usuario = useProfileUser();
  const { usuario: usuarioLogado } = useAuthStore();
  const ehProprio = usuario?.id === usuarioLogado?.id;

  // Dados reais para o próprio perfil, mock para outros
  const { pontuacao: pontuacaoReal, loading } = usePontuacaoSemanal(
    ehProprio ? usuario?.id : undefined
  );
  const pontuacaoData = ehProprio && !loading && pontuacaoReal.length > 0
    ? pontuacaoReal
    : [];

  // Abandono: busca do histórico real (mock como fallback)
  const { partidas: historicoReal } = useMinhasPartidas(
    ehProprio ? usuario?.id : undefined
  );
  const historicoUsado = ehProprio && historicoReal.length > 0 ? historicoReal : [];

  if (!usuario) return null;

  // Memoizar cálculos de stats para evitar recalcular em cada render de tab switch
  const stats = useMemo(() => {
    const winRate = Math.round((usuario.vitorias / Math.max(usuario.partidas, 1)) * 100);
    const abandonos = historicoUsado.filter(g => g.resultado === 'abandono').length;
    const taxaAbandono = ((abandonos / Math.max(usuario.partidas, 1)) * 100).toFixed(1);
    const totalSemana = pontuacaoData.reduce((s, d) => s + d.pontos, 0);
    const mediaDia = Math.round(totalSemana / Math.max(pontuacaoData.length, 1));
    const recordDia = Math.max(...pontuacaoData.map(d => d.pontos), 0);
    const kd = (usuario.vitorias / Math.max(usuario.derrotas, 1)).toFixed(2);

    return { winRate, abandonos, taxaAbandono, totalSemana, mediaDia, recordDia, kd };
  }, [usuario, historicoUsado, pontuacaoData]);

  const { winRate, abandonos, taxaAbandono, totalSemana, mediaDia, recordDia, kd } = stats;

  return (
    <div style={{ padding: '16px 16px 24px' }}>

      {/* Pills de stats principais */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Win Rate', value: `${winRate}%`, color: '#2dc653', icon: '📈' },
          { label: 'K/D Ratio', value: kd, color: 'var(--gold-400)', icon: '⚔️' },
          { label: 'Abandono', value: `${taxaAbandono}%`, color: 'var(--text-muted)', icon: '🏃' },
        ].map(s => (
          <div key={s.label} className="glass-card-gold" style={{ padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de linha */}
      <div className="glass-card-gold" style={{ padding: '14px 16px 10px', marginBottom: 16 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
          color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.08em', marginBottom: 12,
        }}>
          📊 Pontuação dos Últimos 7 Dias
        </div>
        <LineChart data={pontuacaoData} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            Total: <span style={{ color: 'var(--gold-400)', fontWeight: 700 }}>{totalSemana.toLocaleString('pt-BR')} pts</span>
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            Média: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{mediaDia} pts/dia</span>
          </span>
        </div>
      </div>

      {/* Destaques */}
      <div className="glass-card-gold" style={{ padding: '14px 16px' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
          color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.08em', marginBottom: 12,
        }}>
          🏅 Destaques da Carreira
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '🔥', label: 'Record em um dia', value: `${recordDia} pts` },
            { icon: '🏆', label: 'Maior sequência de vitórias', value: '—' }, // TODO: campo max_win_streak no BD
            { icon: '👑', label: 'Melhor posição no ranking', value: usuario.ranking > 0 ? `#${usuario.ranking}` : '—' },
            { icon: '🎮', label: 'Total de partidas', value: usuario.partidas },
            { icon: '📅', label: 'Membro desde', value: '—' }, // TODO: campo created_at no BD
          ].map(d => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {d.icon} {d.label}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                {d.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ABA: CONQUISTAS ──────────────────────────────────────────
const TIER_COLORS: Record<number, string> = {
  1: '#2dc653', 2: '#4361ee', 3: '#d4a017', 4: '#e63946',
};
const TIER_LABELS: Record<number, string> = {
  1: 'Bronze', 2: 'Prata', 3: 'Ouro', 4: 'Lendário',
};

function BadgeCard({ badge }: { badge: Badge }) {
  const cor = TIER_COLORS[badge.tier];
  const pct = badge.progressoMax
    ? Math.round((badge.progressoAtual! / badge.progressoMax) * 100)
    : 0;

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      style={{
        background: badge.conquistado
          ? `rgba(${badge.tier === 4 ? '230,57,70' : badge.tier === 3 ? '212,160,23' : badge.tier === 2 ? '67,97,238' : '45,198,83'},0.1)`
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${badge.conquistado ? cor : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 14,
        padding: '14px 10px',
        textAlign: 'center',
        opacity: badge.conquistado ? 1 : 0.75,
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 6, filter: badge.conquistado ? 'none' : 'grayscale(1)' }}>
        {badge.icone}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, color: badge.conquistado ? 'var(--text-primary)' : 'var(--text-muted)', marginBottom: 2, lineHeight: 1.2 }}>
        {badge.nome}
      </div>
      {badge.conquistado ? (
        <div style={{ fontSize: 9, color: cor, fontWeight: 700 }}>
          {TIER_LABELS[badge.tier]}
        </div>
      ) : badge.progressoMax ? (
        <>
          <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.1)', margin: '6px 4px 2px' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: cor, borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>
            {badge.progressoAtual?.toLocaleString('pt-BR')}/{badge.progressoMax.toLocaleString('pt-BR')}
          </div>
        </>
      ) : null}
    </motion.div>
  );
}

function ConquistasTab() {
  const usuario = useProfileUser();
  const { usuario: usuarioLogado } = useAuthStore();
  const ehProprio = usuario?.id === usuarioLogado?.id;

  const { badges: badgesReais, loading } = useMinhasConquistas(
    ehProprio ? usuario?.id : undefined
  );

  const badgesUsados: Badge[] = ehProprio && !loading && badgesReais.length > 0
    ? badgesReais
    : [];

  const conquistadas = badgesUsados.filter(b => b.conquistado);

  if (loading && ehProprio) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        Carregando conquistas...
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 16px 24px' }}>
      {/* Progresso geral */}
      <div className="glass-card-gold" style={{ padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Progresso</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ height: 6, width: 100, borderRadius: 3, background: 'rgba(255,255,255,0.08)' }}>
            <div style={{ height: '100%', width: `${Math.round((conquistadas.length / badgesUsados.length) * 100)}%`, background: 'var(--gold-gradient)', borderRadius: 3 }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--gold-400)' }}>
            {conquistadas.length}/{badgesUsados.length}
          </span>
        </div>
      </div>

      {/* Grid badges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
        {badgesUsados.map(b => <BadgeCard key={b.id} badge={b} />)}
      </div>

      {/* Legenda de tiers */}
      <div className="glass-card-gold" style={{ padding: '12px 16px', marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {Object.entries(TIER_LABELS).map(([tier, label]) => (
            <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--text-muted)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: TIER_COLORS[Number(tier)] }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ABA: MEUS JOGOS ──────────────────────────────────────────
function GameCard({ game }: { game: GameHistory }) {
  const { pushOverlay } = useNavigationStore();
  const isWin = game.resultado === 'vitoria';
  const isAbandono = game.resultado === 'abandono';
  const cor = isWin ? '#2dc653' : isAbandono ? 'var(--text-muted)' : '#e63946';
  const label = isWin ? 'V' : isAbandono ? 'A' : 'D';
  const sinal = isWin ? '+' : '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => pushOverlay('perfil', { usuarioId: game.oponenteId })}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        cursor: 'pointer',
      }}
    >
      {/* Avatar oponente */}
      <img
        src={game.oponenteAvatar}
        alt={game.oponenteNick}
        style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${cor}`, flexShrink: 0 }}
      />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          vs {game.oponenteNick}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          {dataFormatada(game.data)} · {horaFormatada(game.data)} · {game.duracaoMin}min · {game.modo === 'paulista' ? 'Paulista' : 'Mineiro'}
        </div>
      </div>

      {/* Resultado + pontos */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 900,
          padding: '2px 8px', borderRadius: 20,
          background: `rgba(${isWin ? '45,198,83' : isAbandono ? '100,100,100' : '230,57,70'},0.15)`,
          color: cor, marginBottom: 2,
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
          color: isWin ? '#2dc653' : '#e63946',
        }}>
          {sinal}{game.pontosGanhos}
        </div>
      </div>
    </motion.div>
  );
}

function MeusJogosTab() {
  const usuario = useProfileUser();
  const { usuario: usuarioLogado } = useAuthStore();
  const ehProprio = usuario?.id === usuarioLogado?.id;

  // Dados reais para o próprio perfil, mock para outros
  const { partidas: partidasReais, loading } = useMinhasPartidas(
    ehProprio ? usuario?.id : undefined
  );
  const historicoUsado: GameHistory[] = ehProprio && !loading && partidasReais.length > 0
    ? partidasReais
    : [];

  const totalVitorias = historicoUsado.filter(g => g.resultado === 'vitoria').length;
  const totalDerrotas = historicoUsado.filter(g => g.resultado === 'derrota').length;
  const totalPontos   = historicoUsado.reduce((s, g) => s + g.pontosGanhos, 0);

  return (
    <div style={{ padding: '16px 16px 24px' }}>
      {/* Resumo dos últimos 10 jogos */}
      <div className="glass-card-gold" style={{ padding: '12px 16px', marginBottom: 16 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700,
          color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.08em', marginBottom: 10,
        }}>
          Últimas 10 Partidas
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, color: '#2dc653' }}>{totalVitorias}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Vitórias</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, color: '#e63946' }}>{totalDerrotas}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Derrotas</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900,
              color: totalPontos >= 0 ? '#2dc653' : '#e63946',
            }}>
              {totalPontos > 0 ? '+' : ''}{totalPontos}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Saldo de pts</div>
          </div>
        </div>
      </div>

      {/* Lista de partidas */}
      <div>
        {loading && ehProprio ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Carregando histórico...
          </div>
        ) : (
          historicoUsado.map(g => <GameCard key={g.id} game={g} />)
        )}
      </div>

      <div style={{ textAlign: 'center', padding: '16px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>
        {ehProprio ? `ÚItímas ${historicoUsado.length} partidas` : 'Exibindo as últimas 10 partidas'}
      </div>
    </div>
  );
}

// ── ProfileOverlay (main) ────────────────────────────────────
const TAB_COMPONENTS = [PerfilTab, StatsTab, ConquistasTab, MeusJogosTab];

export function ProfileOverlay() {
  const { popOverlay, getActiveOverlayProps } = useNavigationStore();
  const { usuario } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);

  if (!usuario) return null;

  const props = getActiveOverlayProps();
  const usuarioId = props.usuarioId as string | undefined;
  const usuarioDireto = props.usuario as Usuario | undefined;
  const editMode = !!props.editMode;

  // Hook para buscar perfil público (se for terceiro)
  const { usuario: usuarioPublico } = usePerfilPublico(usuarioId && !usuarioDireto ? usuarioId : undefined);

  // Prioridade: objeto direto > busca por ID/hook > usuario logado
  const usuarioExibido: Usuario | null =
    usuarioDireto ?? usuarioPublico ?? usuario;

  if (!usuarioExibido) return null;

  const ehPerfildoAmigo = !!(usuarioId || usuarioDireto);
  const ActiveContent = TAB_COMPONENTS[activeTab];

  // Handler que só fecha ao clicar NO BACKDROP, não dentro do modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Se clicou no próprio backdrop (não em child), fecha
    if (e.currentTarget === e.target) {
      popOverlay();
    }
  };

  return (
    <ProfileContext.Provider value={usuarioExibido}>
      <div className="overlay" style={{ alignItems: 'stretch' }}>
        <div
          className="overlay-backdrop"
          onClick={handleBackdropClick}
          style={{ pointerEvents: 'auto' }}
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="modal-sheet"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 480,
            background: 'var(--obsidian-700)',
            display: 'flex',
            flexDirection: 'column',
            margin: 'auto auto 0',
            height: '92vh',
            minHeight: '60vh',
            pointerEvents: 'auto',
          }}
        >
          {/* Handle */}
          <div style={{
            width: 36, height: 4, background: 'rgba(255,255,255,0.15)',
            borderRadius: 2, margin: '12px auto 0', flexShrink: 0,
          }} />

          {/* Cabeçalho fixo */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px 10px',
            paddingTop: 'max(12px, env(safe-area-inset-top))',
            flexShrink: 0,
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900,
              color: 'var(--text-primary)', margin: 0,
            }}>
              {ehPerfildoAmigo ? `Perfil de ${usuarioExibido.nick}` : 'Meu Perfil'}
            </h2>
          <button
            onClick={popOverlay}
            style={{
              background: 'rgba(255,255,255,0.07)', border: 'none',
              width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
              fontSize: 16, color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Bar */}
        <TabBar active={activeTab} onChange={setActiveTab} />

        {/* Conteúdo scrollável */}
        <div className="list-container" style={{ flex: 1, overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 0 ? <PerfilTab editModeOriginal={editMode} /> : <ActiveContent />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
    </ProfileContext.Provider>
  );
}
