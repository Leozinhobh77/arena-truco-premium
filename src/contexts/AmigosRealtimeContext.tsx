import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useAmigosRealtime } from '../hooks/useAmigosRealtime';
import type { Amigo } from '../types';

interface AmigosRealtimeContextType {
  amigos: Amigo[];
  loading: boolean;
  totalOnline: number;
  recarregar: () => Promise<void>;
}

const AmigosRealtimeContext = createContext<AmigosRealtimeContextType | undefined>(undefined);

interface AmigosRealtimeProviderProps {
  userId: string | undefined;
  children: ReactNode;
}

export function AmigosRealtimeProvider({ userId, children }: AmigosRealtimeProviderProps) {
  const { amigos, loading, totalOnline, recarregar } = useAmigosRealtime(userId);

  return (
    <AmigosRealtimeContext.Provider value={{ amigos, loading, totalOnline, recarregar }}>
      {children}
    </AmigosRealtimeContext.Provider>
  );
}

export function useAmigosRealtimeContext() {
  const context = useContext(AmigosRealtimeContext);
  if (context === undefined) {
    throw new Error('useAmigosRealtimeContext deve ser usado dentro de AmigosRealtimeProvider');
  }
  return context;
}
