// FinDo Data Service (Supabase Integration + Multi-User Local Fallback)
import { getSupabase } from './supabaseClient.js';
import { getTodayDateString } from './utils.js';

const DEFAULT_DEMO_USER = {
  id: 'demo-user-findo-001',
  email: 'alex.productivity@findo.app',
  created_at: new Date().toISOString(),
};

// Initial starter sample items for a new demo session
const getStarterTodos = (userId, todayDate) => [
  {
    id: 'todo-1',
    user_id: userId,
    task_title: 'Briefing Tim & Prioritisasi Sprint',
    target_date: todayDate,
    start_time: '08:00',
    end_time: '09:00',
    is_completed: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'todo-2',
    user_id: userId,
    task_title: 'Selesaikan Desain Neo-Brutalism FinDo',
    target_date: todayDate,
    start_time: '09:30',
    end_time: '12:00',
    is_completed: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'todo-3',
    user_id: userId,
    task_title: 'Review Pengeluaran & Audit Arus Kas',
    target_date: todayDate,
    start_time: '14:00',
    end_time: '15:30',
    is_completed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'todo-4',
    user_id: userId,
    task_title: 'Evaluasi Produktivitas Harian bersama AI',
    target_date: todayDate,
    start_time: '17:00',
    end_time: '18:00',
    is_completed: false,
    created_at: new Date().toISOString()
  }
];

const getStarterRecords = (userId, todayDate) => [
  {
    id: 'fin-1',
    user_id: userId,
    type: 'income',
    amount: 7500000,
    category: 'Gaji',
    description: 'Pembayaran Proyek Client Web Dev',
    record_date: todayDate,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'fin-2',
    user_id: userId,
    type: 'expense',
    amount: 65000,
    category: 'Makanan',
    description: 'Makan siang & Kopi Latte',
    record_date: todayDate,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'fin-3',
    user_id: userId,
    type: 'expense',
    amount: 150000,
    category: 'Transport',
    description: 'Bensin & Saldo E-Toll',
    record_date: todayDate,
    created_at: new Date(Date.now() - 3600000 * 1).toISOString()
  }
];

// Helper for local multi-user store
const getLocalKey = (prefix, userId) => `findo_${prefix}_${userId}`;

export const DataService = {
  // ===================== AUTHENTICATION =====================
  async getInitialUser() {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          return session.user;
        }
      } catch (err) {
        console.warn("Supabase auth check error:", err);
      }
    }

    // Local fallback user check
    const localUserJson = localStorage.getItem('findo_current_user');
    if (localUserJson) {
      try {
        return JSON.parse(localUserJson);
      } catch (e) {
        // invalid json
      }
    }

    // Default to demo user for instantaneous exploration
    localStorage.setItem('findo_current_user', JSON.stringify(DEFAULT_DEMO_USER));
    return DEFAULT_DEMO_USER;
  },

  async login(email, password) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data.user;
    }

    // Local multi-user mock login
    const user = {
      id: 'user_' + btoa(email).replace(/=/g, '').toLowerCase().slice(0, 16),
      email,
      created_at: new Date().toISOString()
    };
    localStorage.setItem('findo_current_user', JSON.stringify(user));
    return user;
  },

  async register(email, password) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data.user;
    }

    // Local multi-user mock register
    const user = {
      id: 'user_' + btoa(email).replace(/=/g, '').toLowerCase().slice(0, 16),
      email,
      created_at: new Date().toISOString()
    };
    localStorage.setItem('findo_current_user', JSON.stringify(user));
    return user;
  },

  async logout() {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("Supabase signout:", e);
      }
    }
    localStorage.removeItem('findo_current_user');
  },

  // ===================== HOURLY TO-DOS =====================
  async getTodos(userId, targetDate) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('hourly_todos')
        .select('*')
        .eq('target_date', targetDate)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data || [];
    }

    // Local Storage
    const key = getLocalKey('todos', userId);
    let items = [];
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        items = JSON.parse(raw);
      } else {
        // Initialize starter todos on first load
        const today = getTodayDateString();
        items = getStarterTodos(userId, today);
        localStorage.setItem(key, JSON.stringify(items));
      }
    } catch (e) {
      items = [];
    }

    // Filter by targetDate and sort by start_time
    return items
      .filter(t => t.target_date === targetDate)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  },

  async addTodo(todoData) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('hourly_todos')
        .insert([todoData])
        .select();

      if (error) throw error;
      return data?.[0] || todoData;
    }

    // Local Storage
    const key = getLocalKey('todos', todoData.user_id);
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {}

    const newTodo = {
      ...todoData,
      id: 'todo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      created_at: new Date().toISOString()
    };

    items.push(newTodo);
    localStorage.setItem(key, JSON.stringify(items));
    return newTodo;
  },

  async updateTodo(id, userId, updates) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('hourly_todos')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    }

    // Local Storage
    const key = getLocalKey('todos', userId);
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {}

    const index = items.findIndex(t => t.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(key, JSON.stringify(items));
      return items[index];
    }
    return null;
  },

  async deleteTodo(id, userId) {
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase
        .from('hourly_todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    }

    // Local Storage
    const key = getLocalKey('todos', userId);
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {}

    items = items.filter(t => t.id !== id);
    localStorage.setItem(key, JSON.stringify(items));
    return true;
  },

  // ===================== FINANCIAL RECORDS =====================
  async getRecords(userId, period = 'all', targetDate = null) {
    const supabase = getSupabase();
    if (supabase) {
      let query = supabase
        .from('financial_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (period === 'daily' && targetDate) {
        query = query.eq('record_date', targetDate);
      } else if (period === 'monthly' && targetDate) {
        const monthPrefix = targetDate.slice(0, 7); // YYYY-MM
        query = query.gte('record_date', `${monthPrefix}-01`).lte('record_date', `${monthPrefix}-31`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    // Local Storage
    const key = getLocalKey('finance', userId);
    let items = [];
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        items = JSON.parse(raw);
      } else {
        const today = getTodayDateString();
        items = getStarterRecords(userId, today);
        localStorage.setItem(key, JSON.stringify(items));
      }
    } catch (e) {
      items = [];
    }

    // Apply period filtering
    if (period === 'daily' && targetDate) {
      items = items.filter(r => r.record_date === targetDate);
    } else if (period === 'monthly' && targetDate) {
      const monthPrefix = targetDate.slice(0, 7);
      items = items.filter(r => (r.record_date || '').startsWith(monthPrefix));
    }

    // Sort descending by created_at / record_date
    return items.sort((a, b) => new Date(b.created_at || b.record_date) - new Date(a.created_at || a.record_date));
  },

  async addRecord(recordData) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('financial_records')
        .insert([recordData])
        .select();

      if (error) throw error;
      return data?.[0] || recordData;
    }

    // Local Storage
    const key = getLocalKey('finance', recordData.user_id);
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {}

    const newRecord = {
      ...recordData,
      id: 'fin_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      created_at: new Date().toISOString()
    };

    items.unshift(newRecord);
    localStorage.setItem(key, JSON.stringify(items));
    return newRecord;
  },

  async updateRecord(id, userId, updates) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('financial_records')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    }

    // Local Storage
    const key = getLocalKey('finance', userId);
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {}

    const index = items.findIndex(r => r.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(key, JSON.stringify(items));
      return items[index];
    }
    return null;
  },

  async deleteRecord(id, userId) {
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase
        .from('financial_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    }

    // Local Storage
    const key = getLocalKey('finance', userId);
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {}

    items = items.filter(r => r.id !== id);
    localStorage.setItem(key, JSON.stringify(items));
    return true;
  }
};
