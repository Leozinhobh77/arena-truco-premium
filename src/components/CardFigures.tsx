interface FigureProps {
  tipo: 'Q' | 'J' | 'K';
  color: string;
}

export function CardFigure({ tipo, color }: FigureProps) {
  const isRed = color === '#d91e3f';

  // Cores por tipo e naipe
  const queenColor = isRed ? { dress: '#DC143C', cape: '#8B0000', skin: '#F5DEB3', hair: '#8B4513', crown: '#FFD700' }
                           : { dress: '#1a3a8a', cape: '#003399', skin: '#F5DEB3', hair: '#2F4F4F', crown: '#FFD700' };

  const knightColor = isRed ? { armor: '#C0C0C0', accent: '#DC143C', skin: '#F5DEB3', shield: '#DC143C' }
                            : { armor: '#A9A9A9', accent: '#1a3a8a', skin: '#F5DEB3', shield: '#003399' };

  const kingColor = isRed ? { robe: '#DC143C', cape: '#8B0000', skin: '#F5DEB3', hair: '#654321', crown: '#FFD700' }
                          : { robe: '#1a3a8a', cape: '#003399', skin: '#F5DEB3', hair: '#2F4F4F', crown: '#FFD700' };

  if (tipo === 'Q') {
    return (
      <svg viewBox="0 0 100 100" width="50" height="70" style={{ overflow: 'visible' }}>
        {/* Capa/Manto traseiro grande */}
        <ellipse cx="50" cy="50" rx="32" ry="38" fill={queenColor.cape} opacity="0.7" />

        {/* Corpo - Vestido longo e preenchido */}
        <path d="M 38 32 Q 35 45 36 75 L 64 75 Q 65 45 62 32 Q 60 30 50 30 Q 40 30 38 32 Z"
              fill={queenColor.dress} stroke={queenColor.cape} strokeWidth="0.5" />

        {/* Detalhes do vestido */}
        <path d="M 40 42 Q 42 55 42 68" fill="none" stroke={queenColor.cape} strokeWidth="0.8" opacity="0.5" />
        <path d="M 60 42 Q 58 55 58 68" fill="none" stroke={queenColor.cape} strokeWidth="0.8" opacity="0.5" />

        {/* Mangas/Braços */}
        <ellipse cx="35" cy="38" rx="5" ry="12" fill={queenColor.skin} />
        <ellipse cx="65" cy="38" rx="5" ry="12" fill={queenColor.skin} />

        {/* Pescoço */}
        <rect x="46" y="26" width="8" height="6" fill={queenColor.skin} />

        {/* Cabeça */}
        <circle cx="50" cy="18" r="9" fill={queenColor.skin} />

        {/* Cabelo volumoso */}
        <path d="M 41 15 Q 38 10 40 22 Q 40 28 42 30"
              fill={queenColor.hair} />
        <path d="M 59 15 Q 62 10 60 22 Q 60 28 58 30"
              fill={queenColor.hair} />
        <path d="M 44 8 Q 50 6 56 8"
              fill={queenColor.hair} />

        {/* Coroa majestosa */}
        <g>
          <path d="M 40 14 Q 50 8 60 14" fill={queenColor.crown} stroke="#DAA520" strokeWidth="1.2" />
          <path d="M 44 14 L 45 6 L 47 12" fill={queenColor.crown} stroke="#DAA520" strokeWidth="0.8" />
          <path d="M 50 14 L 51 4 L 53 12" fill={queenColor.crown} stroke="#DAA520" strokeWidth="0.8" />
          <path d="M 56 14 L 57 6 L 59 12" fill={queenColor.crown} stroke="#DAA520" strokeWidth="0.8" />
          <circle cx="45" cy="7" r="1.2" fill={isRed ? '#E8341C' : '#FF1493'} />
          <circle cx="51" cy="5" r="1.2" fill={isRed ? '#E8341C' : '#FF1493'} />
          <circle cx="57" cy="7" r="1.2" fill={isRed ? '#E8341C' : '#FF1493'} />
        </g>

        {/* Rosto */}
        <circle cx="46" cy="17" r="1.2" fill="#000" />
        <circle cx="54" cy="17" r="1.2" fill="#000" />
        <path d="M 50 18 L 50 20" stroke={queenColor.skin} strokeWidth="0.6" />
        <path d="M 47 22 Q 50 23 53 22" stroke="#C41E3A" strokeWidth="1" fill="none" />

        {/* Colar/Jóia */}
        <circle cx="50" cy="30" r="2" fill={queenColor.crown} stroke="#DAA520" strokeWidth="0.8" />
      </svg>
    );
  }

  if (tipo === 'J') {
    return (
      <svg viewBox="0 0 100 100" width="50" height="70" style={{ overflow: 'visible' }}>
        {/* Capa/Manto traseiro */}
        <ellipse cx="50" cy="55" rx="28" ry="32" fill={knightColor.accent} opacity="0.5" />

        {/* Corpo - Armadura principal */}
        <path d="M 35 38 Q 33 50 35 75 L 65 75 Q 67 50 65 38 Q 63 36 50 36 Q 37 36 35 38 Z"
              fill={knightColor.armor} stroke={knightColor.accent} strokeWidth="1" />

        {/* Pauldrons (ombros armados grandes) */}
        <ellipse cx="32" cy="40" rx="8" ry="14" fill={knightColor.armor} stroke="#696969" strokeWidth="0.8" />
        <ellipse cx="68" cy="40" rx="8" ry="14" fill={knightColor.armor} stroke="#696969" strokeWidth="0.8" />

        {/* Detalhe central armadura */}
        <path d="M 48 40 L 48 72" stroke="#696969" strokeWidth="1.5" />
        <rect x="40" y="48" width="20" height="4" fill="#696969" />
        <rect x="40" y="60" width="20" height="4" fill="#696969" />

        {/* Escudo na esquerda */}
        <g>
          <path d="M 25 42 L 20 48 L 22 65 Q 25 70 25 70 Q 25 70 28 65 L 30 48 Z"
                fill={knightColor.shield} stroke="#DAA520" strokeWidth="1.5" />
          <circle cx="25" cy="58" r="2.5" fill="#FFD700" />
        </g>

        {/* Espada na direita */}
        <g>
          {/* Lâmina grande */}
          <path d="M 75 40 L 73 48 L 73 68 L 77 68 L 77 48 Z"
                fill="#C0C0C0" stroke="#696969" strokeWidth="1.2" />
          <line x1="75" y1="42" x2="75" y2="25" stroke="#C0C0C0" strokeWidth="2.5" />

          {/* Guarda */}
          <ellipse cx="75" cy="48" rx="4" ry="2" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />

          {/* Cabo */}
          <rect x="73.5" y="48" width="3" height="15" fill="#8B4513" rx="1" />
        </g>

        {/* Pescoço */}
        <rect x="46" y="30" width="8" height="6" fill={knightColor.skin} />

        {/* Cabeça */}
        <circle cx="50" cy="22" r="10" fill={knightColor.skin} />

        {/* Cabelo/Elmo castanho */}
        <path d="M 42 18 Q 38 14 40 26 Q 40 30 42 32"
              fill="#654321" />
        <path d="M 58 18 Q 62 14 60 26 Q 60 30 58 32"
              fill="#654321" />

        {/* Capacete/Coroa de guerreiro */}
        <path d="M 36 16 Q 50 10 64 16 L 64 24 Q 50 22 36 24 Z"
              fill="#FFD700" stroke="#DAA520" strokeWidth="1.8" />

        {/* Crista vermelha do capacete */}
        <path d="M 50 10 Q 52 4 54 8"
              stroke={isRed ? '#DC143C' : '#FF6B35'} strokeWidth="4"
              fill="none" strokeLinecap="round" />

        {/* Visor do capacete */}
        <line x1="40" y1="24" x2="60" y2="24" stroke="#808080" strokeWidth="2" />

        {/* Rosto determinado */}
        <circle cx="44" cy="22" r="1.5" fill="#000" />
        <circle cx="56" cy="22" r="1.5" fill="#000" />

        {/* Nariz forte */}
        <line x1="50" y1="22" x2="50" y2="27" stroke="#D4A574" strokeWidth="1" />

        {/* Boca séria - linha reta */}
        <line x1="45" y1="30" x2="55" y2="30" stroke="#654321" strokeWidth="1.2" />

        {/* Colar/Protetor de pescoço em metal */}
        <ellipse cx="50" cy="34" rx="6" ry="3" fill="#A9A9A9" stroke="#696969" strokeWidth="0.8" />
      </svg>
    );
  }

  if (tipo === 'K') {
    return (
      <svg viewBox="0 0 100 100" width="50" height="70" style={{ overflow: 'visible' }}>
        {/* Capa/Manto real traseiro MAJESTOSO */}
        <ellipse cx="50" cy="55" rx="32" ry="38" fill={kingColor.cape} opacity="0.8" />

        {/* Capa traseira inferior */}
        <path d="M 30 50 Q 25 65 28 80 L 72 80 Q 75 65 70 50 Z"
              fill={kingColor.cape} opacity="0.6" />

        {/* Corpo/Vestes reais encorpadas */}
        <path d="M 32 40 Q 30 55 32 78 L 68 78 Q 70 55 68 40 Z"
              fill={kingColor.robe} stroke={kingColor.cape} strokeWidth="1.2" />

        {/* Pauldrons (ombros com capa drapeada) */}
        <ellipse cx="28" cy="42" rx="6" ry="12" fill={kingColor.cape} opacity="0.7" />
        <ellipse cx="72" cy="42" rx="6" ry="12" fill={kingColor.cape} opacity="0.7" />

        {/* Ornamentos reais - quadrados/losangos dourados */}
        <circle cx="38" cy="48" r="2.5" fill="#FFD700" stroke="#DAA520" strokeWidth="0.8" />
        <circle cx="62" cy="48" r="2.5" fill="#FFD700" stroke="#DAA520" strokeWidth="0.8" />
        <circle cx="38" cy="62" r="2.5" fill="#FFD700" stroke="#DAA520" strokeWidth="0.8" />
        <circle cx="62" cy="62" r="2.5" fill="#FFD700" stroke="#DAA520" strokeWidth="0.8" />

        {/* Cinto largo e majestoso */}
        <rect x="28" y="60" width="44" height="8" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
        <rect x="42" y="63" width="16" height="3" fill="#8B4513" stroke="#696969" strokeWidth="1" />

        {/* Joias no cinto */}
        <circle cx="36" cy="64" r="1.8" fill={isRed ? '#E8341C' : '#FF1493'} />
        <circle cx="50" cy="64" r="1.8" fill={isRed ? '#E8341C' : '#FF1493'} />
        <circle cx="64" cy="64" r="1.8" fill={isRed ? '#E8341C' : '#FF1493'} />

        {/* Pescoço largo */}
        <rect x="44" y="32" width="12" height="8" fill={kingColor.skin} stroke="#D4A574" strokeWidth="0.5" />

        {/* Cabeça grande e majestosa */}
        <circle cx="50" cy="20" r="12" fill={kingColor.skin} />

        {/* Cabelo volumoso castanho (rei jovem-adulto) */}
        <path d="M 38 16 Q 34 10 36 28 Q 36 34 39 37"
              fill={kingColor.hair} />
        <path d="M 62 16 Q 66 10 64 28 Q 64 34 61 37"
              fill={kingColor.hair} />
        <path d="M 42 8 Q 50 5 58 8"
              fill={kingColor.hair} />

        {/* Barba real cheia e imponente */}
        <path d="M 40 28 Q 50 31 60 28" fill={kingColor.hair} />
        <path d="M 42 32 Q 50 33 58 32" fill={kingColor.hair} opacity="0.7" />

        {/* Coroa GRANDE, MAJESTOSA E IMPONENTE */}
        <g>
          {/* Base da coroa reforçada */}
          <path d="M 25 15 Q 50 6 75 15"
                fill="#FFD700" stroke="#DAA520" strokeWidth="2.5" />

          {/* Picos altos e detalhados da coroa */}
          <path d="M 31 15 L 29 2 L 34 11" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
          <path d="M 50 15 L 50 0 L 52 11" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
          <path d="M 69 15 L 71 2 L 66 11" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />

          {/* Arcos magníficos entre picos */}
          <path d="M 34 11 Q 40 13 50 11" fill="none" stroke="#DAA520" strokeWidth="2" />
          <path d="M 50 11 Q 60 13 66 11" fill="none" stroke="#DAA520" strokeWidth="2" />

          {/* Gemas grandes e brilhantes na coroa */}
          <circle cx="31" cy="5" r="2.5" fill={isRed ? '#E8341C' : '#FF1493'} stroke="#DAA520" strokeWidth="1" />
          <circle cx="50" cy="1" r="2.5" fill={isRed ? '#E8341C' : '#FF1493'} stroke="#DAA520" strokeWidth="1" />
          <circle cx="69" cy="5" r="2.5" fill={isRed ? '#E8341C' : '#FF1493'} stroke="#DAA520" strokeWidth="1" />

          {/* Gemas nos arcos */}
          <circle cx="40" cy="10" r="2" fill="#FFD700" />
          <circle cx="60" cy="10" r="2" fill="#FFD700" />
        </g>

        {/* Rosto majestoso e determinado */}
        <circle cx="42" cy="19" r="1.8" fill="#000" />
        <circle cx="58" cy="19" r="1.8" fill="#000" />

        {/* Nariz real e nobre */}
        <line x1="50" y1="19" x2="50" y2="25" stroke="#D4A574" strokeWidth="1.3" />

        {/* Boca séria e majestosa - linha marcante */}
        <line x1="40" y1="30" x2="60" y2="30" stroke={kingColor.hair} strokeWidth="1.5" />

        {/* Brincos reais de ouro */}
        <circle cx="32" cy="22" r="2" fill="#FFD700" stroke="#DAA520" strokeWidth="0.8" />
        <circle cx="68" cy="22" r="2" fill="#FFD700" stroke="#DAA520" strokeWidth="0.8" />

        {/* Colar real majestoso */}
        <path d="M 41 35 Q 50 39 59 35" fill="none" stroke="#FFD700" strokeWidth="2.5" />
        <circle cx="50" cy="40" r="3" fill="#FFD700" stroke="#DAA520" strokeWidth="1.2" />
      </svg>
    );
  }

  return null;
}
