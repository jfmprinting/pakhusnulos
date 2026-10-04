# DESIGN SYSTEM: PAK HUSNUL MASTER CONTENT OPERATING SYSTEM
**Versi:** 1.0.0 | **Tema:** *Executive Creator OS & Fintech Obsidian* | **Target Viewport:** Desktop (1440px/1920px) & Mobile (375px–430px)

---

## 1. FILOSOFI DESAIN & IDENTITAS VISUAL

Desain antarmuka **Pak Husnul Master Content Operating System** didasarkan pada tiga pilar utama:
1. **Executive Authority & Focus:** Tampilan bernuansa gelap mewah (*Obsidian Slate*) dengan permukaan *glassmorphism* lembut yang meminimalkan kelelahan mata (*eye fatigue*) saat bekerja berjam-jam, sekaligus memberikan kesan profesional seperti terminal Bloomberg / Linear.
2. **Channel-Distinct Color Coding:** Setiap mesin konten dan pendapatan memiliki aksen warna distingtif yang konsisten di semua layar, memungkinkan pengguna mengenali konteks saluran dalam 100 milidetik:
   - **Revenue & Finansial:** Emerald / Mint Jade (Melambangkan uang masuk & target 500K/hari).
   - **YouTube Cadence:** Crimson YouTube & Electric Blue (Melambangkan video Long-form & Live).
   - **Daily Social (TikTok/Threads):** Violet & Neon Purple (Kreativitas & konten harian).
   - **WhatsApp Distribution:** WhatsApp Forest Green & Spring Emerald (Komunikasi komunitas).
   - **Sumber Belajar & Membership:** Gold Amber & Warm Ochre (Aset berharga & membership).
3. **Ergonomi Dua Layar (Desktop Power vs Mobile Speed):**
   - Di Desktop: Padat data (*high data density*), multi-kolom, filter lengkap, dan navigasi cepat keyboard.
   - Di Mobile: Antarmuka berbasis jempol (*thumb-friendly*), kartu besar, tombol sentuh minimal 44x44px, dan akses navigasi mengambang di bawah layar.

---

## 2. PALET WARNA & DESIGN TOKENS (CSS VARIABLES)

```css
:root {
  /* ==========================================================================
     BASE NEUTRAL: OBSIDIAN SLATE (DARK MODE DEFAULT)
     ========================================================================== */
  --bg-app: #0B0F17;              /* Deep obsidian canvas */
  --bg-surface: #111827;          /* Primary card surface */
  --bg-surface-elevated: #1F2937; /* Dropdowns, popovers, tooltips */
  --bg-surface-glass: rgba(17, 24, 39, 0.75); /* Glassmorphic blur */
  --bg-surface-active: #283548;   /* Active / pressed state */

  /* BORDERS & DIVIDERS */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-medium: rgba(255, 255, 255, 0.15);
  --border-focus: #3B82F6;

  /* TYPOGRAPHY COLORS */
  --text-primary: #F9FAFB;   /* High contrast white */
  --text-secondary: #9CA3AF; /* Muted silver gray */
  --text-tertiary: #6B7280;  /* Subdued caption gray */
  --text-inverse: #0B0F17;   /* For colored buttons/badges */

  /* ==========================================================================
     SEMANTIC CHANNELS & ENGINES
     ========================================================================== */
  /* REVENUE & NORTH STAR (EMERALD) */
  --color-revenue: #10B981;
  --color-revenue-hover: #059669;
  --color-revenue-light: rgba(16, 185, 129, 0.12);
  --color-revenue-glow: rgba(16, 185, 129, 0.25);

  /* YOUTUBE ENGINE (CRIMSON & SAPPHIRE) */
  --color-youtube: #EF4444;
  --color-youtube-light: rgba(239, 68, 68, 0.12);
  --color-youtube-accent: #3B82F6;

  /* DAILY SOCIAL: TIKTOK & THREADS (PURPLE) */
  --color-social: #8B5CF6;
  --color-social-hover: #7C3AED;
  --color-social-light: rgba(139, 92, 246, 0.12);

  /* WHATSAPP DISTRIBUTION (FOREST GREEN) */
  --color-wa: #22C55E;
  --color-wa-hover: #16A34A;
  --color-wa-light: rgba(34, 197, 94, 0.12);

  /* SUMBER BELAJAR / MEMBERSHIP (AMBER GOLD) */
  --color-membership: #F59E0B;
  --color-membership-light: rgba(245, 158, 11, 0.12);

  /* ==========================================================================
     PRIORITY SYSTEM
     ========================================================================== */
  --priority-p0-bg: rgba(239, 68, 68, 0.15);
  --priority-p0-text: #F87171;
  --priority-p0-border: rgba(239, 68, 68, 0.35);

  --priority-p1-bg: rgba(245, 158, 11, 0.15);
  --priority-p1-text: #FBBF24;
  --priority-p1-border: rgba(245, 158, 11, 0.35);

  --priority-p2-bg: rgba(59, 130, 246, 0.15);
  --priority-p2-text: #60A5FA;
  --priority-p2-border: rgba(59, 130, 246, 0.35);

  --priority-p3-bg: rgba(156, 163, 175, 0.12);
  --priority-p3-text: #9CA3AF;
  --priority-p3-border: rgba(156, 163, 175, 0.25);

  /* ==========================================================================
     TASK & CALENDAR STATUS
     ========================================================================== */
  --status-planned-bg: #1E293B;
  --status-planned-text: #94A3B8;

  --status-inprogress-bg: rgba(6, 182, 212, 0.15);
  --status-inprogress-text: #22D3EE;

  --status-done-bg: rgba(16, 185, 129, 0.18);
  --status-done-text: #34D399;

  --status-past-bg: rgba(75, 85, 99, 0.2);
  --status-past-text: #6B7280;

  --status-skipped-bg: rgba(244, 63, 94, 0.12);
  --status-skipped-text: #FB7185;

  /* ==========================================================================
     TIER SYSTEM
     ========================================================================== */
  --tier-free-bg: rgba(59, 130, 246, 0.15);
  --tier-free-text: #93C5FD;

  --tier-premium-bg: rgba(245, 158, 11, 0.18);
  --tier-premium-text: #FCD34D;

  --tier-public-bg: rgba(16, 185, 129, 0.15);
  --tier-public-text: #6EE7B7;
}
```

---

## 3. SISTEM TIPOGRAFI (TYPOGRAPHY)

- **Font Utama (Interface & Teks):** `Plus Jakarta Sans`, `Inter`, `-apple-system`, `sans-serif`
- **Font Angka & Finansial (Data & Metrics):** `JetBrains Mono`, `Fira Code`, `monospace` (Memastikan angka tidak melompat saat kalkulasi dinamis berganti).

### Skala Tipografi:

| Token | Ukuran (px / rem) | Line Height | Weight | Penggunaan Utama |
|:---|:---|:---|:---|:---|
| `display-lg` | 32px / 2.0rem | 1.2 | 700 (Bold) | Hero Stat Omset 500K, Judul Utama Halaman |
| `heading-1` | 24px / 1.5rem | 1.3 | 700 (Bold) | Judul Widget Today's Battlecard, Section Header |
| `heading-2` | 20px / 1.25rem | 1.4 | 600 (SemiBold) | Nama Hari / Pekan, Judul Modal Drawer |
| `heading-3` | 16px / 1.0rem | 1.4 | 600 (SemiBold) | Subheader Kanal, Judul Card Sumber Belajar |
| `body-base` | 14px / 0.875rem | 1.5 | 400 (Regular) | Teks Utama Kalender, Draf Pesan WA, Instruksi |
| `body-sm` | 12px / 0.75rem | 1.5 | 400 (Regular) | Catatan Kaki, Petunjuk Do Not, Deskripsi Kanal |
| `caption-xs` | 11px / 0.6875rem| 1.4 | 500 (Medium) | Label Pill, Badges Priority, Tag Status |
| `mono-number`| 15px / 0.9375rem| 1.2 | 600 (SemiBold) | Format Mata Uang (Rp 500.000), Persentase, Tanggal |

---

## 4. SISTEM ELEVASI, SPACING & GLASSMORPHISM

### 4.1 Spacing Scale (Kelipatan 4px / 8px)
- `space-1`: 4px | `space-2`: 8px | `space-3`: 12px | `space-4`: 16px
- `space-5`: 20px | `space-6`: 24px | `space-8`: 32px | `space-10`: 40px

### 4.2 Radius Border
- `radius-sm`: 6px (Badges & Mini Pills)
- `radius-md`: 10px (Tombol aksi, Input field, Dropdown)
- `radius-lg`: 16px (Kartu modul, Panel kontainer, Battlecard)
- `radius-xl`: 24px (Mobile Bottom Drawer, Modal Dialog)
- `radius-full`: 9999px (Status Indicator Dots, Tag Bulat)

### 4.3 Glassmorphism & Bayangan (Shadows)
- **Glass Panel Surface:**
  ```css
  background: rgba(17, 24, 39, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  ```
- **Active Card Glow:**
  ```css
  box-shadow: 0 0 20px -3px rgba(16, 185, 129, 0.25);
  border-color: rgba(16, 185, 129, 0.4);
  ```

---

## 5. ANATOMI KOMPONEN & SPESIFIKASI

### 5.1 Kartu Status Finansial (Stat Card)
```
+------------------------------------------------------+
| TARGET BERSIH / HARI                                 |
| Rp 500.000             [ FASE 1: Rp 350.000 ]        |
| [========================>.................] 70% Run |
| 3.45 Transaksi Dibutuhkan / Hari (Weighted AOV 169K) |
+------------------------------------------------------+
```
- **Warna Aksen:** `--color-revenue`
- **Angka Mata Uang:** Monospace font semi-bold.
- **Indikator Progres:** Baris progres horizontal halus 4px tinggi dengan transisi ease-in-out.

### 5.2 Today's Battlecard (Komponen Harian Utama)
- **Struktur:**
  - Header: Nama Hari, Tanggal, Pekan ke-n, dan Badge Prioritas (P0/P1).
  - 4 Kotak Sub-Mesin (Grid 4 Kolom di Desktop, Stack / Carousel di Mobile):
    1. *Social Box:* Icon TikTok/Threads, Rekomendasi Hero Product, Badge Sudut Konten (*Angle*), Tombol Checkbox *Published*.
    2. *YouTube Box:* Icon YouTube, Judul Slot (Long-form/Shorts/Live/Rest), Aturan Proteksi (*Locked*).
    3. *WhatsApp Box:* Icon WA, Tema Publik (Guru Mahir AI) & Privat (Aidukasi), Tombol *Copy Broadcast*.
    4. *Sumber Belajar Box:* Icon Vault, Menu & Judul Aset, Badge Tier (FREE/PREMIUM).

### 5.3 Badges & Status Pills
- **Prioritas:**
  - `P0`: Background merah transparan, border merah, ikon tanda seru (!).
  - `P1`: Background jingga transparan, border jingga.
  - `P2`: Background biru muda transparan.
- **Status Tugas:**
  - `Planned`: Abu-abu keperakan, teks netral.
  - `In Progress`: Cyan menyala dengan animasi titik berkedip (*pulse dot*).
  - `Done`: Hijau zamrud pekat dengan ikon centang (✓).
  - `Past`: Muted gelap (menandakan histori tanggal yang sudah lewat).

### 5.4 Tombol Aksi (Action Buttons)
- **Primary Action (Kirim / Simpan / Salin):**
  - Background: Gradient emerald (`#10B981` ke `#059669`).
  - Efek Hover: Naik 1px (`transform: translateY(-1px)`), bayangan menyala (*glow shadow*).
  - Efek Tekan (*Active*): Skala 0.98 untuk memberikan umpan balik sentuhan (*tactile touch feedback*).
- **Secondary Action (Filter / Batal):**
  - Background: `rgba(255, 255, 255, 0.05)`, border `var(--border-subtle)`.
- **Destructive Action (Reset):**
  - Background: `rgba(239, 68, 68, 0.1)`, teks merah.

### 5.5 Input & Interactive Sliders (Untuk Simulator Ekonomi)
- **Track Slider:** Tebal 6px, warna track terisi emerald `#10B981`, warna latar track abu-abu pekat `#1F2937`.
- **Thumb Slider:** Diameter 20px, lingkaran putih berbayang dengan cincin fokus emerald saat ditekan.
- **Input Field:** Background gelap `#0B0F17`, teks putih, padding 10px 14px, sudut lengkung 8px.

---

## 6. SISTEM RESPONSIVITAS & BREAKPOINTS

```
Breakpoints:
  [ Mobile Saku ]      < 640px    (sm)  -> Single column, sticky bottom dock, drawer modal
  [ Tablet Portrait ]  640px - 768px    -> 2-column grid, compact sidebar
  [ Tablet / Laptop ]  769px - 1024px   -> Full sidebar, 2 to 3 column dashboard
  [ Desktop Standard ] 1025px - 1440px  -> 4-column battlecard, dense data tables
  [ Ultra-wide ]       > 1440px   (2xl) -> Centered container max-w-7xl, expanded charts
```

### Panduan Khusus Tampilan Mobile (< 640px):
1. **Sticky Bottom Navigation Bar:**
   - Tinggi: 64px dengan safe area padding untuk iPhone (Home Indicator bar).
   - 5 Item Navigasi:
     1. `Today` (Ikon Target / Petir)
     2. `Calendar` (Ikon Kalender 91)
     3. `Social` (Ikon Video TikTok)
     4. `WA` (Ikon Pesan Chat)
     5. `More / Menu` (Ikon Garis 3 untuk Simulator & Sumber Belajar)
2. **Horizontal Week Selector Strip:**
   - Deretan tombol tanggal mendatar (*horizontal swipe pill*) di bagian atas kalender sehingga pengguna dapat berganti hari hanya dengan sekali geser jempol.
3. **Bottom Sheet Drawers:**
   - Menghindari popup modal kaku di tengah layar pada ponsel. Semua detail menggunakan laci (*bottom sheet*) yang meluncur mulus dari bawah layar dan dapat ditutup dengan sapuan ke bawah (*swipe-to-dismiss*).

---

## 7. MIKRO-INTERAKSI & PEDOMAN ANIMASI

- **Durasi Transisi Standar:**
  - Instan / Hover: `150ms cubic-bezier(0.4, 0, 0.2, 1)`
  - Slide-in Drawer / Modal: `250ms cubic-bezier(0.16, 1, 0.3, 1)` (Efek pegas lembut).
- **One-Tap Copy to Clipboard:**
  - Saat tombol *Copy WA Broadcast* ditekan:
    1. Teks tombol langsung berubah menjadi *"Tersalin! (Copied ✓)"*.
    2. Muncul *toast notification* elegan di pojok kanan atas (Desktop) atau tengah atas (Mobile) selama 2 detik.
    3. Haptic feedback ringan (jika didukung perangkat seluler).
- **Check Task Done:**
  - Mengubah status tugas menjadi *Done* memicu efek transisi warna hijau lembut dan penambahan tanda centang seketika (*optimistic UI* sebelum response network Supabase selesai).
