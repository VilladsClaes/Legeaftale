import { useContext } from 'react';
import { ActivityContext } from '@/contexts/ActivityContext';

export function useActivities() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error('useActivities must be used within ActivityProvider');
  return ctx;
}
