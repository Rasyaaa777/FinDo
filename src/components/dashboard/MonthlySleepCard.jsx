import React, { useState } from 'react';
import { Moon, BedDouble, Plus, Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Info, ArrowRight } from 'lucide-react';
import { calculateMonthlySleepStats, formatShortDate } from '../../lib/utils.js';

export default function MonthlySleepCard({
  monthlySleepRecords = [],
  monthName = '',
  selectedMonthPrefix = '',
  isReadOnly = true,
  onNavigate,
  onOpenSleepModal,
  onSelectDayRecord
}) {
  const [hoveredDay, setHoveredDay] = useState(null);

  const stats = calculateMonthlySleepStats(monthlySleepRecords, selectedMonthPrefix);
  const {
    loggedDays,
    averageHours,
    optimalCount,
    chartDays,
    status,
    badgeColor
  } = stats;

  const maxChartHour = 12; // Visual scale max

  const getBarColor = (duration) => {
    if (duration >= 7 && duration <= 9) return 'bg-[#00D26A] border-black';
    if (duration >= 6 && duration < 7) return 'bg-[#FFE600] border-black';
    if (duration > 0 && duration < 6) return 'bg-[#FF4B4B] border-black';
    if (duration > 9) return 'bg-[#00E5CC] border-black';
    return 'bg-zinc-200/50 border-dashed border-zinc-400';
  };

  return (
    <div className="bg-white dark:bg-[#1E1E24] border-3 border-black shadow-[6px_6px_0px_#000000] p-5 sm:p-6 rounded-[6px] transition-transform duration-150 hover:-translate-y-0.5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b-2 border-black flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#8338EC] border-2 border-black flex items-center justify-center rounded-[3px] shadow-[2px_2px_0px_#000]">
              <Moon className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-wider text-zinc-500 block">
                POLA KESEHATAN & ISTIRAHAT
              </span>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-black dark:text-white uppercase tracking-tight">
                GRAFIK JAM TIDUR {monthName ? `(${monthName.toUpperCase()})` : ''}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isReadOnly && (
              <span className="neo-badge bg-black text-[#00E5CC] text-[10px] py-1 px-2 font-bold tracking-wider">
                MONITORING
              </span>
            )}
            <span className={`neo-badge text-xs py-1 px-2.5 font-bold ${badgeColor}`}>
              {status}
            </span>
          </div>
        </div>

        {/* 3 Metric Mini Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
          {/* Average Hours */}
          <div className="p-3.5 bg-[#8338EC]/15 dark:bg-[#8338EC]/30 border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]">
            <span className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase block">
              RATA-RATA TIDUR
            </span>
            <div className="font-heading font-extrabold text-2xl text-[#8338EC] dark:text-[#A78BFA] my-0.5">
              {averageHours > 0 ? `${averageHours} Jam` : '--'}
            </div>
            <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 block">
              {averageHours >= 7 && averageHours <= 9 ? '🟢 Target 7-9 jam tercapai' : 'Target ideal: 7-9 jam'}
            </span>
          </div>

          {/* Days Logged */}
          <div className="p-3.5 bg-white dark:bg-[#151518] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">
              HARI TERCATAT
            </span>
            <div className="font-heading font-extrabold text-2xl text-black dark:text-white my-0.5">
              {loggedDays} Hari
            </div>
            <span className="text-[10px] font-mono text-zinc-500 block">
              dari {stats.daysInMonth} hari bulan ini
            </span>
          </div>

          {/* Optimal Days */}
          <div className="p-3.5 bg-white dark:bg-[#151518] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">
              HARI OPTIMAL (7-9H)
            </span>
            <div className="font-heading font-extrabold text-2xl text-[#00A855] my-0.5">
              {optimalCount} Hari
            </div>
            <span className="text-[10px] font-mono text-zinc-500 block">
              Kualitas istirahat prima
            </span>
          </div>
        </div>

        {/* Monthly Bar Chart Container */}
        <div className="mt-4 p-4 bg-[#F6F4EE] dark:bg-[#151518] border-2 border-black rounded-[6px] shadow-[3px_3px_0px_#000]">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-heading font-extrabold uppercase text-black dark:text-white flex items-center gap-1.5">
              <span>GRAFIK HARIAN (1 - {stats.daysInMonth})</span>
            </span>

            {/* Legend */}
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#00D26A] border border-black rounded-sm inline-block" /> 7-9h
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#FFE600] border border-black rounded-sm inline-block" /> 6-7h
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#FF4B4B] border border-black rounded-sm inline-block" /> &lt;6h
              </span>
            </div>
          </div>

          {/* Bars wrapper */}
          <div className="relative pt-6 pb-2">
            {/* Ideal Guide Line (7-8 hours) */}
            <div
              className="absolute left-0 right-0 border-b-2 border-dashed border-[#00A855]/60 z-0 pointer-events-none"
              style={{ bottom: `${(7.5 / maxChartHour) * 100}%` }}
            >
              <span className="absolute -top-3.5 right-0 text-[9px] font-mono font-extrabold text-[#00A855] bg-white dark:bg-[#151518] px-1 border border-[#00A855] rounded">
                Garis Ideal: 7.5h
              </span>
            </div>

            {/* Bars Grid */}
            <div className="flex items-end gap-1 sm:gap-1.5 h-36 relative z-10 overflow-x-auto no-scrollbar pb-1">
              {chartDays.map((d) => {
                const heightPercent = d.duration > 0
                  ? Math.min(Math.round((d.duration / maxChartHour) * 100), 100)
                  : 4;

                const isHovered = hoveredDay?.day === d.day;

                return (
                  <div
                    key={d.day}
                    className={`flex-1 min-w-[9px] sm:min-w-[12px] flex flex-col items-center h-full justify-end group relative ${
                      isReadOnly ? 'cursor-default' : 'cursor-pointer'
                    }`}
                    onMouseEnter={() => setHoveredDay(d)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onClick={() => {
                      if (!isReadOnly && onSelectDayRecord) {
                        onSelectDayRecord(d);
                      }
                    }}
                  >
                    {/* Tooltip on Hover */}
                    {isHovered && (
                      <div className="absolute -top-14 z-30 bg-black text-white p-2 rounded text-[10px] font-mono whitespace-nowrap shadow-[3px_3px_0px_#FFE600] border border-white pointer-events-none">
                        <p className="font-bold text-[#FFE600]">{formatShortDate(d.date)}</p>
                        <p>
                          {d.hasData
                            ? `${d.duration} Jam (${d.quality || 'Baik'})${d.bedtime ? ` • ${d.bedtime?.slice(0, 5)} - ${d.wake_time?.slice(0, 5)}` : ''}`
                            : 'Belum ada data'}
                        </p>
                      </div>
                    )}

                    {/* The Bar */}
                    <div
                      className={`w-full rounded-t-[2px] border-t-2 border-x-2 transition-all duration-150 ${getBarColor(d.duration)} ${
                        isHovered ? 'scale-y-105 shadow-[2px_0px_0px_#000]' : ''
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />

                    {/* Day label */}
                    <span className="text-[8px] sm:text-[9px] font-mono font-bold text-zinc-500 mt-1 select-none">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-4 pt-3 border-t-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
          💡 <span className="font-bold">Mode Monitoring:</span> Di dashboard Anda hanya dapat memantau grafik. Untuk mencatat, mengedit, atau menghapus riwayat, buka mode Jam Tidur.
        </p>

        {isReadOnly ? (
          onNavigate && (
            <button
              onClick={() => onNavigate('sleep')}
              className="neo-btn bg-[#8338EC] text-white hover:bg-[#6c2bd9] py-2 px-3.5 text-xs font-heading font-extrabold flex items-center gap-2 shadow-[2px_2px_0px_#000] active:translate-y-0.5 shrink-0 self-start sm:self-auto"
              title="Buka Halaman Jam Tidur untuk Menambah atau Mengubah Log"
            >
              <span>BUKA MODE JAM TIDUR</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </button>
          )
        ) : (
          <button
            onClick={onOpenSleepModal}
            className="neo-btn bg-[#8338EC] text-white hover:bg-[#6c2bd9] py-2 px-3.5 text-xs font-heading font-extrabold flex items-center gap-1.5 shadow-[2px_2px_0px_#000] active:translate-y-0.5 ml-auto"
          >
            <Plus className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            + CATAT JAM TIDUR
          </button>
        )}
      </div>
    </div>
  );
}
