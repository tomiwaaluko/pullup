import { track } from '@/lib/analytics';

describe('analytics', () => {
  it('logs events in dev mode', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    track('event_view', { eventId: '123' });
    expect(consoleSpy).toHaveBeenCalledWith('[Analytics] event_view', { eventId: '123' });
    consoleSpy.mockRestore();
  });

  it('logs events without properties', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    track('sign_in');
    expect(consoleSpy).toHaveBeenCalledWith('[Analytics] sign_in', '');
    consoleSpy.mockRestore();
  });
});
