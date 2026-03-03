import { Stack } from 'expo-router';
import HeaderBackButton from '@/components/HeaderBackButton';

export default function OrgRegistrationLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, title: 'Register Organization' }}>
      <Stack.Screen
        name="register"
        options={{
          headerLeft: () => <HeaderBackButton label="Cancel" />,
        }}
      />
      <Stack.Screen name="success" options={{ title: 'Success', headerBackVisible: false }} />
    </Stack>
  );
}
