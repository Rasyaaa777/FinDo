import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/layout/Sidebar.jsx';
import DashboardView from './components/views/DashboardView.jsx';
import TodosView from './components/views/TodosView.jsx';
import FinanceView from './components/views/FinanceView.jsx';
import AuthModal from './components/auth/AuthModal.jsx';

import { DataService } from './lib/dataService.js';
import { getSupabase } from './lib/supabaseClient.js';
import { requestAiInsight } from './lib/aiService.js';
import { calculateProgress, calculateCashflow, getTodayDateString, formatIndonesianDate } from './lib/utils.js';
import { Menu, RefreshCw } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'todos' | 'finance'
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [todos, setTodos] = useState([]);
  const [monthlyTodos, setMonthlyTodos] = useState([]);
  const [records, setRecords] = useState([]);
  const [monthlyRecords, setMonthlyRecords] = useState([]);
  const [selectedFinanceMonth, setSelectedFinanceMonth] = useState(() => getTodayDateString().slice(0, 7));
  const [period, setPeriod] = useState('monthly'); // 'daily', 'monthly', 'all'
  const [aiInsight, setAiInsight] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Modals & Navigation
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Theme State (Dark Mode / Light Mode)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('findo_theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('findo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('findo_theme', 'light');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initialize User Session
  useEffect(() => {
    async function initUser() {
      try {
        const initialUser = await DataService.getInitialUser();
        setUser(initialUser);
      } catch (err) {
        console.error("Init user error:", err);
      }
    }
    initUser();

    // Listen to Supabase auth state change if client exists
    const supabase = getSupabase();
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });
      return () => subscription?.unsubscribe();
    }
  }, []);

  // Fetch todos & records whenever user or date or period or finance month changes
  const loadData = useCallback(async () => {
    if (!user) {
      setTodos([]);
      setRecords([]);
      setMonthlyTodos([]);
      setMonthlyRecords([]);
      setIsLoadingData(false);
      return;
    }
    setIsLoadingData(true);
    try {
      const currentMonthPrefix = selectedDate.slice(0, 7);
      const targetFinanceDate = period === 'monthly'
        ? `${selectedFinanceMonth}-01`
        : (period === 'daily' ? selectedDate : null);

      const [userTodos, userRecords, mTodos, mRecords] = await Promise.all([
        DataService.getTodos(user.id, selectedDate),
        DataService.getRecords(user.id, period, targetFinanceDate),
        DataService.getMonthlyTodos(user.id, currentMonthPrefix),
        DataService.getRecords(user.id, 'monthly', `${selectedFinanceMonth}-01`),
      ]);
      setTodos(userTodos);
      setRecords(userRecords);
      setMonthlyTodos(mTodos);
      setMonthlyRecords(mRecords);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setIsLoadingData(false);
    }
  }, [user, selectedDate, period, selectedFinanceMonth]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived values
  const cashflow = calculateCashflow(records);
  const monthlyCashflow = calculateCashflow(monthlyRecords);
  const progressPercent = calculateProgress(todos);

  // AI Insight Trigger
  const handleAnalyzeAi = async () => {
    setIsAiLoading(true);
    try {
      const summaryPayload = {
        date: selectedDate,
        totalTasks: todos.length,
        completedTasks: todos.filter(t => t.is_completed).length,
        progressPercent,
        todos: todos.map(t => ({
          title: t.task_title,
          time: `${t.start_time} - ${t.end_time}`,
          completed: t.is_completed
        })),
        cashflow,
        recentTransactions: records.slice(0, 10).map(r => ({
          type: r.type,
          amount: r.amount,
          category: r.category,
          desc: r.description
        }))
      };

      const result = await requestAiInsight(summaryPayload);
      setAiInsight(result);
    } catch (err) {
      console.error("AI Analysis error:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Todo Handlers
  const handleAddTodo = async (todoData) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    try {
      const created = await DataService.addTodo({
        ...todoData,
        user_id: user.id
      });
      if (created.target_date === selectedDate) {
        setTodos(prev => [...prev, created].sort((a, b) => a.start_time.localeCompare(b.start_time)));
      }
      if (created.target_date?.startsWith(selectedDate.slice(0, 7))) {
        setMonthlyTodos(prev => [...prev, created]);
      }
    } catch (err) {
      alert("Gagal menambahkan tugas: " + err.message);
    }
  };

  const handleToggleTodo = async (id, is_completed) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, is_completed } : t))
    );
    setMonthlyTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, is_completed } : t))
    );
    try {
      await DataService.updateTodo(id, user.id, { is_completed });
    } catch (err) {
      console.error("Toggle todo error:", err);
      setTodos(prev =>
        prev.map(t => (t.id === id ? { ...t, is_completed: !is_completed } : t))
      );
      setMonthlyTodos(prev =>
        prev.map(t => (t.id === id ? { ...t, is_completed: !is_completed } : t))
      );
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    try {
      const updated = await DataService.updateTodo(id, user.id, updates);
      if (updated) {
        setTodos(prev =>
          prev.map(t => (t.id === id ? { ...t, ...updates } : t))
            .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''))
        );
        setMonthlyTodos(prev =>
          prev.map(t => (t.id === id ? { ...t, ...updates } : t))
        );
      }
    } catch (err) {
      alert("Gagal memperbarui tugas: " + err.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await DataService.deleteTodo(id, user.id);
      setTodos(prev => prev.filter(t => t.id !== id));
      setMonthlyTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert("Gagal menghapus tugas: " + err.message);
    }
  };

  // Finance Handlers
  const handleAddRecord = async (recordData) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    try {
      await DataService.addRecord({
        ...recordData,
        user_id: user.id,
      });
      await loadData();
    } catch (err) {
      alert("Gagal menambahkan transaksi: " + err.message);
    }
  };

  const handleUpdateRecord = async (id, updates) => {
    try {
      const updated = await DataService.updateRecord(id, user.id, updates);
      if (updated) {
        await loadData();
      }
    } catch (err) {
      alert("Gagal memperbarui transaksi: " + err.message);
    }
  };

  const handleDeleteRecord = async (id) => {
    try {
      await DataService.deleteRecord(id, user.id);
      await loadData();
    } catch (err) {
      alert("Gagal menghapus transaksi: " + err.message);
    }
  };

  // Auth Handlers
  const handleLogin = async (email, password) => {
    const loggedUser = await DataService.login(email, password);
    setUser(loggedUser);
  };

  const handleRegister = async (email, password) => {
    const registeredUser = await DataService.register(email, password);
    setUser(registeredUser);
  };

  const handleLogout = async () => {
    await DataService.logout();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-[#F6F4EE] dark:bg-[#121214] flex text-black dark:text-white transition-colors duration-200">
      {/* 1. SIDEBAR NAVIGATION */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        user={user}
        todosCount={todos.length}
        balance={cashflow.balance}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onRefreshData={loadData}
        isLoading={isLoadingData}
        currentDate={selectedDate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Mobile Header Bar (Only visible on mobile screens) */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b-3 border-black p-3.5 flex items-center justify-between shadow-[0_2px_0_0_#000]">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 bg-[#FFE600] border-2 border-black rounded-[3px] shadow-[2px_2px_0px_#000] active:translate-y-0.5"
            >
              <Menu className="w-5 h-5 text-black" strokeWidth={2.5} />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg text-black">
                FinDo
              </span>
              <span className="neo-badge bg-[#00E5CC] text-[10px] py-0 px-1 font-bold">
                {activeView.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <span className="text-zinc-600 truncate max-w-[120px]">
              {formatIndonesianDate(selectedDate).split(',')[0]}
            </span>
            <button
              onClick={loadData}
              title="Perbarui Data"
              className="p-1.5 bg-[#F6F4EE] border border-black rounded"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* View Content Wrapper */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1280px] w-full mx-auto">
          {activeView === 'dashboard' && (
            <DashboardView
              todos={todos}
              monthlyTodos={monthlyTodos}
              records={records}
              monthlyRecords={monthlyRecords}
              cashflow={cashflow}
              monthlyCashflow={monthlyCashflow}
              selectedDate={selectedDate}
              aiInsight={aiInsight}
              onAnalyzeAi={handleAnalyzeAi}
              isAiLoading={isAiLoading}
              onNavigate={setActiveView}
              onToggleTodo={handleToggleTodo}
              onAddTodo={handleAddTodo}
            />
          )}

          {activeView === 'todos' && (
            <TodosView
              todos={todos}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onAddTodo={handleAddTodo}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
              onUpdateTodo={handleUpdateTodo}
            />
          )}

          {activeView === 'finance' && (
            <FinanceView
              records={records}
              cashflow={cashflow}
              period={period}
              onPeriodChange={setPeriod}
              selectedMonth={selectedFinanceMonth}
              onSelectMonth={setSelectedFinanceMonth}
              onAddRecord={handleAddRecord}
              onDeleteRecord={handleDeleteRecord}
              onUpdateRecord={handleUpdateRecord}
              selectedDate={selectedDate}
            />
          )}
        </main>
      </div>

      {/* Auth Modal Dialog */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}
