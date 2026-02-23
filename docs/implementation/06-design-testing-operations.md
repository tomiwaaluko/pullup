# 06 — Design, Testing, Operations

UI polish, wireframes, testing, analytics, error tracking.

## Design System

### Tokens

- **Colors** — Primary, secondary, background, surface, text, textMuted, error, success
- **Typography** — Font family, sizes (xs, sm, md, lg, xl), weights
- **Spacing** — 4, 8, 12, 16, 24, 32
- **Radius** — 4, 8, 12, 16, full

Extend for dark mode later.

### Components

- Button (primary, secondary, ghost)
- Card
- Input, TextArea
- Chip (filter tags)
- EventCard
- Loading states, empty states

### Wireframes

Create low-fi or high-fi wireframes for:

- Member: onboarding, home, event detail, profile
- Org: org onboarding, dashboard, create event

Use before or in parallel with implementation.

## Testing

### Unit Tests (Jest + React Native Testing Library)

- Hooks: `useEvents`, `useRSVP`, `useSavedEvents`, `useOrgFollows`
- Utils: `lib/calendar.ts` (ICS generation)
- Key components: EventCard, EventFilters, AddToCalendar

### E2E (Detox or Maestro)

- Sign up → onboarding → home
- RSVP flow
- Create event (org)

### Coverage

- Core flows covered
- Add tests as features ship

## Error Tracking (Sentry)

- JS errors, unhandled rejections, native crashes
- Source maps for readable stack traces
- Set up during scaffold; verify in production build

## Analytics

### Events to Track

**Member:**

- `sign_up`, `sign_in`
- `event_view`, `rsvp`, `event_share`, `add_to_calendar`
- `saved_event`, `org_follow`

**Org:**

- `org_register`
- `event_create`, `event_publish`, `event_edit`
- `rsvp_export`

### Tool

- Supabase Analytics, PostHog, or Mixpanel
- Respect opt-out; document in privacy policy

## Success Criteria

- Design tokens used consistently
- Unit tests pass; E2E covers critical paths
- Sentry captures errors in production
- Analytics events fire for key actions
