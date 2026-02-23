import { Linking } from 'react-native';

interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
}

function formatDateForICS(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function formatDateForGoogle(dateStr: string): string {
  return formatDateForICS(dateStr);
}

export function generateICS(event: CalendarEvent): string {
  const start = formatDateForICS(event.startTime);
  const end = formatDateForICS(event.endTime);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PullUp//Events//EN',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const start = formatDateForGoogle(event.startTime);
  const end = formatDateForGoogle(event.endTime);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getOutlookCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description,
    startdt: event.startTime,
    enddt: event.endTime,
    location: event.location,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export async function addToGoogleCalendar(event: CalendarEvent): Promise<void> {
  const url = getGoogleCalendarUrl(event);
  await Linking.openURL(url);
}

export async function addToOutlookCalendar(event: CalendarEvent): Promise<void> {
  const url = getOutlookCalendarUrl(event);
  await Linking.openURL(url);
}
