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
    <div className="bg-white dark:bg-[#1E1E24] border-2 border-black shadow-[3px_3px_0px_#000] p-3 sm:p-3.5 rounded-[4px] h-full flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="pb-2.5 mb-2.5 border-b-2 border-black space-y-2">
          {/* Row 1: Icon + Title + Progress Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 bg-[#FFE600] border-2 border-black flex items-center justify-center rounded-[3px] shadow-[1px_1px_0px_#000] shrink-0">
                <Clock className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
              </div>
              <h3 className="font-heading font-extrabold text-xs sm:text-sm text-black dark:text-white uppercase tracking-tight whitespace-nowrap">
                TO-DO LIST HARIAN
              </h3>
            </div>

            <span className="neo-badge bg-[#FFE600] text-black text-[9px] py-0.5 px-2 font-bold border border-black shadow-[1px_1px_0px_#000] shrink-0">
              {completed}/{total} SELESAI
            </span>
          </div>

          {/* Row 2: Date + Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <p className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1 truncate">
              📅 {formatIndonesianDate(selectedDate)}
            </p>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
                className="neo-btn neo-btn-primary text-[10px] py-1 px-2.5 flex items-center gap-1 shadow-[1px_1px_0px_#000]"
              >
                <Plus className="w-3 h-3" strokeWidth={3} />
                {isQuickAddOpen ? 'BATAL' : '+ TAMBAH'}
              </button>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('todos')}
                  className="neo-btn neo-btn-secondary text-[10px] py-1 px-2 flex items-center gap-0.5 shadow-[1px_1px_0px_#000]"
                  title="Buka Kalender To-Do Lengkap"
                >
                  <span>SEMUA</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Add Form Drawer */}
        {isQuickAddOpen && (
          <form
            onSubmit={handleQuickAdd}
            className="bg-[#F6F4EE] border-2 border-black p-2.5 rounded-[4px] shadow-[2px_2px_0px_#000] mb-2.5 space-y-2 animate-in fade-in duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-heading font-extrabold text-black uppercase">
                ⚡ Tambah Tugas Hari Ini
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-6">
                <input
                  type="text"
                  placeholder="Judul agenda..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                  className="neo-input text-xs py-1.5"
                  autoFocus
                />
              </div>
              <div className="sm:col-span-3">
                <div className="flex items-center gap-1 bg-white border border-black px-1.5 py-1 rounded-[3px]">
                  <span className="text-[9px] font-mono text-zinc-500 font-bold">JAM:</span>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-xs font-mono font-bold border-none outline-none bg-transparent"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <div className="flex items-center gap-1 bg-white border border-black px-1.5 py-1 rounded-[3px]">
                  <span className="text-[9px] font-mono text-zinc-500 font-bold">S/D:</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full text-xs font-mono font-bold border-none outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-1.5">
              <button
                type="submit"
                disabled={isSubmitting || !taskTitle.trim()}
                className="neo-btn neo-btn-primary text-[10px] py-1 px-3"
              >
                {isSubmitting ? 'MENYIMPAN...' : 'SIMPAN'}
              </button>
            </div>
          </form>
        )}

        {/* Today's Tasks List */}
        {todos.length === 0 ? (
          <div className="p-5 text-center border-2 border-dashed border-black bg-[#FAF8F3] dark:bg-[#1E1E24] rounded-[4px] my-2">
            <Clock className="w-6 h-6 text-zinc-400 mx-auto mb-1.5" />
            <h4 className="font-heading font-extrabold text-xs text-black dark:text-white uppercase mb-0.5">
              Belum Ada Tugas Hari Ini
            </h4>
            <p className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 max-w-xs mx-auto">
              Gunakan "+ TAMBAH" di atas untuk menjadwalkan agenda harian.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-1.5 my-1.5 pr-0.5 max-h-[520px] xl:max-h-[640px] no-scrollbar">
            {todos.map((todo) => {
              const isDone = todo.is_completed;
              return (
                <div
                  key={todo.id}
                  className={`flex items-center justify-between p-2 border-2 border-black rounded-[3px] transition-all select-none ${
                    isDone
                      ? 'bg-[#F6F4EE] dark:bg-[#1A1A1E] opacity-75 shadow-none'
                      : 'bg-white dark:bg-[#1E1E24] shadow-[2px_2px_0px_#000] hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Time Badge */}
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border border-black shrink-0 ${
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
                      className="neo-checkbox shrink-0 cursor-pointer w-3.5 h-3.5"
                    />

                    {/* Title */}
                    <span
                      onClick={() => onToggleTodo(todo.id, !isDone)}
                      className={`text-xs font-semibold truncate cursor-pointer ${
                        isDone
                          ? 'line-through text-zinc-500 dark:text-zinc-400'
                          : 'text-black dark:text-white'
                      }`}
                    >
                      {todo.task_title}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0 ml-1.5">
                    {isDone ? (
                      <span className="neo-badge bg-[#00D26A] text-black text-[9px] py-0.5 px-1.5 font-bold flex items-center gap-0.5 border border-black shadow-[1px_1px_0px_#000]">
                        <CheckCircle2 className="w-2.5 h-2.5" strokeWidth={3} />
                        SELESAI
                      </span>
                    ) : (
                      <span className="neo-badge bg-[#00E5CC] text-black text-[9px] py-0.5 px-1.5 font-bold border border-black shadow-[1px_1px_0px_#000]">
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

      {/* Bottom Summary Footer */}
      <div className="mt-2.5 pt-2 border-t-2 border-black flex items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-zinc-700 dark:text-zinc-300">
            {completed} Beres • {total - completed} Sisa
          </span>
          <span className="neo-badge bg-[#FFE600] text-black text-[9px] py-0 px-1 font-bold border border-black shadow-[1px_1px_0px_#000]">
            {percentage}%
          </span>
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate('todos')}
            className="text-[10px] font-heading font-extrabold text-[#8338EC] dark:text-[#A78BFA] hover:underline flex items-center gap-0.5"
          >
            <span>Kalender Lengkap</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
    </div>
  );
}
