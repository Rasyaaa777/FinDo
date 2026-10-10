-- =========================================================
-- FINDO DATABASE SCHEMA & SECURITY POLICIES (Supabase PostgreSQL)
-- =========================================================

-- 1. TABEL TO-DO LIST PER JAM
CREATE TABLE IF NOT EXISTS hourly_todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  task_title TEXT NOT NULL,
  target_date DATE DEFAULT CURRENT_DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_todos_user_date ON hourly_todos (user_id, target_date);

-- 2. TABEL LAPORAN KEUANGAN
CREATE TABLE IF NOT EXISTS financial_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  type VARCHAR(10) CHECK (type IN ('income', 'expense')) NOT NULL,
  amount NUMERIC(15, 2) CHECK (amount > 0) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  record_date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_finance_user_date ON financial_records (user_id, record_date);

-- 3. TABEL CATATAN JAM TIDUR (Mendukung Multi-Sesi: Tidur Siang + Tidur Malam)
CREATE TABLE IF NOT EXISTS sleep_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  record_date DATE DEFAULT CURRENT_DATE NOT NULL,
  duration_hours NUMERIC(4, 2) CHECK (duration_hours > 0 AND duration_hours <= 24) NOT NULL,
  bedtime TIME,
  wake_time TIME,
  quality VARCHAR(20) DEFAULT 'Baik',
  notes TEXT,
  sessions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT uq_sleep_user_date UNIQUE (user_id, record_date)
);

-- Migrasi untuk tabel yang sudah ada (jika kolom sessions belum ada):
ALTER TABLE sleep_records ADD COLUMN IF NOT EXISTS sessions JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_sleep_user_date ON sleep_records (user_id, record_date);

-- 4. AKTIFKAN ROW LEVEL SECURITY (RLS)
ALTER TABLE hourly_todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_records ENABLE ROW LEVEL SECURITY;

-- 5. KEBIJAKAN AKSES (POLICIES)
DROP POLICY IF EXISTS "Users can manage their own todos" ON hourly_todos;
CREATE POLICY "Users can manage their own todos"
ON hourly_todos
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own financial records" ON financial_records;
CREATE POLICY "Users can manage their own financial records"
ON financial_records
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own sleep records" ON sleep_records;
CREATE POLICY "Users can manage their own sleep records"
ON sleep_records
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
