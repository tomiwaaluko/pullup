import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/types';
import { Colors, Gradients, Typography, Spacing, Radius, Shadows, EventTypeColors } from '@/constants/theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={{ color: Colors.text, fontSize: Typography.fontSize.md }}>
          Failed to load profile.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.ink, Colors.charcoal, Colors.background]}
        style={styles.headerGradient}
      >
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={[...Gradients.brand]}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {(profile?.name || profile?.email || '?')[0].toUpperCase()}
            </Text>
          </LinearGradient>
          <Text style={styles.name}>{profile?.name || 'No name set'}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
          {profile?.school && (
            <View style={styles.schoolBadge}>
              <Text style={styles.schoolText}>{profile.school}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {profile?.preferences?.interests && profile.preferences.interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.chipRow}>
              {profile.preferences.interests.map((interest) => {
                const typeColor = EventTypeColors[interest] || EventTypeColors.other;
                return (
                  <View key={interest} style={[styles.chip, { backgroundColor: typeColor.bg }]}>
                    <View style={[styles.chipDot, { backgroundColor: typeColor.dot }]} />
                    <Text style={[styles.chipText, { color: typeColor.text }]}>{interest}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/org/register')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: Colors.primaryMuted }]}>
                <Text style={styles.menuEmoji}>🏢</Text>
              </View>
              <Text style={styles.menuItemText}>Register an Organization</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.7}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 72 : 52,
    paddingBottom: Spacing.xxxl,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.glow,
  },
  avatarText: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  name: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnDark,
    letterSpacing: -0.3,
  },
  email: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textOnDarkMuted,
    marginTop: Spacing.xxs,
  },
  schoolBadge: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  schoolText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textOnDarkMuted,
    fontWeight: Typography.fontWeight.medium,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    marginTop: -Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chipText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    textTransform: 'capitalize',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    ...Shadows.sm,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuEmoji: {
    fontSize: 18,
  },
  menuItemText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  menuArrow: {
    fontSize: 24,
    color: Colors.textMuted,
    fontWeight: Typography.fontWeight.medium,
  },
  signOutButton: {
    marginTop: 'auto',
    marginBottom: Spacing.xxxl + 32,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.errorMuted,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.15)',
  },
  signOutText: {
    fontSize: Typography.fontSize.md,
    color: Colors.error,
    fontWeight: Typography.fontWeight.semibold,
  },
});
