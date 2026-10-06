import React from 'react';
import { Calendar, Trash2, Edit3, Clock, ChevronLeft, ChevronRight, CheckSquare, Plus } from 'lucide-react';
import { formatTime, formatIndonesianDate, getTodayDateString } from '../../lib/utils.js';

export default function TodoList({
  todos = [],
  selectedDate,
  onSelectDate,
  onToggleTodo,
  onDeleteTodo,
  onOpenAdd,
  onOpenEdit
}) {
  const todayStr = getTodayDateString();

  const handleShiftDate = (days) => {
    const cur = new Date(selectedDate + 'T00:00:00');
    cur.setDate(cur.getDate() + days);
    const yr = cur.getFullYear();
    const mo = String(cur.getMonth() + 1).padStart(2, '0');
    const da = String(cur.getDate()).padStart(2, '0');
    onSelectDate(`${yr}-${mo}-${da}`);
  };

  const completedCount = todos.filter(t => t.is_completed).length;

  return (
    <div className="bg-white border-3 border-black shadow-[6px_6px_0px_#000000] p-4 sm:p-6 rounded-[6px]">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b-2 border-black">
        {/* Left: Section Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#00E5CC] border-2 border-black flex items-center justify-center rounded-[3px] shadow-[2px_2px_0px_#000]">
            <CheckSquare className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-tight text-black flex items-center gap-2">
              JADWAL TUGAS PER JAM
              <span className="neo-badge bg-[#FFE600] text-black text-[11px] py-0.5 px-2">
                {completedCount}/{todos.length} SELESAI
              </span>
            </h2>
            <p className="text-[11px] font-mono text-zinc-600">
              {formatIndonesianDate(selectedDate)}
            </p>
          </div>
        </div>

        {/* Right: Date Navigation & Primary Add Button */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Date Navigator */}
          <div className="flex items-center gap-1 bg-[#F6F4EE] border-2 border-black p-1 rounded-[4px] shadow-[2px_2px_0px_#000]">
            <button
              onClick={() => handleShiftDate(-1)}
              title="Hari Sebelumnya"
              className="p-1.5 bg-white hover:bg-[#FFE600] border border-black rounded transition-colors active:translate-y-0.5"
            >
              <ChevronLeft className="w-4 h-4 text-black" strokeWidth={2.5} />
            </button>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onSelectDate(e.target.value)}
              className="text-xs font-mono font-bold bg-white border border-black px-2 py-1 rounded focus:outline-none"
            />

            <button
              onClick={() => handleShiftDate(1)}
              title="Hari Berikutnya"
              className="p-1.5 bg-white hover:bg-[#FFE600] border border-black rounded transition-colors active:translate-y-0.5"
            >
              <ChevronRight className="w-4 h-4 text-black" strokeWidth={2.5} />
            </button>

            {selectedDate !== todayStr && (
              <button
                onClick={() => onSelectDate(todayStr)}
                className="text-[10px] font-heading font-extrabold bg-[#FFE600] hover:bg-[#FFD000] border border-black px-2 py-1 rounded transition-colors ml-1"
              >
                HARI INI
              </button>
            )}
          </div>

          {/* Primary Add Button (Opens Modal) */}
          <button
            onClick={onOpenAdd}
            className="neo-btn neo-btn-primary py-2 px-3.5 text-xs sm:text-sm flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4 text-black" strokeWidth={3} />
            TAMBAH TUGAS BARU
          </button>
        </div>
      </div>

      {/* Todo List Schedule Items */}
      {todos.length === 0 ? (
        <div className="py-12 px-4 text-center border-3 border-dashed border-black bg-[#F6F4EE] rounded-[6px] my-4">
          <Clock className="w-12 h-12 mx-auto mb-3 text-zinc-400" strokeWidth={2} />
          <h3 className="font-heading font-extrabold text-base text-black mb-1">
            Belum ada agenda jam pada tanggal ini
          </h3>
          <p className="font-mono text-xs text-zinc-600 max-w-md mx-auto mb-4">
            Alokasikan blok waktu harian Anda agar fokus kerja terarah dan efisiensi waktu terpantau.
          </p>
          <button
            onClick={onOpenAdd}
            className="neo-btn neo-btn-primary py-2.5 px-5 text-xs sm:text-sm inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-black" strokeWidth={3} />
            + BUAT BLOK JAM PERTAMA
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center justify-between gap-3 p-3.5 sm:p-4 border-2 border-black rounded-[4px] transition-all ${
                todo.is_completed
                  ? 'bg-[#F6F4EE] opacity-75 shadow-[1px_1px_0px_#000]'
                  : 'bg-white shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000]'
              }`}
            >
              {/* Left: Time Badge + Checkbox + Task Title */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                {/* Time Badge */}
                <div
                  className={`font-mono text-xs sm:text-sm font-extrabold px-2.5 py-1.5 border-2 border-black rounded-[3px] shrink-0 ${
                    todo.is_completed
                      ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                      : 'bg-[#FFE600] text-black shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  {formatTime(todo.start_time)} - {formatTime(todo.end_time)}
                </div>

                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={todo.is_completed}
                  onChange={(e) => onToggleTodo(todo.id, e.target.checked)}
                  className="neo-checkbox shrink-0"
                  title={todo.is_completed ? "Tandai Belum Selesai" : "Tandai Selesai"}
                />

                {/* Task Title */}
                <div className="min-w-0 flex-1">
                  <span
                    onClick={() => onToggleTodo(todo.id, !todo.is_completed)}
                    className={`text-xs sm:text-sm font-semibold cursor-pointer select-none block truncate ${
                      todo.is_completed
                        ? 'line-through text-zinc-500 dark:text-zinc-400 font-normal'
                        : 'text-black dark:text-white font-extrabold'
                    }`}
                    title={todo.task_title}
                  >
                    {todo.task_title}
                  </span>
                </div>
              </div>

              {/* Right: Action Buttons (Edit in Modal & Delete) */}
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <button
                  onClick={() => onOpenEdit(todo)}
                  title="Edit Agenda Tugas (Buka Pop-up)"
                  className="p-2 bg-white dark:bg-[#2A2A32] text-black dark:text-white hover:bg-[#FFE600] hover:text-black border-2 border-black transition-colors rounded-[3px] active:translate-y-0.5 shadow-[1px_1px_0px_#000]"
                >
                  <Edit3 className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>

                <button
                  onClick={() => onDeleteTodo(todo.id)}
                  title="Hapus Agenda Tugas"
                  className="p-2 bg-white dark:bg-[#2A2A32] text-black dark:text-white hover:bg-[#FF4B4B] hover:text-white border-2 border-black transition-colors rounded-[3px] active:translate-y-0.5 shadow-[1px_1px_0px_#000]"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
