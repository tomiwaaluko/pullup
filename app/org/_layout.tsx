import { Stack } from 'expo-router';

export default function OrgRegistrationLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, title: 'Register Organization' }}>
      <Stack.Screen name="register" />
      <Stack.Screen name="success" options={{ title: 'Success', headerBackVisible: false }} />
    </Stack>
  );
}
