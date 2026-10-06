import React, { useState } from 'react';
import TodoList from '../todos/TodoList.jsx';
import TodoModal from '../todos/TodoModal.jsx';
import ProgressBar from '../dashboard/ProgressBar.jsx';
import { Clock, Plus } from 'lucide-react';

export default function TodosView({
  todos = [],
  selectedDate,
  onSelectDate,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodo
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const handleOpenAdd = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (todoData) => {
    if (todoData.id) {
      onUpdateTodo(todoData.id, {
        task_title: todoData.task_title,
        start_time: todoData.start_time,
        end_time: todoData.end_time,
        target_date: todoData.target_date,
      });
    } else {
      onAddTodo(todoData);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* View Header Banner */}
      <div className="bg-[#FFE600] border-3 border-black shadow-[4px_4px_0px_#000000] p-5 rounded-[6px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-[#FFE600] border-2 border-black flex items-center justify-center rounded-[4px] shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
              <Clock className="w-5 h-5 text-[#FFE600]" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-black">
                JADWAL KERJA & TO-DO PER JAM
              </h1>
              <p className="text-xs font-mono text-zinc-900 font-semibold">
                Alokasi waktu sistematis (*hourly time-blocking*) untuk eksekusi tugas terencana.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="neo-btn bg-black text-white hover:bg-zinc-800 py-2 px-4 text-xs sm:text-sm self-start sm:self-auto flex items-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.4)] active:translate-y-0.5"
          >
            <Plus className="w-4 h-4 text-white" strokeWidth={3} />
            + TAMBAH TUGAS
          </button>
        </div>
      </div>

      {/* Progress Bar Harian */}
      <ProgressBar todos={todos} />

      {/* FULL WIDTH HOURLY SCHEDULE SECTION ONLY */}
      <div>
        <TodoList
          todos={todos}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
          onOpenAdd={handleOpenAdd}
          onOpenEdit={handleOpenEdit}
        />
      </div>

      {/* POPUP MODAL FORM (UNTUK INPUT & EDIT JAM TUGAS) */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingTodo}
        selectedDate={selectedDate}
      />
    </div>
  );
}
