import { useEffect, useState, useMemo } from 'react';
import { useGameStore } from './store/gameStore';
import CardUI from './components/CardUI';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Crown, Skull } from 'lucide-react';

function App() {
  const { game, bot, startGame, playCard, callTruco, respondTruco, humanId, isBotThinking, botMessage, gameOver, clearBotMessage } = useGameStore();
  const [showSplash, setShowSplash] = useState(true);

  const cardRotations = useMemo(() => {
    if (game?.tableCards && game.tableCards.length > 0) {
      return {
        // eslint-disable-next-line react-hooks/purity
        initial: game.tableCards.map(() => Math.random() * 40 - 20),
        // eslint-disable-next-line react-hooks/purity
        final: game.tableCards.map(() => Math.random() * 20 - 10),
      };
    }
    return { initial: [], final: [] };
  }, [game?.tableCards]);

  useEffect(() => {
    // Esconder a splash screen estilizada
    setTimeout(() => setShowSplash(false), 2500);
  }, []);

  // Tela de Abertura (Splash Screen NATIVA)
  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-obsidian flex flex-col items-center justify-center z-[100]">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 1 }}
           className="relative"
        >
           <div className="absolute inset-0 bg-gold blur-[50px] opacity-20 animate-pulse"></div>
           <Crown className="w-24 h-24 text-gold mb-6 relative z-10" />
        </motion.div>
        <motion.h1 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="text-4xl font-serif text-gold tracking-[8px] font-bold"
        >
          ARENA TRUCO
        </motion.h1>
      </div>
    );
  }

  // Lobby
  if (!game && !gameOver.over) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Fundo Premium */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_60%)] pointer-events-none" />
        
        <div className="glass-panel p-8 md:p-12 w-full max-w-sm flex flex-col items-center z-10 relative">
           <Crown className="w-16 h-16 text-gold mb-4" />
           <h1 className="text-3xl font-serif text-gold font-bold mb-8 tracking-widest text-center">TRUCO PREMIUM</h1>
           
           <button 
             onClick={() => startGame('player-1', 'aggressive')}
             className="w-full bg-gradient-to-r from-gold to-gold-dark text-obsidian py-4 rounded-xl font-bold uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.4)]"
           >
             Jogar vs IA Master
           </button>

           <button 
             disabled
             className="w-full mt-4 bg-white/5 border border-white/10 text-white/40 py-4 rounded-xl font-bold uppercase tracking-wider relative overflow-hidden"
           >
             Multiplayer (Em Breve)
           </button>
        </div>
      </div>
    );
  }

  // Tela de Game Over
  if (gameOver.over) {
    const isWin = gameOver.winner === 1; // team 1 is human
    return (
       <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-6 relative">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center text-center">
             {isWin ? <Trophy className="w-32 h-32 text-gold mb-6" /> : <Skull className="w-32 h-32 text-white/20 mb-6" />}
             <h1 className={`text-5xl font-serif mb-4 ${isWin ? 'text-gold' : 'text-white/50'}`}>
               {isWin ? 'VITÓRIA MAXIMA' : 'DERROTADO'}
             </h1>
             <button 
               onClick={() => startGame('player-1', 'aggressive')}
               className="mt-8 btn-truco text-sm"
             >
               Jogar Novamente
             </button>
          </motion.div>
       </div>
    );
  }

  // --- MESA DE JOGO ATIVA ---

  const human = game!.players.find(p => p.id === humanId)!;
  const botPlayer = game!.players.find(p => p.id !== humanId)!;
  
  const isHumanTurn = game!.players[game!.currentPlayerIndex].id === humanId;
  const showTrucoModal = game!.trucoStatus === 'called' && game!.players[game!.trucoCaller!].id !== humanId;

  // Clear bot message timeout
  if (botMessage) {
    setTimeout(clearBotMessage, 3500);
  }

  return (
    <div className="min-h-screen bg-[#0A0F0D] flex flex-col relative overflow-hidden text-sm md:text-base">
      {/* Dynamic Background Noise / Gradient for Felt Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'}} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_80%)]" />

      {/* HEADER / SCOREBOARD */}
      <div className="pt-8 px-6 flex justify-between items-center z-10">
         <div className="glass-panel px-6 py-2 flex flex-col items-center border-[0.5px] border-white/10">
           <span className="text-white/50 text-xs uppercase tracking-widest">Você</span>
           <span className="text-3xl font-serif text-white">{game!.score.team1}</span>
         </div>

         <div className="flex flex-col items-center">
           <span className="text-gold uppercase tracking-[4px] text-xs font-bold bg-obsidian-light px-4 py-1 rounded-full border border-gold/20 shadow-lg">
             Rodada {game!.round} • Valor: {game!.trucoValue}
           </span>
         </div>

         <div className="glass-panel px-6 py-2 flex flex-col items-center border-[0.5px] border-gold/20 relative">
           {isBotThinking && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />}
           <span className="text-gold/80 text-xs uppercase tracking-widest">{bot?.name}</span>
           <span className="text-3xl font-serif text-gold">{game!.score.team2}</span>
         </div>
      </div>

      {/* BOT ÁREA (Mão do Oponente) */}
      <div className="flex justify-center -mt-8 z-0 relative">
         {botPlayer.hand.cards.map((_, i) => (
           <CardUI key={`bot-card-${i}`} isHidden className="w-20 md:w-28 -ml-6 first:ml-0 transform hover:translate-y-0" delay={i * 0.1}/>
         ))}

         {/* Balão de Fala do Bot */}
         <AnimatePresence>
           {botMessage && (
             <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-full mt-4 bg-white text-obsidian px-6 py-3 rounded-2xl rounded-tl-none font-bold shadow-xl border-2 border-gold z-50 text-center max-w-[200px]"
             >
                {botMessage}
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      {/* ÁREA CENTRAL = MESA */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
         {/* O Vira */}
         <div className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 flex items-center">
            <div className="relative">
              <CardUI isHidden className="w-16 md:w-20 absolute -left-20 md:-left-24 rotate-[-10deg] opacity-40 blur-[1px]" />
              <CardUI suit={game!.trump.suit} rank={game!.trump.rank} featured className="w-20 md:w-24 mt-4 rotate-[15deg] shadow-[0_0_30px_rgba(212,175,55,0.3)]" />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gold/60 text-xs uppercase tracking-widest bg-obsidian px-2 rounded font-bold border border-gold/20">VIRA</div>
            </div>
         </div>

         {/* Cartas Jogadas */}
         <div className="flex gap-4 items-center">
            {game!.tableCards.map((c, i) => (
              <motion.div
                key={`table-card-${i}`}
                initial={{ scale: 2, opacity: 0, rotate: cardRotations.initial[i] ?? 0 }}
                animate={{ scale: 1, opacity: 1, rotate: cardRotations.final[i] ?? 0 }}
                className="z-20"
              >
                <CardUI suit={c.suit} rank={c.rank} className="w-24 md:w-32 shadow-2xl" />
              </motion.div>
            ))}
         </div>

         {/* Status Message */}
         {game!.message && (
            <motion.div 
               key={game!.message}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="absolute bottom-8 bg-obsidian-light/80 backdrop-blur border border-white/5 py-2 px-6 rounded-full text-white/50 text-sm"
            >
               {game!.message}
            </motion.div>
         )}
      </div>

      {/* ÁREA DO JOGADOR SUPERIOR (INTERFACES E BOTÕES) */}
      <div className="absolute inset-x-0 bottom-[35%] md:bottom-[40%] flex justify-center z-40 pointer-events-none">
          {/* BOTÃO DE TRUCO GIGANTE E PULSANTE */}
          {isHumanTurn && game!.trucoStatus === 'none' && (
            <motion.button
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               whileTap={{ scale: 0.9 }}
               onClick={() => callTruco(3)}
               className="btn-truco pointer-events-auto flex items-center gap-2"
            >
               <Zap className="w-6 h-6" fill="currentColor" /> TRUCO!
            </motion.button>
          )}

          {/* RESPONSE TRUCO MODAL */}
          <AnimatePresence>
            {showTrucoModal && (
              <motion.div 
                 initial={{ opacity: 0, scale: 0.8, y: 50 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.8 }}
                 className="glass-panel pointer-events-auto flex flex-col p-6 items-center border border-blood shadow-[0_0_50px_rgba(139,0,0,0.5)] bg-obsidian/95"
              >
                 <h3 className="text-3xl font-serif text-blood font-bold mb-6 tracking-widest uppercase animate-pulse">O ADVERSÁRIO PEDIU TRUCO!</h3>
                 <div className="flex gap-4">
                    <button onClick={() => respondTruco(false)} className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded font-bold uppercase transition focus:ring-2">Fugir</button>
                    <button onClick={() => respondTruco(true)} className="px-8 py-3 bg-blood text-white rounded font-bold uppercase transition shadow-[0_0_15px_rgba(139,0,0,0.8)] hover:bg-red-700">Aceitar</button>
                    {game!.trucoValue < 12 && (
                       <button onClick={() => callTruco((game!.trucoValue + 3) as 6 | 9 | 12)} className="px-8 py-3 bg-gradient-to-r from-gold to-gold-dark text-obsidian rounded font-bold uppercase transition hover:scale-105">
                         Pedir {game!.trucoValue + 3}
                       </button>
                    )}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>

      {/* ÁREA DO JOGADOR (Mão) */}
      <div className="h-40 md:h-56 w-full flex justify-center items-end pb-8 z-30 relative">
         {/* Mão de Cartas */}
         <div className="flex justify-center group pointer-events-auto">
            {human.hand.cards.map((c, i) => {
              const playable = isHumanTurn && game!.trucoStatus !== 'called';
              return (
                 <div 
                   key={`player-card-${i}`} 
                   className={`transform transition-all duration-300 origin-bottom 
                     ${i === 0 ? '-rotate-12 translate-x-8' : i === 1 ? 'z-10 -translate-y-4' : 'rotate-12 -translate-x-8'} 
                     ${playable ? 'hover:-translate-y-12 hover:scale-110 cursor-pointer' : 'opacity-80'}
                   `}
                   onClick={() => playable && playCard(i)}
                 >
                   <CardUI suit={c.suit} rank={c.rank} className="w-28 md:w-36 h-[155px] md:h-[200px]" delay={0.5 + (i * 0.1)} />
                 </div>
              )
            })}
         </div>
      </div>
      
    </div>
  );
}

export default App;
