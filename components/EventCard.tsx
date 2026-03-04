import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Event } from '@/lib/types';
import { Colors, Gradients, Typography, Spacing, Radius, Shadows, EventTypeColors } from '@/constants/theme';

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'featured';
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

export default function EventCard({ event, variant = 'default' }: EventCardProps) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
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

  const typeColors = EventTypeColors[event.type] || EventTypeColors.other;

  return (
    <Pressable
      onPress={() => router.push(`/events/${event.id}`)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[
        styles.card,
        variant === 'featured' && styles.cardFeatured,
        { transform: [{ scale }] },
      ]}>
        <View style={styles.imageWrap}>
          <LinearGradient
            colors={variant === 'featured' ? [...Gradients.brand] : [...Gradients.electric]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.imagePlaceholder}
          >
            <Text style={styles.imageLetter}>
              {event.title.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>

          <View style={[styles.typeChip, { backgroundColor: typeColors.bg }]}>
            <View style={[styles.typeDot, { backgroundColor: typeColors.dot }]} />
            <Text style={[styles.typeText, { color: typeColors.text }]}>{event.type}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>{'  '}</Text>
              <Text style={styles.metaText}>
                {formatDate(event.start_time)} · {formatTime(event.start_time)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>{'  '}</Text>
              <Text style={styles.metaText} numberOfLines={1}>
                {event.location}
              </Text>
            </View>
          </View>

          {event.organization && (
            <View style={styles.orgRow}>
              <LinearGradient
                colors={[...Gradients.brand]}
                style={styles.orgDot}
              />
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
    borderRadius: Radius.xl,
    marginBottom: Spacing.lg,
    ...Shadows.md,
    overflow: 'hidden',
  },
  cardFeatured: {
    ...Shadows.lg,
  },
  imageWrap: {
    position: 'relative',
  },
  imagePlaceholder: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLetter: {
    fontSize: 56,
    color: Colors.white,
    fontWeight: Typography.fontWeight.black,
    opacity: 0.25,
  },
  typeChip: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 1,
    borderRadius: Radius.full,
  },
  typeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  typeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    textTransform: 'capitalize',
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    letterSpacing: -0.2,
  },
  metaRow: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaIcon: {
    fontSize: 13,
    width: 20,
  },
  metaText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  orgDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  orgName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.semibold,
  },
});
