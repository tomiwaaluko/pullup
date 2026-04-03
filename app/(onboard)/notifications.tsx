import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { Colors, Gradients, Typography, Spacing, Shadows } from '@/constants/theme';
import Button from '@/components/Button';

export default function Notifications() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();

  const handleEnable = async () => {
    // Phase 2: Request Expo push notification permissions here
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.graphicSection}>
        <View style={styles.graphicWrap}>
          <View style={styles.glowBlob} />
          <LinearGradient
            colors={[...Gradients.warmSunset]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.graphicCircle}
          >
            <Text style={styles.graphicText}>🔔</Text>
          </LinearGradient>
          <View style={styles.glowRing} />
        </View>
      </View>

      <View style={styles.textSection}>
        <Text style={styles.title}>Stay in the loop</Text>
        <Text style={styles.description}>
          Enable notifications so you never miss an event you RSVP'd to. We promise not to spam you!
        </Text>
      </View>

      <View style={styles.bottom}>
        <Button title="Enable Notifications" variant="primary" onPress={handleEnable} />
        <Button title="Maybe Later" variant="ghost" onPress={handleSkip} style={styles.secondaryBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ink,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
  },
  graphicSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphicWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowBlob: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(249, 115, 22, 0.06)',
  },
  graphicCircle: {
    width: 140,
    height: 140,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glowPink,
  },
  glowRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(249, 115, 22, 0.2)',
  },
  graphicText: {
    fontSize: 64,
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.xxl,
  },
  title: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.textOnDark,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textOnDarkMuted,
    textAlign: 'center',
    lineHeight: 28,
  },
  bottom: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 52 : 32,
    paddingTop: Spacing.xl,
    gap: Spacing.sm,
  },
  secondaryBtn: {
    marginTop: Spacing.xs,
  },
});
