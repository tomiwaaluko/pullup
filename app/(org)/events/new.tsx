import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCurrentOrg } from '@/lib/org-context';
import { useCreateEvent } from '@/hooks/useOrganizations';
import { EventType, EventStatus } from '@/lib/types';
import { Colors, Gradients, Typography, Spacing, Radius, Shadows, EventTypeColors } from '@/constants/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';

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
        title, description,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        location, type, org_id: currentOrg.id, status,
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
        <Input label="Title *" placeholder="Event title" value={title} onChangeText={setTitle} />

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="What's this event about?"
            placeholderTextColor={Colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Input label="Start Date *" placeholder="YYYY-MM-DD" value={startDate} onChangeText={setStartDate} />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Start Time *" placeholder="HH:MM" value={startTime} onChangeText={setStartTime} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Input label="End Date *" placeholder="YYYY-MM-DD" value={endDate} onChangeText={setEndDate} />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="End Time *" placeholder="HH:MM" value={endTime} onChangeText={setEndTime} />
          </View>
        </View>

        <Input label="Location *" placeholder="e.g. Student Union, Room 201" value={location} onChangeText={setLocation} />

        <View style={styles.field}>
          <Text style={styles.label}>Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipRow}>
              {EVENT_TYPES.map((t) => {
                const active = type === t.value;
                const typeColor = EventTypeColors[t.value] || EventTypeColors.other;
                return (
                  <TouchableOpacity
                    key={t.value}
                    style={[styles.chip, active && { backgroundColor: typeColor.bg, borderColor: `${typeColor.dot}30` }]}
                    onPress={() => setType(t.value)}
                    activeOpacity={0.7}
                  >
                    {active && <View style={[styles.chipDot, { backgroundColor: typeColor.dot }]} />}
                    <Text style={[styles.chipText, active && { color: typeColor.text, fontWeight: Typography.fontWeight.semibold }]}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <Input label="Capacity (optional)" placeholder="Leave blank for unlimited" value={capacity} onChangeText={setCapacity} keyboardType="numeric" />

        <View style={styles.statusRow}>
          <TouchableOpacity
            style={[styles.statusButton, status === 'draft' && styles.statusActive]}
            onPress={() => setStatus('draft')}
            activeOpacity={0.7}
          >
            {status === 'draft' && <View style={[styles.statusDot, { backgroundColor: Colors.accent }]} />}
            <Text style={[styles.statusText, status === 'draft' && { color: Colors.accent, fontWeight: Typography.fontWeight.semibold }]}>
              Save as Draft
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statusButton, status === 'published' && styles.statusActive]}
            onPress={() => setStatus('published')}
            activeOpacity={0.7}
          >
            {status === 'published' && <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />}
            <Text style={[styles.statusText, status === 'published' && { color: Colors.success, fontWeight: Typography.fontWeight.semibold }]}>
              Publish
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title={status === 'published' ? 'Publish Event' : 'Save Draft'}
          onPress={handleSubmit}
          loading={createEvent.isPending}
        />
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
    padding: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 24 : 16,
    paddingBottom: Spacing.xxxl,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xl,
    letterSpacing: -0.3,
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
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
    letterSpacing: 0.2,
  },
  textArea: {
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    backgroundColor: Colors.surfaceSecondary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
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
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  statusRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: Radius.xl,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  statusActive: {
    backgroundColor: Colors.surfaceSecondary,
    borderColor: Colors.borderLight,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
  },
});
