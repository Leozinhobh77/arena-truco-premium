// ============================================================
// TENTOS RULES — Exportação centralizada das regras de tentos
// ============================================================

export {
  TRUCO_MINEIRO_TENTOS,
  obterProximoTento as obterProximoTentoMineiro,
  obterTentoPorComando as obterTentoPorComandoMineiro,
  obterDescricaoTento as obterDescricaoTentoMineiro,
  éMaximoTento as éMaximoTentoMineiro,
  éTentoValido as éTentoValidoMineiro,
  type TentoMineiro,
  type ComandoMineiro,
} from './mineiro';

export {
  TRUCO_PAULISTA_TENTOS,
  obterProximoTento as obterProximoTentoPaulista,
  obterTentoPorComando as obterTentoPorComandoPaulista,
  obterDescricaoTento as obterDescricaoTentoPaulista,
  éMaximoTento as éMaximoTentoPaulista,
  éTentoValido as éTentoValidoPaulista,
  type TentoPaulista,
  type ComandoPaulista,
} from './paulista';
