import { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { OrgProvider, useCurrentOrg } from '@/lib/org-context';
import { useMyOrganizations } from '@/hooks/useOrganizations';
import { Colors, Shadows, Radius, Typography, Spacing } from '@/constants/theme';

function OrgTabsContent() {
  const { currentOrg, setCurrentOrg } = useCurrentOrg();
  const { data: orgs } = useMyOrganizations();
  const router = useRouter();

  useEffect(() => {
    if (orgs && orgs.length > 0 && !currentOrg) {
      setCurrentOrg(orgs[0]);
    } else if (orgs && orgs.length === 0) {
      router.replace('/org/register');
    }
  }, [orgs, currentOrg]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.borderLight,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: Spacing.sm,
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
        options={{ title: 'Overview', tabBarLabel: 'Overview' }}
      />
      <Tabs.Screen
        name="events"
        options={{ title: 'Events', tabBarLabel: 'Events' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Org Profile', tabBarLabel: 'Profile' }}
      />
    </Tabs>
  );
}

export default function OrgLayout() {
  return (
    <OrgProvider>
      <OrgTabsContent />
    </OrgProvider>
  );
}
