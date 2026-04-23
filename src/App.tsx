// ============================================================
// APP.TSX — Arena Truco Premium
// Root do App: Navegação nativa, Swipe, Overlays
// ============================================================

import { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useAuthStore } from './stores/useAuthStore';
import { useNavigationStore } from './stores/useNavigationStore';
import { AmigosRealtimeProvider } from './contexts/AmigosRealtimeContext';

import { LoginScreen } from './screens/LoginScreen';
import { ArenaScreen } from './screens/ArenaScreen';
import { LojaScreen } from './screens/LojaScreen';
import { ModosScreen } from './screens/ModosScreen';
import { RankingScreen } from './screens/RankingScreen';
import { ClansScreen } from './screens/ClansScreen';
import { SalasOverlay } from './overlays/SalasOverlay';
import { GameOverlay } from './overlays/GameOverlay';
import { AmigosUsuariosOverlay } from './overlays/AmigosUsuariosOverlay';
import { ProfileOverlay } from './overlays/ProfileOverlay';
import { ConfiguracoesOverlay } from './overlays/ConfiguracoesOverlay';
import { DeixarRecadoOverlay } from './overlays/DeixarRecadoOverlay';
import { RecadosOverlay } from './overlays/RecadosOverlay';
import { ArenaMenuOverlay } from './overlays/ArenaMenuOverlay';
import { SolicitacoesOverlay } from './overlays/SolicitacoesOverlay';
import { FriendActionSheet } from './components/FriendActionSheet';
import type { Amigo } from './types';

// ── Ícones SVG Inline da Nav Bar ────────────────────────────
const NavIcons = {
  loja: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  ),
  modos: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  arena: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M9 8l2 2 4-4" />
    </svg>
  ),
  ranking: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
      <line x1="18" y1="20" x2="18" y2="10" strokeWidth="2.5" />
      <line x1="12" y1="20" x2="12" y2="4"  strokeWidth="2.5" />
      <line x1="6"  y1="20" x2="6"  y2="14" strokeWidth="2.5" />
    </svg>
  ),
  clans: (active: boolean) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
};

const NAV_ITEMS = [
  { id: 'loja',    label: 'Loja',    icon: NavIcons.loja    },
  { id: 'modos',   label: 'Modos',   icon: NavIcons.modos   },
  { id: 'arena',   label: 'Arena',   icon: NavIcons.arena   },
  { id: 'ranking', label: 'Ranking', icon: NavIcons.ranking },
  { id: 'clans',   label: 'Clãs',    icon: NavIcons.clans   },
];

const SCREENS = [LojaScreen, ModosScreen, ArenaScreen, RankingScreen, ClansScreen];

// ── Bottom Navigation ────────────────────────────────────────
function BottomNav() {
  const { activeTab, setTab } = useNavigationStore();
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item, i) => {
        const isActive = activeTab === i;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setTab(i)}
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            {/* Dot indicator */}
            {isActive && (
              <motion.div
                layoutId="nav-dot"
                style={{
                  position: 'absolute',
                  top: -2,
                  width: 20,
                  height: 3,
                  background: 'var(--gold-gradient)',
                  borderRadius: 2,
                }}
              />
            )}
            {item.icon(isActive)}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ── Swipe Gesture Hook ──────────────────────────────────────
function useSwipe(onLeft: () => void, onRight: () => void) {
  const startX = useRef(0);
  const startY = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = e.changedTouches[0].clientY - startY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
      if (dx < 0) onLeft();
      else onRight();
    }
  };

  return { onTouchStart, onTouchEnd };
}

// ── Main Shell ──────────────────────────────────────────────
export function App() {
  const { logado, carregando, inicializarSessao, usuario } = useAuthStore();
  const { activeTab, setTab, getActiveOverlay, getActiveOverlayProps, popOverlay } = useNavigationStore();

  // Recupera sessão salva do Supabase ao iniciar o app
  useEffect(() => {
    inicializarSessao();
  }, []);

  const activeOverlay = getActiveOverlay();

  const swipe = useSwipe(
    () => setTab(Math.min(activeTab + 1, 4)),
    () => setTab(Math.max(activeTab - 1, 0)),
  );

  // Splash de carregamento enquanto verifica sessão
  if (carregando && !logado) {
    return (
      <div style={{
        width: '100%', height: '100dvh', background: 'var(--obsidian-900)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 20,
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 60, height: 60, borderRadius: '50%',
            border: '3px solid rgba(212,160,23,0.2)',
            borderTop: '3px solid var(--gold-400)',
            boxShadow: '0 0 20px rgba(212,160,23,0.3)',
          }}
        />
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: 14,
          color: 'var(--gold-400)', letterSpacing: '0.12em',
        }}>
          Conectando à Arena...
        </p>
      </div>
    );
  }

  // Se não logado, mostra tela de login
  if (!logado) {
    return <LoginScreen />;
  }


  return (
    <AmigosRealtimeProvider userId={usuario?.id}>
      <div className="app-shell">
        {/* Container de telas deslizantes */}
        <div className="screens-container" {...swipe}>
          <div
            className="screens-track"
            style={{ transform: `translateX(-${activeTab * 20}%)` }}
          >
            {SCREENS.map((Screen, i) => (
              <div key={i} className="screen-panel">
                <Screen />
              </div>
            ))}
          </div>
        </div>

        {/* Barra de navegação inferior */}
        <BottomNav />

        {/* Overlays (bottom sheets & telas cheias) */}
        <AnimatePresence>
          {activeOverlay === 'salas'         && <SalasOverlay         key="salas"         />}
          {activeOverlay === 'jogo'          && <GameOverlay          key="jogo"          />}
          {activeOverlay === 'amigos-online' && <AmigosUsuariosOverlay  key="amigos-online" />}
          {activeOverlay === 'perfil'        && <ProfileOverlay       key="perfil"        />}
          {activeOverlay === 'configuracoes' && <ConfiguracoesOverlay key="configuracoes" />}
          {activeOverlay === 'deixar-recado' && <DeixarRecadoOverlay key="deixar-recado" />}
          {activeOverlay === 'recados' && <RecadosOverlay key="recados" />}
          {activeOverlay === 'arena-menu' && <ArenaMenuOverlay key="arena-menu" />}
          {activeOverlay === 'solicitacoes-amizade' && <SolicitacoesOverlay key="solicitacoes-amizade" />}
          {activeOverlay === 'friend-action' && (
            <FriendActionSheet
              key="friend-action"
              amigo={getActiveOverlayProps().amigo as Amigo}
              status={getActiveOverlayProps().status as 'disponivel' | 'jogando' | 'offline' | undefined}
              onClose={popOverlay}
            />
          )}
        </AnimatePresence>
      </div>
    </AmigosRealtimeProvider>
  );
}
