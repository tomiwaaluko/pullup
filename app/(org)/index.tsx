import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCurrentOrg } from '@/lib/org-context';
import { useOrgEvents, useMyOrganizations } from '@/hooks/useOrganizations';
import EventCard from '@/components/EventCard';
import Button from '@/components/Button';
import { Colors, Gradients, Typography, Spacing, Radius, Shadows } from '@/constants/theme';

export default function OrgOverview() {
  const router = useRouter();
  const { currentOrg, setCurrentOrg } = useCurrentOrg();
  const { data: orgs } = useMyOrganizations();
  const { data: events, isLoading } = useOrgEvents(currentOrg?.id ?? '');

  const upcomingEvents = events?.filter((e) => new Date(e.start_time) >= new Date()) ?? [];

  if (!currentOrg) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={[Colors.ink, Colors.charcoal, Colors.background]}
        style={styles.headerGradient}
      >
        {orgs && orgs.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.switcher}>
            {orgs.map((org) => (
              <TouchableOpacity
                key={org.id}
                style={[styles.switcherChip, currentOrg.id === org.id && styles.switcherChipActive]}
                onPress={() => setCurrentOrg(org)}
                activeOpacity={0.7}
              >
                <Text style={[styles.switcherText, currentOrg.id === org.id && styles.switcherTextActive]}>
                  {org.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <Text style={styles.welcomeText}>Dashboard</Text>
        <Text style={styles.orgNameHeadline}>{currentOrg.name}</Text>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.summaryRow}>
          <LinearGradient
            colors={[...Gradients.brand]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryCard}
          >
            <Text style={styles.summaryNumber}>{upcomingEvents.length}</Text>
            <Text style={styles.summaryLabel}>Upcoming</Text>
          </LinearGradient>
          <LinearGradient
            colors={[...Gradients.warmSunset]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryCard}
          >
            <Text style={styles.summaryNumber}>{events?.length ?? 0}</Text>
            <Text style={styles.summaryLabel}>Total Events</Text>
          </LinearGradient>
        </View>

        <Button
          title="+ Create New Event"
          onPress={() => router.push('/(org)/events/new')}
          style={styles.createButton}
        />

        <Text style={styles.sectionTitle}>Recent Events</Text>
        {isLoading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : events && events.length > 0 ? (
          [...events]
            .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
            .slice(0, 5)
            .map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No events yet</Text>
            <Text style={styles.emptySubtext}>Create your first event to get started!</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xxxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 64 : 44,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  switcher: {
    flexGrow: 0,
    marginBottom: Spacing.xl,
  },
  switcherChip: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  switcherChipActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  switcherText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textOnDarkMuted,
    fontWeight: Typography.fontWeight.semibold,
  },
  switcherTextActive: {
    color: Colors.white,
  },
  welcomeText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textOnDarkMuted,
    fontWeight: Typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  orgNameHeadline: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.textOnDark,
    letterSpacing: -0.3,
  },
  body: {
    paddingHorizontal: Spacing.xl,
    marginTop: -Spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  summaryCard: {
    flex: 1,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.glow,
  },
  summaryNumber: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.white,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: Typography.fontWeight.semibold,
    marginTop: Spacing.xs,
  },
  createButton: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
    letterSpacing: -0.2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});
