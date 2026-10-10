import React from 'react';
import {
  LayoutDashboard,
  Clock,
  Receipt,
  LogOut,
  User,
  ChevronLeft,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { formatRupiah } from '../../lib/utils.js';

export default function Sidebar({
  activeView,
  onSelectView,
  user,
  todosCount = 0,
  balance = 0,
  sleepAverage = 0,
  onOpenAuth,
  onLogout,
  onRefreshData,
  isLoading,
  currentDate,
  isCollapsed = false,
  onToggleCollapse,
  isOpenMobile = false,
  onCloseMobile,
  theme = 'light',
  onToggleTheme
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'DASHBOARD',
      sublabel: 'Ikhtisar & AI Intel',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'todos',
      label: 'JADWAL TO-DO',
      sublabel: 'Time-Blocking Jam',
      icon: Clock,
      badge: todosCount > 0 ? `${todosCount} Agenda` : null,
      badgeColor: 'bg-[#FFE600]'
    },
    {
      id: 'finance',
      label: 'KEUANGAN KAS',
      sublabel: 'Buku Kas & Mutasi',
      icon: Receipt,
      badge: Math.abs(balance) >= 1_000_000_000
        ? `Rp ${(balance / 1_000_000_000).toFixed(1)}M`
        : Math.abs(balance) >= 1_000_000
        ? `Rp ${(balance / 1_000_000).toFixed(1)}jt`
        : formatRupiah(balance),
      badgeColor: balance >= 0 ? 'bg-[#00D26A]' : 'bg-[#FF4B4B]'
    },
    {
      id: 'sleep',
      label: 'JAM TIDUR',
      sublabel: 'Pola & Log Istirahat',
      icon: Moon,
      badge: sleepAverage > 0 ? `${sleepAverage}h/hari` : null,
      badgeColor: 'bg-[#8338EC] text-white'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden animate-in fade-in duration-150"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-[#FFFFFF] border-r-3 border-black flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 ${
          isCollapsed ? 'w-[60px]' : 'w-56'
        } ${
          isOpenMobile ? 'translate-x-0 shadow-[4px_0_0_0_#000000]' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Brand Header */}
        <div>
          <div
            className={`border-b-3 border-black bg-[#F6F4EE] transition-all ${
              isCollapsed
                ? 'py-2.5 px-1.5 flex justify-center'
                : 'py-2.5 px-3 flex items-center justify-between'
            }`}
          >
            {isCollapsed ? (
              <button
                onClick={onToggleCollapse}
                title="Buka / Perluas Sidebar"
                className="w-8 h-8 bg-[#FFE600] text-black hover:bg-yellow-300 active:translate-y-0.5 border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center font-heading font-extrabold text-sm tracking-tighter shrink-0 select-none transition-all rounded-[3px] cursor-pointer"
              >
                FD
              </button>
            ) : (
              <>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 bg-[#FFE600] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000] flex items-center justify-center font-heading font-extrabold text-sm tracking-tighter shrink-0 select-none rounded-[2px]">
                    FD
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-heading font-extrabold text-base tracking-tight text-black">
                        FinDo
                      </span>
                      <span className="neo-badge bg-[#00E5CC] text-[9px] py-0 px-1 text-black font-bold border border-black">
                        v1.1
                      </span>
                    </div>
                    <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider truncate">
                      Time + Finance
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Button to collapse to icon-only mode */}
                  <button
                    onClick={onToggleCollapse}
                    title="Perkecil Sidebar"
                    className="p-1 bg-white border border-black hover:bg-[#FFE600] text-black transition-colors rounded-[2px] shadow-[1px_1px_0px_#000] active:translate-y-0.5 hidden lg:flex"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>

                  {/* Mobile Drawer Close Button */}
                  <button
                    onClick={onCloseMobile}
                    title="Tutup Menu"
                    className="p-1 bg-white border border-black hover:bg-[#FF4B4B] hover:text-white transition-colors rounded-[2px] lg:hidden"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Navigation Links */}
          <nav
            className={`transition-all ${
              isCollapsed ? 'p-1.5 space-y-2 flex flex-col items-center' : 'p-2.5 space-y-1.5'
            }`}
          >
            {!isCollapsed && (
              <p className="text-[9px] font-heading font-extrabold uppercase text-zinc-500 px-1.5 tracking-wider mb-1">
                MENU UTAMA
              </p>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              if (isCollapsed) {
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectView(item.id);
                      if (typeof window !== 'undefined' && window.innerWidth < 1024 && onCloseMobile) {
                        onCloseMobile();
                      }
                    }}
                    title={`${item.label} - ${item.sublabel}${item.badge ? ` (${item.badge})` : ''}`}
                    className={`w-9 h-9 rounded-[3px] border-2 border-black flex items-center justify-center transition-all relative select-none ${
                      isActive
                        ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_#000000] -translate-x-0.5 -translate-y-0.5 font-bold'
                        : 'bg-white dark:bg-[#1E1E24] text-zinc-800 dark:text-[#F4F4F5] hover:bg-[#F6F4EE] shadow-[1.5px_1.5px_0px_#000000]'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-black' : 'text-black dark:text-[#F4F4F5]'
                      }`}
                      strokeWidth={2.5}
                    />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF4B4B] border border-black rounded-full" />
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    if (typeof window !== 'undefined' && window.innerWidth < 1024 && onCloseMobile) {
                      onCloseMobile();
                    }
                  }}
                  className={`w-full flex items-center justify-between p-2 border-2 border-black rounded-[3px] font-heading font-extrabold text-xs transition-all select-none text-left ${
                    isActive
                      ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_#000000] -translate-x-0.5 -translate-y-0.5'
                      : 'bg-white dark:bg-[#1E1E24] text-zinc-800 dark:text-[#F4F4F5] hover:bg-[#F6F4EE] shadow-[1.5px_1.5px_0px_#000000]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-[2px] border border-black flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-black text-[#FFE600]'
                          : 'bg-[#F6F4EE] dark:bg-[#2A2A32] text-black dark:text-[#F4F4F5]'
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isActive ? 'text-[#FFE600]' : 'text-black dark:text-[#F4F4F5]'
                        }`}
                        strokeWidth={2.5}
                      />
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`truncate text-xs font-extrabold tracking-wide ${
                          isActive ? 'text-black' : 'text-zinc-900 dark:text-[#F4F4F5]'
                        }`}
                      >
                        {item.label}
                      </div>
                      <div
                        className={`text-[9px] font-mono truncate ${
                          isActive ? 'text-zinc-900 font-semibold' : 'text-zinc-500 dark:text-zinc-400'
                        }`}
                      >
                        {item.sublabel}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`neo-badge text-[9px] py-0 px-1 ml-1.5 shrink-0 max-w-[80px] truncate border border-black ${
                        item.badgeColor || 'bg-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User Account & Theme */}
        <div
          className={`border-t-3 border-black bg-[#F6F4EE] transition-all ${
            isCollapsed ? 'p-1.5 space-y-1.5 flex flex-col items-center' : 'p-2.5 space-y-2'
          }`}
        >
          {isCollapsed ? (
            <>
              {/* User Avatar / Login */}
              {user ? (
                <button
                  onClick={onLogout}
                  title={`Keluar Akun (${user.email})`}
                  className="w-8 h-8 bg-white hover:bg-[#FF4B4B] hover:text-white border-2 border-black rounded-[3px] shadow-[1.5px_1.5px_0px_#000] flex items-center justify-center transition-colors text-black active:translate-y-0.5"
                >
                  <User className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  title="Masuk / Buat Akun"
                  className="w-8 h-8 bg-[#FFE600] border-2 border-black rounded-[3px] shadow-[1.5px_1.5px_0px_#000] flex items-center justify-center active:translate-y-0.5 transition-all"
                >
                  <User className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                </button>
              )}

              {/* Theme Toggle Button (Collapsed) */}
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  title={theme === 'dark' ? 'Ganti ke Tema Terang' : 'Ganti ke Tema Gelap'}
                  className="w-8 h-8 bg-white hover:bg-zinc-100 border-2 border-black rounded-[3px] shadow-[1.5px_1.5px_0px_#000] flex items-center justify-center transition-colors active:translate-y-0.5"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-3.5 h-3.5 text-[#FFE600]" strokeWidth={2.5} />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                  )}
                </button>
              )}
            </>
          ) : (
            <>
              {/* User Account / Login */}
              {user ? (
                <div className="p-1.5 bg-white border-2 border-black rounded-[3px] shadow-[1.5px_1.5px_0px_#000]">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-6 h-6 bg-[#FFE600] border border-black flex items-center justify-center shrink-0 rounded-[2px]">
                        <User className="w-3 h-3 text-black" strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-heading font-extrabold text-black truncate">
                          {user.email?.split('@')[0]}
                        </div>
                        <div className="text-[9px] font-mono text-zinc-500 truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onLogout}
                      title="Keluar Akun"
                      className="p-1 bg-[#FF4B4B] text-white hover:bg-[#e63939] border border-black transition-colors rounded-[2px]"
                    >
                      <LogOut className="w-3 h-3" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="w-full neo-btn neo-btn-primary py-1.5 text-xs font-bold"
                >
                  MASUK / DAFTAR
                </button>
              )}

              {/* Theme Toggle Button (Expanded) */}
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  title={theme === 'dark' ? 'Beralih ke Tema Terang' : 'Beralih ke Tema Gelap'}
                  className="w-full p-1.5 bg-white hover:bg-zinc-100 border-2 border-black rounded-[3px] shadow-[1.5px_1.5px_0px_#000] flex items-center justify-between text-xs font-heading font-extrabold transition-all active:translate-y-0.5"
                >
                  <div className="flex items-center gap-1.5">
                    {theme === 'dark' ? (
                      <Sun className="w-3.5 h-3.5 text-[#FFE600]" strokeWidth={2.5} />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                    )}
                    <span className="text-[11px]">{theme === 'dark' ? 'TEMA GELAP' : 'TEMA TERANG'}</span>
                  </div>
                  <span
                    className={`neo-badge text-[9px] py-0 px-1.5 border border-black ${
                      theme === 'dark' ? 'bg-[#FFE600] text-black' : 'bg-black text-white'
                    }`}
                  >
                    {theme === 'dark' ? 'DARK' : 'LIGHT'}
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}
