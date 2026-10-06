import { getSupabase } from './supabaseClient.js';

export const getGeminiApiKey = () => {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  const localKey = localStorage.getItem('findo_gemini_api_key');
  return (localKey && localKey.trim()) || (envKey && envKey.trim()) || '';
};

export const saveGeminiApiKey = (key) => {
  if (key) {
    localStorage.setItem('findo_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('findo_gemini_api_key');
  }
};

/**
 * Intelligent Local Rule-Based Evaluator
 * Runs when no cloud function or key is available, giving genuine smart coaching
 */
export const generateLocalSmartInsight = (summaryData) => {
  const { todos = [], records = [], cashflow = { income: 0, expense: 0, balance: 0 }, progress = 0 } = summaryData;

  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.is_completed).length;
  const { income, expense, balance } = cashflow;

  // Breakdown expense categories
  const expenseByCategory = {};
  records.filter(r => r.type === 'expense').forEach(r => {
    expenseByCategory[r.category] = (expenseByCategory[r.category] || 0) + Number(r.amount);
  });

  const sortedCategories = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
  const dominantExpense = sortedCategories.length > 0 ? sortedCategories[0] : null;

  let status = "Aman";
  let insight = "";
  let action_items = [];

  // Logic assessment
  if (expense > income && income > 0) {
    status = "Kritis";
    const dominantName = dominantExpense ? dominantExpense[0] : "pengeluaran harian";
    insight = `Arus kas defisit dengan pengeluaran melebihi pemasukan, didominasi oleh kategori ${dominantName}. Rasio penyelesaian tugas harian berada di angka ${progress}%.`;
    action_items = [
      `Tunda belanja non-pokok kategori ${dominantName} untuk memulihkan saldo kas.`,
      totalTasks > completedTasks
        ? `Fokus selesaikan ${totalTasks - completedTasks} tugas tersisa untuk memaksimalkan jam produktif hari ini.`
        : `Lakukan audit seluruh pos pengeluaran dan buat batas limit harian yang ketat.`
    ];
  } else if (progress < 50 && totalTasks >= 3) {
    status = "Perhatian";
    insight = `Sebagian besar agenda jam kerja masih tertunda (${completedTasks}/${totalTasks} tugas selesai). Pengeluaran kas saat ini tercatat Rp ${expense.toLocaleString('id-ID')}.`;
    action_items = [
      `Fokus kerjakan satu tugas terpenting berikutnya dengan teknik Pomodoro tanpa distraksi.`,
      `Pastikan pengeluaran harian tidak bertambah sebelum target kerja utama tuntas.`
    ];
  } else if (balance > 0 && progress >= 75) {
    status = "Aman";
    insight = `Kinerja hari ini sangat solid! Produktivitas mencapai ${progress}% dengan saldo kas surplus sebesar Rp ${balance.toLocaleString('id-ID')}.`;
    action_items = [
      `Pertahankan konsistensi alokasi jam kerja untuk agenda penting esok hari.`,
      `Sisihkan minimal 20% dari surplus saldo bersih ini ke pos tabungan atau dana darurat.`
    ];
  } else if (totalTasks === 0 && records.length === 0) {
    status = "Aman";
    insight = `Belum ada data tugas atau transaksi yang tercatat hari ini. Mulai dengan membuat jadwal jam pertama dan catat mutasi kas.`;
    action_items = [
      `Tambahkan minimal 3 blok waktu tugas utama untuk hari ini.`,
      `Catat saldo awal atau pengeluaran pertama hari ini agar arus kas terpantau.`
    ];
  } else {
    const categoryInfo = (dominantExpense && dominantExpense[0] && dominantExpense[0] !== 'undefined')
      ? `Pos pengeluaran terbesar ada di ${dominantExpense[0]}.`
      : '';
    insight = `Jadwal harian berjalan ${progress}% selesai dengan saldo bersih Rp ${balance.toLocaleString('id-ID')}. ${categoryInfo}`.trim();
    action_items = [
      `Selesaikan sisa agenda waktu sebelum penghujung hari.`,
      `Review kembali catatan pengeluaran untuk memastikan tetap di dalam rencana bulanan.`
    ];
  }

  return { status, insight, action_items };
};

/**
 * Main AI Smart Analysis Request
 */
export const requestAiInsight = async (summaryData) => {
  const supabase = getSupabase();

  // 1. Try Supabase Edge Function first if Supabase is connected
  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-dashboard', {
        body: { summaryData }
      });
      if (!error && data && data.status && data.insight) {
        return data;
      }
    } catch (edgeErr) {
      console.warn("Supabase Edge Function not reachable, falling back...", edgeErr);
    }
  }

  // 2. Try Direct Google AI Studio Gemini API if key is available
  const geminiKey = getGeminiApiKey();
  if (geminiKey) {
    try {
      const prompt = `
Kamu adalah financial advisor dan productivity coach profesional untuk aplikasi FinDo.
Analisis data harian pengguna berikut:
${JSON.stringify(summaryData)}

Berikan respon HANYA dalam format JSON valid tanpa tanda markdown:
{
  "status": "Aman" | "Perhatian" | "Kritis",
  "insight": "Ringkasan evaluasi utama maksimal 2 kalimat",
  "action_items": [
    "Saran tindakan konkrit 1",
    "Saran tindakan konkrit 2"
  ]
}
`;

      // Try gemini-1.5-flash or gemini-2.0-flash
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (parsed.status && parsed.insight && Array.isArray(parsed.action_items)) {
            return parsed;
          }
        }
      }
    } catch (apiErr) {
      console.warn("Direct Gemini API error, falling back to smart local heuristic:", apiErr);
    }
  }

  // 3. Fallback to Local Deterministic Smart Heuristic (Instant, Accurate, Always works)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateLocalSmartInsight(summaryData));
    }, 600); // Simulate snappy 600ms thought process
  });
};
