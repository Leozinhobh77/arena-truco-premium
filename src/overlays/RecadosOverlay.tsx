// ============================================================
// RECADOS OVERLAY — Arena Truco Premium
// Lista de recados recebidos de amigos
// Mesmo padrão que ProfileOverlay, AmigosOnlineOverlay
// ============================================================

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useRecados, useMarcarRecadoLido } from '../hooks/useRecados';

function formatarTempo(dataIso: string): string {
  const agora = new Date();
  const data = new Date(dataIso);
  const diff = agora.getTime() - data.getTime();

  const minutos = Math.floor(diff / (1000 * 60));
  const horas = Math.floor(diff / (1000 * 60 * 60));
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutos < 1) return 'Agora';
  if (minutos < 60) return `${minutos}min atrás`;
  if (horas < 24) return `${horas}h atrás`;
  if (dias < 30) return `${dias}d atrás`;

  return data.toLocaleDateString('pt-BR');
}

export function RecadosOverlay() {
  const { popOverlay } = useNavigationStore();
  const { recados, loading } = useRecados();
  const { marcarLido } = useMarcarRecadoLido();

  const recadosOrdenados = useMemo(() => {
    return [...recados].sort(
      (a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
    );
  }, [recados]);

  const marcarComoLido = async (recadoId: string) => {
    await marcarLido(recadoId);
  };

  const recadosNaoLidos = recadosOrdenados.filter(r => !r.lido);

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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px 10px',
          paddingTop: 'max(14px, env(safe-area-inset-top))',
          flexShrink: 0,
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 900,
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              📬 Meus Recados
            </h2>
            <p style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              margin: '2px 0 0 0',
            }}>
              {recadosNaoLidos.length > 0 ? `${recadosNaoLidos.length} novo${recadosNaoLidos.length !== 1 ? 's' : ''}` : 'Sem novos recados'}
            </p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="list-container" style={{ flex: 1, padding: '12px 16px' }}>
          {loading ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              minHeight: '200px',
            }}>
              <div style={{ fontSize: 24 }}>⏳</div>
              <div style={{
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Carregando...</div>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {recadosOrdenados.length > 0 ? (
              recadosOrdenados.map((recado, i) => {
                const ehNovo = !recado.lido;
                return (
                  <motion.div
                    key={recado.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => marcarComoLido(recado.id)}
                    style={{
                      padding: '12px',
                      borderRadius: 12,
                      background: ehNovo ? 'rgba(212,160,23,0.1)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${ehNovo ? 'rgba(212,160,23,0.3)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                      marginBottom: 8,
                    }}
                    whileHover={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    {/* Avatar */}
                    <img
                      src={recado.amigoAvatar}
                      alt={recado.amigoNick}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        border: '2px solid var(--gold-400)',
                        flexShrink: 0,
                      }}
                    />

                    {/* Conteúdo */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3 }}>
                        <span style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                        }}>
                          {recado.amigoNick}
                        </span>
                        {ehNovo && (
                          <span style={{
                            fontSize: 8,
                            padding: '2px 6px',
                            borderRadius: 10,
                            background: 'var(--gold-400)',
                            color: '#0a081e',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                          }}>
                            Novo
                          </span>
                        )}
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: 'var(--text-primary)',
                        lineHeight: 1.4,
                        marginBottom: 4,
                        wordBreak: 'break-word',
                      }}>
                        {recado.mensagem}
                      </div>
                      <div style={{
                        fontSize: 10,
                        color: 'var(--text-muted)',
                      }}>
                        {formatarTempo(recado.dataCriacao)}
                      </div>
                    </div>
                  </motion.div>
                  );
                })
              ) : (
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  minHeight: '200px',
                }}>
                  <div style={{ fontSize: 40 }}>📭</div>
                  <div style={{
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Nenhum recado ainda</div>
                    <div style={{ fontSize: 11 }}>Convide amigos para deixar recados especiais</div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Botão Fechar */}
        <div style={{
          padding: '8px 16px 16px',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          flexShrink: 0,
          borderTop: '1px solid var(--border-subtle)',
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
