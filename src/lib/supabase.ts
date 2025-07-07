import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Config:', {
  url: supabaseUrl,
  hasKey: !!supabaseKey,
  keyPreview: supabaseKey?.substring(0, 20) + '...'
});

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing environment variables for Supabase configuration');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
