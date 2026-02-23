import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { EventType } from '@/lib/types';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

const INTEREST_OPTIONS: { label: string; value: EventType }[] = [
  { label: 'Academic', value: 'academic' },
  { label: 'Sports', value: 'sports' },
  { label: 'Social', value: 'social' },
  { label: 'Career', value: 'career' },
  { label: 'Club', value: 'club' },
  { label: 'Greek Life', value: 'greek' },
  { label: 'Other', value: 'other' },
];

export default function Interests() {
  const router = useRouter();
  const { user } = useAuth();
  const [selected, setSelected] = useState<EventType[]>([]);

  const toggle = (value: EventType) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleContinue = async () => {
    if (user && selected.length > 0) {
      await supabase
        .from('profiles')
        .update({ preferences: { interests: selected } })
        .eq('id', user.id);
    }
    router.push('/(onboard)/notifications');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>What are you into?</Text>
        <Text style={styles.subtitle}>Select your interests to personalize your feed.</Text>

        <View style={styles.grid}>
          {INTEREST_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[styles.chip, selected.includes(option.value) && styles.chipSelected]}
              onPress={() => toggle(option.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  selected.includes(option.value) && styles.chipTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>
            {selected.length > 0 ? 'Continue' : 'Skip'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 80,
  },
  content: {
    paddingHorizontal: Spacing.xl,
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
    marginBottom: Spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  chip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
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
  bottom: {
    padding: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
});
