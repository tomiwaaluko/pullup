import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { EventType } from '@/lib/types';
import { Colors, Typography, Spacing, Radius, EventTypeColors } from '@/constants/theme';

const EVENT_TYPES: { label: string; value: EventType | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Academic', value: 'academic' },
  { label: 'Sports', value: 'sports' },
  { label: 'Social', value: 'social' },
  { label: 'Career', value: 'career' },
  { label: 'Club', value: 'club' },
  { label: 'Greek', value: 'greek' },
  { label: 'Other', value: 'other' },
];

const TIME_FILTERS: { label: string; value: 'today' | 'week' | 'all' }[] = [
  { label: 'Upcoming', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
];

interface EventFiltersProps {
  selectedType?: EventType;
  selectedTime: 'today' | 'week' | 'all';
  onTypeChange: (type: EventType | undefined) => void;
  onTimeChange: (time: 'today' | 'week' | 'all') => void;
}

export default function EventFilters({
  selectedType,
  selectedTime,
  onTypeChange,
  onTimeChange,
}: EventFiltersProps) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {TIME_FILTERS.map((filter) => {
          const active = selectedTime === filter.value;
          return (
            <TouchableOpacity
              key={filter.value}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onTimeChange(filter.value)}
              activeOpacity={0.7}
            >
              {active && <View style={styles.activeDot} />}
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {EVENT_TYPES.map((type) => {
          const active = selectedType === type.value;
          const dotColor = type.value ? EventTypeColors[type.value]?.dot : undefined;
          return (
            <TouchableOpacity
              key={type.label}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onTypeChange(type.value)}
              activeOpacity={0.7}
            >
              {active && dotColor && <View style={[styles.activeDot, { backgroundColor: dotColor }]} />}
              {active && !dotColor && <View style={styles.activeDot} />}
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  scrollContent: {
    paddingRight: Spacing.lg,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 1,
    backgroundColor: Colors.white,
  },
  chipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  chipTextActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
});
