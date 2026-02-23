import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event, EventType } from '@/lib/types';

const PAGE_SIZE = 20;

interface EventFilters {
  type?: EventType;
  search?: string;
  timeRange?: 'today' | 'week' | 'all';
}

function getTimeFilter(range: 'today' | 'week' | 'all') {
  const now = new Date();
  if (range === 'today') {
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { from: now.toISOString(), to: end.toISOString() };
  }
  if (range === 'week') {
    const end = new Date(now);
    end.setDate(end.getDate() + 7);
    return { from: now.toISOString(), to: end.toISOString() };
  }
  return { from: now.toISOString(), to: undefined };
}

export function useEvents(filters: EventFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['events', filters],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('events')
        .select('*, organization:organizations(*)', { count: 'exact' })
        .eq('status', 'published')
        .order('start_time', { ascending: true })
        .range(pageParam, pageParam + PAGE_SIZE - 1);

      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      if (filters.timeRange && filters.timeRange !== 'all') {
        const { from, to } = getTimeFilter(filters.timeRange);
        query = query.gte('start_time', from);
        if (to) {
          query = query.lte('start_time', to);
        }
      } else {
        query = query.gte('start_time', new Date().toISOString());
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { data: data as Event[], count, nextOffset: pageParam + PAGE_SIZE };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.count || lastPage.nextOffset >= lastPage.count) return undefined;
      return lastPage.nextOffset;
    },
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, organization:organizations(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Event;
    },
    enabled: !!id,
  });
}
