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

// Format Tanggal Hari Ini YYYY-MM-DD
export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
