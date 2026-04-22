// ============================================================
// COMPONENT: ARENA ILLUSTRATION — ArenaIllustration.tsx
// Realista SVG da Arena MRV em perspectiva lateral/drone
// ============================================================

import { motion } from 'framer-motion';
import './ArenaIllustration.css';

export function ArenaIllustration() {
  return (
    <div className="arena-illustration-container">
      {/* Background landscape */}
      <svg viewBox="0 0 800 600" className="arena-svg">
        <defs>
          {/* Gradients para iluminação */}
          <radialGradient id="lightGradient" cx="50%" cy="20%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#D4A017" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.1" />
          </radialGradient>

          <linearGradient id="beamGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFD700" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#D4A017" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="columnGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#D4A017" stopOpacity="0.5" />
          </linearGradient>

          {/* Filter para blur dos beams */}
          <filter id="beamBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>

          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background escuro */}
        <rect width="800" height="600" fill="#0a0a14" />

        {/* Landscape/ground com detalhe */}
        <ellipse cx="400" cy="550" rx="350" ry="60" fill="#1a1a2e" opacity="0.6" />
        <path
          d="M 100 480 Q 200 470 400 475 Q 600 480 700 470 L 750 600 L 50 600 Z"
          fill="#0f0f1a"
          opacity="0.5"
        />

        {/* Light rays emanating from top center — perspectiva lateral */}
        <g className="light-rays">
          <line x1="400" y1="20" x2="180" y2="450" stroke="url(#beamGradient)" strokeWidth="12" opacity="0.6" filter="url(#beamBlur)" className="ray-1" />
          <line x1="400" y1="20" x2="250" y2="480" stroke="url(#beamGradient)" strokeWidth="10" opacity="0.5" filter="url(#beamBlur)" className="ray-2" />
          <line x1="400" y1="20" x2="620" y2="480" stroke="url(#beamGradient)" strokeWidth="10" opacity="0.5" filter="url(#beamBlur)" className="ray-3" />
          <line x1="400" y1="20" x2="690" y2="450" stroke="url(#beamGradient)" strokeWidth="12" opacity="0.6" filter="url(#beamBlur)" className="ray-4" />
        </g>

        {/* Red accent lights — top center (celebração) */}
        <g className="red-lights">
          <circle cx="350" cy="30" r="8" fill="#E63946" opacity="0.8" className="red-light-1" />
          <circle cx="450" cy="25" r="8" fill="#E63946" opacity="0.8" className="red-light-2" />
          <circle cx="320" cy="50" r="6" fill="#E63946" opacity="0.6" className="red-light-3" />
          <circle cx="480" cy="55" r="6" fill="#E63946" opacity="0.6" className="red-light-4" />
        </g>

        {/* ARENA — Oval structure com perspectiva lateral */}
        {/* Telhado/dome (curved top) */}
        <ellipse
          cx="400"
          cy="180"
          rx="220"
          ry="80"
          fill="none"
          stroke="#D4A017"
          strokeWidth="3"
          opacity="0.8"
        />

        {/* Telhado com estrutura curva */}
        <path
          d="M 180 180 Q 180 100 400 70 Q 620 100 620 180"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          opacity="0.6"
        />

        {/* Estrutura lateral esquerda — profundidade */}
        <path
          d="M 180 180 L 150 380 Q 180 420 220 430"
          fill="none"
          stroke="#D4A017"
          strokeWidth="2"
          opacity="0.5"
        />

        {/* Estrutura lateral direita — profundidade */}
        <path
          d="M 620 180 L 650 380 Q 620 420 580 430"
          fill="none"
          stroke="#D4A017"
          strokeWidth="2"
          opacity="0.5"
        />

        {/* COLUNAS ESTRUTURAIS — 11 colunas */}
        {/* Coluna 1 (esquerda extrema) */}
        <g className="column column-1">
          <rect x="185" y="140" width="14" height="260" fill="url(#columnGradient)" opacity="0.7" rx="2" />
          <rect x="185" y="140" width="14" height="260" fill="none" stroke="#D4A017" strokeWidth="1" rx="2" opacity="0.5" />
        </g>

        {/* Coluna 2 */}
        <g className="column column-2">
          <rect x="240" y="120" width="14" height="280" fill="url(#columnGradient)" opacity="0.8" rx="2" />
          <rect x="240" y="120" width="14" height="280" fill="none" stroke="#D4A017" strokeWidth="1" rx="2" opacity="0.5" />
        </g>

        {/* Coluna 3 */}
        <g className="column column-3">
          <rect x="295" y="100" width="14" height="300" fill="url(#columnGradient)" opacity="0.85" rx="2" />
          <rect x="295" y="100" width="14" height="300" fill="none" stroke="#D4A017" strokeWidth="1" rx="2" opacity="0.5" />
        </g>

        {/* Coluna 4 */}
        <g className="column column-4">
          <rect x="341" y="85" width="14" height="315" fill="url(#columnGradient)" opacity="0.9" rx="2" />
          <rect x="341" y="85" width="14" height="315" fill="none" stroke="#D4A017" strokeWidth="1" rx="2" opacity="0.5" />
        </g>

        {/* Coluna 5 (centro-esquerda) */}
        <g className="column column-5">
          <rect x="371" y="75" width="14" height="325" fill="url(#columnGradient)" opacity="0.95" rx="2" />
          <rect x="371" y="75" width="14" height="325" fill="none" stroke="#D4A017" strokeWidth="1" rx="2" opacity="0.6" />
        </g>

        {/* Coluna 6 (CENTER) — mais alta e destacada */}
        <g className="column column-6 column-center">
          <rect x="393" y="60" width="14" height="340" fill="url(#columnGradient)" opacity="1" rx="2" />
          <rect x="393" y="60" width="14" height="340" fill="none" stroke="#FFD700" strokeWidth="2" rx="2" opacity="0.8" />
        </g>

        {/* Coluna 7 (centro-direita) */}
        <g className="column column-7">
          <rect x="415" y="75" width="14" height="325" fill="url(#columnGradient)" opacity="0.95" rx="2" />
          <rect x="415" y="75" width="14" height="325" fill="none" stroke="#D4A017" strokeWidth="1" rx="2" opacity="0.6" />
        </g>

        {/* Coluna 8 */}
        <g className="column column-8">
          <rect x="445" y="85" width="14" height="315" fill="url(#columnGradient)" opacity="0.9" rx="2" />
          <rect x="445" y="85" width="14" height="315" fill="none" stroke="#D4A017" strokeWidth="1" rx="2" opacity="0.5" />
        </g>

        {/* Coluna 9 */}
        <g className="column column-9">
          <rect x="491" y="100" width="14" height="300" fill="url(#columnGradient)" opacity="0.85" rx="2" />
          <rect x="491" y="100" width="14" height="300" fill="none" stroke="#D4A017" strokeWidth="1" rx="2" opacity="0.5" />
        </g>

        {/* Coluna 10 */}
        <g className="column column-10">
          <rect x="546" y="120" width="14" height="280" fill="url(#columnGradient)" opacity="0.8" rx="2" />
          <rect x="546" y="120" width="14" height="280" fill="none" stroke="#D4A017" strokeWidth="1" rx="2" opacity="0.5" />
        </g>

        {/* Coluna 11 (direita extrema) */}
        <g className="column column-11">
          <rect x="601" y="140" width="14" height="260" fill="url(#columnGradient)" opacity="0.7" rx="2" />
          <rect x="601" y="140" width="14" height="260" fill="none" stroke="#D4A017" strokeWidth="1" rx="2" opacity="0.5" />
        </g>

        {/* Anel/ring estrutural superior (conecta colunas) */}
        <ellipse
          cx="400"
          cy="180"
          rx="215"
          ry="75"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          opacity="0.5"
        />

        {/* Anel/ring estrutural inferior */}
        <ellipse
          cx="400"
          cy="360"
          rx="210"
          ry="60"
          fill="none"
          stroke="#D4A017"
          strokeWidth="2"
          opacity="0.4"
        />

        {/* Entrada central com logo */}
        <g className="entrance">
          {/* Portão */}
          <rect x="370" y="320" width="60" height="100" fill="#0f0f1a" rx="4" />
          <rect x="370" y="320" width="60" height="100" fill="none" stroke="#D4A017" strokeWidth="2" rx="4" opacity="0.7" />

          {/* Logo central — AT (Arena Truco) */}
          <text
            x="400"
            y="375"
            textAnchor="middle"
            fontSize="32"
            fontWeight="bold"
            fill="#D4A017"
            opacity="0.9"
            className="arena-logo-text"
          >
            AT
          </text>
        </g>

        {/* Perimeter lights — ao redor da base */}
        <g className="perimeter-lights">
          <circle cx="220" cy="400" r="5" fill="#D4A017" opacity="0.7" className="light light-1" />
          <circle cx="280" cy="420" r="5" fill="#D4A017" opacity="0.7" className="light light-2" />
          <circle cx="340" cy="430" r="5" fill="#D4A017" opacity="0.7" className="light light-3" />
          <circle cx="400" cy="435" r="6" fill="#FFD700" opacity="0.9" className="light light-4" />
          <circle cx="460" cy="430" r="5" fill="#D4A017" opacity="0.7" className="light light-5" />
          <circle cx="520" cy="420" r="5" fill="#D4A017" opacity="0.7" className="light light-6" />
          <circle cx="580" cy="400" r="5" fill="#D4A017" opacity="0.7" className="light light-7" />
        </g>

        {/* Glow effect ao redor da arena */}
        <ellipse
          cx="400"
          cy="280"
          rx="240"
          ry="160"
          fill="url(#lightGradient)"
          opacity="0.3"
        />
      </svg>

      {/* Floating particles (celebração) */}
      <div className="particles-container">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{ y: 0, opacity: 0.8 }}
            animate={{
              y: -300,
              opacity: 0,
              x: Math.sin(i) * 100,
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            style={{
              left: `${(i / 12) * 100}%`,
              width: `${4 + Math.random() * 4}px`,
              height: `${4 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
