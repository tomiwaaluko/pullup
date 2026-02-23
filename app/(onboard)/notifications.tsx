import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

export default function Notifications() {
  const router = useRouter();

  const handleEnable = async () => {
    // Phase 2: Request Expo push notification permissions here
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Stay in the loop</Text>
        <Text style={styles.description}>
          Enable notifications so you never miss an event you RSVP'd to.
        </Text>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.button} onPress={handleEnable}>
          <Text style={styles.buttonText}>Enable Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleSkip}>
          <Text style={styles.secondaryButtonText}>Maybe Later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: 120,
    paddingBottom: Spacing.xxl,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  description: {
    fontSize: Typography.fontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottom: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  secondaryButton: {
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
  },
});
