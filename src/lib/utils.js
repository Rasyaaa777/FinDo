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

// Menghitung durasi sesi tidur dalam jam (e.g., '13:00' ke '15:00' = 2 jam, '23:00' ke '06:30' = 7.5 jam)
export const calculateSessionDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const [sH, sM] = startTime.split(':').map(Number);
  const [eH, eM] = endTime.split(':').map(Number);
  if (isNaN(sH) || isNaN(sM) || isNaN(eH) || isNaN(eM)) return 0;

  let diffMinutes = (eH * 60 + eM) - (sH * 60 + sM);
  if (diffMinutes <= 0) {
    // Lewat tengah malam (misal 23:00 ke 07:00 atau 01:00 ke 08:00)
    diffMinutes += 24 * 60;
  }
  const hours = diffMinutes / 60;
  return Number(hours.toFixed(1));
};

// Format tampilan sesi tidur untuk tooltip atau ringkasan
export const formatSessionListText = (sessions = []) => {
  if (!sessions || sessions.length === 0) return '';
  return sessions
    .map(s => `${s.name || 'Sesi'}: ${s.startTime?.slice(0, 5)} - ${s.endTime?.slice(0, 5)} (${s.duration}h)`)
    .join(' • ');
};

// Konfigurasi warna, border, dan icon per sesi tidur (Malam = Ungu, Siang = Kuning, Nap = Tosca, Pagi = Hijau)
export const getSessionColorConfig = (session, index = 0) => {
  const name = (session?.name || '').toLowerCase();
  const start = session?.startTime || '';
  const [startH] = start.split(':').map(Number);

  // 1. Tidur Malam / Night Sleep (Malam / Dini Hari)
  if (name.includes('malam') || name.includes('night') || (!isNaN(startH) && (startH >= 20 || startH < 6))) {
    return {
      bg: 'bg-[#8338EC]',
      border: 'border-[#5b1cb3]',
      text: 'text-white',
      hex: '#8338EC',
      label: 'Tidur Malam',
      icon: '🌙'
    };
  }

  // 2. Tidur Siang / Afternoon Nap (11:00 - 16:00)
  if (name.includes('siang') || name.includes('afternoon') || (!isNaN(startH) && startH >= 11 && startH < 16)) {
    return {
      bg: 'bg-[#FFE600]',
      border: 'border-[#cca700]',
      text: 'text-black',
      hex: '#FFE600',
      label: 'Tidur Siang',
      icon: '☀️'
    };
  }

  // 3. Power Nap / Sore (16:00 - 20:00)
  if (name.includes('power') || name.includes('sore') || (!isNaN(startH) && startH >= 16 && startH < 20)) {
    return {
      bg: 'bg-[#00E5CC]',
      border: 'border-[#00b39f]',
      text: 'text-black',
      hex: '#00E5CC',
      label: 'Power Nap / Sore',
      icon: '⚡'
    };
  }

  // 4. Istirahat Pagi (06:00 - 11:00)
  if (name.includes('pagi') || (!isNaN(startH) && startH >= 6 && startH < 11)) {
    return {
      bg: 'bg-[#00D26A]',
      border: 'border-[#009e4f]',
      text: 'text-black',
      hex: '#00D26A',
      label: 'Istirahat Pagi',
      icon: '☕'
    };
  }

  // 5. Fallback presets
  const presets = [
    { bg: 'bg-[#8338EC]', border: 'border-[#5b1cb3]', text: 'text-white', hex: '#8338EC', label: 'Tidur Malam', icon: '🌙' },
    { bg: 'bg-[#FFE600]', border: 'border-[#cca700]', text: 'text-black', hex: '#FFE600', label: 'Tidur Siang', icon: '☀️' },
    { bg: 'bg-[#00E5CC]', border: 'border-[#00b39f]', text: 'text-black', hex: '#00E5CC', label: 'Power Nap', icon: '⚡' },
    { bg: 'bg-[#FF2A85]', border: 'border-[#d41865]', text: 'text-white', hex: '#FF2A85', label: 'Sesi Lain', icon: '💤' }
  ];
  return presets[index % presets.length];
};

// Parse catatan tidur (mengekstrak multi-sesi jika tersimpan dalam notes metadata)
export const parseSleepRecord = (record) => {
  if (!record) return { sessions: [], cleanNotes: '', totalHours: 0 };

  const rawNotes = record.notes || '';
  let sessions = [];
  let cleanNotes = rawNotes;

  const sessionMatch = rawNotes.match(/<!--FINDO_SESSIONS:(.*?)-->/s);
  if (sessionMatch) {
    try {
      const parsed = JSON.parse(sessionMatch[1]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        sessions = parsed;
      }
      cleanNotes = rawNotes.replace(/<!--FINDO_SESSIONS:.*?-->/s, '').trim();
    } catch (_) {}
  } else if (Array.isArray(record.sessions) && record.sessions.length > 0) {
    sessions = record.sessions;
  } else if (record.bedtime && record.wake_time) {
    // Single session fallback
    const start = record.bedtime.slice(0, 5);
    const end = record.wake_time.slice(0, 5);
    const dur = Number(record.duration_hours) || calculateSessionDuration(start, end);
    sessions = [
      {
        id: 'legacy-1',
        name: 'Tidur Utama',
        startTime: start,
        endTime: end,
        duration: dur
      }
    ];
  }

  // Hitung total jam dari sessions jika ada
  let totalHours = Number(record.duration_hours) || 0;
  if (sessions.length > 0) {
    const sumDurations = sessions.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
    if (sumDurations > 0) {
      totalHours = Number(sumDurations.toFixed(1));
    }
  }

  return {
    ...record,
    duration_hours: totalHours,
    sessions,
    cleanNotes,
    notes: cleanNotes
  };
};

// Serialize payload tidur untuk disimpan ke Supabase & LocalStorage
export const serializeSleepRecord = (data) => {
  const {
    id,
    user_id,
    record_date,
    duration_hours,
    sessions = [],
    bedtime,
    wake_time,
    quality = 'Baik',
    notes = '',
    created_at
  } = data;

  const cleanNotes = (notes || '').replace(/<!--FINDO_SESSIONS:.*?-->/s, '').trim();

  let finalDuration = Number(duration_hours) || 0;
  let finalBedtime = bedtime || null;
  let finalWakeTime = wake_time || null;
  let serializedNotes = cleanNotes || null;

  if (Array.isArray(sessions) && sessions.length > 0) {
    // Hitung total durasi dari semua sesi
    const sum = sessions.reduce((total, s) => {
      const d = Number(s.duration) || calculateSessionDuration(s.startTime, s.endTime);
      return total + d;
    }, 0);
    finalDuration = Number(sum.toFixed(1));

    // Pilih bedtime & wake_time representatif
    const nightSession = sessions.find(s => s.name?.toLowerCase().includes('malam')) || sessions[sessions.length - 1];
    if (nightSession) {
      finalBedtime = nightSession.startTime?.slice(0, 5);
      finalWakeTime = nightSession.endTime?.slice(0, 5);
    } else {
      finalBedtime = sessions[0].startTime?.slice(0, 5);
      finalWakeTime = sessions[sessions.length - 1].endTime?.slice(0, 5);
    }

    // Embed session metadata ke dalam field notes
    const metaTag = `<!--FINDO_SESSIONS:${JSON.stringify(sessions)}-->`;
    serializedNotes = cleanNotes ? `${cleanNotes}\n${metaTag}` : metaTag;
  }

  return {
    id,
    user_id,
    record_date,
    duration_hours: finalDuration,
    bedtime: finalBedtime,
    wake_time: finalWakeTime,
    quality,
    notes: serializedNotes,
    sessions,
    cleanNotes,
    created_at
  };
};

export const calculateMonthlySleepStats = (sleepRecords = [], monthPrefix) => {
  const prefix = monthPrefix || getTodayDateString().slice(0, 7);
  const [year, month] = prefix.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  // Filter and parse records to this month
  const recordsInMonth = (sleepRecords || [])
    .filter(r => (r.record_date || '').startsWith(prefix))
    .map(r => parseSleepRecord(r));

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
      notes: entry?.cleanNotes || null,
      sessions: entry?.sessions || [],
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

