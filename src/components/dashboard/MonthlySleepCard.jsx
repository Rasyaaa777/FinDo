import React, { useState } from 'react';
import { Moon, BedDouble, Plus, Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Info, ArrowRight } from 'lucide-react';
import { calculateMonthlySleepStats, formatShortDate, getSessionColorConfig } from '../../lib/utils.js';

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
    <div className="bg-white dark:bg-[#1E1E24] border-2 border-black shadow-[3px_3px_0px_#000] p-3 sm:p-3.5 rounded-[4px] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b-2 border-black flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#8338EC] border-2 border-black flex items-center justify-center rounded-[3px] shadow-[1px_1px_0px_#000]">
              <Moon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider text-zinc-500 block">
                POLA KESEHATAN & ISTIRAHAT
              </span>
              <h3 className="font-heading font-extrabold text-xs sm:text-sm text-black dark:text-white uppercase tracking-tight">
                GRAFIK JAM TIDUR {monthName ? `(${monthName.toUpperCase()})` : ''}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isReadOnly && (
              <span className="neo-badge bg-black text-[#00E5CC] text-[9px] py-0.5 px-1.5 font-bold tracking-wider">
                MONITORING
              </span>
            )}
            <span className={`neo-badge text-[10px] py-0.5 px-2 font-bold ${badgeColor}`}>
              {status}
            </span>
          </div>
        </div>

        {/* 3 Metric Mini Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-2">
          {/* Average Hours */}
          <div className="p-2 sm:p-2.5 bg-[#8338EC]/15 dark:bg-[#8338EC]/30 border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]">
            <span className="text-[9px] font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase block">
              RATA-RATA TIDUR
            </span>
            <div className="font-heading font-extrabold text-base sm:text-lg text-[#8338EC] dark:text-[#A78BFA] my-0.5">
              {averageHours > 0 ? `${averageHours} Jam` : '--'}
            </div>
            <span className="text-[9px] font-mono font-bold text-zinc-600 dark:text-zinc-400 block truncate">
              {averageHours >= 7 && averageHours <= 9 ? '🟢 Target 7-9 jam tercapai' : 'Target ideal: 7-9 jam'}
            </span>
          </div>

          {/* Days Logged */}
          <div className="p-2 sm:p-2.5 bg-white dark:bg-[#151518] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]">
            <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase block">
              HARI TERCATAT
            </span>
            <div className="font-heading font-extrabold text-base sm:text-lg text-black dark:text-white my-0.5">
              {loggedDays} Hari
            </div>
            <span className="text-[9px] font-mono text-zinc-500 block truncate">
              dari {stats.daysInMonth} hari bulan ini
            </span>
          </div>

          {/* Optimal Days */}
          <div className="p-2 sm:p-2.5 bg-white dark:bg-[#151518] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]">
            <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase block">
              HARI OPTIMAL (7-9H)
            </span>
            <div className="font-heading font-extrabold text-base sm:text-lg text-[#00A855] my-0.5">
              {optimalCount} Hari
            </div>
            <span className="text-[9px] font-mono text-zinc-500 block truncate">
              Kualitas istirahat prima
            </span>
          </div>
        </div>

        {/* Monthly Bar Chart Container */}
        <div className="mt-2.5 p-2.5 sm:p-3 bg-[#F6F4EE] dark:bg-[#151518] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5 text-[11px]">
            <span className="font-heading font-extrabold uppercase text-black dark:text-white flex items-center gap-1">
              <span>GRAFIK HARIAN (1 - {stats.daysInMonth})</span>
            </span>

            {/* Legend: Multi-Session & Ideal */}
            <div className="flex items-center gap-1.5 flex-wrap text-[9px] font-mono font-bold">
              <span className="flex items-center gap-0.5">
                <span className="w-2 h-2 bg-[#8338EC] border border-black rounded-sm inline-block" /> 🌙 Malam
              </span>
              <span className="flex items-center gap-0.5">
                <span className="w-2 h-2 bg-[#FFE600] border border-black rounded-sm inline-block" /> ☀️ Siang
              </span>
              <span className="flex items-center gap-0.5">
                <span className="w-2 h-2 bg-[#00E5CC] border border-black rounded-sm inline-block" /> ⚡ Nap
              </span>
              <span className="flex items-center gap-0.5">
                <span className="w-2 h-2 bg-[#00D26A] border border-black rounded-sm inline-block" /> ☕ Pagi
              </span>
              <span className="text-zinc-400">|</span>
              <span className="text-[#00A855] flex items-center gap-1">
                <span className="w-2.5 border-b-2 border-dashed border-[#00A855] inline-block" /> Ideal 7.5h
              </span>
            </div>
          </div>

          {/* Live Inspector Bar on Hover */}
          <div className="min-h-[28px] px-2 py-1 mb-1.5 bg-white dark:bg-[#1E1E24] border-2 border-black rounded-[4px] shadow-[1px_1px_0px_#000] flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono transition-all">
            {hoveredDay && hoveredDay.hasData ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-heading font-extrabold bg-[#FFE600] text-black px-1 py-0.5 rounded border border-black text-[10px] shadow-[1px_1px_0px_#000]">
                  📅 {formatShortDate(hoveredDay.date)}
                </span>
                <span className="font-heading font-extrabold text-[#8338EC] dark:text-[#A78BFA] text-xs">
                  {hoveredDay.duration} Jam Total
                </span>
                {hoveredDay.sessions && hoveredDay.sessions.length > 0 ? (
                  <div className="flex items-center gap-1 flex-wrap">
                    {hoveredDay.sessions.map((sess, idx) => {
                      const cfg = getSessionColorConfig(sess, idx);
                      return (
                        <span
                          key={idx}
                          className={`neo-badge text-[9px] py-0.5 px-1.5 font-bold ${cfg.bg} ${cfg.text} border border-black shadow-[1px_1px_0px_#000]`}
                        >
                          {cfg.icon} {sess.name || `Sesi ${idx + 1}`}: {sess.startTime?.slice(0, 5)} - {sess.endTime?.slice(0, 5)} ({sess.duration}h)
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-zinc-500 font-bold">
                    {hoveredDay.bedtime && hoveredDay.wake_time ? `${hoveredDay.bedtime.slice(0, 5)} - ${hoveredDay.wake_time?.slice(0, 5)}` : 'Input Cepat'}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 text-zinc-500 text-[10px]">
                <span className="text-[#8338EC]">💡</span>
                <span>
                  {hoveredDay
                    ? `${formatShortDate(hoveredDay.date)}: Belum ada catatan tidur`
                    : 'Arahkan kursor ke batang grafik untuk melihat rincian warna sesi'}
                </span>
              </div>
            )}

            {hoveredDay?.hasData && (
              <span className="neo-badge text-[9px] py-0.5 px-1.5 bg-black text-[#00E5CC] font-bold border border-black shadow-[1px_1px_0px_#000]">
                {hoveredDay.quality || 'Baik'}
              </span>
            )}
          </div>

          {/* Bars wrapper */}
          <div className="relative pt-4 pb-1">
            {/* Ideal Guide Line (7.5 hours) */}
            <div
              className="absolute left-0 right-0 border-b border-dashed border-[#00A855]/60 z-0 pointer-events-none"
              style={{ bottom: `${(7.5 / maxChartHour) * 100}%` }}
            >
              <span className="absolute -top-3 right-0 text-[8px] font-mono font-extrabold text-[#00A855] bg-white dark:bg-[#151518] px-1 border border-[#00A855] rounded">
                Ideal: 7.5h
              </span>
            </div>

            {/* Bars Grid */}
            <div className="flex items-end gap-1 sm:gap-1.5 h-24 sm:h-28 relative z-10 overflow-x-auto no-scrollbar pb-0.5">
              {chartDays.map((d) => {
                const heightPercent = d.duration > 0
                  ? Math.min(Math.round((d.duration / maxChartHour) * 100), 100)
                  : 4;

                const isHovered = hoveredDay?.day === d.day;

                // Sort sesi agar malam di paling bawah dan siang/nap di atasnya
                const sortedSessions = Array.isArray(d.sessions) && d.sessions.length > 0
                  ? [...d.sessions].sort((a, b) => {
                      const isANight = (a.name || '').toLowerCase().includes('malam') || (a.startTime >= '20:00' || a.startTime < '06:00');
                      const isBNight = (b.name || '').toLowerCase().includes('malam') || (b.startTime >= '20:00' || b.startTime < '06:00');
                      if (isANight && !isBNight) return -1;
                      if (!isANight && isBNight) return 1;
                      return (a.startTime || '').localeCompare(b.startTime || '');
                    })
                  : [];

                return (
                  <div
                    key={d.day}
                    className={`flex-1 min-w-[8px] sm:min-w-[10px] flex flex-col items-center h-full justify-end group relative ${
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
                    {/* Inline Hover Value Indicator (Above Bar) */}
                    {isHovered && d.duration > 0 && (
                      <div className="absolute bottom-[calc(100%-6px)] mb-0.5 flex flex-col items-center pointer-events-none z-30">
                        {sortedSessions.length > 1 && (
                          <span className="text-[7px] font-mono font-extrabold bg-[#8338EC] text-white px-1 py-0 rounded border border-black shadow-[1px_1px_0px_#000] whitespace-nowrap mb-0.5">
                            {sortedSessions.length}S
                          </span>
                        )}
                        <span className="text-[8px] font-mono font-extrabold text-black dark:text-white bg-[#FFE600] px-1 py-0 rounded border border-black shadow-[1px_1px_0px_#000] whitespace-nowrap">
                          {d.duration}h
                        </span>
                      </div>
                    )}

                    {/* The Stacked Bar (Berbeda Warna per Sesi) */}
                    {d.duration > 0 ? (
                      <div
                        className={`w-full flex flex-col-reverse justify-start rounded-t-[2px] border-t-2 border-x-2 border-black overflow-hidden transition-all duration-150 shadow-[1px_1px_0px_#000] ${
                          isHovered ? 'ring-2 ring-[#FFE600] scale-y-105' : ''
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      >
                        {sortedSessions.length > 0 ? (
                          sortedSessions.map((sess, sIdx, arr) => {
                            const cfg = getSessionColorConfig(sess, sIdx);
                            return (
                              <div
                                key={sIdx}
                                className={`w-full ${cfg.bg} ${sIdx < arr.length - 1 ? 'border-t-2 border-black' : ''}`}
                                style={{ flex: `${sess.duration || 1} 1 0%`, minHeight: '4px' }}
                                title={`${sess.name}: ${sess.startTime}-${sess.endTime} (${sess.duration}h)`}
                              />
                            );
                          })
                        ) : (
                          <div className={`w-full h-full ${getBarColor(d.duration)}`} />
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-1 bg-zinc-200/50 dark:bg-zinc-700/50 border border-dashed border-zinc-400 dark:border-zinc-600 rounded-sm" />
                    )}

                    {/* Day label */}
                    <span
                      className={`text-[8px] font-mono font-bold mt-0.5 select-none transition-colors ${
                        isHovered
                          ? 'bg-[#FFE600] text-black px-0.5 rounded-sm shadow-[1px_1px_0px_#000]'
                          : 'text-zinc-500'
                      }`}
                    >
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
      <div className="mt-2.5 pt-2 border-t-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p className="text-[10px] sm:text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
          💡 <span className="font-bold">Mode Monitoring:</span> Di dashboard Anda hanya dapat memantau grafik. Buka mode Jam Tidur untuk mengelola data.
        </p>

        {isReadOnly ? (
          onNavigate && (
            <button
              onClick={() => onNavigate('sleep')}
              className="neo-btn bg-[#8338EC] text-white hover:bg-[#6c2bd9] py-1.5 px-3 text-[11px] font-heading font-extrabold flex items-center gap-1.5 shadow-[2px_2px_0px_#000] active:translate-y-0.5 shrink-0 self-start sm:self-auto"
              title="Buka Halaman Jam Tidur untuk Menambah atau Mengubah Log"
            >
              <span>BUKA JAM TIDUR</span>
              <ArrowRight className="w-3 h-3 text-white" strokeWidth={2.5} />
            </button>
          )
        ) : (
          <button
            onClick={onOpenSleepModal}
            className="neo-btn bg-[#8338EC] text-white hover:bg-[#6c2bd9] py-1.5 px-3 text-[11px] font-heading font-extrabold flex items-center gap-1 shadow-[2px_2px_0px_#000] active:translate-y-0.5 ml-auto"
          >
            <Plus className="w-3 h-3 text-white" strokeWidth={3} />
            + CATAT JAM TIDUR
          </button>
        )}
      </div>
    </div>
  );
}
