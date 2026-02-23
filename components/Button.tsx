import React, { useRef } from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle, Animated } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
    >
      <Animated.View
        style={[
          styles.base,
          variant === 'primary' && styles.primary,
          variant === 'secondary' && styles.secondary,
          variant === 'ghost' && styles.ghost,
          isDisabled && styles.disabled,
          style,
          { transform: [{ scale }] }
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? Colors.white : Colors.primary}
          />
        ) : (
          <Text
            style={[
              styles.text,
              variant === 'primary' && styles.primaryText,
              variant === 'secondary' && styles.secondaryText,
              variant === 'ghost' && styles.ghostText,
            ]}
          >
            {title}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primary: {
    backgroundColor: Colors.primary,
    ...Shadows.md,
  },
  secondary: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.primary,
  },
});
