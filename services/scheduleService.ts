import { storage } from './storage';

export interface ScheduleItem {
  id: string;
  dayKey: string;
  activityId: string;
  completed: boolean;
  completedAt?: number;
  addedAt: number;
}

const KEY = 'legeaftale.schedule.v1';

export const scheduleService = {
  async all(): Promise<ScheduleItem[]> {
    return storage.get<ScheduleItem[]>(KEY, []);
  },
  async add(dayKey: string, activityId: string): Promise<ScheduleItem[]> {
    const all = await scheduleService.all();
    const item: ScheduleItem = {
      id: `sch-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      dayKey,
      activityId,
      completed: false,
      addedAt: Date.now(),
    };
    const next = [...all, item];
    await storage.set(KEY, next);
    return next;
  },
  async toggle(id: string): Promise<ScheduleItem[]> {
    const all = await scheduleService.all();
    const updated = all.map((s) =>
      s.id === id
        ? {
            ...s,
            completed: !s.completed,
            completedAt: !s.completed ? Date.now() : undefined,
          }
        : s,
    );
    await storage.set(KEY, updated);
    return updated;
  },
  async postpone(id: string, nextDayKey: string): Promise<ScheduleItem[]> {
    const all = await scheduleService.all();
    const updated = all.map((s) =>
      s.id === id
        ? {
            ...s,
            dayKey: nextDayKey,
            completed: false,
            completedAt: undefined,
          }
        : s,
    );
    await storage.set(KEY, updated);
    return updated;
  },
  async remove(id: string): Promise<ScheduleItem[]> {
    const all = await scheduleService.all();
    const updated = all.filter((s) => s.id !== id);
    await storage.set(KEY, updated);
    return updated;
  },
};
