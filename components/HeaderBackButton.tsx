import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

interface HeaderBackButtonProps {
  label?: string;
}

export default function HeaderBackButton({ label }: HeaderBackButtonProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={styles.button}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.7}
    >
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>{Platform.OS === 'ios' ? '‹' : '←'}</Text>
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  icon: {
    fontSize: 22,
    color: Colors.white,
    fontWeight: Typography.fontWeight.medium,
    marginTop: Platform.OS === 'ios' ? -2 : 0,
  },
  label: {
    fontSize: Typography.fontSize.md,
    color: Colors.white,
    fontWeight: Typography.fontWeight.medium,
  },
});
