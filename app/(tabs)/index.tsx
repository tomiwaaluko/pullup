import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useEvents } from '@/hooks/useEvents';
import { EventType } from '@/lib/types';
import EventCard from '@/components/EventCard';
import EventFilters from '@/components/EventFilters';
import { Colors, Typography, Spacing } from '@/constants/theme';

export default function Home() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<EventType | undefined>();
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'all'>('all');

  const { data, isLoading, isRefetching, refetch, fetchNextPage, hasNextPage } = useEvents({
    search: search || undefined,
    type: typeFilter,
    timeRange: timeFilter,
  });

  const events = data?.pages.flatMap((page) => page.data) ?? [];

  const handleLoadMore = useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search events..."
        placeholderTextColor={Colors.textMuted}
        value={search}
        onChangeText={setSearch}
      />

      <EventFilters
        selectedType={typeFilter}
        selectedTime={timeFilter}
        onTypeChange={setTypeFilter}
        onTimeChange={setTimeFilter}
      />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : events.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No events found</Text>
          <Text style={styles.emptySubtext}>Check back later for new events!</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EventCard event={item} />}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
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
  searchBar: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
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
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
});
