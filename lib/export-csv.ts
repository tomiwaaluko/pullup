import { Share, Platform } from 'react-native';
import * as Linking from 'expo-linking';

interface RSVPRow {
  profile?: {
    name: string | null;
    email: string;
  };
  created_at: string;
}

export function generateCSV(rsvps: RSVPRow[], eventTitle: string): string {
  const header = 'Name,Email,RSVP Date';
  const rows = rsvps.map((r) => {
    const name = r.profile?.name ?? '';
    const email = r.profile?.email ?? '';
    const date = new Date(r.created_at).toLocaleDateString();
    return `"${name}","${email}","${date}"`;
  });

  return [header, ...rows].join('\n');
}

export async function shareCSV(rsvps: RSVPRow[], eventTitle: string): Promise<void> {
  const csv = generateCSV(rsvps, eventTitle);
  await Share.share({
    message: csv,
    title: `RSVPs - ${eventTitle}`,
  });
}
