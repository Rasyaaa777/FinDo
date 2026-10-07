import React from 'react';
import MonthlyTodoCard from '../dashboard/MonthlyTodoCard.jsx';
import MonthlyFinanceCard from '../dashboard/MonthlyFinanceCard.jsx';
import DailyTodoSection from '../dashboard/DailyTodoSection.jsx';
import AiChatSection from '../dashboard/AiChatSection.jsx';
import ProgressBar from '../dashboard/ProgressBar.jsx';
import {
  Calendar,
  Clock,
  Receipt,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Scale
} from 'lucide-react';
import {
  formatRupiah,
  formatIndonesianDate,
  formatIndonesianMonth,
  getMonthPrefix,
  calculateMonthlyTodoStats,
  calculateCategoryBreakdown
} from '../../lib/utils.js';

export default function DashboardView({
  todos = [],
  monthlyTodos = [],
  records = [],
  monthlyRecords = [],
  cashflow,
  monthlyCashflow,
  selectedDate,
  aiInsight,
  onAnalyzeAi,
  isAiLoading,
  onNavigate,
  onToggleTodo,
  onAddTodo
}) {
  const monthPrefix = getMonthPrefix(selectedDate);
  const monthName = formatIndonesianMonth(monthPrefix);

  // Monthly stats calculations
  const monthlyTodoStats = calculateMonthlyTodoStats(monthlyTodos);
  const { categories: topExpenseCategories } = calculateCategoryBreakdown(monthlyRecords, 'expense');

  // Context payload for AI chat
  const aiContextData = {
    monthlyTodos: monthlyTodoStats,
    dailyTodos: {
      total: todos.length,
      completed: todos.filter(t => t.is_completed).length,
      pending: todos.filter(t => !t.is_completed).length,
      list: todos.map(t => ({
        title: t.task_title,
        time: `${t.start_time?.slice(0, 5)} - ${t.end_time?.slice(0, 5)}`,
        completed: t.is_completed
      }))
    },
    monthlyFinance: {
      income: monthlyCashflow?.income || 0,
      expense: monthlyCashflow?.expense || 0,
      balance: monthlyCashflow?.balance || 0,
      topCategories: topExpenseCategories.slice(0, 4)
    },
    dailyFinance: {
      income: cashflow?.income || 0,
      expense: cashflow?.expense || 0,
      balance: cashflow?.balance || 0
    },
    currentDate: formatIndonesianDate(selectedDate),
    monthName
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* 1. Header Hero Banner */}
      <div className="bg-[#FFE600] border-3 border-black shadow-[6px_6px_0px_#000000] p-5 sm:p-6 rounded-[6px] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="neo-badge bg-black text-white text-[10px] tracking-wide">
                DASHBOARD OVERVIEW
              </span>
              <span className="neo-badge bg-[#00E5CC] text-black text-[10px] font-bold">
                📅 {monthName.toUpperCase()}
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-black tracking-tight leading-tight">
              Pusat Kontrol Finansial & Produktivitas
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-zinc-900 mt-1.5 leading-relaxed">
              Pantau akumulasi target bulanan, eksekusi blok jam kerja hari ini, dan konsultasikan keputusan keuangan Anda dengan FinDo AI Advisor.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('todos')}
              className="neo-btn bg-black text-white hover:bg-zinc-800 py-2.5 px-4 text-xs flex items-center gap-2 shadow-[3px_3px_0px_rgba(0,0,0,0.5)] active:translate-y-0.5"
            >
              <Clock className="w-4 h-4 text-white" strokeWidth={2.5} />
              ATUR JADWAL
            </button>
            <button
              onClick={() => onNavigate('finance')}
              className="neo-btn bg-[#00E5CC] text-black hover:bg-teal-300 py-2.5 px-4 text-xs flex items-center gap-2 shadow-[3px_3px_0px_rgba(0,0,0,0.5)] active:translate-y-0.5"
            >
              <Receipt className="w-4 h-4 text-black" strokeWidth={2.5} />
              CATAT MUTASI KAS
            </button>
          </div>
        </div>
      </div>

      {/* 2. SECTION 1: AKUMULASI BULANAN (To-Do Bulanan + Laporan Keuangan Bulanan) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-tight text-black dark:text-white flex items-center gap-2">
            <span>📊 IKHTISAR BULANAN ({monthName.toUpperCase()})</span>
          </h2>
          <span className="text-xs font-mono font-bold text-zinc-500 hidden sm:inline">
            Akumulasi Data 1 Bulan Penuh
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* A. Akumulasi To-Do List Bulanan dengan Persen */}
          <MonthlyTodoCard
            monthlyStats={monthlyTodoStats}
            monthName={monthName}
            onNavigate={onNavigate}
          />

          {/* B. Laporan Keuangan Per Bulan */}
          <MonthlyFinanceCard
            monthlyCashflow={monthlyCashflow}
            monthlyRecords={monthlyRecords}
            monthName={monthName}
            onNavigate={onNavigate}
          />
        </div>
      </section>

      {/* 3. SECTION 2: PROGRES & TO-DO LIST HARI INI */}
      <section className="space-y-4">
        {/* Progress Bar Gauge Hari Ini */}
        <ProgressBar todos={todos} />

        {/* Tampilan To-Do List Hari Ini (Interactive & Inline Add) */}
        <DailyTodoSection
          todos={todos}
          selectedDate={selectedDate}
          onToggleTodo={onToggleTodo}
          onAddTodo={onAddTodo}
          onNavigate={onNavigate}
        />
      </section>

      {/* 4. SECTION 3: AI ANALISIS & CHAT INTERAKTIF DENGAN AI */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF2A85] text-white flex items-center justify-center rounded border border-black shadow-[1px_1px_0px_#000]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-tight text-black dark:text-white">
              KECERDASAN BUATAN: AI ANALISIS & CHAT ASISTEN
            </h2>
          </div>
          <span className="neo-badge bg-[#00E5CC] text-black text-[10px] font-bold hidden sm:inline-flex">
            GEMINI 1.5 PRO & FLASH
          </span>
        </div>

        {/* AI Chat & Insight Component */}
        <AiChatSection
          aiInsight={aiInsight}
          onAnalyzeAi={onAnalyzeAi}
          isAiLoading={isAiLoading}
          contextData={aiContextData}
        />
      </section>
    </div>
  );
}
