// ============================================================
// CARD RULES — Exportação centralizada das regras de jogo
// ============================================================

export {
  TRUCO_MINEIRO_RULES,
  type Manilha,
  type CardHierarchyMineiro,
} from './mineiro';

export {
  TRUCO_PAULISTA_BASE,
  TrucoPaulistaRegras,
  gerarManilhasPaulista,
  type ManilhaPaulista,
} from './paulista';
