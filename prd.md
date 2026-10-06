# Product Requirements Document (PRD) & Technical Spec: FinDo

**Nama Proyek:** FinDo (Finance + To-Do)  
**Versi:** 1.1.0  
**Status:** Ready for Development  
**Target Platform:** Web (Desktop & Mobile Responsive)  
**Arsitektur:** Single Page Application (SPA) + Backend-as-a-Service (BaaS) + AI Serverless Edge Function

---

## 1. Ikhtisar Produk (Product Overview)

### 1.1 Latar Belakang & Visi
FinDo adalah platform produktivitas personal terpadu yang menggabungkan manajemen waktu harian berbasis blok jam (*hourly time-blocking*), pelacakan arus kas (*cashflow tracking*), dan evaluasi produktivitas cerdas via kecerdasan buatan (*AI personal advisor*). FinDo memangkas fragmentasi aplikasi dengan menyatukan jadwal harian, kontrol finansial, dan audit kebiasaan dalam satu dashboard yang cepat, responsif, dan terisolasi per pengguna.

### 1.2 Tujuan Utama (Goals)
* Memfasilitasi eksekusi tugas harian secara terstruktur menggunakan alokasi waktu per jam (*time-blocking*).
* Menyajikan visualisasi progres harian instan (*completion rate %*) yang diperbarui secara reaktif.
* Mempermudah pencatatan mutasi kas (pemasukan & pengeluaran) dengan pengelompokan kategori yang jelas.
* Menghadirkan asisten cerdas melalui Google AI Studio (Gemini API) untuk mendeteksi pemborosan dana dan mengevaluasi efisiensi jam kerja.
* Menjamin keamanan data multi-user dengan isolasi ketat di level database.

### 1.3 Target Pengguna
* Individu, mahasiswa, pekerja lepas (*freelancer*), dan profesional muda yang ingin membangun disiplin waktu serta kontrol anggaran harian.

---

## 2. Kebutuhan Pengguna & Fitur Utama

### 2.1 Autentikasi & Multi-Tenancy (Multi-User)
* **Pendaftaran & Masuk:** Pengguna mendaftar dan masuk menggunakan kombinasi Email & Password via Supabase Auth.
* **Isolasi Data Penuh:** Setiap pengguna hanya dapat membaca, menambah, mengubah, dan menghapus datanya sendiri melalui Row Level Security (RLS) di database PostgreSQL.
* **Sesi Terdistribusi:** Token sesi JWT tersimpan otomatis di sisi klien (*localStorage*) dengan perpanjangan token berkala (*auto-refresh*).

### 2.2 To-Do List Harian Per Jam (*Hourly Time-Blocking*)
* **Input Tugas:** Judul tugas, tanggal target (default: hari ini), jam mulai (*start time*), dan jam selesai (*end time*).
* **Urutan Kronologis:** Tugas disusun berurutan dari jam paling awal ke paling malam.
* **Checklist Reaktif:** Perubahan status checklist (*pending* / *completed*) memicu *optimistic UI update*.
* **Manajemen Tugas:** Mendukung operasi pengeditan waktu/judul serta penghapusan tugas.

### 2.3 Laporan Keuangan (*Cashflow Tracker*)
* **Input Transaksi:** Jenis (`income` atau `expense`), nominal angka positif, kategori (Makanan, Transport, Belanja, Tagihan, Gaji, dll.), deskripsi opsional, dan tanggal transaksi.
* **Histori Transaksi:** Daftar mutasi kas dengan indikator visual warna (hijau untuk pemasukan, merah untuk pengeluaran).
* **Filter Periode:** Opsi filter tampilan berdasarkan rentang harian atau bulanan.

### 2.4 Dashboard Visual
* **Progress Gauge / Bar (%):**
  $$\text{Progress (\%)} = \left(\frac{\text{Jumlah Task Selesai Hari Ini}}{\text{Total Task Hari Ini}}\right) \times 100$$
* **Financial Metric Cards:** Total Pemasukan, Total Pengeluaran, dan Saldo Bersih (*Net Cash*).

### 2.5 Modul AI Smart Insight (Google AI Studio)
* **Evaluasi Finansial:** Deteksi kategori pengeluaran dominan dan potensi pembengkakan anggaran.
* **Evaluasi Produktivitas:** Analisis jam sibuk dan tingkat keberhasilan penyelesaian tugas berdasarkan blok waktu.
* **Korelasi Finansial-Jadwal:** Menemukan pola tersembunyi (misal: belanja berlebih saat agenda harian terlalu padat).
* **Output Terstruktur:** Rekomendasi disajikan dalam kartu analitik ringkas (Status, Temuan Kunci, dan 2 Tindakan Solutif).

---

## 3. Skema Database & Kebijakan Keamanan (Supabase PostgreSQL)

```sql
-- 1. TABEL TO-DO LIST PER JAM
CREATE TABLE hourly_todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  task_title TEXT NOT NULL,
  target_date DATE DEFAULT CURRENT_DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_todos_user_date ON hourly_todos (user_id, target_date);

-- 2. TABEL LAPORAN KEUANGAN
CREATE TABLE financial_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  type VARCHAR(10) CHECK (type IN ('income', 'expense')) NOT NULL,
  amount NUMERIC(15, 2) CHECK (amount > 0) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  record_date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_finance_user_date ON financial_records (user_id, record_date);

-- 3. AKTIFKAN ROW LEVEL SECURITY (RLS)
ALTER TABLE hourly_todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;

-- 4. KEBIJAKAN AKSES (POLICIES)
CREATE POLICY "Users can manage their own todos"
ON hourly_todos
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own financial records"
ON financial_records
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

---

## 4. Arsitektur Sistem & Spesifikasi Teknologi

| Layer | Komponen / Library | Peran & Alasan Pemilihan |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 / Vite | Kompilasi ultra-cepat, rendering reaktif, ekosistem kaya. |
| **Styling & UI** | Tailwind CSS | Utility-first, konsisten, performa CSS optimal di mobile & desktop. |
| **Icons** | Lucide React | Library ikon modern, clean, dan ringan. |
| **Database & Auth** | Supabase (PostgreSQL) | BaaS siap pakai dengan engine relasional dan fitur Row Level Security. |
| **API Client SDK** | `@supabase/supabase-js` | Penghubung aman antar frontend React dengan PostgreSQL & Auth. |
| **Serverless AI Proxy** | Supabase Edge Functions | Menjalankan panggilan Gemini API secara aman tanpa mengekspos API key di browser. |
| **AI Intelligence** | Google AI Studio (Gemini 1.5 Flash) | Latensi rendah, efisiensi biaya, dan output JSON yang stabil. |
| **Deployment** | Vercel / Netlify | CI/CD instan terintegrasi dengan Git repository. |

---

## 5. Struktur Direktori Proyek

```text
findo/
├── .env.local                          # Kunci publik Supabase (Vite)
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── supabase/
│   └── functions/
│       └── analyze-dashboard/          # Edge Function perantara Gemini API
│           └── index.ts
└── src/
    ├── components/
    │   ├── auth/
    │   │   └── AuthModal.jsx           # Form Login & Register multi-user
    │   ├── dashboard/
    │   │   ├── MetricCards.jsx         # Card saldo, pemasukan, pengeluaran
    │   │   ├── ProgressBar.jsx         # Indikator % to-do hari ini
    │   │   └── AiInsightCard.jsx       # Card hasil rekomendasi AI Gemini
    │   ├── finance/
    │   │   ├── FinanceForm.jsx         # Form transaksi baru
    │   │   └── FinanceList.jsx         # Tabel mutasi keuangan
    │   ├── layout/
    │   │   ├── Navbar.jsx              # Header dan aksi akun
    │   │   └── Shell.jsx               # Layout wrapper
    │   └── todos/
    │       ├── TodoForm.jsx            # Form to-do per jam
    │       └── TodoList.jsx            # Daftar jadwal terurut waktu
    ├── lib/
    │   └── supabaseClient.js           # Inisialisasi Supabase SDK
    ├── App.jsx                         # State root, auth observer, dashboard view
    ├── index.css
    └── main.jsx
```

---

## 6. Panduan Instalasi & Eksekusi

### 6.1 Setup Proyek Frontend
```bash
# Inisialisasi aplikasi React dengan Vite
npm create vite@latest findo -- --template react
cd findo
npm install

# Instalasi styling dan ikon
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install @supabase/supabase-js lucide-react
```

### 6.2 Konfigurasi Environment Klien (`.env.local`)
```env
VITE_SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 6.3 Setup Supabase Edge Function untuk AI
```bash
# Login & link proyek via Supabase CLI
supabase login
supabase link --project-ref your-project-id

# Simpan API Key AI Studio di server Supabase (aman, tidak bocor ke klien)
supabase secrets set GEMINI_API_KEY=your-google-ai-studio-key

# Deploy function
supabase functions deploy analyze-dashboard
```

---

## 7. Logika Komputasi Kunci & Integrasi AI

### 7.1 Algoritma Kalkulasi Progress & Cashflow
```javascript
// 1. Persentase To-Do Selesai
export const calculateProgress = (todos) => {
  if (!todos || todos.length === 0) return 0;
  const completed = todos.filter((t) => t.is_completed).length;
  return Math.round((completed / todos.length) * 100);
};

// 2. Agregasi Arus Kas
export const calculateCashflow = (records) => {
  const income = records
    .filter((r) => r.type === 'income')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const expense = records
    .filter((r) => r.type === 'expense')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  return { income, expense, balance: income - expense };
};
```

### 7.2 Implementasi Supabase Edge Function (`analyze-dashboard/index.ts`)
```typescript
import { serve } from "[https://deno.land/std@0.168.0/http/server.ts](https://deno.land/std@0.168.0/http/server.ts)";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { summaryData } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");

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
      `[https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$](https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$){apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        }),
      }
    );

    const result = await response.json();
    const aiText = result.candidates[0].content.parts[0].text;

    return new Response(aiText, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

---

## 8. Rencana Tahapan Rilis (Roadmap)

1. **Sprint 1: Fondasi Proyek, Basis Data, & Autentikasi**
   * Setup Vite React + Tailwind CSS + Supabase Client.
   * Eksekusi tabel `hourly_todos`, `financial_records`, dan policy RLS di Supabase.
   * Pembuatan form login dan pendaftaran akun.
2. **Sprint 2: To-Do Berbasis Waktu & Widget Persentase**
   * Pembuatan form input tugas dengan rentang jam (`start_time` - `end_time`).
   * Tampilan daftar tugas kronologis beserta interaksi checkbox reaktif.
   * Integrasi progress bar persentase tugas harian di dashboard.
3. **Sprint 3: Modul Laporan Keuangan & Agregasi Kas**
   * Form pencatatan pemasukan/pengeluaran dan daftar histori mutasi.
   * Kartu ringkasan finansial (Pemasukan, Pengeluaran, Saldo Bersih).
4. **Sprint 4: Integrasi AI Studio & Finalisasi Deployment**
   * Pembuatan dan deployment Supabase Edge Function `analyze-dashboard`.
   * Integrasi tombol "Analisis AI" dan komponen kartu `AiInsightCard.jsx`.
   * Uji coba multi-user terisolasi menggunakan 2 akun berbeda.
   * Build production dan publikasi via Vercel/Netlify.