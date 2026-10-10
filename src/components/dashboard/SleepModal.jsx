import React, { useState, useEffect } from 'react';
import { Moon, Sun, X, Clock, Sparkles, Check, BedDouble } from 'lucide-react';
import { getTodayDateString, formatShortDate } from '../../lib/utils.js';

const QUICK_DURATIONS = [5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

export default function SleepModal({
  isOpen,
  onClose,
  onSaveSleep,
  selectedDate,
  existingRecord
}) {
  const [recordDate, setRecordDate] = useState(selectedDate || getTodayDateString());
  const [durationHours, setDurationHours] = useState(7.5);
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [useTimeRange, setUseTimeRange] = useState(false);
  const [quality, setQuality] = useState('Baik');
  const [notes, setNotes] = useState('');

  // Sync if existing record passed
  useEffect(() => {
    if (existingRecord) {
      setRecordDate(existingRecord.record_date || selectedDate || getTodayDateString());
      setDurationHours(Number(existingRecord.duration_hours) || 7.5);
      setBedtime(existingRecord.bedtime?.slice(0, 5) || '23:00');
      setWakeTime(existingRecord.wake_time?.slice(0, 5) || '06:30');
      setUseTimeRange(Boolean(existingRecord.bedtime && existingRecord.wake_time));
      setQuality(existingRecord.quality || 'Baik');
      setNotes(existingRecord.notes || '');
    } else {
      setRecordDate(selectedDate || getTodayDateString());
      setDurationHours(7.5);
      setBedtime('23:00');
      setWakeTime('06:30');
      setQuality('Baik');
      setNotes('');
    }
  }, [existingRecord, selectedDate, isOpen]);

  if (!isOpen) return null;

  // Calculate duration from bedtime and waketime
  const handleCalculateFromTimes = (newBed, newWake) => {
    const b = newBed || bedtime;
    const w = newWake || wakeTime;
    if (!b || !w) return;

    const [bH, bM] = b.split(':').map(Number);
    const [wH, wM] = w.split(':').map(Number);
    let diffMinutes = (wH * 60 + wM) - (bH * 60 + bM);
    if (diffMinutes <= 0) {
      // Crossed midnight (e.g., 23:00 to 07:00)
      diffMinutes += 24 * 60;
    }
    const calculatedHours = Number((diffMinutes / 60).toFixed(1));
    setDurationHours(Math.min(Math.max(calculatedHours, 1), 24));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalDuration = Number(durationHours);
    if (isNaN(finalDuration) || finalDuration <= 0) {
      alert('Durasi jam tidur harus lebih dari 0 jam.');
      return;
    }

    onSaveSleep({
      id: existingRecord?.id,
      record_date: recordDate,
      duration_hours: finalDuration,
      bedtime: useTimeRange ? bedtime : null,
      wake_time: useTimeRange ? wakeTime : null,
      quality,
      notes: notes.trim() || null
    });
    onClose();
  };

  const getQualityBadge = (q) => {
    switch (q) {
      case 'Sangat Baik': return 'bg-[#00D26A] text-black';
      case 'Baik': return 'bg-[#00E5CC] text-black';
      case 'Cukup': return 'bg-[#FFE600] text-black';
      case 'Kurang': return 'bg-[#FF4B4B] text-white';
      default: return 'bg-zinc-200 text-black';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#1E1E24] border-3 border-black shadow-[8px_8px_0px_#000000] rounded-[6px] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#8338EC] text-white p-4 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FFE600] border-2 border-black flex items-center justify-center rounded-[3px] shadow-[2px_2px_0px_#000]">
              <Moon className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-white/80 block">
                PELACAK KESEHATAN
              </span>
              <h2 className="font-heading font-extrabold text-base uppercase tracking-tight">
                {existingRecord ? 'UBAH CATATAN TIDUR' : 'CATAT JAM TIDUR'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white hover:text-black hover:bg-white rounded border border-transparent hover:border-black transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Tanggal */}
          <div>
            <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-black dark:text-white">
              Tanggal Catatan Tidur
            </label>
            <input
              type="date"
              value={recordDate}
              onChange={(e) => setRecordDate(e.target.value)}
              className="neo-input font-mono text-xs sm:text-sm bg-white dark:bg-[#151518]"
              required
            />
          </div>

          {/* Durasi Utama (Big Display & Slider) */}
          <div className="p-4 bg-[#F6F4EE] dark:bg-[#151518] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-heading font-extrabold uppercase text-zinc-700 dark:text-zinc-300">
                Durasi Total Tidur
              </span>
              <span className="font-mono font-black text-xl sm:text-2xl text-[#8338EC] dark:text-[#A78BFA]">
                {durationHours} Jam
              </span>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {QUICK_DURATIONS.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDurationHours(dur)}
                  className={`text-[11px] font-mono font-bold px-2 py-1 rounded-[3px] border border-black transition-all ${
                    durationHours === dur
                      ? 'bg-[#FFE600] text-black shadow-[1px_1px_0px_#000] scale-105'
                      : 'bg-white dark:bg-[#25252A] text-black dark:text-white hover:bg-zinc-200'
                  }`}
                >
                  {dur}h
                </button>
              ))}
            </div>

            {/* Slider */}
            <input
              type="range"
              min="1"
              max="14"
              step="0.5"
              value={durationHours}
              onChange={(e) => setDurationHours(parseFloat(e.target.value))}
              className="w-full accent-[#8338EC] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono font-bold text-zinc-500 mt-1">
              <span>1 Jam (Kurang)</span>
              <span className="text-[#00A855]">Ideal 7-9 Jam</span>
              <span>14 Jam</span>
            </div>
          </div>

          {/* Toggle Jam Tidur & Jam Bangun (Opsional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <button
                type="button"
                onClick={() => setUseTimeRange(!useTimeRange)}
                className="text-xs font-mono font-bold text-[#8338EC] dark:text-[#A78BFA] hover:underline flex items-center gap-1"
              >
                <Clock className="w-3.5 h-3.5" />
                {useTimeRange ? '- Sembunyikan Jam Mulai & Bangun' : '+ Tentukan Jam Tidur & Bangun (Opsional)'}
              </button>
            </div>

            {useTimeRange && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-white dark:bg-[#151518] border-2 border-black rounded-[4px]">
                <div>
                  <label className="text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-400 block mb-1">
                    Jam Mulai Tidur
                  </label>
                  <input
                    type="time"
                    value={bedtime}
                    onChange={(e) => {
                      setBedtime(e.target.value);
                      handleCalculateFromTimes(e.target.value, wakeTime);
                    }}
                    className="neo-input text-xs font-mono py-1 px-2"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-400 block mb-1">
                    Jam Bangun
                  </label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => {
                      setWakeTime(e.target.value);
                      handleCalculateFromTimes(bedtime, e.target.value);
                    }}
                    className="neo-input text-xs font-mono py-1 px-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Kualitas Tidur */}
          <div>
            <label className="block text-xs font-heading font-extrabold uppercase mb-1.5 text-black dark:text-white">
              Kualitas Tidur
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {['Sangat Baik', 'Baik', 'Cukup', 'Kurang'].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuality(q)}
                  className={`py-1.5 text-[11px] font-heading font-extrabold border-2 border-black rounded-[3px] transition-all ${
                    quality === q
                      ? `${getQualityBadge(q)} shadow-[2px_2px_0px_#000] scale-102`
                      : 'bg-white dark:bg-[#151518] text-black dark:text-white hover:bg-zinc-100 opacity-70'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Catatan (Opsional) */}
          <div>
            <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-black dark:text-white">
              Catatan (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Tidur nyenyak, minum chamomile, dll..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="neo-input text-xs sm:text-sm py-2 px-3"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full neo-btn bg-[#8338EC] text-white hover:bg-[#6c2bd9] py-3 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000] active:translate-y-0.5"
            >
              <BedDouble className="w-4 h-4 text-white" strokeWidth={2.5} />
              SIMPAN JAM TIDUR ({durationHours} JAM)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
