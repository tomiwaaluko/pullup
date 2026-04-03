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
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { Colors, Gradients, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function SignIn() {
  const { signIn, signInWithOAuth, devSignIn } = useAuth();
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

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setLoading(true);
    try {
      const { error } = await signInWithOAuth(provider);
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
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.ink, Colors.charcoal]}
        style={styles.heroGradient}
      >
        <View style={styles.heroContent}>
          <LinearGradient
            colors={[...Gradients.brand]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoBadge}
          >
            <Text style={styles.logoIcon}>P</Text>
          </LinearGradient>
          <Text style={styles.title}>PullUp</Text>
          <Text style={styles.subtitle}>Discover what's happening on campus</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.formArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome back</Text>
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
              <Button
                title="Continue with Google"
                onPress={() => handleOAuthSignIn('google')}
                variant="secondary"
              />
              <Button
                title="Continue with Apple"
                onPress={() => handleOAuthSignIn('apple')}
                variant="secondary"
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
                variant="ghost"
                size="md"
                style={styles.devButton}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroGradient: {
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 48,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.glow,
  },
  logoIcon: {
    fontSize: 28,
    fontWeight: Typography.fontWeight.black,
    color: Colors.white,
  },
  title: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.textOnDark,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.textOnDarkMuted,
    marginTop: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  formArea: {
    flex: 1,
    marginTop: -24,
  },
  scrollContent: {
    flexGrow: 1,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
    ...Shadows.lg,
  },
  cardTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xl,
    letterSpacing: -0.3,
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
    marginTop: Spacing.xxl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
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
