# FinDo (Finance + To-Do)

**FinDo** adalah platform produktivitas personal terpadu yang menggabungkan manajemen waktu harian berbasis blok jam (*hourly time-blocking*), pelacakan arus kas (*cashflow ledger*), dan evaluasi kecerdasan buatan (*AI smart advisor* via Google AI Studio Gemini 1.5).

Aplikasi ini dibangun menggunakan arsitektur **React 18 + Vite** dengan sistem desain **Neo-Brutalism** (border tegas hitam pekat, offset hard shadows, warna aksen jenuh, dan tipografi ekspresif).

---

## 🚀 Fitur Utama

1. **Dashboard Metrik Finansial & Progres**
   - **Saldo Bersih (Net Cash):** Kartu kuning primer beraksen tebal dengan deteksi otomatis surplus/defisit.
   - **Total Pemasukan & Pengeluaran:** Kartu metrik dengan badge alur kas dan format mata uang Rupiah (`Rp`).
   - **Reactive Progress Bar (%):** Menghitung rasio penyelesaian tugas harian secara instan dengan efek selebrasi konfeti saat mencapai 100% (*Semua Beres!*).

2. **Jadwal Harian Per Jam (*Hourly Time-Blocking*)**
   - Formulir alokasi blok jam (`start_time` - `end_time`) dengan tombol preset cepat.
   - Daftar kronologis dari jam paling awal ke paling malam.
   - Checkbox reaktif bergaya neo-brutalist dengan *optimistic UI update*.
   - Edit inline dan hapus tugas.
   - Filter tanggal (*Date picker*) dengan navigasi hari sebelumnya/berikutnya dan tombol pintas "HARI INI".

3. **Laporan Keuangan & Mutasi Arus Kas (*Cashflow Tracker*)**
   - Pencatatan mutasi kas (Pemasukan / Pengeluaran) dengan kategori (Makanan, Transport, Belanja, Tagihan, Gaji, dll.).
   - Filter periode mutasi: **HARI INI**, **BULAN INI**, dan **SEMUA**.
   - Indikator visual kartu mutasi dengan badge hijau (Income) & merah (Expense).

4. **Modul AI Smart Insight (Google AI Studio Gemini 1.5)**
   - Status evaluasi terstruktur: `AMAN`, `PERHATIAN`, atau `KRITIS`.
   - Ringkasan evaluasi keselarasan jam kerja vs pengeluaran kas.
   - 2 tindakan solutif konkrit dengan checklist.
   - Bekerja secara otomatis via Supabase Edge Function, API Key Gemini langsung, atau algoritma evaluasi pintar offline fallback.

5. **Autentikasi Multi-User & Pengaturan**
   - Mendukung Supabase Auth dengan Row Level Security (RLS).
   - Dilengkapi fallback mode lokal terisolasi (*multi-tenant*) dan akses 1-klik mode demo tanpa registrasi rumit.
   - Modal pengaturan koneksi: Masukkan Supabase URL, Anon Key, atau Gemini API Key langsung dari UI.

---

## 🎨 Sistem Desain: Neo-Brutalism

- **Canvas Background:** `#F6F4EE` (Warm Paper Beige)
- **Primary Yellow:** `#FFE600`
- **Accent Teal:** `#00E5CC`
- **Accent Magenta:** `#FF2A85`
- **Success Green:** `#00D26A`
- **Danger Red:** `#FF4B4B`
- **Borders & Shadows:** Border `2px` & `3px` solid `#000000`, hard drop-shadows `4px 4px 0px #000000` tanpa blur.
- **Tipografi:** Google Fonts `Space Grotesk` (Heading), `Inter` (Body), & `JetBrains Mono` (Angka & Jam).

---

## 📁 Struktur Direktori

```text
FinDo/
├── .env.example
├── .env.local
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── supabase/
│   ├── schema.sql                     # Skema PostgreSQL + Row Level Security (RLS)
│   └── functions/
│       └── analyze-dashboard/         # Supabase Edge Function untuk Gemini 1.5
│           └── index.ts
└── src/
    ├── components/
    │   ├── auth/
    │   │   └── AuthModal.jsx          # Modal Login & Registrasi
    │   ├── dashboard/
    │   │   ├── MetricCards.jsx        # Kartu saldo, pemasukan, pengeluaran
    │   │   ├── ProgressBar.jsx        # Gauge progres tugas harian + konfeti
    │   │   └── AiInsightCard.jsx      # Kartu intelijensi AI Gemini
    │   ├── finance/
    │   │   ├── FinanceForm.jsx        # Formulir mutasi kas
    │   │   └── FinanceList.jsx        # Tabel histori mutasi kas
    │   ├── layout/
    │   │   ├── Navbar.jsx             # Header navigasi & status akun
    │   │   ├── Shell.jsx              # Wrapper layout container
    │   │   └── SettingsModal.jsx      # Modal konfigurasi Supabase & Gemini
    │   └── todos/
    │       ├── TodoForm.jsx           # Formulir jadwal per jam
    │       └── TodoList.jsx           # Daftar agenda kronologis
    ├── lib/
    │   ├── aiService.js               # Service integrasi Gemini AI
    │   ├── dataService.js             # Data layer multi-user
    │   ├── supabaseClient.js          # Inisialisasi Supabase SDK
    │   └── utils.js                   # Formula progres, kalkulasi kas, formatting
    ├── App.jsx                        # State root & orchestrator
    ├── index.css                      # Design tokens Neo-Brutalism
    └── main.jsx
```

---

## 🛠️ Menjalankan Aplikasi Secara Lokal

### 1. Jalankan Development Server
```bash
npm install
npm run dev
```
Buka browser pada: [http://localhost:5173](http://localhost:5173)

### 2. Konfigurasi Supabase (Opsional)
FinDo siap digunakan langsung secara lokal dengan data sampel default. Jika ingin menghubungkan ke database Supabase Cloud:
1. Buat proyek baru di [Supabase Dashboard](https://supabase.com).
2. Salin isi file `supabase/schema.sql` dan jalankan pada **SQL Editor** di Supabase.
3. Masukkan `Project URL` dan `Anon Key` ke `.env.local` atau langsung melalui modal **Settings** di pojok kanan atas aplikasi.
