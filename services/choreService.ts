import { storage } from './storage';

export interface Chore {
  id: string;
  title: string;
  emoji: string;
  color: string;
  description: string;
  createdAt: number;
}

const KEY = 'legeaftale.chores.v1';

const SEED: Chore[] = [
  {
    id: 'chore-ryd-op',
    title: 'Ryd op fra sidste leg',
    emoji: '🧹',
    color: '#4ECDC4',
    description: 'Læg legetøjet tilbage på plads, så gulvet er frit igen.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 'chore-snack',
    title: 'Tag en sund snack',
    emoji: '🍎',
    color: '#6BCB77',
    description: 'Find en frugt eller lav en lille mad, så du har energi til næste leg.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: 'chore-vand',
    title: 'Drik et glas vand',
    emoji: '💧',
    color: '#6DC5FF',
    description: 'Hent et stort glas vand og drik det hele.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'chore-vask',
    title: 'Vask hænder med sæbe',
    emoji: '🧼',
    color: '#9B6DFF',
    description: 'Grundig håndvask i mindst 20 sekunder inden næste aktivitet.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'chore-puder',
    title: 'Læg puder tilbage',
    emoji: '🛋️',
    color: '#FFD93D',
    description: 'Sæt puder, tæpper og møbler tilbage, som de var før.',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
];

export const choreService = {
  async list(): Promise<Chore[]> {
    const all = await storage.get<Chore[]>(KEY, []);
    if (all.length === 0) {
      await storage.set(KEY, SEED);
      return SEED;
    }
    return all;
  },
  async save(chore: Chore): Promise<void> {
    const all = await storage.get<Chore[]>(KEY, []);
    const idx = all.findIndex((c) => c.id === chore.id);
    if (idx >= 0) all[idx] = chore;
    else all.unshift(chore);
    await storage.set(KEY, all);
  },
  async remove(id: string): Promise<void> {
    const all = await storage.get<Chore[]>(KEY, []);
    await storage.set(
      KEY,
      all.filter((c) => c.id !== id),
    );
  },
  create(input: Omit<Chore, 'id' | 'createdAt'>): Chore {
    return {
      ...input,
      id: `chore-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      createdAt: Date.now(),
    };
  },
};
