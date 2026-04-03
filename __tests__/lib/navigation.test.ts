import { resolveAuthRedirect } from '@/lib/navigation';

describe('resolveAuthRedirect', () => {
  it('routes signed-out users to auth from protected routes', () => {
    expect(
      resolveAuthRedirect({
        session: false,
        loading: false,
        onboardingComplete: false,
        onboardingLoading: false,
        segment: '(tabs)',
      }),
    ).toBe('/(auth)');
  });

  it('routes signed-in users without onboarding to onboarding flow', () => {
    expect(
      resolveAuthRedirect({
        session: true,
        loading: false,
        onboardingComplete: false,
        onboardingLoading: false,
        segment: '(tabs)',
      }),
    ).toBe('/(onboard)/welcome');
  });

  it('routes onboarded users away from auth and onboard groups', () => {
    expect(
      resolveAuthRedirect({
        session: true,
        loading: false,
        onboardingComplete: true,
        onboardingLoading: false,
        segment: '(auth)',
      }),
    ).toBe('/(tabs)');
  });

  it('returns null when no redirect is needed', () => {
    expect(
      resolveAuthRedirect({
        session: true,
        loading: false,
        onboardingComplete: true,
        onboardingLoading: false,
        segment: '(tabs)',
      }),
    ).toBeNull();
  });
});
