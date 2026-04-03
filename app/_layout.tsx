import { useEffect } from 'react';
import { Href, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from '@sentry/react-native';
import HeaderBackButton from '@/components/HeaderBackButton';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { Colors } from '@/constants/theme';
import { resolveAuthRedirect } from '@/lib/navigation';

const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN;
if (!sentryDsn) {
  console.warn('Sentry DSN not configured — error reporting disabled');
}
Sentry.init({
  dsn: sentryDsn,
  enabled: !__DEV__ && !!sentryDsn,
  tracesSampleRate: 0.2,
});

function RootLayoutNav() {
  const { session, loading, onboardingComplete, onboardingLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const nextPath = resolveAuthRedirect({
      session: !!session,
      loading,
      onboardingComplete,
      onboardingLoading,
      segment: segments[0],
    });

    if (nextPath) {
      router.replace(nextPath as Href);
    }
  }, [session, loading, onboardingComplete, onboardingLoading, segments]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboard)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(org)" />
        <Stack.Screen name="org" />
        <Stack.Screen
          name="events/[id]"
          options={{
            headerShown: true,
            title: '',
            headerTransparent: true,
            headerLeft: () => <HeaderBackButton />,
            headerStyle: { backgroundColor: 'transparent' },
          }}
        />
      </Stack>
    </>
  );
}

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default Sentry.wrap(RootLayout);
