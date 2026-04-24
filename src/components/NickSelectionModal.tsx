import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useValidateAuth } from '../hooks/useValidateAuth';
import { ValidationErrorModal } from './ValidationErrorModal';
import type { ValidationError } from '../hooks/useValidateAuth';

interface NickSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (nick: string) => void;
  carregando?: boolean;
}

export function NickSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  carregando = false,
}: NickSelectionModalProps) {
  const [nick, setNick] = useState('');
  const { nickError, validating, validateNick, clearErrors } = useValidateAuth();
  const [modal, setModal] = useState<{ aberto: boolean; dados: ValidationError | null }>({
    aberto: false,
    dados: null,
  });

  useEffect(() => {
    if (isOpen) {
      clearErrors();
      setNick('');
      fecharModal();
    }
  }, [isOpen, clearErrors]);

  const fecharModal = () => setModal({ aberto: false, dados: null });
  const abrirModal = (dados: ValidationError) => setModal({ aberto: true, dados });

  const handleNickBlur = async () => {
    if (!nick.trim()) return;
    const err = await validateNick(nick.trim());
    if (err) abrirModal(err);
  };

  const handleConfirm = async () => {
    if (!nick.trim()) return;
    const err = await validateNick(nick.trim());
    if (err) {
      abrirModal(err);
      return;
    }
    onConfirm(nick.trim());
  };

  const handleClose = () => {
    setNick('');
    clearErrors();
    onClose();
  };

  const isNickValid = nick.trim().length >= 3 && !nickError;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
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
                {/* Header */}
                <div style={{ textAlign: 'center' }}>
                  <h2
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      margin: 0,
                      marginBottom: 8,
                    }}
                  >
                    Criar Conta com Google
                  </h2>
                  <p
                    style={{
                      fontSize: 14,
                      color: 'var(--text-muted)',
                      margin: 0,
                    }}
                  >
                    Escolha seu Nick de Truqueiro
                  </p>
                </div>

                {/* Campo de Nick */}
                <div style={{ position: 'relative', width: '100%' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: 18,
                      pointerEvents: 'none',
                      zIndex: 2,
                    }}
                  >
                    🎮
                  </span>
                  <input
                    className={`input-field ${nickError ? 'input-error' : ''}`}
                    style={{
                      paddingLeft: 48,
                      paddingRight: isNickValid ? 40 : 16,
                    }}
                    type="text"
                    placeholder="Nick de truqueiro"
                    value={nick}
                    onChange={(e) => setNick(e.target.value)}
                    onBlur={handleNickBlur}
                    autoFocus
                    disabled={carregando || validating}
                  />
                  {isNickValid && (
                    <span
                      style={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: 18,
                        color: '#10b981',
                      }}
                    >
                      ✅
                    </span>
                  )}
                </div>

                {/* Feedback de validação */}
                {nick.trim().length > 0 && nick.trim().length < 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: 12, color: '#e63946', paddingLeft: 4 }}
                  >
                    ⚠️ Mínimo 3 caracteres
                  </motion.div>
                )}
                {isNickValid && !validating && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: 12, color: '#10b981', paddingLeft: 4 }}
                  >
                    ✅ Nick disponível!
                  </motion.div>
                )}
                {validating && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: 12, color: 'var(--gold-400)', paddingLeft: 4 }}
                  >
                    🔍 Verificando disponibilidade...
                  </motion.div>
                )}

                {/* Ações */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <motion.button
                    whileTap={isNickValid && !carregando && !validating ? { scale: 0.96 } : {}}
                    onClick={handleConfirm}
                    disabled={!isNickValid || carregando || validating}
                    style={{
                      padding: '12px',
                      background: isNickValid && !carregando && !validating ? 'var(--gold-400)' : 'rgba(212,160,23,0.4)',
                      color: isNickValid && !carregando && !validating ? '#0a081e' : 'rgba(255,255,255,0.5)',
                      border: 'none',
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: isNickValid && !carregando && !validating ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                    }}
                  >
                    {carregando ? '🔄 ENTRANDO NA ARENA...' : validating ? '⏳ VERIFICANDO...' : '🔵 CONTINUAR COM GOOGLE'}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleClose}
                    disabled={carregando || validating}
                    style={{
                      padding: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: carregando || validating ? 'not-allowed' : 'pointer',
                      opacity: carregando || validating ? 0.5 : 1,
                    }}
                  >
                    ← Voltar
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
                  Você pode mudar seu nick depois nas configurações
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de erro de validação */}
      <ValidationErrorModal
        isOpen={modal.aberto}
        type={modal.dados?.type ?? 'nick_invalid'}
        message={modal.dados?.message ?? ''}
        suggestions={modal.dados?.suggestions}
        onClose={fecharModal}
        onSelectSuggestion={(sugestao) => {
          setNick(sugestao);
          fecharModal();
        }}
        onTryAnother={fecharModal}
      />
    </>
  );
}
