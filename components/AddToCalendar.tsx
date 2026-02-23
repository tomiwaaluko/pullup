import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Event } from '@/lib/types';
import { addToGoogleCalendar, addToOutlookCalendar } from '@/lib/calendar';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

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
    } catch {
      Alert.alert('Error', 'Could not open calendar.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Add to Calendar</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={() => handleAdd('google')}>
          <Text style={styles.buttonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleAdd('outlook')}>
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
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  button: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  buttonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
});
