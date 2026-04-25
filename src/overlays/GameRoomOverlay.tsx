import { motion } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useState } from 'react';

export function GameRoomOverlay() {
  const { popOverlay } = useNavigationStore();
  const [messages, setMessages] = useState([
    { id: 1, author: '🤖 BOT SILVA', text: 'Vou colocar uma carta aí! 🎴', timestamp: '14:25' },
    { id: 2, author: '👤 VOCÊ', text: 'Bora! Dá uma boa carta aí! 😎🔥', timestamp: '14:26' },
    { id: 3, author: '🤖 BOT ZEH', text: 'Boa jogada! 👏👏', timestamp: '14:26' },
    { id: 4, author: '🤖 BOT JAUM', text: 'Eita, essa foi pesada! 💪🎯', timestamp: '14:27' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        author: '👤 VOCÊ',
        text: inputValue,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputValue('');

      // Auto resposta de bot
      setTimeout(() => {
        const bots = ['🤖 BOT SILVA', '🤖 BOT ZEH', '🤖 BOT JAUM'];
        const botResponses = [
          'Boa! 🎯',
          'Topado! 💪',
          'Vamos nessa! 🔥',
          'Que legal! 😎',
          'Bora continuar! 🎴'
        ];
        const randomBot = bots[Math.floor(Math.random() * bots.length)];
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

        setMessages(prev => [...prev, {
          id: prev.length + 1,
          author: randomBot,
          text: randomResponse,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 800);
    }
  };

  return (
    <div className="overlay" style={{ alignItems: 'stretch' }}>
      <div className="overlay-backdrop" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'relative', width: '100%', height: '100dvh',
          backgroundColor: 'var(--obsidian-900)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', margin: '0 auto', zIndex: 1
        }}
      >
      {/* PLACAR HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full px-4 py-4"
        style={{
          backgroundColor: 'var(--obsidian-900)',
        }}
      >
        {/* Container do Placar */}
        <div
          style={{
            width: '100%',
            backgroundColor: 'var(--obsidian-800)',
            border: '1px solid var(--border-subtle)',
            borderBottom: '2px solid var(--gold-400)',
            borderRadius: '8px',
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          {/* LINHA 1: HEADERS */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            padding: '7px 12px',
            minHeight: '29px',
            gap: '0'
          }}>
            <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '0.08em',
                color: '#D4D4D4',
                border: '1px solid var(--border-subtle)',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}>
                TIME
              </div>
            </div>

            <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '0.08em',
                color: '#D4D4D4',
                border: '1px solid var(--border-subtle)',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}>
                RODADA
              </div>
            </div>

            <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '0.08em',
                color: '#D4D4D4',
                border: '1px solid var(--border-subtle)',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}>
                PONTOS
              </div>
            </div>

            <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '0.08em',
                color: '#D4D4D4',
                border: '1px solid var(--border-subtle)',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}>
                TENTOS
              </div>
            </div>

            <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '0.08em',
                color: '#D4D4D4',
                border: '1px solid var(--border-subtle)',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255,255,255,0.02)'
              }}>
                JOGOS
              </div>
            </div>
          </div>

          {/* DIVISOR */}
          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

          {/* LINHA 2: TIME 1 (VERMELHO) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            minHeight: '41px',
            gap: '0',
            position: 'relative'
          }}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--ruby)', border: '1.5px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', borderRight: '1px solid var(--border-subtle)' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.5)', backgroundColor: 'transparent', flexShrink: 0 }} />
              ))}
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>0</div>
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }} />

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>0</div>
            </div>
          </div>

          {/* LINHA 3: TIME 2 (AZUL) + TENTOS GRANDE */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            minHeight: '41px',
            gap: '0',
            position: 'relative'
          }}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--sapphire)', border: '1.5px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', borderRight: '1px solid var(--border-subtle)' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.5)', backgroundColor: 'transparent', flexShrink: 0 }} />
              ))}
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>0</div>
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--gold-400)' }}>2</div>
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>0</div>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Mesa Central - Vazio por enquanto */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Botão SAIR no meio */}
        <motion.button
          onClick={popOverlay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: '14px 40px',
            fontSize: '15px',
            fontWeight: 'bold',
            backgroundColor: 'rgba(230,57,70,0.15)',
            border: '1.5px solid var(--ruby)',
            borderRadius: '12px',
            color: 'var(--ruby)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(230,57,70,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(230,57,70,0.15)';
          }}
        >
          × SAIR
        </motion.button>
      </div>

      {/* CHAT ROOM FOOTER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full px-4 py-3"
        style={{
          backgroundColor: 'var(--obsidian-900)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        {/* Container Chat */}
        <div style={{
          width: '100%',
          backgroundColor: 'var(--obsidian-800)',
          border: '1px solid var(--border-subtle)',
          borderBottom: '2px solid var(--gold-400)',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Área de Mensagens */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '8px 10px',
            maxHeight: '80px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{
                display: 'flex',
                gap: '6px',
                fontSize: '13px',
                lineHeight: '1.3'
              }}>
                <span style={{ fontWeight: 'bold', color: 'var(--gold-400)', minWidth: '80px', whiteSpace: 'nowrap' }}>
                  {msg.author}
                </span>
                <span style={{ color: 'var(--text-primary)', flex: 1, wordBreak: 'break-word' }}>
                  {msg.text}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', minWidth: '35px', textAlign: 'right' }}>
                  {msg.timestamp}
                </span>
              </div>
            ))}
          </div>

          {/* Input e Botões */}
          <div style={{
            display: 'flex',
            gap: '6px',
            padding: '6px 8px',
            borderTop: '1px solid var(--border-subtle)',
            alignItems: 'center'
          }}>
            {/* Input */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escreva uma msg..."
              style={{
                flex: 1,
                padding: '6px 8px',
                fontSize: '12px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />

            {/* Botão Emoji */}
            <button
              onClick={() => setInputValue(inputValue + '😊')}
              style={{
                padding: '4px 6px',
                fontSize: '12px',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--gold-400)',
                cursor: 'pointer'
              }}
            >
              😊
            </button>

            {/* Botão Enviar */}
            <button
              onClick={handleSendMessage}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: 'var(--gold-400)',
                border: 'none',
                borderRadius: '6px',
                color: 'var(--obsidian-900)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              ➤
            </button>
          </div>
        </div>
      </motion.div>
      </motion.div>
    </div>
  );
}
