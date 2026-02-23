import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Event } from '@/lib/types';

export function useRSVPs() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['rsvps', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*, event:events(*, organization:organizations(*))')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useIsRSVPd(eventId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['rsvp', user?.id, eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rsvps')
        .select('event_id')
        .eq('user_id', user!.id)
        .eq('event_id', eventId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!eventId,
  });
}

export function useToggleRSVP() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, isRSVPd }: { eventId: string; isRSVPd: boolean }) => {
      if (isRSVPd) {
        const { error } = await supabase
          .from('rsvps')
          .delete()
          .eq('user_id', user!.id)
          .eq('event_id', eventId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('rsvps')
          .insert({ user_id: user!.id, event_id: eventId });
        if (error) throw error;
      }
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['rsvp', user?.id, eventId] });
      queryClient.invalidateQueries({ queryKey: ['rsvps', user?.id] });
    },
  });
}
