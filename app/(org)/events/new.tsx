import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentOrg } from '@/lib/org-context';
import { useCreateEvent } from '@/hooks/useOrganizations';
import { EventType, EventStatus } from '@/lib/types';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

const EVENT_TYPES: { label: string; value: EventType }[] = [
  { label: 'Academic', value: 'academic' },
  { label: 'Sports', value: 'sports' },
  { label: 'Social', value: 'social' },
  { label: 'Career', value: 'career' },
  { label: 'Club', value: 'club' },
  { label: 'Greek Life', value: 'greek' },
  { label: 'Other', value: 'other' },
];

export default function CreateEvent() {
  const router = useRouter();
  const { currentOrg } = useCurrentOrg();
  const createEvent = useCreateEvent();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<EventType>('social');
  const [status, setStatus] = useState<EventStatus>('draft');
  const [capacity, setCapacity] = useState('');

  const handleSubmit = async () => {
    if (!currentOrg) return;
    if (!title || !startDate || !startTime || !endDate || !endTime || !location) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const parsedCapacity = capacity ? parseInt(capacity, 10) : undefined;
    if (parsedCapacity !== undefined && (isNaN(parsedCapacity) || parsedCapacity <= 0)) {
      Alert.alert('Error', 'Capacity must be a positive number.');
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      Alert.alert('Error', 'Please enter valid dates and times.');
      return;
    }
    if (endDateTime <= startDateTime) {
      Alert.alert('Error', 'End date/time must be after start date/time.');
      return;
    }

    try {
      await createEvent.mutateAsync({
        title,
        description,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        location,
        type,
        org_id: currentOrg.id,
        status,
        capacity: parsedCapacity,
      });
      Alert.alert('Success', `Event ${status === 'published' ? 'published' : 'saved as draft'}.`);
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to create event.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create Event</Text>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Event title"
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What's this event about?"
            placeholderTextColor={Colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Start Date *</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.textMuted}
              value={startDate}
              onChangeText={setStartDate}
            />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Start Time *</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:MM"
              placeholderTextColor={Colors.textMuted}
              value={startTime}
              onChangeText={setStartTime}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>End Date *</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.textMuted}
              value={endDate}
              onChangeText={setEndDate}
            />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>End Time *</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:MM"
              placeholderTextColor={Colors.textMuted}
              value={endTime}
              onChangeText={setEndTime}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Student Union, Room 201"
            placeholderTextColor={Colors.textMuted}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipRow}>
              {EVENT_TYPES.map((t) => (
                <TouchableOpacity
                  key={t.value}
                  style={[styles.chip, type === t.value && styles.chipSelected]}
                  onPress={() => setType(t.value)}
                >
                  <Text style={[styles.chipText, type === t.value && styles.chipTextSelected]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Capacity (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Leave blank for unlimited"
            placeholderTextColor={Colors.textMuted}
            value={capacity}
            onChangeText={setCapacity}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.statusRow}>
          <TouchableOpacity
            style={[styles.statusButton, status === 'draft' && styles.statusActive]}
            onPress={() => setStatus('draft')}
          >
            <Text
              style={[styles.statusText, status === 'draft' && styles.statusTextActive]}
            >
              Save as Draft
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statusButton, status === 'published' && styles.statusActive]}
            onPress={() => setStatus('published')}
          >
            <Text
              style={[styles.statusText, status === 'published' && styles.statusTextActive]}
            >
              Publish
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, createEvent.isPending && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={createEvent.isPending}
        >
          {createEvent.isPending ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>
              {status === 'published' ? 'Publish Event' : 'Save Draft'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  form: {
    gap: Spacing.xl,
  },
  field: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  chipTextSelected: {
    color: Colors.white,
  },
  statusRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statusButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  statusText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  statusTextActive: {
    color: Colors.white,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
});
