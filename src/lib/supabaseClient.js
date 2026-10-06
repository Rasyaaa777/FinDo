import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from environment variables or localStorage
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem('findo_supabase_url');
  const localKey = localStorage.getItem('findo_supabase_key');

  const url = (localUrl && localUrl.trim()) || (envUrl && !envUrl.includes('your-project') ? envUrl.trim() : '');
  const key = (localKey && localKey.trim()) || (envKey && !envKey.includes('your-anon-public-key') ? envKey.trim() : '');

  const isConfigured = Boolean(url && key && url.startsWith('http'));

  return { url, key, isConfigured };
};

export const saveSupabaseConfig = (url, key) => {
  if (url && key) {
    localStorage.setItem('findo_supabase_url', url.trim());
    localStorage.setItem('findo_supabase_key', key.trim());
  } else {
    localStorage.removeItem('findo_supabase_url');
    localStorage.removeItem('findo_supabase_key');
  }
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
