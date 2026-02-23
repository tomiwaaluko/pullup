import { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { EventType } from '@/lib/types';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import Button from '@/components/Button';

const INTEREST_OPTIONS: { label: string; value: EventType; color: string; icon: string }[] = [
  { label: 'Academic', value: 'academic', color: Colors.primary, icon: '📚' },
  { label: 'Sports', value: 'sports', color: Colors.error, icon: '🏀' },
  { label: 'Social', value: 'social', color: Colors.secondary, icon: '🎉' },
  { label: 'Career', value: 'career', color: Colors.success, icon: '💼' },
  { label: 'Club', value: 'club', color: Colors.warning, icon: '🎨' },
  { label: 'Greek Life', value: 'greek', color: Colors.primaryDark, icon: '🏛️' },
  { label: 'Other', value: 'other', color: Colors.textMuted, icon: '✨' },
];

function InterestTile({ option, selected, onPress }: any) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, speed: 20, bounciness: 12 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 12 }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.tileWrapper}>
      <Animated.View style={[
        styles.tile,
        selected ? { backgroundColor: option.color, borderColor: option.color } : { borderColor: Colors.border },
        { transform: [{ scale }] }
      ]}>
        <Text style={styles.tileIcon}>{option.icon}</Text>
        <Text style={[styles.tileText, selected && styles.tileTextSelected]}>{option.label}</Text>
      </Animated.View>
    </Pressable>
  );
}

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
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user.id)
          .single();

        const existing = (profile?.preferences as Record<string, unknown>) ?? {};
        await supabase
          .from('profiles')
          .update({ preferences: { ...existing, interests: selected } })
          .eq('id', user.id);
      } catch {
      }
    }
    router.push('/(onboard)/notifications');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What are you into?</Text>
        <Text style={styles.subtitle}>Select your interests to personalize your feed.</Text>

        <View style={styles.grid}>
          {INTEREST_OPTIONS.map((option) => (
            <InterestTile
              key={option.value}
              option={option}
              selected={selected.includes(option.value)}
              onPress={() => toggle(option.value)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <Button
          title={selected.length > 0 ? "Continue" : "Skip for now"}
          onPress={handleContinue}
          variant={selected.length > 0 ? "primary" : "secondary"}
        />
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
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textMuted,
    marginBottom: Spacing.xxl,
    lineHeight: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  tileWrapper: {
    width: '47%',
  },
  tile: {
    borderWidth: 2,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  tileIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  tileText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  tileTextSelected: {
    color: Colors.white,
  },
  bottom: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
