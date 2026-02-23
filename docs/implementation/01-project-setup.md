# 01 — Project Setup

Scaffold the Expo app and install dependencies.

## Tasks

1. Create Expo app with TypeScript template
2. Add Expo Router
3. Add React Query
4. Add Supabase client
5. Configure ESLint, Prettier
6. Set up environment config
7. Add design tokens (constants)
8. Add Jest + React Native Testing Library
9. Add Sentry

## Commands

```bash
npx create-expo-app@latest pullup --template tabs
cd pullup
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
npm install @tanstack/react-query @supabase/supabase-js
npm install -D @testing-library/react-native jest jest-expo
# Sentry: follow https://docs.sentry.io/platforms/react-native/
```

## Environment Variables

Create `.env` (and `.env.example` for repo):

```
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx
```

Use `expo-constants` or `react-native-dotenv` to read these.

## Constants (Design Tokens)

Create `constants/theme.ts`:

- Colors (primary, secondary, background, text, etc.)
- Typography (font sizes, weights)
- Spacing (4, 8, 12, 16, 24, 32)
- Border radius (4, 8, 12, 16)

Extend later for dark mode.

## Jest Config

- Configure `jest.config.js` for React Native
- Add `__tests__/` directory
- Add npm script: `"test": "jest"`

## Sentry

- Install `@sentry/react-native`
- Initialize in app entry (e.g. `app/_layout.tsx`)
- Configure DSN and source maps for EAS Build

## App Structure (Initial)

- `app/_layout.tsx` — Root layout with QueryClientProvider, AuthProvider (or Supabase session provider)
- `app/(auth)/_layout.tsx` — Auth group
- `app/(tabs)/_layout.tsx` — Tab group (Home, My RSVPs, Profile)
- Configure Expo Router for file-based routing

## Success Criteria

- App runs on simulator/device
- Supabase client connects (log or simple query)
- Jest runs and passes a smoke test
- Sentry initializes without error
