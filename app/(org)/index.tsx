import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentOrg } from '@/lib/org-context';
import { useOrgEvents } from '@/hooks/useOrganizations';
import { useMyOrganizations } from '@/hooks/useOrganizations';
import EventCard from '@/components/EventCard';
import Button from '@/components/Button';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';

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
      {/* Org Switcher */}
      {orgs && orgs.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.switcher}>
          {orgs.map((org) => (
            <TouchableOpacity
              key={org.id}
              style={[
                styles.switcherChip,
                currentOrg.id === org.id && styles.switcherChipActive,
              ]}
              onPress={() => setCurrentOrg(org)}
            >
              <Text
                style={[
                  styles.switcherText,
                  currentOrg.id === org.id && styles.switcherTextActive,
                ]}
              >
                {org.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Text style={styles.welcomeText}>Dashboard</Text>
      <Text style={styles.orgNameHeadline}>{currentOrg.name}</Text>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: Colors.primary }]}>
          <Text style={styles.summaryNumber}>{upcomingEvents.length}</Text>
          <Text style={styles.summaryLabel}>Upcoming Events</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: Colors.secondary }]}>
          <Text style={styles.summaryNumber}>{events?.length ?? 0}</Text>
          <Text style={styles.summaryLabel}>Total Events</Text>
        </View>
      </View>

      {/* Create Event CTA */}
      <Button
        title="+ Create New Event"
        onPress={() => router.push('/(org)/events/new')}
        style={styles.createButton}
      />

      {/* Recent Events */}
      <Text style={styles.sectionTitle}>Recent Events</Text>
      {isLoading ? (
        <ActivityIndicator color={Colors.primary} />
      ) : events && events.length > 0 ? (
        [...events].sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()).slice(0, 5).map((event) => <EventCard key={event.id} event={event} />)
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No events yet</Text>
          <Text style={styles.emptySubtext}>Create your first event to get started!</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switcher: {
    flexGrow: 0,
    marginBottom: Spacing.xl,
  },
  switcherChip: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    backgroundColor: Colors.white,
  },
  switcherChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Shadows.sm,
  },
  switcherText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.bold,
  },
  switcherTextActive: {
    color: Colors.white,
  },
  welcomeText: {
    fontSize: Typography.fontSize.md,
    color: Colors.textMuted,
    fontWeight: Typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  orgNameHeadline: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  summaryCard: {
    flex: 1,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.floating,
  },
  summaryNumber: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.white,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.xs,
    opacity: 0.9,
  },
  createButton: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.md,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
});
