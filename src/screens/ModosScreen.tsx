// ============================================================
// TELA MODOS — ModosScreen.tsx
// Seleção de modo de jogo com cards premium
// ============================================================

import { motion } from 'framer-motion';
import { useNavigationStore } from '../stores/useNavigationStore';

const MODOS = [
  {
    id: 'paulista',
    titulo: 'Truco Paulista',
    descricao: 'Manilha variável baseada no "vira". O clássico de São Paulo com 12 pontos.',
    icone: '🏙️',
    cor: '#4361ee',
    corFundo: 'rgba(67,97,238,0.12)',
    borda: 'rgba(67,97,238,0.3)',
    destaque: true,
    tag: 'Mais Jogado',
    regras: ['Manilha Nova (vira+1)', '12 pontos por jogo', 'Truco → 3, 6, 9, 12'],
  },
  {
    id: 'mineiro',
    titulo: 'Truco Mineiro',
    descricao: 'Manilha fixa: Espadilha, Sete de Ouro, Copas e Zap. O jeito mineiro de jogar!',
    icone: '⛏️',
    cor: '#d4a017',
    corFundo: 'rgba(212,160,23,0.1)',
    borda: 'rgba(212,160,23,0.3)',
    destaque: false,
    tag: 'Clássico',
    regras: ['Manilha Fixa', '12 pontos por jogo', 'Truco → 3, 6, 9, 12'],
  },
  {
    id: 'torneio',
    titulo: 'Torneios',
    descricao: 'Dispute torneios eliminatórios. Os melhores chegam à final e ganham gemas raras.',
    icone: '🏆',
    cor: '#e63946',
    corFundo: 'rgba(230,57,70,0.1)',
    borda: 'rgba(230,57,70,0.3)',
    destaque: false,
    tag: 'Em Breve',
    regras: ['Chaves eliminatórias', 'Prêmios em gemas', 'Top 3 no Ranking Global'],
  },
];

export function ModosScreen() {
  const { pushOverlay } = useNavigationStore();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '20px 16px 12px',
        flexShrink: 0,
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          fontWeight: 900,
          color: 'var(--text-primary)',
          margin: 0,
          letterSpacing: '-0.02em',
        }}>
          ⚔️ Modos de Jogo
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>
          Escolha como quer jogar hoje
        </p>
      </div>

      {/* Lista de Modos */}
      <div className="list-container" style={{ flex: 1, padding: '16px' }}>
        {MODOS.map((modo, i) => (
          <motion.div
            key={modo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            onClick={() => {
              if (modo.id !== 'torneio') pushOverlay('salas');
            }}
            style={{
              background: modo.corFundo,
              border: `1px solid ${modo.borda}`,
              borderRadius: 18,
              padding: '18px 16px',
              marginBottom: 12,
              cursor: modo.id !== 'torneio' ? 'pointer' : 'default',
              opacity: modo.id === 'torneio' ? 0.6 : 1,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {modo.tag && (
              <div style={{
                position: 'absolute', top: 12, right: 12,
                background: modo.id === 'paulista' ? 'var(--sapphire-gradient)' : modo.id === 'mineiro' ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.1)',
                color: modo.id === 'mineiro' ? '#0a0a0f' : 'white',
                fontSize: 9,
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                letterSpacing: '0.06em',
                padding: '3px 10px',
                borderRadius: 20,
              }}>
                {modo.tag}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              {/* Ícone */}
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: `${modo.corFundo}`,
                border: `1px solid ${modo.borda}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, flexShrink: 0,
                filter: `drop-shadow(0 0 8px ${modo.cor})`,
              }}>
                {modo.icone}
              </div>

              {/* Info */}
              <div style={{ flex: 1, paddingRight: 40 }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  fontWeight: 800,
                  color: modo.cor,
                  margin: '0 0 6px',
                }}>
                  {modo.titulo}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 10px', lineHeight: 1.5 }}>
                  {modo.descricao}
                </p>

                {/* Regras */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {modo.regras.map(r => (
                    <span
                      key={r}
                      style={{
                        fontSize: 10,
                        color: modo.cor,
                        background: `${modo.corFundo}`,
                        border: `1px solid ${modo.borda}`,
                        padding: '2px 8px',
                        borderRadius: 20,
                        fontWeight: 600,
                      }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Info de manilhas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card"
          style={{ padding: '14px 16px', marginTop: 4 }}
        >
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--gold-400)',
            marginBottom: 10,
          }}>
            📖 Força das Cartas (Manilha Mineiro)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, textAlign: 'center' }}>
            {[
              { carta: '4♠', nome: 'Zap', rank: '1°' },
              { carta: '7♦', nome: 'Espadilha', rank: '2°' },
              { carta: 'A♥', nome: 'Copas', rank: '3°' },
              { carta: '7♣', nome: 'Paus', rank: '4°' },
            ].map(m => (
              <div key={m.nome} style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 8,
                padding: '8px 4px',
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{m.carta}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--gold-400)' }}>{m.rank}</div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{m.nome}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
