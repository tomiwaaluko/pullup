type AnalyticsEvent =
  // Member events
  | 'sign_up'
  | 'sign_in'
  | 'event_view'
  | 'rsvp'
  | 'event_share'
  | 'add_to_calendar'
  | 'saved_event'
  | 'org_follow'
  // Org events
  | 'org_register'
  | 'event_create'
  | 'event_publish'
  | 'event_edit'
  | 'rsvp_export';

interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined;
}

export function track(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
  // TODO: Replace with PostHog, Mixpanel, or Supabase Analytics
  if (__DEV__) {
    console.log(`[Analytics] ${event}`, properties ?? '');
  }
}
