import React, { useState } from 'react';
import { CheckSquare, Clock, Plus, ArrowRight, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { formatTime, formatIndonesianDate } from '../../lib/utils.js';

export default function DailyTodoSection({
  todos = [],
  selectedDate,
  onToggleTodo,
  onAddTodo,
  onNavigate
}) {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = todos.length;
  const completed = todos.filter(t => t.is_completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setIsSubmitting(true);
    try {
      if (onAddTodo) {
        await onAddTodo({
          task_title: taskTitle.trim(),
          start_time: startTime,
          end_time: endTime,
          target_date: selectedDate,
          is_completed: false
        });
      }
      setTaskTitle('');
      setIsQuickAddOpen(false);
    } catch (err) {
      console.error("Gagal menambah to-do:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border-3 border-black shadow-[6px_6px_0px_#000000] p-5 sm:p-6 rounded-[6px]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b-2 border-black">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#FFE600] border-2 border-black flex items-center justify-center rounded-[4px] shadow-[2px_2px_0px_#000]">
            <Clock className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-black dark:text-white uppercase tracking-tight">
                TO-DO LIST HARI INI
              </h3>
              <span className="neo-badge bg-[#FFE600] text-black text-[10px] py-0.5 px-2 font-bold">
                {completed}/{total} SELESAI
              </span>
            </div>
            <p className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">
              📅 {formatIndonesianDate(selectedDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
            className="neo-btn neo-btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={3} />
            {isQuickAddOpen ? 'BATAL' : 'TAMBAH CEPAT'}
          </button>
          {onNavigate && (
            <button
              onClick={() => onNavigate('todos')}
              className="neo-btn neo-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 shadow-[2px_2px_0px_#000]"
            >
              SEMUA AGENDA ➜
            </button>
          )}
        </div>
      </div>

      {/* Quick Add Form Drawer */}
      {isQuickAddOpen && (
        <form
          onSubmit={handleQuickAdd}
          className="bg-[#F6F4EE] border-2 border-black p-3.5 rounded-[4px] shadow-[2px_2px_0px_#000] mb-4 space-y-3 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-extrabold text-black uppercase">
              ⚡ Tambah Tugas ke Hari Ini ({formatIndonesianDate(selectedDate)})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-6">
              <input
                type="text"
                placeholder="Judul agenda tugas (misal: Meeting Proyek)..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
                className="neo-input text-xs py-2"
                autoFocus
              />
            </div>
            <div className="sm:col-span-3">
              <div className="flex items-center gap-1 bg-white border-2 border-black px-2 py-1.5 rounded-[4px]">
                <span className="text-[10px] font-mono text-zinc-500 font-bold">JAM:</span>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-xs font-mono font-bold border-none outline-none bg-transparent"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <div className="flex items-center gap-1 bg-white border-2 border-black px-2 py-1.5 rounded-[4px]">
                <span className="text-[10px] font-mono text-zinc-500 font-bold">S/D:</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full text-xs font-mono font-bold border-none outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={isSubmitting || !taskTitle.trim()}
              className="neo-btn neo-btn-primary text-xs py-1.5 px-4"
            >
              {isSubmitting ? 'MENYIMPAN...' : 'SIMPAN KE JADWAL'}
            </button>
          </div>
        </form>
      )}

      {/* Today's Tasks List */}
      {todos.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-black bg-[#FAF8F3] dark:bg-[#1E1E24] rounded-[4px]">
          <Clock className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <h4 className="font-heading font-extrabold text-sm text-black dark:text-white uppercase mb-1">
            Belum Ada Tugas Terjadwal Hari Ini
          </h4>
          <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            Gunakan tombol "Tambah Cepat" di atas atau buka halaman Jadwal To-Do untuk mengatur blok waktu produktif harianmu.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {todos.map((todo) => {
            const isDone = todo.is_completed;
            return (
              <div
                key={todo.id}
                className={`flex items-center justify-between p-3 border-2 border-black rounded-[4px] transition-all select-none ${
                  isDone
                    ? 'bg-[#F6F4EE] dark:bg-[#1A1A1E] opacity-75 shadow-none'
                    : 'bg-white dark:bg-[#1E1E24] shadow-[3px_3px_0px_#000] hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Time Badge */}
                  <span
                    className={`font-mono text-xs font-bold px-2 py-1 border border-black shrink-0 ${
                      isDone ? 'bg-zinc-200 text-zinc-700' : 'bg-[#FFE600] text-black shadow-[1px_1px_0px_#000]'
                    }`}
                  >
                    {formatTime(todo.start_time)} - {formatTime(todo.end_time)}
                  </span>

                  {/* Interactive Checkbox */}
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={(e) => onToggleTodo(todo.id, e.target.checked)}
                    className="neo-checkbox shrink-0 cursor-pointer"
                  />

                  {/* Title */}
                  <span
                    onClick={() => onToggleTodo(todo.id, !isDone)}
                    className={`text-xs sm:text-sm font-semibold truncate cursor-pointer ${
                      isDone
                        ? 'line-through text-zinc-500 dark:text-zinc-400'
                        : 'text-black dark:text-white'
                    }`}
                  >
                    {todo.task_title}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="shrink-0 ml-2">
                  {isDone ? (
                    <span className="neo-badge bg-[#00D26A] text-black text-[10px] py-0.5 px-2 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" strokeWidth={3} />
                      SELESAI
                    </span>
                  ) : (
                    <span className="neo-badge bg-[#00E5CC] text-black text-[10px] py-0.5 px-2 font-bold">
                      TERJADWAL
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
