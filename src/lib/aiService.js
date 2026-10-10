import { getSupabase } from './supabaseClient.js';

export const getGeminiApiKey = () => {
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY)
    || (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY);
  return (envKey && envKey.trim()) || '';
};

// Model Gemini yang aktif (gemini-3.8-flash). Bisa dioverride via .env
export const GEMINI_MODEL = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_MODEL)
  || (typeof process !== 'undefined' && process.env?.VITE_GEMINI_MODEL)
  || 'gemini-3.8-flash'
).trim();

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

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiKey}`,
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

  // 3. Fallback to Local Deterministic Smart Heuristic (Snappy, Always works)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateLocalSmartInsight(summaryData));
    }, 600);
  });
};

/**
 * Interactive Multi-Turn Chat with FinDo AI Advisor
 */
export const sendAiChatMessage = async (conversationHistory = [], contextData = {}) => {
  const geminiKey = getGeminiApiKey();

  const {
    monthlyTodos = {},
    dailyTodos = {},
    monthlyFinance = {},
    dailyFinance = {},
    currentDate = '',
    monthName = '',
    recentRecords = [],
    monthlySleep = {},
    todaySleep = null
  } = contextData;

  const systemPrompt = `
Kamu adalah FinDo AI Advisor — asisten pribadi cerdas, ramah, interaktif, dan pelatih finansial, produktivitas, serta gaya hidup/kesehatan istirahat untuk pengguna aplikasi FinDo.

KEPRIBADIAN & GAYA KOMUNIKASI:
- Sangat komunikatif, asyik diajak ngobrol santai, hangat, suportif, dan tidak kaku seperti robot.
- Jika pengguna mengajak ngobrol ("halo", "kamu bisa ngobrol ga?", "gimana hari ini?"), balaslah dengan ramah, santai, dan ceria layaknya teman diskusi yang suportif.
- Jika pengguna bertanya tentang keuangan, to-do list, ataupun pola jam tidur & kesehatan istirahat, gunakan data pengguna di bawah ini untuk memberi jawaban yang relevan dan solutif.
- Pahami korelasi nyata: kurang tidur (<6-7 jam) biasanya memicu penurunan konsentrasi kerja (banyak to-do tertunda) dan belanja impulsif (makanan manis, kopi berlebih). Dukung pengguna agar tidur cukup (7-8 jam).
- Gunakan bahasa Indonesia sehari-hari yang luwes, enak dibaca, dan format markdown (tebalkan poin penting, bullet point jika diperlukan).

DATA AKTIF PENGGUNA SAAT INI DI DATABASE:
- Tanggal Hari Ini: ${currentDate || 'Hari ini'}
- Periode Bulan: ${monthName || 'Bulan ini'}
- Progres To-Do Hari Ini: ${dailyTodos.completed || 0}/${dailyTodos.total || 0} tugas selesai (${dailyTodos.pending || 0} masih pending).
  Daftar Tugas Hari Ini: ${dailyTodos.list && dailyTodos.list.length > 0 ? dailyTodos.list.map(t => `• [${t.time}] ${t.title} (${t.completed ? 'Selesai' : 'Belum'})`).join('\n  ') : 'Belum ada agenda hari ini'}
- Ringkasan To-Do Bulan Ini: Total ${monthlyTodos.total || 0} tugas, selesai ${monthlyTodos.completed || 0} (${monthlyTodos.percentage || 0}%).
- Arus Kas Hari Ini: Pemasukan Rp ${(dailyFinance.income || 0).toLocaleString('id-ID')}, Pengeluaran Rp ${(dailyFinance.expense || 0).toLocaleString('id-ID')}, Saldo Rp ${(dailyFinance.balance || 0).toLocaleString('id-ID')}.
- Arus Kas Bulan Ini: Pemasukan Rp ${(monthlyFinance.income || 0).toLocaleString('id-ID')}, Pengeluaran Rp ${(monthlyFinance.expense || 0).toLocaleString('id-ID')}, Saldo Bersih Rp ${(monthlyFinance.balance || 0).toLocaleString('id-ID')}.
  Pengeluaran Terbesar Bulan Ini: ${monthlyFinance.topCategories && monthlyFinance.topCategories.length > 0 ? monthlyFinance.topCategories.map(c => `${c.category} (Rp ${c.amount.toLocaleString('id-ID')})`).join(', ') : 'Belum ada'}.
- Pola Jam Tidur Bulan Ini: Rata-rata ${monthlySleep.averageHours || 0} jam/hari (${monthlySleep.status || 'Belum ada data'}, ${monthlySleep.loggedDays || 0} hari tercatat, ${monthlySleep.optimalCount || 0} hari optimal 7-9 jam).
- Jam Tidur Terakhir / Hari Ini: ${todaySleep ? `${todaySleep.duration} Jam (Kualitas: ${todaySleep.quality || 'Baik'}${todaySleep.bedtime ? `, ${todaySleep.bedtime} - ${todaySleep.wake_time}` : ''}${todaySleep.notes ? ` • ${todaySleep.notes}` : ''})` : 'Belum tercatat hari ini'}.
- Riwayat Transaksi Terakhir di Database: ${recentRecords.length > 0 ? recentRecords.slice(0, 15).map(r => `[${r.date}] ${r.type === 'income' ? '+' : '-'}Rp ${Number(r.amount).toLocaleString('id-ID')} (${r.category}${r.description ? ': ' + r.description : ''})`).join('; ') : 'Belum ada catatan transaksi'}.

INSTRUKSI PENTING:
1. Jawab pertanyaan pengguna dengan menganalisis data riil di atas jika relevan.
2. Pengguna bisa mencatat to-do, keuangan, maupun jam tidur lewat chat secara instan (contoh: "tadi malam tidur 7 jam", "beli kopi 25rb", "meeting jam 2 siang").
3. Berikan saran terapan konkret dan solutif.
4. Buat respon rapi dengan markdown (bullet points, tebalkan angka penting).
5. Jawab dalam Bahasa Indonesia yang ramah, santai, dan komunikatif.
`.trim();

  // If Gemini API Key is configured, use Gemini 1.5 Flash
  if (geminiKey) {
    try {
      const contents = [
        {
          role: 'user',
          parts: [{ text: systemPrompt + "\n\nKonfirmasi bahwa kamu siap membantu pengguna berdasarkan data di atas." }]
        },
        {
          role: 'model',
          parts: [{ text: "Siap! Saya FinDo AI Advisor siap membantu menganalisis to-do list dan keuangan Anda. Ada yang bisa saya bantu?" }]
        }
      ];

      // Add actual conversation messages
      conversationHistory.forEach((msg) => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text || msg.content || '' }]
        });
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        }
      );

      if (response.ok) {
        const json = await response.json();
        const replyText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) {
          return replyText;
        }
      }
    } catch (err) {
      console.warn("Gemini Chat API error, using smart fallback:", err);
    }
  }

  // Fallback Rule-based Intelligent Response
  const lastUserMsg = conversationHistory[conversationHistory.length - 1]?.text?.toLowerCase() || '';
  
  if (lastUserMsg.includes('keuangan') || lastUserMsg.includes('saldo') || lastUserMsg.includes('kas') || lastUserMsg.includes('uang')) {
    const bal = monthlyFinance.balance || 0;
    const isSurplus = bal >= 0;
    return `📊 **Evaluasi Keuangan ${monthName || 'Bulan Ini'}:**\n\n` +
      `- **Saldo Bersih:** Rp ${bal.toLocaleString('id-ID')} (${isSurplus ? '🟢 Surplus Kas' : '🔴 Defisit Kas'})\n` +
      `- **Pemasukan:** Rp ${(monthlyFinance.income || 0).toLocaleString('id-ID')}\n` +
      `- **Pengeluaran:** Rp ${(monthlyFinance.expense || 0).toLocaleString('id-ID')}\n\n` +
      (monthlyFinance.topCategories && monthlyFinance.topCategories.length > 0
        ? `💡 **Pos Pengeluaran Terbesar:** Kategori **${monthlyFinance.topCategories[0].category}** sebesar Rp ${monthlyFinance.topCategories[0].amount.toLocaleString('id-ID')} (${monthlyFinance.topCategories[0].percentage}% dari total belanja).\n\n`
        : '') +
      `**Saran Solutif:** ${isSurplus ? 'Kondisi kas surplus! Sisihkan minimal 15-20% ke tabungan atau dana darurat sebelum menambah pengeluaran baru.' : 'Prioritaskan pemangkasan belanja non-pokok dan hindari pengeluaran impulsif sampai saldo kembali positif.'}`;
  }

  if (lastUserMsg.includes('todo') || lastUserMsg.includes('tugas') || lastUserMsg.includes('jadwal') || lastUserMsg.includes('produktif') || lastUserMsg.includes('jam')) {
    const dailyPending = dailyTodos.pending || 0;
    const rate = monthlyTodos.percentage || 0;
    return `⏱️ **Status Produktivitas & To-Do:**\n\n` +
      `- **Hari Ini:** ${dailyTodos.completed || 0} dari ${dailyTodos.total || 0} agenda tuntas (${dailyPending} masih pending).\n` +
      `- **Akumulasi Bulan Ini:** **${rate}% selesai** dari total ${monthlyTodos.total || 0} tugas terjadwal.\n\n` +
      `🎯 **Rekomendasi Waktu:**\n` +
      (dailyPending > 0
        ? `1. Masih ada **${dailyPending} tugas pending** hari ini. Gunakan blok jam 25 menit (metode Pomodoro) untuk tugas terpenting.\n2. Tunda distraksi media sosial selama jam kerja aktif.`
        : `1. Semua tugas hari ini sudah beres! Luangkan 10 menit untuk merencanakan 3 prioritas utama esok hari.\n2. Berikan apresiasi pada dirimu atas konsistensi hari ini!`);
  }

  if (lastUserMsg.includes('tidur') || lastUserMsg.includes('sleep') || lastUserMsg.includes('istirahat') || lastUserMsg.includes('begadang')) {
    const avg = monthlySleep.averageHours || 0;
    const isGood = avg >= 7 && avg <= 9;
    return `🌙 **Analisis Pola Tidur & Istirahat ${monthName || 'Bulan Ini'}:**\n\n` +
      `- **Rata-Rata Jam Tidur:** **${avg > 0 ? `${avg} Jam / hari` : 'Belum cukup data'}** (${monthlySleep.status || 'Perlu pencatatan'})\n` +
      `- **Hari Tercatat:** ${monthlySleep.loggedDays || 0} hari (${monthlySleep.optimalCount || 0} hari optimal 7-9 jam)\n` +
      (todaySleep ? `- **Catatan Tidur Terakhir:** **${todaySleep.duration} Jam** (Kualitas: ${todaySleep.quality || 'Baik'})\n\n` : '\n') +
      `💡 **Evaluasi Kesehatan & Produktivitas:** ${isGood
        ? 'Pola tidur Anda sangat seimbang! Istirahat cukup 7-8 jam menjaga fokus kerja optimal dan emosi stabil.'
        : 'Waktu tidur rata-rata masih di bawah anjuran ideal (7-9 jam). Kurang tidur sering memicu *brain fog* pada to-do harian dan belanja impulsif akibat lelah.'}\n\n` +
      `*💡 Tip: Anda bisa mencatat jam tidur kapan saja lewat chat, misal ketik: "tadi malam tidur 7.5 jam"*`;
  }

  if (lastUserMsg.includes('hemat') || lastUserMsg.includes('tips') || lastUserMsg.includes('saran') || lastUserMsg.includes('analisis')) {
    return `💡 **Strategi Optimalisasi FinDo:**\n\n` +
      `1. **Aturan 50/30/20:** Alokasikan 50% pemasukan untuk kebutuhan pokok, 30% keinginan terukur, dan 20% tabungan/investasi.\n` +
      `2. **Sinkronisasi Jam & Biaya:** Jangan belanja saat jam kerja sedang lelah atau stres (menghindari *emotional spending*).\n` +
      `3. **Tidur Teratur & Produktivitas:** Istirahat 7-8 jam per hari untuk menjaga energi dan daya konsentrasi agenda kerja.\n` +
      `4. **Evaluasi Harian 5 Menit:** Luangkan 5 menit tiap sore untuk centang to-do yang selesai, catat mutasi kas, dan rekap jam tidur.\n\n` +
      `*💡 Tip: Anda juga dapat memasukkan \`VITE_GEMINI_API_KEY\` di file \`.env.local\` untuk chat AI Gemini tanpa batas.*`;
  }

  return `Halo! Saya **FinDo AI Advisor**. Berdasarkan data Anda saat ini:\n\n` +
    `- Saldo Bersih Bulan Ini: **Rp ${(monthlyFinance.balance || 0).toLocaleString('id-ID')}**\n` +
    `- Tingkat Selesai To-Do Bulan Ini: **${monthlyTodos.percentage || 0}%** (${monthlyTodos.completed || 0}/${monthlyTodos.total || 0} tugas)\n` +
    `- Agenda Hari Ini: **${dailyTodos.completed || 0}/${dailyTodos.total || 0} tugas selesai**\n` +
    (monthlySleep.averageHours ? `- Rata-Rata Tidur: **${monthlySleep.averageHours} Jam/hari** (${monthlySleep.status})\n\n` : '\n') +
    `Ada yang ingin Anda tanyakan seputar keuangan, to-do list, atau pola istirahat jam tidur Anda?`;
};

