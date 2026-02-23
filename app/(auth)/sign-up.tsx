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

export default function SignUp() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    Keyboard.dismiss();
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in email and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { error, needsConfirmation } = await signUp(email, password, name || undefined);
      if (error) {
        Alert.alert('Sign Up Error', error.message);
      } else if (needsConfirmation) {
        Alert.alert(
          'Check Your Email',
          'A confirmation link was sent to your email. Please confirm to sign in.',
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      Alert.alert('Sign Up Error', message);
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join PullUp today</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.form}>
            <Input
              label="Name (Optional)"
              placeholder="What should we call you?"
              value={name}
              onChangeText={setName}
            />
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
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={loading}
              style={styles.button}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <Text style={styles.link}>Sign In</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary, // Vibrant color
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
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.white,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.white,
    opacity: 0.8,
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
});
