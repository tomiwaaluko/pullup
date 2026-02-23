import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants/theme';
import Button from '@/components/Button';

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.graphicPlaceholder}>
          <Text style={styles.graphicText}>🎉</Text>
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: 100,
    paddingBottom: Spacing.xxxl,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  graphicPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: Colors.primaryLight,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  graphicText: {
    fontSize: 60,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: Spacing.md,
  },
  bottom: {
    paddingBottom: Spacing.xl,
  },
});
