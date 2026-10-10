// FinDo Utility Functions & Calculations

// 1. Persentase To-Do Selesai (PRD 7.1)
export const calculateProgress = (todos) => {
  if (!todos || todos.length === 0) return 0;
  const completed = todos.filter((t) => t.is_completed).length;
  return Math.round((completed / todos.length) * 100);
};

// 2. Agregasi Arus Kas (PRD 7.1)
export const calculateCashflow = (records) => {
  if (!records || records.length === 0) {
    return { income: 0, expense: 0, balance: 0 };
  }
  const income = records
    .filter((r) => r.type === 'income')
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  const expense = records
    .filter((r) => r.type === 'expense')
    .reduce((sum, r) => sum + Number(r.amount || 0), 0);

  return { income, expense, balance: income - expense };
};

// Format Rupiah
export const formatRupiah = (amount) => {
  const num = Math.abs(Number(amount) || 0);
  return 'Rp ' + num.toLocaleString('id-ID');
};

// Format Time HH:mm
export const formatTime = (timeStr) => {
  if (!timeStr) return '--:--';
  // If format is HH:mm:ss, take first 5 chars
  return timeStr.slice(0, 5);
};

// Format Date ke bahasa Indonesia: "Senin, 6 Okt 2026"
export const formatIndonesianDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Format Date ringkas: "6 Okt 2026"
export const formatShortDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Format Tanggal Hari Ini YYYY-MM-DD
export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Ambil prefix bulan YYYY-MM
export const getMonthPrefix = (dateStr) => {
  if (!dateStr) return getTodayDateString().slice(0, 7);
  return dateStr.slice(0, 7);
};

// Format Bulan Indonesia: "Oktober 2026"
export const formatIndonesianMonth = (monthPrefix) => {
  if (!monthPrefix) return '';
  const [year, month] = monthPrefix.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  });
};

// Statistik Akumulasi To-Do Bulanan
export const calculateMonthlyTodoStats = (monthlyTodos = []) => {
  const total = monthlyTodos.length;
  const completed = monthlyTodos.filter(t => t.is_completed).length;
  const pending = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, pending, percentage };
};

// Breakdown Pengeluaran per Kategori
export const calculateCategoryBreakdown = (records = [], type = 'expense') => {
  const filtered = records.filter(r => r.type === type);
  const totalAmount = filtered.reduce((sum, r) => sum + Number(r.amount || 0), 0);

  const categoryMap = {};
  filtered.forEach(r => {
    const cat = r.category || 'Lainnya';
    categoryMap[cat] = (categoryMap[cat] || 0) + Number(r.amount || 0);
  });

  const categories = Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalAmount === 0 ? 0 : Math.round((amount / totalAmount) * 100)
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    totalAmount,
    categories,
    dominant: categories[0] || null
  };
};

// ===================== SLEEP TRACKER HELPERS =====================
export const formatSleepHours = (hours) => {
  if (hours === undefined || hours === null || isNaN(hours)) return '0 jam';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h} jam`;
  return `${h} jam ${m} mnt`;
};

export const calculateMonthlySleepStats = (sleepRecords = [], monthPrefix) => {
  const prefix = monthPrefix || getTodayDateString().slice(0, 7);
  const [year, month] = prefix.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  // Filter records to this month
  const recordsInMonth = sleepRecords.filter(r => (r.record_date || '').startsWith(prefix));
  const recordMap = {};
  recordsInMonth.forEach(r => {
    recordMap[r.record_date] = r;
  });

  const loggedDays = recordsInMonth.length;
  const totalHours = recordsInMonth.reduce((sum, r) => sum + Number(r.duration_hours || 0), 0);
  const averageHours = loggedDays > 0 ? Number((totalHours / loggedDays).toFixed(1)) : 0;

  let optimalCount = 0; // 7 - 9 jam
  let underSleepCount = 0; // < 7 jam
  let overSleepCount = 0; // > 9 jam

  recordsInMonth.forEach(r => {
    const d = Number(r.duration_hours || 0);
    if (d >= 7 && d <= 9) optimalCount++;
    else if (d < 7) underSleepCount++;
    else overSleepCount++;
  });

  // Generate chart data for all days in month
  const chartDays = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${prefix}-${dayStr}`;
    const entry = recordMap[dateStr];
    chartDays.push({
      day,
      date: dateStr,
      duration: entry ? Number(entry.duration_hours) : 0,
      quality: entry?.quality || null,
      bedtime: entry?.bedtime || null,
      wake_time: entry?.wake_time || null,
      notes: entry?.notes || null,
      hasData: Boolean(entry)
    });
  }

  // Health assessment status
  let status = 'Belum Ada Data';
  let badgeColor = 'bg-zinc-200 text-zinc-700';

  if (loggedDays > 0) {
    if (averageHours >= 7 && averageHours <= 9) {
      status = 'Optimal (7-9 Jam)';
      badgeColor = 'bg-[#00D26A] text-black';
    } else if (averageHours >= 6 && averageHours < 7) {
      status = 'Cukup (Perlu Ditingkatkan)';
      badgeColor = 'bg-[#FFE600] text-black';
    } else if (averageHours < 6) {
      status = 'Kurang Tidur (Begadang)';
      badgeColor = 'bg-[#FF4B4B] text-white';
    } else {
      status = 'Tidur Panjang (>9 Jam)';
      badgeColor = 'bg-[#00E5CC] text-black';
    }
  }

  return {
    prefix,
    daysInMonth,
    loggedDays,
    totalHours,
    averageHours,
    optimalCount,
    underSleepCount,
    overSleepCount,
    chartDays,
    status,
    badgeColor
  };
};

