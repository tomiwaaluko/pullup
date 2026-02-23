import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.',
  );
}

// Use AsyncStorage only when window exists (client). During SSR, use no-op storage
// to avoid "ReferenceError: window is not defined" from AsyncStorage.
const isClient = typeof window !== 'undefined';
const storage = isClient
  ? AsyncStorage
  : {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
