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
    <div className="w-full space-y-3 sm:space-y-3.5 animate-in fade-in duration-150">
      {/* MASTER DASHBOARD GRID: LEFT AREA (SECTIONS 1, 3, 5, 6, 4) + RIGHT COLUMN (SECTION 2) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-3.5 items-stretch">
        
        {/* === LEFT AREA (XL: 8 COLS / ~67% WIDTH) === */}
        <div className="xl:col-span-8 flex flex-col gap-3 sm:gap-3.5">
          
          {/* ROW 1: SECTION 1 (To-Do Bulanan) + SECTION 3 (Laporan Keuangan Bulanan) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5 items-stretch">
            {/* Section 1: To-Do List Bulanan */}
            <div className="flex flex-col h-full">
              <MonthlyTodoCard
                monthlyStats={monthlyTodoStats}
                monthName={monthName}
                onNavigate={onNavigate}
              />
            </div>

            {/* Section 3: Laporan Keuangan Bulanan */}
            <div className="flex flex-col h-full">
              <MonthlyFinanceCard
                monthlyCashflow={monthlyCashflow}
                monthlyRecords={monthlyRecords}
                monthName={monthName}
                onNavigate={onNavigate}
              />
            </div>
          </div>

          {/* ROW 2: SECTION 5 (Progres To-Do Harian) + SECTION 6 (AI Chat) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-3.5 items-stretch">
            {/* Section 5: Progres To-Do List Harian (~35% / 4 Cols) */}
            <div className="md:col-span-4 flex flex-col h-full">
              <ProgressBar todos={todos} onNavigate={onNavigate} />
            </div>

            {/* Section 6: AI Chat (~65% / 8 Cols) */}
            <div className="md:col-span-8 flex flex-col h-full">
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
            </div>
          </div>

          {/* ROW 3: SECTION 4 (Dashboard Jam Tidur Bulanan - Full Width of Left Area) */}
          <div className="w-full">
            <MonthlySleepCard
              monthlySleepRecords={monthlySleepRecords}
              monthName={monthName}
              selectedMonthPrefix={monthPrefix}
              isReadOnly={true}
              onNavigate={onNavigate}
            />
          </div>
        </div>

        {/* === RIGHT COLUMN (XL: 4 COLS / ~33% WIDTH): SECTION 2 (To-Do List Harian - Full Height) === */}
        <div className="xl:col-span-4 h-full flex flex-col">
          <DailyTodoSection
            todos={todos}
            selectedDate={selectedDate}
            onToggleTodo={onToggleTodo}
            onAddTodo={onAddTodo}
            onNavigate={onNavigate}
          />
        </div>

      </div>
    </div>
  );
}
