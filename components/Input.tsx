import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function Input({ label, error, style, onFocus, onBlur, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          style
        ]}
        placeholderTextColor={Colors.textMuted}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginLeft: Spacing.xs,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    backgroundColor: Colors.surface,
    minHeight: 56,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error,
    marginLeft: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
});
