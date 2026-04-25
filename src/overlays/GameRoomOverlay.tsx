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
      {/* Header Simples */}
      <div
        className="w-full flex items-center justify-between px-4 py-3 border-b"
        style={{
          backgroundColor: 'var(--obsidian-800)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          🎮 Sala de Jogos
        </h1>
        <motion.button
          onClick={popOverlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-full flex items-center justify-center"
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

      {/* Conteúdo - Vazio por enquanto */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🎴</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Sala pronta para componentes...
          </p>
        </div>
      </div>
    </motion.div>
  );
}
