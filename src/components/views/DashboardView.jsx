import React from 'react';
import MonthlyTodoCard from '../dashboard/MonthlyTodoCard.jsx';
import MonthlyFinanceCard from '../dashboard/MonthlyFinanceCard.jsx';
import MonthlySleepCard from '../dashboard/MonthlySleepCard.jsx';
import DailyTodoSection from '../dashboard/DailyTodoSection.jsx';
import AiChatSection from '../dashboard/AiChatSection.jsx';
import ProgressBar from '../dashboard/ProgressBar.jsx';
import {
  Calendar,
  Clock,
  Receipt,
  Moon,
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
  calculateCategoryBreakdown,
  calculateMonthlySleepStats
} from '../../lib/utils.js';

export default function DashboardView({
  todos = [],
  monthlyTodos = [],
  records = [],
  monthlyRecords = [],
  monthlySleepRecords = [],
  cashflow,
  monthlyCashflow,
  selectedDate,
  aiInsight,
  onAnalyzeAi,
  isAiLoading,
  onNavigate,
  onToggleTodo,
  onAddTodo,
  onAiExecuteActions,
  onAiUndoActions
}) {
  const monthPrefix = getMonthPrefix(selectedDate);
  const monthName = formatIndonesianMonth(monthPrefix);

  // Monthly stats calculations
  const monthlyTodoStats = calculateMonthlyTodoStats(monthlyTodos);
  const { categories: topExpenseCategories } = calculateCategoryBreakdown(monthlyRecords, 'expense');
  const sleepStats = calculateMonthlySleepStats(monthlySleepRecords, monthPrefix);
  const todaySleepRecord = monthlySleepRecords.find(r => r.record_date === selectedDate);

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
    monthlySleep: {
      averageHours: sleepStats.averageHours,
      status: sleepStats.status,
      loggedDays: sleepStats.loggedDays,
      optimalCount: sleepStats.optimalCount
    },
    todaySleep: todaySleepRecord ? {
      duration: todaySleepRecord.duration_hours,
      quality: todaySleepRecord.quality,
      bedtime: todaySleepRecord.bedtime,
      wake_time: todaySleepRecord.wake_time,
      sessions: todaySleepRecord.sessions || [],
      notes: todaySleepRecord.cleanNotes || todaySleepRecord.notes
    } : null,
    currentDate: formatIndonesianDate(selectedDate),
    monthName,
    recentRecords: monthlyRecords.slice(0, 30).map(r => ({
      date: r.record_date,
      type: r.type,
      amount: r.amount,
      category: r.category,
      description: r.description
    }))
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* 1. SECTION 1: AKUMULASI BULANAN (To-Do Bulanan + Laporan Keuangan Bulanan + Jam Tidur) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-tight text-black dark:text-white flex items-center gap-2">
            <span>📊 IKHTISAR BULANAN ({monthName.toUpperCase()})</span>
          </h2>
          <span className="text-xs font-mono font-bold text-zinc-500 hidden sm:inline">
            Akumulasi To-Do, Arus Kas & Waktu Istirahat
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

        {/* C. Grafik & Pola Jam Tidur Bulanan (Hanya Cek / View-Only di Dashboard) */}
        <MonthlySleepCard
          monthlySleepRecords={monthlySleepRecords}
          monthName={monthName}
          selectedMonthPrefix={monthPrefix}
          isReadOnly={true}
          onNavigate={onNavigate}
        />
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
          selectedDate={selectedDate}
          onExecuteActions={onAiExecuteActions}
          onUndoActions={onAiUndoActions}
          onNavigate={onNavigate}
        />
      </section>
    </div>
  );
}
