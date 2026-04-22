// ============================================================
// DEIXAR RECADO OVERLAY — Arena Truco Premium
// Tela para enviar recados para amigos com emojis
// Mesmo padrão que ProfileOverlay, AmigosOnlineOverlay
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';

const EMOJIS_POPULARES = ['😄', '😂', '🤣', '😊', '❤️', '🔥', '💯', '👏', '🎉', '⚔️', '🏆', '🎮', '💪', '🚀', '😎', '👍'];

export function DeixarRecadoOverlay() {
  const { popOverlay, getActiveOverlayProps } = useNavigationStore();
  const props = getActiveOverlayProps();
  const amigoNick = (props.amigoNick as string) || 'Amigo';
  const amigoAvatar = (props.amigoAvatar as string) || '';

  const [recado, setRecado] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleAdicionarEmoji = (emoji: string) => {
    setRecado(recado + emoji);
  };

  const handleEnviar = async () => {
    if (!recado.trim()) {
      alert('Escreva algo para enviar!');
      return;
    }

    setEnviando(true);
    // Simula envio (depois conecta ao Supabase)
    setTimeout(() => {
      setEnviando(false);
      alert('Recado enviado com sucesso! 🎉');
      popOverlay();
    }, 1000);
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

        {/* Header com avatar do amigo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px 10px',
          paddingTop: 'max(14px, env(safe-area-inset-top))',
          flexShrink: 0,
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <img
            src={amigoAvatar}
            alt={amigoNick}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: '2px solid var(--gold-400)',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 900,
              color: 'var(--text-primary)',
              margin: '0 0 2px 0',
            }}>
              Mensagem para {amigoNick}
            </h2>
            <p style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              margin: 0,
            }}>
              ✨ Deixe um recado especial
            </p>
          </div>
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
          {/* Campo de Texto */}
          <textarea
            value={recado}
            onChange={(e) => setRecado(e.target.value.slice(0, 200))}
            placeholder="Escreva seu recado aqui... (máx. 200 caracteres)"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              minHeight: '100px',
              maxHeight: '150px',
              padding: '12px',
              borderRadius: 12,
              background: 'rgba(10,8,30,0.7)',
              border: '1px solid var(--gold-400)',
              color: 'white',
              fontFamily: 'inherit',
              fontSize: 13,
              outline: 'none',
              resize: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#f5c518';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--gold-400)';
            }}
          />

          {/* Contador de caracteres */}
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'right' }}>
            {recado.length}/200
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
              {EMOJIS_POPULARES.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => handleAdicionarEmoji(emoji)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: 20,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(212,160,23,0.3)';
                    e.currentTarget.style.border = '1px solid var(--gold-400)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {emoji}
                </button>
              ))}
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
            onClick={handleEnviar}
            disabled={enviando || !recado.trim()}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 10,
              background: enviando || !recado.trim() ? 'rgba(212,160,23,0.3)' : 'var(--gold-gradient)',
              border: 'none',
              color: enviando || !recado.trim() ? 'rgba(255,255,255,0.5)' : '#0a081e',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 13,
              cursor: enviando || !recado.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!enviando && recado.trim()) {
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {enviando ? '⏳ Enviando...' : '📬 Enviar Recado'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
