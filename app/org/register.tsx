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
import { useCreateOrganization } from '@/hooks/useOrganizations';
import { EventType } from '@/lib/types';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

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
        name: trimmedName,
        description: trimmedDescription,
        category,
        contact_email: trimmedEmail,
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
        <View style={styles.field}>
          <Text style={styles.label}>Organization Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Computer Science Club"
            placeholderTextColor={Colors.textMuted}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
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
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[styles.chip, category === cat.value && styles.chipSelected]}
                onPress={() => setCategory(cat.value)}
              >
                <Text
                  style={[
                    styles.chipText,
                    category === cat.value && styles.chipTextSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Contact Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="org@university.edu"
            placeholderTextColor={Colors.textMuted}
            value={contactEmail}
            onChangeText={setContactEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, createOrg.isPending && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={createOrg.isPending}
        >
          {createOrg.isPending ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Register Organization</Text>
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
    paddingTop: Spacing.xxl,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
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
    flexWrap: 'wrap',
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
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
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
