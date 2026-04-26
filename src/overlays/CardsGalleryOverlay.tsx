import { motion } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';
import { HandCard } from '../components/HandCard';

export function CardsGalleryOverlay() {
  const { popOverlay } = useNavigationStore();

  const cartas: Array<{ valor: '4' | '5' | '6' | '7' | 'Q' | 'J' | 'K' | 'A' | '2' | '3'; naipe: 'paus' | 'copas' | 'espadas' | 'ouros' }> = [];

  // Construir array com todas as 40 cartas
  const valores: Array<'A' | '2' | '3' | '4' | '5' | '6' | '7' | 'Q' | 'J' | 'K'> = ['A', '2', '3', '4', '5', '6', '7', 'Q', 'J', 'K'];
  const naipes: Array<'copas' | 'ouros' | 'espadas' | 'paus'> = ['copas', 'ouros', 'espadas', 'paus'];

  valores.forEach(valor => {
    naipes.forEach(naipe => {
      cartas.push({
        valor: valor as '4' | '5' | '6' | '7' | 'Q' | 'J' | 'K' | 'A' | '2' | '3',
        naipe
      });
    });
  });

  return (
    <div className="overlay">
      <div className="overlay-backdrop" onClick={popOverlay} />

      <motion.div
        className="modal-sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          background: 'var(--obsidian-800)',
          display: 'flex',
          flexDirection: 'column',
          height: '100dvh',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        }}
      >
        {/* Alça de arraste */}
        <div style={{
          width: 40, height: 4, background: 'rgba(255,255,255,0.1)',
          borderRadius: 2, margin: '12px auto 20px'
        }} />

        {/* Título */}
        <div style={{ padding: '0 24px 20px', textAlign: 'center', flexShrink: 0 }}>
          <h2 style={{ fontSize: 22, color: 'var(--gold-400)', margin: 0 }}>Galeria de Cartas</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>40 Cartas do Baralho Truco</p>
        </div>

        {/* Grid de cartas com scroll */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '16px 24px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            alignContent: 'start',
            justifyItems: 'center'
          }}
        >
          {cartas.map((carta, index) => (
            <motion.div
              key={`${carta.valor}-${carta.naipe}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
            >
              <HandCard valor={carta.valor} naipe={carta.naipe} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
