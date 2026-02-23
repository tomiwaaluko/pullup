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
import { useLocalSearchParams } from 'expo-router';
import { useEvent } from '@/hooks/useEvents';
import { useIsRSVPd, useToggleRSVP } from '@/hooks/useRSVP';
import { useIsSaved, useToggleSavedEvent } from '@/hooks/useSavedEvents';
import { useIsFollowingOrg, useToggleOrgFollow } from '@/hooks/useOrgFollows';
import AddToCalendar from '@/components/AddToCalendar';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: event, isLoading } = useEvent(id);
  const { data: isRSVPd } = useIsRSVPd(id);
  const { data: isSaved } = useIsSaved(id);
  const { data: isFollowing } = useIsFollowingOrg(event?.org_id ?? '');
  const toggleRSVP = useToggleRSVP();
  const toggleSave = useToggleSavedEvent();
  const toggleFollow = useToggleOrgFollow();

  if (isLoading || !event) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const handleRSVP = () => {
    toggleRSVP.mutate({ eventId: event.id, isRSVPd: !!isRSVPd });
  };

  const handleSave = () => {
    toggleSave.mutate({ eventId: event.id, isSaved: !!isSaved });
  };

  const handleFollowOrg = () => {
    if (event.org_id) {
      toggleFollow.mutate({ orgId: event.org_id, isFollowing: !!isFollowing });
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out "${event.title}" on PullUp!` });
    } catch {
      // User cancelled
    }
  };

  const handleOpenMap = () => {
    const encoded = encodeURIComponent(event.location);
    Linking.openURL(`https://maps.google.com/?q=${encoded}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.typeTag}>
        <Text style={styles.typeText}>{event.type}</Text>
      </View>

      <Text style={styles.title}>{event.title}</Text>

      <View style={styles.detailRow}>
        <Text style={styles.label}>When</Text>
        <Text style={styles.value}>{formatDateTime(event.start_time)}</Text>
        <Text style={styles.value}>to {formatDateTime(event.end_time)}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Where</Text>
        <TouchableOpacity onPress={handleOpenMap}>
          <Text style={[styles.value, styles.link]}>{event.location}</Text>
        </TouchableOpacity>
      </View>

      {event.capacity && (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Capacity</Text>
          <Text style={styles.value}>{event.capacity} spots</Text>
        </View>
      )}

      {event.description && (
        <View style={styles.detailRow}>
          <Text style={styles.label}>About</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
      )}

      {event.organization && (
        <View style={styles.orgSection}>
          <Text style={styles.label}>Hosted by</Text>
          <View style={styles.orgRow}>
            <Text style={styles.orgName}>{event.organization.name}</Text>
            <TouchableOpacity style={styles.followButton} onPress={handleFollowOrg}>
              <Text style={styles.followButtonText}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.rsvpButton, isRSVPd && styles.rsvpButtonActive]}
          onPress={handleRSVP}
          disabled={toggleRSVP.isPending}
        >
          <Text style={[styles.rsvpButtonText, isRSVPd && styles.rsvpButtonTextActive]}>
            {isRSVPd ? "RSVP'd" : 'RSVP'}
          </Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.iconButton} onPress={handleSave}>
            <Text style={styles.iconButtonText}>{isSaved ? 'Saved' : 'Save'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Text style={styles.iconButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AddToCalendar event={event} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeTag: {
    backgroundColor: Colors.primaryLight + '20',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  typeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  detailRow: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: Typography.fontSize.md,
    color: Colors.text,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  description: {
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    lineHeight: 24,
  },
  orgSection: {
    marginBottom: Spacing.xl,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orgName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  followButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  followButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  actions: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  rsvpButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  rsvpButtonActive: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  rsvpButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  rsvpButtonTextActive: {
    color: Colors.primary,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  iconButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
});
