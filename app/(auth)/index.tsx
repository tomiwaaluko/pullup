import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { useFonts, FredokaOne_400Regular } from '@expo-google-fonts/fredoka-one';
import { Video, ResizeMode } from 'expo-av';
import { useAuth } from '@/lib/auth-context';

const TERMS_URL = 'https://pullup.app/terms';
const PRIVACY_URL = 'https://pullup.app/privacy';
const SERVICE_URL = 'https://pullup.app/supplemental-terms';

export default function Welcome() {
  const router = useRouter();
  const { signInWithOAuth } = useAuth();
  const [videoError, setVideoError] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);

  let [fontsLoaded] = useFonts({
    FredokaOne_400Regular,
  });

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    setOauthLoading(provider);
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) {
        Alert.alert('Sign In Error', error.message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      Alert.alert('Sign In Error', message);
    } finally {
      setOauthLoading(null);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {!videoError && (
        <Video
          source={require('@/assets/media/appgradient.mp4')}
          style={StyleSheet.absoluteFillObject}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
          onError={(error) => {
            console.warn('Video failed to load:', error);
            setVideoError(true);
          }}
        />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logoText}>PullUp</Text>
          <Text style={styles.subtitle}>
            Discover your best campus events to study, party and hang
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.termsText}>
            By tapping the button, you agree to the PullUp{' '}
            <Text
              style={styles.linkText}
              accessibilityRole="link"
              onPress={() => Linking.openURL(TERMS_URL)}
            >
              Terms
            </Text>{' '}
            and{' '}
            <Text
              style={styles.linkText}
              accessibilityRole="link"
              onPress={() => Linking.openURL(PRIVACY_URL)}
            >
              Privacy Policy
            </Text>{' '}
            and supplemental{' '}
            <Text
              style={styles.linkText}
              accessibilityRole="link"
              onPress={() => Linking.openURL(SERVICE_URL)}
            >
              Terms of Service
            </Text>
            .
          </Text>

          <View style={styles.buttonGroup}>
            {/* Continue with Email — frosted glass */}
            <TouchableOpacity
              style={styles.emailButton}
              activeOpacity={0.8}
              onPress={handleLogin}
            >
              <Text style={styles.emailButtonText}>Continue with Email</Text>
            </TouchableOpacity>

            {/* Continue with Google — semi-transparent white */}
            <TouchableOpacity
              style={[
                styles.oauthButton,
                oauthLoading !== null && styles.oauthButtonDisabled,
              ]}
              activeOpacity={0.8}
              onPress={() => handleOAuth('google')}
              disabled={oauthLoading !== null}
            >
              <Text style={styles.oauthButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Continue with Apple — semi-transparent white */}
            <TouchableOpacity
              style={[
                styles.oauthButton,
                oauthLoading !== null && styles.oauthButtonDisabled,
              ]}
              activeOpacity={0.8}
              onPress={() => handleOAuth('apple')}
              disabled={oauthLoading !== null}
            >
              <Text style={styles.oauthButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ink,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 120 : 80,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: 'FredokaOne_400Regular',
    fontSize: 80,
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  footer: {
    alignItems: 'center',
    width: '100%',
  },
  termsText: {
    fontSize: Typography.fontSize.micro,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 16,
    paddingHorizontal: Spacing.md,
  },
  linkText: {
    textDecorationLine: 'underline',
    fontWeight: Typography.fontWeight.bold,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  // "Continue with Email" — frosted glass style
  emailButton: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  emailButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: -0.3,
  },
  // Google / Apple — semi-transparent white with dark text
  oauthButton: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  oauthButtonDisabled: {
    opacity: 0.6,
  },
  oauthButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: -0.3,
  },
});
