// ============================================================
// STORES — Arena Truco Premium
// useNavigationStore: Gerencia telas/overlays estilo Native App
// ============================================================

import { create } from 'zustand';
import type { TelaId, OverlayId } from '../types';

interface NavigationState {
  activeTab: number;         // 0=Loja 1=Modos 2=Arena 3=Ranking 4=Clãs
  overlayStack: OverlayId[]; // Stack de overlays abertos
  overlayProps: Record<string, unknown>; // Props passadas para overlays

  setTab: (index: number) => void;
  pushOverlay: (overlay: OverlayId, props?: Record<string, unknown>) => void;
  popOverlay: () => void;
  clearOverlays: () => void;
  getActiveOverlay: () => OverlayId | null;
}

export const TAB_NAMES: TelaId[] = ['loja', 'modos', 'arena', 'ranking', 'clans'];

export const useNavigationStore = create<NavigationState>((set, get) => ({
  activeTab: 2, // Arena é a tela central (index 2)
  overlayStack: [],
  overlayProps: {},

  setTab: (index) => set({ activeTab: index }),

  pushOverlay: (overlay, props = {}) =>
    set(state => ({
      overlayStack: [...state.overlayStack, overlay],
      overlayProps: { ...state.overlayProps, ...props },
    })),

  popOverlay: () =>
    set(state => ({
      overlayStack: state.overlayStack.slice(0, -1),
    })),

  clearOverlays: () => set({ overlayStack: [], overlayProps: {} }),

  getActiveOverlay: () => {
    const { overlayStack } = get();
    return overlayStack.length > 0 ? overlayStack[overlayStack.length - 1] : null;
  },
}));
