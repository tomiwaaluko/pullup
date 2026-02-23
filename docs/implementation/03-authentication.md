# 03 — Authentication

Supabase Auth setup. Any email allowed (no .edu restriction).

## Tasks

1. Configure Supabase Auth providers (Email, Google, Apple)
2. Create sign-in / sign-up screens
3. Session management and protected routes
4. Redirect flow: unauthenticated → auth; authenticated → app

## Auth Providers

- **Email (magic link or password)** — Supabase default
- **Google OAuth** — Configure in Supabase dashboard
- **Apple OAuth** — Configure for iOS

## Screens

### Sign In

- Email input
- "Sign in with magic link" or "Sign in with password"
- "Sign in with Google" / "Sign in with Apple"
- Link to Sign up

### Sign Up

- Email, name (optional), password (if not magic link)
- "Create account"
- Link to Sign in

## Session Handling

- Use Supabase `onAuthStateChange` to sync session
- Store session in context or state
- Redirect logic in root layout:
  - No session + not on auth route → redirect to sign-in
  - Session + on auth route → redirect to app (tabs or onboarding)

## Protected Routes

- `(tabs)/`, `(org)/`, `events/[id]` require auth (or allow read for events)
- Events: public read for published events; RSVP requires auth
- Org dashboard: require auth + org membership/ownership

## Profile Creation

- On first sign-in, create or upsert profile row (trigger or client)
- Sync `email`, `name` from auth.users

## File Structure

```
app/
├── (auth)/
│   ├── _layout.tsx      # Auth layout (stack, no tabs)
│   ├── sign-in.tsx
│   └── sign-up.tsx
└── _layout.tsx          # Session check, redirect
```

## Success Criteria

- Sign up and sign in work
- Session persists across app restarts
- Unauthenticated users redirected to sign-in
- Authenticated users reach app (or onboarding if first time)
