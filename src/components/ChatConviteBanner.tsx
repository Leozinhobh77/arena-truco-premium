// ============================================================
// ChatConviteBanner — Banner animado de convite no topo
// ============================================================
// Fixed top, slide down animation, auto-dismiss em 30s
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Convite } from '../hooks/useChatConvite';

interface ChatConviteBannerProps {
  convite: Convite | null;
  onAceitar: () => void;
  onRecusar: () => void;
  onDismiss: () => void;
}

export function ChatConviteBanner({
  convite,
  onAceitar,
  onRecusar,
  onDismiss,
}: ChatConviteBannerProps) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isVisible, setIsVisible] = useState(false);

  // Update countdown
  useEffect(() => {
    if (!convite) return;

    setIsVisible(true);
    setTimeLeft(30);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [convite]);

  // Auto-dismiss após countdown chegar a 0
  useEffect(() => {
    if (timeLeft === 0 && isVisible === false) {
      const timeout = setTimeout(() => {
        onDismiss();
      }, 300); // Espera animação terminar
      return () => clearTimeout(timeout);
    }
  }, [timeLeft, isVisible, onDismiss]);

  const handleAceitar = useCallback(() => {
    if (convite) {
      onAceitar();
      setIsVisible(false);
    }
  }, [convite, onAceitar]);

  const handleRecusar = useCallback(() => {
    if (convite) {
      onRecusar();
      setIsVisible(false);
    }
  }, [convite, onRecusar]);

  const progressPercent = (timeLeft / 30) * 100;

  return (
    <AnimatePresence>
      {convite && isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: 'linear-gradient(180deg, var(--obsidian-700) 0%, rgba(16,18,27,0.95) 100%)',
            borderBottom: '2px solid var(--gold-400)',
            padding: '12px 16px',
            boxShadow: '0 8px 32px rgba(212,160,23,0.15)',
          }}
        >
          {/* Conteúdo do banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            {/* Avatar */}
            <img
              src={convite.deAvatar}
              alt={convite.deNick}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--gold-400)',
              }}
            />

            {/* Mensagem */}
            <span
              style={{
                flex: 1,
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              {convite.deNick} quer conversar
            </span>

            {/* Botões */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={handleAceitar}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: 6,
                  width: 32,
                  height: 32,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  transition: 'all 200ms',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
              >
                ✓
              </button>
              <button
                onClick={handleRecusar}
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none',
                  borderRadius: 6,
                  width: 32,
                  height: 32,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  transition: 'all 200ms',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Barra de progresso */}
          <div
            style={{
              height: 3,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'linear' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--gold-400) 0%, var(--gold-500) 100%)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
