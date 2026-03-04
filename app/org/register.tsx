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
import { useRouter } from 'expo-router';
import { useCreateOrganization } from '@/hooks/useOrganizations';
import { EventType } from '@/lib/types';
import { Colors, Typography, Spacing, Radius, EventTypeColors } from '@/constants/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';

const CATEGORIES: { label: string; value: EventType }[] = [
  { label: 'Academic', value: 'academic' },
  { label: 'Sports', value: 'sports' },
  { label: 'Social', value: 'social' },
  { label: 'Club', value: 'club' },
  { label: 'Career', value: 'career' },
  { label: 'Greek Life', value: 'greek' },
  { label: 'Other', value: 'other' },
];

export default function RegisterOrg() {
  const router = useRouter();
  const createOrg = useCreateOrganization();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventType>('club');
  const [contactEmail, setContactEmail] = useState('');

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedEmail = contactEmail.trim();
    if (!trimmedName || !trimmedDescription || !trimmedEmail) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    try {
      await createOrg.mutateAsync({
        name: trimmedName, description: trimmedDescription, category, contact_email: trimmedEmail,
      });
      router.replace('/org/success');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to register organization.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Register Your Organization</Text>
      <Text style={styles.subtitle}>
        Create a page for your org and start posting events.
      </Text>

      <View style={styles.form}>
        <Input label="Organization Name *" placeholder="e.g. Computer Science Club" value={name} onChangeText={setName} />

        <View style={styles.field}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tell students about your organization..."
            placeholderTextColor={Colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((cat) => {
              const active = category === cat.value;
              const typeColor = EventTypeColors[cat.value] || EventTypeColors.other;
              return (
                <TouchableOpacity
                  key={cat.value}
                  style={[styles.chip, active && { backgroundColor: typeColor.bg, borderColor: `${typeColor.dot}30` }]}
                  onPress={() => setCategory(cat.value)}
                  activeOpacity={0.7}
                >
                  {active && <View style={[styles.chipDot, { backgroundColor: typeColor.dot }]} />}
                  <Text style={[styles.chipText, active && { color: typeColor.text, fontWeight: Typography.fontWeight.semibold }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Input label="Contact Email *" placeholder="org@university.edu" value={contactEmail} onChangeText={setContactEmail} autoCapitalize="none" keyboardType="email-address" />

        <Button
          title="Register Organization"
          onPress={handleSubmit}
          loading={createOrg.isPending}
          style={styles.submitButton}
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
    marginBottom: Spacing.xs,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.textMuted,
    marginBottom: Spacing.xxl,
  },
  form: {
    gap: Spacing.xl,
  },
  field: {
    gap: Spacing.sm,
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
    flexWrap: 'wrap',
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
  submitButton: {
    marginTop: Spacing.sm,
  },
});
