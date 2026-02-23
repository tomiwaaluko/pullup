/**
 * Quick Supabase connection test
 * Run: node --env-file=.env scripts/test-supabase-connection.mjs
 * Or on older Node: node scripts/test-supabase-connection.mjs
 * (set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY first)
 */

import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
  console.log('Testing Supabase connection...\n');

  try {
    // 1. Fetch from a public table (profiles - RLS may block, but connection should work)
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    if (error) {
      console.log('profiles query:', error.message);
      console.log('(RLS or missing table may cause this - connection still works)\n');
    } else {
      console.log('profiles:', data?.length ?? 0, 'row(s)');
    }

    // 2. Try events table (might be empty)
    const { data: events, error: eventsErr } = await supabase
      .from('events')
      .select('id')
      .limit(1);
    if (eventsErr) {
      console.log('events query:', eventsErr.message, '\n');
    } else {
      console.log('events:', events?.length ?? 0, 'row(s)');
    }

    // 3. Auth status (unauthenticated)
    const { data: session } = await supabase.auth.getSession();
    console.log('auth session:', session?.session ? 'signed in' : 'anonymous');

    console.log('\n✓ Supabase connection successful');
  } catch (err) {
    console.error('✗ Connection failed:', err.message);
    process.exit(1);
  }
}

test();
