import { Stack } from 'expo-router';
import HeaderBackButton from '@/components/HeaderBackButton';
import { Colors } from '@/constants/theme';

export default function OrgRegistrationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: 'Register Organization',
        headerStyle: { backgroundColor: Colors.background },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="register"
        options={{
          headerLeft: () => <HeaderBackButton />,
        }}
      />
      <Stack.Screen
        name="success"
        options={{ title: '', headerBackVisible: false, headerLeft: () => null }}
      />
    </Stack>
  );
}
