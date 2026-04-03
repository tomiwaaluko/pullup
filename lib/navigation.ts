export function resolveAuthRedirect(params: {
  session: boolean;
  loading: boolean;
  onboardingComplete: boolean;
  onboardingLoading: boolean;
  segment: string | undefined;
}): string | null {
  const { session, loading, onboardingComplete, onboardingLoading, segment } = params;
  if (loading) return null;

  const inAuthGroup = segment === '(auth)';
  const inOnboardGroup = segment === '(onboard)';

  if (!session && !inAuthGroup) {
    return '/(auth)';
  }

  if (!session) return null;
  if (onboardingLoading) return null;

  if (!onboardingComplete && !inOnboardGroup) {
    return '/(onboard)/welcome';
  }

  if (onboardingComplete && (inAuthGroup || inOnboardGroup)) {
    return '/(tabs)';
  }

  return null;
}
