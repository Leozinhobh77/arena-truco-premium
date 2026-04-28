import { motion } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useState } from 'react';

export function Sala2v2_1Overlay() {
  const { popOverlay } = useNavigationStore();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, author: 'MORENA', text: 'Vou colocar uma carta aí! 🎴' },
    { id: 2, author: 'VOCÊ', text: 'Bora! Boa carta! 😎' },
    { id: 3, author: 'ALEX', text: 'Boa jogada! 👏👏' },
  ]);

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setMessages([...messages, { id: messages.length + 1, author: 'VOCÊ', text: chatInput }]);
      setChatInput('');
      setTimeout(() => {
        const responses = ['Boa! 🎯', 'Topado! 💪', 'Vamos nessa! 🔥', 'Que legal! 😎'];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prev => [...prev, { id: prev.length + 1, author: 'ALEX', text: randomResponse }]);
      }, 500);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'var(--obsidian-900)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 999,
    }}>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          height: 50,
          backgroundColor: 'var(--obsidian-800)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 2, color: 'var(--gold-400)' }}>TRUCO</div>
        <div style={{ textAlign: 'center', flex: 1, fontSize: 12 }}>
          <div style={{ fontWeight: 700 }}>PARTIDA RÁPIDA</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>ID: 12345 | Rodada: 1/3</div>
        </div>
        <button
          onClick={popOverlay}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: 20,
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </motion.div>

      {/* PLACAR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          padding: '12px',
          backgroundColor: 'var(--obsidian-900)',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          position: 'relative',
        }}>
          {/* Time 1 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 50, height: 50, borderRadius: '50%', background: '#e63946', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#fff',
            }}>
              0
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>NOSSO TIME</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>0 VITORIAS | 0 DERROTAS</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 8, height: 8, border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50%' }} />
              <div style={{ width: 8, height: 8, border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50%' }} />
              <div style={{ width: 8, height: 8, border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50%' }} />
            </div>
          </div>

          {/* Centro - Tentos */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            zIndex: 20,
          }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-muted)' }}>×</div>
            <div style={{
              fontSize: 52, fontWeight: 900, color: '#d4a017',
              textShadow: '0 0 16px rgba(212, 160, 23, 0.4)',
              lineHeight: 1,
            }}>
              2
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              TIME ADVERSÁRIO
            </div>
          </div>

          {/* Time 2 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 50, height: 50, borderRadius: '50%', background: '#3b82f6', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#fff',
            }}>
              0
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Morena_40</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>0 VITORIAS | 0 DERROTAS</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 8, height: 8, border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50%' }} />
              <div style={{ width: 8, height: 8, border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50%' }} />
              <div style={{ width: 8, height: 8, border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50%' }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* MESA */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', maxWidth: 400, maxHeight: 400 }}>
          {/* Mesa Verde */}
          <div style={{
            width: 280, height: 300, background: '#2d5a3d', border: '3px solid #1a3a28', borderRadius: 20,
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.6), inset 0 -4px 12px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.6)',
            zIndex: 10,
          }}>
            <div style={{
              position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              borderRadius: 18, pointerEvents: 'none',
            }} />
            <div style={{
              width: 50, height: 75, background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              border: '1.5px solid #d4a017', borderRadius: 6, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 15,
            }}>
              🃏
            </div>
          </div>

          {/* Players */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none',
          }}>
            {[
              { pos: 'top-left', name: 'ALEX', avatar: '👤', color: '#3b82f6' },
              { pos: 'top-right', name: 'Morena_40', avatar: '👩', color: '#e63946', badge: 'TRUICO' },
              { pos: 'bottom-left', name: '+ SUA VEZ', avatar: '👨', color: '#e63946', number: '18' },
              { pos: 'bottom-right', name: 'Brunette', avatar: '👩', color: '#3b82f6', badge: 'BABEL' },
            ].map((player) => {
              const posStyles = {
                'top-left': { top: 20, left: 20 },
                'top-right': { top: 20, right: 20 },
                'bottom-left': { bottom: 20, left: 20 },
                'bottom-right': { bottom: 20, right: 20 },
              };
              return (
                <div
                  key={player.pos}
                  style={{
                    position: 'absolute',
                    ...posStyles[player.pos as keyof typeof posStyles],
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    pointerEvents: 'auto',
                  }}
                >
                  <div style={{
                    width: 55, height: 55, borderRadius: '50%', border: `3px solid ${player.color}`,
                    background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    position: 'relative',
                  }}>
                    {player.avatar}
                    {player.badge && (
                      <div style={{
                        position: 'absolute', top: -8, right: -8, background: player.color, color: '#fff',
                        fontSize: 10, fontWeight: 700, padding: '3px 6px', borderRadius: 12, border: '2px solid var(--obsidian-900)',
                      }}>
                        {player.badge}
                      </div>
                    )}
                    {player.number && (
                      <div style={{
                        position: 'absolute', top: -12, left: -12, width: 32, height: 32, background: player.color,
                        color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 900, border: '2px solid var(--obsidian-900)',
                      }}>
                        {player.number}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', letterSpacing: 0.5, textAlign: 'center', maxWidth: 70 }}>
                    {player.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Suas Cartas */}
          <div style={{
            position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 12, zIndex: 12,
          }}>
            {['4♣', '3♥', 'Q♦'].map((card, i) => (
              <div
                key={i}
                style={{
                  width: 48, height: 72, background: 'linear-gradient(135deg, #1a1040 0%, #0f0f1a 100%)',
                  border: '1.5px solid rgba(212, 160, 23, 0.5)', borderRadius: 5, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700,
                  color: '#d4a017', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {card}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AÇÕES */}
      <div style={{
        flexShrink: 0,
        padding: '12px',
        backgroundColor: 'var(--obsidian-900)',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        {/* Botões Grande */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 8 }}>
          {[
            { label: 'TRUCO', subtext: '+3 PONTOS', color: '#e63946', textColor: '#fff' },
            { label: 'SEIS', subtext: '+6 PONTOS', color: '#f5a623', textColor: '#000' },
            { label: 'NOVE', subtext: '+9 PONTOS', color: '#3b82f6', textColor: '#fff' },
            { label: 'CORRER', subtext: 'FUGIR APOSTA', color: 'rgba(255,255,255,0.1)', textColor: 'var(--text-muted)' },
          ].map((btn) => (
            <button
              key={btn.label}
              style={{
                padding: '12px 8px',
                background: btn.color,
                color: btn.textColor as string,
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
              onClick={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
                setTimeout(() => { e.currentTarget.style.transform = 'scale(1)'; }, 100);
              }}
            >
              {btn.label}
              <span style={{ fontSize: 9, opacity: 0.8 }}>{btn.subtext}</span>
            </button>
          ))}
        </div>

        {/* Botões Pequenos */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          {['TRUCO!', 'SEIS!', 'NOVE!', 'CORRER!', 'BOA!'].map((btn) => (
            <button
              key={btn}
              style={{
                padding: '6px 10px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 6,
                color: 'var(--text-muted)',
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 160, 23, 0.1)';
                e.currentTarget.style.borderColor = '#d4a017';
                e.currentTarget.style.color = '#d4a017';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              {btn}
            </button>
          ))}
          <button style={{
            padding: '6px 8px',
            background: 'transparent',
            border: 'none',
            fontSize: 14,
            cursor: 'pointer',
          }}>
            😊
          </button>
        </div>
      </div>

      {/* CHAT */}
      <div style={{
        flexShrink: 0,
        padding: '8px 12px',
        backgroundColor: 'var(--obsidian-900)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        gap: 6,
        alignItems: 'center',
      }}>
        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>💬</div>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Escreva uma mensagem..."
          style={{
            flex: 1,
            padding: '8px 10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6,
            color: 'var(--text-muted)',
            fontSize: 12,
            outline: 'none',
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            width: 32,
            height: 32,
            background: '#3b82f6',
            border: 'none',
            borderRadius: 6,
            color: '#fff',
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
