// ============================================================
// ValidationErrorModal — Bottom Sheet elegante para erros
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';

interface ValidationErrorModalProps {
  isOpen: boolean;
  type: 'email_exists' | 'nick_exists' | 'nick_invalid';
  message: string;
  suggestions?: string[];
  onClose: () => void;
  onSelectSuggestion?: (suggestion: string) => void;
  onGoToLogin?: () => void;
  onTryAnother?: () => void;
}

export function ValidationErrorModal({
  isOpen,
  type,
  message,
  suggestions,
  onClose,
  onSelectSuggestion,
  onGoToLogin,
  onTryAnother,
}: ValidationErrorModalProps) {
  const icons = {
    email_exists: '📧',
    nick_exists: '🎮',
    nick_invalid: '⚠️',
  };

  const actions: Record<string, { primary: string; secondary: string; onPrimary?: () => void; onSecondary?: () => void }> = {
    email_exists: {
      primary: 'Entrar com esse email',
      secondary: 'Tentar outro email',
      onPrimary: onGoToLogin,
      onSecondary: onTryAnother,
    },
    nick_exists: {
      primary: 'Ver sugestões',
      secondary: 'Tentar outro nick',
      onPrimary: undefined,
      onSecondary: onTryAnother,
    },
    nick_invalid: {
      primary: 'Tentar outro',
      secondary: 'Voltar',
      onPrimary: onTryAnother,
      onSecondary: onClose,
    },
  };

  const action = actions[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 999,
            }}
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              borderRadius: '24px 24px 0 0',
              background: 'var(--obsidian-800)',
              padding: 'max(24px, env(safe-area-inset-bottom))',
              borderTop: '1px solid var(--border-subtle)',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            {/* Handle */}
            <div
              style={{
                width: 40,
                height: 4,
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 2,
                margin: '0 auto 20px',
              }}
            />

            {/* Conteúdo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Header */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>
                  {icons[type]}
                </div>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                    marginBottom: 8,
                  }}
                >
                  {type === 'email_exists' && 'Email já cadastrado'}
                  {type === 'nick_exists' && 'Nick já em uso'}
                  {type === 'nick_invalid' && 'Nick inválido'}
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: 'var(--text-muted)',
                    margin: 0,
                  }}
                >
                  {message}
                </p>
              </div>

              {/* Sugestões */}
              {suggestions && suggestions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      margin: 0,
                      paddingBottom: 4,
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    💡 Sugestões
                  </p>
                  {suggestions.map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        onSelectSuggestion?.(suggestion);
                        onClose();
                      }}
                      style={{
                        padding: '12px',
                        background: 'rgba(212,160,23,0.1)',
                        border: '1px solid rgba(212,160,23,0.2)',
                        borderRadius: 10,
                        color: 'var(--gold-400)',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          'rgba(212,160,23,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          'rgba(212,160,23,0.1)';
                      }}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Ações */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    action.onPrimary?.();
                    onClose();
                  }}
                  style={{
                    padding: '12px',
                    background: 'var(--gold-400)',
                    color: '#0a081e',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {action.primary}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    action.onSecondary?.();
                    onClose();
                  }}
                  style={{
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {action.secondary}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
