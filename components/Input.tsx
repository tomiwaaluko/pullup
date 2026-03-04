import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet, Animated } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function Input({ label, error, style, value, onFocus, onBlur, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.borderLight, Colors.primary],
  });

  const bgColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.surfaceSecondary, Colors.white],
  });

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, isFocused && styles.labelFocused]}>
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputWrap,
          { borderColor, backgroundColor: bgColor },
          error && styles.inputError,
        ]}
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.textMuted}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          value={value}
          {...props}
        />
      </Animated.View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
    letterSpacing: 0.2,
  },
  labelFocused: {
    color: Colors.primary,
  },
  inputWrap: {
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surfaceSecondary,
  },
  input: {
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    minHeight: 52,
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorMuted,
  },
  error: {
    fontSize: Typography.fontSize.xs,
    color: Colors.error,
    marginLeft: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
});
