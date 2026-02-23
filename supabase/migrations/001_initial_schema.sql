-- PullUp Initial Schema
-- Tables: profiles, organizations, events, rsvps, saved_events, org_follows

-- Enums
CREATE TYPE event_type AS ENUM ('academic', 'sports', 'social', 'career', 'club', 'greek', 'other');
CREATE TYPE event_status AS ENUM ('draft', 'published');

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  preferences jsonb DEFAULT '{"interests": []}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Organizations
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  category event_type NOT NULL DEFAULT 'other',
  contact_email text NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Events
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location text NOT NULL,
  type event_type NOT NULL DEFAULT 'other',
  org_id uuid NOT NULL REFERENCES organizations ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  status event_status NOT NULL DEFAULT 'draft',
  capacity int,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- RSVPs
CREATE TABLE rsvps (
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES events ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, event_id)
);

-- Saved Events (bookmarks)
CREATE TABLE saved_events (
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES events ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, event_id)
);

-- Org Follows
CREATE TABLE org_follows (
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES organizations ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, org_id)
);

-- Indexes
CREATE INDEX idx_events_org_id ON events(org_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX idx_org_follows_org_id ON org_follows(org_id);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Slug generation helper
CREATE OR REPLACE FUNCTION generate_slug(input text)
RETURNS text AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(trim(input), '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- =====================
-- Row-Level Security
-- =====================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_follows ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read and update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Organizations: public read, authenticated create, owner edit/delete
CREATE POLICY "Organizations are publicly readable"
  ON organizations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create organizations"
  ON organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Org creators can update their organizations"
  ON organizations FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Org creators can delete their organizations"
  ON organizations FOR DELETE
  USING (auth.uid() = created_by);

-- Events: published events are public, drafts visible to creator only
CREATE POLICY "Published events are publicly readable"
  ON events FOR SELECT
  USING (status = 'published' OR auth.uid() = created_by);

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Event creators can update their events"
  ON events FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Event creators can delete their events"
  ON events FOR DELETE
  USING (auth.uid() = created_by);

-- RSVPs: users manage their own
CREATE POLICY "Users can view own RSVPs"
  ON rsvps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own RSVPs"
  ON rsvps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own RSVPs"
  ON rsvps FOR DELETE
  USING (auth.uid() = user_id);

-- Allow event creators to view RSVPs for their events
CREATE POLICY "Event creators can view RSVPs for their events"
  ON rsvps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = rsvps.event_id
      AND events.created_by = auth.uid()
    )
  );

-- Saved Events: users manage their own
CREATE POLICY "Users can view own saved events"
  ON saved_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save events"
  ON saved_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave events"
  ON saved_events FOR DELETE
  USING (auth.uid() = user_id);

-- Org Follows: users manage their own
CREATE POLICY "Users can view own org follows"
  ON org_follows FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can follow orgs"
  ON org_follows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unfollow orgs"
  ON org_follows FOR DELETE
  USING (auth.uid() = user_id);
