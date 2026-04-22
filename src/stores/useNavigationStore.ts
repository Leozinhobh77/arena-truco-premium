// ============================================================
// STORES — Arena Truco Premium
// useNavigationStore: Gerencia telas/overlays estilo Native App
// ============================================================

import { create } from 'zustand';
import type { TelaId, OverlayId } from '../types';

interface NavigationState {
  activeTab: number;         // 0=Loja 1=Modos 2=Arena 3=Ranking 4=Clãs
  overlayStack: OverlayId[]; // Stack de overlays abertos
  overlayPropsStack: Record<string, unknown>[]; // Props para cada overlay na stack
  overlayProps: Record<string, unknown>; // Props passadas para overlays (deprecado, manter compatibilidade)

  setTab: (index: number) => void;
  pushOverlay: (overlay: OverlayId, props?: Record<string, unknown>) => void;
  popOverlay: () => void;
  clearOverlays: () => void;
  getActiveOverlay: () => OverlayId | null;
  getActiveOverlayProps: () => Record<string, unknown>;
}

export const TAB_NAMES: TelaId[] = ['loja', 'modos', 'arena', 'ranking', 'clans'];

export const useNavigationStore = create<NavigationState>((set, get) => ({
  activeTab: 2, // Arena é a tela central (index 2)
  overlayStack: [],
  overlayPropsStack: [],
  overlayProps: {}, // Manter pra compatibilidade

  setTab: (index) => set({ activeTab: index }),

  pushOverlay: (overlay, props = {}) =>
    set(state => ({
      overlayStack: [...state.overlayStack, overlay],
      overlayPropsStack: [...state.overlayPropsStack, props],
      overlayProps: { ...state.overlayProps, ...props }, // Manter compatibilidade
    })),

  popOverlay: () =>
    set(state => ({
      overlayStack: state.overlayStack.slice(0, -1),
      overlayPropsStack: state.overlayPropsStack.slice(0, -1),
    })),

  clearOverlays: () => set({ overlayStack: [], overlayPropsStack: [], overlayProps: {} }),

  getActiveOverlay: () => {
    const { overlayStack } = get();
    return overlayStack.length > 0 ? overlayStack[overlayStack.length - 1] : null;
  },

  getActiveOverlayProps: () => {
    const { overlayPropsStack } = get();
    return overlayPropsStack.length > 0 ? overlayPropsStack[overlayPropsStack.length - 1] : {};
  },
}));
