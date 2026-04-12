// ============================================================
// TELA LOJA — LojaScreen.tsx
// Grid de Pacotes Premium com design Obsidian & Gold
// ============================================================

import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';
import { LOJA_ITEMS } from '../mockData';
import type { ItemLoja } from '../types';

function ItemCard({ item, index }: { item: ItemLoja; index: number }) {
  const { atualizarMoedas } = useAuthStore();

  const handleComprar = () => {
    if (item.moeda === 'moedas') atualizarMoedas(-item.preco);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      style={{
        background: item.destaque
          ? 'linear-gradient(135deg, rgba(212,160,23,0.12) 0%, rgba(212,160,23,0.04) 100%)'
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${item.destaque ? 'var(--border-gold)' : 'var(--border-card)'}`,
        borderRadius: 16,
        padding: '14px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.15s ease',
      }}
      whileTap={{ scale: 0.95 }}
      onClick={handleComprar}
    >
      {item.tag && (
        <div style={{
          position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
          background: item.destaque ? 'var(--gold-gradient)' : 'var(--ruby-gradient)',
          color: '#0a0a0f',
          fontSize: 9,
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          letterSpacing: '0.08em',
          padding: '2px 10px',
          borderRadius: 20,
          whiteSpace: 'nowrap',
        }}>
          {item.tag}
        </div>
      )}

      {/* Ícone */}
      <div style={{ fontSize: 36, lineHeight: 1, filter: item.destaque ? 'drop-shadow(0 0 12px rgba(212,160,23,0.5))' : 'none' }}>
        {item.icone}
      </div>

      {/* Nome */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 13,
        fontWeight: 700,
        color: item.destaque ? 'var(--gold-400)' : 'var(--text-primary)',
        textAlign: 'center',
        lineHeight: 1.2,
      }}>
        {item.nome}
      </div>

      {/* Descrição */}
      <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>
        {item.descricao}
      </div>

      {/* Preço */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: 'rgba(0,0,0,0.3)',
        padding: '5px 12px',
        borderRadius: 20,
        border: '1px solid var(--border-subtle)',
      }}>
        <span>{item.moeda === 'moedas' ? '🪙' : '💎'}</span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 14,
          fontWeight: 800,
          color: item.moeda === 'gemas' ? '#b0d4ff' : 'var(--gold-400)',
        }}>
          {item.preco.toLocaleString('pt-BR')}
        </span>
      </div>
    </motion.div>
  );
}

export function LojaScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '20px 16px 12px',
        flexShrink: 0,
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(10px)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          fontWeight: 900,
          color: 'var(--gold-400)',
          margin: 0,
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          🏪 Loja Premium
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>
          Baús, skins e gemas exclusivas
        </p>
      </div>

      {/* Grid */}
      <div className="list-container" style={{ flex: 1, padding: '12px 16px 16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
        }}>
          {LOJA_ITEMS.map((item, i) => (
            <ItemCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* Banner Especial */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: 16,
            padding: '18px 20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(123,45,139,0.3) 0%, rgba(67,97,238,0.2) 100%)',
            border: '1px solid rgba(123,45,139,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{ fontSize: 40 }}>👑</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'var(--lavender)' }}>
              Passe Premium
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Acesso ilimitado a todas as skins e baús diários por 30 dias.
            </div>
          </div>
          <div style={{
            background: 'var(--gold-gradient)',
            color: '#0a0a0f',
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            fontWeight: 800,
            padding: '8px 14px',
            borderRadius: 20,
            whiteSpace: 'nowrap',
          }}>
            💎 49
          </div>
        </motion.div>
      </div>
    </div>
  );
}
