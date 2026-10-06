import React, { useState, useEffect } from 'react';
import { X, Clock, Plus, Save } from 'lucide-react';
import { getTodayDateString } from '../../lib/utils.js';

// Helper to add minutes to HH:mm
const addMinutesToTime = (timeStr, minutesToAdd) => {
  const [h, m] = (timeStr || '09:00').split(':').map(Number);
  let totalMin = h * 60 + m + minutesToAdd;
  if (totalMin < 0) totalMin = 0;
  if (totalMin > 23 * 60 + 59) totalMin = 23 * 60 + 59;
  const newH = String(Math.floor(totalMin / 60)).padStart(2, '0');
  const newM = String(totalMin % 60).padStart(2, '0');
  return `${newH}:${newM}`;
};

export default function TodoModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null, // if null -> Add mode; if object -> Edit mode
  selectedDate
}) {
  const [taskTitle, setTaskTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [targetDate, setTargetDate] = useState(selectedDate || getTodayDateString());
  const [error, setError] = useState('');

  const isEditMode = Boolean(initialData && initialData.id);

  // Sync state when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTaskTitle(initialData.task_title || '');
        setStartTime(initialData.start_time?.slice(0, 5) || '09:00');
        setEndTime(initialData.end_time?.slice(0, 5) || '10:00');
        setTargetDate(initialData.target_date || selectedDate || getTodayDateString());
      } else {
        setTaskTitle('');
        setStartTime('09:00');
        setEndTime('10:00');
        setTargetDate(selectedDate || getTodayDateString());
      }
      setError('');
    }
  }, [isOpen, initialData, selectedDate]);

  if (!isOpen) return null;

  // Quick Duration button
  const handleSetDuration = (durationMin) => {
    setEndTime(addMinutesToTime(startTime, durationMin));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setError('Judul agenda tugas tidak boleh kosong.');
      return;
    }
    if (!startTime || !endTime) {
      setError('Jam mulai dan jam selesai harus diisi.');
      return;
    }
    if (startTime >= endTime) {
      setError('Jam selesai harus setelah jam mulai.');
      return;
    }

    setError('');
    onSubmit({
      id: initialData?.id,
      task_title: taskTitle.trim(),
      target_date: targetDate,
      start_time: startTime,
      end_time: endTime,
      is_completed: initialData?.is_completed || false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
      <div className="w-full max-w-md bg-white border-3 border-black shadow-[8px_8px_0px_#000000] rounded-[6px] overflow-hidden my-6 animate-in fade-in duration-150">
        {/* Header Bar */}
        <div className="bg-black text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#FFE600] text-black border border-black flex items-center justify-center font-heading font-extrabold text-xs">
              <Clock className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider">
              {isEditMode ? 'EDIT AGENDA TUGAS' : 'TAMBAH BLOK WAKTU'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-white text-black hover:bg-[#FF4B4B] hover:text-white border-2 border-black flex items-center justify-center font-bold transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-[#FFE4E4] border-2 border-[#FF4B4B] text-black font-mono text-xs rounded-[4px] shadow-[2px_2px_0px_#FF4B4B]">
              <strong>⚠ PERHATIAN:</strong> {error}
            </div>
          )}

          {/* Task Title */}
          <div>
            <label className="block text-xs font-heading font-extrabold uppercase mb-1.5 text-black">
              Judul Agenda / Tugas <span className="text-[#FF4B4B]">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Diskusi arsitektur proyek, review laporan kas..."
              value={taskTitle}
              onChange={(e) => {
                setTaskTitle(e.target.value);
                if (error) setError('');
              }}
              className="neo-input text-sm"
              autoFocus
              required
            />
          </div>

          {/* Target Date */}
          <div>
            <label className="block text-xs font-heading font-extrabold uppercase mb-1.5 text-black">
              Tanggal Agenda
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="neo-input font-mono text-xs sm:text-sm"
              required
            />
          </div>

          {/* Clean 2-Column Time Inputs */}
          <div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-heading font-extrabold uppercase mb-1.5 text-black">
                  Jam Mulai
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="neo-input font-mono font-extrabold text-base text-center py-2.5"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-extrabold uppercase mb-1.5 text-black">
                  Jam Selesai
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="neo-input font-mono font-extrabold text-base text-center py-2.5"
                  required
                />
              </div>
            </div>

            {/* Simple Quick Duration Chips */}
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase">
                Durasi Cepat:
              </span>
              {[
                { label: '+30m', min: 30 },
                { label: '+1 Jam', min: 60 },
                { label: '+2 Jam', min: 120 },
              ].map((dur, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSetDuration(dur.min)}
                  className="text-xs font-mono font-bold px-2.5 py-1 bg-[#F6F4EE] hover:bg-[#FFE600] active:translate-y-0.5 border border-black rounded-[3px] transition-colors shadow-[1px_1px_0px_#000]"
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center gap-3 pt-3 border-t-2 border-black/10">
            <button
              type="submit"
              className="flex-1 neo-btn neo-btn-primary py-2.5 sm:py-3 text-xs sm:text-sm"
            >
              {isEditMode ? (
                <>
                  <Save className="w-4 h-4 text-black" strokeWidth={2.5} />
                  SIMPAN PERUBAHAN
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-black" strokeWidth={3} />
                  TAMBAHKAN KE JADWAL
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="neo-btn neo-btn-secondary py-2.5 sm:py-3 px-4 text-xs sm:text-sm"
            >
              BATAL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
