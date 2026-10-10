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
