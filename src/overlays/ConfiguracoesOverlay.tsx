// ============================================================
// OVERLAY: CONFIGURAÇÕES — ConfiguracoesOverlay.tsx
// Opções de som, perfil e o botão SAIR (Logout)
// ============================================================

import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigationStore } from '../stores/useNavigationStore';
import { supabase } from '../lib/supabase';

export function ConfiguracoesOverlay() {
  const { logout, usuario } = useAuthStore();
  const { popOverlay, pushOverlay } = useNavigationStore();

  const handleSair = async () => {
    // Verificar se há outros devices antes de marcar offline
    if (usuario?.id) {
      try {
        const presenceChannel = supabase.channel(`presence-${usuario.id}`);
        await presenceChannel.subscribe();

        const presenceState = presenceChannel.presenceState();
        const otherDevices = presenceState && Object.keys(presenceState).length > 1;

        await supabase.removeChannel(presenceChannel);

        // Só marcar offline se esse for o último device
        if (!otherDevices) {
          await (supabase as any)
            .from('profiles')
            .update({
              status_atual: 'offline',
              atualizado_status_em: new Date().toISOString(),
            })
            .eq('id', usuario.id);
        }
      } catch (err) {
        // silenciar erro para não bloquear logout
        console.error('Erro ao verificar presença:', err);
      }
    }

    await logout();
    popOverlay();
  };

  const handleEditarPerfil = () => {
    pushOverlay('perfil', { editMode: true });
  };

  const handleStatus = () => {
    pushOverlay('status-editor');
  };

  const handleArenaMenu = () => {
    pushOverlay('arena-menu');
  };

  const handleGameRoom = () => {
    pushOverlay('game-room');
  };

  const handleGameRoom2v2_1 = () => {
    pushOverlay('sala-2v2-1');
  };

  const handleCartas = () => {
    pushOverlay('cards-gallery');
  };

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
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90dvh',
          overflow: 'hidden',
        }}
      >
        {/* Alça de arraste */}
        <div style={{
          width: 40, height: 4, background: 'rgba(255,255,255,0.1)',
          borderRadius: 2, margin: '12px auto 24px'
        }} />

        {/* Título */}
        <div style={{ padding: '0 24px 20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, color: 'var(--gold-400)', margin: 0 }}>Preferências</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>Arena Truco Premium</p>
        </div>

        {/* Menu Items */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'y-auto', flex: 1 }}>
          
          <div className="glass-card" style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>🔊</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Efeitos Sonoros</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Sons de cartas e alertas</div>
              </div>
            </div>
            <div style={{ width: 44, height: 24, borderRadius: 12, background: 'var(--gold-gradient)', position: 'relative' }}>
              <div style={{ position: 'absolute', right: 2, top: 2, width: 20, height: 20, borderRadius: '50%', background: 'white' }} />
            </div>
          </div>

          <div className="glass-card" style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>🎵</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Música Ambiente</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Trilha sonora da Arena</div>
              </div>
            </div>
            <div style={{ width: 44, height: 24, borderRadius: 12, background: 'var(--gold-gradient)', position: 'relative' }}>
              <div style={{ position: 'absolute', right: 2, top: 2, width: 20, height: 20, borderRadius: '50%', background: 'white' }} />
            </div>
          </div>

          <button
            onClick={handleArenaMenu}
            style={{
              width: '100%', padding: 16, textAlign: 'left',
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 12,
              color: 'var(--text-primary)', cursor: 'pointer', marginTop: 10,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212,160,23,0.1)';
              e.currentTarget.style.borderColor = 'var(--gold-400)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <span style={{ fontSize: 20 }}>🎮</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Arena</span>
          </button>

          <button
            onClick={handleGameRoom}
            style={{
              width: '100%', padding: 16, textAlign: 'left',
              background: 'rgba(212,160,23,0.1)', border: '1px solid var(--gold-400)',
              borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 12,
              color: 'var(--text-primary)', cursor: 'pointer', marginTop: 8,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212,160,23,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212,160,23,0.1)';
            }}
          >
            <span style={{ fontSize: 20 }}>🎴</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Sala 2v2</span>
          </button>

          <button
            onClick={handleGameRoom2v2_1}
            style={{
              width: '100%', padding: 16, textAlign: 'left',
              background: 'rgba(212,160,23,0.1)', border: '1px solid var(--gold-400)',
              borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 12,
              color: 'var(--text-primary)', cursor: 'pointer', marginTop: 8,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212,160,23,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212,160,23,0.1)';
            }}
          >
            <span style={{ fontSize: 20 }}>🎴</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Sala 2v2.1</span>
          </button>

          <button
            onClick={handleCartas}
            style={{
              width: '100%', padding: 16, textAlign: 'left',
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 12,
              color: 'var(--text-primary)', cursor: 'pointer', marginTop: 8,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212,160,23,0.1)';
              e.currentTarget.style.borderColor = 'var(--gold-400)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <span style={{ fontSize: 20 }}>📋</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Cartas</span>
          </button>

          <button
            style={{
              width: '100%', padding: 16, textAlign: 'left',
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              color: 'var(--text-muted)', cursor: 'not-allowed', marginTop: 8,
              opacity: 0.5
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>🎴</span>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Sala 1v1</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Em implantação</span>
          </button>

          <div className="separator" style={{ margin: '10px 0' }} />

          {/* Seção de Conta */}
          <div style={{ padding: '0 8px 8px', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Conta</div>
          
          <button
            onClick={handleEditarPerfil}
            style={{
              width: '100%', padding: 16, textAlign: 'left',
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 12,
              color: 'var(--text-primary)', cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: 20 }}>👤</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Editar Perfil</span>
          </button>

          <button
            onClick={handleStatus}
            style={{
              width: '100%', padding: 16, textAlign: 'left',
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 12,
              color: 'var(--text-primary)', cursor: 'pointer', marginTop: 8
            }}
          >
            <span style={{ fontSize: 20 }}>✨</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Status</span>
          </button>

          <button
            onClick={handleSair}
            style={{ 
              width: '100%', padding: 16, textAlign: 'left', 
              background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.2)',
              borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 12,
              color: 'var(--ruby)', cursor: 'pointer', marginTop: 10
            }}
          >
            <span style={{ fontSize: 20 }}>🚪</span>
            <span style={{ fontSize: 15, fontWeight: 700 }}>SAIR DA ARENA</span>
          </button>

        </div>

        {/* Versão */}
        <div style={{ padding: '32px 0 10px', textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', opacity: 0.5 }}>
          v5.2 Platinum Edition · Forge Core
        </div>
      </motion.div>
    </div>
  );
}
