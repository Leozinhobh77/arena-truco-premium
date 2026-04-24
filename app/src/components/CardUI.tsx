import React from 'react';
import { motion } from 'framer-motion';
import type { Suit, Rank } from '../game/gameLogic';

interface CardUIProps {
  suit?: Suit;
  rank?: Rank;
  isHidden?: boolean;
  onClick?: () => void;
  className?: string;
  delay?: number;
  featured?: boolean;
}

const CardUI: React.FC<CardUIProps> = ({ suit, rank, isHidden, onClick, className = '', delay = 0, featured = false }) => {
  // Animates card entry
  const entryAnimation = {
    initial: { opacity: 0, y: 100, scale: 0.5 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { delay, duration: 0.4, type: 'spring' as const, stiffness: 200, damping: 20 }
  };

  if (isHidden) {
    return (
      <motion.div
        {...entryAnimation}
        className={`playing-card overflow-hidden bg-gradient-to-br from-[#121212] to-obsidian border-[2px] border-gold-dark ${className}`}
      >
        <div className="absolute inset-2 border border-gold/30 rounded flex justify-center items-center">
             <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center opacity-50">
                 <span className="text-gold font-serif text-xl">IA</span>
             </div>
        </div>
      </motion.div>
    );
  }

  const isRed = suit === '♥' || suit === '♦';

  return (
    <motion.div
      {...entryAnimation}
      whileHover={onClick ? { y: -15, scale: 1.05 } : {}}
      onClick={onClick}
      className={`playing-card flex flex-col justify-between p-2 shadow-2xl ${isRed ? 'red-suit' : 'black-suit'} ${featured ? 'ring-2 ring-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]' : ''} ${className}`}
    >
      {/* Top Left */}
      <div className="flex flex-col items-center self-start leading-none">
        <span className="font-serif font-bold text-xl md:text-2xl">{rank}</span>
        <span className="text-xl md:text-2xl">{suit}</span>
      </div>

      {/* Center Big Logo */}
      <div className="flex-grow flex items-center justify-center">
        <span className="text-5xl md:text-6xl opacity-80 drop-shadow-md">{suit}</span>
      </div>

      {/* Bottom Right (Flipped) */}
      <div className="flex flex-col items-center self-end leading-none rotate-180">
        <span className="font-serif font-bold text-xl md:text-2xl">{rank}</span>
        <span className="text-xl md:text-2xl">{suit}</span>
      </div>
    </motion.div>
  );
};

export default CardUI;
