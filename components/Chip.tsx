import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated, View } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
  size?: 'sm' | 'md';
}

export default function Chip({ label, selected = false, onPress, color, size = 'md' }: ChipProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
      damping: 15,
      stiffness: 300,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 12,
      stiffness: 200,
    }).start();
  };

  const activeColor = color || Colors.primary;
  const activeBg = color ? `${color}15` : Colors.primaryMuted;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.chip,
          size === 'sm' && styles.chipSm,
          selected && { backgroundColor: activeBg, borderColor: `${activeColor}30` },
          { transform: [{ scale }] },
        ]}
      >
        {selected && (
          <View style={[styles.dot, { backgroundColor: activeColor }]} />
        )}
        <Text
          style={[
            styles.text,
            size === 'sm' && styles.textSm,
            selected && { color: activeColor, fontWeight: Typography.fontWeight.semibold },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    backgroundColor: Colors.white,
    gap: Spacing.xs,
  },
  chipSm: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  textSm: {
    fontSize: Typography.fontSize.xs,
  },
});
