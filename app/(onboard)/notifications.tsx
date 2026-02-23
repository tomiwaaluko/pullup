import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants/theme';
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
      <View style={styles.content}>
        <View style={styles.graphicPlaceholder}>
          <Text style={styles.graphicText}>🔔</Text>
        </View>
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
    backgroundColor: Colors.accent,
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
    color: Colors.text,
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
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  secondaryBtn: {
    marginTop: Spacing.sm,
  },
});
