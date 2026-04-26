import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useState } from 'react';
import { PlayerSlot } from '../components/PlayerSlot';
import { CardDeck } from '../components/CardDeck';

export function GameRoomOverlay() {
  const { popOverlay } = useNavigationStore();
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatDisabled, setChatDisabled] = useState(false);
  const [soundDisabled, setSoundDisabled] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, author: '🎮 MORENA_40', text: 'Vou colocar uma carta aí! 🎴', timestamp: '14:25' },
    { id: 2, author: '👤 VOCÊ', text: 'Bora! Dá uma boa carta aí! 😎🔥', timestamp: '14:26' },
    { id: 3, author: '🎮 ALEX', text: 'Boa jogada! 👏👏', timestamp: '14:26' },
    { id: 4, author: '🎮 BRUNETTS', text: 'Eita, essa foi pesada! 💪🎯', timestamp: '14:27' },
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
        const bots = ['🎮 MORENA_40', '🎮 ALEX', '🎮 BRUNETTS'];
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
            padding: '4px 12px',
            minHeight: '19px',
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
            minHeight: '19px',
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
            minHeight: '19px',
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

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid var(--border-subtle)', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--gold-400)' }}>2</div>
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>0</div>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Mesa Central */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '70px',
        paddingBottom: '24px',
        paddingLeft: '16px',
        paddingRight: '16px',
        position: 'relative'
      }}>
        {/* Quadrado Verde Aveludado - Mesa de Jogo */}
        <div style={{
          width: '300px',
          height: '310px',
          backgroundColor: '#2d5a3d',
          border: '2px solid #1a3a28',
          borderRadius: '8px',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginBottom: '16px'
        }}>
          {/* Efeito de textura aveludada */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            borderRadius: '6px',
            pointerEvents: 'none'
          }} />

          {/* Baralho Centralizado */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}>
            <CardDeck />
          </div>
        </div>

        {/* PlayerSlots - 4 Jogadores ao redor da Mesa */}
        <PlayerSlot
          name="Morena_40"
          position="top-right"
          team="vermelho"
          avatar="https://randomuser.me/api/portraits/women/47.jpg"
          namePosition="top"
        />
        <PlayerSlot
          name="Leozinhobh"
          position="bottom-left"
          team="vermelho"
          avatar="https://randomuser.me/api/portraits/men/32.jpg"
          namePosition="bottom"
        />
        <PlayerSlot
          name="Alex"
          position="top-left"
          team="azul"
          avatar="https://randomuser.me/api/portraits/men/15.jpg"
          nameOrientation="vertical"
        />
        <PlayerSlot
          name="Brunetts"
          position="bottom-right"
          team="azul"
          avatar="https://randomuser.me/api/portraits/women/8.jpg"
          nameOrientation="vertical"
        />
      </div>

      {/* CHAT ROOM FOOTER - COMPACTO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full px-4 py-2"
        style={{
          backgroundColor: 'var(--obsidian-900)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        {/* Botões de Controle */}
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setChatExpanded(true)}
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              backgroundColor: 'transparent',
              border: '1px solid #D4D4D4',
              borderRadius: '4px',
              color: '#D4D4D4',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(212,212,212,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ⬆️ EXPANDIR
          </button>
          <motion.button
            onClick={() => setChatDisabled(!chatDisabled)}
            animate={chatDisabled ? { scaleX: -1 } : { scaleX: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              padding: '4px 8px',
              fontSize: '16px',
              backgroundColor: 'transparent',
              border: '1px solid #D4D4D4',
              borderRadius: '4px',
              color: chatDisabled ? 'rgba(212,212,212,0.4)' : '#D4D4D4',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative',
              textDecoration: chatDisabled ? 'line-through' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!chatDisabled) {
                e.currentTarget.style.backgroundColor = 'rgba(212,212,212,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            💬
          </motion.button>

          <motion.button
            onClick={() => setSoundDisabled(!soundDisabled)}
            animate={soundDisabled ? { scaleX: -1 } : { scaleX: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              padding: '4px 8px',
              fontSize: '16px',
              backgroundColor: 'transparent',
              border: '1px solid #D4D4D4',
              borderRadius: '4px',
              color: soundDisabled ? 'rgba(212,212,212,0.4)' : '#D4D4D4',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textDecoration: soundDisabled ? 'line-through' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!soundDisabled) {
                e.currentTarget.style.backgroundColor = 'rgba(212,212,212,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {soundDisabled ? '🔇' : '🔊'}
          </motion.button>

          <button
            onClick={() => setConfirmExit(true)}
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              backgroundColor: 'transparent',
              border: '1px solid #D4D4D4',
              borderRadius: '4px',
              color: '#D4D4D4',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(212,212,212,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            × SAIR
          </button>
        </div>

        {/* Container Chat Compacto */}
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
          {/* Input e Botões */}
          <div style={{
            display: 'flex',
            gap: '6px',
            padding: '6px 8px',
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
                padding: '8px 10px',
                fontSize: '16px',
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
                padding: '6px 8px',
                fontSize: '16px',
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
                padding: '8px 14px',
                fontSize: '14px',
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

      {/* CHAT EXPANDIDO - MODAL COM GLASSMORPHISM */}
      <AnimatePresence>
        {chatExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setChatExpanded(false)}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.3)',
                zIndex: 99
              }}
            />

            {/* Chat Expandido */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '70%',
                backgroundColor: 'rgba(45, 45, 50, 0.50)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(212,160,23,0.3)',
                borderTop: '2px solid var(--gold-400)',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 100,
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: '1px solid rgba(212,212,212,0.2)'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#D4D4D4' }}>
                  💬 Histórico de Chat
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <motion.button
                    onClick={() => setChatDisabled(!chatDisabled)}
                    animate={chatDisabled ? { scaleX: -1 } : { scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      padding: '4px 8px',
                      fontSize: '16px',
                      backgroundColor: 'transparent',
                      border: '1px solid #D4D4D4',
                      borderRadius: '4px',
                      color: chatDisabled ? 'rgba(212,212,212,0.4)' : '#D4D4D4',
                      cursor: 'pointer',
                      textDecoration: chatDisabled ? 'line-through' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!chatDisabled) {
                        e.currentTarget.style.backgroundColor = 'rgba(212,212,212,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    💬
                  </motion.button>
                  <motion.button
                    onClick={() => setSoundDisabled(!soundDisabled)}
                    animate={soundDisabled ? { scaleX: -1 } : { scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      padding: '4px 8px',
                      fontSize: '16px',
                      backgroundColor: 'transparent',
                      border: '1px solid #D4D4D4',
                      borderRadius: '4px',
                      color: soundDisabled ? 'rgba(212,212,212,0.4)' : '#D4D4D4',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textDecoration: soundDisabled ? 'line-through' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!soundDisabled) {
                        e.currentTarget.style.backgroundColor = 'rgba(212,212,212,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {soundDisabled ? '🔇' : '🔊'}
                  </motion.button>
                  <button
                    onClick={() => setChatExpanded(false)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '12px',
                      backgroundColor: 'transparent',
                      border: '1px solid #D4D4D4',
                      borderRadius: '4px',
                      color: '#D4D4D4',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(212,212,212,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    ✕ FECHAR
                  </button>
                </div>
              </div>

              {/* Área de Mensagens */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {messages.map((msg) => (
                  <div key={msg.id} style={{
                    display: 'flex',
                    gap: '8px',
                    fontSize: '16px',
                    lineHeight: '1.4'
                  }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--gold-400)', minWidth: '100px', whiteSpace: 'nowrap' }}>
                      {msg.author}
                    </span>
                    <span style={{ color: 'var(--text-primary)', flex: 1 }}>
                      {msg.text}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', minWidth: '40px', textAlign: 'right' }}>
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              {/* Input e Botões */}
              <div style={{
                display: 'flex',
                gap: '6px',
                padding: '10px 16px',
                borderTop: '1px solid rgba(212,160,23,0.2)',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escreva uma msg..."
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(212,160,23,0.3)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />

                <button
                  onClick={() => setInputValue(inputValue + '😊')}
                  style={{
                    padding: '8px 10px',
                    fontSize: '18px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  😊
                </button>

                <button
                  onClick={handleSendMessage}
                  style={{
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    backgroundColor: 'var(--gold-400)',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'var(--obsidian-900)',
                    cursor: 'pointer'
                  }}
                >
                  ➤
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de Confirmação de Saída */}
      <AnimatePresence>
        {confirmExit && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmExit(false)}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 999
              }}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'var(--obsidian-800)',
                border: '2px solid var(--gold-400)',
                borderRadius: '12px',
                padding: '24px',
                zIndex: 1000,
                maxWidth: '90%',
                width: '280px',
                boxShadow: '0 16px 64px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                Tem certeza que deseja sair da sala?
              </div>

              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => setConfirmExit(false)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: 'transparent',
                    border: '1px solid #D4D4D4',
                    borderRadius: '4px',
                    color: '#D4D4D4',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(212,212,212,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Cancelar
                </button>

                <button
                  onClick={() => {
                    setConfirmExit(false);
                    popOverlay();
                  }}
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(230,57,70,0.2)',
                    border: '1px solid rgba(230,57,70,0.4)',
                    borderRadius: '4px',
                    color: 'var(--ruby)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(230,57,70,0.3)';
                    e.currentTarget.style.borderColor = 'var(--ruby)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(230,57,70,0.2)';
                    e.currentTarget.style.borderColor = 'rgba(230,57,70,0.4)';
                  }}
                >
                  Sair
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </motion.div>
    </div>
  );
}
