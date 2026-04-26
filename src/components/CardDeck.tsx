export function CardDeck() {
  const patternStyle = `
    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 0%, transparent 30%),
    radial-gradient(circle at 80% 70%, rgba(255,255,255,0.06) 0%, transparent 40%),
    repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 6px),
    repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 6px)
  `;

  return (
    <div
      style={{
        position: 'relative',
        width: '56px',
        height: '77px',
        perspective: '1000px'
      }}
    >
      {/* Carta 3 (fundo) */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#1e40af',
          border: '1.5px solid #1e3a8a',
          borderRadius: '6px',
          backgroundImage: patternStyle,
          backgroundSize: '100% 100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          transform: 'translateY(6px) rotateZ(-2deg)',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Carta 2 (meio) */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#1e40af',
          border: '1.5px solid #1e3a8a',
          borderRadius: '6px',
          backgroundImage: patternStyle,
          backgroundSize: '100% 100%',
          boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
          transform: 'translateY(3px) rotateZ(-1deg)',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Carta 1 (topo) */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#1e40af',
          border: '1.5px solid #1e3a8a',
          borderRadius: '6px',
          backgroundImage: patternStyle,
          backgroundSize: '100% 100%',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.1)',
          transform: 'translateY(0px) rotateZ(0deg)',
          backfaceVisibility: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px) scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.1)';
        }}
      />
    </div>
  );
}
