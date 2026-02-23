import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { EventType } from '@/lib/types';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {TIME_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[styles.chip, selectedTime === filter.value && styles.chipActive]}
            onPress={() => onTimeChange(filter.value)}
          >
            <Text
              style={[styles.chipText, selectedTime === filter.value && styles.chipTextActive]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {EVENT_TYPES.map((type) => (
          <TouchableOpacity
            key={type.label}
            style={[styles.chip, selectedType === type.value && styles.chipActive]}
            onPress={() => onTypeChange(type.value)}
          >
            <Text
              style={[styles.chipText, selectedType === type.value && styles.chipTextActive]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  row: {
    flexGrow: 0,
  },
  chip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  chipTextActive: {
    color: Colors.white,
  },
});
