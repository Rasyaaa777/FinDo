import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await onLogin(email.trim(), password);
      } else {
        await onRegister(email.trim(), password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat otentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      {/* Modal Box */}
      <div className="w-full max-w-md bg-white border-3 border-black shadow-[8px_8px_0px_#000000] rounded-[6px] overflow-hidden animate-in fade-in duration-150">
        {/* Black Header Strip */}
        <div className="bg-black text-white px-4 py-3 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FFE600] text-black border border-black flex items-center justify-center font-heading font-extrabold text-xs">
              FD
            </div>
            <span className="font-heading font-extrabold text-sm uppercase tracking-wider">
              {mode === 'login' ? 'MASUK KE FINDO' : 'BUAT AKUN BARU'}
            </span>
          </div>

          <button
            onClick={onClose}
            title="Tutup Modal"
            className="w-7 h-7 bg-white text-black hover:bg-[#FF4B4B] hover:text-white border-2 border-black flex items-center justify-center font-bold transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F6F4EE] dark:bg-[#121214] border-2 border-black rounded-[4px]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`py-2 text-xs font-heading font-extrabold flex items-center justify-center gap-1.5 border-2 transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-transparent text-zinc-700 dark:text-zinc-300 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" strokeWidth={2.5} />
              MASUK
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`py-2 text-xs font-heading font-extrabold flex items-center justify-center gap-1.5 border-2 transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#00E5CC] text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-transparent text-zinc-700 dark:text-zinc-300 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" strokeWidth={2.5} />
              DAFTAR
            </button>
          </div>

          {error && (
            <div className="p-3 bg-[#FFE4E4] dark:bg-[#3D1414] border-2 border-[#FF4B4B] text-black dark:text-[#FFB4B4] font-mono text-xs rounded-[4px] shadow-[2px_2px_0px_#FF4B4B]">
              <strong>⚠ GAGAL:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1.5 text-black dark:text-zinc-100">
                Email Pengguna
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                  <Mail className="w-4 h-4 text-zinc-500 dark:text-zinc-400" strokeWidth={2.5} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="neo-input neo-input-icon !pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1.5 text-black dark:text-zinc-100">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                  <Lock className="w-4 h-4 text-zinc-500 dark:text-zinc-400" strokeWidth={2.5} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="neo-input neo-input-icon !pl-11 !pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-black dark:hover:text-white p-1 transition-colors cursor-pointer"
                  title={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={2} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full neo-btn py-3 text-sm mt-3 ${
                mode === 'login' ? 'neo-btn-primary' : 'neo-btn-accent'
              }`}
            >
              {loading ? (
                'MEMPROSES...'
              ) : mode === 'login' ? (
                <>
                  MASUK SEKARANG <ArrowRight className="w-4 h-4" strokeWidth={3} />
                </>
              ) : (
                <>
                  BUAT AKUN BARU <ArrowRight className="w-4 h-4" strokeWidth={3} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
