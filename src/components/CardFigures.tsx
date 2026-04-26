interface FigureProps {
  tipo: 'Q' | 'J' | 'K';
  color: string;
}

export function CardFigure({ tipo, color }: FigureProps) {
  const isRed = color === '#d91e3f';

  if (tipo === 'Q') {
    return (
      <svg viewBox="0 0 120 100" width="58" height="72" style={{ overflow: 'visible' }}>
        {/* Capa/Manto traseiro */}
        <ellipse cx="80" cy="45" rx="28" ry="35" fill={isRed ? '#B22234' : '#1a3a6f'} opacity="0.8" />

        {/* Corpo/Vestido */}
        <path d="M 68 35 Q 65 50 68 75 L 92 75 Q 95 50 92 35 Z"
              fill={isRed ? '#DC143C' : '#FFD700'} />

        {/* Ombro/Capa elegante direita */}
        <path d="M 92 35 Q 100 38 102 50 Q 101 52 95 48 L 92 40"
              fill={isRed ? '#8B0000' : '#0052CC'} />

        {/* Ombro/Capa elegante esquerda */}
        <path d="M 68 35 Q 60 38 58 50 Q 59 52 65 48 L 68 40"
              fill={isRed ? '#8B0000' : '#0052CC'} />

        {/* Pescoço */}
        <rect x="76" y="28" width="8" height="8" fill="#E8C4A0" />

        {/* Cabeça */}
        <circle cx="80" cy="22" r="11" fill="#E8C4A0" />

        {/* Cabelo longo (vermelho/castanho) */}
        <path d="M 69 18 Q 65 15 65 25 Q 65 35 69 38"
              fill={isRed ? '#C41E3A' : '#3D2817'} />
        <path d="M 91 18 Q 95 15 95 25 Q 95 35 91 38"
              fill={isRed ? '#C41E3A' : '#3D2817'} />

        {/* Franja de cabelo */}
        <path d="M 72 10 Q 80 8 88 10"
              fill={isRed ? '#C41E3A' : '#3D2817'} />

        {/* Coroa detalhada */}
        <g>
          {/* Base da coroa */}
          <path d="M 68 12 Q 80 6 92 12"
                fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />

          {/* Picos da coroa */}
          <path d="M 72 12 L 73 5 L 75 12" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
          <path d="M 80 12 L 81 4 L 83 12" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
          <path d="M 88 12 L 89 5 L 91 12" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />

          {/* Gemas/Jóias na coroa */}
          <circle cx="73" cy="8" r="1.5" fill={isRed ? '#E8341C' : '#FF1493'} />
          <circle cx="81" cy="5" r="1.5" fill={isRed ? '#E8341C' : '#FF1493'} />
          <circle cx="89" cy="8" r="1.5" fill={isRed ? '#E8341C' : '#FF1493'} />
        </g>

        {/* Rosto - características */}
        <circle cx="76" cy="20" r="1.5" fill="#000" />
        <circle cx="84" cy="20" r="1.5" fill="#000" />

        {/* Nariz */}
        <line x1="80" y1="20" x2="80" y2="24" stroke="#D4A574" strokeWidth="1" />

        {/* Boca */}
        <path d="M 77 26 Q 80 28 83 26" stroke="#C41E3A" strokeWidth="1.5" fill="none" />

        {/* Brinco esquerdo */}
        <circle cx="69" cy="23" r="1.5" fill="#FFD700" />

        {/* Colar/Jóia no peito */}
        <circle cx="80" cy="33" r="2" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
      </svg>
    );
  }

  if (tipo === 'J') {
    return (
      <svg viewBox="0 0 80 100" width="58" height="72" style={{ overflow: 'visible' }}>
        {/* Capa/Manto */}
        <path d="M 25 40 Q 20 50 22 75 L 32 75 M 55 40 Q 60 50 58 75 L 48 75"
              fill={isRed ? '#B22234' : '#0052CC'} stroke={isRed ? '#8B0000' : '#003399'} strokeWidth="1.5" />

        {/* Armadura - peito */}
        <path d="M 30 42 L 28 70 L 52 70 L 50 42 Z"
              fill={isRed ? '#C0C0C0' : '#A9A9A9'} stroke="#808080" strokeWidth="1.5" />

        {/* Linhas de armadura */}
        <line x1="32" y1="45" x2="48" y2="45" stroke="#696969" strokeWidth="1" />
        <line x1="32" y1="55" x2="48" y2="55" stroke="#696969" strokeWidth="1" />
        <line x1="32" y1="65" x2="48" y2="65" stroke="#696969" strokeWidth="1" />

        {/* Cinto com fivela */}
        <rect x="28" y="52" width="24" height="4" fill="#8B4513" />
        <circle cx="40" cy="54" r="2.5" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />

        {/* Pescoço */}
        <rect x="36" y="34" width="8" height="8" fill="#E8C4A0" />

        {/* Cabeça */}
        <circle cx="40" cy="26" r="10" fill="#E8C4A0" />

        {/* Cabelo castanho */}
        <path d="M 30 22 Q 26 18 28 28 Q 28 32 30 34"
              fill="#654321" />
        <path d="M 50 22 Q 54 18 52 28 Q 52 32 50 34"
              fill="#654321" />

        {/* Capacete/Coroa de cavaleiro */}
        <path d="M 32 16 Q 40 12 48 16 L 48 22 Q 40 20 32 22 Z"
              fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />

        {/* Pena/Pluma vermelha do capacete */}
        <path d="M 40 12 Q 42 6 44 10"
              stroke={isRed ? '#DC143C' : '#FF4500'} strokeWidth="3"
              fill="none" strokeLinecap="round" />

        {/* Visor do capacete */}
        <line x1="35" y1="22" x2="45" y2="22" stroke="#808080" strokeWidth="1.5" />

        {/* Rosto */}
        <circle cx="36" cy="26" r="1.2" fill="#000" />
        <circle cx="44" cy="26" r="1.2" fill="#000" />

        {/* Nariz */}
        <line x1="40" y1="26" x2="40" y2="30" stroke="#D4A574" strokeWidth="0.8" />

        {/* Boca de cavaleiro - linha reta determinada */}
        <line x1="37" y1="32" x2="43" y2="32" stroke="#8B4513" strokeWidth="1" />

        {/* Espada na mão */}
        <g>
          {/* Cabo da espada */}
          <rect x="24" y="45" width="3" height="20" fill="#8B4513" rx="1.5" />

          {/* Guarda da espada */}
          <ellipse cx="25.5" cy="45" rx="5" ry="2" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />

          {/* Lâmina */}
          <path d="M 25.5 40 L 24 45 L 27 45 Z" fill="#C0C0C0" stroke="#696969" strokeWidth="1" />
          <line x1="25.5" y1="40" x2="25.5" y2="32" stroke="#C0C0C0" strokeWidth="2" />
        </g>
      </svg>
    );
  }

  if (tipo === 'K') {
    return (
      <svg viewBox="0 0 80 100" width="58" height="72" style={{ overflow: 'visible' }}>
        {/* Manto/Capa real traseira */}
        <ellipse cx="40" cy="50" rx="30" ry="40" fill={isRed ? '#8B0000' : '#003366'} opacity="0.9" />

        {/* Corpo/Vestes reais */}
        <path d="M 28 38 Q 26 55 30 78 L 50 78 Q 54 55 52 38 Z"
              fill={isRed ? '#DC143C' : '#0052CC'} stroke={isRed ? '#8B0000' : '#003399'} strokeWidth="1" />

        {/* Ornamentos do traje - quadrados dourados */}
        <rect x="32" y="45" width="3" height="3" fill="#FFD700" />
        <rect x="45" y="45" width="3" height="3" fill="#FFD700" />
        <rect x="32" y="58" width="3" height="3" fill="#FFD700" />
        <rect x="45" y="58" width="3" height="3" fill="#FFD700" />

        {/* Cinto largo real */}
        <rect x="26" y="56" width="28" height="6" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />

        {/* Fivela do cinto */}
        <rect x="37" y="58" width="6" height="4" fill="#8B4513" stroke="#696969" strokeWidth="1" />

        {/* Pescoço */}
        <rect x="36" y="30" width="8" height="8" fill="#E8C4A0" stroke="#D4A574" strokeWidth="0.5" />

        {/* Cabeça */}
        <circle cx="40" cy="22" r="11" fill="#E8C4A0" />

        {/* Cabelo/Barba castanha longa */}
        <path d="M 30 20 Q 26 15 28 32 Q 28 38 31 40"
              fill="#654321" />
        <path d="M 50 20 Q 54 15 52 32 Q 52 38 49 40"
              fill="#654321" />

        {/* Barba cheia */}
        <path d="M 34 30 Q 40 32 46 30" fill="#654321" />

        {/* Coroa GRANDE E REAL */}
        <g>
          {/* Base da coroa */}
          <path d="M 27 14 Q 40 8 53 14"
                fill="#FFD700" stroke="#DAA520" strokeWidth="2" />

          {/* Picos da coroa - maiores e mais detalhados */}
          <path d="M 31 14 L 30 3 L 33 10" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
          <path d="M 40 14 L 40 1 L 42 10" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
          <path d="M 49 14 L 50 3 L 47 10" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />

          {/* Arcos entre picos */}
          <path d="M 33 10 Q 36 11 40 10" fill="none" stroke="#DAA520" strokeWidth="1.5" />
          <path d="M 40 10 Q 44 11 47 10" fill="none" stroke="#DAA520" strokeWidth="1.5" />

          {/* Jóias/Gemas grandes na coroa */}
          <circle cx="31" cy="6" r="2" fill={isRed ? '#E8341C' : '#FF1493'} stroke="#DAA520" strokeWidth="0.5" />
          <circle cx="40" cy="2" r="2" fill={isRed ? '#E8341C' : '#FF1493'} stroke="#DAA520" strokeWidth="0.5" />
          <circle cx="49" cy="6" r="2" fill={isRed ? '#E8341C' : '#FF1493'} stroke="#DAA520" strokeWidth="0.5" />

          {/* Jóias no arco */}
          <circle cx="37" cy="9" r="1.5" fill="#FFD700" />
          <circle cx="43" cy="9" r="1.5" fill="#FFD700" />
        </g>

        {/* Rosto majestoso */}
        <circle cx="35" cy="21" r="1.5" fill="#000" />
        <circle cx="45" cy="21" r="1.5" fill="#000" />

        {/* Nariz */}
        <line x1="40" y1="21" x2="40" y2="26" stroke="#D4A574" strokeWidth="1.2" />

        {/* Boca séria/majestosa - linha reta */}
        <line x1="36" y1="29" x2="44" y2="29" stroke="#654321" strokeWidth="1.5" />

        {/* Brincos de ouro */}
        <circle cx="29" cy="24" r="1.5" fill="#FFD700" stroke="#DAA520" strokeWidth="0.5" />
        <circle cx="51" cy="24" r="1.5" fill="#FFD700" stroke="#DAA520" strokeWidth="0.5" />

        {/* Colar real no peito */}
        <path d="M 36 35 Q 40 38 44 35" fill="none" stroke="#FFD700" strokeWidth="2" />
        <circle cx="40" cy="38" r="2.5" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
      </svg>
    );
  }

  return null;
}
