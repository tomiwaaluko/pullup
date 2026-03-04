import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, Gradients, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import Button from '@/components/Button';

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.ink, Colors.charcoal]}
        style={styles.topGradient}
      >
        <View style={styles.graphicWrap}>
          <LinearGradient
            colors={[...Gradients.brand]}
            style={styles.graphicCircle}
          >
            <Text style={styles.graphicText}>🎉</Text>
          </LinearGradient>
          <View style={styles.glowRing} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to PullUp!</Text>
        <Text style={styles.description}>
          Discover what's happening on campus. Find events, RSVP, and never miss out on the fun.
        </Text>
      </View>

      <View style={styles.bottom}>
        <Button
          title="Let's Go!"
          onPress={() => router.push('/(onboard)/interests')}
        />
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
    ...Shadows.glow,
  },
  glowRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.15)',
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
  },
});
