import { generateCSV } from '@/lib/export-csv';

const mockRSVPs = [
  {
    profile: { name: 'Alice Smith', email: 'alice@university.edu' },
    created_at: '2025-03-10T14:00:00.000Z',
  },
  {
    profile: { name: null, email: 'bob@university.edu' },
    created_at: '2025-03-11T09:30:00.000Z',
  },
];

describe('generateCSV', () => {
  it('includes header row', () => {
    const csv = generateCSV(mockRSVPs);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('Name,Email,RSVP Date');
  });

  it('includes all RSVP rows', () => {
    const csv = generateCSV(mockRSVPs);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(3); // header + 2 rows
  });

  it('handles null names', () => {
    const csv = generateCSV(mockRSVPs);
    expect(csv).toContain(',bob@university.edu,');
  });

  it('includes name and email fields', () => {
    const csv = generateCSV(mockRSVPs);
    expect(csv).toContain('Alice Smith');
    expect(csv).toContain('alice@university.edu');
  });
});
