export type EventType = 'academic' | 'sports' | 'social' | 'career' | 'club' | 'greek' | 'other';
export type EventStatus = 'draft' | 'published';

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  preferences: { interests: EventType[] };
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: EventType;
  contact_email: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string;
  type: EventType;
  org_id: string;
  created_by: string;
  status: EventStatus;
  capacity: number | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  organization?: Organization;
}

export interface RSVP {
  user_id: string;
  event_id: string;
  created_at: string;
}

export interface SavedEvent {
  user_id: string;
  event_id: string;
  created_at: string;
}

export interface OrgFollow {
  user_id: string;
  org_id: string;
  created_at: string;
}
