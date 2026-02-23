import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRSVPs } from '@/hooks/useRSVP';
import EventCard from '@/components/EventCard';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

export default function MyRSVPs() {
  const { data: rsvps, isLoading, isRefetching, refetch } = useRSVPs();
  const [showPast, setShowPast] = useState(false);

  const now = new Date();
  const upcoming =
    rsvps?.filter((r: any) => new Date(r.event.end_time) >= now).map((r: any) => r.event) ?? [];
  const past =
    rsvps?.filter((r: any) => new Date(r.event.end_time) < now).map((r: any) => r.event) ?? [];

  const events = showPast ? past : upcoming;

  return (
    <View style={styles.container}>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, !showPast && styles.toggleActive]}
          onPress={() => setShowPast(false)}
        >
          <Text style={[styles.toggleText, !showPast && styles.toggleTextActive]}>
            Upcoming ({upcoming.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, showPast && styles.toggleActive]}
          onPress={() => setShowPast(true)}
        >
          <Text style={[styles.toggleText, showPast && styles.toggleTextActive]}>
            Past ({past.length})
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : events.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            {showPast ? 'No past RSVPs' : "You haven't RSVP'd to any upcoming events"}
          </Text>
          <Text style={styles.emptySubtext}>
            {showPast ? '' : 'Browse the home feed to find events!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EventCard event={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.primary}
            />
          }
        />
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
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  toggleActive: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textMuted,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  list: {
    paddingBottom: Spacing.xxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
