// ============================================================
// TELA CLÃS — ClansScreen.tsx
// Lista de clãs, busca e chat
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigationStore } from '../stores/useNavigationStore';
import { CLANS_MOCK } from '../mockData';
import type { MensagemChat } from '../types';

// ── Componente Chat de Clã ────────────────────────────────────
function ClanChatView({ clanId, onClose }: { clanId: string; onClose: () => void }) {
  const { usuario } = useAuthStore();
  const clan = CLANS_MOCK.find(c => c.id === clanId);
  const [msgs, setMsgs] = useState<MensagemChat[]>(clan?.mensagens ?? []);
  const [texto, setTexto] = useState('');

  const enviar = () => {
    if (!texto.trim() || !usuario) return;
    const nova: MensagemChat = {
      id: `msg-${Date.now()}`,
      autorId: usuario.id,
      autorNome: usuario.nick,
      autorAvatar: usuario.avatar,
      texto: texto.trim(),
      timestamp: new Date(),
      tipo: 'chat',
    };
    setMsgs(p => [...p, nova]);
    setTexto('');
  };

  if (!clan) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 800,
        background: 'var(--obsidian-800)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Header do Chat */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 16px 12px',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
        background: 'var(--obsidian-900)',
      }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px 8px 4px 0' }}>←</button>
        <div style={{ fontSize: 32 }}>{clan.icone}</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{clan.nome}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{clan.membros} membros</div>
        </div>
      </div>

      {/* Área de mensagens */}
      <div className="list-container" style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {msgs.map(msg => {
          const isMine = msg.autorId === usuario?.id;
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
              {!isMine && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, paddingLeft: 4 }}>
                  <img src={msg.autorAvatar} alt="" style={{ width: 18, height: 18, borderRadius: '50%' }} />
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{msg.autorNome}</span>
                </div>
              )}
              <div className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>
                {msg.texto}
              </div>
              <span style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2, paddingLeft: 4, paddingRight: 4 }}>
                {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div style={{
        padding: '10px 12px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        gap: 8,
        flexShrink: 0,
        background: 'var(--obsidian-900)',
      }}>
        <input
          className="input-field"
          style={{ flex: 1, padding: '11px 14px', fontSize: 14 }}
          placeholder="Mensagem..."
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && enviar()}
        />
        <button
          onClick={enviar}
          style={{
            width: 44, height: 44,
            borderRadius: '50%',
            background: texto.trim() ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.07)',
            border: 'none',
            cursor: 'pointer',
            fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
        >
          ➤
        </button>
      </div>
    </motion.div>
  );
}

// ── Tela Principal de Clãs ────────────────────────────────────
export function ClansScreen() {
  const { pushOverlay } = useNavigationStore();
  const [busca, setBusca] = useState('');
  const [clanAberto, setClanAberto] = useState<string | null>(null);
  const [aba, setAba] = useState<'meu' | 'descobrir'>('descobrir');

  const meuClan = CLANS_MOCK[0];
  const clansFiltered = CLANS_MOCK.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) || c.tag.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '20px 16px 0', flexShrink: 0 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          fontWeight: 900,
          color: 'var(--text-primary)',
          margin: '0 0 12px',
          letterSpacing: '-0.02em',
        }}>
          🏠 Clãs
        </h1>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {(['meu', 'descobrir'] as const).map(t => (
            <button key={t} onClick={() => setAba(t)} style={{
              flex: 1, padding: '9px', borderRadius: 10, border: 'none',
              fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              background: aba === t ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.05)',
              color: aba === t ? '#0a0a0f' : 'var(--text-muted)',
            }}>
              {t === 'meu' ? '⭐ Meu Clã' : '🔍 Descobrir'}
            </button>
          ))}
        </div>
      </div>

      {aba === 'meu' ? (
        <div className="list-container" style={{ flex: 1, padding: '0 16px 16px' }}>
          {/* Card do meu clã */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card-gold"
            style={{ padding: 16, marginBottom: 12 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 40 }}>{meuClan.icone}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--gold-400)' }}>{meuClan.nome}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>#{meuClan.tag} · {meuClan.membros}/{meuClan.maxMembros} membros</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.5 }}>{meuClan.descricao}</p>
            <button
              className="btn-primary"
              style={{ fontSize: 15, padding: '12px 24px' }}
              onClick={() => setClanAberto(meuClan.id)}
            >
              💬 Abrir Chat do Clã
            </button>
          </motion.div>

          {/* Últimas mensagens preview */}
          {meuClan.mensagens.slice(-3).map(m => (
            <div key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-card)',
              marginBottom: 6,
            }}>
              <img src={m.autorAvatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>{m.autorNome}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.texto}</div>
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>
                {m.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Search */}
          <div style={{ padding: '0 16px 12px', flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>🔍</span>
              <input
                className="input-field"
                style={{ paddingLeft: 44 }}
                placeholder="Buscar clã por nome ou tag..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="list-container" style={{ flex: 1, padding: '0 16px 16px' }}>
            {clansFiltered.map((clan, i) => (
              <motion.div
                key={clan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setClanAberto(clan.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 14px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-card)',
                  marginBottom: 8,
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 36, lineHeight: 1 }}>{clan.icone}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
                    {clan.nome} <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>#{clan.tag}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{clan.membros}/{clan.maxMembros} membros</div>
                  {clan.ultimaMensagem && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {clan.ultimaMensagem}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); pushOverlay('criar-clan'); }}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 20,
                    background: 'rgba(212,160,23,0.1)',
                    color: 'var(--gold-400)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 11,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Entrar
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Chat View Overlay */}
      <AnimatePresence>
        {clanAberto && (
          <ClanChatView clanId={clanAberto} onClose={() => setClanAberto(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
