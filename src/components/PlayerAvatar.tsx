import type { Jogador } from '../types';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot } from 'lucide-react';

interface PlayerAvatarProps {
  player: Jogador;
  position: 'top' | 'bottom' | 'left' | 'right';
  isCurrentTurn?: boolean;
  falando?: string; // Alguma fala do chat / provocação
}

// Map position to avatar glow classes
const BORDER_COLORS = {
  nos: 'ring-truco-blue/50 border-truco-blue',
  eles: 'ring-truco-red/50 border-truco-red'
};

export function PlayerAvatar({ player, position, isCurrentTurn, falando }: PlayerAvatarProps) {
  // Quantas cartas ele tem na mão?
  const cartasCount = player.cartas.length;

  return (
    <div className={clsx(
      "relative flex items-center justify-center pointer-events-none",
      position === 'bottom' ? 'flex-col-reverse' : 'flex-col'
    )}>
      
      {/* Avatar Pic */}
      <div className={clsx(
        "relative rounded-full border-2 w-14 h-14 sm:w-16 sm:h-16 shadow-2xl bg-gray-800 flex items-center justify-center overflow-hidden transition-all duration-300",
        BORDER_COLORS[player.time],
        isCurrentTurn ? 'ring-4 scale-110 shadow-[0_0_20px_rgba(255,215,0,0.5)] border-yellow-400 z-10' : ''
      )}>
        <img src={player.avatar} alt={player.nome} className="w-full h-full object-cover" />
        
        {/* Ícone de BOT */}
        {player.isBot && (
          <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1 border border-gray-600">
            <Bot size={12} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* Info Tag */}
      <div className={clsx(
        "mt-2 mb-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-xs border border-white/10 flex flex-col items-center",
        isCurrentTurn ? "text-yellow-400 font-bold border-yellow-400/50" : "text-white"
      )}>
        <span className="truncate max-w-[80px] sm:max-w-[100px]">{player.nome}</span>
        {/* Count das cartas para oponentes */}
        {position !== 'bottom' && (
          <span className="text-[10px] text-gray-400 mt-0.5 tracking-widest">
            {Array.from({ length: cartasCount }).map((_, i) => '🎴').join('')}
          </span>
        )}
      </div>

      {/* Chat Bubble Animado */}
      <AnimatePresence>
        {falando && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: position === 'bottom' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={clsx(
              "absolute z-20 px-3 py-2 bg-white text-black font-semibold text-xs rounded-xl shadow-xl max-w-[120px] sm:max-w-[150px] text-center",
              position === 'bottom' ? 'bottom-full mb-4' : 'top-full mt-4',
              position === 'left' ? 'left-full ml-4 top-1/2 -translate-y-1/2' : '',
              position === 'right' ? 'right-full mr-4 top-1/2 -translate-y-1/2' : ''
            )}
          >
            {/* O "rabo" do balão */}
            <div className={clsx(
              "absolute w-2 h-2 bg-white rotate-45",
              position === 'bottom' ? '-bottom-1 left-1/2 -translate-x-1/2' : '',
              position === 'top' ? '-top-1 left-1/2 -translate-x-1/2' : '',
              position === 'left' ? '-left-1 top-1/2 -translate-y-1/2' : '',
              position === 'right' ? '-right-1 top-1/2 -translate-y-1/2' : ''
            )} />
            <span className="relative z-10">{falando}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
