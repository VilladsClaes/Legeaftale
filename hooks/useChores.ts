import { useContext } from 'react';
import { ChoreContext } from '@/contexts/ChoreContext';

export function useChores() {
  const ctx = useContext(ChoreContext);
  if (!ctx) throw new Error('useChores must be used within ChoreProvider');
  return ctx;
}
