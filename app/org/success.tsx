import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

export default function OrgSuccess() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>You're all set!</Text>
        <Text style={styles.description}>
          Your organization has been registered. Start creating events to get the word out.
        </Text>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/(org)')}
        >
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
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
    color: Colors.success,
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
