import type { Carta } from '../types';

interface PlayingCardProps {
  card: Carta;
  playable?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function PlayingCard({ card, playable, onClick, style }: PlayingCardProps) {
  const naipeSymbol = {
    paus: '♣',
    copas: '♥',
    espadas: '♠',
    ouros: '♦'
  }[card.naipe];

  const isRed = card.naipe === 'copas' || card.naipe === 'ouros';
  const color = isRed ? '#d91e3f' : '#1a1a1a';

  return (
    <div
      onClick={onClick}
      style={{
        width: '60px',
        height: '90px',
        backgroundColor: '#ffffff',
        border: '2px solid #1a1a1a',
        borderRadius: '6px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px',
        position: 'relative',
        cursor: playable ? 'pointer' : 'default',
        opacity: playable ? 1 : 0.6,
        ...style
      }}
    >
      <div style={{ fontSize: '12px', fontWeight: 'bold', color }}>
        {card.valor}
      </div>
      <div style={{ fontSize: '24px', color, opacity: 0.3 }}>
        {naipeSymbol}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 'bold', color, transform: 'rotate(180deg)' }}>
        {card.valor}
      </div>
    </div>
  );
}
