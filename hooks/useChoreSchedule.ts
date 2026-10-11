import { useContext } from 'react';
import { ChoreScheduleContext } from '@/contexts/ChoreScheduleContext';

export function useChoreSchedule() {
  const ctx = useContext(ChoreScheduleContext);
  if (!ctx)
    throw new Error('useChoreSchedule must be used within ChoreScheduleProvider');
  return ctx;
}
