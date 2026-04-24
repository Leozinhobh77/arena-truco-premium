// ============================================================
// FRIEND ACTION SHEET — Arena Truco Premium
// Mini-card premium + ações para um amigo
// Agora com sistema de amizade integrado ao Supabase
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useStatusAmizade, useAmizadeActions } from '../hooks/useAmizade';
import type { Amigo, Usuario } from '../types';

interface FriendActionSheetProps {
  amigo: Amigo;
  onClose: () => void;
  status?: 'disponivel' | 'jogando' | 'offline';
}

interface ActionBtn {
  icon: string;
  label: string;
  destaque?: boolean;
  disabled?: boolean;
  acao: () => void;
}

export function FriendActionSheet({ amigo, onClose, status: statusProp }: FriendActionSheetProps) {
  const { pushOverlay } = useNavigationStore();
  const { status, amizadeId, loading: statusLoading, cooldownAte, euEnviei } = useStatusAmizade(amigo.id);
  const { enviarSolicitacao, aceitarSolicitacao, removerAmigo, loading: acaoLoading } = useAmizadeActions();

  const [toast, setToast] = useState<string | null>(null);
  const [cooldownTexto, setCooldownTexto] = useState('');

  const winRate = Math.round((amigo.vitorias / Math.max(amigo.partidas, 1)) * 100);

  // Se vem status prop (do AmigosOnlineOverlay), usa esse. Senão usa o do amigo
  const statusAtual = statusProp || amigo.statusAmigo;

  const statusLabel =
    statusAtual === 'disponivel'
      ? '🟢 Disponível para jogar'
      : statusAtual === 'jogando'
        ? `🟡 Jogando Truco${amigo.modoJogo ? ` ${amigo.modoJogo === 'paulista' ? 'Paulista' : 'Mineiro'}` : ''}${amigo.tempoJogandoMin ? ` • ${amigo.tempoJogandoMin}min` : ''}`
        : '⚫ Offline';

  const statusCor =
    statusAtual === 'disponivel' ? '#2dc653'
    : statusAtual === 'jogando' ? '#f5a623'
    : 'rgba(255,255,255,0.3)';

  const disponivel = statusAtual === 'disponivel';
  const jogando = statusAtual === 'jogando';

  // Cooldown timer
  useEffect(() => {
    if (!cooldownAte) { setCooldownTexto(''); return; }

    const atualizar = () => {
      const agora = new Date();
      const diff = cooldownAte.getTime() - agora.getTime();
      if (diff <= 0) {
        setCooldownTexto('');
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setCooldownTexto(`${h}h ${m}min`);
    };

    atualizar();
    const interval = setInterval(atualizar, 60000);
    return () => clearInterval(interval);
  }, [cooldownAte]);

  // Ações
  const handleEnviarSolicitacao = async () => {
    const { ok, erro } = await enviarSolicitacao(amigo.id);
    if (ok) {
      setToast('✅ Solicitação de amizade enviada!');
      setTimeout(() => { setToast(null); onClose(); }, 1500);
    } else {
      setToast(`❌ ${erro ?? 'Erro ao enviar'}`);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleAceitar = async () => {
    if (!amizadeId) return;
    const { ok } = await aceitarSolicitacao(amizadeId);
    if (ok) {
      setToast(`🎉 Você e ${amigo.nick} agora são amigos!`);
      setTimeout(() => { setToast(null); onClose(); }, 2000);
    }
  };

  const handleRemover = async () => {
    if (!amizadeId) return;
    const { ok } = await removerAmigo(amizadeId);
    if (ok) {
      setToast('Amizade removida');
      setTimeout(() => { setToast(null); onClose(); }, 1500);
    }
  };

  // ── Montar botões conforme estado ──────────────────────────
  const botoes: ActionBtn[] = [];

  // Se vem do AmigosOnlineOverlay (tem status prop), mostra ações contextuais
  if (statusProp) {
    // AÇÕES DO AMIGOS ONLINE OVERLAY
    if (statusProp === 'disponivel') {
      // Disponível: Recado | Perfil | Chat | Excluir
      botoes.push({
        icon: '💬',
        label: 'Deixar Recado',
        destaque: true,
        disabled: false,
        acao: () => {
          onClose();
          pushOverlay('deixar-recado', { amigoId: amigo.id, amigoNick: amigo.nick, amigoAvatar: amigo.avatar });
        },
      });
      botoes.push({
        icon: '💬',
        label: 'Chamar Chat',
        disabled: false,
        acao: () => {
          setToast('💬 Chat privado em breve!');
          setTimeout(() => setToast(null), 2000);
        },
      });
      botoes.push({
        icon: '🗑️',
        label: 'Excluir Amigo',
        disabled: acaoLoading,
        acao: handleRemover,
      });
    } else if (statusProp === 'jogando') {
      // Jogando: Assistir | Recado | Perfil | Chat❌
      botoes.push({
        icon: '👁️',
        label: 'Assistir Partida',
        destaque: true,
        disabled: false,
        acao: () => {
          setToast('👁️ Em breve você poderá assistir!');
          setTimeout(() => setToast(null), 2000);
        },
      });
      botoes.push({
        icon: '💬',
        label: 'Deixar Recado',
        disabled: false,
        acao: () => {
          onClose();
          pushOverlay('deixar-recado', { amigoId: amigo.id, amigoNick: amigo.nick, amigoAvatar: amigo.avatar });
        },
      });
      botoes.push({
        icon: '💬',
        label: 'Chat (Indisponível)',
        disabled: true,
        acao: () => {},
      });
    } else if (statusProp === 'offline') {
      // Offline: Recado | Perfil | Excluir
      botoes.push({
        icon: '💬',
        label: 'Deixar Recado',
        destaque: true,
        disabled: false,
        acao: () => {
          onClose();
          pushOverlay('deixar-recado', { amigoId: amigo.id, amigoNick: amigo.nick, amigoAvatar: amigo.avatar });
        },
      });
      botoes.push({
        icon: '🗑️',
        label: 'Excluir Amigo',
        disabled: acaoLoading,
        acao: handleRemover,
      });
    }
  } else {
    // AÇÕES DE AMIZADE (do ranking ou outros overlays)
    if (statusLoading) {
      botoes.push({ icon: '⏳', label: 'Carregando...', disabled: true, acao: () => {} });
    } else if (status === 'aceita') {
      // JÁ SÃO AMIGOS
      botoes.push({
        icon: '⚔️',
        label: disponivel ? 'Jogar Agora' : jogando ? 'Aguardando partida acabar' : 'Jogador offline',
        destaque: disponivel,
        disabled: !disponivel,
        acao: disponivel ? onClose : () => {},
      });
      botoes.push({
        icon: jogando ? '👁️' : '💬',
        label: jogando ? 'Assistir Partida' : 'Enviar Chat',
        disabled: false,
        acao: onClose,
      });
      botoes.push({
        icon: '📬',
        label: 'Deixar Recado',
        disabled: false,
        acao: () => {
          onClose();
          pushOverlay('deixar-recado', { amigoId: amigo.id, amigoNick: amigo.nick, amigoAvatar: amigo.avatar });
        },
      });
      botoes.push({
        icon: '❌',
        label: 'Remover Amigo',
        disabled: acaoLoading,
        acao: handleRemover,
      });
    } else if (status === 'pendente' && euEnviei) {
      botoes.push({ icon: '⏳', label: 'Solicitação Enviada', disabled: true, acao: () => {} });
    } else if (status === 'pendente' && !euEnviei) {
      botoes.push({
        icon: '✅',
        label: 'Aceitar Amizade',
        destaque: true,
        disabled: acaoLoading,
        acao: handleAceitar,
      });
    } else if (status === 'rejeitada' && cooldownTexto) {
      botoes.push({
        icon: '🚫',
        label: `Aguarde ${cooldownTexto}`,
        disabled: true,
        acao: () => {},
      });
    } else {
      botoes.push({
        icon: '➕',
        label: 'Adicionar Amigo',
        destaque: true,
        disabled: acaoLoading,
        acao: handleEnviarSolicitacao,
      });
    }
  }

  // Ver perfil sempre disponível
  botoes.push({
    icon: '👤',
    label: 'Ver Perfil Completo',
    disabled: false,
    acao: () => {
      onClose();
      const amigoComoUsuario: Usuario = {
        id: amigo.id,
        nome: amigo.nick,
        nick: amigo.nick,
        avatar: amigo.avatar,
        nivel: amigo.nivel,
        xp: 0,
        xpProximoNivel: 1000,
        moedas: 0,
        gemas: 0,
        pontos: 0,
        ranking: amigo.ranking,
        vitorias: amigo.vitorias,
        derrotas: 0,
        partidas: amigo.partidas,
        clan: amigo.clan,
      };
      pushOverlay('perfil', { usuarioDireto: amigoComoUsuario });
    },
  });

  return (
    <div className="overlay" style={{ alignItems: 'stretch' }}>
      <div className="overlay-backdrop" onClick={onClose} />
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

        {/* ── Mini-card de perfil premium ── */}
        <div style={{ padding: '16px 16px 0' }}>
          {/* Avatar + identidade */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={amigo.avatar}
                alt={amigo.nick}
                style={{
                  width: 64, height: 64, borderRadius: '50%',
                  border: `2.5px solid ${statusCor}`,
                  display: 'block',
                }}
              />
              {amigo.statusAmigo !== 'offline' && (
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    position: 'absolute', inset: -4,
                    borderRadius: '50%',
                    border: `1.5px solid ${statusCor}`,
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900,
                color: 'var(--text-primary)', marginBottom: 3,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {amigo.nick}
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3 }}>
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 20,
                  background: 'rgba(212,160,23,0.15)',
                  color: 'var(--gold-400)', fontWeight: 700,
                }}>
                  Nível {amigo.nivel}
                </span>
                {amigo.clan && (
                  <span style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 20,
                    background: 'rgba(255,255,255,0.06)',
                    color: 'var(--text-muted)', fontWeight: 600,
                  }}>
                    🏠 {amigo.clan}
                  </span>
                )}
                {/* Badge de status de amizade */}
                {status === 'aceita' && (
                  <span style={{
                    fontSize: 9, padding: '2px 8px', borderRadius: 20,
                    background: 'rgba(45,198,83,0.15)',
                    color: '#2dc653', fontWeight: 700,
                  }}>
                    🤝 Amigos
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: statusCor, fontWeight: 600 }}>
                {statusLabel}
              </div>
            </div>
          </div>

          {/* Mensagem de status */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10,
            padding: '8px 12px',
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.4 }}>
              "{amigo.statusMsg}"
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
            {[
              { label: 'Win Rate', value: `${winRate}%`, color: '#2dc653' },
              { label: 'Vitórias', value: amigo.vitorias, color: 'var(--text-primary)' },
              { label: 'Ranking',  value: `#${amigo.ranking}`, color: 'var(--gold-400)' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, padding: '8px 6px', textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, color: s.color }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divisor */}
        <div style={{ height: 1, background: 'var(--border-subtle)', flexShrink: 0 }} />

        {/* Botões */}
        <div className="list-container" style={{ flex: 1, padding: '12px 16px' }}>
          {botoes.map(b => (
            <motion.button
              key={b.label}
              whileTap={b.disabled ? undefined : { scale: 0.97 }}
              onClick={b.disabled ? undefined : b.acao}
              style={{
                width: '100%',
                padding: '11px 14px',
                background: b.destaque
                  ? 'rgba(212,160,23,0.1)'
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${b.destaque ? 'rgba(212,160,23,0.3)' : 'var(--border-subtle)'}`,
                borderRadius: 12,
                color: b.disabled
                  ? 'var(--text-muted)'
                  : b.destaque ? 'var(--gold-400)' : 'var(--text-primary)',
                fontSize: 14,
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                cursor: b.disabled ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8,
                opacity: b.disabled ? 0.45 : 1,
              }}
            >
              <span style={{ fontSize: 18 }}>{b.icon}</span>
              {b.label}
              {b.destaque && !b.disabled && (
                <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--gold-400)', opacity: 0.7 }}>›</span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                position: 'absolute', bottom: 70, left: 16, right: 16,
                background: toast.startsWith('❌') ? 'rgba(230,57,70,0.15)' : 'rgba(45,198,83,0.15)',
                border: `1px solid ${toast.startsWith('❌') ? 'rgba(230,57,70,0.4)' : 'rgba(45,198,83,0.4)'}`,
                borderRadius: 12, padding: '12px 16px',
                textAlign: 'center',
                fontFamily: 'var(--font-display)', fontSize: 13,
                fontWeight: 700, color: toast.startsWith('❌') ? '#e63946' : '#2dc653',
              }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ padding: '8px 16px 16px', flexShrink: 0 }}>
          <button
            className="btn-secondary"
            style={{ width: '100%', padding: '10px 16px', fontSize: 13 }}
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
