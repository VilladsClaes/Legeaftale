import { Linking } from 'react-native';

function toGoogleCalendarDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = d.getUTCFullYear();
  const m = pad(d.getUTCMonth() + 1);
  const day = pad(d.getUTCDate());
  const hh = pad(d.getUTCHours());
  const mm = pad(d.getUTCMinutes());
  const ss = pad(d.getUTCSeconds());
  return `${y}${m}${day}T${hh}${mm}${ss}Z`;
}

export const calendarService = {
  /**
   * Opens the device's calendar app via a Google Calendar event-create URL.
   * On Android this launches the Google Calendar app (or browser);
   * on iOS/web it opens the browser so the event can be saved to any calendar.
   */
  async addEvent(opts: {
    title: string;
    notes?: string;
    url?: string;
    date: Date;
    durationMinutes?: number;
  }): Promise<boolean> {
    try {
      const start = new Date(opts.date);
      const end = new Date(start.getTime() + (opts.durationMinutes ?? 60) * 60 * 1000);
      const title = encodeURIComponent(opts.title);
      const details = encodeURIComponent(
        [opts.notes, opts.url].filter(Boolean).join('\n\n'),
      );
      const dates = `${toGoogleCalendarDate(start)}/${toGoogleCalendarDate(end)}`;
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}`;
      await Linking.openURL(gcalUrl);
      return true;
    } catch {
      return false;
    }
  },
};
