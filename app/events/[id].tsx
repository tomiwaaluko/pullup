import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  Linking,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEvent } from '@/hooks/useEvents';
import { useIsRSVPd, useToggleRSVP } from '@/hooks/useRSVP';
import { useIsSaved, useToggleSavedEvent } from '@/hooks/useSavedEvents';
import { useIsFollowingOrg, useToggleOrgFollow } from '@/hooks/useOrgFollows';
import AddToCalendar from '@/components/AddToCalendar';
import Button from '@/components/Button';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/theme';

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
    year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: event, isLoading, isError } = useEvent(id);
  const { data: isRSVPd } = useIsRSVPd(id);
  const { data: isSaved } = useIsSaved(id);
  const { data: isFollowing } = useIsFollowingOrg(event?.org_id || undefined);
  const toggleRSVP = useToggleRSVP();
  const toggleSave = useToggleSavedEvent();
  const toggleFollow = useToggleOrgFollow();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isError || !event) {
    return (
      <View style={styles.center}>
        <Text style={{ color: Colors.text, fontSize: Typography.fontSize.md }}>
          {isError ? 'Failed to load event.' : 'Event not found.'}
        </Text>
      </View>
    );
  }

  const handleRSVP = () => toggleRSVP.mutate({ eventId: event.id, isRSVPd: !!isRSVPd });
  const handleSave = () => toggleSave.mutate({ eventId: event.id, isSaved: !!isSaved });
  const handleFollowOrg = () => {
    if (event.org_id) {
      toggleFollow.mutate({ orgId: event.org_id, isFollowing: !!isFollowing });
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out "${event.title}" on PullUp!` });
    } catch {}
  };

  const handleOpenMap = async () => {
    try {
      const encoded = encodeURIComponent(event.location);
      await Linking.openURL(`https://maps.google.com/?q=${encoded}`);
    } catch {
      Alert.alert('Error', 'Could not open maps.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroImage}>
          <Text style={styles.heroTextPlaceholder}>{event.title.charAt(0)}</Text>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.header}>
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>{event.type}</Text>
            </View>
            <View style={styles.secondaryActions}>
              <TouchableOpacity style={styles.iconButton} onPress={handleSave} disabled={toggleSave.isPending}>
                <Text style={styles.iconButtonText}>{isSaved ? '⭐️' : '☆'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                <Text style={styles.iconButtonText}>↗️</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.infoCard}>
            <Text style={styles.label}>📅 When</Text>
            <Text style={styles.value}>{formatDateTime(event.start_time)}</Text>
            <Text style={styles.value}>to {formatDateTime(event.end_time)}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.label}>📍 Where</Text>
            <TouchableOpacity onPress={handleOpenMap}>
              <Text style={[styles.value, styles.link]}>{event.location}</Text>
            </TouchableOpacity>
          </View>

          {event.capacity && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>👥 Capacity</Text>
              <Text style={styles.value}>{event.capacity} spots available</Text>
            </View>
          )}

          {event.description && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>📝 About</Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>
          )}

          {event.organization && (
            <View style={styles.orgSection}>
              <Text style={styles.label}>🏢 Hosted by</Text>
              <View style={styles.orgRow}>
                <View style={styles.orgAvatar} />
                <View style={styles.orgInfo}>
                  <Text style={styles.orgName}>{event.organization.name}</Text>
                  <TouchableOpacity onPress={handleFollowOrg} disabled={toggleFollow.isPending}>
                    <Text style={styles.followButtonText}>{isFollowing ? 'Following' : '+ Follow'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <AddToCalendar event={event} />
        </View>
      </ScrollView>

      <View style={styles.floatingAction}>
        <Button
          title={isRSVPd ? "You're Going! 🎉" : "RSVP Now"}
          onPress={handleRSVP}
          variant={isRSVPd ? "secondary" : "primary"}
          loading={toggleRSVP.isPending}
          style={styles.rsvpBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    height: 300,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextPlaceholder: {
    fontSize: 100,
    color: Colors.white,
    opacity: 0.3,
    fontWeight: 'bold',
  },
  contentCard: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    marginTop: -40,
    padding: Spacing.xl,
    minHeight: 500,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  typeTag: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  typeText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
    marginBottom: Spacing.xl,
    lineHeight: 38,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  detailRow: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: Typography.fontSize.md,
    color: Colors.textMuted,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: 24,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  description: {
    fontSize: Typography.fontSize.md,
    color: Colors.textMuted,
    lineHeight: 26,
  },
  orgSection: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orgAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondary,
    marginRight: Spacing.md,
  },
  orgInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  followButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    backgroundColor: Colors.white,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconButtonText: {
    fontSize: 18,
  },
  floatingAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xl,
    paddingBottom: 40,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  rsvpBtn: {
    width: '100%',
  },
});
