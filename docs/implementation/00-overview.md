# PullUp — Implementation Overview

Campus events mobile app for college students. React Native + Expo, React Query, Expo Router, Supabase.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | React Native + Expo (TypeScript) |
| Navigation | Expo Router |
| Data Fetching | React Query |
| Backend | Supabase (PostgREST + Edge Functions) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (any email) |
| Hosting | EAS Build + App Store / Play Store |
| Calendar | Add-to-calendar links (ICS) |

## Architecture

```
Mobile App (Expo) → Supabase (Auth, PostgREST, Realtime, Storage) → PostgreSQL
Mobile App → Calendar App (via Linking)
Mobile App → Expo Push (Phase 2)
```

## Implementation Order

Execute in this order. Each doc has implementation details.

1. **[01-project-setup.md](01-project-setup.md)** — Scaffold, dependencies, design tokens, Jest, Sentry
2. **[02-database-schema.md](02-database-schema.md)** — Supabase project, schema, migrations, RLS
3. **[03-authentication.md](03-authentication.md)** — Supabase Auth, protected routes
4. **[04-member-experience.md](04-member-experience.md)** — Onboarding, home, event list, RSVP, profile
5. **[05-organization-experience.md](05-organization-experience.md)** — Org onboarding, org dashboard
6. **[06-design-testing-operations.md](06-design-testing-operations.md)** — UI polish, testing, analytics, error tracking

## Key File Structure

```
pullup/
├── app/
│   ├── (auth)/              # Sign in, sign up
│   ├── (onboard)/           # Member onboarding
│   ├── (tabs)/              # Home, My RSVPs, Profile
│   ├── (org)/               # Org dashboard
│   ├── org/                 # Org registration
│   └── events/[id].tsx      # Event detail
├── components/
├── lib/                     # supabase.ts, calendar.ts
├── hooks/
├── constants/               # Design tokens
├── supabase/migrations/
└── __tests__/
```

## Accessibility

All screens should have proper `accessibilityLabel` props on interactive elements (buttons, inputs, links, etc.). Use `accessibilityRole` and `accessibilityHint` where appropriate to ensure screen reader compatibility. Test with VoiceOver (iOS) and TalkBack (Android) during development.

## Related Docs

- [roadmap.md](../../roadmap.md) — Phased feature roadmap (Phases 2–5)
