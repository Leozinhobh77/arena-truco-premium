import { useState } from 'react';
import { motion } from 'framer-motion';
import { CardFigure } from './CardFigures';

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

  const isFigure = valor === 'Q' || valor === 'J' || valor === 'K';

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
          justifyContent: 'space-between',
          padding: '4px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Canto superior esquerdo - número grande + naipe pequeno */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '2px',
            paddingLeft: '3px'
          }}
        >
          <div
            style={{
              fontSize: '26px',
              fontWeight: '900',
              color: color,
              lineHeight: '1',
              letterSpacing: '-1px'
            }}
          >
            {valorDisplay}
          </div>
          <div
            style={{
              fontSize: '15px',
              color: color,
              lineHeight: '1'
            }}
          >
            {naipeSymbol}
          </div>
        </div>

        {/* Canto inferior direito - naipe grande OU figura */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            width: '100%',
            marginBottom: '-2px',
            marginRight: isFigure ? '-16px' : '-4px'
          }}
        >
          {isFigure ? (
            <CardFigure tipo={valor as 'Q' | 'J' | 'K'} color={color} />
          ) : (
            <div
              style={{
                fontSize: '44px',
                color: color,
                lineHeight: '1'
              }}
            >
              {naipeSymbol}
            </div>
          )}
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
