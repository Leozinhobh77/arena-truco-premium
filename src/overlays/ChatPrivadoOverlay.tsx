// ============================================================
// ChatPrivadoOverlay — Chat full-screen entre amigos
// ============================================================
// Bolhas iMessage-style, emoji picker, histórico completo
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useChatPrivado } from '../hooks/useChatPrivado';

interface ChatPrivadoOverlayProps {
  amigoId: string;
  amigoNick: string;
  amigoAvatar: string;
}

const EMOJIS = [
  '😀', '😂', '🥰', '😎', '🤔', '😤',
  '😭', '🤣', '👍', '👏', '🔥', '💪',
  '🎉', '🏆', '⚔️', '🃏', '😈', '🤝',
  '💬', '❤️', '💰', '🎯', '👀', '🫡',
];

export function ChatPrivadoOverlay({ amigoId, amigoNick, amigoAvatar }: ChatPrivadoOverlayProps) {
  const popOverlay = useNavigationStore((state) => state.popOverlay);
  const currentUser = useAuthStore((state) => state.usuario);

  const [inputValue, setInputValue] = useState('');
  const [mostrarEmojis, setMostrarEmojis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mensagens, loading, enviarMensagem } = useChatPrivado(
    currentUser?.id,
    amigoId
  );

  // Auto-scroll para o fim ao receber nova mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const handleSend = () => {
    if (inputValue.trim()) {
      enviarMensagem(inputValue);
      setInputValue('');
      setMostrarEmojis(false);
      inputRef.current?.focus();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInputValue((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Formata hora (HH:MM)
  const formatarHora = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--obsidian-900)',
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'linear-gradient(180deg, var(--obsidian-700) 0%, rgba(16,18,27,0.95) 100%)',
          borderBottom: '1px solid rgba(212,160,23,0.2)',
        }}
      >
        {/* Botão Fechar */}
        <button
          onClick={() => popOverlay()}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
            color: 'var(--text-primary)',
            padding: '4px 8px',
          }}
        >
          ✕
        </button>

        {/* Avatar + Nick + Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src={amigoAvatar}
            alt={amigoNick}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--gold-400)',
            }}
          />
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              {amigoNick}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#10b981',
                }}
              />
              Online
            </div>
          </div>
        </div>

        {/* Espaço vazio */}
        <div style={{ width: 32 }} />
      </div>

      {/* ===== MENSAGENS ===== */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: 40 }}>
            Carregando histórico...
          </div>
        ) : mensagens.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: 40 }}>
            Comece uma conversa 👋
          </div>
        ) : (
          mensagens.map((msg) => {
            const ehMeu = msg.remetente_id === currentUser?.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                style={{
                  display: 'flex',
                  justifyContent: ehMeu ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                  }}
                >
                  <div
                    style={{
                      background: ehMeu
                        ? 'rgba(212,160,23,0.15)'
                        : 'rgba(255,255,255,0.06)',
                      border: ehMeu
                        ? '1px solid var(--gold-400)'
                        : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      padding: '10px 14px',
                      wordWrap: 'break-word',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      lineHeight: 1.4,
                    }}
                  >
                    {msg.texto}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      marginTop: 4,
                      textAlign: ehMeu ? 'right' : 'left',
                      paddingLeft: 4,
                      paddingRight: 4,
                    }}
                  >
                    {formatarHora(msg.criado_em)}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ===== INPUT + EMOJIS ===== */}
      <div
        style={{
          borderTop: '1px solid rgba(212,160,23,0.2)',
          background: 'var(--obsidian-800)',
          padding: '12px 16px',
        }}
      >
        {/* Emoji Picker */}
        <AnimatePresence>
          {mostrarEmojis && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 8,
                padding: '12px',
                marginBottom: '12px',
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '8px',
              }}
            >
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(212,160,23,0.3)',
                    borderRadius: 6,
                    padding: '8px',
                    fontSize: 20,
                    cursor: 'pointer',
                    transition: 'all 200ms',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(212,160,23,0.1)';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.2)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                  }}
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          {/* Emoji Button */}
          <button
            onClick={() => setMostrarEmojis(!mostrarEmojis)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(212,160,23,0.3)',
              borderRadius: 6,
              width: 40,
              height: 40,
              cursor: 'pointer',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 200ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                'rgba(212,160,23,0.1)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            😀
          </button>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Digite uma mensagem..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(212,160,23,0.2)',
              borderRadius: 6,
              padding: '10px 12px',
              color: 'var(--text-primary)',
              fontSize: 14,
              outline: 'none',
              transition: 'all 200ms',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--gold-400)';
              e.currentTarget.style.background = 'rgba(212,160,23,0.05)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212,160,23,0.2)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            style={{
              background: inputValue.trim()
                ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-500) 100%)'
                : 'rgba(212,160,23,0.2)',
              border: 'none',
              borderRadius: 6,
              width: 40,
              height: 40,
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: inputValue.trim() ? 'var(--obsidian-900)' : 'var(--text-muted)',
              transition: 'all 200ms',
            }}
            onMouseEnter={(e) => {
              if (inputValue.trim()) {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </motion.div>
  );
}
