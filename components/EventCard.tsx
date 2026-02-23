import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Event } from '@/lib/types';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';

interface EventCardProps {
  event: Event;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
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
      onPress={() => router.push(`/events/${event.id}`)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>
            {event.title.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>{event.type}</Text>
            </View>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>

          <View style={styles.details}>
            <Text style={styles.detailText}>
              📅 {formatDate(event.start_time)} at {formatTime(event.start_time)}
            </Text>
            <Text style={styles.detailText} numberOfLines={1}>
              📍 {event.location}
            </Text>
          </View>

          {event.organization && (
            <View style={styles.orgContainer}>
              <View style={styles.orgAvatar} />
              <Text style={styles.orgName}>{event.organization.name}</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 140,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: Typography.fontSize.xxxl,
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
    opacity: 0.5,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  typeTag: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  typeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  details: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  detailText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    fontWeight: Typography.fontWeight.medium,
  },
  orgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  orgAvatar: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    marginRight: Spacing.sm,
  },
  orgName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.bold,
  },
});
