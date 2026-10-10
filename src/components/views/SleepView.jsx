import React, { useState } from 'react';
import {
  Moon,
  BedDouble,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Clock,
  Check,
  AlertTriangle,
  Info,
  ArrowUpDown
} from 'lucide-react';
import SleepModal from '../dashboard/SleepModal.jsx';
import {
  formatIndonesianMonth,
  formatIndonesianDate,
  formatShortDate,
  getTodayDateString,
  calculateMonthlySleepStats,
  parseSleepRecord,
  getSessionColorConfig
} from '../../lib/utils.js';

export default function SleepView({
  monthlySleepRecords = [],
  selectedMonth,
  onSelectMonth,
  onSaveSleep,
  onDeleteSleep,
  selectedDate
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' (newest first) or 'asc'

  // Current active month string (YYYY-MM)
  const currentMonthStr = getTodayDateString().slice(0, 7);
  const activeMonth = selectedMonth || currentMonthStr;
  const activeMonthName = formatIndonesianMonth(activeMonth);

  // Month navigation helpers
  const handlePrevMonth = () => {
    const [year, month] = activeMonth.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1);
    const prevMonthStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
    onSelectMonth?.(prevMonthStr);
  };

  const handleNextMonth = () => {
    const [year, month] = activeMonth.split('-').map(Number);
    const nextDate = new Date(year, month, 1);
    const nextMonthStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;
    onSelectMonth?.(nextMonthStr);
  };

  const handleResetToCurrentMonth = () => {
    onSelectMonth?.(currentMonthStr);
  };

  // Sleep stats for current selected month
  const stats = calculateMonthlySleepStats(monthlySleepRecords, activeMonth);
  const {
    loggedDays,
    averageHours,
    optimalCount,
    chartDays,
    status,
    badgeColor,
    daysInMonth
  } = stats;

  const maxChartHour = 12;

  // Filter & sort records for table
  const sortedRecords = [...monthlySleepRecords]
    .map(r => parseSleepRecord(r))
    .filter(r => r.record_date?.startsWith(activeMonth))
    .sort((a, b) => {
      if (sortOrder === 'desc') {
        return (b.record_date || '').localeCompare(a.record_date || '');
      }
      return (a.record_date || '').localeCompare(b.record_date || '');
    });

  // Calculate highest & lowest sleep duration
  const durations = sortedRecords.map(r => Number(r.duration_hours) || 0).filter(d => d > 0);
  const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;
  const minDuration = durations.length > 0 ? Math.min(...durations) : 0;

  // Handlers for modal
  const handleOpenAdd = (targetDate = null) => {
    setEditingRecord(targetDate ? { record_date: targetDate } : null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    if (!record) return;
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus catatan tidur tanggal ${formatIndonesianDate(record.record_date)}?`
    );
    if (confirmDelete && onDeleteSleep) {
      onDeleteSleep(record.id, record.record_date);
    }
  };

  const getBarColor = (duration) => {
    if (duration >= 7 && duration <= 9) return 'bg-[#00D26A] border-black';
    if (duration >= 6 && duration < 7) return 'bg-[#FFE600] border-black';
    if (duration > 0 && duration < 6) return 'bg-[#FF4B4B] border-black';
    if (duration > 9) return 'bg-[#8338EC] border-black';
    return 'bg-zinc-200/50 border-dashed border-zinc-400';
  };

  const getQualityBadge = (quality) => {
    switch (quality) {
      case 'Sangat Baik': return 'bg-[#00D26A] text-black';
      case 'Baik': return 'bg-[#00E5CC] text-black';
      case 'Cukup': return 'bg-[#FFE600] text-black';
      case 'Kurang': return 'bg-[#FF4B4B] text-white';
      default: return 'bg-zinc-200 text-black';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* 1. MONTH SELECTOR & NAVIGATION */}
      <div className="bg-white dark:bg-[#1E1E24] border-3 border-black shadow-[4px_4px_0px_#000000] p-4 rounded-[6px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            title="Bulan Sebelumnya"
            className="p-2 bg-[#F6F4EE] dark:bg-[#2A2A32] text-black dark:text-white hover:bg-[#FFE600] hover:text-black border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
          </button>

          <div className="flex items-center gap-2">
            <input
              type="month"
              value={activeMonth}
              onChange={(e) => onSelectMonth?.(e.target.value)}
              className="neo-input text-xs sm:text-sm font-heading font-extrabold py-1.5 px-3 bg-white dark:bg-[#151518]"
            />
            {activeMonth !== currentMonthStr && (
              <button
                onClick={handleResetToCurrentMonth}
                className="neo-badge bg-[#00E5CC] text-black hover:bg-teal-300 cursor-pointer font-bold text-[10px] py-1.5 px-2.5 border-2 border-black shadow-[2px_2px_0px_#000]"
              >
                BULAN INI
              </button>
            )}
          </div>

          <button
            onClick={handleNextMonth}
            title="Bulan Berikutnya"
            className="p-2 bg-[#F6F4EE] dark:bg-[#2A2A32] text-black dark:text-white hover:bg-[#FFE600] hover:text-black border-2 border-black rounded shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-colors"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-black text-[#FFE600] border-2 border-black px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 shadow-[1px_1px_0px_#000]">
            <BedDouble className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>{loggedDays} Log</span>
          </div>
          <span className={`neo-badge text-xs py-1 px-3 font-bold ${badgeColor}`}>
            {status}
          </span>
          <button
            onClick={() => handleOpenAdd()}
            className="neo-btn bg-[#8338EC] text-white hover:bg-[#6c2bd9] py-1.5 px-3 text-xs font-extrabold flex items-center gap-1.5 shadow-[2px_2px_0px_#000] active:translate-y-0.5"
          >
            <Plus className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            CATAT JAM TIDUR
          </button>
        </div>
      </div>

      {/* 3. KEY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rata-Rata Jam Tidur */}
        <div className="bg-white dark:bg-[#1E1E24] border-3 border-black shadow-[4px_4px_0px_#000] p-4 rounded-[6px]">
          <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 block">
            RATA-RATA TIDUR / HARI
          </span>
          <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#8338EC] dark:text-[#A78BFA] my-1">
            {averageHours > 0 ? `${averageHours} Jam` : '--'}
          </div>
          <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">
            {averageHours >= 7 && averageHours <= 9 ? '🟢 Target 7-9 jam ideal' : 'Target ideal: 7-9 jam'}
          </span>
        </div>

        {/* Hari Tercatat */}
        <div className="bg-white dark:bg-[#1E1E24] border-3 border-black shadow-[4px_4px_0px_#000] p-4 rounded-[6px]">
          <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 block">
            HARI TERCATAT
          </span>
          <div className="font-heading font-extrabold text-2xl sm:text-3xl text-black dark:text-white my-1">
            {loggedDays} <span className="text-sm font-normal text-zinc-500">/ {daysInMonth} Hari</span>
          </div>
          <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">
            {daysInMonth > 0 ? `${Math.round((loggedDays / daysInMonth) * 100)}% konsistensi log` : '0%'}
          </span>
        </div>

        {/* Hari Optimal (7-9 Jam) */}
        <div className="bg-white dark:bg-[#1E1E24] border-3 border-black shadow-[4px_4px_0px_#000] p-4 rounded-[6px]">
          <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 block">
            HARI OPTIMAL (7-9H)
          </span>
          <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#00A855] my-1">
            {optimalCount} Hari
          </div>
          <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">
            Kualitas istirahat prima
          </span>
        </div>

        {/* Rentang Durasi (Maks & Min) */}
        <div className="bg-white dark:bg-[#1E1E24] border-3 border-black shadow-[4px_4px_0px_#000] p-4 rounded-[6px]">
          <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 block">
            RENTANG DURASI BULAN INI
          </span>
          <div className="font-heading font-extrabold text-xl text-black dark:text-white my-1.5 flex items-center justify-between">
            <span className="text-[#00D26A] text-lg">Maks: {maxDuration > 0 ? `${maxDuration}h` : '--'}</span>
            <span className="text-zinc-400 text-sm">|</span>
            <span className="text-[#FF4B4B] text-lg">Min: {minDuration > 0 ? `${minDuration}h` : '--'}</span>
          </div>
          <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">
            Fluktuasi istirahat harian
          </span>
        </div>
      </div>

      {/* 4. GRAFIK BATANG BULANAN INTERAKTIF (BISA KLIK UNTUK INPUT/EDIT HARI TERTENTU) */}
      <div className="bg-white dark:bg-[#1E1E24] border-3 border-black shadow-[6px_6px_0px_#000000] p-5 sm:p-6 rounded-[6px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b-2 border-black">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#8338EC] border border-black inline-block rounded-sm" />
              <h3 className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-tight text-black dark:text-white">
                GRAFIK BATANG HARIAN (TANGGAL 1 - {daysInMonth} {activeMonthName.toUpperCase()})
              </h3>
            </div>
            <p className="text-xs font-mono text-zinc-500 mt-0.5">
              💡 <span className="font-bold">Tips:</span> Klik pada batang tanggal mana pun untuk langsung mencatat atau mengedit data tidur tanggal tersebut.
            </p>
          </div>

          {/* Legend: Multi-Session Colors & Ideal */}
          <div className="flex items-center gap-2.5 text-[10px] font-mono font-bold flex-wrap">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#8338EC] border border-black rounded-sm inline-block" /> 🌙 Malam
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#FFE600] border border-black rounded-sm inline-block" /> ☀️ Siang
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#00E5CC] border border-black rounded-sm inline-block" /> ⚡ Nap
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#00D26A] border border-black rounded-sm inline-block" /> ☕ Pagi
            </span>
            <span className="text-zinc-400">|</span>
            <span className="text-[#00A855] flex items-center gap-1">
              <span className="w-3 border-b-2 border-dashed border-[#00A855] inline-block" /> Ideal 7.5h
            </span>
          </div>
        </div>

        {/* Live Inspector Bar on Hover */}
        <div className="min-h-[36px] px-3 py-1.5 mb-3 bg-white dark:bg-[#1E1E24] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000] flex flex-wrap items-center justify-between gap-2 text-xs font-mono transition-all">
          {hoveredDay && hoveredDay.hasData ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-heading font-extrabold bg-[#FFE600] text-black px-1.5 py-0.5 rounded border border-black text-[11px]">
                📅 {formatShortDate(hoveredDay.date)}
              </span>
              <span className="font-heading font-extrabold text-[#8338EC] dark:text-[#A78BFA] text-sm">
                {hoveredDay.duration} Jam Total
              </span>
              {hoveredDay.sessions && hoveredDay.sessions.length > 0 ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {hoveredDay.sessions.map((sess, idx) => {
                    const cfg = getSessionColorConfig(sess, idx);
                    return (
                      <span
                        key={idx}
                        className={`neo-badge text-[10px] py-0.5 px-2 font-bold ${cfg.bg} ${cfg.text} border border-black shadow-[1px_1px_0px_#000]`}
                      >
                        {cfg.icon} {sess.name || `Sesi ${idx + 1}`}: {sess.startTime?.slice(0, 5)} - {sess.endTime?.slice(0, 5)} ({sess.duration}h)
                      </span>
                    );
                  })}
                </div>
              ) : (
                <span className="text-zinc-500">
                  {hoveredDay.bedtime && hoveredDay.wake_time ? `${hoveredDay.bedtime.slice(0, 5)} - ${hoveredDay.wake_time?.slice(0, 5)}` : 'Input Cepat'}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
              <span className="text-[#8338EC]">💡</span>
              <span>
                {hoveredDay
                  ? `${formatShortDate(hoveredDay.date)}: Belum ada catatan tidur (Klik untuk mencatat)`
                  : 'Arahkan kursor ke batang grafik untuk melihat rincian warna sesi siang & malam'}
              </span>
            </div>
          )}

          {hoveredDay?.hasData && (
            <span className="neo-badge text-[10px] py-0.5 px-2 bg-black text-[#00E5CC] font-bold">
              {hoveredDay.quality || 'Baik'}
            </span>
          )}
        </div>

        {/* Chart Canvas Container */}
        <div className="p-4 bg-[#F6F4EE] dark:bg-[#151518] border-2 border-black rounded-[6px] shadow-[3px_3px_0px_#000]">
          <div className="relative pt-6 pb-2">
            {/* Guide line for 7.5 hours */}
            <div
              className="absolute left-0 right-0 border-b-2 border-dashed border-[#00A855]/60 z-0 pointer-events-none"
              style={{ bottom: `${(7.5 / maxChartHour) * 100}%` }}
            >
              <span className="absolute -top-3.5 right-0 text-[9px] font-mono font-extrabold text-[#00A855] bg-white dark:bg-[#151518] px-1.5 border border-[#00A855] rounded">
                Garis Ideal: 7.5 Jam
              </span>
            </div>

            {/* Bars */}
            <div className="flex items-end gap-1 sm:gap-1.5 h-44 relative z-10 overflow-x-auto no-scrollbar pb-1">
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
                    className="flex-1 min-w-[10px] sm:min-w-[14px] flex flex-col items-center h-full justify-end cursor-pointer group relative"
                    onMouseEnter={() => setHoveredDay(d)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onClick={() => {
                      const found = monthlySleepRecords.find(r => r.record_date === d.date);
                      if (found) {
                        handleOpenEdit(found);
                      } else {
                        handleOpenAdd(d.date);
                      }
                    }}
                  >
                    {/* Inline Hover Value Indicator (Above Bar) */}
                    {isHovered && d.duration > 0 && (
                      <div className="absolute bottom-[calc(100%-8px)] mb-1 flex flex-col items-center pointer-events-none z-30">
                        {sortedSessions.length > 1 && (
                          <span className="text-[8px] font-mono font-extrabold bg-[#8338EC] text-white px-1 py-0 rounded border border-black shadow-[1px_1px_0px_#000] whitespace-nowrap mb-0.5">
                            {sortedSessions.length}S
                          </span>
                        )}
                        <span className="text-[9px] font-mono font-extrabold text-black dark:text-white bg-[#FFE600] px-1 py-0 rounded border border-black shadow-[1px_1px_0px_#000] whitespace-nowrap">
                          {d.duration}h
                        </span>
                      </div>
                    )}

                    {/* The Stacked Bar (Berbeda Warna per Sesi) */}
                    {d.duration > 0 ? (
                      <div
                        className={`w-full flex flex-col-reverse justify-start rounded-t-[3px] border-t-2 border-x-2 border-black overflow-hidden transition-all duration-150 shadow-[1px_1px_0px_#000] ${
                          isHovered ? 'ring-2 ring-[#FFE600] scale-y-105 shadow-[2px_2px_0px_#000]' : ''
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
                                style={{ flex: `${sess.duration || 1} 1 0%`, minHeight: '5px' }}
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
                      className={`text-[8px] sm:text-[9px] font-mono font-bold mt-1 select-none transition-colors ${
                        isHovered
                          ? 'bg-[#FFE600] text-black px-1 rounded-sm shadow-[1px_1px_0px_#000]'
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

      {/* 5. RIWAYAT & DAFTAR LOG JAM TIDUR (CRUD: EDIT & HAPUS) */}
      <div className="bg-white dark:bg-[#1E1E24] border-3 border-black shadow-[6px_6px_0px_#000000] p-5 sm:p-6 rounded-[6px]">
        {/* Header Table */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black text-[#FFE600] border-2 border-black flex items-center justify-center rounded-[3px]">
              <BedDouble className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-tight text-black dark:text-white">
                RIWAYAT LENGKAP LOG JAM TIDUR ({activeMonthName.toUpperCase()})
              </h3>
              <p className="text-xs font-mono text-zinc-500">
                Daftar semua entri istirahat tidur yang tercatat pada bulan ini.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="neo-btn bg-[#F6F4EE] dark:bg-[#25252A] text-black dark:text-white hover:bg-zinc-200 py-1.5 px-3 text-xs font-mono font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortOrder === 'desc' ? 'Terbaru → Terlama' : 'Terlama → Terbaru'}</span>
            </button>
          </div>
        </div>

        {/* Content List */}
        {sortedRecords.length === 0 ? (
          <div className="p-8 text-center bg-[#F6F4EE] dark:bg-[#151518] border-2 border-dashed border-zinc-400 rounded-[6px] space-y-3">
            <div className="w-12 h-12 bg-[#8338EC]/20 text-[#8338EC] dark:text-[#A78BFA] border-2 border-black rounded-full flex items-center justify-center mx-auto">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-base uppercase text-black dark:text-white">
                Belum Ada Catatan Jam Tidur di Bulan {activeMonthName}
              </h4>
              <p className="text-xs font-mono text-zinc-500 max-w-md mx-auto mt-1">
                Mulai lacak durasi dan kualitas istirahat Anda untuk memastikan energi dan fokus tetap optimal setiap hari.
              </p>
            </div>
            <button
              onClick={() => handleOpenAdd()}
              className="neo-btn bg-[#8338EC] text-white hover:bg-[#6c2bd9] py-2 px-4 text-xs font-extrabold shadow-[2px_2px_0px_#000]"
            >
              + Catat Jam Tidur Sekarang
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-black bg-[#F6F4EE] dark:bg-[#151518] text-[11px] font-heading font-extrabold uppercase text-zinc-600 dark:text-zinc-400">
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Durasi</th>
                  <th className="py-2.5 px-3">Jam Tidur & Bangun</th>
                  <th className="py-2.5 px-3">Kualitas</th>
                  <th className="py-2.5 px-3">Catatan</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs font-mono">
                {sortedRecords.map((record) => (
                  <tr
                    key={record.id || record.record_date}
                    className="hover:bg-[#F6F4EE]/60 dark:hover:bg-[#25252A]/50 transition-colors"
                  >
                    {/* Tanggal */}
                    <td className="py-3 px-3 font-bold text-black dark:text-white whitespace-nowrap">
                      {formatIndonesianDate(record.record_date)}
                    </td>

                    {/* Durasi */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-heading font-extrabold text-sm text-[#8338EC] dark:text-[#A78BFA]">
                        {record.duration_hours} Jam
                      </span>
                      {record.duration_hours >= 7 && record.duration_hours <= 9 && (
                        <span className="ml-1.5 text-[10px] neo-badge bg-[#00D26A] text-black py-0 px-1 font-bold">
                          Optimal
                        </span>
                      )}
                    </td>

                    {/* Jam Mulai & Bangun / Multi-Sesi */}
                    <td className="py-3 px-3 whitespace-nowrap text-zinc-600 dark:text-zinc-400">
                      {record.sessions && record.sessions.length > 0 ? (
                        <div className="space-y-1">
                          {record.sessions.length > 1 && (
                            <span className="neo-badge bg-[#8338EC] text-white text-[9px] py-0 px-1.5 font-bold inline-block mb-0.5">
                              {record.sessions.length} Sesi Terpisah
                            </span>
                          )}
                          <div className="flex flex-col gap-0.5">
                            {record.sessions.map((sess, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                                <Clock className="w-3 h-3 text-[#8338EC] shrink-0" />
                                <span className="font-bold text-black dark:text-white">
                                  {sess.name || `Sesi ${idx + 1}`}:
                                </span>
                                <span className="font-mono text-zinc-700 dark:text-zinc-300">
                                  {sess.startTime?.slice(0, 5)} - {sess.endTime?.slice(0, 5)}
                                </span>
                                <span className="text-[10px] text-zinc-500 font-semibold">
                                  ({sess.duration}h)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : record.bedtime && record.wake_time ? (
                        <span className="flex items-center gap-1 font-bold">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          {record.bedtime?.slice(0, 5)} - {record.wake_time?.slice(0, 5)}
                        </span>
                      ) : (
                        <span className="text-zinc-400 italic">Tidak ditentukan</span>
                      )}
                    </td>

                    {/* Kualitas */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`neo-badge text-[10px] py-0.5 px-2 font-bold ${getQualityBadge(record.quality)}`}>
                        {record.quality || 'Baik'}
                      </span>
                    </td>

                    {/* Catatan (Bersih tanpa metadata) */}
                    <td className="py-3 px-3 text-zinc-700 dark:text-zinc-300 max-w-xs truncate">
                      {record.cleanNotes || record.notes ? (
                        <span>{record.cleanNotes || record.notes}</span>
                      ) : (
                        <span className="text-zinc-400 italic">-</span>
                      )}
                    </td>

                    {/* Aksi: Edit & Hapus */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(record)}
                          title="Ubah Catatan Tidur"
                          className="p-1.5 bg-[#FFE600] text-black border border-black rounded shadow-[1px_1px_0px_#000] hover:bg-yellow-300 active:translate-y-0.5 transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(record)}
                          title="Hapus Catatan Tidur"
                          className="p-1.5 bg-[#FF4B4B] text-white border border-black rounded shadow-[1px_1px_0px_#000] hover:bg-red-600 active:translate-y-0.5 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. POPUP MODAL (EDIT & TAMBAH) */}
      <SleepModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        onSaveSleep={onSaveSleep}
        selectedDate={selectedDate}
        existingRecord={editingRecord}
      />
    </div>
  );
}
