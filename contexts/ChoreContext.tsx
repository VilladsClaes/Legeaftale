import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Chore, choreService } from '@/services/choreService';

interface ChoreContextType {
  chores: Chore[];
  loading: boolean;
  reload: () => Promise<void>;
  create: (input: Omit<Chore, 'id' | 'createdAt'>) => Promise<Chore>;
  update: (chore: Chore) => Promise<void>;
  remove: (id: string) => Promise<void>;
  byId: (id: string) => Chore | undefined;
}

export const ChoreContext = createContext<ChoreContextType | undefined>(undefined);

export function ChoreProvider({ children }: { children: ReactNode }) {
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await choreService.list();
    setChores(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const create = useCallback(
    async (input: Omit<Chore, 'id' | 'createdAt'>) => {
      const chore = choreService.create(input);
      await choreService.save(chore);
      await reload();
      return chore;
    },
    [reload],
  );

  const update = useCallback(
    async (chore: Chore) => {
      await choreService.save(chore);
      await reload();
    },
    [reload],
  );

  const remove = useCallback(
    async (id: string) => {
      await choreService.remove(id);
      await reload();
    },
    [reload],
  );

  const byId = useCallback(
    (id: string) => chores.find((c) => c.id === id),
    [chores],
  );

  const value = useMemo(
    () => ({ chores, loading, reload, create, update, remove, byId }),
    [chores, loading, reload, create, update, remove, byId],
  );

  return <ChoreContext.Provider value={value}>{children}</ChoreContext.Provider>;
}
