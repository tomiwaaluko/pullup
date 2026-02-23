import { Stack } from 'expo-router';

export default function OnboardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="interests" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
