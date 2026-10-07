import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Activity, activityService } from '@/services/activityService';

interface ActivityContextType {
  activities: Activity[];
  loading: boolean;
  reload: () => Promise<void>;
  create: (input: Omit<Activity, 'id' | 'createdAt'>) => Promise<Activity>;
  update: (activity: Activity) => Promise<void>;
  remove: (id: string) => Promise<void>;
  byId: (id: string) => Activity | undefined;
}

export const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await activityService.list();
    setActivities(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const create = useCallback(
    async (input: Omit<Activity, 'id' | 'createdAt'>) => {
      const activity = activityService.create(input);
      await activityService.save(activity);
      await reload();
      return activity;
    },
    [reload],
  );

  const update = useCallback(
    async (activity: Activity) => {
      await activityService.save(activity);
      await reload();
    },
    [reload],
  );

  const remove = useCallback(
    async (id: string) => {
      await activityService.remove(id);
      await reload();
    },
    [reload],
  );

  const byId = useCallback(
    (id: string) => activities.find((a) => a.id === id),
    [activities],
  );

  const value = useMemo(
    () => ({ activities, loading, reload, create, update, remove, byId }),
    [activities, loading, reload, create, update, remove, byId],
  );

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}
