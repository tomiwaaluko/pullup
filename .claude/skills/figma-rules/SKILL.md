## Figma MCP Integration Rules

When implementing Figma designs for this project:
- Framework: React Native + Expo (TypeScript)
- Navigation: Expo Router file-based routing
- Styling: StyleSheet.create() using tokens from constants/theme.ts
- Data fetching: React Query (@tanstack/react-query)
- Use existing components from components/ where possible (Button, Card, Input, Chip, EventCard)
- Map Figma color tokens to theme.ts color values
- All screens go in the appropriate app/ directory per Expo Router conventions