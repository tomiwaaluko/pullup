import { useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Button from '@/components/Button';
import { useEventRSVPs } from '@/hooks/useOrganizations';
import { useEvent } from '@/hooks/useEvents';
import { RSVPRow, shareCSV } from '@/lib/export-csv';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString();
}

export default function EventAttendees() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: event, isLoading: isEventLoading } = useEvent(id);
  const { data: rsvps, isLoading: isRSVPLoading } = useEventRSVPs(id);

  const rows = useMemo(() => (rsvps ?? []) as RSVPRow[], [rsvps]);

  const handleExport = async () => {
    try {
      await shareCSV(rows, event?.title ?? 'Event');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to export attendee list.';
      Alert.alert('Export Error', message);
    }
  };

  if (isEventLoading || isRSVPLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topCard}>
        <Text style={styles.eventTitle}>{event?.title ?? 'Event'}</Text>
        <Text style={styles.count}>{rows.length} attendee{rows.length === 1 ? '' : 's'}</Text>
        <Button
          title="Export CSV"
          onPress={handleExport}
          disabled={rows.length === 0}
          variant={rows.length > 0 ? 'primary' : 'secondary'}
        />
      </View>

      {rows.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>No RSVPs yet</Text>
          <Text style={styles.emptySubtitle}>Attendees will show up here once students RSVP.</Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item, index) => `${item.created_at}-${index}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.name}>{item.profile?.name ?? 'Unknown attendee'}</Text>
              <Text style={styles.email}>{item.profile?.email ?? 'No email available'}</Text>
              <Text style={styles.date}>RSVP: {formatDate(item.created_at)}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  topCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  eventTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  count: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  list: {
    paddingBottom: Spacing.xxxl,
  },
  row: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  email: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  date: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});
