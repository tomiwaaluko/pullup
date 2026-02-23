import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useEvents } from '@/hooks/useEvents';
import { EventType } from '@/lib/types';
import EventCard from '@/components/EventCard';
import EventFilters from '@/components/EventFilters';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<EventType | undefined>();
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'all'>('all');

  const { data, isLoading, isError, isRefetching, refetch, fetchNextPage, hasNextPage } = useEvents({
    search: search || undefined,
    type: typeFilter,
    timeRange: timeFilter,
  });

  const events = data?.pages.flatMap((page) => page.data) ?? [];
  const featuredEvents = events.slice(0, 3);
  const regularEvents = events.slice(3);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.greeting}>Hey there! 👋</Text>
      <Text style={styles.headerSubtitle}>Ready for some fun?</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search events..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <EventFilters
        selectedType={typeFilter}
        selectedTime={timeFilter}
        onTypeChange={setTypeFilter}
        onTimeChange={setTimeFilter}
      />

      {featuredEvents.length > 0 && !search && typeFilter === undefined && timeFilter === 'all' && (
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>🔥 Hot Events</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
            {featuredEvents.map(event => (
              <View key={event.id} style={styles.featuredCardWrapper}>
                <EventCard event={event} />
              </View>
            ))}
          </ScrollView>
          <Text style={styles.sectionTitle}>More Events</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Something went wrong</Text>
          <Text style={styles.emptySubtext}>Pull down to try again.</Text>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No events found</Text>
          <Text style={styles.emptySubtext}>Check back later for new events!</Text>
        </View>
      ) : (
        <FlatList
          data={search || typeFilter !== undefined || timeFilter !== 'all' ? events : regularEvents}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => <EventCard event={item} />}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
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
  list: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
    fontWeight: Typography.fontWeight.medium,
  },
  searchContainer: {
    marginBottom: Spacing.lg,
  },
  searchBar: {
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  featuredSection: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  featuredScroll: {
    gap: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  featuredCardWrapper: {
    width: 280,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.md,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
});
