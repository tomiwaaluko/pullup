# 05 — Organization Experience

Org onboarding and org dashboard.

## Organization Onboarding

| Step | Content | Purpose |
|------|---------|---------|
| Entry | "Register your organization" + benefits | Value prop |
| Org details | Name, description, category, contact email | Core profile |
| Confirmation | "You're all set" + Create first event CTA | Guide next step |

### Org Details Form

- Organization name (required) — trim whitespace before submission
- Description (required)
- Category (dropdown: Academic, Sports, Social, Club, Career, Greek, Other)
- Contact email (required) — validate email format before submission

**Slug generation:** The slug is auto-generated from the org name. Handle edge cases: strip leading/trailing whitespace, replace special characters, collapse consecutive hyphens, and reject empty or malformed slugs (e.g., a name that is only whitespace or symbols). If the generated slug collides with an existing one, append a short numeric suffix.

Verification: open registration for MVP. Add admin approval in Phase 2 if needed.

### Access

- Any signed-in user can register an org
- Org creator is owner; can manage org
- User switches between member view and org view (profile or nav)

**Files:** `app/org/register.tsx`, `org/success.tsx`

## Organization Dashboard

### Screens

| Screen | Content |
|--------|---------|
| Overview | Summary cards (upcoming events, total RSVPs), Create event CTA, recent events |
| Events | Full event list with edit, RSVP counts |
| Event detail (org view) | Edit event, view RSVPs |
| Profile | Edit org name, description, category, contact |

### Org Features (MVP)

- **Org switcher** — User manages multiple orgs; switch in header
- **Event drafts** — Save without publishing (status = draft)
- **Duplicate event** — Copy event to create similar
- **RSVP export** — Export RSVP list as CSV
- **Event preview** — See event as member would
- **Org contact link** — Contact button on events
- **Empty states** — Helpful prompts when no events

### Create Event Form

- Title, description, start_time, end_time, location
- Type (dropdown)
- Status: draft or published
- Capacity (optional)

### RLS

- Org creator/owner can create, update, delete org and its events
- Phase 2: org_members table for team/roles

## File Structure

```
app/
├── (org)/
│   ├── _layout.tsx     # Org layout (tabs or stack)
│   ├── index.tsx       # Overview
│   ├── events.tsx      # Events list
│   ├── profile.tsx     # Org profile
│   └── events/
│       └── new.tsx     # Create event
├── org/
│   ├── register.tsx    # Org registration flow
│   └── success.tsx     # Confirmation
```

## Success Criteria

- Org registration flow completes
- Org dashboard shows overview and events
- Create event works (draft and published)
- Edit event, duplicate event work
- RSVP export works
- Org switcher works for users with multiple orgs
