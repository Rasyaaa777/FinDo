import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, UserPlus, LogIn } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
            className="w-7 h-7 bg-white text-black hover:bg-[#FF4B4B] hover:text-white border-2 border-black flex items-center justify-center font-bold transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F6F4EE] border-2 border-black rounded-[4px]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`py-1.5 text-xs font-heading font-extrabold flex items-center justify-center gap-1.5 border-2 transition-all ${
                mode === 'login'
                  ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-transparent text-black border-transparent hover:bg-zinc-200'
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
              className={`py-1.5 text-xs font-heading font-extrabold flex items-center justify-center gap-1.5 border-2 transition-all ${
                mode === 'register'
                  ? 'bg-[#00E5CC] text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-transparent text-black border-transparent hover:bg-zinc-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" strokeWidth={2.5} />
              DAFTAR
            </button>
          </div>

          {error && (
            <div className="p-3 bg-[#FFE4E4] border-2 border-[#FF4B4B] text-black font-mono text-xs rounded-[4px] shadow-[2px_2px_0px_#FF4B4B]">
              <strong>⚠ GAGAL:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-black">
                Email Pengguna
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" strokeWidth={2.5} />
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="neo-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-black">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" strokeWidth={2.5} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="neo-input pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full neo-btn neo-btn-primary py-3 text-sm mt-3"
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
