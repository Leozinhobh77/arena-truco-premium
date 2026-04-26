export function CardDeck() {
  return (
    <div
      style={{
        position: 'relative',
        width: '80px',
        height: '110px',
        perspective: '1000px'
      }}
    >
      {/* Carta 3 (fundo) */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#e8f4f8',
          border: '2px solid #1a5f7f',
          borderRadius: '8px',
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(26,95,127,0.1) 2px, rgba(26,95,127,0.1) 4px),
            repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(26,95,127,0.1) 2px, rgba(26,95,127,0.1) 4px)
          `,
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          transform: 'translateY(8px) rotateZ(-2deg)',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Carta 2 (meio) */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#e8f4f8',
          border: '2px solid #1a5f7f',
          borderRadius: '8px',
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(26,95,127,0.1) 2px, rgba(26,95,127,0.1) 4px),
            repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(26,95,127,0.1) 2px, rgba(26,95,127,0.1) 4px)
          `,
          boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
          transform: 'translateY(4px) rotateZ(-1deg)',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Carta 1 (topo) */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#e8f4f8',
          border: '2px solid #1a5f7f',
          borderRadius: '8px',
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(26,95,127,0.1) 2px, rgba(26,95,127,0.1) 4px),
            repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(26,95,127,0.1) 2px, rgba(26,95,127,0.1) 4px)
          `,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)',
          transform: 'translateY(0px) rotateZ(0deg)',
          backfaceVisibility: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px) scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)';
        }}
      />
    </div>
  );
}
