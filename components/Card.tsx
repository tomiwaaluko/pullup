import React, { useRef } from 'react';
import { View, StyleSheet, ViewStyle, Animated, Pressable } from 'react-native';
import { Colors, Spacing, Radius, Shadows } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({ children, style, onPress, variant = 'default' }: CardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.975,
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

  const variantStyle =
    variant === 'elevated' ? styles.elevated :
    variant === 'outlined' ? styles.outlined :
    styles.default;

  const cardContent = (
    <Animated.View
      style={[
        styles.card,
        variantStyle,
        style,
        onPress && { transform: [{ scale }] },
      ]}
    >
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    backgroundColor: Colors.white,
  },
  default: {
    ...Shadows.md,
  },
  elevated: {
    ...Shadows.lg,
  },
  outlined: {
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: 'transparent',
    elevation: 0,
  },
});
