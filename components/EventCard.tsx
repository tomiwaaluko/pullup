import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Event } from '@/lib/types';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

interface EventCardProps {
  event: Event;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/events/${event.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{event.type}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {event.title}
      </Text>

      <View style={styles.details}>
        <Text style={styles.detailText}>
          {formatDate(event.start_time)} at {formatTime(event.start_time)}
        </Text>
        <Text style={styles.detailText} numberOfLines={1}>
          {event.location}
        </Text>
      </View>

      {event.organization && (
        <Text style={styles.orgName}>{event.organization.name}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  typeTag: {
    backgroundColor: Colors.primaryLight + '20',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  typeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  details: {
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
  },
  orgName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    marginTop: Spacing.sm,
  },
});
