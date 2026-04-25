import { motion } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';

export function GameRoomOverlay() {
  const { popOverlay } = useNavigationStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-screen flex flex-col"
      style={{
        backgroundColor: 'var(--obsidian-900)',
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
          className="w-full rounded-lg overflow-hidden"
          style={{
            backgroundColor: 'var(--obsidian-800)',
            border: '1px solid var(--border-subtle)',
            borderBottom: '2px solid var(--gold-400)',
          }}
        >
          {/* LINHA 1: HEADERS */}
          <div className="flex items-center justify-between px-4 py-3" style={{ minHeight: '44px' }}>
            {/* TIME */}
            <div style={{ flex: '0.8', textAlign: 'center' }}>
              <div className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
                TIME
              </div>
            </div>

            {/* RODADA */}
            <div style={{ flex: '1.2', textAlign: 'center' }}>
              <div className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
                RODADA
              </div>
            </div>

            {/* PONTOS */}
            <div style={{ flex: '0.8', textAlign: 'center' }}>
              <div className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
                PONTOS
              </div>
            </div>

            {/* TENTOS */}
            <div style={{ flex: '0.8', textAlign: 'center' }}>
              <div className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
                TENTOS
              </div>
            </div>

            {/* JOGOS */}
            <div style={{ flex: '0.8', textAlign: 'center' }}>
              <div className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
                JOGOS
              </div>
            </div>

            {/* EXIT BUTTON */}
            <div style={{ flex: '0.6', display: 'flex', justifyContent: 'center' }}>
              <motion.button
                onClick={popOverlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                ×
              </motion.button>
            </div>
          </div>

          {/* DIVISOR */}
          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

          {/* LINHA 2: TIME 1 (VERMELHO) */}
          <div className="flex items-center justify-between px-4 py-3" style={{ minHeight: '48px' }}>
            {/* TIME 🔴 */}
            <div style={{ flex: '0.8', display: 'flex', justifyContent: 'center' }}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--ruby)',
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
              />
            </div>

            {/* RODADA (3 bolinhas vazadas) */}
            <div style={{ flex: '1.2', display: 'flex', justifyContent: 'center', gap: '6px' }}>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full"
                  style={{
                    border: '1.5px solid rgba(255,255,255,0.4)',
                    backgroundColor: 'transparent',
                  }}
                />
              ))}
            </div>

            {/* PONTOS */}
            <div style={{ flex: '0.8', textAlign: 'center' }}>
              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                0
              </div>
            </div>

            {/* TENTOS (compartilhado, vazio aqui) */}
            <div style={{ flex: '0.8' }} />

            {/* JOGOS */}
            <div style={{ flex: '0.8', textAlign: 'center' }}>
              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                0
              </div>
            </div>

            {/* EXIT SPACE */}
            <div style={{ flex: '0.6' }} />
          </div>

          {/* LINHA 3: TIME 2 (AZUL) + TENTOS GRANDE */}
          <div className="flex items-center justify-between px-4 py-3" style={{ minHeight: '48px' }}>
            {/* TIME 🟣 */}
            <div style={{ flex: '0.8', display: 'flex', justifyContent: 'center' }}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--sapphire)',
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
              />
            </div>

            {/* RODADA (3 bolinhas vazadas) */}
            <div style={{ flex: '1.2', display: 'flex', justifyContent: 'center', gap: '6px' }}>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full"
                  style={{
                    border: '1.5px solid rgba(255,255,255,0.4)',
                    backgroundColor: 'transparent',
                  }}
                />
              ))}
            </div>

            {/* PONTOS */}
            <div style={{ flex: '0.8', textAlign: 'center' }}>
              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                0
              </div>
            </div>

            {/* TENTOS GRANDE (compartilhado entre times) */}
            <div style={{ flex: '0.8', textAlign: 'center', position: 'relative', top: '-12px' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--gold-400)' }}>
                2
              </div>
            </div>

            {/* JOGOS */}
            <div style={{ flex: '0.8', textAlign: 'center' }}>
              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                0
              </div>
            </div>

            {/* EXIT SPACE */}
            <div style={{ flex: '0.6' }} />
          </div>
        </div>
      </motion.div>

      {/* Conteúdo - Vazio por enquanto */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">🎴</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Próximos componentes...
          </p>
        </div>
      </div>
    </motion.div>
  );
}
