import React from 'react';
import { CheckSquare, Calendar, TrendingUp, Trophy, Clock } from 'lucide-react';

export default function MonthlyTodoCard({
  monthlyStats = { total: 0, completed: 0, pending: 0, percentage: 0 },
  monthName = '',
  onNavigate
}) {
  const { total = 0, completed = 0, pending = 0, percentage = 0 } = monthlyStats;

  const getStatusColor = () => {
    if (percentage >= 80) return 'bg-[#00D26A] text-black';
    if (percentage >= 50) return 'bg-[#00E5CC] text-black';
    if (percentage > 0) return 'bg-[#FFE600] text-black';
    return 'bg-zinc-200 text-zinc-700';
  };

  const getEncouragement = () => {
    if (total === 0) return 'Belum ada agenda tugas di bulan ini';
    if (percentage === 100) return 'Luar Biasa! Semua target bulan ini tercapai 🎉';
    if (percentage >= 75) return 'Hebat! Kamu berada di jalur yang sangat produktif 🚀';
    if (percentage >= 50) return 'Bagus! Lebih dari separuh agenda telah tuntas 💪';
    return 'Ayo tingkatkan fokus dan selesaikan agenda tersisa 🔥';
  };

  return (
    <div className="bg-white dark:bg-[#1E1E24] border-2 sm:border-3 border-black shadow-[3px_3px_0px_#000000] p-3 sm:p-3.5 rounded-[5px] transition-transform duration-150 hover:-translate-y-0.5 h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-1.5 pb-2 mb-2 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FFE600] border border-black flex items-center justify-center rounded-[2px] shadow-[1px_1px_0px_#000]">
              <CheckSquare className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-heading font-extrabold text-[9px] uppercase tracking-wider text-zinc-500 block">
                AKUMULASI BULANAN
              </span>
              <h3 className="font-heading font-extrabold text-xs sm:text-sm text-black dark:text-white uppercase tracking-tight">
                TO-DO LIST {monthName ? `(${monthName.toUpperCase()})` : ''}
              </h3>
            </div>
          </div>

          <span className={`neo-badge text-[9px] py-0.5 px-1.5 font-bold border border-black ${getStatusColor()}`}>
            {percentage}% SELESAI
          </span>
        </div>

        {/* Big Percentage & Stat Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center my-2">
          {/* Big Number Gauge */}
          <div className="sm:col-span-5 bg-[#F6F4EE] dark:bg-[#151518] border border-black p-2 rounded-[3px] shadow-[1.5px_1.5px_0px_#000] text-center">
            <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase block">
              TINGKAT TUNTAS
            </span>
            <div className="font-heading font-extrabold text-2xl sm:text-3xl text-black dark:text-white tracking-tight my-0.5">
              {percentage}%
            </div>
            <p className="text-[8px] font-mono font-semibold text-zinc-500">
              Rasio Selesai Bulanan
            </p>
          </div>

          {/* Quick Counters */}
          <div className="sm:col-span-7 grid grid-cols-2 gap-1.5">
            <div className="p-1.5 bg-white dark:bg-[#1E1E24] border border-black rounded-[3px] shadow-[1px_1px_0px_#000]">
              <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase block">
                TOTAL TUGAS
              </span>
              <span className="font-heading font-extrabold text-sm sm:text-base text-black dark:text-white">
                {total}
              </span>
              <span className="text-[8px] font-mono text-zinc-500 block">
                agenda bulan ini
              </span>
            </div>

            <div className="p-1.5 bg-[#E6F9F0] dark:bg-[#08331E] border border-black rounded-[3px] shadow-[1px_1px_0px_#000]">
              <span className="text-[8px] font-mono font-bold text-[#008f4c] dark:text-[#00D26A] uppercase block">
                SELESAI (DONE)
              </span>
              <span className="font-heading font-extrabold text-sm sm:text-base text-[#008f4c] dark:text-[#00D26A]">
                {completed}
              </span>
              <span className="text-[8px] font-mono text-zinc-500 block">
                telah tercapai
              </span>
            </div>

            <div className="p-1.5 bg-[#FFF3D6] dark:bg-[#332208] border border-black rounded-[3px] shadow-[1px_1px_0px_#000]">
              <span className="text-[8px] font-mono font-bold text-[#b57a00] dark:text-[#FFE600] uppercase block">
                PENDING
              </span>
              <span className="font-heading font-extrabold text-sm sm:text-base text-[#b57a00] dark:text-[#FFE600]">
                {pending}
              </span>
              <span className="text-[8px] font-mono text-zinc-500 block">
                belum selesai
              </span>
            </div>

            <div className="p-1.5 bg-white dark:bg-[#1E1E24] border border-black rounded-[3px] shadow-[1px_1px_0px_#000] flex flex-col justify-center">
              <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase block">
                STATUS
              </span>
              <span className="font-heading font-extrabold text-[10px] text-black dark:text-white truncate">
                {percentage >= 80 ? '🌟 Sangat Baik' : percentage >= 50 ? '⚡ On Track' : '⏳ Perlu Dikejar'}
              </span>
            </div>
          </div>
        </div>

        {/* Compact Progress Bar */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-black dark:text-white">
            <span>Progres Kumulatif ({completed}/{total} Tugas)</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#EAE6DC] dark:bg-zinc-800 border border-black rounded-[2px] overflow-hidden p-0.5 shadow-inner">
            <div
              className={`h-full border-r border-black transition-all duration-500 ease-out ${
                percentage === 100
                  ? 'bg-[#00D26A]'
                  : percentage >= 50
                  ? 'bg-[#00E5CC]'
                  : percentage > 0
                  ? 'bg-[#FFE600]'
                  : 'bg-transparent'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Motivation & Action */}
      <div className="mt-2.5 pt-2 border-t border-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] font-mono">
        <p className="text-zinc-600 dark:text-zinc-400 font-medium truncate">
          💡 {getEncouragement()}
        </p>
        {onNavigate && (
          <button
            onClick={() => onNavigate('todos')}
            className="neo-btn neo-btn-secondary text-[9px] py-1 px-2 self-start sm:self-auto shrink-0 shadow-[1px_1px_0px_#000]"
          >
            LIHAT JADWAL ➜
          </button>
        )}
      </div>
    </div>
  );
}
