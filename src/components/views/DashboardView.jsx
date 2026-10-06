import React from 'react';
import MetricCards from '../dashboard/MetricCards.jsx';
import ProgressBar from '../dashboard/ProgressBar.jsx';
import AiInsightCard from '../dashboard/AiInsightCard.jsx';
import { ArrowRight, Clock, Receipt, CheckSquare, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { formatRupiah, formatTime } from '../../lib/utils.js';

export default function DashboardView({
  todos = [],
  records = [],
  cashflow,
  aiInsight,
  onAnalyzeAi,
  isAiLoading,
  onNavigate,
  onToggleTodo
}) {
  const completedCount = todos.filter(t => t.is_completed).length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* 1. Header Hero Banner */}
      <div className="bg-[#FFE600] border-3 border-black shadow-[6px_6px_0px_#000000] p-5 sm:p-6 rounded-[6px] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="neo-badge bg-black text-white text-[10px]">
                DASHBOARD OVERVIEW
              </span>
              <span className="text-xs font-mono font-bold text-black">
                FinDo Productivity & Finance
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-black tracking-tight">
              Selamat Datang di FinDo Ledger!
            </h1>
            <p className="text-xs sm:text-sm font-medium text-zinc-800 mt-1 max-w-xl">
              Kelola alokasi blok jam produktif dan kendalikan arus kas keuangan harian Anda secara terintegrasi dengan kecerdasan buatan Gemini AI.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => onNavigate('todos')}
              className="neo-btn neo-btn-secondary py-2 px-3.5 text-xs flex items-center gap-2"
            >
              <Clock className="w-3.5 h-3.5" />
              ATUR JADWAL
            </button>
            <button
              onClick={() => onNavigate('finance')}
              className="neo-btn neo-btn-accent py-2 px-3.5 text-xs flex items-center gap-2"
            >
              <Receipt className="w-3.5 h-3.5" />
              CATAT KAS
            </button>
          </div>
        </div>
      </div>

      {/* 2. Financial Metrics */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-tight text-black flex items-center gap-2">
            <span>IKHTISAR KEUANGAN HARI INI</span>
          </h2>
          <button
            onClick={() => onNavigate('finance')}
            className="text-xs font-mono font-bold text-zinc-700 hover:text-black flex items-center gap-1 hover:underline"
          >
            Lihat Buku Kas Penuh <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <MetricCards cashflow={cashflow} />
      </section>

      {/* 3. Daily Completion Progress */}
      <section>
        <ProgressBar todos={todos} />
      </section>

      {/* 4. Split Section: AI Insight & Quick Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left (7 Cols): Quick Previews of Today's Todos & Recent Finance */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Agenda Preview */}
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] p-4 sm:p-5 rounded-[6px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#FFE600] border border-black flex items-center justify-center rounded">
                  <CheckSquare className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                </div>
                <h3 className="font-heading font-extrabold text-sm uppercase text-black">
                  AGENDA JAM HARI INI ({completedCount}/{todos.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('todos')}
                className="text-xs font-heading font-bold text-black hover:bg-[#FFE600] px-2 py-1 border border-black transition-colors rounded-[2px]"
              >
                BUKA TO-DO ➜
              </button>
            </div>

            {todos.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-black bg-[#F6F4EE] rounded">
                <p className="text-xs font-mono text-zinc-600">
                  Belum ada agenda tugas hari ini. Mulai blok jam produktif pertamamu.
                </p>
                <button
                  onClick={() => onNavigate('todos')}
                  className="neo-btn neo-btn-primary text-xs py-1.5 px-3 mt-3"
                >
                  + TAMBAH TUGAS PER JAM
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {todos.slice(0, 4).map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center justify-between p-2.5 border-2 border-black rounded-[4px] transition-all ${
                      todo.is_completed
                        ? 'bg-[#F6F4EE] opacity-75'
                        : 'bg-white shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-[#FFE600] border border-black shrink-0">
                        {formatTime(todo.start_time)} - {formatTime(todo.end_time)}
                      </span>
                      <input
                        type="checkbox"
                        checked={todo.is_completed}
                        onChange={(e) => onToggleTodo(todo.id, e.target.checked)}
                        className="neo-checkbox shrink-0"
                      />
                      <span
                        className={`text-xs font-semibold truncate cursor-pointer ${
                          todo.is_completed ? 'line-through text-zinc-500' : 'text-black'
                        }`}
                        onClick={() => onToggleTodo(todo.id, !todo.is_completed)}
                      >
                        {todo.task_title}
                      </span>
                    </div>
                  </div>
                ))}
                {todos.length > 4 && (
                  <p className="text-center text-xs font-mono text-zinc-600 pt-1">
                    +{todos.length - 4} agenda lainnya di halaman Jadwal To-Do.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Quick Finance Preview */}
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000000] p-4 sm:p-5 rounded-[6px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#00E5CC] border border-black flex items-center justify-center rounded">
                  <Receipt className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                </div>
                <h3 className="font-heading font-extrabold text-sm uppercase text-black">
                  MUTASI TERBARU ({records.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('finance')}
                className="text-xs font-heading font-bold text-black hover:bg-[#00E5CC] px-2 py-1 border border-black transition-colors rounded-[2px]"
              >
                BUKA KEUANGAN ➜
              </button>
            </div>

            {records.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-black bg-[#F6F4EE] rounded">
                <p className="text-xs font-mono text-zinc-600">
                  Belum ada mutasi keuangan tercatat.
                </p>
                <button
                  onClick={() => onNavigate('finance')}
                  className="neo-btn neo-btn-accent text-xs py-1.5 px-3 mt-3"
                >
                  + CATAT MUTASI KAS
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {records.slice(0, 3).map((record) => {
                  const isIncome = record.type === 'income';
                  return (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-2.5 bg-white border-2 border-black rounded-[4px] shadow-[2px_2px_0px_#000]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`neo-badge text-[9px] py-0 px-1.5 ${
                            isIncome ? 'bg-[#00D26A] text-black' : 'bg-[#FF4B4B] text-white'
                          }`}
                        >
                          {isIncome ? 'IN' : 'OUT'}
                        </span>
                        <div className="min-w-0">
                          <span className="text-xs font-extrabold text-black block truncate">
                            {record.category}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {record.record_date}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`font-mono font-bold text-xs ${
                          isIncome ? 'text-[#008f4c]' : 'text-[#d42b2b]'
                        }`}
                      >
                        {isIncome ? '+' : '-'}{formatRupiah(record.amount)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right (5 Cols): AI Smart Insight Card */}
        <div className="lg:col-span-5 space-y-4">
          <AiInsightCard
            insightData={aiInsight}
            onAnalyze={onAnalyzeAi}
            isLoading={isAiLoading}
          />
        </div>
      </div>
    </div>
  );
}
