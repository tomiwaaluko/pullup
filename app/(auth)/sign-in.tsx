import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function SignIn() {
  const { signIn, devSignIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    Keyboard.dismiss();
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        Alert.alert('Sign In Error', error.message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      Alert.alert('Sign In Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>PullUp</Text>
          <Text style={styles.subtitle}>Discover campus events</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
              style={styles.button}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <Text style={styles.link}>Sign Up</Text>
            </Link>
          </View>

          {__DEV__ && (
            <Button
              title="Browse as Guest (Dev)"
              onPress={devSignIn}
              variant="secondary"
              style={styles.devButton}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  title: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.white,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.primaryLight,
    marginTop: Spacing.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadows.floating,
  },
  form: {
    gap: Spacing.lg,
  },
  button: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
  },
  link: {
    color: Colors.primary,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
  },
  devButton: {
    marginTop: Spacing.lg,
  },
});
