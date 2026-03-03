import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function SignUp() {
  const { signUp } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Step 2 fields
  const [school, setSchool] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [major, setMajor] = useState('');

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateStep1 = (): boolean => {
    setFormError('');
    if (!firstName.trim()) {
      setFormError('Please enter your first name.');
      return false;
    }
    if (!lastName.trim()) {
      setFormError('Please enter your last name.');
      return false;
    }
    if (!email.trim()) {
      setFormError('Please enter your email.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setFormError('Please enter a password.');
      return false;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return false;
    }
    if (!agreedToTerms) {
      setFormError('You must agree to the Terms of Service and Privacy Policy.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    Keyboard.dismiss();
    if (validateStep1()) {
      setFormError('');
      setStep(2);
    }
  };

  const handleBack = () => {
    Keyboard.dismiss();
    setFormError('');
    setSuccessMessage('');
    setStep(1);
  };

  const handleSignUp = async () => {
    Keyboard.dismiss();
    setFormError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const year = graduationYear.trim() ? parseInt(graduationYear.trim(), 10) : undefined;
      if (graduationYear.trim() && (isNaN(year!) || year! < 2000 || year! > 2040)) {
        setFormError('Please enter a valid graduation year (2000-2040).');
        setLoading(false);
        return;
      }

      const { error, needsConfirmation } = await signUp(email.trim(), password, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        school: school.trim() || undefined,
        graduation_year: year,
        major: major.trim() || undefined,
      });

      if (error) {
        setFormError(error.message);
      } else if (needsConfirmation) {
        setSuccessMessage('Account created! Check your email for a confirmation link.');
      }
      // If no error and no needsConfirmation, the session was created
      // and the root layout will auto-redirect to (tabs)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setFormError(message);
      console.error('[SignUp] Unexpected error:', err);
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
          <Text style={styles.subtitle}>
            {step === 1 ? 'Join PullUp today' : 'Tell us about your school'}
          </Text>
          <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, styles.stepDotActive]} />
            <View style={[styles.stepDot, step === 2 && styles.stepDotActive]} />
          </View>
        </View>

        <View style={styles.card}>
          {formError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{formError}</Text>
            </View>
          ) : null}

          {successMessage ? (
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>{successMessage}</Text>
            </View>
          ) : null}

          {step === 1 ? (
            <View style={styles.form}>
              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  <Input
                    label="First Name"
                    placeholder="First name"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.nameField}>
                  <Input
                    label="Last Name"
                    placeholder="Last name"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

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
                placeholder="Create a password (6+ characters)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <Pressable
                style={styles.checkboxRow}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
              >
                <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                  {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>
                  I agree to the{' '}
                  <Text style={styles.tosLink}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.tosLink}>Privacy Policy</Text>
                </Text>
              </Pressable>

              <Button
                title="Next"
                onPress={handleNext}
                style={styles.button}
              />
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={styles.step2Heading}>Almost there!</Text>
              <Text style={styles.step2Subtext}>
                This helps us personalize your experience. You can skip and fill this in later.
              </Text>

              <Input
                label="School / University"
                placeholder="e.g. University of Texas"
                value={school}
                onChangeText={setSchool}
                autoCapitalize="words"
              />

              <Input
                label="Graduation Year"
                placeholder="e.g. 2027"
                value={graduationYear}
                onChangeText={setGraduationYear}
                keyboardType="number-pad"
              />

              <Input
                label="Major"
                placeholder="e.g. Computer Science"
                value={major}
                onChangeText={setMajor}
                autoCapitalize="words"
              />

              <Button
                title="Create Account"
                onPress={handleSignUp}
                loading={loading}
                style={styles.button}
              />

              <Button
                title="Back"
                onPress={handleBack}
                variant="ghost"
              />
            </View>
          )}

          {step === 1 && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/(auth)/sign-in" asChild>
                <Text style={styles.link}>Sign In</Text>
              </Link>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
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
  stepIndicator: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.white,
    opacity: 0.4,
  },
  stepDotActive: {
    opacity: 1,
    width: 28,
    borderRadius: 5,
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
  nameRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  nameField: {
    flex: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: Radius.xs,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: Typography.fontWeight.bold,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  tosLink: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
  },
  step2Heading: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  step2Subtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  errorBannerText: {
    color: Colors.error,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  successBanner: {
    backgroundColor: '#D1FAE5',
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  successBannerText: {
    color: '#065F46',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
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
