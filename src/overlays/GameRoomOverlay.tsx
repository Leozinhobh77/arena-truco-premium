import { motion } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';

export function GameRoomOverlay() {
  const { popOverlay } = useNavigationStore();

  return (
    <div className="overlay" style={{ alignItems: 'stretch' }}>
      <div className="overlay-backdrop" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'relative', width: '100%', height: '100dvh',
          backgroundColor: 'var(--obsidian-900)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', margin: '0 auto', zIndex: 1
        }}
      >
      {/* PLACAR HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full px-4 py-4"
        style={{
          backgroundColor: 'var(--obsidian-900)',
        }}
      >
        {/* Container do Placar */}
        <div
          style={{
            width: '100%',
            backgroundColor: 'var(--obsidian-800)',
            border: '1px solid var(--border-subtle)',
            borderBottom: '2px solid var(--gold-400)',
            borderRadius: '8px',
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          {/* LINHA 1: HEADERS */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            padding: '10px 12px',
            minHeight: '35px',
            gap: '0'
          }}>
            {/* TIME */}
            <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div className="text-xs font-bold tracking-wider" style={{
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}>
                TIME
              </div>
            </div>

            {/* RODADA */}
            <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div className="text-xs font-bold tracking-wider" style={{
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}>
                RODADA
              </div>
            </div>

            {/* PONTOS */}
            <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div className="text-xs font-bold tracking-wider" style={{
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}>
                PONTOS
              </div>
            </div>

            {/* TENTOS */}
            <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div className="text-xs font-bold tracking-wider" style={{
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}>
                TENTOS
              </div>
            </div>

            {/* JOGOS */}
            <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="text-xs font-bold tracking-wider" style={{
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}>
                JOGOS
              </div>
            </div>
          </div>

          {/* DIVISOR */}
          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

          {/* LINHA 2: TIME 1 (VERMELHO) */}
          <div style={{
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'space-around',
            width: '100%',
            minHeight: '49px',
            gap: '0',
            position: 'relative'
          }}>
            {/* Container TIME 🔴 */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--ruby)',
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  flexShrink: 0
                }}
              />
            </div>

            {/* Container RODADA (3 bolinhas vazadas) */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', borderRight: '1px solid var(--border-subtle)' }}>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(255,255,255,0.5)',
                    backgroundColor: 'transparent',
                    flexShrink: 0
                  }}
                />
              ))}
            </div>

            {/* Container PONTOS */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                0
              </div>
            </div>

            {/* Container TENTOS (vazio nesta linha) */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }} />

            {/* Container JOGOS */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                0
              </div>
            </div>
          </div>

          {/* LINHA 3: TIME 2 (AZUL) + TENTOS GRANDE */}
          <div style={{
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'space-around',
            width: '100%',
            minHeight: '49px',
            gap: '0'
          }}>
            {/* Container TIME 🟣 */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--sapphire)',
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  flexShrink: 0
                }}
              />
            </div>

            {/* Container RODADA (3 bolinhas vazadas) */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', borderRight: '1px solid var(--border-subtle)' }}>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(255,255,255,0.5)',
                    backgroundColor: 'transparent',
                    flexShrink: 0
                  }}
                />
              ))}
            </div>

            {/* Container PONTOS */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                0
              </div>
            </div>

            {/* Container TENTOS com número 2 centralizado */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid var(--border-subtle)', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '56px',
                fontWeight: 'bold',
                color: 'var(--gold-400)',
                lineHeight: 1,
                zIndex: 10
              }}>
                2
              </div>
            </div>

            {/* Container JOGOS */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                0
              </div>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Conteúdo - Mesa Central */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'auto' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.2 }}>🎴</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Próximos componentes...
          </p>
        </div>

        {/* Botão SAIR */}
        <motion.button
          onClick={popOverlay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: '16px 48px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: 'rgba(230,57,70,0.15)',
            border: '1.5px solid var(--ruby)',
            borderRadius: '12px',
            color: 'var(--ruby)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(230,57,70,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(230,57,70,0.15)';
          }}
        >
          SAIR
        </motion.button>
      </div>
      </motion.div>
    </div>
  );
}
