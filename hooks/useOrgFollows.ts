import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

export function useOrgFollows() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['orgFollows', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_follows')
        .select('*, organization:organizations(*)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useIsFollowingOrg(orgId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['orgFollow', user?.id, orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_follows')
        .select('org_id')
        .eq('user_id', user!.id)
        .eq('org_id', orgId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!orgId,
  });
}

export function useToggleOrgFollow() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orgId, isFollowing }: { orgId: string; isFollowing: boolean }) => {
      if (isFollowing) {
        const { error } = await supabase
          .from('org_follows')
          .delete()
          .eq('user_id', user!.id)
          .eq('org_id', orgId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('org_follows')
          .insert({ user_id: user!.id, org_id: orgId });
        if (error) throw error;
      }
    },
    onSuccess: (_, { orgId }) => {
      queryClient.invalidateQueries({ queryKey: ['orgFollow', user?.id, orgId] });
      queryClient.invalidateQueries({ queryKey: ['orgFollows', user?.id] });
    },
  });
}
