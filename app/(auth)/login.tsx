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
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { Colors, Gradients, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function SignIn() {
  const { signIn, signInWithOAuth, devSignIn } = useAuth();
  const router = useRouter();
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
            {/* Tab toggle row */}
            <View style={styles.tabContainer}>
              <View style={styles.tabTrack}>
                <View style={styles.tabActive}>
                  <Text style={styles.tabActiveText}>Sign In</Text>
                </View>
                <Pressable
                  style={styles.tabInactive}
                  onPress={() => router.push('/(auth)/sign-up')}
                >
                  <Text style={styles.tabInactiveText}>Sign Up</Text>
                </Pressable>
              </View>
            </View>

            {/* Social auth buttons */}
            <View style={styles.socialGroup}>
              <Pressable
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed && styles.socialButtonPressed,
                ]}
                onPress={() => handleOAuthSignIn('google')}
                disabled={loading}
              >
                <View style={styles.socialIconCircle}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed && styles.socialButtonPressed,
                ]}
                onPress={() => handleOAuthSignIn('apple')}
                disabled={loading}
              >
                <View style={[styles.socialIconCircle, styles.appleIconCircle]}>
                  <Text style={styles.appleIconText}>
                    {'\uF8FF'}
                  </Text>
                </View>
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </Pressable>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with email</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Email + Password form */}
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
    paddingTop: Spacing.xl,
    ...Shadows.lg,
  },

  // Tab toggle
  tabContainer: {
    marginBottom: Spacing.xl,
  },
  tabTrack: {
    flexDirection: 'row',
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.full,
    padding: 4,
  },
  tabActive: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glow,
  },
  tabActiveText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  tabInactive: {
    flex: 1,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInactiveText: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },

  // Social auth
  socialGroup: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  socialButtonPressed: {
    backgroundColor: Colors.borderLight,
  },
  socialIconCircle: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  appleIconCircle: {
    backgroundColor: Colors.ink,
    borderColor: Colors.ink,
  },
  googleIconText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.info,
  },
  appleIconText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  socialButtonText: {
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginRight: 28 + Spacing.md, // balance the icon on the left so text appears centered
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    fontWeight: Typography.fontWeight.medium,
  },

  // Email form
  form: {
    gap: Spacing.lg,
  },
  button: {
    marginTop: Spacing.sm,
  },
  devButton: {
    marginTop: Spacing.lg,
  },
});
