// FinDo Data Service (Supabase PostgreSQL Database)
import { getSupabase } from './supabaseClient.js';
import { parseSleepRecord, serializeSleepRecord } from './utils.js';

// Helper generating standard RFC4122 v4 UUID
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const DataService = {
  // ===================== AUTHENTICATION =====================
  async getInitialUser() {
    const supabase = getSupabase();
    if (!supabase) return null;
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.warn("Supabase auth session warning:", error.message);
        return null;
      }
      return session?.user || null;
    } catch (err) {
      console.warn("Supabase auth error:", err);
      return null;
    }
  },

  async login(email, password) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error("Supabase belum dikonfigurasi. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY telah diisi di file .env / .env.local.");
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  },

  async register(email, password) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error("Supabase belum dikonfigurasi. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY telah diisi di file .env / .env.local.");
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  },

  async logout() {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("Supabase signOut error:", e);
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('findo_current_user');
    }
  },

  // ===================== HOURLY TO-DOS =====================
  async getTodos(userId, targetDate) {
    const supabase = getSupabase();
    if (!supabase || !userId) return [];
    const { data, error } = await supabase
      .from('hourly_todos')
      .select('*')
      .eq('user_id', userId)
      .eq('target_date', targetDate)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getMonthlyTodos(userId, monthPrefix) {
    const supabase = getSupabase();
    if (!supabase || !userId) return [];
    const prefix = monthPrefix || new Date().toISOString().slice(0, 7);
    const [year, month] = prefix.split('-').map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    const lastDayStr = String(lastDay).padStart(2, '0');

    const { data, error } = await supabase
      .from('hourly_todos')
      .select('*')
      .eq('user_id', userId)
      .gte('target_date', `${prefix}-01`)
      .lte('target_date', `${prefix}-${lastDayStr}`)
      .order('target_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.warn("getMonthlyTodos error:", error);
      return [];
    }
    return data || [];
  },

  async addTodo(todoData) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error("Supabase belum dikonfigurasi di file .env");
    }
    const payload = {
      ...todoData,
      id: todoData.id || generateUUID(),
    };
    const { data, error } = await supabase
      .from('hourly_todos')
      .insert([payload])
      .select();

    if (error) throw error;
    return data?.[0] || payload;
  },

  async updateTodo(id, userId, updates) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error("Supabase belum dikonfigurasi di file .env");
    }
    const { data, error } = await supabase
      .from('hourly_todos')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async deleteTodo(id, userId) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error("Supabase belum dikonfigurasi di file .env");
    }
    const { error } = await supabase
      .from('hourly_todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },

  // ===================== FINANCIAL RECORDS =====================
  async getRecords(userId, period = 'all', targetDate = null) {
    const supabase = getSupabase();
    if (!supabase || !userId) return [];
    let query = supabase
      .from('financial_records')
      .select('*')
      .eq('user_id', userId)
      .order('record_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (period === 'daily' && targetDate) {
      query = query.eq('record_date', targetDate);
    } else if (period === 'monthly' && targetDate) {
      const monthPrefix = targetDate.slice(0, 7); // YYYY-MM
      const [year, month] = monthPrefix.split('-').map(Number);
      const lastDay = new Date(year, month, 0).getDate();
      const lastDayStr = String(lastDay).padStart(2, '0');
      query = query.gte('record_date', `${monthPrefix}-01`).lte('record_date', `${monthPrefix}-${lastDayStr}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async addRecord(recordData) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error("Supabase belum dikonfigurasi di file .env");
    }
    const payload = {
      ...recordData,
      id: recordData.id || generateUUID(),
    };
    const { data, error } = await supabase
      .from('financial_records')
      .insert([payload])
      .select();

    if (error) throw error;
    return data?.[0] || payload;
  },

  async updateRecord(id, userId, updates) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error("Supabase belum dikonfigurasi di file .env");
    }
    const { data, error } = await supabase
      .from('financial_records')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async deleteRecord(id, userId) {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error("Supabase belum dikonfigurasi di file .env");
    }
    const { error } = await supabase
      .from('financial_records')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },

  // ===================== SLEEP RECORDS =====================
  async getMonthlySleepRecords(userId, monthPrefix) {
    const supabase = getSupabase();
    const prefix = monthPrefix || new Date().toISOString().slice(0, 7);
    const [year, month] = prefix.split('-').map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    const lastDayStr = String(lastDay).padStart(2, '0');

    if (supabase && userId) {
      try {
        const { data, error } = await supabase
          .from('sleep_records')
          .select('*')
          .eq('user_id', userId)
          .gte('record_date', `${prefix}-01`)
          .lte('record_date', `${prefix}-${lastDayStr}`)
          .order('record_date', { ascending: true });

        if (!error && data) {
          const parsedList = data.map(r => parseSleepRecord(r));
          try {
            localStorage.setItem(`findo_sleep_${userId}_${prefix}`, JSON.stringify(parsedList));
          } catch (_) {}
          return parsedList;
        }
      } catch (err) {
        console.warn("Supabase sleep_records fetch (fallback to local):", err.message);
      }
    }

    // Local fallback
    try {
      const stored = localStorage.getItem(`findo_sleep_${userId}_${prefix}`);
      if (stored) {
        const list = JSON.parse(stored);
        return list.map(r => parseSleepRecord(r));
      }
    } catch (_) {}
    return [];
  },

  async addSleepRecord(sleepData) {
    const supabase = getSupabase();
    const serialized = serializeSleepRecord(sleepData);
    const payload = {
      id: serialized.id || generateUUID(),
      user_id: serialized.user_id,
      record_date: serialized.record_date,
      duration_hours: Number(serialized.duration_hours) || 0,
      bedtime: serialized.bedtime || null,
      wake_time: serialized.wake_time || null,
      quality: serialized.quality || 'Baik',
      notes: serialized.notes || null,
      created_at: serialized.created_at || new Date().toISOString(),
    };

    if (supabase && payload.user_id) {
      try {
        const { data, error } = await supabase
          .from('sleep_records')
          .upsert([payload], { onConflict: 'user_id,record_date' })
          .select();

        if (!error && data?.[0]) {
          const result = parseSleepRecord(data[0]);
          // Sync to local
          try {
            const prefix = (result.record_date || '').slice(0, 7);
            const key = `findo_sleep_${payload.user_id}_${prefix}`;
            const current = JSON.parse(localStorage.getItem(key) || '[]');
            const filtered = current.filter(r => r.record_date !== result.record_date);
            filtered.push(result);
            filtered.sort((a, b) => (a.record_date || '').localeCompare(b.record_date || ''));
            localStorage.setItem(key, JSON.stringify(filtered));
          } catch (_) {}
          return result;
        }
      } catch (err) {
        console.warn("Supabase sleep_records upsert (fallback to local):", err.message);
      }
    }

    // Local fallback
    const result = parseSleepRecord(serialized);
    try {
      const prefix = (result.record_date || new Date().toISOString().slice(0, 7)).slice(0, 7);
      const key = `findo_sleep_${payload.user_id}_${prefix}`;
      const current = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = current.filter(r => r.record_date !== result.record_date);
      filtered.push(result);
      filtered.sort((a, b) => (a.record_date || '').localeCompare(b.record_date || ''));
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch (_) {}

    return result;
  },

  async deleteSleepRecord(id, userId, recordDate) {
    const supabase = getSupabase();
    if (supabase && userId) {
      try {
        await supabase
          .from('sleep_records')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
      } catch (err) {
        console.warn("Supabase sleep_records delete warning:", err.message);
      }
    }

    if (recordDate && userId) {
      try {
        const prefix = recordDate.slice(0, 7);
        const key = `findo_sleep_${userId}_${prefix}`;
        const current = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = current.filter(r => r.id !== id && r.record_date !== recordDate);
        localStorage.setItem(key, JSON.stringify(filtered));
      } catch (_) {}
    }
    return true;
  }
};
