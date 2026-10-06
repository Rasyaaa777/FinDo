# FinDo Design System Specification (design.md)
**Version:** 1.0.0  
**Design Paradigm:** Neo-Brutalism (Bold, Systematic, High-Contrast)  
**Target Platform:** Web (Desktop & Mobile Responsive)  
**Implementation Mode:** Framework-Agnostic (CSS Custom Properties)

---

## 1. Overview

Sistem desain FinDo dibangun di atas pendekatan **Neo-Brutalism**: menggabungkan kejujuran visual raw material dengan kegunaan digital modern. Pendekatan ini selaras langsung dengan proposisi nilai FinDo: ketegasan dalam manajemen waktu harian dan kejernihan mutlak dalam pelacakan keuangan.

### Prinsip Desain
1. **Unapologetic Clarity (Kejelasan Tegas):** Tidak ada elemen semu, gradien samar, atau bayangan blur yang menipu mata. Batas data dan batas aksi harus terdefinisi jelas dengan border solid hitam.
2. **High-Contrast Affordance (Keterlihatan Aksi):** Tombol, checkbox, dan input tampak nyata dan mudah ditekan (*tangible*), merefleksikan aksi nyata pengguna saat menyelesaikan jam kerja atau mencatat mutasi uang.
3. **Time & Money Ledger Feel:** Mengadopsi estetika formulir fisik, kwitansi, dan agenda agenda analog yang dipadukan dengan modul analitik modern.

---

## 2. Color Tokens

### 2.1 Core Palette

| Token Name | Value (Hex) | Kegunaan & Semantik |
| :--- | :--- | :--- |
| `--color-canvas` | `#F6F4EE` | Latar belakang utama aplikasi (warm paper beige). |
| `--color-surface` | `#FFFFFF` | Latar belakang kartu, baris data, dan modal. |
| `--color-surface-subtle` | `#EAE6DC` | Latar selang-seling, disabled surface, & inactive container. |
| `--color-ink-primary` | `#000000` | Teks utama, border stroke, dan hard drop-shadows. |
| `--color-ink-secondary` | `#4B4B4B` | Sub-label, meta-text pendukung, dan timestamp. |
| `--color-primary` | `#FFE600` | Aksen dominan FinDo: To-Do priority, kartu metrik utama. |
| `--color-primary-hover` | `#FFD000` | State hover elemen primary. |
| `--color-accent-teal` | `#00E5CC` | Metrik positif, pemasukan (*income*), tombol aksi cepat. |
| `--color-accent-magenta`| `#FF2A85` | Aksen visual, alert kritis, badge highlight. |

### 2.2 Status & Functional Colors

| Token Name | Value (Hex) | Kegunaan |
| :--- | :--- | :--- |
| `--color-success` | `#00D26A` | To-Do status "Completed", transaksi "Income". |
| `--color-success-bg` | `#D4F8E8` | Background alert & pill badge transaksi Income. |
| `--color-danger` | `#FF4B4B` | Transaksi "Expense", aksi hapus/destructive, error field. |
| `--color-danger-bg` | `#FFE4E4` | Background alert transaksi Expense & validation error. |
| `--color-warning` | `#FFAA00` | Status AI "Perhatian", task tertunda / overdue. |
| `--color-warning-bg` | `#FFF3D6` | Background callout peringatan AI. |
| `--color-info` | `#00B4D8` | Status AI "Aman", indikator filter aktif. |

### 2.3 Interactive States Matrix

| State | Background | Border | Shadow Offset | Transform |
| :--- | :--- | :--- | :--- | :--- |
| **Default** | Token Base | `2px solid #000` | `3px 3px 0px #000` | `translate(0, 0)` |
| **Hover** | 10% Lebih Gelap/Terang | `2px solid #000` | `5px 5px 0px #000` | `translate(-2px, -2px)` |
| **Active / Pressed**| Token Base | `2px solid #000` | `0px 0px 0px #000` | `translate(3px, 3px)` |
| **Focus Visible** | Base | `3px solid #000` | `0 0 0 3px #FFE600` | Kontur luar tampak |
| **Disabled** | `--color-surface-subtle`| `2px solid #888` | `none` | Cursor `not-allowed` |

---

## 3. Typography

### 3.1 Font Family
* **Display & Heading:** `'Space Grotesk'`, `'Archivo Black'`, system UI sans-serif bold.
* **Body & Data:** `'Inter'`, `'Public Sans'`, system-ui, -apple-system, BlinkMacSystemFont, sans-serif.
* **Monospace & Code (Jam & Angka Nominal):** `'JetBrains Mono'`, `'Space Mono'`, monospace.

### 3.2 Type Scale

| Level | Size (rem / px) | Weight | Line Height | Tracking | Penggunaan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display H1** | `2.25rem` (36px) | 800 (Extrabold) | `1.15` | `-0.03em` | Header halaman Dashboard utama, Total Saldo. |
| **Heading H2** | `1.50rem` (24px) | 700 (Bold) | `1.25` | `-0.02em` | Judul Section (Jadwal Hari Ini, Cashflow). |
| **Heading H3** | `1.125rem` (18px) | 700 (Bold) | `1.30` | `-0.01em` | Judul Card, Modal Header, Status AI. |
| **Body Standard** | `0.9375rem` (15px) | 500 (Medium) | `1.50` | `0` | Deskripsi task, keterangan transaksi, insight AI. |
| **Body Small** | `0.8125rem` (13px) | 500 (Medium) | `1.40` | `0` | Subtitle kolom, meta waktu to-do, form helper. |
| **Numeric Large** | `1.75rem` (28px) | 700 (Bold) | `1.20` | `-0.02em` | Angka metrik keuangan, persentase progress. |
| **Tag & Label** | `0.6875rem` (11px) | 800 (Extrabold) | `1.00` | `+0.05em` | Badge uppercase kategori, status chip. |

---

## 4. Spacing & Layout

### 4.1 Spacing Scale
Semua spacing konsisten kelipatan 4px:

| Token | Nilai (px / rem) | Contoh Penerapan |
| :--- | :--- | :--- |
| `--space-1` | `4px` (`0.25rem`) | Gap ikon ke teks, padding badge mini. |
| `--space-2` | `8px` (`0.5rem`) | Padding tombol kecil, jarak antar checkbox dan label. |
| `--space-3` | `12px` (`0.75rem`) | Padding input teks vertikal, inner spacing baris daftar. |
| `--space-4` | `16px` (`1.0rem`) | Padding kartu ringkasan, gap form inputs. |
| `--space-6` | `24px` (`1.5rem`) | Gap antar card dashboard, padding container modal. |
| `--space-8` | `32px` (`2.0rem`) | Jarak antar section besar di dashboard. |
| `--space-12`| `48px` (`3.0rem`) | Margin atas/bawah halaman utama. |

### 4.2 Breakpoints & Layout Container
* **Mobile (Default):** `< 640px` (Single column stack, fixed bottom/top navigation, sticky submit CTA).
* **Tablet:** `640px – 1023px` (2 columns grid: Dashboard metric 2x2, To-Do dan Cashflow stack vertikal).
* **Desktop:** `≥ 1024px` (Max width container: `1240px`, 12-column grid layout split 7:5 untuk To-Do vs Cashflow).

---

## 5. Border, Radius & Shadow

### 5.1 Border Tokens
* `--border-stroke-thick`: `2px solid #000000` (Standar tombol, input, card).
* `--border-stroke-heavy`: `3px solid #000000` (Header, alert box, container terluar).
* `--border-stroke-dashed`: `2px dashed #000000` (Divider section, slot kosong / drop zone).

### 5.2 Radius Tokens
* `--radius-none`: `0px` (Tag, input box, header baris tabel).
* `--radius-sm`: `4px` (Checkbox, tombol kecil, pill status).
* `--radius-md`: `6px` (Card metrik, form container, modal box).
* `--radius-full`: `9999px` (Avatar user pill).

### 5.3 Hard Shadow (Neo-Brutalist Lift)
Neo-brutalisme tidak menggunakan blur (`rgba(0,0,0,0.1)`). Hanya menggunakan offset solid:
* `--shadow-flat`: `0 0 0 transparent`
* `--shadow-sm`: `2px 2px 0px #000000` (Input, badge, tombol kecil)
* `--shadow-md`: `4px 4px 0px #000000` (Kartu metrik, card to-do, list item)
* `--shadow-lg`: `6px 6px 0px #000000` (Modal dialog, popover AI insight)
* `--shadow-active`: `0px 0px 0px #000000` (Tombol saat tertekan)

---

## 6. Components

Komponen diformulasikan secara khusus untuk memenuhi seluruh spesifikasi PRD FinDo:

### 6.1 Button (`C-BTN`)
* **Anatomi:** Container kotak + border 2px solid + teks tebal uppercase + ikon opsional di kiri/kanan.
* **Varian:**
  * `Primary`: Background `--color-primary` (kuning), teks hitam.
  * `Secondary`: Background `--color-surface` (putih), teks hitam.
  * `Destructive`: Background `--color-danger` (merah), teks putih.
  * `Accent`: Background `--color-accent-teal` (teal), teks hitam (CTA aksi AI).
* **Ukuran:**
  * `sm`: padding 6px 12px, font 12px bold.
  * `md`: padding 10px 18px, font 14px bold (default).
  * `lg`: padding 14px 24px, font 16px bold (full width form submission).
* **State:**
  * `Default`: Shadow 3px 3px 0px #000.
  * `Hover`: Translasi (-2px, -2px), shadow 5px 5px 0px #000.
  * `Active`: Translasi (2px, 2px), shadow 0px 0px 0px #000.
  * `Disabled`: Background `#EAE6DC`, teks `#888888`, border `#888888`, no shadow.
  * `Loading`: Teks diganti spinner kubus monokrom, cursor `wait`.

### 6.2 Input & Select Field (`C-INPUT`, `C-SELECT`)
* **Anatomi:** Label teks tebal di atas -> Box field (border 2px, radius 4px) -> Helper text atau Error message di bawah.
* **State:**
  * `Default`: Background `#FFFFFF`, border `2px solid #000000`, shadow `2px 2px 0px #000000`.
  * `Focus`: Shadow `4px 4px 0px #000000`, background `#FFFFFF`.
  * `Error`: Border `2px solid #FF4B4B`, background `#FFE4E4`, teks error merah bold dengan ikon seru.
  * `Disabled`: Background `#EAE6DC`, border `2px solid #888888`, cursor `not-allowed`.

### 6.3 Checkbox Reaktif (`C-CHECKBOX`)
* **Anatomi:** Kotak 22px × 22px, border 2px solid hitam, radius 4px.
* **State:**
  * `Unchecked`: Background putih, shadow `2px 2px 0px #000`.
  * `Checked`: Background `--color-success` (`#00D26A`), ikon centang tebal hitam (stroke 3px), efek strike-through instan pada teks task terkait.
  * `Focus`: Outline kuning 2px di luar kotak.

### 6.4 Metric Card (`C-METRIC-CARD`)
* **Anatomi:**
  * Border 2px solid hitam, shadow 4px 4px 0px hitam, background putih (atau kuning untuk Net Balance).
  * Baris Atas: Label kategori (uppercase) + Ikon badge dalam kotak hitam kecil.
  * Baris Tengah: Nominal angka besar (`Numeric Large`), font monospace.
  * Baris Bawah: Tren indikator atau rasio harian.
* **Varian FinDo:**
  * `Net Balance Card`: Background kuning primer `--color-primary`, border 3px solid hitam.
  * `Income Card`: Indikator accent teal, nominal dengan tanda `+`.
  * `Expense Card`: Indikator merah danger, nominal dengan tanda `-`.

### 6.5 Progress Bar Reaktif (`C-PROGRESS-BAR`)
* **Anatomi:**
  * Header label: "Hari ini: X dari Y tugas selesai" + teks persentase tebal (misal `75%`).
  * Track Bar: Tinggi 16px, background putih, border 2px solid hitam, radius 4px.
  * Fill Indicator: Background `--color-accent-teal` (atau kuning), border-right 2px solid hitam.
* **State:** Jika `100%`, fill berubah menjadi `--color-success` disertai label badge "Semua Beres!".

### 6.6 Hourly To-Do Item (`C-TODO-ITEM`)
* **Anatomi:**
  * Baris horizontal (flexbox): [Slot Waktu Jam] | [Checkbox] | [Judul Task] | [Tombol Aksi Hapus / Edit].
  * Slot Waktu: Tag kotak latar belakang kuning/putih, font monospace bold (`09:00 - 10:30`).
  * State Selesai: Teks task tercoret (`line-through`), opacity background baris turun ke 70%.

### 6.7 Cashflow Record Item (`C-CASHFLOW-ITEM`)
* **Anatomi:**
  * Baris list mutasi: [Icon Badge Tipe] + [Kolom: Kategori & Deskripsi Opsional & Tanggal] + [Nominal Rp].
  * Tipe Income: Pill badge "INCOME" warna hijau terang, teks nominal `+ Rp 500.000` (hijau).
  * Tipe Expense: Pill badge "EXPENSE" warna merah soft, teks nominal `- Rp 35.000` (merah).

### 6.8 AI Smart Insight Card (`C-AI-CARD`)
* **Anatomi:**
  * Header: Banner aksen dengan strip diagonal atau solid magenta, judul "AI INTEL: GEMINI 1.5".
  * Status Badge: Pill tebal berisi status (`AMAN` [Hijau] / `PERHATIAN` [Kuning] / `KRITIS` [Merah]).
  * Body: Teks ringkasan evaluasi (maksimal 2 kalimat, high readability).
  * Action Box: Kotak bertitik dua saran perbaikan konkrit dengan bullet check bold.
  * Trigger CTA: Tombol neo-brutalist "Minta Saran Cerdas" dengan status loading spinning icon.

### 6.9 Modal Dialog (`C-MODAL`)
* **Anatomi:**
  * Backdrop: Solid `#000000` dengan opasitas 60% (tanpa efek blur backdrop halus).
  * Window: Surface putih, border 3px solid hitam, shadow 8px 8px 0px hitam, header strip hitam pekat dengan teks putih dan tombol Close `[X]` kotak.

---

## 7. Page Patterns

### 7.1 Layout Shell Aplikasi
```text
+-------------------------------------------------------------------------+
| [LOGO: FINDO]          [Hari, Tanggal]            [User: Email] [LOGOUT]|
+-------------------------------------------------------------------------+
| DASHBOARD OVERVIEW                                                      |
| [ CARD: SALDO BERSIH ]  [ CARD: TOTAL PEMASUKAN ]  [ CARD: PENGELUARAN] |
+-------------------------------------------------------------------------+
| PROGRES HARI INI                                                        |
| [============================= 68% =====================]               |
+----------------------------------------------------+--------------------+
| KOLOM KIRI (Jadwal Waktu / To-Do)                  | KOLOM KANAN        |
| - Header: Agenda Jam + [ + Tambah Tugas ]          | (Arus Kas / Mutasi)|
| - Form Input Cepat (Jam Mulai, Selesai, Judul)     | - Form Catat Kas   |
| - List Item 08:00 - 09:00 [ ] Briefing Pagi        | - Filter: [Hari|Bln]
| - List Item 09:30 - 12:00 [x] Kerjakan Fitur Auth  | - Mutasi List Item |
| - List Item 14:00 - 15:00 [ ] Review Laporan Kas   |                    |
|                                                    +--------------------+
|                                                    | AI INSIGHT BOX     |
|                                                    | [ Status: AMAN ]   |
|                                                    | Rekomendasi Gemini |
+----------------------------------------------------+--------------------+
```

### 7.2 Mobile Responsive Pattern (< 640px)
* Header menjadi compact dengan judul dan hamburger/profile avatar.
* Metric cards ditampilkan dalam slider horizontal atau tumpukan vertikal (1 kolom).
* Tab switcher sederhana di bagian atas: `[ Jadwal Tugas ]` vs `[ Arus Kas ]` vs `[ AI Insight ]` untuk membagi kepadatan konten.

---

## 8. Motion & Interaction

Pendekatan neo-brutalisme menghindari easing lambat atau floating melayang:
* **Durasi Standar:** `100ms – 150ms` (respons seketika / *snappy*).
* **Timing Function:** `cubic-bezier(0, 0, 0.2, 1)` atau `steps(2)` / `linear`.
* **Button Click Feel:** Pergerakan offset diagonal `transform: translate(3px, 3px)` dengan reduksi `box-shadow` seketika ke 0px untuk memberikan sensasi mekanis sakelar tombol fisik.
* **Modal Pop:** Muncul tanpa fade panjang (`scale(0.98)` ke `scale(1)` dalam 120ms).

---

## 9. Design Tokens (CSS Custom Properties)

```css
:root {
  /* Surface & Canvas */
  --color-canvas: #F6F4EE;
  --color-surface: #FFFFFF;
  --color-surface-subtle: #EAE6DC;
  --color-surface-dark: #121212;

  /* Ink & Stroke */
  --color-ink-primary: #000000;
  --color-ink-secondary: #4B4B4B;
  --color-ink-inverse: #FFFFFF;

  /* Brand Accents */
  --color-primary: #FFE600;
  --color-primary-hover: #FFD000;
  --color-accent-teal: #00E5CC;
  --color-accent-magenta: #FF2A85;

  /* Semantics */
  --color-success: #00D26A;
  --color-success-bg: #D4F8E8;
  --color-danger: #FF4B4B;
  --color-danger-bg: #FFE4E4;
  --color-warning: #FFAA00;
  --color-warning-bg: #FFF3D6;

  /* Typography */
  --font-heading: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Border & Outline */
  --border-thick: 2px solid var(--color-ink-primary);
  --border-heavy: 3px solid var(--color-ink-primary);
  --border-dashed: 2px dashed var(--color-ink-primary);

  /* Radius */
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-full: 9999px;

  /* Shadows (Neo-Brutalist Hard Offsets) */
  --shadow-none: 0 0 0 transparent;
  --shadow-sm: 2px 2px 0px var(--color-ink-primary);
  --shadow-md: 4px 4px 0px var(--color-ink-primary);
  --shadow-lg: 6px 6px 0px var(--color-ink-primary);

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  /* Transitions */
  --transition-fast: 120ms cubic-bezier(0, 0, 0.2, 1);
}
```

---

## 10. Do & Don't

| Kategori | DO (Lakukan) | DON'T (Jangan Lakukan) |
| :--- | :--- | :--- |
| **Borders** | Gunakan stroke tebal 2px/3px hitam pekat di setiap elemen interaktif. | Jangan hilangkan border atau memakai border tipis abu-abu `1px #E5E7EB`. |
| **Shadows** | Gunakan hard offset shadow tanpa blur radius (`4px 4px 0px #000`). | Jangan gunakan drop-shadow halus berefek blur (`0 10px 15px rgba(0,0,0,0.1)`). |
| **Colors** | Gunakan warna aksen jenuh tinggi (*saturated*) dipadukan canvas beige. | Jangan gunakan gradien warna-warni halus (*soft pastels & linear-gradients*). |
| **Hierarchy** | Gunakan huruf kapital tegas (*UPPERCASE*) pada label, tag, dan header tombol. | Jangan gunakan font tulisan tangan, serif dekoratif, atau font tipis berbobot 300. |
| **Action** | Berikan feedback mechanical press (translasi posisi) saat tombol diklik. | Jangan biarkan tombol tanpa state hover dan active yang jelas. |

---

## 11. Accessibility (A11y)

1. **Rasio Kontras (WCAG AAA/AA):**
   * Semua teks hitam pekat (`#000000`) di atas latar canvas beige (`#F6F4EE`), kuning (`#FFE600`), atau putih (`#FFFFFF`) menghasilkan kontras $\ge 12:1$, melampaui standar minimum WCAG AAA (7:1).
   * Teks di atas warna aksen magenta atau merah menggunakan teks putih tebal (`#FFFFFF`) dengan rasio $> 4.5:1$.
2. **Indikator Fokus Keyboard:**
   * Elemen interaktif tidak boleh menghilangkan `outline`. Saat difokus menggunakan keyboard (Tab), terapkan outline `3px solid #000000` dengan offset kontras kuning `--color-primary`.
3. **Target Sentuh Minimum (Touch Targets):**
   * Semua tombol, checkbox container, dan input memiliki ukuran minimum tap area $44 \times 44\text{ px}$ pada tampilan perangkat mobile.

---

## 12. Implementation Notes

### Pemetaan ke Tech Stack PRD (React 18 + Tailwind CSS):
* Daftarkan seluruh token CSS variables ke dalam file `index.css` di root `:root`.
* Konfigurasikan file `tailwind.config.js` untuk memperluas palet warna (`colors`), bayangan (`boxShadow: { 'neo': '4px 4px 0px #000000', 'neo-sm': '2px 2px 0px #000000' }`), dan jenis border stroke agar dapat dipanggil menggunakan utility classes Tailwind standar (`bg-brand-primary border-2 border-black shadow-neo`).
* Gunakan ikon dari `lucide-react` dengan konfigurasi default `strokeWidth={2.5}` untuk menyelaraskan ketebalan garis ikon dengan tebal border komponen.

*(Untuk framework atau stack lain: seluruh variabel CSS di section 9 siap digunakan langsung pada vanilla HTML/CSS, Vue, Svelte, atau Web Components tanpa dependensi eksternal).*