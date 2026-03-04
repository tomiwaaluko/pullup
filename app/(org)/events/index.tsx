import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentOrg } from '@/lib/org-context';
import { useOrgEvents, useCreateEvent, useDeleteEvent } from '@/hooks/useOrganizations';
import { Event } from '@/lib/types';
import Button from '@/components/Button';
import { Colors, Typography, Spacing, Radius, Shadows, EventTypeColors } from '@/constants/theme';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
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
        text: 'Delete', style: 'destructive',
        onPress: () => deleteEvent.mutate(
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

  const typeColor = EventTypeColors[event.type] || EventTypeColors.other;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[
          styles.statusBadge,
          event.status === 'published'
            ? { backgroundColor: Colors.successMuted }
            : { backgroundColor: Colors.accentMuted },
        ]}>
          <View style={[
            styles.statusDot,
            { backgroundColor: event.status === 'published' ? Colors.success : Colors.accent },
          ]} />
          <Text style={[
            styles.statusText,
            { color: event.status === 'published' ? Colors.success : Colors.accent },
          ]}>
            {event.status}
          </Text>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: typeColor.bg }]}>
          <Text style={[styles.typeText, { color: typeColor.text }]}>{event.type}</Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>{event.title}</Text>
      <Text style={styles.cardDate}>{formatDate(event.start_time)}</Text>
      <Text style={styles.cardLocation} numberOfLines={1}>{event.location}</Text>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`/events/${event.id}`)} activeOpacity={0.7}>
          <Text style={styles.actionText}>Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleDuplicate} activeOpacity={0.7}>
          <Text style={styles.actionText}>Duplicate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleDelete} activeOpacity={0.7}>
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
      <View style={styles.topBar}>
        <Button
          title="+ Create Event"
          onPress={() => router.push('/(org)/events/new')}
          size="md"
        />
      </View>

      {events && events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OrgEventCard event={item} />}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>📋</Text>
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
  },
  topBar: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? Spacing.lg : Spacing.md,
    paddingBottom: Spacing.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    textTransform: 'capitalize',
  },
  typeBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  typeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    textTransform: 'capitalize',
  },
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    letterSpacing: -0.2,
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
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.md,
  },
  actionButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  actionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  deleteText: {
    color: Colors.error,
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
