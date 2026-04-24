// ============================================================
// STATUS EDITOR OVERLAY — Arena Truco Premium
// Permite editar o status message do jogador
// ============================================================

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useAuthStore } from '../stores/useAuthStore';

const EMOJIS_POPULARES = ['😄', '😂', '🤣', '😊', '❤️', '🔥', '💯', '👏', '🎉', '⚔️', '🏆', '🎮', '💪', '🚀', '😎', '👍', '✨', '🌟', '⭐', '🎯', '💎', '🏅'];

export function StatusEditorOverlay() {
  const { popOverlay } = useNavigationStore();
  const { usuario, atualizarPerfil } = useAuthStore();
  const [novoStatus, setNovoStatus] = useState(usuario?.statusMsg || '');
  const [salvando, setSalvando] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const MAX_HEIGHT = 170;

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const div = e.currentTarget;
    const novoTexto = div.textContent?.slice(0, 250) || '';
    setNovoStatus(novoTexto);

    // Forçar scrollTop = 0 para manter no topo (última linha fixa)
    div.scrollTop = 0;

    // Verificar se a altura ultrapassou o limite
    setTimeout(() => {
      if (div.scrollHeight > MAX_HEIGHT) {
        // Se ultrapassou, remover o último caractere digitado
        const textoLimitado = novoTexto.slice(0, -1);
        setNovoStatus(textoLimitado);
        div.textContent = textoLimitado;
      }
    }, 0);
  };

  const handleAdicionarEmoji = (emoji: string) => {
    if (novoStatus.length < 250 && contentEditableRef.current && contentEditableRef.current.scrollHeight <= MAX_HEIGHT) {
      const novoTexto = novoStatus + emoji;
      setNovoStatus(novoTexto);
      if (contentEditableRef.current) {
        contentEditableRef.current.textContent = novoTexto;
        contentEditableRef.current.scrollTop = 0;
      }
    }
  };

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      await atualizarPerfil({ status_msg: novoStatus });
      alert('Status atualizado com sucesso! ✨');
      popOverlay();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar status';
      alert(`Erro ao atualizar: ${errorMsg}`);
    } finally {
      setSalvando(false);
    }
  };

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
        }}
      >
        {/* Handle */}
        <div style={{
          width: 36,
          height: 4,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 2,
          margin: '12px auto 0',
          flexShrink: 0,
        }} />

        {/* Header */}
        <div style={{
          padding: '14px 16px 10px',
          paddingTop: 'max(14px, env(safe-area-inset-top))',
          flexShrink: 0,
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 900,
            color: 'var(--text-primary)',
            margin: '0 0 2px 0',
          }}>
            Seu Status
          </h2>
          <p style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            ✨ Mostre seu status para os amigos
          </p>
        </div>

        {/* Conteúdo */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {/* Campo de Texto — ContentEditable Div */}
          <div
            ref={contentEditableRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#f5c518';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--gold-400)';
            }}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              height: '170px',
              padding: '12px',
              borderRadius: 12,
              background: 'rgba(10,8,30,0.7)',
              border: '1px solid var(--gold-400)',
              color: 'white',
              fontFamily: 'inherit',
              fontSize: 15,
              lineHeight: 1.4,
              outline: 'none',
              overflow: 'hidden',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              transition: 'border-color 0.2s',
              cursor: 'text',
              scrollBehavior: 'auto',
            }}
          >
            {novoStatus}
          </div>

          {/* Contador de caracteres */}
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'right' }}>
            {novoStatus.length}/250
          </div>

          {/* Emojis Populares */}
          <div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 8,
            }}>
              ✨ Emojis Especiais
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: 6,
            }}>
              {EMOJIS_POPULARES.map((emoji, i) => {
                const podeAdicionarEmoji = novoStatus.length < 250 && contentEditableRef.current && contentEditableRef.current.scrollHeight <= MAX_HEIGHT;
                return (
                <button
                  key={i}
                  onClick={() => handleAdicionarEmoji(emoji)}
                  disabled={!podeAdicionarEmoji}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: 20,
                    cursor: podeAdicionarEmoji ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    opacity: podeAdicionarEmoji ? 1 : 0.5,
                  }}
                  onMouseEnter={(e) => {
                    if (podeAdicionarEmoji) {
                      e.currentTarget.style.background = 'rgba(212,160,23,0.3)';
                      e.currentTarget.style.border = '1px solid var(--gold-400)';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {emoji}
                </button>
              );
              })}
            </div>
          </div>
        </div>

        {/* Rodapé com botões */}
        <div style={{
          display: 'flex',
          gap: 8,
          padding: '12px 16px 16px',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          flexShrink: 0,
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <button
            onClick={() => popOverlay()}
            className="btn-secondary"
            style={{ flex: 1, padding: '10px 16px', fontSize: 13 }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={salvando}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 10,
              background: salvando ? 'rgba(212,160,23,0.3)' : 'var(--gold-gradient)',
              border: 'none',
              color: salvando ? 'rgba(255,255,255,0.5)' : '#0a081e',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 13,
              cursor: salvando ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!salvando) {
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {salvando ? '⏳ Salvando...' : '✨ Atualizar Status'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
