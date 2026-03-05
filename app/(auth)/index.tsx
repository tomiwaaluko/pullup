import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { useFonts, FredokaOne_400Regular } from '@expo-google-fonts/fredoka-one';
import { Video, ResizeMode } from 'expo-av';

export default function Welcome() {
  const router = useRouter();
  
  let [fontsLoaded] = useFonts({
    FredokaOne_400Regular,
  });

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  if (!fontsLoaded) {
    return null; // Or a simple view with the same background while loading
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Video
        source={require('@/assets/media/appgradient.mp4')}
        style={StyleSheet.absoluteFillObject}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />

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
            <Text style={styles.linkText}>Terms</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text> and supplemental{' '}
            <Text style={styles.linkText}>Terms of Service</Text>.
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.8}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fallback
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
    fontSize: 11,
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
  loginButton: {
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
  loginButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: -0.3,
  },
});
