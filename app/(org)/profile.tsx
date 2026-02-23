import { useState, useEffect } from 'react';
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
import { useUpdateOrganization } from '@/hooks/useOrganizations';
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

export default function OrgProfile() {
  const router = useRouter();
  const { currentOrg, setCurrentOrg } = useCurrentOrg();
  const updateOrg = useUpdateOrganization();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventType>('club');
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => {
    if (currentOrg) {
      setName(currentOrg.name);
      setDescription(currentOrg.description);
      setCategory(currentOrg.category);
      setContactEmail(currentOrg.contact_email);
    }
  }, [currentOrg]);

  const handleSave = async () => {
    if (!currentOrg) return;
    if (!name || !description || !contactEmail) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      const updated = await updateOrg.mutateAsync({
        id: currentOrg.id,
        name,
        description,
        category,
        contact_email: contactEmail,
      });
      setCurrentOrg(updated);
      Alert.alert('Success', 'Organization profile updated.');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to update organization.');
    }
  };

  if (!currentOrg) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Organization Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
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
                  style={[styles.chipText, category === cat.value && styles.chipTextSelected]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Contact Email</Text>
          <TextInput
            style={styles.input}
            value={contactEmail}
            onChangeText={setContactEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, updateOrg.isPending && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={updateOrg.isPending}
        >
          {updateOrg.isPending ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={styles.backButtonText}>Switch to Member View</Text>
      </TouchableOpacity>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  backButton: {
    marginTop: Spacing.xxl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
  },
});
