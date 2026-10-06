import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { getTodayDateString } from '../../lib/utils.js';

const addMinutesToTime = (timeStr, minutesToAdd) => {
  const [h, m] = (timeStr || '09:00').split(':').map(Number);
  let totalMin = h * 60 + m + minutesToAdd;
  if (totalMin < 0) totalMin = 0;
  if (totalMin > 23 * 60 + 59) totalMin = 23 * 60 + 59;
  const newH = String(Math.floor(totalMin / 60)).padStart(2, '0');
  const newM = String(totalMin % 60).padStart(2, '0');
  return `${newH}:${newM}`;
};

export default function TodoForm({ onAddTodo, selectedDate }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [error, setError] = useState('');

  const handleSetDuration = (durationMin) => {
    setEndTime(addMinutesToTime(startTime, durationMin));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setError('Judul tugas tidak boleh kosong');
      return;
    }
    if (!startTime || !endTime) {
      setError('Jam mulai dan jam selesai harus diisi');
      return;
    }
    if (startTime >= endTime) {
      setError('Jam selesai harus setelah jam mulai');
      return;
    }

    setError('');
    onAddTodo({
      task_title: taskTitle.trim(),
      target_date: selectedDate || getTodayDateString(),
      start_time: startTime,
      end_time: endTime,
      is_completed: false,
    });

    setTaskTitle('');
    setStartTime(endTime);
    setEndTime(addMinutesToTime(endTime, 60));
  };

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] p-4 sm:p-5 rounded-[6px] mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-[#FFE600] border-2 border-black flex items-center justify-center rounded-[3px]">
          <Clock className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
        </div>
        <h3 className="font-heading font-extrabold text-sm uppercase tracking-wide text-black">
          Tambah Blok Waktu Tugas
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Task Title */}
        <div>
          <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-black">
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
            className={`neo-input ${error ? 'error' : ''}`}
          />
          {error && (
            <p className="text-xs font-bold text-[#FF4B4B] mt-1 font-mono">
              ⚠ {error}
            </p>
          )}
        </div>

        {/* Clean 2-Column Time Inputs */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-black">
                Jam Mulai
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="neo-input font-mono font-bold text-center"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-extrabold uppercase mb-1 text-black">
                Jam Selesai
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="neo-input font-mono font-bold text-center"
                required
              />
            </div>
          </div>

          {/* Quick duration chips */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
              Durasi:
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
                className="text-[11px] font-mono font-bold px-2 py-0.5 bg-[#F6F4EE] hover:bg-[#FFE600] border border-black rounded transition-colors"
              >
                {dur.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full neo-btn neo-btn-primary py-2.5 text-xs sm:text-sm mt-2"
        >
          <Plus className="w-4 h-4 text-black" strokeWidth={3} />
          TAMBAH KE JADWAL HARIAN
        </button>
      </form>
    </div>
  );
}
