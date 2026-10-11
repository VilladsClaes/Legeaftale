import { ChoreScheduleItem } from './choreScheduleService';
import { ScheduleItem } from './scheduleService';

export const LOCKED_NEEDS_CHORE = 'Tilføj en opgave først';
export const LOCKED_CHORE_PENDING = 'Lav opgaven først';

export type DayEntry =
  | { kind: 'play'; item: ScheduleItem; lockedLabel?: string }
  | { kind: 'chore'; item: ChoreScheduleItem }
  | { kind: 'chore-slot' };

/**
 * Interleaves a day's plays and chores: play 1, chore 1, play 2, chore 2, ...
 * Play n (n >= 2) stays locked until chore n-1 is completed. A missing chore
 * is shown once as a slot where the next chore should be added.
 * Both lists must already be in the order they were added.
 */
export function buildDayPlan(
  plays: ScheduleItem[],
  chores: ChoreScheduleItem[],
): DayEntry[] {
  const entries: DayEntry[] = [];
  let slotShown = false;

  plays.forEach((play, i) => {
    let lockedLabel: string | undefined;
    if (i > 0 && !play.completed) {
      const gate = chores[i - 1];
      if (!gate) {
        lockedLabel = LOCKED_NEEDS_CHORE;
        if (!slotShown) {
          entries.push({ kind: 'chore-slot' });
          slotShown = true;
        }
      } else if (!gate.completed) {
        lockedLabel = LOCKED_CHORE_PENDING;
      }
    }
    entries.push({ kind: 'play', item: play, lockedLabel });
    if (chores[i]) entries.push({ kind: 'chore', item: chores[i] });
  });

  for (const chore of chores.slice(plays.length)) {
    entries.push({ kind: 'chore', item: chore });
  }
  return entries;
}
