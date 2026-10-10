// FinDo AI Action Service
// Mengubah kalimat bebas user menjadi aksi database (to-do / laporan keuangan)
import { getGeminiApiKey, GEMINI_MODEL } from './aiService.js';
import { getTodayDateString } from './utils.js';

export const EXPENSE_CATEGORIES = [
  'Makanan & Minuman',
  'Transportasi',
  'Belanja & Kebutuhan',
  'Tagihan & Utilitas',
  'Hiburan & Rekreasi',
  'Kesehatan',
  'Pendidikan',
  'Lain-lain'
];

export const INCOME_CATEGORIES = [
  'Gaji Pokok',
  'Freelance / Proyek',
  'Bisnis / Usaha',
  'Investasi',
  'Bonus / Hadiah',
  'Lain-lain'
];

const pad = (n) => String(n).padStart(2, '0');

const addDays = (dateStr, days) => {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const addHour = (time) => {
  const [h, m] = time.split(':').map(Number);
  return `${pad(Math.min(h + 1, 23))}:${pad(m)}`;
};

const isValidDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '');
const normalizeTime = (t) => {
  const m = /^(\d{1,2})[:.](\d{2})/.exec(t || '');
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return `${pad(h)}:${pad(min)}`;
};

/**
 * Validasi & normalisasi aksi agar aman dimasukkan ke database.
 */
const sanitizeActions = (actions = [], today) => {
  const clean = [];
  for (const a of actions) {
    if (!a || typeof a !== 'object') continue;

    if (a.type === 'todo') {
      const title = String(a.task_title || '').trim();
      const start = normalizeTime(a.start_time);
      if (!title || !start) continue;
      let end = normalizeTime(a.end_time) || addHour(start);
      if (end <= start) end = addHour(start);
      clean.push({
        type: 'todo',
        data: {
          task_title: title.slice(0, 200),
          target_date: isValidDate(a.target_date) ? a.target_date : today,
          start_time: start,
          end_time: end,
          is_completed: false
        }
      });
    }

    if (a.type === 'finance') {
      const recordType = a.record_type === 'income' ? 'income' : 'expense';
      const amount = Number(a.amount);
      if (!amount || amount <= 0) continue;
      const list = recordType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      clean.push({
        type: 'finance',
        data: {
          type: recordType,
          amount: Math.round(amount),
          category: list.includes(a.category) ? a.category : 'Lain-lain',
          description: String(a.description || '').trim().slice(0, 200) || null,
          record_date: isValidDate(a.record_date) ? a.record_date : today
        }
      });
    }

    if (a.type === 'sleep') {
      const duration = Number(a.duration_hours);
      if (!duration || duration <= 0) continue;
      clean.push({
        type: 'sleep',
        data: {
          record_date: isValidDate(a.record_date) ? a.record_date : today,
          duration_hours: Math.min(Math.max(Number(duration.toFixed(1)), 0.5), 24),
          bedtime: normalizeTime(a.bedtime),
          wake_time: normalizeTime(a.wake_time),
          quality: ['Sangat Baik', 'Baik', 'Cukup', 'Kurang'].includes(a.quality) ? a.quality : 'Baik',
          notes: a.notes ? String(a.notes).trim().slice(0, 200) : null
        }
      });
    }
  }
  return clean;
};

// ===================== LOCAL FALLBACK PARSER =====================
const parseAmount = (text) => {
  const m = /(?:rp\.?\s*)?(\d+(?:[.,]\d+)*)\s*(jt|juta|rb|ribu|k)?\b/i.exec(
    text.replace(/jam\s*\d{1,2}([:.]\d{2})?/gi, '')
  );
  if (!m) return null;
  const unit = (m[2] || '').toLowerCase();
  let raw = m[1];
  let num;
  if (unit) {
    num = parseFloat(raw.replace(',', '.'));
    num *= unit === 'jt' || unit === 'juta' ? 1_000_000 : 1_000;
  } else {
    num = parseFloat(raw.replace(/[.,]/g, ''));
  }
  return num > 0 ? num : null;
};

const guessCategory = (text, type) => {
  const t = text.toLowerCase();
  if (type === 'income') {
    if (/gaji|salary/.test(t)) return 'Gaji Pokok';
    if (/freelance|proyek|project|klien/.test(t)) return 'Freelance / Proyek';
    if (/jualan|bisnis|usaha|dagang/.test(t)) return 'Bisnis / Usaha';
    if (/saham|dividen|investasi|bunga|crypto/.test(t)) return 'Investasi';
    if (/bonus|hadiah|thr|kado/.test(t)) return 'Bonus / Hadiah';
    return 'Lain-lain';
  }
  if (/makan|minum|kopi|jajan|sarapan|nasi|bakso|snack|resto/.test(t)) return 'Makanan & Minuman';
  if (/bensin|ojek|gojek|grab|parkir|tol|bus|kereta|krl|transport/.test(t)) return 'Transportasi';
  if (/listrik|air|internet|wifi|pulsa|kuota|tagihan|token|cicilan|sewa|kos/.test(t)) return 'Tagihan & Utilitas';
  if (/film|nonton|game|liburan|hiburan|netflix|spotify|konser/.test(t)) return 'Hiburan & Rekreasi';
  if (/obat|dokter|rumah sakit|klinik|vitamin/.test(t)) return 'Kesehatan';
  if (/buku|kursus|kuliah|sekolah|spp|les/.test(t)) return 'Pendidikan';
  if (/beli|belanja|sabun|baju|sepatu/.test(t)) return 'Belanja & Kebutuhan';
  return 'Lain-lain';
};

const parseDateWord = (text, today) => {
  const t = text.toLowerCase();
  if (/lusa/.test(t)) return addDays(today, 2);
  if (/besok/.test(t)) return addDays(today, 1);
  if (/kemarin/.test(t)) return addDays(today, -1);
  return today;
};

const cleanTaskTitle = (rawText) => {
  if (!rawText) return 'Tugas Baru';
  let cleaned = rawText
    // Buang filler kata percakapan bahasa Indonesia
    .replace(/\b(eh|nih|dong|ya|yuk|deh|sih|kan|kok|tuh|lah)\b/gi, '')
    .replace(/\b(nanti|sekarang|tadi|besok|lusa|kemarin|hari ini|pagi|siang|sore|malam)\b/gi, '')
    .replace(/\b(ingetin|ingatkan|ingat|tolong|coba|bisa|mohon|jangan lupa)\b/gi, '')
    .replace(/\b(aku|saya|gue|gw|kamu|anda|kita)\b/gi, '')
    .replace(/\b(ada|punya|mau|ingin|bakal|akan|jadwal|agenda|to-?do|catat(kan)?|tambah(kan)?|buat(kan)?)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Jika kata 'tugas' atau 'kuliah' atau 'rapat' tertinggal sendirian atau ada lanjutannya
  if (!cleaned || cleaned.length < 2) {
    if (/kuliah/i.test(rawText)) cleaned = 'Kuliah';
    else if (/rapat|meeting/i.test(rawText)) cleaned = 'Meeting';
    else if (/tugas/i.test(rawText)) cleaned = 'Mengerjakan Tugas';
    else if (/ujian|quiz|kuis/i.test(rawText)) cleaned = 'Ujian / Kuis';
    else if (/gym|olahraga/i.test(rawText)) cleaned = 'Olahraga';
    else cleaned = 'Jadwal Agenda';
  }

  // Capitalize kata
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
    .slice(0, 100);
};

const localParse = (text, today) => {
  const t = text.toLowerCase();
  const date = parseDateWord(text, today);

  // Cek apakah ini murni pertanyaan / obrolan
  const isQuestionOrChat = /\?|^(halo|hai|hi|pagi|siang|sore|malam|kamu|bisa|gimana|bagaimana|kenapa|apa|siapa|tolong jelaskan|tips)/i.test(t)
    && !/(catat|ingetin|jadwalkan|tambah|beli|bayar|keluar|gaji|dapat)/i.test(t);

  if (isQuestionOrChat) {
    return { intent: 'chat', actions: [] };
  }

  // Cek apakah ini pencatatan jam tidur
  const isSleepLog = /(?:tidur|bobo|sleep|begadang)\b/i.test(t);
  if (isSleepLog && !isQuestionOrChat) {
    const durMatch = /(\d+(?:[.,]\d+)?)\s*(?:jam|jm|h)\b/i.exec(text);
    let duration = null;
    let bedtime = null;
    let wakeTime = null;

    if (durMatch) {
      duration = parseFloat(durMatch[1].replace(',', '.'));
    } else {
      // Cek apakah ada format "tidur jam 23 bangun jam 07"
      const sleepTimes = /tidur\s*(?:jam|pukul)?\s*(\d{1,2}(?:[:.]\d{2})?).*?bangun\s*(?:jam|pukul)?\s*(\d{1,2}(?:[:.]\d{2})?)/i.exec(text);
      if (sleepTimes) {
        bedtime = normalizeTime(sleepTimes[1]) || `${pad(Number(sleepTimes[1]))}:00`;
        wakeTime = normalizeTime(sleepTimes[2]) || `${pad(Number(sleepTimes[2]))}:00`;
        const [bH, bM] = bedtime.split(':').map(Number);
        const [wH, wM] = wakeTime.split(':').map(Number);
        let diffMinutes = (wH * 60 + wM) - (bH * 60 + bM);
        if (diffMinutes <= 0) diffMinutes += 24 * 60;
        duration = Number((diffMinutes / 60).toFixed(1));
      }
    }

    if (duration && duration > 0) {
      let quality = 'Baik';
      if (/begadang|kurang|ngantuk|lemes/i.test(t)) quality = 'Kurang';
      else if (/nyenyak|pulas|enak|segar|banget/i.test(t)) quality = 'Sangat Baik';
      else if (duration < 6) quality = 'Kurang';

      const sleepDate = /kemarin|semalam|tadi malam/i.test(t) ? today : date;

      return {
        intent: 'sleep',
        reply: `Sip! Sudah aku catat jam tidur ${duration} jam (${quality}) untuk tanggal ${sleepDate}. ${duration < 6 ? 'Jangan lupa jaga kesehatan dan kurangi begadang ya!' : 'Istirahat yang cukup bikin fokus kerja lebih maksimal!'}`.trim(),
        actions: [{
          type: 'sleep',
          record_date: sleepDate,
          duration_hours: duration,
          bedtime,
          wake_time: wakeTime,
          quality,
          notes: /begadang/i.test(t) ? 'Begadang' : null
        }]
      };
    }
  }

  const incomeWords = /(gaji|dapat|terima|pemasukan|masuk|dibayar|bonus|jualan|untung)/;
  const expenseWords = /(beli|bayar|keluar|pengeluaran|habis|jajan|belanja|isi|top ?up|makan|ngopi)/;
  const amount = parseAmount(text);

  if (amount && (incomeWords.test(t) || expenseWords.test(t) || /rp|rb|ribu|jt|juta/.test(t))) {
    const recordType = incomeWords.test(t) && !expenseWords.test(t) ? 'income' : 'expense';
    const cleanDesc = text
      .replace(/(?:rp\.?\s*)?(\d+(?:[.,]\d+)*)\s*(jt|juta|rb|ribu|k)?\b/gi, '')
      .replace(/\b(eh|nih|dong|ya|tadi|barusan|tolong|catat|pemasukan|pengeluaran)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    return {
      intent: 'finance',
      reply: `Sip! Sudah aku catat ${recordType === 'income' ? 'pemasukan' : 'pengeluaran'} sebesar ${amount.toLocaleString('id-ID')} ya.`,
      actions: [{
        type: 'finance',
        record_type: recordType,
        amount,
        category: guessCategory(text, recordType),
        description: cleanDesc ? cleanDesc.charAt(0).toUpperCase() + cleanDesc.slice(1) : (recordType === 'income' ? 'Pemasukan' : 'Pengeluaran'),
        record_date: date
      }]
    };
  }

  const timeMatch = /(?:jam|pukul)\s*(\d{1,2})(?:[:.](\d{2}))?(?:\s*(?:-|sampai|s\/d|hingga)\s*(\d{1,2})(?:[:.](\d{2}))?)?/i.exec(text);
  if (timeMatch) {
    let h = Number(timeMatch[1]);
    if (/(sore|malam)/.test(t) && h < 12) h += 12;
    const start = `${pad(h)}:${timeMatch[2] || '00'}`;
    let end = null;
    if (timeMatch[3]) {
      let eh = Number(timeMatch[3]);
      if (/(sore|malam)/.test(t) && eh < 12) eh += 12;
      end = `${pad(eh)}:${timeMatch[4] || '00'}`;
    }
    const rawLeftover = text.replace(timeMatch[0], '');
    const title = cleanTaskTitle(rawLeftover);

    return {
      intent: 'todo',
      reply: `Siap! Sudah aku pasang jadwal '${title}' jam ${start} ya.`,
      actions: [{
        type: 'todo',
        task_title: title,
        target_date: date,
        start_time: start,
        end_time: end
      }]
    };
  }

  return { intent: 'chat', actions: [] };
};

// ===================== MAIN: GEMINI CLASSIFIER =====================
/**
 * Analisis pesan user: apakah ini perintah input to-do, catat keuangan, jam tidur, atau chat biasa.
 * @returns {Promise<{intent: 'todo'|'finance'|'sleep'|'mixed'|'chat', actions: Array, reply?: string}>}
 */
export const parseAiCommand = async (text, todayInput) => {
  const today = todayInput || getTodayDateString();
  const geminiKey = getGeminiApiKey();

  if (geminiKey) {
    const prompt = `
Kamu adalah parser intent & entity extractor asisten pribadi cerdas untuk aplikasi FinDo.
Tanggal hari ini: ${today}.

Tugas Utamamu:
Klasifikasikan pesan pengguna ke salah satu dari:
1. "chat": Pengguna sedang MENYAPA, MENGAJAK NGOBROL, BERTANYA, CURHAT, MINTA SARAN, ATAU MINTA ANALISIS DATA.
   Contoh:
   - "kamu ga bisa di ajak ngobrol kah? kalau mau ngatur keuangan gimana?" -> "chat"
   - "halo selamat pagi" -> "chat"
   - "bagaimana kondisi keuanganku bulan ini?" -> "chat"
   - "apakah jam tidurku sudah sehat?" -> "chat"
   - "apa saja agenda kerjaku hari ini?" -> "chat"
   JIKA intent adalah "chat", maka "actions" HARUS ARRAY KOSONG [].

2. "todo": Pengguna ingin MENAMBAHKAN JADWAL / AGENDA / TUGAS BARU (ada aktivitas & waktu).
   PENTING: EKSTRAKSI JUDUL TUGAS (task_title):
   - JANGAN MENYALIN KALIMAT OBROLAN/PERCAKAPAN MENTAH!
   - Buang kata filler/obrolan: "eh", "nanti", "ingetin aku ya", "ada", "nih", "jangan lupa ya", "tolong", "bisa", "jadwal".
   - Ambil HANYA NAMA KEGIATAN INTI yang rapi & ringkas (Title Case).
   Contoh:
   - "eh nanti jam 12 ingetin aku ya ada jadwal tugas" -> task_title: "Mengerjakan Tugas", start_time: "12:00"
   - "Eh aku ada kuliah nih di matkul mikroprosesor jam 5 sore" -> task_title: "Kuliah Mikroprosesor", start_time: "17:00"
   - "besok jam 9 pagi ada meeting sprint tim dev" -> task_title: "Meeting Sprint Tim Dev", start_time: "09:00"

3. "finance": Pengguna ingin MENCATAT PEMASUKAN ATAU PENGELUARAN KEUANGAN (ada nominal uang).
   Contoh:
   - "tadi siang beli makan siang 25rb" -> expense, amount: 25000, category: "Makanan & Minuman", description: "Makan Siang"
   - "gajian masuk 7,5 juta" -> income, amount: 7500000, category: "Gaji Pokok", description: "Gaji Bulanan"

4. "sleep": Pengguna ingin MENCATAT JAM TIDUR / WAKTU ISTIRAHAT (ada durasi jam tidur, waktu tidur, atau jam bangun).
   Contoh:
   - "tadi malam aku tidur 7 jam" -> type: "sleep", record_date: "${today}", duration_hours: 7, quality: "Baik"
   - "semalam tidur jam 23:00 bangun jam 07:00" -> type: "sleep", record_date: "${today}", duration_hours: 8, bedtime: "23:00", wake_time: "07:00", quality: "Baik"
   - "kemarin begadang cuma tidur 4 jam" -> type: "sleep", record_date: "${today}", duration_hours: 4, quality: "Kurang", notes: "Begadang"
   - "catat tidur 8 jam nyenyak banget" -> type: "sleep", record_date: "${today}", duration_hours: 8, quality: "Sangat Baik"

5. "mixed": Jika dalam satu pesan pengguna mencatat beberapa hal sekaligus (misal to-do + finance, atau to-do + tidur).

Aturan Tambahan:
- Waktu format 24 jam "HH:MM".
- Tanggal format "YYYY-MM-DD". "semalam" / "tadi malam" biasanya dicatat untuk tanggal hari ini ${today}.
- Kategori pengeluaran HARUS salah satu dari: ${EXPENSE_CATEGORIES.join(' | ')}
- Kategori pemasukan HARUS salah satu dari: ${INCOME_CATEGORIES.join(' | ')}
- Kualitas tidur (quality): "Sangat Baik" | "Baik" | "Cukup" | "Kurang"
- "reply": Buat balasan konfirmasi santai, ramah, dan manusiawi dalam Bahasa Indonesia (misal: "Siap! Sudah aku catat jam tidur 8 jam ya, istirahat yang cukup bikin makin fokus!"). Kosongkan jika intent "chat".

Keluarkan HANYA JSON valid:
{
  "intent": "todo" | "finance" | "sleep" | "mixed" | "chat",
  "reply": "string",
  "actions": [
    {
      "type": "todo",
      "task_title": "string (rapi tanpa filler)",
      "target_date": "YYYY-MM-DD",
      "start_time": "HH:MM",
      "end_time": "HH:MM" | null
    },
    {
      "type": "finance",
      "record_type": "income" | "expense",
      "amount": number,
      "category": "string",
      "description": "string",
      "record_date": "YYYY-MM-DD"
    },
    {
      "type": "sleep",
      "record_date": "YYYY-MM-DD",
      "duration_hours": number,
      "bedtime": "HH:MM" | null,
      "wake_time": "HH:MM" | null,
      "quality": "Sangat Baik" | "Baik" | "Cukup" | "Kurang",
      "notes": "string" | null
    }
  ]
}

Pesan Pengguna: """${text}"""
`.trim();

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.1 }
          })
        }
      );
      if (response.ok) {
        const json = await response.json();
        const raw = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw);
          const actions = sanitizeActions(parsed.actions, today);
          if (parsed.intent === 'chat' || actions.length === 0) {
            return { intent: 'chat', actions: [] };
          }
          return { intent: parsed.intent, actions, reply: parsed.reply || '' };
        }
      } else {
        console.warn('Gemini parser HTTP error:', response.status, await response.text());
      }
    } catch (err) {
      console.warn('Gemini parser error, fallback ke parser lokal:', err);
    }
  }

  // Fallback lokal (tanpa API key / API gagal)
  const local = localParse(text, today);
  return { ...local, actions: sanitizeActions(local.actions, today) };
};
