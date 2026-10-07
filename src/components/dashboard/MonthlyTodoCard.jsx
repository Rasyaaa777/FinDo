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
    <div className="bg-white border-3 border-black shadow-[6px_6px_0px_#000000] p-5 sm:p-6 rounded-[6px] transition-transform duration-150 hover:-translate-y-0.5 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b-2 border-black">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FFE600] border-2 border-black flex items-center justify-center rounded-[3px] shadow-[2px_2px_0px_#000]">
              <CheckSquare className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-zinc-500 block">
                AKUMULASI BULANAN
              </span>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-black dark:text-white uppercase tracking-tight">
                TO-DO LIST {monthName ? `(${monthName.toUpperCase()})` : ''}
              </h3>
            </div>
          </div>

          <span className={`neo-badge text-xs py-1 px-2.5 font-bold ${getStatusColor()}`}>
            {percentage}% SELESAI
          </span>
        </div>

        {/* Big Percentage & Stat Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-3">
          {/* Big Number Gauge */}
          <div className="sm:col-span-5 bg-[#F6F4EE] border-2 border-black p-4 rounded-[4px] shadow-[2px_2px_0px_#000] text-center">
            <span className="text-[11px] font-mono font-bold text-zinc-600 uppercase block mb-1">
              TINGKAT TUNTAS
            </span>
            <div className="font-heading font-extrabold text-4xl sm:text-5xl text-black tracking-tight">
              {percentage}%
            </div>
            <p className="text-[10px] font-mono font-semibold text-zinc-600 mt-1">
              Rasio Selesai Bulanan
            </p>
          </div>

          {/* Quick Counters */}
          <div className="sm:col-span-7 grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-white border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">
                TOTAL TUGAS
              </span>
              <span className="font-heading font-extrabold text-xl text-black dark:text-white">
                {total}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 block">
                agenda bulan ini
              </span>
            </div>

            <div className="p-3 bg-[#E6F9F0] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]">
              <span className="text-[10px] font-mono font-bold text-[#008f4c] uppercase block">
                SELESAI (DONE)
              </span>
              <span className="font-heading font-extrabold text-xl text-[#008f4c]">
                {completed}
              </span>
              <span className="text-[10px] font-mono text-zinc-600 block">
                telah tercapai
              </span>
            </div>

            <div className="p-3 bg-[#FFF3D6] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]">
              <span className="text-[10px] font-mono font-bold text-[#b57a00] uppercase block">
                PENDING
              </span>
              <span className="font-heading font-extrabold text-xl text-[#b57a00]">
                {pending}
              </span>
              <span className="text-[10px] font-mono text-zinc-600 block">
                belum selesai
              </span>
            </div>

            <div className="p-3 bg-white border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000] flex flex-col justify-center">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">
                STATUS
              </span>
              <span className="font-heading font-extrabold text-xs text-black dark:text-white truncate">
                {percentage >= 80 ? '🌟 Sangat Baik' : percentage >= 50 ? '⚡ On Track' : '⏳ Perlu Dikejar'}
              </span>
            </div>
          </div>
        </div>

        {/* Thick Neo-Brutalist Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-black dark:text-white">
            <span>Progres Kumulatif ({completed}/{total} Tugas)</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full h-5 bg-[#EAE6DC] border-2 border-black rounded-[4px] overflow-hidden p-0.5 shadow-inner">
            <div
              className={`h-full border-r-2 border-black transition-all duration-500 ease-out ${
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
      <div className="mt-5 pt-3 border-t-2 border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <p className="text-zinc-700 dark:text-zinc-300 font-medium">
          💡 {getEncouragement()}
        </p>
        {onNavigate && (
          <button
            onClick={() => onNavigate('todos')}
            className="neo-btn neo-btn-secondary text-[11px] py-1.5 px-3 self-start sm:self-auto shrink-0"
          >
            LIHAT JADWAL ➜
          </button>
        )}
      </div>
    </div>
  );
}
