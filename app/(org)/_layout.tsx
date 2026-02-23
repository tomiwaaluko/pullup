import { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { OrgProvider, useCurrentOrg } from '@/lib/org-context';
import { useMyOrganizations } from '@/hooks/useOrganizations';
import { Colors } from '@/constants/theme';

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
        headerShown: true,
        headerTitle: currentOrg?.name ?? 'Organization',
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
