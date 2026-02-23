import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/types';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

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
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(profile?.name || profile?.email || '?')[0].toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.name || 'No name set'}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
      </View>

      {profile?.preferences?.interests && profile.preferences.interests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.chipRow}>
            {profile.preferences.interests.map((interest) => (
              <View key={interest} style={styles.chip}>
                <Text style={styles.chipText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/org/register')}
        >
          <Text style={styles.menuItemText}>Register an Organization</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  name: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  email: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    backgroundColor: `${Colors.primaryLight}20`,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  chipText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    textTransform: 'capitalize',
  },
  menuItem: {
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text,
  },
  signOutButton: {
    marginTop: 'auto',
    marginBottom: Spacing.xxl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: Typography.fontSize.md,
    color: Colors.error,
    fontWeight: Typography.fontWeight.medium,
  },
});
