const dayNames = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
const monthNames = [
  'januar',
  'februar',
  'marts',
  'april',
  'maj',
  'juni',
  'juli',
  'august',
  'september',
  'oktober',
  'november',
  'december',
];

export function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromDayKey(key: string): Date {
  const parts = key.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return new Date();
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDayKey(a) === toDayKey(b);
}

export function isToday(d: Date): boolean {
  return isSameDay(d, new Date());
}

export function formatLongDate(d: Date): string {
  return `${dayNames[d.getDay()]} ${d.getDate()}. ${monthNames[d.getMonth()]}`;
}

export function formatShortDay(d: Date): string {
  return dayNames[d.getDay()].slice(0, 3);
}

export function dayLabel(d: Date): string {
  const today = new Date();
  if (isSameDay(d, today)) return 'I dag';
  if (isSameDay(d, addDays(today, 1))) return 'I morgen';
  if (isSameDay(d, addDays(today, -1))) return 'I går';
  return formatLongDate(d);
}
