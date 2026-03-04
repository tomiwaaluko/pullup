import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, Gradients, Typography, Spacing, Shadows } from '@/constants/theme';
import Button from '@/components/Button';

export default function OrgSuccess() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <LinearGradient
          colors={[...Gradients.brand]}
          style={styles.iconCircle}
        >
          <Text style={styles.iconText}>✓</Text>
        </LinearGradient>
        <Text style={styles.title}>You're all set!</Text>
        <Text style={styles.description}>
          Your organization has been registered. Start creating events to get the word out.
        </Text>
      </View>

      <View style={styles.bottom}>
        <Button
          title="Go to Dashboard"
          onPress={() => router.replace('/(org)')}
        />
        <Button
          title="Back to Home"
          variant="ghost"
          onPress={() => router.replace('/(tabs)')}
        />
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
    paddingBottom: Spacing.xxxl,
  },
  content: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.glow,
  },
  iconText: {
    fontSize: 36,
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.success,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: Typography.fontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottom: {
    gap: Spacing.sm,
  },
});
