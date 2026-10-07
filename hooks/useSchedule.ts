import { useContext } from 'react';
import { ScheduleContext } from '@/contexts/ScheduleContext';

export function useSchedule() {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error('useSchedule must be used within ScheduleProvider');
  return ctx;
}
