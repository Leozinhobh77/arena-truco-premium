interface FigureProps {
  tipo: 'Q' | 'J' | 'K';
  color: string;
}

export function CardFigure({ tipo, color }: FigureProps) {
  const isRed = color === '#d91e3f';

  if (tipo === 'Q') {
    return (
      <svg viewBox="0 0 60 60" width="45" height="45" style={{ overflow: 'visible' }}>
        {/* Cabeça */}
        <circle cx="30" cy="18" r="10" fill={isRed ? '#FFB6C1' : '#F4A460'} />

        {/* Cabelo */}
        <path d="M 20 18 Q 20 8 30 8 Q 40 8 40 18" fill={isRed ? '#FF6B6B' : '#8B4513'} />

        {/* Coroa */}
        <path d="M 18 10 L 22 5 L 26 8 L 30 4 L 34 8 L 38 5 L 42 10"
              fill="#FFD700" stroke="#FFC700" strokeWidth="1" />

        {/* Corpo/Vestido */}
        <path d="M 22 28 Q 20 35 25 45 L 35 45 Q 40 35 38 28"
              fill={isRed ? '#FF69B4' : '#FFD700'} />

        {/* Braço esquerdo */}
        <rect x="15" y="28" width="6" height="12" fill={isRed ? '#FFB6C1' : '#F4A460'} rx="3" />

        {/* Braço direito */}
        <rect x="39" y="28" width="6" height="12" fill={isRed ? '#FFB6C1' : '#F4A460'} rx="3" />

        {/* Rosto - olhos */}
        <circle cx="26" cy="16" r="1.5" fill="#000" />
        <circle cx="34" cy="16" r="1.5" fill="#000" />

        {/* Boca */}
        <path d="M 28 20 Q 30 22 32 20" stroke="#000" strokeWidth="1" fill="none" />
      </svg>
    );
  }

  if (tipo === 'J') {
    return (
      <svg viewBox="0 0 60 60" width="45" height="45" style={{ overflow: 'visible' }}>
        {/* Cabeça */}
        <circle cx="30" cy="16" r="9" fill="#F4A460" />

        {/* Cabelo/Capacete */}
        <path d="M 21 16 Q 21 7 30 7 Q 39 7 39 16" fill="#FFD700" />

        {/* Pena/Pluma */}
        <path d="M 30 5 Q 32 1 34 3" stroke="#FF6B6B" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Corpo/Armadura */}
        <path d="M 23 25 Q 21 32 24 44 L 36 44 Q 39 32 37 25"
              fill={isRed ? '#FF69B4' : '#4169E1'} />

        {/* Cinto */}
        <rect x="22" y="32" width="16" height="3" fill="#FFD700" />

        {/* Braço esquerdo */}
        <rect x="16" y="26" width="5" height="14" fill="#F4A460" rx="2" />

        {/* Braço direito */}
        <rect x="39" y="26" width="5" height="14" fill="#F4A460" rx="2" />

        {/* Rosto - olhos */}
        <circle cx="26" cy="14" r="1.5" fill="#000" />
        <circle cx="34" cy="14" r="1.5" fill="#000" />

        {/* Boca sorriso */}
        <path d="M 27 19 Q 30 21 33 19" stroke="#000" strokeWidth="1" fill="none" />
      </svg>
    );
  }

  if (tipo === 'K') {
    return (
      <svg viewBox="0 0 60 60" width="45" height="45" style={{ overflow: 'visible' }}>
        {/* Cabeça */}
        <circle cx="30" cy="17" r="10" fill="#F4A460" />

        {/* Cabelo/Barba */}
        <path d="M 20 17 Q 20 8 30 8 Q 40 8 40 17" fill="#8B4513" />
        <path d="M 20 24 Q 22 28 30 28 Q 38 28 40 24" fill="#8B4513" />

        {/* Coroa Grande */}
        <path d="M 18 12 L 22 6 L 26 10 L 30 5 L 34 10 L 38 6 L 42 12"
              fill="#FFD700" stroke="#FFC700" strokeWidth="1.5" />

        {/* Gema da Coroa */}
        <circle cx="30" cy="8" r="2" fill="#FF6B6B" />

        {/* Corpo/Manto */}
        <path d="M 22 27 Q 20 35 24 46 L 36 46 Q 40 35 38 27"
              fill={isRed ? '#CC0000' : '#0066CC'} />

        {/* Capa/Manto lateral esquerdo */}
        <path d="M 22 27 Q 15 32 16 44 L 24 46"
              fill={isRed ? '#FF6B6B' : '#0099FF'} />

        {/* Capa/Manto lateral direito */}
        <path d="M 38 27 Q 45 32 44 44 L 36 46"
              fill={isRed ? '#FF6B6B' : '#0099FF'} />

        {/* Braço esquerdo */}
        <rect x="15" y="28" width="6" height="12" fill="#F4A460" rx="3" />

        {/* Braço direito */}
        <rect x="39" y="28" width="6" height="12" fill="#F4A460" rx="3" />

        {/* Rosto - olhos */}
        <circle cx="26" cy="15" r="1.5" fill="#000" />
        <circle cx="34" cy="15" r="1.5" fill="#000" />

        {/* Boca séria */}
        <line x1="27" y1="21" x2="33" y2="21" stroke="#000" strokeWidth="1" />
      </svg>
    );
  }

  return null;
}
