import React, { useState } from 'react';
import { X, Database, Key, Sparkles, Check, AlertCircle, Copy, CheckCheck, Sun, Moon } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, resetSupabaseClient } from '../../lib/supabaseClient.js';
import { getGeminiApiKey, saveGeminiApiKey } from '../../lib/aiService.js';

export default function SettingsModal({ isOpen, onClose, onConfigUpdated, theme = 'light', onToggleTheme }) {
  const currentConfig = getSupabaseConfig();
  const currentGeminiKey = getGeminiApiKey();

  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url || '');
  const [supabaseKey, setSupabaseKey] = useState(currentConfig.key || '');
  const [geminiKey, setGeminiKey] = useState(currentGeminiKey || '');
  const [message, setMessage] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    try {
      if (supabaseUrl && supabaseKey) {
        saveSupabaseConfig(supabaseUrl, supabaseKey);
      } else {
        saveSupabaseConfig('', '');
      }

      if (geminiKey) {
        saveGeminiApiKey(geminiKey);
      } else {
        saveGeminiApiKey('');
      }

      resetSupabaseClient();
      setMessage({ type: 'success', text: 'Konfigurasi berhasil diperbarui!' });
      setTimeout(() => {
        onConfigUpdated();
        onClose();
      }, 700);
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menyimpan konfigurasi.' });
    }
  };

  const handleResetToDemo = () => {
    saveSupabaseConfig('', '');
    saveGeminiApiKey('');
    resetSupabaseClient();
    setSupabaseUrl('');
    setSupabaseKey('');
    setGeminiKey('');
    setMessage({ type: 'success', text: 'Kembali ke mode penyimpanan lokal default.' });
    setTimeout(() => {
      onConfigUpdated();
      onClose();
    }, 700);
  };

  const copySqlSchema = () => {
    const sql = `-- Eksekusi di Supabase SQL Editor:
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

ALTER TABLE hourly_todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own todos" ON hourly_todos FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their own financial records" ON financial_records FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border-3 border-black shadow-[8px_8px_0px_#000000] rounded-[6px] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-black text-white px-4 py-3 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#FFE600]" strokeWidth={2.5} />
            <span className="font-heading font-extrabold text-sm uppercase tracking-wider">
              PENGATURAN KONEKSI & API
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 bg-white text-black hover:bg-[#FF4B4B] hover:text-white border-2 border-black flex items-center justify-center font-bold transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {message && (
            <div
              className={`p-3 border-2 border-black text-xs font-mono font-bold flex items-center gap-2 ${
                message.type === 'success' ? 'bg-[#D4F8E8]' : 'bg-[#FFE4E4]'
              }`}
            >
              {message.type === 'success' ? (
                <Check className="w-4 h-4 text-[#00D26A]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#FF4B4B]" />
              )}
              {message.text}
            </div>
          )}

          {/* Theme Preference */}
          {onToggleTheme && (
            <div className="p-3 bg-[#F6F4EE] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-zinc-600 block">TEMA TAMPILAN SISTEM:</span>
                <strong className="text-sm font-heading font-bold text-black flex items-center gap-1.5 mt-0.5">
                  {theme === 'dark' ? (
                    <>
                      <Moon className="w-4 h-4 text-[#FFE600]" strokeWidth={2.5} />
                      Mode Gelap Aktif (Dark)
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4 text-[#FFAA00]" strokeWidth={2.5} />
                      Mode Terang Aktif (Light)
                    </>
                  )}
                </strong>
              </div>

              <button
                type="button"
                onClick={onToggleTheme}
                className="neo-btn neo-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#FFE600]" strokeWidth={2.5} />
                    Ganti ke Terang
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                    Ganti ke Gelap
                  </>
                )}
              </button>
            </div>
          )}

          {/* Current Status banner */}
          <div className="p-3 bg-[#F6F4EE] border-2 border-black rounded-[4px] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-zinc-600 block">STATUS KONEKSI SAAT INI:</span>
              <strong className="text-sm font-heading font-bold text-black">
                {currentConfig.isConfigured ? '🟢 Terhubung ke Supabase Cloud' : '🟡 Mode Penyimpanan Lokal (Offline Ready)'}
              </strong>
            </div>
            <span className={`neo-badge ${currentConfig.isConfigured ? 'bg-[#00D26A]' : 'bg-[#FFE600]'}`}>
              {currentConfig.isConfigured ? 'CLOUD' : 'LOCAL'}
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Supabase URL */}
            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-black">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://your-project.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="neo-input font-mono text-xs"
              />
            </div>

            {/* Supabase Anon Key */}
            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-black">
                Supabase Anon Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="neo-input font-mono text-xs"
              />
            </div>

            {/* Gemini API Key */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-heading font-extrabold uppercase text-black">
                  Google AI Studio Gemini API Key (Opsional)
                </label>
                <span className="text-[10px] font-mono text-zinc-500">Gemini 1.5</span>
              </div>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="neo-input font-mono text-xs"
              />
              <p className="text-[11px] font-mono text-zinc-500 mt-1">
                Jika dikosongkan, FinDo tetap menganalisis data menggunakan algoritma cerdas internal secara instan.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button type="submit" className="w-full sm:flex-1 neo-btn neo-btn-primary py-2.5 text-xs">
                SIMPAN & TERAPKAN
              </button>
              <button
                type="button"
                onClick={handleResetToDemo}
                className="w-full sm:w-auto neo-btn neo-btn-secondary py-2.5 text-xs px-3"
              >
                MODE DEMO LOKAL
              </button>
            </div>
          </form>

          {/* Quick SQL Schema Helper */}
          <div className="pt-3 border-t-2 border-dashed border-black">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-heading font-extrabold uppercase text-black">
                SQL Schema Supabase (RLS Ready)
              </span>
              <button
                onClick={copySqlSchema}
                className="neo-btn neo-btn-secondary text-[11px] px-2 py-1"
              >
                {copiedSql ? (
                  <>
                    <CheckCheck className="w-3 h-3 text-[#00D26A]" />
                    TERSALIN!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-black" />
                    SALIN SQL
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] font-mono text-zinc-600">
              Salin dan jalankan script SQL ini di SQL Editor dashboard Supabase Anda untuk membuat tabel <code>hourly_todos</code> & <code>financial_records</code> dengan isolasi RLS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
