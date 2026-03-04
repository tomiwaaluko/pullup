import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, Gradients, Typography, Spacing, Shadows } from '@/constants/theme';
import Button from '@/components/Button';

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
      <LinearGradient
        colors={[Colors.ink, Colors.charcoal]}
        style={styles.topGradient}
      >
        <View style={styles.graphicWrap}>
          <LinearGradient
            colors={[...Gradients.warmSunset]}
            style={styles.graphicCircle}
          >
            <Text style={styles.graphicText}>🔔</Text>
          </LinearGradient>
          <View style={styles.glowRing} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.title}>Stay in the loop</Text>
        <Text style={styles.description}>
          Enable notifications so you never miss an event you RSVP'd to. We promise not to spam you!
        </Text>
      </View>

      <View style={styles.bottom}>
        <Button title="Enable Notifications" onPress={handleEnable} />
        <Button title="Maybe Later" variant="ghost" onPress={handleSkip} style={styles.secondaryBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topGradient: {
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: 60,
    alignItems: 'center',
  },
  graphicWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphicCircle: {
    width: 120,
    height: 120,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glowPink,
  },
  glowRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(249, 115, 22, 0.15)',
  },
  graphicText: {
    fontSize: 56,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    marginTop: -Spacing.xxl,
  },
  title: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 28,
  },
  bottom: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.sm,
  },
  secondaryBtn: {
    marginTop: Spacing.xs,
  },
});
