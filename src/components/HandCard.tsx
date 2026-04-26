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
          width: '56px',
          height: '84px',
          backgroundColor: '#ffffff',
          border: '1.5px solid #1a1a1a',
          borderRadius: '6px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.5)',
          display: 'flex',
          flexDirection: 'column',
          padding: '4px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Canto superior esquerdo - número grande */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0px'
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: color,
              lineHeight: '1.1'
            }}
          >
            {valorDisplay}
          </div>
        </div>

        {/* Centro - grande símbolo do naipe */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            color: color,
            opacity: 0.4
          }}
        >
          {naipeSymbol}
        </div>

        {/* Canto inferior direito - naipe pequeno */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            width: '100%'
          }}
        >
          <div
            style={{
              fontSize: '8px',
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
            top: '3px',
            left: '3px',
            right: '3px',
            bottom: '3px',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '4px',
            pointerEvents: 'none'
          }}
        />
      </div>
    </motion.div>
  );
}
