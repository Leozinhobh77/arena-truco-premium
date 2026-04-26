export function CardDeck() {
  const neonPattern = `
    linear-gradient(135deg, transparent 48%, #00ffff 49%, #00ffff 51%, transparent 52%),
    linear-gradient(45deg, transparent 48%, #00ffff 49%, #00ffff 51%, transparent 52%),
    linear-gradient(135deg, transparent 28%, #00ffff 29%, #00ffff 31%, transparent 32%),
    linear-gradient(45deg, transparent 68%, #00ffff 69%, #00ffff 71%, transparent 72%),
    linear-gradient(0deg, transparent 48%, #00ffff 49%, #00ffff 51%, transparent 52%),
    linear-gradient(90deg, transparent 48%, #00ffff 49%, #00ffff 51%, transparent 52%)
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
          backgroundColor: '#1a0d3d',
          border: '1.5px solid #3d1f7a',
          borderRadius: '6px',
          backgroundImage: neonPattern,
          backgroundSize: '100% 100%',
          boxShadow: '0 0 12px rgba(0,255,255,0.2), 0 6px 12px rgba(0,0,0,0.4)',
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
          backgroundColor: '#1a0d3d',
          border: '1.5px solid #3d1f7a',
          borderRadius: '6px',
          backgroundImage: neonPattern,
          backgroundSize: '100% 100%',
          boxShadow: '0 0 10px rgba(0,255,255,0.2), 0 4px 8px rgba(0,0,0,0.3)',
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
          backgroundColor: '#1a0d3d',
          border: '1.5px solid #3d1f7a',
          borderRadius: '6px',
          backgroundImage: neonPattern,
          backgroundSize: '100% 100%',
          boxShadow: '0 0 8px rgba(0,255,255,0.3), inset 0 1px 2px rgba(0,255,255,0.1)',
          transform: 'translateY(0px) rotateZ(0deg)',
          backfaceVisibility: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
          e.currentTarget.style.boxShadow = '0 0 12px rgba(0,255,255,0.4), inset 0 1px 2px rgba(0,255,255,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0px) scale(1)';
          e.currentTarget.style.boxShadow = '0 0 8px rgba(0,255,255,0.3), inset 0 1px 2px rgba(0,255,255,0.1)';
        }}
      />
    </div>
  );
}
