import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { track } from '@/lib/analytics';

export function useSavedEvents() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['savedEvents', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_events')
        .select('*, event:events(*, organization:organizations(*))')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useIsSaved(eventId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['savedEvent', user?.id, eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_events')
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

export function useToggleSavedEvent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, isSaved }: { eventId: string; isSaved: boolean }) => {
      if (!user) throw new Error('Must be logged in');
      if (isSaved) {
        const { error } = await supabase
          .from('saved_events')
          .delete()
          .eq('user_id', user!.id)
          .eq('event_id', eventId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('saved_events')
          .insert({ user_id: user!.id, event_id: eventId });
        if (error) throw error;
      }
    },
    onSuccess: (_, { eventId }) => {
      track('saved_event', { event_id: eventId });
      queryClient.invalidateQueries({ queryKey: ['savedEvent', user?.id, eventId] });
      queryClient.invalidateQueries({ queryKey: ['savedEvents', user?.id] });
    },
  });
}
