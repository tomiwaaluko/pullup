import React, { useRef } from 'react';
import { View, StyleSheet, ViewStyle, Animated, Pressable } from 'react-native';
import { Colors, Spacing, Radius, Shadows } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export default function Card({ children, style, onPress }: CardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
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

  const cardContent = (
    <Animated.View style={[
      styles.card, 
      style,
      onPress && { transform: [{ scale }] }
    ]}>
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
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    ...Shadows.md,
  },
});
