import { Stack } from 'expo-router';
import HeaderBackButton from '@/components/HeaderBackButton';
import { Colors } from '@/constants/theme';

export default function OnboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackVisible: true,
        headerLeft: () => <HeaderBackButton />,
        headerTitle: '',
        headerTransparent: true,
        headerStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="interests" options={{ title: '' }} />
      <Stack.Screen name="notifications" options={{ title: '' }} />
    </Stack>
  );
}
