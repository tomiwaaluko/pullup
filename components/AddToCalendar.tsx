import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Event } from '@/lib/types';
import { addToGoogleCalendar, addToOutlookCalendar } from '@/lib/calendar';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { track } from '@/lib/analytics';

interface AddToCalendarProps {
  event: Event;
}

export default function AddToCalendar({ event }: AddToCalendarProps) {
  const calendarEvent = {
    title: event.title,
    description: event.description || '',
    location: event.location,
    startTime: event.start_time,
    endTime: event.end_time,
  };

  const handleAdd = async (provider: 'google' | 'outlook') => {
    try {
      if (provider === 'google') {
        await addToGoogleCalendar(calendarEvent);
      } else {
        await addToOutlookCalendar(calendarEvent);
      }
      track('add_to_calendar', { provider, event_id: event.id });
    } catch {
      Alert.alert('Error', 'Could not open calendar.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Add to Calendar</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={() => handleAdd('google')} activeOpacity={0.7}>
          <Text style={styles.buttonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleAdd('outlook')} activeOpacity={0.7}>
          <Text style={styles.buttonText}>Outlook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  buttonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
});
