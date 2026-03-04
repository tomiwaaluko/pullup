import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRSVPs } from '@/hooks/useRSVP';
import EventCard from '@/components/EventCard';
import EmptyState from '@/components/EmptyState';
import { Colors, Gradients, Typography, Spacing, Radius, Shadows } from '@/constants/theme';

export default function MyRSVPs() {
  const { data: rsvps, isLoading, isRefetching, refetch } = useRSVPs();
  const [showPast, setShowPast] = useState(false);

  const now = new Date();
  const upcoming =
    rsvps?.filter((r: any) => new Date(r.event.end_time) >= now).map((r: any) => r.event) ?? [];
  const past =
    rsvps?.filter((r: any) => new Date(r.event.end_time) < now).map((r: any) => r.event) ?? [];

  const events = showPast ? past : upcoming;

  const renderHeader = () => (
    <View>
      <LinearGradient
        colors={[Colors.ink, Colors.charcoal, Colors.background]}
        style={styles.headerGradient}
      >
        <Text style={styles.pageTitle}>My RSVPs</Text>
        <Text style={styles.pageSubtitle}>Events you're attending</Text>
      </LinearGradient>

      <View style={styles.toggleWrap}>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleButton, !showPast && styles.toggleActive]}
            onPress={() => setShowPast(false)}
            activeOpacity={0.7}
          >
            {!showPast && (
              <LinearGradient
                colors={[...Gradients.brand]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Text style={[styles.toggleText, !showPast && styles.toggleTextActive]}>
              Upcoming ({upcoming.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, showPast && styles.toggleActive]}
            onPress={() => setShowPast(true)}
            activeOpacity={0.7}
          >
            {showPast && (
              <LinearGradient
                colors={[...Gradients.brand]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Text style={[styles.toggleText, showPast && styles.toggleTextActive]}>
              Past ({past.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : events.length === 0 ? (
        <View style={styles.container}>
          {renderHeader()}
          <EmptyState
            icon={showPast ? '📅' : '🎟️'}
            title={showPast ? 'No past RSVPs' : "No upcoming events"}
            message={showPast ? '' : 'Browse the home feed to find events!'}
          />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <EventCard event={item} />
            </View>
          )}
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
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 64 : 44,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  pageTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.textOnDark,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.textOnDarkMuted,
    marginTop: Spacing.xxs,
  },
  toggleWrap: {
    paddingHorizontal: Spacing.xl,
    marginTop: -Spacing.lg,
    marginBottom: Spacing.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xs,
    ...Shadows.sm,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    overflow: 'hidden',
  },
  toggleActive: {
    ...Shadows.glow,
  },
  toggleText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textMuted,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  list: {
    paddingBottom: 110,
  },
  cardWrap: {
    paddingHorizontal: Spacing.lg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
