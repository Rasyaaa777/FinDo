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
          isCollapsed ? 'w-[76px]' : 'w-72'
        } ${
          isOpenMobile ? 'translate-x-0 shadow-[4px_0_0_0_#000000]' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Brand Header */}
        <div>
          <div
            className={`border-b-3 border-black bg-[#F6F4EE] transition-all ${
              isCollapsed
                ? 'py-3.5 px-2 flex justify-center'
                : 'p-4 sm:p-5 flex items-center justify-between'
            }`}
          >
            {isCollapsed ? (
              <button
                onClick={onToggleCollapse}
                title="Buka / Perluas Sidebar"
                className="w-11 h-11 bg-[#FFE600] text-black hover:bg-yellow-300 active:translate-y-0.5 border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] flex items-center justify-center font-heading font-extrabold text-xl tracking-tighter shrink-0 select-none transition-all rounded-[4px] cursor-pointer"
              >
                FD
              </button>
            ) : (
              <>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-heading font-extrabold text-xl tracking-tighter shrink-0 select-none">
                    FD
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-extrabold text-2xl tracking-tight text-black">
                        FinDo
                      </span>
                      <span className="neo-badge bg-[#00E5CC] text-[10px] py-0 px-1 text-black font-bold">
                        v1.1
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider truncate">
                      Finance + Time-Blocking
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Button to collapse to icon-only mode */}
                  <button
                    onClick={onToggleCollapse}
                    title="Perkecil Sidebar (Hanya Ikon)"
                    className="p-1.5 bg-white border-2 border-black hover:bg-[#FFE600] text-black transition-colors rounded-[3px] shadow-[2px_2px_0px_#000] active:translate-y-0.5 hidden lg:flex"
                  >
                    <ChevronLeft className="w-4 h-4" strokeWidth={3} />
                  </button>

                  {/* Mobile Drawer Close Button */}
                  <button
                    onClick={onCloseMobile}
                    title="Tutup Menu"
                    className="p-1.5 bg-white border-2 border-black hover:bg-[#FF4B4B] hover:text-white transition-colors rounded-[3px] lg:hidden"
                  >
                    <X className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Navigation Links */}
          <nav
            className={`transition-all ${
              isCollapsed ? 'p-2.5 space-y-3 flex flex-col items-center' : 'p-4 space-y-2.5'
            }`}
          >
            {!isCollapsed && (
              <p className="text-[10px] font-heading font-extrabold uppercase text-zinc-500 px-2 tracking-wider">
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
                    className={`w-12 h-12 rounded-[4px] border-2 border-black flex items-center justify-center transition-all relative select-none ${
                      isActive
                        ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_#000000] -translate-x-0.5 -translate-y-0.5 font-bold'
                        : 'bg-white dark:bg-[#1E1E24] text-zinc-800 dark:text-[#F4F4F5] hover:bg-[#F6F4EE] shadow-[2px_2px_0px_#000000] hover:shadow-[3px_3px_0px_#000000]'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? 'text-black' : 'text-black dark:text-[#F4F4F5]'
                      }`}
                      strokeWidth={2.5}
                    />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FF4B4B] border border-black rounded-full" />
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
                  className={`w-full flex items-center justify-between p-3 border-2 border-black rounded-[4px] font-heading font-extrabold text-sm transition-all select-none text-left ${
                    isActive
                      ? 'bg-[#FFE600] text-black shadow-[4px_4px_0px_#000000] -translate-x-0.5 -translate-y-0.5'
                      : 'bg-white dark:bg-[#1E1E24] text-zinc-800 dark:text-[#F4F4F5] hover:bg-[#F6F4EE] shadow-[2px_2px_0px_#000000] hover:shadow-[3px_3px_0px_#000000]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-[3px] border-2 border-black flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-black text-[#FFE600]'
                          : 'bg-[#F6F4EE] dark:bg-[#2A2A32] text-black dark:text-[#F4F4F5]'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-[#FFE600]' : 'text-black dark:text-[#F4F4F5]'
                        }`}
                        strokeWidth={2.5}
                      />
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`truncate text-xs sm:text-sm font-extrabold tracking-wide ${
                          isActive ? 'text-black' : 'text-zinc-900 dark:text-[#F4F4F5]'
                        }`}
                      >
                        {item.label}
                      </div>
                      <div
                        className={`text-[10px] font-mono font-medium truncate ${
                          isActive ? 'text-zinc-900 font-semibold' : 'text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {item.sublabel}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`neo-badge text-[10px] py-0.5 px-1.5 ml-2 shrink-0 max-w-[100px] truncate ${
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
            isCollapsed ? 'p-2 space-y-2.5 flex flex-col items-center' : 'p-4 space-y-3'
          }`}
        >
          {isCollapsed ? (
            <>
              {/* User Avatar / Login */}
              {user ? (
                <button
                  onClick={onLogout}
                  title={`Keluar Akun (${user.email})`}
                  className="w-10 h-10 bg-white hover:bg-[#FF4B4B] hover:text-white border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000] flex items-center justify-center transition-colors text-black active:translate-y-0.5"
                >
                  <User className="w-4 h-4" strokeWidth={2.5} />
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  title="Masuk / Buat Akun"
                  className="w-10 h-10 bg-[#FFE600] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000] flex items-center justify-center active:translate-y-0.5 transition-all"
                >
                  <User className="w-4 h-4 text-black" strokeWidth={2.5} />
                </button>
              )}

              {/* Theme Toggle Button (Collapsed) */}
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  title={theme === 'dark' ? 'Ganti ke Tema Terang' : 'Ganti ke Tema Gelap'}
                  className="w-10 h-10 bg-white hover:bg-zinc-100 border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000] flex items-center justify-center transition-colors active:translate-y-0.5"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-[#FFE600]" strokeWidth={2.5} />
                  ) : (
                    <Moon className="w-4 h-4 text-black" strokeWidth={2.5} />
                  )}
                </button>
              )}
            </>
          ) : (
            <>
              {/* User Account / Login */}
              {user ? (
                <div className="p-2.5 bg-white border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 bg-[#FFE600] border border-black flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-black" strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-heading font-extrabold text-black truncate">
                          {user.email?.split('@')[0]}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500 truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onLogout}
                      title="Keluar Akun"
                      className="p-1.5 bg-[#FF4B4B] text-white hover:bg-[#e63939] border border-black transition-colors rounded-[2px]"
                    >
                      <LogOut className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="w-full neo-btn neo-btn-primary py-2 text-xs"
                >
                  MASUK / DAFTAR
                </button>
              )}

              {/* Theme Toggle Button (Expanded) */}
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  title={theme === 'dark' ? 'Beralih ke Tema Terang' : 'Beralih ke Tema Gelap'}
                  className="w-full p-2 bg-white hover:bg-zinc-100 border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000] flex items-center justify-between text-xs font-heading font-extrabold transition-all active:translate-y-0.5"
                >
                  <div className="flex items-center gap-2">
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4 text-[#FFE600]" strokeWidth={2.5} />
                    ) : (
                      <Moon className="w-4 h-4 text-black" strokeWidth={2.5} />
                    )}
                    <span>{theme === 'dark' ? 'TEMA GELAP' : 'TEMA TERANG'}</span>
                  </div>
                  <span
                    className={`neo-badge text-[10px] py-0.5 px-2 ${
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
