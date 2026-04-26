import { useState } from 'react';
import { motion } from 'framer-motion';

interface PlayingCardProps {
  valor: '4' | '5' | '6' | '7' | 'Q' | 'J' | 'K' | 'A' | '2' | '3';
  naipe: 'paus' | 'copas' | 'espadas' | 'ouros';
}

export function HandCard({ valor, naipe }: PlayingCardProps) {
  const [isSelected, setIsSelected] = useState(false);

  const naipeSymbol = {
    paus: '♣',
    copas: '♥',
    espadas: '♠',
    ouros: '♦'
  }[naipe];

  const isRed = naipe === 'copas' || naipe === 'ouros';
  const color = isRed ? '#d91e3f' : '#1a1a1a';

  const valorDisplay = {
    '4': '4', '5': '5', '6': '6', '7': '7',
    'Q': 'Q', 'J': 'J', 'K': 'K', 'A': 'A',
    '2': '2', '3': '3'
  }[valor];

  return (
    <motion.div
      animate={isSelected ? { scale: 1.15 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => setIsSelected(!isSelected)}
      style={{
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <div
        style={{
          width: '80px',
          height: '120px',
          backgroundColor: '#ffffff',
          border: '2px solid #1a1a1a',
          borderRadius: '8px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Canto superior esquerdo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: color,
              lineHeight: '1'
            }}
          >
            {valorDisplay}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: color,
              lineHeight: '1'
            }}
          >
            {naipeSymbol}
          </div>
        </div>

        {/* Centro - grande símbolo */}
        <div
          style={{
            fontSize: '36px',
            color: color,
            opacity: 0.3
          }}
        >
          {naipeSymbol}
        </div>

        {/* Canto inferior direito (invertido) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            transform: 'rotate(180deg)'
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: color,
              lineHeight: '1'
            }}
          >
            {valorDisplay}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: color,
              lineHeight: '1'
            }}
          >
            {naipeSymbol}
          </div>
        </div>

        {/* Decoração na borda */}
        <div
          style={{
            position: 'absolute',
            top: '4px',
            left: '4px',
            right: '4px',
            bottom: '4px',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '4px',
            pointerEvents: 'none'
          }}
        />
      </div>
    </motion.div>
  );
}
