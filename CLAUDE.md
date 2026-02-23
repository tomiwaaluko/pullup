# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

PullUp is a campus events mobile app for college students. Students discover and RSVP to events; student organizations create and manage events.

## Tech Stack

- **Mobile**: React Native + Expo (TypeScript)
- **Navigation**: Expo Router (file-based routing)
- **Data fetching**: React Query (`@tanstack/react-query`)
- **Backend/DB**: Supabase (PostgreSQL, PostgREST, Auth, Realtime, Storage)
- **Auth**: Supabase Auth (email, Google OAuth, Apple OAuth) — any email allowed, no .edu restriction in MVP
- **Calendar**: Add-to-calendar via ICS links + `Linking.openURL`
- **Testing**: Jest + React Native Testing Library
- **Error tracking**: Sentry
- **Builds**: EAS Build for iOS/Android

## Build & Dev Commands

```bash
npx expo start            # Dev server
npx expo start --ios      # iOS simulator
npx expo start --android  # Android emulator
npm test                  # Run Jest tests (21 tests across 7 suites)
npm run test:watch        # Jest watch mode
npm run test:coverage     # Jest with coverage
npm run lint              # ESLint
npm run format            # Prettier
```

## Implementation Order

Follow the guides in `docs/implementation/` sequentially. Each doc has tasks, file structure, and success criteria:

1. `01-project-setup.md` — Scaffold Expo app, install deps, design tokens, Jest, Sentry
2. `02-database-schema.md` — Supabase schema, migrations, RLS policies
3. `03-authentication.md` — Supabase Auth, sign-in/up screens, session management
4. `04-member-experience.md` — Onboarding, home feed, event detail, RSVP, profile
5. `05-organization-experience.md` — Org registration, dashboard, event creation
6. `06-design-testing-operations.md` — UI polish, testing, analytics

Start with `00-overview.md` for the full architecture summary.

## Architecture

```
Mobile App (Expo) → Supabase (Auth, PostgREST, Realtime, Storage) → PostgreSQL
Mobile App → Calendar App (via Linking)
Mobile App → Expo Push Notifications (Phase 2)
```

**Two user roles**: Members (browse/RSVP events) and Organizations (create/manage events). Any authenticated user can register an org. Users switch between member view and org dashboard.

**Security model**: Row-Level Security (RLS) enforced at the database layer, not the application layer. Events with `status = 'published'` are publicly readable; drafts visible only to the creator. RSVPs, saved events, and org follows are scoped to the owning user.

## Routing Structure (Expo Router)

```
app/
├── (auth)/          # Sign in, sign up (unauthenticated)
├── (onboard)/       # Member onboarding (welcome, interests, notifications)
├── (tabs)/          # Main member app — Home, My RSVPs, Profile
├── (org)/           # Org dashboard — Overview, Events, Profile, Create Event
├── org/             # Org registration flow
└── events/[id].tsx  # Event detail page
```

Root layout (`app/_layout.tsx`) handles session check: no session → auth routes; session → onboarding or tabs.

## Database Tables

Core tables: `profiles` (extends auth.users), `organizations`, `events`, `rsvps`, `saved_events`, `org_follows`. Migrations go in `supabase/migrations/`. See `docs/implementation/02-database-schema.md` for full schema and RLS policies.

Key enums: `event_type` (academic, sports, social, career, club, greek, other), `event_status` (draft, published).

## Key Conventions

- Design tokens live in `constants/theme.ts` (colors, typography, spacing, border radius)
- Custom hooks in `hooks/` (`useEvents`, `useRSVP`, `useSavedEvents`, `useOrgFollows`, `useOrganizations`)
- Supabase client config in `lib/supabase.ts`; calendar utils in `lib/calendar.ts`
- Auth context in `lib/auth-context.tsx`; org switcher context in `lib/org-context.tsx`
- Analytics tracking in `lib/analytics.ts`; CSV export in `lib/export-csv.ts`
- TypeScript types in `lib/types.ts`
- Reusable UI components in `components/` (Button, Card, Input, Chip, EventCard, EventFilters, AddToCalendar, Loading, EmptyState)
- Environment variables prefixed with `EXPO_PUBLIC_` (Supabase URL and anon key)
- Tests in `__tests__/` directory, mirroring source structure
