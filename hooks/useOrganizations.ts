import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Organization, Event } from '@/lib/types';

export function useMyOrganizations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['myOrganizations', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('created_by', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Organization[];
    },
    enabled: !!user,
  });
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ['organization', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Organization;
    },
    enabled: !!id,
  });
}

export function useCreateOrganization() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (org: {
      name: string;
      description: string;
      category: string;
      contact_email: string;
    }) => {
      if (!user) throw new Error('Must be logged in');

      const slug = org.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '') || `org-${Date.now()}`;

      const { data, error } = await supabase
        .from('organizations')
        .insert({
          ...org,
          slug,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Organization;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrganizations'] });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Organization> & { id: string }) => {
      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Organization;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['organization', data.id] });
      queryClient.invalidateQueries({ queryKey: ['myOrganizations'] });
    },
  });
}

export function useOrgEvents(orgId: string) {
  return useQuery({
    queryKey: ['orgEvents', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('org_id', orgId)
        .order('start_time', { ascending: false });

      if (error) throw error;
      return data as Event[];
    },
    enabled: !!orgId,
  });
}

export function useCreateEvent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: {
      title: string;
      description: string;
      start_time: string;
      end_time: string;
      location: string;
      type: string;
      org_id: string;
      status: string;
      capacity?: number;
    }) => {
      if (!user) throw new Error('Must be logged in');
      const { data, error } = await supabase
        .from('events')
        .insert({ ...event, created_by: user.id })
        .select()
        .single();

      if (error) throw error;
      return data as Event;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orgEvents', data.org_id] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Event> & { id: string }) => {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Event;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['event', data.id] });
      queryClient.invalidateQueries({ queryKey: ['orgEvents', data.org_id] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, orgId }: { id: string; orgId: string }) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      return { id, orgId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orgEvents', data.orgId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useEventRSVPs(eventId: string) {
  return useQuery({
    queryKey: ['eventRSVPs', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*, profile:profiles(*)')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });
}
