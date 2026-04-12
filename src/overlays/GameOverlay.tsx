// ============================================================
// OVERLAY: GAME — GameOverlay.tsx
// Mesa de Truco conectada ao useGameStore
// ============================================================

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useGameStore } from '../stores/useGameStore';
import { PlayingCard } from '../components/PlayingCard';
import { PlayerAvatar } from '../components/PlayerAvatar';

export function GameOverlay() {
  const { popOverlay } = useNavigationStore();
  const { usuario } = useAuthStore();
  const game = useGameStore();

  const [falas] = useState<Record<string, string>>({});

  useEffect(() => {
    if (usuario && game.status === 'waiting') {
      const t = setTimeout(() => {
         game.iniciarPartida('paulista', usuario.id);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [usuario, game.status]);

  if (!usuario) return null;

  // Encontrar os jogadores nas posições (0 = Você, 1 = Esquerda, 2 = Topo, 3 = Direita)
  const myPlayer = game.jogadores.find(j => j.id === usuario.id);
  const others = game.jogadores.filter(j => j.id !== usuario.id);
  
  const pRight = others[0];
  const pTop = others[1];
  const pLeft = others[2];

  return (
    <div className="overlay" style={{ alignItems: 'stretch' }}>
      <div className="overlay-backdrop" />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        style={{
          position: 'relative', width: '100%', maxWidth: 480, height: '100dvh',
          background: 'var(--obsidian-900)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', margin: '0 auto', zIndex: 1,
        }}
      >
        {/* Header (Placar e Saída) */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px 10px', flexShrink: 0, background: 'rgba(10,10,15,0.9)',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <button onClick={popOverlay} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)' }}>←</button>

          <div className="scoreboard">
            <div className="score-team us" style={{ padding: '6px 16px' }}>
              <div style={{ fontSize: 9, color: 'var(--ruby)', fontWeight: 700 }}>NÓS</div>
              <div className="score-value us">{game.pontoNos}</div>
            </div>
            <div style={{ width: 1, background: 'var(--border-subtle)' }} />
            <div className="score-team them" style={{ padding: '6px 16px' }}>
              <div style={{ fontSize: 9, color: 'var(--sapphire)', fontWeight: 700 }}>ELES</div>
              <div className="score-value them">{game.pontoEles}</div>
            </div>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{game.modo}</span>
        </div>

        {/* FASE: Aguardando */}
        {game.status === 'waiting' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ width: 60, height: 60, borderRadius: '50%', border: '3px solid rgba(212,160,23,0.2)', borderTop: '3px solid var(--gold-400)' }} />
            <div style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Organizando a mesa...</div>
          </div>
        )}

        {/* FASE: Jogando */}
        {game.status === 'playing' && myPlayer && (
          <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
            
            {/* O Campo de Truco (Verde) */}
            <div className="absolute inset-0 bg-[#0f2c1f] overflow-hidden">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
               <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-black/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            {/* TOP POD */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              {pTop && <PlayerAvatar player={pTop} position="top" falando={falas[pTop.id]} />}
            </div>

            {/* LEFT POD */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
              {pLeft && <PlayerAvatar player={pLeft} position="left" falando={falas[pLeft.id]} />}
            </div>

            {/* RIGHT POD */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
              {pRight && <PlayerAvatar player={pRight} position="right" falando={falas[pRight.id]} />}
            </div>

            {/* CENTRO (Mesa de Jogo) */}
            <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none z-0">
               {/* Centro visual (Lugar das cartas jogadas) */}
               <div className="relative w-48 h-48 border-2 border-white/5 rounded-full flex items-center justify-center">
                 {game.mesa.map((carta, index) => (
                    <motion.div
                      key={carta.id}
                      initial={{ scale: 2, opacity: 0, rotate: positionRandom(index) }}
                      animate={{ scale: 1, opacity: 1, rotate: positionRandom(index) }}
                      className="absolute"
                      style={{ zIndex: index }}
                    >
                      <PlayingCard card={carta} />
                    </motion.div>
                 ))}

                 {/* Vira */}
                 {game.vira && (
                    <div className="absolute -right-6 top-0 flex flex-col items-center">
                       <span className="text-[10px] text-yellow-400 font-bold bg-black/50 px-2 rounded mb-1">VIRA</span>
                       <PlayingCard card={game.vira} style={{ transform: 'scale(0.6)' }} />
                    </div>
                 )}
               </div>
            </div>

            {/* BOTTOM POD & MINHAS CARTAS */}
            <div className="absolute bottom-0 inset-x-0 pb-6 flex flex-col items-center z-20">
               <div className="mb-4">
                 <PlayerAvatar player={myPlayer} position="bottom" falando={falas[myPlayer.id]} isCurrentTurn />
               </div>

               <div className="flex justify-center gap-2 px-4 h-28 items-end">
                 <AnimatePresence>
                   {myPlayer.cartas.map(carta => (
                     <PlayingCard 
                       key={carta.id} 
                       card={carta} 
                       playable
                       onClick={() => game.jogarCarta(usuario.id, carta.id)}
                     />
                   ))}
                 </AnimatePresence>
               </div>
            </div>

            {/* Barra de Ações Rápidas Absoluta */}
            <div className="absolute bottom-[10rem] right-4 flex flex-col gap-2 z-30">
               <button onClick={() => alert('Truco Implementação Pendente')} className="bg-gradient-to-r from-red-600 to-red-800 text-white font-black px-4 py-2 rounded-full shadow-lg border-2 border-yellow-500 hover:scale-105 active:scale-95 transition">
                 TRUCO!
               </button>
            </div>
            
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Aux de posição para as cartas jogadas
function positionRandom(index: number) {
  const angles = [-15, 10, -5, 20];
  return angles[index % 4];
}
