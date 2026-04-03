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
  Platform,
} from 'react-native';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEvent } from '@/hooks/useEvents';
import { useIsRSVPd, useToggleRSVP } from '@/hooks/useRSVP';
import { useIsSaved, useToggleSavedEvent } from '@/hooks/useSavedEvents';
import { useIsFollowingOrg, useToggleOrgFollow } from '@/hooks/useOrgFollows';
import AddToCalendar from '@/components/AddToCalendar';
import Button from '@/components/Button';
import { Colors, Gradients, Typography, Spacing, Radius, Shadows, EventTypeColors } from '@/constants/theme';
import { track } from '@/lib/analytics';

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

  useEffect(() => {
    if (event?.id) {
      track('event_view', { event_id: event.id, org_id: event.org_id });
    }
  }, [event?.id]);

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
    if (event.org_id) toggleFollow.mutate({ orgId: event.org_id, isFollowing: !!isFollowing });
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out "${event.title}" on PullUp!` });
      track('event_share', { event_id: event.id });
    } catch {}
  };

  const handleOpenMap = async () => {
    try {
      const encoded = encodeURIComponent(event.location);
      await Linking.openURL(`https://maps.google.com/?q=${encoded}`);
    } catch { Alert.alert('Error', 'Could not open maps.'); }
  };

  const typeColors = EventTypeColors[event.type] || EventTypeColors.other;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[...Gradients.brand]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroImage}
        >
          <Text style={styles.heroLetter}>{event.title.charAt(0)}</Text>
          <LinearGradient
            colors={['transparent', 'rgba(11,11,20,0.6)']}
            style={styles.heroOverlay}
          />
        </LinearGradient>

        <View style={styles.contentCard}>
          <View style={styles.header}>
            <View style={[styles.typeChip, { backgroundColor: typeColors.bg }]}>
              <View style={[styles.typeDot, { backgroundColor: typeColors.dot }]} />
              <Text style={[styles.typeText, { color: typeColors.text }]}>{event.type}</Text>
            </View>
            <View style={styles.secondaryActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={handleSave} disabled={toggleSave.isPending}>
                <Text style={styles.actionBtnIcon}>{isSaved ? '★' : '☆'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                <Text style={styles.actionBtnIcon}>↗</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconCircle, { backgroundColor: Colors.primaryMuted }]}>
                <Text style={styles.infoIcon}>📅</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>When</Text>
                <Text style={styles.infoValue}>{formatDateTime(event.start_time)}</Text>
                <Text style={styles.infoValueSub}>to {formatDateTime(event.end_time)}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIconCircle, { backgroundColor: Colors.secondaryMuted }]}>
                <Text style={styles.infoIcon}>📍</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Where</Text>
                <TouchableOpacity onPress={handleOpenMap}>
                  <Text style={[styles.infoValue, styles.linkText]}>{event.location}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {event.capacity && (
              <>
                <View style={styles.infoDivider} />
                <View style={styles.infoRow}>
                  <View style={[styles.infoIconCircle, { backgroundColor: Colors.accentMuted }]}>
                    <Text style={styles.infoIcon}>👥</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Capacity</Text>
                    <Text style={styles.infoValue}>{event.capacity} spots available</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {event.description && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>About</Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>
          )}

          {event.organization && (
            <View style={styles.orgCard}>
              <Text style={styles.sectionLabel}>Hosted by</Text>
              <View style={styles.orgRow}>
                <LinearGradient
                  colors={[...Gradients.warmSunset]}
                  style={styles.orgAvatar}
                >
                  <Text style={styles.orgAvatarText}>{event.organization.name.charAt(0)}</Text>
                </LinearGradient>
                <View style={styles.orgInfo}>
                  <Text style={styles.orgName}>{event.organization.name}</Text>
                  <TouchableOpacity onPress={handleFollowOrg} disabled={toggleFollow.isPending}>
                    <Text style={[styles.followBtn, isFollowing && styles.followBtnActive]}>
                      {isFollowing ? 'Following' : '+ Follow'}
                    </Text>
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
          title={isRSVPd ? "You're Going!" : "RSVP Now"}
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
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroLetter: {
    fontSize: 120,
    color: Colors.white,
    opacity: 0.15,
    fontWeight: Typography.fontWeight.black,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  contentCard: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    marginTop: -32,
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
    minHeight: 500,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
  },
  typeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  typeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.black,
    color: Colors.text,
    marginBottom: Spacing.xl,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  infoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIcon: {
    fontSize: 18,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xxs,
  },
  infoValue: {
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: 22,
  },
  infoValueSub: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xxs,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  linkText: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    lineHeight: 26,
  },
  orgCard: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  orgAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgAvatarText: {
    color: Colors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  orgInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: 2,
  },
  followBtn: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  followBtnActive: {
    color: Colors.textMuted,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    backgroundColor: Colors.white,
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  actionBtnIcon: {
    fontSize: 18,
    color: Colors.primary,
  },
  floatingAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  rsvpBtn: {
    width: '100%',
  },
});
