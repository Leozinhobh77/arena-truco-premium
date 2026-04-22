import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Carta } from '../types';
import clsx from 'clsx';

interface PlayingCardProps {
  card: Carta;
  hide?: boolean;
  playable?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const NAIPE_SIMBOLOS = {
  copas: '♥',
  espadas: '♠',
  ouros: '♦',
  paus: '♣'
};

const NAIPE_CORES = {
  copas: 'text-red-500',
  espadas: 'text-gray-900',
  ouros: 'text-red-500',
  paus: 'text-gray-900'
};

export function PlayingCard({ card, hide = false, playable = false, onClick, className, style }: PlayingCardProps) {
  // Rotação fixa por instância — evita recalcular a cada render
  const [hoverRotation] = useState(() => Math.random() * 4 - 2);

  // Verso da carta
  if (hide) {
    return (
      <motion.div
        className={clsx(
          "w-16 h-24 sm:w-20 sm:h-28 rounded-lg shadow-lg bg-[var(--obsidian-deep)] flex items-center justify-center border-2 border-yellow-600/30",
          className
        )}
        style={style}
        initial={{ rotateY: 180, opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="w-12 h-20 border border-yellow-700/20 rounded flex items-center justify-center">
          <div className="text-yellow-600/40 text-xl font-bold font-serif opacity-50">T</div>
        </div>
      </motion.div>
    );
  }

  const colorClass = NAIPE_CORES[card.naipe];
  const symbol = NAIPE_SIMBOLOS[card.naipe];

  return (
    <motion.div
      onClick={playable ? onClick : undefined}
      className={clsx(
        "relative w-16 h-24 sm:w-20 sm:h-28 rounded-lg shadow-xl bg-white border border-gray-300 flex flex-col justify-between p-1 cursor-default select-none group",
        playable && "cursor-pointer hover:shadow-2xl z-10",
        card.ehManilha && "ring-2 ring-yellow-400 ring-offset-1 shadow-yellow-500/50",
        className
      )}
      style={style}
      // Animações Premium Apple-like
      whileHover={playable ? { y: -15, scale: 1.05, rotate: hoverRotation } : {}}
      whileTap={playable ? { scale: 0.95 } : {}}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      layout
    >
      {/* Top Left */}
      <div className={clsx("flex flex-col items-center leading-none", colorClass)}>
        <span className="font-bold text-sm sm:text-base">{card.valor}</span>
        <span className="text-sm">{symbol}</span>
      </div>

      {/* Center Big */}
      <div className={clsx("absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 text-4xl sm:text-5xl", colorClass)}>
        {symbol}
      </div>

      {/* Bottom Right (Inverted) */}
      <div className={clsx("flex flex-col items-center leading-none rotate-180", colorClass)}>
        <span className="font-bold text-sm sm:text-base">{card.valor}</span>
        <span className="text-sm">{symbol}</span>
      </div>
    </motion.div>
  );
}
