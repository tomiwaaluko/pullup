import { generateICS, getGoogleCalendarUrl, getOutlookCalendarUrl } from '@/lib/calendar';

const mockEvent = {
  title: 'CS Club Meeting',
  description: 'Weekly club meeting',
  location: 'Student Union, Room 201',
  startTime: '2025-03-15T18:00:00.000Z',
  endTime: '2025-03-15T19:00:00.000Z',
};

describe('generateICS', () => {
  it('generates valid ICS format', () => {
    const ics = generateICS(mockEvent);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('SUMMARY:CS Club Meeting');
    expect(ics).toContain('DESCRIPTION:Weekly club meeting');
    expect(ics).toContain('LOCATION:Student Union\\, Room 201');
  });

  it('contains DTSTART, DTEND, UID, and DTSTAMP', () => {
    const ics = generateICS(mockEvent);
    expect(ics).toMatch(/DTSTART:\d{8}T\d{6}Z/);
    expect(ics).toMatch(/DTEND:\d{8}T\d{6}Z/);
    expect(ics).toMatch(/UID:.+@pullup/);
    expect(ics).toMatch(/DTSTAMP:\d{8}T\d{6}Z/);
  });
});

describe('getGoogleCalendarUrl', () => {
  it('returns a Google Calendar URL', () => {
    const url = getGoogleCalendarUrl(mockEvent);
    expect(url).toContain('calendar.google.com/calendar/render');
    expect(url).toContain('action=TEMPLATE');
    expect(url).toContain('text=CS+Club+Meeting');
  });

  it('includes dates parameter', () => {
    const url = getGoogleCalendarUrl(mockEvent);
    expect(url).toContain('dates=');
  });
});

describe('getOutlookCalendarUrl', () => {
  it('returns an Outlook Calendar URL', () => {
    const url = getOutlookCalendarUrl(mockEvent);
    expect(url).toContain('outlook.live.com/calendar');
    expect(url).toContain('subject=CS+Club+Meeting');
  });
});
