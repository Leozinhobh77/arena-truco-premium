// ============================================================
// SOLICITAÇÕES DE AMIZADE OVERLAY — Arena Truco Premium
// Lista de solicitações recebidas + recados de recusas
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';
import {
  useSolicitacoesPendentes,
  useMinhasSolicitacoesEnviadas,
  useAmizadeActions,
} from '../hooks/useAmizade';
import type { SolicitacaoAmizade } from '../types';

// ── Helpers ─────────────────────────────────────────────────
function tempoRelativo(dataIso: string): string {
  const agora = new Date();
  const data = new Date(dataIso);
  const diff = agora.getTime() - data.getTime();
  const min = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);

  if (min < 1) return 'Agora';
  if (min < 60) return `${min}min atrás`;
  if (h < 24) return `${h}h atrás`;
  if (d < 30) return `${d}d atrás`;
  return data.toLocaleDateString('pt-BR');
}

// ── Card de Solicitação ─────────────────────────────────────
function SolicitacaoCard({
  sol,
  onAceitar,
  onRecusar,
  processando,
}: {
  sol: SolicitacaoAmizade;
  onAceitar: (id: string) => void;
  onRecusar: (id: string) => void;
  processando: boolean;
}) {
  const winRate = Math.round((sol.remetenteVitorias / Math.max(sol.remetentePartidas, 1)) * 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0, padding: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 14,
        background: 'rgba(212,160,23,0.06)',
        border: '1px solid rgba(212,160,23,0.2)',
        marginBottom: 8,
      }}
    >
      {/* Avatar */}
      <img
        src={sol.remetenteAvatar}
        alt={sol.remetenteNick}
        style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '2px solid var(--gold-400)', flexShrink: 0,
        }}
      />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
          color: 'var(--text-primary)', marginBottom: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {sol.remetenteNick}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3 }}>
          <span style={{
            fontSize: 9, padding: '1px 6px', borderRadius: 10,
            background: 'rgba(212,160,23,0.15)',
            color: 'var(--gold-400)', fontWeight: 700,
          }}>
            Lv {sol.remetenteNivel}
          </span>
          {sol.remetentePartidas > 0 && (
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {winRate}% WR · {sol.remetenteVitorias}V
            </span>
          )}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          {tempoRelativo(sol.criadoEm)}
        </div>
      </div>

      {/* Botões */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <motion.button
          whileTap={{ scale: 0.92 }}
          disabled={processando}
          onClick={() => onAceitar(sol.id)}
          style={{
            padding: '7px 12px', borderRadius: 10, border: 'none',
            background: 'var(--gold-gradient)', color: '#0a081e',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11,
            cursor: processando ? 'not-allowed' : 'pointer',
            opacity: processando ? 0.5 : 1,
          }}
        >
          ✅
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          disabled={processando}
          onClick={() => onRecusar(sol.id)}
          style={{
            padding: '7px 10px', borderRadius: 10,
            background: 'rgba(230,57,70,0.1)',
            border: '1px solid rgba(230,57,70,0.3)',
            color: '#e63946',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11,
            cursor: processando ? 'not-allowed' : 'pointer',
            opacity: processando ? 0.5 : 1,
          }}
        >
          ✕
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Card de Recusa (recado) ─────────────────────────────────
function RecusaCard({ sol }: { sol: SolicitacaoAmizade }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 12,
        background: 'rgba(230,57,70,0.06)',
        border: '1px solid rgba(230,57,70,0.15)',
        marginBottom: 6,
      }}
    >
      <img
        src={sol.remetenteAvatar}
        alt={sol.remetenteNick}
        style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '1.5px solid rgba(230,57,70,0.4)', flexShrink: 0,
          filter: 'grayscale(0.3)',
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: 'var(--text-primary)', marginBottom: 2 }}>
          😔 <span style={{ fontWeight: 700 }}>{sol.remetenteNick}</span> recusou sua solicitação
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          {tempoRelativo(sol.atualizadoEm)} · Aguarde 24h para enviar novamente
        </div>
      </div>
    </motion.div>
  );
}

// ── Overlay Principal ───────────────────────────────────────
export function SolicitacoesOverlay() {
  const { popOverlay } = useNavigationStore();
  const { solicitacoes, loading: loadingSol, recarregar: recarregarSol } = useSolicitacoesPendentes();
  const { recusadas, loading: loadingRec } = useMinhasSolicitacoesEnviadas();
  const { aceitarSolicitacao, recusarSolicitacao, loading: processando } = useAmizadeActions();

  const [aba, setAba] = useState<'recebidas' | 'respostas'>('recebidas');
  const [toast, setToast] = useState<string | null>(null);

  const handleAceitar = async (id: string) => {
    const sol = solicitacoes.find(s => s.id === id);
    const { ok } = await aceitarSolicitacao(id);
    if (ok) {
      setToast(`🎉 Você e ${sol?.remetenteNick ?? 'o jogador'} agora são amigos!`);
      setTimeout(() => setToast(null), 3000);
      recarregarSol();
    }
  };

  const handleRecusar = async (id: string) => {
    const { ok } = await recusarSolicitacao(id);
    if (ok) {
      recarregarSol();
    }
  };

  const loading = loadingSol || loadingRec;

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
          maxHeight: '85vh',
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
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 900,
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              🤝 Solicitações
            </h2>
            <p style={{
              fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0',
            }}>
              {solicitacoes.length > 0
                ? `${solicitacoes.length} pendente${solicitacoes.length !== 1 ? 's' : ''}`
                : 'Nenhuma pendente'}
            </p>
          </div>
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

        {/* Tabs */}
        <div style={{
          display: 'flex', margin: '0 16px 12px', padding: 3,
          background: 'rgba(255,255,255,0.05)', borderRadius: 10,
          flexShrink: 0,
        }}>
          {(['recebidas', 'respostas'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setAba(tab)}
              style={{
                flex: 1, padding: '8px', borderRadius: 8, border: 'none',
                fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s',
                background: aba === tab ? 'var(--gold-gradient)' : 'transparent',
                color: aba === tab ? '#0a0a0f' : 'var(--text-muted)',
              }}
            >
              {tab === 'recebidas' ? `📥 Recebidas${solicitacoes.length > 0 ? ` (${solicitacoes.length})` : ''}` : `📤 Respostas${recusadas.length > 0 ? ` (${recusadas.length})` : ''}`}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="list-container" style={{ flex: 1, padding: '0 16px 16px', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
              ⏳ Carregando...
            </div>
          ) : aba === 'recebidas' ? (
            <AnimatePresence mode="popLayout">
              {solicitacoes.length > 0 ? (
                solicitacoes.map(sol => (
                  <SolicitacaoCard
                    key={sol.id}
                    sol={sol}
                    onAceitar={handleAceitar}
                    onRecusar={handleRecusar}
                    processando={processando}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 10, padding: '48px 16px',
                  }}
                >
                  <span style={{ fontSize: 40 }}>📭</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                    Nenhuma solicitação pendente
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                    Quando alguém quiser ser seu amigo, aparecerá aqui
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            /* Aba Respostas — recusas que eu recebi */
            <AnimatePresence>
              {recusadas.length > 0 ? (
                recusadas.map(sol => (
                  <RecusaCard key={sol.id} sol={sol} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 10, padding: '48px 16px',
                  }}
                >
                  <span style={{ fontSize: 40 }}>✅</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                    Nenhuma resposta
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                    Respostas de solicitações que você enviou aparecerão aqui
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Toast de sucesso */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                position: 'absolute', bottom: 80, left: 16, right: 16,
                background: 'rgba(45,198,83,0.15)',
                border: '1px solid rgba(45,198,83,0.4)',
                borderRadius: 12, padding: '12px 16px',
                textAlign: 'center',
                fontFamily: 'var(--font-display)', fontSize: 13,
                fontWeight: 700, color: '#2dc653',
              }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão Fechar */}
        <div style={{
          padding: '8px 16px 16px',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          flexShrink: 0,
        }}>
          <button
            className="btn-secondary"
            style={{ width: '100%', padding: '10px 16px', fontSize: 13 }}
            onClick={popOverlay}
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
