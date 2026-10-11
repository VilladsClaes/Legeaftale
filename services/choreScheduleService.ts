import { storage } from './storage';

export interface ChoreScheduleItem {
  id: string;
  dayKey: string;
  choreId: string;
  completed: boolean;
  completedAt?: number;
  addedAt: number;
}

const KEY = 'legeaftale.choreSchedule.v1';

export const choreScheduleService = {
  async all(): Promise<ChoreScheduleItem[]> {
    return storage.get<ChoreScheduleItem[]>(KEY, []);
  },
  async add(dayKey: string, choreId: string): Promise<ChoreScheduleItem[]> {
    const all = await choreScheduleService.all();
    const item: ChoreScheduleItem = {
      id: `csh-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      dayKey,
      choreId,
      completed: false,
      addedAt: Date.now(),
    };
    const next = [...all, item];
    await storage.set(KEY, next);
    return next;
  },
  async toggle(id: string): Promise<ChoreScheduleItem[]> {
    const all = await choreScheduleService.all();
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
  async remove(id: string): Promise<ChoreScheduleItem[]> {
    const all = await choreScheduleService.all();
    const updated = all.filter((s) => s.id !== id);
    await storage.set(KEY, updated);
    return updated;
  },
};
