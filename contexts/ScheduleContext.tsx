import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ScheduleItem, scheduleService } from '@/services/scheduleService';

interface ScheduleContextType {
  items: ScheduleItem[];
  loading: boolean;
  reload: () => Promise<void>;
  forDay: (dayKey: string) => ScheduleItem[];
  add: (dayKey: string, activityId: string) => Promise<void>;
  toggle: (id: string) => Promise<void>;
  postpone: (id: string, nextDayKey: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await scheduleService.all();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const forDay = useCallback(
    (dayKey: string) =>
      items
        .filter((i) => i.dayKey === dayKey)
        .sort((a, b) => a.addedAt - b.addedAt),
    [items],
  );

  const add = useCallback(
    async (dayKey: string, activityId: string) => {
      const next = await scheduleService.add(dayKey, activityId);
      setItems(next);
    },
    [],
  );

  const toggle = useCallback(async (id: string) => {
    const updated = await scheduleService.toggle(id);
    setItems(updated);
  }, []);

  const postpone = useCallback(async (id: string, next: string) => {
    const updated = await scheduleService.postpone(id, next);
    setItems(updated);
  }, []);

  const remove = useCallback(async (id: string) => {
    const updated = await scheduleService.remove(id);
    setItems(updated);
  }, []);

  const value = useMemo(
    () => ({ items, loading, reload, forDay, add, toggle, postpone, remove }),
    [items, loading, reload, forDay, add, toggle, postpone, remove],
  );

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
}
