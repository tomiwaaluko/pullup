import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Shadows, Radius, Typography, Spacing } from '@/constants/theme';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: focused ? '🏠' : '🏡',
    RSVPs: focused ? '🎟️' : '🎫',
    Profile: focused ? '👤' : '👤',
  };

  return (
    <View style={styles.tabIconContainer}>
      {focused && (
        <LinearGradient
          colors={[...Gradients.brand]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.activeIndicator}
        />
      )}
      <Text style={[styles.tabEmoji, !focused && styles.tabEmojiInactive]}>
        {icons[name] || '•'}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 28 : 16,
          left: 24,
          right: 24,
          backgroundColor: Colors.ink,
          borderRadius: Radius.xxl,
          height: 68,
          ...Shadows.dark,
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          paddingVertical: Spacing.sm,
        },
        tabBarLabelStyle: {
          fontSize: Typography.fontSize.micro,
          fontWeight: Typography.fontWeight.semibold,
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="rsvps"
        options={{
          title: 'RSVPs',
          tabBarLabel: 'RSVPs',
          tabBarIcon: ({ focused }) => <TabIcon name="RSVPs" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: -6,
    width: 24,
    height: 3,
    borderRadius: 2,
  },
  tabEmoji: {
    fontSize: 22,
  },
  tabEmojiInactive: {
    opacity: 0.5,
  },
});
