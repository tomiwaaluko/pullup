# 04 — Member Experience

Onboarding, main dashboard, event list, event detail, RSVP, profile.

## Member Onboarding

| Screen | Content | Actions |
|--------|---------|---------|
| Welcome | Value prop, headline | Continue |
| Interests (optional) | Tag grid (Academic, Sports, Social, etc.) | Continue / Skip |
| Notifications | Enable prompt | Enable / Maybe later |
| → App | Event feed | — |

Store interests in `profiles.preferences`. Request Expo push permission on "Enable".

**File structure:** `app/(onboard)/welcome.tsx`, `interests.tsx`, `notifications.tsx`

## Member Main Page / Dashboard

### Sections

- Header (branding, search entry)
- Search bar (text search)
- Filter chips (type: Academic, Sports, Social, etc.; time: Today, This week)
- Event list (scrollable cards)
- Tab bar: Home | My RSVPs | Profile

### Event Card

- Title, date/time, location, type tag, RSVP indicator
- Tap → event detail

### Behaviors

- Pull-to-refresh
- Infinite scroll or pagination
- Empty state, loading state

## Member Features (MVP)

- **Profile screen** — Name, photo, preferences, notification settings
- **Event share** — Share link
- **Saved/bookmarked events** — Save without RSVP (saved_events table)
- **Past events** — Events user RSVP'd to that have passed
- **Event location map link** — Tap to open maps app (Linking.openURL)
- **Org following** — Follow orgs (org_follows table)

## Event Detail

- Title, description, date/time, location
- RSVP button (toggle)
- Add to Calendar (Google, Apple, Outlook, ICS)
- Share button
- Map link
- Org name/link

## My RSVPs Tab

- List of events user has RSVP'd to
- Upcoming first
- Option to include past RSVPs

## Calendar Integration

- Generate add-to-calendar links (Google, Apple, Outlook, ICS)
- Use `Linking.openURL` with calendar URL or ICS data
- Include: title, start_time, end_time, location, description

## Hooks

- `useEvents` — Fetch events with filters, pagination
- `useRSVP` — Toggle RSVP, list user's RSVPs
- `useSavedEvents` — Save/unsave events
- `useOrgFollows` — Follow/unfollow orgs

## Cross-Cutting (Member)

- Settings (account, notifications, privacy, logout)
- Help/FAQ
- Feedback/support
- App version in profile or settings

## File Structure

```
app/
├── (onboard)/
├── (tabs)/
│   ├── index.tsx    # Home
│   ├── rsvps.tsx    # My RSVPs
│   └── profile.tsx
├── events/[id].tsx
```

## Success Criteria

- Onboarding completes and routes to home
- Event list loads with filters and search
- RSVP toggle works
- Add to Calendar works
- Profile, saved events, org follow work
