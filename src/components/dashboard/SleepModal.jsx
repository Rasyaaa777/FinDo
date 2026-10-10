import React, { useState, useEffect } from 'react';
import { Moon, Sun, X, Clock, Plus, Trash2, BedDouble, Check, Sparkles, Coffee, AlertCircle } from 'lucide-react';
import { getTodayDateString, calculateSessionDuration } from '../../lib/utils.js';

const QUICK_DURATIONS = [5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

const DEFAULT_PRESETS = [
  { name: 'Tidur Malam', defaultStart: '01:00', defaultEnd: '08:00', icon: '🌙' },
  { name: 'Tidur Siang', defaultStart: '13:00', defaultEnd: '15:00', icon: '☀️' },
  { name: 'Power Nap', defaultStart: '15:30', defaultEnd: '16:00', icon: '⚡' },
  { name: 'Istirahat Pagi', defaultStart: '09:30', defaultEnd: '10:30', icon: '☕' }
];

export default function SleepModal({
  isOpen,
  onClose,
  onSaveSleep,
  selectedDate,
  existingRecord
}) {
  const [recordDate, setRecordDate] = useState(selectedDate || getTodayDateString());
  const [inputMode, setInputMode] = useState('sessions'); // 'sessions' | 'quick'
  const [quickDuration, setQuickDuration] = useState(7.5);
  const [quality, setQuality] = useState('Baik');
  const [notes, setNotes] = useState('');

  // Sesi tidur list
  const [sessions, setSessions] = useState([
    { id: 'sess_1', name: 'Tidur Malam', startTime: '01:00', endTime: '08:00', duration: 7 }
  ]);

  // Sync state saat modal dibuka atau record diubah
  useEffect(() => {
    if (!isOpen) return;

    if (existingRecord) {
      setRecordDate(existingRecord.record_date || selectedDate || getTodayDateString());
      setQuality(existingRecord.quality || 'Baik');
      setNotes(existingRecord.cleanNotes || existingRecord.notes || '');

      if (Array.isArray(existingRecord.sessions) && existingRecord.sessions.length > 0) {
        setInputMode('sessions');
        setSessions(
          existingRecord.sessions.map((s, idx) => ({
            id: s.id || `sess_${idx + 1}`,
            name: s.name || (idx === 0 ? 'Tidur Malam' : 'Tidur Siang'),
            startTime: s.startTime?.slice(0, 5) || '01:00',
            endTime: s.endTime?.slice(0, 5) || '08:00',
            duration: Number(s.duration) || calculateSessionDuration(s.startTime, s.endTime)
          }))
        );
      } else if (existingRecord.bedtime && existingRecord.wake_time) {
        setInputMode('sessions');
        const start = existingRecord.bedtime.slice(0, 5);
        const end = existingRecord.wake_time.slice(0, 5);
        const dur = Number(existingRecord.duration_hours) || calculateSessionDuration(start, end);
        setSessions([
          { id: 'sess_1', name: 'Tidur Utama', startTime: start, endTime: end, duration: dur }
        ]);
      } else {
        // Hanya ada durasi jam
        setInputMode('quick');
        setQuickDuration(Number(existingRecord.duration_hours) || 7.5);
        setSessions([
          { id: 'sess_1', name: 'Tidur Malam', startTime: '01:00', endTime: '08:00', duration: 7 }
        ]);
      }
    } else {
      // Entri Baru Default: Siapkan 1 sesi malam, dengan opsi tambah siang
      setRecordDate(selectedDate || getTodayDateString());
      setInputMode('sessions');
      setQuickDuration(7.5);
      setQuality('Baik');
      setNotes('');
      setSessions([
        { id: 'sess_1', name: 'Tidur Malam', startTime: '01:00', endTime: '08:00', duration: 7 }
      ]);
    }
  }, [existingRecord, selectedDate, isOpen]);

  if (!isOpen) return null;

  // Handler update field per sesi
  const handleUpdateSession = (id, field, value) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        const updated = { ...s, [field]: value };
        if (field === 'startTime' || field === 'endTime') {
          updated.duration = calculateSessionDuration(
            field === 'startTime' ? value : s.startTime,
            field === 'endTime' ? value : s.endTime
          );
        }
        return updated;
      })
    );
  };

  // Tambah sesi baru (otomatis pilih preset yang belum ada)
  const handleAddSession = (preset) => {
    const hasNight = sessions.some(s => s.name.toLowerCase().includes('malam'));
    const chosen = preset || (hasNight
      ? { name: 'Tidur Siang', defaultStart: '13:00', defaultEnd: '15:00' }
      : { name: 'Tidur Malam', defaultStart: '01:00', defaultEnd: '08:00' }
    );

    const dur = calculateSessionDuration(chosen.defaultStart, chosen.defaultEnd);
    setSessions(prev => [
      ...prev,
      {
        id: `sess_${Date.now()}`,
        name: chosen.name,
        startTime: chosen.defaultStart,
        endTime: chosen.defaultEnd,
        duration: dur
      }
    ]);
  };

  // Hapus sesi
  const handleRemoveSession = (id) => {
    if (sessions.length <= 1) return;
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  // Hitung total jam
  const totalSessionHours = sessions.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
  const finalCalculatedDuration = inputMode === 'sessions'
    ? Number(totalSessionHours.toFixed(1))
    : Number(quickDuration);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputMode === 'sessions') {
      if (sessions.length === 0) {
        alert('Harap tambahkan minimal 1 sesi tidur.');
        return;
      }
      for (const s of sessions) {
        if (!s.startTime || !s.endTime) {
          alert(`Sesi '${s.name || 'Tidur'}' harus memiliki jam mulai dan jam bangun.`);
          return;
        }
      }
      if (finalCalculatedDuration <= 0) {
        alert('Total durasi tidur harus lebih dari 0 jam.');
        return;
      }

      onSaveSleep({
        id: existingRecord?.id,
        record_date: recordDate,
        duration_hours: finalCalculatedDuration,
        sessions: sessions.map(s => ({
          id: s.id,
          name: s.name.trim() || 'Sesi Tidur',
          startTime: s.startTime,
          endTime: s.endTime,
          duration: s.duration
        })),
        quality,
        notes: notes.trim() || null
      });
    } else {
      if (isNaN(finalCalculatedDuration) || finalCalculatedDuration <= 0) {
        alert('Durasi jam tidur harus lebih dari 0 jam.');
        return;
      }

      onSaveSleep({
        id: existingRecord?.id,
        record_date: recordDate,
        duration_hours: finalCalculatedDuration,
        sessions: [],
        bedtime: null,
        wake_time: null,
        quality,
        notes: notes.trim() || null
      });
    }

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

  const getDurationStatus = (hours) => {
    if (hours >= 7 && hours <= 9) {
      return { text: 'Optimal (7-9 Jam)', color: 'text-[#00A855] dark:text-[#00D26A]', bg: 'bg-[#00D26A]/20' };
    }
    if (hours >= 6 && hours < 7) {
      return { text: 'Cukup (Perlu Ditambah)', color: 'text-[#B45309] dark:text-[#FFE600]', bg: 'bg-[#FFE600]/20' };
    }
    if (hours < 6) {
      return { text: 'Kurang Tidur (<6 Jam)', color: 'text-[#E11D48] dark:text-[#FF4B4B]', bg: 'bg-[#FF4B4B]/20' };
    }
    return { text: 'Tidur Panjang (>9 Jam)', color: 'text-[#00897B] dark:text-[#00E5CC]', bg: 'bg-[#00E5CC]/20' };
  };

  const statusInfo = getDurationStatus(finalCalculatedDuration);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#1E1E24] border-3 border-black shadow-[8px_8px_0px_#000000] rounded-[6px] w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#8338EC] text-white p-4 border-b-2 border-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FFE600] border-2 border-black flex items-center justify-center rounded-[3px] shadow-[2px_2px_0px_#000]">
              <Moon className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-white/80 block">
                PELACAK POLA ISTIRAHAT
              </span>
              <h2 className="font-heading font-extrabold text-base uppercase tracking-tight">
                {existingRecord ? 'UBAH CATATAN TIDUR' : 'CATAT JAM TIDUR HARIAN'}
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

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Tanggal & Mode Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-black dark:text-white">
                Tanggal Catatan
              </label>
              <input
                type="date"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                className="neo-input font-mono text-xs sm:text-sm bg-white dark:bg-[#151518]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-black dark:text-white">
                Metode Input
              </label>
              <div className="grid grid-cols-2 gap-1 bg-[#F6F4EE] dark:bg-[#151518] p-1 border-2 border-black rounded">
                <button
                  type="button"
                  onClick={() => setInputMode('sessions')}
                  className={`py-1 text-[11px] font-heading font-extrabold rounded-[2px] transition-all ${
                    inputMode === 'sessions'
                      ? 'bg-[#8338EC] text-white shadow-[1px_1px_0px_#000]'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  ⏰ Jam Sesi
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('quick')}
                  className={`py-1 text-[11px] font-heading font-extrabold rounded-[2px] transition-all ${
                    inputMode === 'quick'
                      ? 'bg-[#FFE600] text-black shadow-[1px_1px_0px_#000]'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  ⚡ Input Cepat
                </button>
              </div>
            </div>
          </div>

          {/* MODE 1: SESI WAKTU (MULTI-SESI: SIANG + MALAM) */}
          {inputMode === 'sessions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-heading font-extrabold uppercase text-black dark:text-white block">
                    Daftar Sesi Tidur Hari Ini
                  </span>
                  <p className="text-[10px] font-mono text-zinc-500">
                    Bisa catat lebih dari 1 sesi (misal: tidur siang 13:00-15:00 & malam 01:00-08:00).
                  </p>
                </div>
                <span className="neo-badge bg-[#00E5CC] text-black text-[10px] py-0.5 px-2 font-bold">
                  {sessions.length} Sesi
                </span>
              </div>

              {/* List Sesi */}
              <div className="space-y-2.5">
                {sessions.map((sess, index) => (
                  <div
                    key={sess.id}
                    className="p-3 bg-[#F6F4EE] dark:bg-[#151518] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000] space-y-2 relative"
                  >
                    {/* Header Sesi */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-1">
                        <span className="w-5 h-5 bg-black text-[#FFE600] rounded font-mono font-black text-[10px] flex items-center justify-center border border-black shrink-0">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={sess.name}
                          onChange={(e) => handleUpdateSession(sess.id, 'name', e.target.value)}
                          placeholder="Nama Sesi (misal: Tidur Siang / Malam)"
                          className="neo-input text-xs font-heading font-extrabold py-0.5 px-2 bg-white dark:bg-[#25252A] flex-1 max-w-[200px]"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-xs text-[#8338EC] dark:text-[#A78BFA] bg-white dark:bg-[#25252A] px-2 py-0.5 border border-black rounded">
                          ⏱️ {sess.duration} Jam
                        </span>
                        {sessions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSession(sess.id)}
                            title="Hapus Sesi"
                            className="p-1 text-zinc-500 hover:text-[#FF4B4B] hover:bg-white dark:hover:bg-[#25252A] rounded border border-transparent hover:border-black transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Time Inputs */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <div>
                        <label className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 block mb-0.5">
                          Jam Mulai Tidur
                        </label>
                        <input
                          type="time"
                          value={sess.startTime}
                          onChange={(e) => handleUpdateSession(sess.id, 'startTime', e.target.value)}
                          className="neo-input text-xs font-mono py-1 px-2 w-full bg-white dark:bg-[#25252A]"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 block mb-0.5">
                          Jam Bangun
                        </label>
                        <input
                          type="time"
                          value={sess.endTime}
                          onChange={(e) => handleUpdateSession(sess.id, 'endTime', e.target.value)}
                          className="neo-input text-xs font-mono py-1 px-2 w-full bg-white dark:bg-[#25252A]"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preset Buttons & Tambah Sesi */}
              <div className="pt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono font-bold text-zinc-500">Preset Cepat:</span>
                  {DEFAULT_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handleAddSession(p)}
                      className="text-[10px] font-mono font-bold py-1 px-2 bg-white dark:bg-[#25252A] text-black dark:text-white hover:bg-[#FFE600] hover:text-black border border-black rounded shadow-[1px_1px_0px_#000] active:translate-y-0.5 transition-all flex items-center gap-1"
                    >
                      <span>{p.icon}</span>
                      <span>+ {p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: INPUT CEPAT (SLIDER TOTAL JAM) */}
          {inputMode === 'quick' && (
            <div className="p-4 bg-[#F6F4EE] dark:bg-[#151518] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-extrabold uppercase text-zinc-700 dark:text-zinc-300">
                  Durasi Langsung
                </span>
                <span className="font-mono font-black text-2xl text-[#8338EC] dark:text-[#A78BFA]">
                  {quickDuration} Jam
                </span>
              </div>

              {/* Quick Chips */}
              <div className="flex flex-wrap gap-1.5">
                {QUICK_DURATIONS.map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setQuickDuration(dur)}
                    className={`text-[11px] font-mono font-bold px-2 py-1 rounded-[3px] border border-black transition-all ${
                      quickDuration === dur
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
                value={quickDuration}
                onChange={(e) => setQuickDuration(parseFloat(e.target.value))}
                className="w-full accent-[#8338EC] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono font-bold text-zinc-500">
                <span>1 Jam</span>
                <span className="text-[#00A855]">Ideal 7-9 Jam</span>
                <span>14 Jam</span>
              </div>
            </div>
          )}

          {/* Ringkasan Total Durasi & Target Kesehatan */}
          <div className="p-3 bg-white dark:bg-[#151518] border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000] flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 block">
                TOTAL ISTIRAHAT HARI INI
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-black text-2xl sm:text-3xl text-[#8338EC] dark:text-[#A78BFA]">
                  {finalCalculatedDuration} Jam
                </span>
                {inputMode === 'sessions' && sessions.length > 1 && (
                  <span className="text-xs font-mono text-zinc-500">
                    ({sessions.map(s => `${s.duration}h`).join(' + ')})
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className={`neo-badge text-[10px] sm:text-xs py-1 px-2.5 font-bold ${statusInfo.bg} ${statusInfo.color} border border-black`}>
                {statusInfo.text}
              </span>
            </div>
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
              placeholder="Contoh: Tidur siang segar, malam agak begadang tapi nyenyak..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="neo-input text-xs sm:text-sm py-2 px-3 bg-white dark:bg-[#151518]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full neo-btn bg-[#8338EC] text-white hover:bg-[#6c2bd9] py-3 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000] active:translate-y-0.5"
            >
              <BedDouble className="w-4 h-4 text-white" strokeWidth={2.5} />
              SIMPAN JAM TIDUR ({finalCalculatedDuration} JAM {inputMode === 'sessions' && sessions.length > 1 ? `• ${sessions.length} SESI` : ''})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

