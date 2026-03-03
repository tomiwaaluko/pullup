import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentOrg } from '@/lib/org-context';
import { useOrgEvents, useCreateEvent, useDeleteEvent } from '@/hooks/useOrganizations';
import { Event } from '@/lib/types';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function OrgEventCard({ event }: { event: Event }) {
  const router = useRouter();
  const deleteEvent = useDeleteEvent();
  const createEvent = useCreateEvent();

  const handleDelete = () => {
    Alert.alert('Delete Event', `Are you sure you want to delete "${event.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          deleteEvent.mutate(
            { id: event.id, orgId: event.org_id },
            { onError: () => Alert.alert('Error', 'Failed to delete event.') },
          ),
      },
    ]);
  };

  const handleDuplicate = async () => {
    try {
      await createEvent.mutateAsync({
        title: `${event.title} (Copy)`,
        description: event.description ?? '',
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location,
        type: event.type,
        org_id: event.org_id,
        status: 'draft',
        capacity: event.capacity ?? undefined,
      });
      Alert.alert('Success', 'Event duplicated as draft.');
    } catch (err: unknown) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to duplicate event.');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.statusBadge,
            event.status === 'published' ? styles.publishedBadge : styles.draftBadge,
          ]}
        >
          <Text style={styles.statusText}>{event.status}</Text>
        </View>
        <Text style={styles.cardType}>{event.type}</Text>
      </View>

      <Text style={styles.cardTitle}>{event.title}</Text>
      <Text style={styles.cardDate}>{formatDate(event.start_time)}</Text>
      <Text style={styles.cardLocation} numberOfLines={1}>{event.location}</Text>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/events/${event.id}`)}
        >
          <Text style={styles.actionText}>Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleDuplicate}>
          <Text style={styles.actionText}>Duplicate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function OrgEvents() {
  const router = useRouter();
  const { currentOrg } = useCurrentOrg();
  const { data: events, isLoading } = useOrgEvents(currentOrg?.id ?? '');

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/(org)/events/new')}
      >
        <Text style={styles.createButtonText}>+ Create Event</Text>
      </TouchableOpacity>

      {events && events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OrgEventCard event={item} />}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No events yet</Text>
          <Text style={styles.emptySubtext}>Create your first event to get started!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  list: {
    paddingBottom: Spacing.xxl,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statusBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 2,
  },
  publishedBadge: {
    backgroundColor: `${Colors.success}20`,
  },
  draftBadge: {
    backgroundColor: `${Colors.warning}20`,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    textTransform: 'capitalize',
  },
  cardType: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    textTransform: 'capitalize',
  },
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  cardDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
  },
  cardLocation: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  actionButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  actionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  deleteText: {
    color: Colors.error,
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
