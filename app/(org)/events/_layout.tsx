import { Stack } from 'expo-router';
import HeaderBackButton from '@/components/HeaderBackButton';
import { Colors } from '@/constants/theme';

export default function OrgEventsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackVisible: true,
        headerLeft: () => <HeaderBackButton />,
        headerStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Events',
          headerShown: true,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: 'Create Event',
        }}
      />
    </Stack>
  );
}
