import { createClient } from '@supabase/supabase-js';

// Retrieve credentials directly from environment variables (.env / .env.local)
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  let url = (envUrl && !envUrl.includes('your-project') ? envUrl.trim() : '');
  const key = (envKey && !envKey.includes('your-anon-public-key') ? envKey.trim() : '');

  // Sanitasi URL: hapus trailing slash dan akhiran /rest/v1 jika tidak sengaja tersalin
  if (url) {
    url = url.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
  }

  const isConfigured = Boolean(url && key && url.startsWith('http'));

  return { url, key, isConfigured };
};

let currentClient = null;

export const getSupabase = () => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!currentClient) {
    try {
      currentClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.warn("Gagal inisialisasi Supabase client:", err);
      return null;
    }
  }
  return currentClient;
};

export const resetSupabaseClient = () => {
  currentClient = null;
};
