# 02 — Database Schema

Supabase PostgreSQL schema, migrations, and RLS.

## Data Model

### Profiles (extends auth.users)

- `id` (uuid, references auth.users)
- `email`, `name`, `created_at`, `updated_at`
- `preferences` (jsonb, e.g. interests array)

### Organizations

- `id` (uuid, pk)
- `name`, `slug` (unique), `description`, `category`, `contact_email`
- `created_by` (uuid, references auth.users)
- `created_at`, `updated_at`

### Events

- `id` (uuid, pk)
- `title`, `description`, `start_time`, `end_time`, `location`
- `type` (enum: academic, sports, social, career, club, greek, other)
- `org_id` (references organizations)
- `created_by` (uuid, references auth.users)
- `status` (enum: draft, published)
- `capacity` (int, optional)
- `created_at`, `updated_at`

### RSVPs

- `user_id` (uuid, references auth.users)
- `event_id` (uuid, references events)
- `created_at`
- Primary key: (user_id, event_id)

### Saved Events (bookmarks)

- `user_id` (uuid, references auth.users)
- `event_id` (uuid, references events)
- `created_at`
- Primary key: (user_id, event_id)

### Org Follows

- `user_id` (uuid, references auth.users)
- `org_id` (uuid, references organizations)
- `created_at`
- Primary key: (user_id, org_id)

## Enums

```sql
CREATE TYPE event_type AS ENUM ('academic', 'sports', 'social', 'career', 'club', 'greek', 'other');
CREATE TYPE event_status AS ENUM ('draft', 'published');
```

## Migrations

Create migrations in `supabase/migrations/`:

1. `001_initial_schema.sql` — profiles, organizations, events, rsvps, saved_events, org_follows
2. Enable RLS on all tables
3. Add RLS policies (see below)

## RLS Policies

### Profiles

- Select: own row
- Update: own row
- Insert: own row (via trigger on auth.users signup)

### Organizations

- Select: all (public)
- Insert: authenticated
- Update/delete: created_by = auth.uid()

### Events

- Select: status = 'published' OR created_by = auth.uid()
- Insert: authenticated
- Update/delete: created_by = auth.uid() OR org admin

### RSVPs, Saved Events, Org Follows

- Select: own rows (user_id = auth.uid())
- Insert/delete: user_id = auth.uid()

## Triggers

- On auth.users insert → create profile row
- Organizations: auto-generate slug from name (or manual)

## Success Criteria

- Migrations run without error
- RLS prevents unauthorized access
- PostgREST returns expected data for authenticated requests
