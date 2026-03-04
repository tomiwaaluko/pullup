import { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { EventType } from '@/lib/types';
import { Colors, Gradients, Typography, Spacing, Radius, Shadows, EventTypeColors } from '@/constants/theme';
import Button from '@/components/Button';

const INTEREST_OPTIONS: { label: string; value: EventType; icon: string }[] = [
  { label: 'Academic', value: 'academic', icon: '📚' },
  { label: 'Sports', value: 'sports', icon: '🏀' },
  { label: 'Social', value: 'social', icon: '🎉' },
  { label: 'Career', value: 'career', icon: '💼' },
  { label: 'Club', value: 'club', icon: '🎨' },
  { label: 'Greek Life', value: 'greek', icon: '🏛️' },
  { label: 'Other', value: 'other', icon: '✨' },
];

function InterestTile({ option, selected, onPress }: any) {
  const scale = useRef(new Animated.Value(1)).current;
  const typeColor = EventTypeColors[option.value] || EventTypeColors.other;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, damping: 15, stiffness: 300 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 200 }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.tileWrapper}>
      <Animated.View style={[
        styles.tile,
        selected
          ? { backgroundColor: typeColor.bg, borderColor: `${typeColor.dot}30` }
          : { borderColor: Colors.border, backgroundColor: Colors.white },
        { transform: [{ scale }] },
      ]}>
        <Text style={styles.tileIcon}>{option.icon}</Text>
        <Text style={[
          styles.tileText,
          selected && { color: typeColor.text, fontWeight: Typography.fontWeight.bold },
        ]}>
          {option.label}
        </Text>
        {selected && <View style={[styles.checkBadge, { backgroundColor: typeColor.dot }]}>
          <Text style={styles.checkMark}>✓</Text>
        </View>}
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
      } catch {}
    }
    router.push('/(onboard)/notifications');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.ink, Colors.charcoal, Colors.background]}
        style={styles.headerGradient}
      >
        <Text style={styles.title}>What are you into?</Text>
        <Text style={styles.subtitle}>Select your interests to personalize your feed.</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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

        {selected.length > 0 && (
          <Text style={styles.selectedCount}>{selected.length} selected</Text>
        )}
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
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 72 : 52,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.textOnDark,
    marginBottom: Spacing.xs,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.textOnDarkMuted,
    lineHeight: 24,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
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
    borderWidth: 1.5,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    position: 'relative',
    ...Shadows.sm,
  },
  tileIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  tileText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: Typography.fontWeight.bold,
  },
  selectedCount: {
    textAlign: 'center',
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
    marginTop: Spacing.xl,
  },
  bottom: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
