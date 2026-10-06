import React from 'react';
import { CheckSquare, LogOut, User, Settings, Database, Sparkles, RefreshCw } from 'lucide-react';
import { formatIndonesianDate } from '../../lib/utils.js';

export default function Navbar({
  user,
  currentDate,
  isSupabaseConnected,
  onOpenAuth,
  onOpenSettings,
  onLogout,
  onRefreshData,
  isLoading
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b-3 border-black shadow-[0_4px_0_0_#000000]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFE600] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-heading font-extrabold text-xl tracking-tighter">
            FD
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-2xl tracking-tight text-black">
                FinDo
              </span>
              <span className="neo-badge bg-[#00E5CC] text-black hidden sm:inline-flex">
                v1.1
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-600 hidden md:block uppercase tracking-wider">
              Finance + Hourly To-Do
            </p>
          </div>
        </div>

        {/* Date Display (Center/Desktop) */}
        <div className="hidden lg:flex items-center gap-2 bg-[#F6F4EE] border-2 border-black px-3.5 py-1.5 shadow-[2px_2px_0px_#000]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00D26A] border border-black animate-pulse" />
          <span className="font-mono text-xs font-bold text-black tracking-wide">
            {formatIndonesianDate(currentDate)}
          </span>
        </div>

        {/* Right Actions: Status & User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Refresh Button */}
          {onRefreshData && (
            <button
              onClick={onRefreshData}
              title="Perbarui Data"
              className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            >
              <RefreshCw className={`w-4 h-4 text-black ${isLoading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
            </button>
          )}

          {/* Database Connection Pill */}
          <button
            onClick={onOpenSettings}
            title={isSupabaseConnected ? "Terhubung ke Supabase Cloud" : "Mode Penyimpanan Lokal"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-heading font-bold border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all bg-[#F6F4EE]"
          >
            <Database className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            <span className="hidden sm:inline">
              {isSupabaseConnected ? 'CLOUD SYNC' : 'LOCAL MODE'}
            </span>
            <span
              className={`w-2 h-2 rounded-full border border-black ${
                isSupabaseConnected ? 'bg-[#00D26A]' : 'bg-[#FFAA00]'
              }`}
            />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Pengaturan Koneksi & API"
            className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          >
            <Settings className="w-4 h-4 text-black" strokeWidth={2.5} />
          </button>

          {/* User Account / Login */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-[#FFE600] border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000] max-w-[160px] sm:max-w-[200px]">
                <User className="w-3.5 h-3.5 shrink-0 text-black" strokeWidth={2.5} />
                <span className="text-xs font-mono font-bold truncate text-black" title={user.email}>
                  {user.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Keluar Akun"
                className="p-2 bg-[#FF4B4B] text-white border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              >
                <LogOut className="w-4 h-4 text-white" strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="neo-btn neo-btn-primary px-3 sm:px-4 py-1.5 text-xs sm:text-sm"
            >
              MASUK
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
