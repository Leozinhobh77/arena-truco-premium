// ============================================================
// OVERLAY: GAME — GameOverlay.tsx
// Mesa de Truco 100% Funcional (vs Bot local)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useAuthStore } from '../stores/useAuthStore';
import type { Carta, Naipe, Valor } from '../types';

// ── Lógica de Baralho ────────────────────────────────────────
const NAIPES: Naipe[] = ['paus', 'copas', 'espadas', 'ouros'];
const VALORES: Valor[] = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const NAIPE_SYMBOL: Record<Naipe, string> = { paus: '♣', copas: '♥', espadas: '♠', ouros: '♦' };
const NAIPE_COLOR: Record<Naipe, string> = { paus: '#1a1a1a', copas: '#cc0000', espadas: '#1a1a1a', ouros: '#cc0000' };

// Força base das cartas no Truco Paulista (sem consideração de manilha)
const FORCA_BASE: Record<Valor, number> = {
  '4': 0, '5': 1, '6': 2, '7': 3, 'Q': 4, 'J': 5, 'K': 6, 'A': 7, '2': 8, '3': 9
};

// Força das Manilhas no Truco Mineiro (fixas)
const MANILHA_FORCA: Record<string, number> = {
  '4-espadas': 13, '7-ouros': 12, 'A-copas': 11, '7-paus': 10,
};

function criarBaralho(): Carta[] {
  const baralho: Carta[] = [];
  NAIPES.forEach(naipe => {
    VALORES.forEach(valor => {
      const key = `${valor}-${naipe}`;
      const forcaManilha = MANILHA_FORCA[key];
      baralho.push({
        id: key,
        valor,
        naipe,
        forcaBase: forcaManilha ?? FORCA_BASE[valor],
        ehManilha: !!forcaManilha,
      });
    });
  });
  return baralho.sort(() => Math.random() - 0.5);
}

// ── Componente Carta Visual ──────────────────────────────────
function CartaVisual({
  carta,
  virada = false,
  selected = false,
  onClick,
  size = 'normal'
}: {
  carta?: Carta;
  virada?: boolean;
  selected?: boolean;
  onClick?: () => void;
  size?: 'small' | 'normal' | 'large';
}) {
  const dims = size === 'small' ? { w: 40, h: 58, fontSize: 12 }
    : size === 'large' ? { w: 72, h: 104, fontSize: 18 }
    : { w: 58, h: 84, fontSize: 15 };

  if (virada || !carta) {
    return (
      <div style={{
        width: dims.w, height: dims.h,
        borderRadius: 8,
        background: 'linear-gradient(135deg, #1a1040 0%, #0f0f1a 100%)',
        border: '1.5px solid var(--border-gold)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: dims.fontSize + 4,
        color: 'var(--gold-400)', opacity: 0.8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        flexShrink: 0,
      }}>♠</div>
    );
  }

  const cor = NAIPE_COLOR[carta.naipe];
  const sym = NAIPE_SYMBOL[carta.naipe];

  return (
    <motion.div
      whileTap={onClick ? { scale: 0.93 } : {}}
      onClick={onClick}
      style={{
        width: dims.w, height: dims.h,
        borderRadius: 8,
        background: 'white',
        border: selected ? '2px solid var(--gold-400)' : '1.5px solid rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: '4px 5px',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        boxShadow: selected
          ? 'var(--shadow-gold), 0 8px 20px rgba(0,0,0,0.6)'
          : '0 4px 12px rgba(0,0,0,0.4)',
        transform: selected ? 'translateY(-14px)' : 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
        <span style={{ fontSize: dims.fontSize, fontWeight: 800, color: cor, fontFamily: 'var(--font-display)' }}>{carta.valor}</span>
        <span style={{ fontSize: dims.fontSize - 2, color: cor }}>{sym}</span>
      </div>
      {carta.ehManilha && (
        <div style={{
          position: 'absolute', top: -6, right: -4,
          background: 'var(--gold-gradient)', color: '#0a0a0f',
          fontSize: 8, fontWeight: 900, padding: '1px 4px', borderRadius: 6,
          fontFamily: 'var(--font-display)', lineHeight: 1.2,
        }}>MAN</div>
      )}
      <div style={{
        position: 'absolute', bottom: 4, right: 5,
        fontSize: dims.fontSize, color: cor, lineHeight: 1,
        transform: 'rotate(180deg)',
      }}>
        <span style={{ fontWeight: 800, fontFamily: 'var(--font-display)' }}>{carta.valor}</span>
      </div>
    </motion.div>
  );
}

// ── Modal TRUCO Dramático ────────────────────────────────────
function ModalTruco({ onAceitar, onCorrer, onSeis }: { onAceitar: () => void; onCorrer: () => void; onSeis: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="truco-modal-overlay"
    >
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="truco-text"
        >
          TRUCO!
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ textAlign: 'center' }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-secondary)', marginBottom: 24 }}>
            🤖 Zé Mineiro pediu Truco! O que você faz?
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', padding: '0 20px' }}>
            <button onClick={onCorrer} style={{
              padding: '14px 20px', borderRadius: 14,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}>
              🏃 Correr
            </button>
            <button onClick={onAceitar} style={{
              padding: '14px 24px', borderRadius: 14,
              background: 'var(--ruby-gradient)',
              border: 'none',
              color: 'white',
              fontFamily: 'var(--font-display)',
              fontSize: 15, fontWeight: 800, cursor: 'pointer',
              boxShadow: 'var(--shadow-ruby)',
            }}>
              ✊ Aceitar
            </button>
            <button onClick={onSeis} style={{
              padding: '14px 20px', borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(212,160,23,0.2), rgba(212,160,23,0.05))',
              border: '1px solid var(--border-gold)',
              color: 'var(--gold-400)',
              fontFamily: 'var(--font-display)',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}>
              ⚡ Pedir 6!
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Pod de Jogador ───────────────────────────────────────────
function PlayerPod({
  nome, avatar, cartas, cartaJogada, isUser = false, nivel
}: {
  nome: string; avatar: string;
  cartas: Carta[]; cartaJogada?: Carta;
  isUser?: boolean; nivel: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      {!isUser && (
        <>
          <div style={{ display: 'flex', gap: -8 }}>
            {cartas.slice(0, 3).map((_, i) => <CartaVisual key={i} virada size="small" />)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <img src={avatar} alt={nome} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid var(--border-gold)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700 }}>{nome}</span>
            <div className="level-badge" style={{ width: 20, height: 20, fontSize: 9 }}>{nivel}</div>
          </div>
        </>
      )}
      {isUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="level-badge" style={{ width: 20, height: 20, fontSize: 9 }}>{nivel}</div>
          <img src={avatar} alt={nome} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid var(--ruby)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--ruby)', fontWeight: 800 }}>Você</span>
        </div>
      )}
    </div>
  );
}

// ── Game Overlay Principal ───────────────────────────────────
const BOT_NOME = 'Zé Mineiro';
const BOT_AVATAR = `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=ZeMineiro&backgroundColor=2d1b69`;
const BOT_NIVEL = 35;
const BOT_MENSAGENS = [
  'Tá suado aí? 😂', 'TRUCO é pra homem!', 'Essa carta eu já sabia!',
  'Vai correr, medroso?', 'Tô de boa...', 'Pega essa!', 'Volta pra casa!',
];

type GamePhase = 'waiting' | 'playing' | 'round_end' | 'game_end';

export function GameOverlay() {
  const { popOverlay } = useNavigationStore();
  const { usuario, atualizarXP, atualizarMoedas } = useAuthStore();
  const [phase, setPhase] = useState<GamePhase>('waiting');
  const [countdown, setCountdown] = useState(3);
  const [baralho, setBaralho] = useState<Carta[]>([]);
  const [minhasCartas, setMinhasCartas] = useState<Carta[]>([]);
  const [cartasBot, setCartasBot] = useState<Carta[]>([]);
  const [mesaJogador, setMesaJogada] = useState<Carta | null>(null);
  const [mesaBot, setMesaBot] = useState<Carta | null>(null);
  const [cartaSelecionada, setCartaSelecionada] = useState<string | null>(null);
  const [pontoNos, setPontoNos] = useState(0);
  const [pontoEles, setPontoEles] = useState(0);
  const [mensagemStatus, setMensagemStatus] = useState('Conectando ao jogo...');
  const [chatMsgs, setChatMsgs] = useState<string[]>([]);
  const [showTruco, setShowTruco] = useState(false);
  const [valorTruco, setValorTruco] = useState(3);
  const [turno, setTurno] = useState<'jogador' | 'bot'>('jogador');
  const [rodadaInfo, setRodadaInfo] = useState('Rodada 1');
  const [botPronto, setBotPronto] = useState(false);

  // Iniciar Jogo
  const iniciarJogo = useCallback(() => {
    const b = criarBaralho();
    const minhas = b.slice(0, 3);
    const bots = b.slice(3, 6);
    setBaralho(b.slice(6));
    setMinhasCartas(minhas);
    setCartasBot(bots);
    setMesaJogada(null);
    setMesaBot(null);
    setCartaSelecionada(null);
    setTurno('jogador');
    setMensagemStatus('Sua vez! Escolha uma carta.');
    setPhase('playing');
  }, []);

  // Contagem regressiva para iniciar
  useEffect(() => {
    setBotPronto(false);
    const t1 = setTimeout(() => setBotPronto(true), 1200);
    const t2 = setTimeout(() => {
      let c = 3;
      setMensagemStatus(`Bot entrou! Iniciando em ${c}...`);
      const interval = setInterval(() => {
        c--;
        if (c > 0) setMensagemStatus(`Iniciando em ${c}...`);
        else { clearInterval(interval); iniciarJogo(); }
        setCountdown(c);
      }, 1000);
    }, 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [iniciarJogo]);

  // Lógica: Jogador joga carta
  const jogarCarta = (carta: Carta) => {
    if (turno !== 'jogador' || mesaJogador) return;
    setMesaJogada(carta);
    setMinhasCartas(prev => prev.filter(c => c.id !== carta.id));
    setCartaSelecionada(null);
    setTurno('bot');

    // Bot responde após delay
    setTimeout(() => {
      const cartaBot = cartasBot[Math.floor(Math.random() * cartasBot.length)];
      if (!cartaBot) return;
      setMesaBot(cartaBot);
      setCartasBot(prev => prev.filter(c => c.id !== cartaBot.id));

      // Mensagem aleatória do bot
      const msg = BOT_MENSAGENS[Math.floor(Math.random() * BOT_MENSAGENS.length)];
      setChatMsgs(prev => [...prev.slice(-4), `🤖 ${BOT_NOME}: ${msg}`]);

      // Determinar vencedor da rodada
      setTimeout(() => {
        const ganhei = carta.forcaBase > cartaBot.forcaBase;
        const empate = carta.forcaBase === cartaBot.forcaBase;

        if (ganhei) {
          setPontoNos(p => p + 1);
          setMensagemStatus('Você venceu a rodada! 🎉');
        } else if (empate) {
          setMensagemStatus('Empate! 🤝');
        } else {
          setPontoEles(p => p + 1);
          setMensagemStatus('Bot venceu a rodada... 😅');
        }

        // Limpa mesa e começa próxima rodada
        setTimeout(() => {
          setMesaJogada(null);
          setMesaBot(null);

          // Verificar fim de jogo (12 pontos)
          const nosNovos = ganhei ? pontoNos + 1 : pontoNos;
          const elesNovos = ganhei ? pontoEles : pontoEles + 1;

          if (nosNovos >= 12 || elesNovos >= 12 || (minhasCartas.length === 0 && cartasBot.length === 0)) {
            setPhase('game_end');
            if (nosNovos >= elesNovos) {
              atualizarXP(150);
              atualizarMoedas(50);
              setMensagemStatus('🏆 Você GANHOU! +150 XP, +50 Moedas!');
            } else {
              setMensagemStatus('😢 Bot ganhou. Tente novamente!');
            }
          } else {
            setTurno('jogador');
            setMensagemStatus('Sua vez! Escolha uma carta.');
          }
        }, 1800);
      }, 1000);
    }, 1200 + Math.random() * 800);
  };

  // Bot pede TRUCO aleatoriamente
  useEffect(() => {
    if (turno !== 'bot' || phase !== 'playing') return;
    if (Math.random() < 0.25 && !showTruco) {
      setTimeout(() => {
        setShowTruco(true);
        setChatMsgs(prev => [...prev.slice(-4), `🤖 ${BOT_NOME}: TRUCO!! 🃏`]);
      }, 500);
    }
  }, [turno, phase]);

  if (!usuario) return null;

  return (
    <div className="overlay" style={{ alignItems: 'stretch' }}>
      <div className="overlay-backdrop" />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          height: '100dvh',
          background: 'var(--obsidian-900)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          margin: '0 auto',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px 10px',
          flexShrink: 0,
          background: 'rgba(10,10,15,0.9)',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <button onClick={popOverlay} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>

          {/* Placar */}
          <div className="scoreboard">
            <div className="score-team us" style={{ padding: '6px 16px' }}>
              <div style={{ fontSize: 9, color: 'var(--ruby)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Você</div>
              <div className="score-value us">{pontoNos}</div>
            </div>
            <div style={{ width: 1, background: 'var(--border-subtle)' }} />
            <div className="score-team them" style={{ padding: '6px 16px' }}>
              <div style={{ fontSize: 9, color: 'var(--sapphire)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Bot</div>
              <div className="score-value them">{pontoEles}</div>
            </div>
          </div>

          <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: 10 }}>
            Paulista
          </span>
        </div>

        {/* FASE: Aguardando */}
        {phase === 'waiting' && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 20, padding: 24,
          }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ width: 60, height: 60, borderRadius: '50%', border: '3px solid rgba(212,160,23,0.2)', borderTop: '3px solid var(--gold-400)' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-secondary)', textAlign: 'center' }}>{mensagemStatus}</div>

            {/* Bot aparece */}
            {botPronto && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <img src={BOT_AVATAR} alt={BOT_NOME} style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--sapphire)' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--text-primary)', fontWeight: 700 }}>{BOT_NOME}</span>
                <span className="chip chip-emerald">✓ Pronto</span>
                <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-400)', fontSize: 28, fontWeight: 900 }}>{countdown > 0 ? countdown : '🃏'}</div>
              </motion.div>
            )}
          </div>
        )}

        {/* FASE: Jogando */}
        {phase === 'playing' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Pod do Bot */}
            <div style={{ padding: '10px 16px 6px', flexShrink: 0 }}>
              <PlayerPod nome={BOT_NOME} avatar={BOT_AVATAR} cartas={cartasBot} nivel={BOT_NIVEL} />
            </div>

            {/* Mesa de Jogo */}
            <div className="game-table" style={{ margin: '0 16px', flex: 1, minHeight: 0 }}>
              <div style={{ width: '100%', height: '100%', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                {/* Status message */}
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 13,
                  fontWeight: 700,
                  color: turno === 'jogador' ? 'var(--gold-400)' : 'var(--text-muted)',
                  background: 'rgba(0,0,0,0.5)',
                  padding: '4px 14px',
                  borderRadius: 20,
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  {mensagemStatus}
                </div>

                {/* Cartas na mesa */}
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
                  {mesaBot && (
                    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bot</span>
                      <CartaVisual carta={mesaBot} size="large" />
                    </motion.div>
                  )}
                  {mesaJogador && (
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <CartaVisual carta={mesaJogador} size="large" />
                      <span style={{ fontSize: 9, color: 'var(--ruby)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Você</span>
                    </motion.div>
                  )}
                  {!mesaBot && !mesaJogador && (
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'rgba(255,255,255,0.15)' }}>
                      {turno === 'jogador' ? 'Jogue uma carta ↓' : 'Bot pensando...'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pod do Jogador */}
            <div style={{ padding: '8px 16px 6px', flexShrink: 0 }}>
              <PlayerPod nome={usuario.nick} avatar={usuario.avatar} cartas={minhasCartas} isUser nivel={usuario.nivel} />
            </div>

            {/* Cartas do Jogador */}
            <div style={{ padding: '6px 16px 10px', display: 'flex', justifyContent: 'center', gap: 10, flexShrink: 0 }}>
              {minhasCartas.map(carta => (
                <CartaVisual
                  key={carta.id}
                  carta={carta}
                  size="large"
                  selected={cartaSelecionada === carta.id}
                  onClick={() => {
                    if (turno !== 'jogador') return;
                    if (cartaSelecionada === carta.id) jogarCarta(carta);
                    else setCartaSelecionada(carta.id);
                  }}
                />
              ))}
              {minhasCartas.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: 13 }}>Sem cartas na mão</div>
              )}
            </div>

            {/* Ações: Truco */}
            <div className="truco-action-bar" style={{ flexShrink: 0, borderTop: '1px solid var(--border-subtle)' }}>
              <button
                className="btn-truco btn-truco-call"
                onClick={() => {
                  setValorTruco(v => Math.min(v + 3, 12));
                  setChatMsgs(prev => [...prev.slice(-4), `🔥 Você: TRUCO!!`]);
                }}
                disabled={turno !== 'jogador'}
                style={{ opacity: turno !== 'jogador' ? 0.4 : 1 }}
              >
                ⚡ TRUCO! {valorTruco > 3 && `(${valorTruco})`}
              </button>
              <button
                className="btn-truco btn-truco-fold"
                onClick={popOverlay}
              >
                Correr
              </button>
            </div>

            {/* Chat rápido */}
            {chatMsgs.length > 0 && (
              <div style={{
                padding: '6px 16px 8px',
                flexShrink: 0,
              }}>
                {chatMsgs.slice(-2).map((m, i) => (
                  <div key={i} style={{
                    fontSize: 11,
                    color: m.startsWith('🤖') ? 'var(--text-secondary)' : 'var(--gold-400)',
                    padding: '2px 0',
                    fontStyle: 'italic',
                  }}>
                    {m}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FASE: Fim de Jogo */}
        {phase === 'game_end' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 24, textAlign: 'center' }}
          >
            <div style={{ fontSize: 70 }}>{pontoNos > pontoEles ? '🏆' : '😅'}</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 900,
              color: pontoNos > pontoEles ? 'var(--gold-400)' : 'var(--ruby)',
              margin: 0,
            }}>
              {pontoNos > pontoEles ? 'VITÓRIA!' : 'DERROTA'}
            </h2>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-secondary)' }}>
              {pontoNos} × {pontoEles}
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{mensagemStatus}</p>
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => { setPhase('waiting'); setPontoNos(0); setPontoEles(0); setChatMsgs([]); setCountdown(3); }}>
                🔄 Revanche
              </button>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={popOverlay}>
                Sair
              </button>
            </div>
          </motion.div>
        )}

        {/* Modal Truco */}
        <AnimatePresence>
          {showTruco && (
            <ModalTruco
              onAceitar={() => { setShowTruco(false); setChatMsgs(p => [...p.slice(-4), '💪 Você: Aceito!']); }}
              onCorrer={() => { setShowTruco(false); popOverlay(); }}
              onSeis={() => { setShowTruco(false); setValorTruco(6); setChatMsgs(p => [...p.slice(-4), '🔥 Você: Pede 6!']); }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
