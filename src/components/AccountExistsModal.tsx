// ============================================================
// AccountExistsModal — Modal elegante para conta existente
// Mostra quando email já tem uma conta cadastrada
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';

interface AccountExistsModalProps {
  isOpen: boolean;
  email: string;
  onGoToLogin: () => void;
  onTryAnother: () => void;
}

export function AccountExistsModal({
  isOpen,
  email,
  onGoToLogin,
  onTryAnother,
}: AccountExistsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onTryAnother}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999,
            }}
          />

          {/* Modal Bottom Sheet */}
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
                margin: '0 auto 24px',
              }}
            />

            {/* Conteúdo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Ícone + Título */}
              <div style={{ textAlign: 'center' }}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    fontSize: 64,
                    marginBottom: 16,
                  }}
                >
                  ⚠️
                </motion.div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                    marginBottom: 8,
                  }}
                >
                  Conta Já Existe
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: 'var(--text-muted)',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  Este email já tem uma conta cadastrada
                </p>
              </div>

              {/* Email */}
              <div
                style={{
                  background: 'rgba(212,160,23,0.1)',
                  border: '1px solid rgba(212,160,23,0.2)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    margin: '0 0 6px',
                  }}
                >
                  Email:
                </p>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--gold-400)',
                    margin: 0,
                    wordBreak: 'break-all',
                  }}
                >
                  {email}
                </p>
              </div>

              {/* Mensagem */}
              <div
                style={{
                  background: 'rgba(230,57,70,0.08)',
                  border: '1px solid rgba(230,57,70,0.2)',
                  borderRadius: 12,
                  padding: '12px 16px',
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  Você já tem uma conta com este email. Faça login ou escolha outro email para criar uma nova conta.
                </p>
              </div>

              {/* Ações */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={onGoToLogin}
                  style={{
                    padding: '14px 16px',
                    background: 'var(--gold-400)',
                    color: '#0a081e',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  🔵 IR PARA LOGIN
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={onTryAnother}
                  style={{
                    padding: '14px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  ← TENTAR OUTRO EMAIL
                </motion.button>
              </div>

              {/* Info */}
              <p
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                Esqueceu sua senha? Você pode recuperá-la no login.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
