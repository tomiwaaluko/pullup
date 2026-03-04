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
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentOrg } from '@/lib/org-context';
import { useUpdateOrganization } from '@/hooks/useOrganizations';
import { EventType } from '@/lib/types';
import { Colors, Typography, Spacing, Radius, Shadows, EventTypeColors } from '@/constants/theme';
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
        id: currentOrg.id, name, description, category, contact_email: contactEmail,
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
        <Input label="Organization Name" value={name} onChangeText={setName} />

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor={Colors.textMuted}
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
                  style={[
                    styles.chip,
                    active && { backgroundColor: typeColor.bg, borderColor: `${typeColor.dot}30` },
                  ]}
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

        <Input
          label="Contact Email"
          value={contactEmail}
          onChangeText={setContactEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={updateOrg.isPending}
          style={styles.saveButton}
        />
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)')} activeOpacity={0.7}>
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
    padding: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 64 : 44,
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
  saveButton: {
    marginTop: Spacing.sm,
  },
  backButton: {
    marginTop: Spacing.xxl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
});
