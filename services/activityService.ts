import { storage } from './storage';

export interface Activity {
  id: string;
  title: string;
  emoji: string;
  color: string;
  description: string;
  imageUrl?: string;
  oneNoteUrl?: string;
  videoUrl?: string;
  createdAt: number;
}

const KEY = 'legeaftale.activities.v1';

const SEED: Activity[] = [
  {
    id: 'seed-lego',
    title: 'Leg med LEGO',
    emoji: '🧱',
    color: '#FFD93D',
    description: 'Byg et skib, et hus eller noget helt tredje. Hvor højt kan du bygge?',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 'seed-tumle',
    title: 'Tumleleg i stuen',
    emoji: '🤸',
    color: '#4ECDC4',
    description: 'Puder på gulvet, saltomortaler og brydekamp med mor eller far.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: 'seed-matador',
    title: 'Spil Matador',
    emoji: '🎲',
    color: '#FF7A59',
    description: 'Hiv brætspillet frem og køb hoteller på Rådhuspladsen.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'seed-mc',
    title: 'Spil Minecraft',
    emoji: '⛏️',
    color: '#6BCB77',
    description: 'Byg en ny bane sammen med far. Kreativ mode slået til!',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'seed-tegn',
    title: 'Tegn en superhelt',
    emoji: '🦸',
    color: '#9B6DFF',
    description: 'Find papir og farver frem og opfind din egen superhelt.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
];

export const activityService = {
  async list(): Promise<Activity[]> {
    const all = await storage.get<Activity[]>(KEY, []);
    if (all.length === 0) {
      await storage.set(KEY, SEED);
      return SEED;
    }
    return all;
  },
  async save(activity: Activity): Promise<void> {
    const all = await storage.get<Activity[]>(KEY, []);
    const idx = all.findIndex((a) => a.id === activity.id);
    if (idx >= 0) all[idx] = activity;
    else all.unshift(activity);
    await storage.set(KEY, all);
  },
  async remove(id: string): Promise<void> {
    const all = await storage.get<Activity[]>(KEY, []);
    await storage.set(
      KEY,
      all.filter((a) => a.id !== id),
    );
  },
  create(input: Omit<Activity, 'id' | 'createdAt'>): Activity {
    return {
      ...input,
      id: `act-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      createdAt: Date.now(),
    };
  },
};
