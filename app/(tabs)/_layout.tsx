import { Tabs } from 'expo-router';
import { Colors, Shadows, Radius } from '@/constants/theme';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: Colors.white,
          borderRadius: Radius.full,
          height: 64,
          paddingBottom: Platform.OS === 'ios' ? 0 : 0,
          ...Shadows.floating,
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="rsvps"
        options={{
          title: 'RSVPs',
          tabBarLabel: 'RSVPs',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
