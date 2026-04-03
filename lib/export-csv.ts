import { Share } from 'react-native';
import { track } from './analytics';

export interface RSVPRow {
  profile?: {
    name?: string | null;
    email?: string | null;
  };
  created_at: string;
}

function escapeCSVField(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateCSV(rsvps: RSVPRow[]): string {
  const header = 'Name,Email,RSVP Date';
  const rows = rsvps.map((r) => {
    const name = r.profile?.name ?? '';
    const email = r.profile?.email ?? '';
    const date = new Date(r.created_at).toLocaleDateString();
    return `${escapeCSVField(name)},${escapeCSVField(email)},${escapeCSVField(date)}`;
  });

  return [header, ...rows].join('\n');
}

export async function shareCSV(rsvps: RSVPRow[], eventTitle: string): Promise<void> {
  const csv = generateCSV(rsvps);
  await Share.share({
    message: csv,
    title: `RSVPs - ${eventTitle}`,
  });
  track('rsvp_export', { attendee_count: rsvps.length, event_title: eventTitle });
}
