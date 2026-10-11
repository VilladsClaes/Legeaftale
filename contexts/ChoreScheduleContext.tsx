import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ChoreScheduleItem,
  choreScheduleService,
} from '@/services/choreScheduleService';

interface ChoreScheduleContextType {
  items: ChoreScheduleItem[];
  loading: boolean;
  reload: () => Promise<void>;
  forDay: (dayKey: string) => ChoreScheduleItem[];
  add: (dayKey: string, choreId: string) => Promise<void>;
  toggle: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const ChoreScheduleContext = createContext<
  ChoreScheduleContextType | undefined
>(undefined);

export function ChoreScheduleProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ChoreScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await choreScheduleService.all();
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

  const add = useCallback(async (dayKey: string, choreId: string) => {
    const next = await choreScheduleService.add(dayKey, choreId);
    setItems(next);
  }, []);

  const toggle = useCallback(async (id: string) => {
    const updated = await choreScheduleService.toggle(id);
    setItems(updated);
  }, []);

  const remove = useCallback(async (id: string) => {
    const updated = await choreScheduleService.remove(id);
    setItems(updated);
  }, []);

  const value = useMemo(
    () => ({ items, loading, reload, forDay, add, toggle, remove }),
    [items, loading, reload, forDay, add, toggle, remove],
  );

  return (
    <ChoreScheduleContext.Provider value={value}>
      {children}
    </ChoreScheduleContext.Provider>
  );
}
