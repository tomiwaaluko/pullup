import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export default function Chip({ label, selected = false, onPress }: ChipProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[
        styles.chip,
        selected && styles.chipSelected,
        { transform: [{ scale }] }
      ]}>
        <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Shadows.md,
  },
  text: {
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    fontWeight: Typography.fontWeight.bold,
  },
  textSelected: {
    color: Colors.white,
  },
});
