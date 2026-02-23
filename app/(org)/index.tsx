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
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

export default function OrgOverview() {
  const router = useRouter();
  const { currentOrg, setCurrentOrg } = useCurrentOrg();
  const { data: orgs } = useMyOrganizations();
  const { data: events, isLoading } = useOrgEvents(currentOrg?.id ?? '');

  const upcomingEvents = events?.filter((e) => new Date(e.start_time) >= new Date()) ?? [];
  const totalRSVPs = 0; // Would need aggregate query

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

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{upcomingEvents.length}</Text>
          <Text style={styles.summaryLabel}>Upcoming Events</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{events?.length ?? 0}</Text>
          <Text style={styles.summaryLabel}>Total Events</Text>
        </View>
      </View>

      {/* Create Event CTA */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/(org)/events/new')}
      >
        <Text style={styles.createButtonText}>Create Event</Text>
      </TouchableOpacity>

      {/* Recent Events */}
      <Text style={styles.sectionTitle}>Recent Events</Text>
      {isLoading ? (
        <ActivityIndicator color={Colors.primary} />
      ) : events && events.length > 0 ? (
        events.slice(0, 5).map((event) => <EventCard key={event.id} event={event} />)
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
    paddingBottom: Spacing.xxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switcher: {
    flexGrow: 0,
    marginBottom: Spacing.lg,
  },
  switcherChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
  },
  switcherChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  switcherText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  switcherTextActive: {
    color: Colors.white,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  createButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
});
