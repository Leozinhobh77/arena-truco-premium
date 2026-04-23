// ============================================================
// AMIGOS & USUÁRIOS OVERLAY — Arena Truco Premium
// 2 abas: Amigos (com 3 seções) e Busca de Usuários
// ============================================================

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useAmigosRealtime } from '../hooks/useAmigosRealtime';
import { useÚltimosJogadores } from '../hooks/useÚltimosJogadores';
import { useBuscaUsuarios } from '../hooks/useBuscaUsuarios';
import { useRecadosNaoLidosPorAmigo } from '../hooks/useRecadosNaoLidosPorAmigo';
import type { Amigo } from '../types';

type AbaAtiva = 'amigos' | 'usuarios';
type TipoOdenacao = 'padrao' | 'recentes' | 'ranking' | 'favoritos';
type FiltroUsuario = 'tudo' | 'mesmo-nivel' | 'clans';

// ── Card de Amigo ──────────────────────────────────────────
interface AmigoCardProps {
  amigo: Amigo;
  recadosNaoLidos: number;
  onClique: () => void;
}

function AmigoCard({ amigo, recadosNaoLidos, onClique }: AmigoCardProps) {
  const statusCores = {
    disponivel: { cor: '#2dc653', label: '🟢 Disponível' },
    jogando: { cor: '#f5a623', label: '🟡 Jogando' },
    offline: { cor: 'rgba(255,255,255,0.3)', label: '⚫ Offline' },
  };

  const { cor, label } = statusCores[amigo.statusAmigo || 'offline'];

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClique}
      style={{
        width: '100%',
        padding: '12px 14px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
        cursor: 'pointer',
      }}
    >
      {/* Avatar com status */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img
          src={amigo.avatar}
          alt={amigo.nick}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: `2px solid ${cor}`,
            display: 'block',
          }}
        />
        {amigo.statusAmigo !== 'offline' && (
          <div
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: cor,
              border: '2px solid rgba(10,8,30,0.9)',
            }}
          />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
          {amigo.nick}
        </div>
        <div style={{ fontSize: 11, color: cor, fontWeight: 500 }}>
          {label} {amigo.ultimaAtividade && `• ${amigo.ultimaAtividade}`}
        </div>
      </div>

      {/* Badges */}
      {recadosNaoLidos > 0 && (
        <div
          style={{
            background: 'var(--gold-400)',
            color: '#0a081e',
            width: 20,
            height: 20,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 900,
            flexShrink: 0,
          }}
        >
          {recadosNaoLidos > 9 ? '9+' : recadosNaoLidos}
        </div>
      )}

      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>›</span>
    </motion.button>
  );
}

// ── Card de Usuário (resultado de busca) ────────────────────
interface UsuarioCardProps {
  usuario: any;
  onVerPerfil: () => void;
  onAdicionar: () => void;
}

function UsuarioCard({ usuario, onVerPerfil, onAdicionar }: UsuarioCardProps) {
  const winRate = Math.round((usuario.vitorias / Math.max(usuario.partidas, 1)) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '12px 14px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        marginBottom: 10,
      }}
    >
      {/* Header com avatar e info básica */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <img
          src={usuario.avatar}
          alt={usuario.nick}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: '2px solid var(--gold-400)',
            display: 'block',
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
            {usuario.nick}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Nível {usuario.nivel} • Ranking #{usuario.ranking}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div style={{ background: 'rgba(45,198,83,0.1)', borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#2dc653' }}>{winRate}%</div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>Win Rate</div>
        </div>
        <div style={{ background: 'rgba(212,160,23,0.1)', borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold-400)' }}>{usuario.partidas}</div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>Partidas</div>
        </div>
      </div>

      {/* Botões */}
      <div style={{ display: 'flex', gap: 8 }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onVerPerfil}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            color: 'var(--text-primary)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          👤 Ver Perfil
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onAdicionar}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: 'rgba(212,160,23,0.15)',
            border: '1px solid rgba(212,160,23,0.3)',
            borderRadius: 8,
            color: 'var(--gold-400)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {usuario.jaAmigo ? '🤝 Amigos' : '➕ Adicionar'}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Seção de Amigos ────────────────────────────────────────
interface SecaoAmigosProps {
  titulo: string;
  amigos: Amigo[];
  recadosPorAmigo: Record<string, number>;
  onClique: (amigo: Amigo) => void;
  mostarVazio?: boolean;
}

function SecaoAmigos({ titulo, amigos, recadosPorAmigo, onClique, mostarVazio = true }: SecaoAmigosProps) {
  if (amigos.length === 0) {
    return mostarVazio ? (
      <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: 12 }}>
        Nenhum amigo {titulo.toLowerCase()}
      </div>
    ) : null;
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {titulo}
      </div>
      {amigos.map(amigo => (
        <AmigoCard
          key={amigo.id}
          amigo={amigo}
          recadosNaoLidos={recadosPorAmigo[amigo.id] || 0}
          onClique={() => onClique(amigo)}
        />
      ))}
    </div>
  );
}

// ── MAIN OVERLAY ───────────────────────────────────────────
export function AmigosUsuariosOverlay() {
  const { popOverlay, pushOverlay } = useNavigationStore();
  const { usuario } = useAuthStore();
  const { amigos: amigosComStatus } = useAmigosRealtime(usuario?.id);
  const { últimosJogadores } = useÚltimosJogadores();
  const { resultados, buscar, limpar } = useBuscaUsuarios('tudo');
  const { recadosPorAmigo } = useRecadosNaoLidosPorAmigo();

  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('amigos');
  const [ordenacao, setOrdenacao] = useState<TipoOdenacao>('padrao');
  const [filtroUsuario, setFiltroUsuario] = useState<FiltroUsuario>('tudo');
  const [buscaLocal, setBuscaLocal] = useState('');
  const [favoritos] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ mensagem: string; tipo: 'info' | 'sucesso' } | null>(null);
  const [statusAnterior, setStatusAnterior] = useState<Record<string, string | undefined>>({});

  // Aplicar ordenação
  const amigosOrdenados = useMemo(() => {
    const copy = [...amigosComStatus];

    switch (ordenacao) {
      case 'recentes':
        // Amigos que jogou recentemente aparecem primeiro
        const idÚltimos = new Set(últimosJogadores.map(a => a.id));
        return copy.sort((a, b) => {
          const aRecente = idÚltimos.has(a.id) ? 0 : 1;
          const bRecente = idÚltimos.has(b.id) ? 0 : 1;
          return aRecente - bRecente;
        });

      case 'ranking':
        return copy.sort((a, b) => (a.ranking || 9999) - (b.ranking || 9999));

      case 'favoritos':
        return copy.sort((a, b) => {
          const aFav = favoritos.has(a.id) ? 0 : 1;
          const bFav = favoritos.has(b.id) ? 0 : 1;
          return aFav - bFav;
        });

      case 'padrao':
      default:
        return copy.sort((a, b) => {
          const ordem = { disponivel: 0, jogando: 1, offline: 2 };
          const aStatus = ordem[a.statusAmigo || 'offline'] || 2;
          const bStatus = ordem[b.statusAmigo || 'offline'] || 2;
          return aStatus - bStatus;
        });
    }
  }, [amigosComStatus, ordenacao, favoritos, últimosJogadores]);

  // Separar por status
  const amigosOnline = useMemo(() => amigosOrdenados.filter(a => a.statusAmigo === 'disponivel'), [amigosOrdenados]);
  const amigosJogando = useMemo(() => amigosOrdenados.filter(a => a.statusAmigo === 'jogando'), [amigosOrdenados]);
  const amigosOffline = useMemo(() => amigosOrdenados.filter(a => a.statusAmigo === 'offline'), [amigosOrdenados]);

  // Detectar mudanças de status e mostrar toasts
  useEffect(() => {
    amigosComStatus.forEach(amigo => {
      const statusAtual = amigo.statusAmigo || 'offline';
      const statusPrev = statusAnterior[amigo.id];

      if (statusPrev === undefined) {
        // Primeira vez que vê este amigo
        setStatusAnterior(prev => ({ ...prev, [amigo.id]: statusAtual }));
        return;
      }

      if (statusPrev !== statusAtual) {
        // Status mudou!
        let mensagem = '';
        if (statusAtual === 'disponivel') {
          mensagem = `🟢 ${amigo.nick} entrou online`;
        } else if (statusAtual === 'jogando') {
          mensagem = `🟡 ${amigo.nick} começou a jogar`;
        } else if (statusAtual === 'offline') {
          mensagem = `⚫ ${amigo.nick} saiu offline`;
        }

        if (mensagem) {
          setToast({ mensagem, tipo: 'info' });
          setTimeout(() => setToast(null), 3000);
        }

        setStatusAnterior(prev => ({ ...prev, [amigo.id]: statusAtual }));
      }
    });
  }, [amigosComStatus, statusAnterior]);

  const handleCliqueSobreAmigo = (amigo: Amigo) => {
    popOverlay();
    pushOverlay('friend-action', { amigo, status: amigo.statusAmigo });
  };

  const handleVerPerfil = (usuario: any) => {
    popOverlay();
    pushOverlay('perfil', { usuarioDireto: { ...usuario, nome: usuario.nick } });
  };

  const handleAdicionar = async (usuario: any) => {
    // TODO: Implementar lógica de adicionar amigo
    console.log('Adicionar amigo:', usuario.id);
  };

  return (
    <div className="overlay" style={{ alignItems: 'stretch' }}>
      <div className="overlay-backdrop" onClick={popOverlay} />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        className="modal-sheet"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          background: 'var(--obsidian-700)',
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto auto 0',
          height: '90dvh',
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: 36,
            height: 4,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 2,
            margin: '12px auto 0',
            flexShrink: 0,
          }}
        />

        {/* Header com Abas */}
        <div
          style={{
            padding: '16px 16px 0',
            flexShrink: 0,
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            {(['amigos', 'usuarios'] as const).map(aba => (
              <motion.button
                key={aba}
                onClick={() => {
                  setAbaAtiva(aba);
                  if (aba === 'usuarios') limpar();
                }}
                style={{
                  padding: '12px 16px',
                  background: abaAtiva === aba ? 'rgba(212,160,23,0.15)' : 'transparent',
                  border: 'none',
                  borderBottom: abaAtiva === aba ? '2px solid var(--gold-400)' : '2px solid transparent',
                  color: abaAtiva === aba ? 'var(--gold-400)' : 'var(--text-muted)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
                whileTap={{ scale: 0.98 }}
              >
                {aba === 'amigos' ? '👥 Amigos' : '🔍 Usuários'}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="list-container" style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            {abaAtiva === 'amigos' ? (
              <motion.div
                key="amigos"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Dropdown de Ordenação */}
                <div style={{ marginBottom: 16 }}>
                  <select
                    value={ordenacao}
                    onChange={e => setOrdenacao(e.target.value as TipoOdenacao)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 8,
                      color: 'var(--text-primary)',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    <option value="padrao">Padrão (Online → Jogando → Offline)</option>
                    <option value="recentes">Recentes (quem jogou comigo)</option>
                    <option value="ranking">Ranking (melhor ranqueados)</option>
                    <option value="favoritos">❤️ Favoritos</option>
                  </select>
                </div>

                {/* Últimos Jogadores */}
                {últimosJogadores.length > 0 && (
                  <SecaoAmigos
                    titulo="⚔️ ÚLTIMOS JOGADORES"
                    amigos={últimosJogadores}
                    recadosPorAmigo={recadosPorAmigo}
                    onClique={handleCliqueSobreAmigo}
                    mostarVazio={false}
                  />
                )}

                {/* Seções por Status */}
                <SecaoAmigos
                  titulo={`🟢 DISPONÍVEIS (${amigosOnline.length})`}
                  amigos={amigosOnline}
                  recadosPorAmigo={recadosPorAmigo}
                  onClique={handleCliqueSobreAmigo}
                />

                <SecaoAmigos
                  titulo={`🟡 JOGANDO (${amigosJogando.length})`}
                  amigos={amigosJogando}
                  recadosPorAmigo={recadosPorAmigo}
                  onClique={handleCliqueSobreAmigo}
                />

                <SecaoAmigos
                  titulo={`⚫ OFFLINE (${amigosOffline.length})`}
                  amigos={amigosOffline}
                  recadosPorAmigo={recadosPorAmigo}
                  onClique={handleCliqueSobreAmigo}
                />
              </motion.div>
            ) : (
              <motion.div
                key="usuarios"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Search Input */}
                <div style={{ marginBottom: 16 }}>
                  <input
                    type="text"
                    placeholder="🔍 Digita um nome..."
                    value={buscaLocal}
                    onChange={e => {
                      setBuscaLocal(e.target.value);
                      buscar(e.target.value);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 8,
                      color: 'var(--text-primary)',
                      fontSize: 13,
                    }}
                  />
                </div>

                {/* Filtros */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                  {(['tudo', 'mesmo-nivel', 'clans'] as const).map(filtro => (
                    <motion.button
                      key={filtro}
                      onClick={() => {
                        setFiltroUsuario(filtro);
                        buscar(buscaLocal);
                      }}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        padding: '8px 12px',
                        background: filtroUsuario === filtro ? 'rgba(212,160,23,0.15)' : 'rgba(255,255,255,0.05)',
                        border: filtroUsuario === filtro ? '1px solid rgba(212,160,23,0.4)' : '1px solid var(--border-subtle)',
                        borderRadius: 8,
                        color: filtroUsuario === filtro ? 'var(--gold-400)' : 'var(--text-muted)',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {filtro === 'tudo' ? 'Tudo' : filtro === 'mesmo-nivel' ? 'Mesmo Nível' : '🏠 Clãs'}
                    </motion.button>
                  ))}
                </div>

                {/* Resultados */}
                {buscaLocal.length < 2 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: 12 }}>
                    Digita pelo menos 2 caracteres para buscar
                  </div>
                ) : resultados.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: 12 }}>
                    Nenhum usuário encontrado
                  </div>
                ) : (
                  resultados.map(usuario => (
                    <UsuarioCard
                      key={usuario.id}
                      usuario={usuario}
                      onVerPerfil={() => handleVerPerfil(usuario)}
                      onAdicionar={() => handleAdicionar(usuario)}
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toast de Notificação */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                position: 'absolute',
                bottom: 90,
                left: 16,
                right: 16,
                background: toast.tipo === 'info' ? 'rgba(212,160,23,0.15)' : 'rgba(45,198,83,0.15)',
                border: `1px solid ${toast.tipo === 'info' ? 'rgba(212,160,23,0.4)' : 'rgba(45,198,83,0.4)'}`,
                borderRadius: 12,
                padding: '12px 16px',
                textAlign: 'center',
                fontSize: 12,
                fontWeight: 600,
                color: toast.tipo === 'info' ? 'var(--gold-400)' : '#2dc653',
              }}
            >
              {toast.mensagem}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão de Fechar */}
        <div style={{ padding: '8px 16px 16px', flexShrink: 0 }}>
          <button
            className="btn-secondary"
            style={{ width: '100%', padding: '10px 16px', fontSize: 13 }}
            onClick={popOverlay}
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
