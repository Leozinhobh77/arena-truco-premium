import { motion } from 'framer-motion';

interface PlayerSlotProps {
  name: string;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  team: 'vermelho' | 'azul';
  avatar: string;
  namePosition?: 'top' | 'bottom';
  nameOrientation?: 'horizontal' | 'vertical';
}

export function PlayerSlot({ name, position, team, avatar, namePosition, nameOrientation }: PlayerSlotProps) {
  const teamColor = team === 'vermelho' ? 'var(--ruby)' : 'var(--sapphire)';
  const isHorizontal = position.includes('top') || position.includes('bottom');

  // Posições absolutas para cada slot
  const positionStyles = {
    'top-right': {
      top: '30px',
      right: '80px',
      transform: 'translate(50%, -50%)'
    },
    'top-left': {
      top: '100px',
      left: '20px',
      transform: 'translate(-50%, -50%)'
    },
    'bottom-left': {
      bottom: '170px',
      left: '80px',
      transform: 'translate(-50%, 50%)'
    },
    'bottom-right': {
      bottom: '210px',
      right: '20px',
      transform: 'translate(50%, 50%)'
    }
  };

  // Estilos para nome (horizontal vs vertical)
  const nameStyles = {
    horizontal: {
      position: 'absolute' as const,
      fontSize: '13px',
      fontWeight: 600,
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap' as const,
      ...(namePosition === 'top'
        ? { top: '-20px' }
        : namePosition === 'bottom'
        ? { bottom: '-28px' }
        : (position === 'top-right' || position === 'top-left'
          ? { bottom: '-28px' }
          : position === 'bottom-left'
          ? { bottom: '-15px' }
          : { top: '-28px' }))
    },
    vertical: {
      position: 'absolute' as const,
      fontSize: '12px',
      fontWeight: 600,
      color: 'var(--text-primary)',
      writingMode: 'vertical-rl' as const,
      transform: 'rotate(180deg)',
      whiteSpace: 'nowrap' as const,
      ...(position === 'top-left'
        ? { top: '25px', left: '-18px' }
        : position === 'bottom-right'
        ? { bottom: '30px', right: '-18px' }
        : position === 'bottom-left'
        ? { right: '-20px' }
        : { right: '-35px' })
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'absolute',
        ...positionStyles[position]
      }}
    >
      {/* Círculo com Avatar */}
      <div
        style={{
          position: 'relative',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          border: `4px solid ${teamColor}`,
          backgroundColor: 'var(--obsidian-800)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: `0 0 16px ${teamColor}80, inset 0 2px 8px rgba(0,0,0,0.3)`,
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.transform = 'scale(1.1)';
          el.style.boxShadow = `0 0 24px ${teamColor}, inset 0 2px 8px rgba(0,0,0,0.3)`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.transform = 'scale(1)';
          el.style.boxShadow = `0 0 16px ${teamColor}80, inset 0 2px 8px rgba(0,0,0,0.3)`;
        }}
      >
        {/* Avatar Placeholder */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 'bold',
            color: teamColor,
            backgroundImage: avatar ? `url(${avatar})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {!avatar && name.charAt(0).toUpperCase()}
        </div>

        {/* Badge de Team */}
        <div
          style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: teamColor,
            border: '2px solid var(--obsidian-900)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px'
          }}
        >
          {team === 'vermelho' ? '●' : '●'}
        </div>
      </div>

      {/* Nome do Jogador */}
      <div style={nameOrientation ? (nameOrientation === 'horizontal' ? nameStyles.horizontal : nameStyles.vertical) : (isHorizontal ? nameStyles.horizontal : nameStyles.vertical)}>
        {name}
      </div>
    </motion.div>
  );
}
