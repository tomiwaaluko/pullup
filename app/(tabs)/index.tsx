import { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEvents } from '@/hooks/useEvents';
import { EventType } from '@/lib/types';
import EventCard from '@/components/EventCard';
import EventFilters from '@/components/EventFilters';
import { Colors, Gradients, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<EventType | undefined>();
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'all'>('all');

  const firstName = user?.user_metadata?.first_name as string | undefined;
  const greetingText = firstName ? `Hey, ${firstName}! 👋` : 'Hey there 👋';

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
      <LinearGradient
        colors={[Colors.ink, Colors.charcoal, Colors.background]}
        style={styles.headerGradient}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greetingText}</Text>
            <Text style={styles.headerSubtitle}>Discover what's happening</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search events..."
              placeholderTextColor={Colors.textOnDarkMuted}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Text style={styles.clearButton}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      <View style={styles.filtersWrap}>
        <EventFilters
          selectedType={typeFilter}
          selectedTime={timeFilter}
          onTypeChange={setTypeFilter}
          onTimeChange={setTimeFilter}
        />
      </View>

      {featuredEvents.length > 0 && !search && typeFilter === undefined && timeFilter === 'all' && (
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <View style={styles.liveDot} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
            {featuredEvents.map(event => (
              <View key={event.id} style={styles.featuredCardWrapper}>
                <EventCard event={event} variant="featured" />
              </View>
            ))}
          </ScrollView>
          <Text style={styles.sectionTitle}>All Events</Text>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    if (isError) {
      return (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Something went wrong</Text>
          <Text style={styles.emptySubtext}>Pull down to try again.</Text>
        </View>
      );
    }
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No events found</Text>
        <Text style={styles.emptySubtext}>Check back later for new events!</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={isLoading ? [] : (search || typeFilter !== undefined || timeFilter !== 'all' ? events : regularEvents)}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingBottom: 110,
  },
  headerContainer: {
    marginBottom: Spacing.sm,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 64 : 44,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  greeting: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.textOnDark,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.textOnDarkMuted,
    marginTop: Spacing.xxs,
    fontWeight: Typography.fontWeight.medium,
  },
  searchContainer: {
    marginBottom: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md + 2,
    fontSize: Typography.fontSize.md,
    color: Colors.textOnDark,
  },
  clearButton: {
    color: Colors.textOnDarkMuted,
    fontSize: 16,
    paddingHorizontal: Spacing.sm,
  },
  filtersWrap: {
    paddingHorizontal: Spacing.lg,
    marginTop: -Spacing.sm,
  },
  featuredSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    letterSpacing: -0.2,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  featuredScroll: {
    gap: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingRight: Spacing.lg,
  },
  featuredCardWrapper: {
    width: 280,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.xxl,
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
