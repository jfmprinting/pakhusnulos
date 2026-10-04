# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## PAK HUSNUL MASTER CONTENT OPERATING SYSTEM (90 HARI)
**Versi:** 1.0.0 | **Tanggal Target Mulai:** 5 Oktober 2026 | **Database:** Supabase PostgreSQL

---

## 1. PENDAHULUAN & LATAR BELAKANG

### 1.1 Masalah Bisnis
Pak Husnul mengelola ekosistem bisnis digital dan kreasi konten berbasis AI yang mencakup beberapa mesin pendapatan dan distribusi secara simultan:
1. **Hero Products:** ModulAjar Online (Rp 149.000) dan BuatSoal Online (Pro Rp 149.000, Max Rp 249.000).
2. **Mesin YouTube:** 2 video Long-form, 2 Shorts, dan 1 sesi Live per minggu untuk membangun otoritas.
3. **Mesin Media Sosial Harian:** Minimal 1 postingan harian di TikTok dan Threads menggunakan rotasi 7 sudut konten (*content angle*).
4. **Mesin Komunitas WhatsApp:** 2 kolam audiens yang berbeda: *Guru Mahir AI* (kolam publik/hangat) dan *Aidukasi* (kolam tertutup/anggota loyal).
5. **Mesin Membership Sumber Belajar:** 50 aset kurasi digital (Bank Prompt, AI Skills, Tutorial, Apps, dll.) dalam tier FREE dan PREMIUM.

Sebelumnya, seluruh rencana 90 hari ini tersimpan di dalam file Excel 12 sheet (`PAK_HUSNUL_Master_Content_Operating_System_90_Hari_START_5_OKTOBER_2026.xlsx`). 

### 1.2 Masalah File Excel Saat Ini
- **Tidak Nyaman di Ponsel (Mobile):** Saat memproduksi video TikTok di luar ruangan atau membagikan pesan ke grup WhatsApp via ponsel, membuka file Excel 12 sheet sangat lambat, sulit dibaca, dan rawan salah ketik.
- **Kurang Interaktif:** Tidak ada tombol cepat untuk mencentang *"Sudah Tayang"*, menyalin (*copy-paste*) pesan WhatsApp dengan 1 ketukan, atau melihat agenda hari ini secara fokus tanpa terdistraksi baris lain.
- **Ketiadaan Realtime & Notifikasi:** Sulit memantau apakah target harian Rp 500K sudah tercapai secara bergulir (*rolling 30-day run-rate*).

### 1.3 Solusi: Web App Terpadu Responsif
Membangun aplikasi web kelas eksekutif berbasis cloud (Supabase) yang responsif di Desktop dan Mobile, menyajikan tampilan terpadu:
- **Di Desktop:** Dashboard komprehensif, multi-kolom, kalender master 91 hari dengan penyaringan cepat, dan simulator kalkulasi ekonomi.
- **Di Mobile:** Kartu aksi harian (*Today's Battlecard*) dengan antarmuka sentuh jempol (*thumb-friendly*), tombol salin cepat pesan WA, dan penginput link konten instan.

---

## 2. GOALS & METRIK UTAMA (NORTH STAR)

| Kategori | Target Utama | Indikator Keberhasilan (KPI) |
|:---|:---|:---|
| **Revenue North Star** | **Rp 500.000 Bersih / Hari** | Rolling 30-day net revenue mencapai Rp 15.000.000 pada akhir Fase 3. |
| **Tahapan Fase** | **Fase 1 (Hari 1–30):** Rp 350.000/hari<br>**Fase 2 (Hari 31–60):** Rp 425.000/hari<br>**Fase 3 (Hari 61–90):** Rp 500.000/hari | Kepatuhan target omset mingguan sesuai fase masing-masing. |
| **Konsistensi Konten** | **>= 1 Post / Hari** di TikTok + Threads | 100% hari terisi konten produk terarah. |
| **Disiplin YouTube** | **2 Long-form + 2 Shorts + 1 Live / Minggu** | Tidak menambah jadwal YouTube di luar rencana sumber. |
| **Distribusi WhatsApp** | **5–7 Touchpoints / Minggu** | Guru Mahir AI & Aidukasi tersentuh pesan berkala tanpa spamming. |
| **Efisiensi Kerja** | **Zero Overwork & Zero Redundancy** | Konten Sumber Belajar 80%+ merupakan hasil alih fungsi (*repurpose*) dari YouTube dan produk. |

---

## 3. USER PERSONA & USER JOURNEY

### Persona: Pak Husnul (Solo Creator & EdTech Entrepreneur)
- **Karakteristik:** Sangat disiplin, fokus pada hasil (*revenue-oriented*), memegang prinsip simplifikasi ("Jangan menambah pekerjaan").
- **Kebutuhan Harian:**
  1. *Pagi (via HP):* Buka Web App, lihat kartu *Today's Battlecard*, salin materi broadcast WA ke grup *Guru Mahir AI* atau *Aidukasi*.
  2. *Siang (via HP/PC):* Cek tema harian TikTok/Threads (misal: "Hari Rabu = Demo"), buat video pendek, posting, lalu centang status *Published* dan tempel URL.
  3. *Sore/Malam (via PC):* Cek progress video YouTube terjadwal, review performa penjualan di Dashboard, dan siapkan materi *Sumber Belajar* jika ada jadwal.

---

## 4. SPESIFIKASI FITUR MODULAR

### Modul 1: Executive Command Center & Today's Battlecard
- **Today's Battlecard:** Menampilkan tanggal hari ini (atau tanggal kontrol yang dipilih), nama hari, pekan ke-n, dan tema pekan berjalan.
- **4 Pilar Harian Seketika:**
  - *Daily Social:* Rekomendasi produk (ModulAjar / BuatSoal), angle hari ini (Pain, Edu, Demo, dll.), tombol centang langsung.
  - *YouTube Focus:* Status slot hari ini (Long-form #1, Shorts #1, Long-form #2, Shorts #2, Live, atau Hari Istirahat/Distribusi).
  - *WhatsApp Touchpoint:* Tema Guru Mahir AI & Aidukasi dengan tombol *Quick Copy*.
  - *Sumber Belajar:* Aset digital yang dijadwalkan terbit hari ini.
- **Financial Status Widget:** Net target hari ini, rolling 30-day net, target mingguan fase aktif, dan indikator persentase ketercapaian.

### Modul 2: 90-Day Master Calendar Cockpit
- **91 Baris Kalender Terpadu:** Mulai 5 Oktober 2026 hingga 3 Januari 2027.
- **Filter Cepat:** Berdasarkan Pekan (Week 1–13), Fase (Fase 1, 2, 3), Status (Planned, In Progress, Done, Past), dan Saluran (*Channel*).
- **Inline Action:** Klik pada baris kalender untuk mengubah status secara instan tanpa memuat ulang halaman (*realtime Supabase update*).
- **Detail Drawer:** Mengklik baris kalender membuka panel samping (Desktop) atau *bottom sheet* (Mobile) berisi seluruh detail teknis, catatan, dan panduan eksekusi.

### Modul 3: 13-Week Sprint Board (Weekly Clusters)
- **Tampilan Kartu 13 Pekan:** Setiap pekan merangkum fokus revenue, kampanye utama, fokus YouTube, 2 judul Long-form, judul Live, output Sumber Belajar, dan target omset mingguan.
- **Prinsip Sinkronisasi:** Memvisualisasikan integrasi 1 tema mingguan ke seluruh kanal agar tidak ada kerja ganda.

### Modul 4: Daily Social Studio (TikTok & Threads Tracker)
- **Siklus 7 Sudut Konten (*Content Angles*):**
  - *Senin:* Pain point (Masalah nyata guru)
  - *Selasa:* Education (Solusi praktis)
  - *Rabu:* Demo (Tampilan layar produk langsung)
  - *Kamis:* Use case (Studi kasus aplikasi di kelas)
  - *Jumat:* Feature (Fitur unggulan modul/soal)
  - *Sabtu:* Proof/Testimonial (Bukti keberhasilan guru lain)
  - *Minggu:* Offer/CTA (Ajakan tindakan / promosi halus)
- **Input Cepat:** Kolom status *Published* (Yes/No), kolom input URL video TikTok/Threads, dan catatan evaluasi respon penonton.

### Modul 5: YouTube Growth Command Center
- **Jadwal Ketat 5 Slot:**
  - *Selasa:* Long-form #1 (Tutorial / Build in Public)
  - *Rabu:* Shorts #1 (Potongan dari Long-form #1)
  - *Jumat:* Long-form #2 (Deep dive / Perbandingan / Studi Kasus)
  - *Sabtu:* Shorts #2 (Potongan dari Long-form #2)
  - *Minggu:* Live Session (Interaktif / Bedah Kasus)
- **Watch Target Hours Monitor:** Target kumulatif 25 jam hingga 130 jam seiring berjalannya 90 hari.
- **Aturan Proteksi Beban Kerja:** Label peringatan tegas *"LOCKED: no additional long-form/live"*.

### Modul 6: WhatsApp Distribution Station & Copy Generator
- **Dual Pool Segmented View:**
  - *Kolom Kiri / Tab 1:* **Guru Mahir AI** (Audiens umum, fokus edukasi, *soft CTA*, dilarang *hard sell*).
  - *Kolom Kanan / Tab 2:* **Aidukasi** (Audiens tertutup/pembeli loyal, *deeper framing*, penawaran lanjutan).
- **Aturan Tegas "Do Not":** Menampilkan batasan spesifik tiap hari (misal: "Jangan hard sell di hari Senin", "Jangan broadcast semua segmen di hari Jumat").
- **1-Click Copy to WhatsApp:** Menyalin format pesan siap kirim langsung ke aplikasi WhatsApp.

### Modul 7: Sumber Belajar & Membership Asset Vault
- **Katalog 50 Aset Digital:** Terbagi dalam 5 menu (*Bank Prompt*, *AI Skills*, *Tutorial*, *Apps*, *Others*).
- **Filter Tier:** FREE, PREMIUM, PUBLIC/FREE.
- **Tracking Beban Produksi (*Effort*):** Low (Repurpose), Medium (Curated), High (Manual/App).

### Modul 8: Interactive Revenue & Economic Simulator
- **Live Formula Calculator:**
  - *Weighted AOV:* Perhitungan otomatis berdasarkan harga dan bobot bauran produk (ModulAjar 40%, BuatSoal Pro 40%, BuatSoal Max 20% = Rp 169.000).
  - *Fixed Cost:* Langganan AI + Domain = Rp 741.667 / bulan.
  - *Faktor Retensi Affiliate:* 1 - (40% komisi * 25% porsi) = 90%.
  - *Kebutuhan Transaksi:* Menghitung otomatis berapa transaksi per hari (rata-rata 3,5 sales/hari) dan per minggu untuk mencapai Rp 500K bersih/hari.
- **Slider Dinamis:** Kemampuan mengubah harga, bauran produk, atau komisi affiliate untuk melihat simulasi dampak pendapatan seketika.

### Modul 9: Live KPI & Performance Tracking
- 11 metrik terpadu lintas mesin dengan indikator status otomatis (*On Track*, *At Risk*, *Behind*).

### Modul 10: Supabase Sync & Offline PWA Capability
- Sinkronisasi realtime dua arah dengan Supabase.
- Dukungan *Offline Caching* (tetap dapat melihat agenda saat koneksi lambat).

---

## 5. DETAIL ASCII WIREFRAMES: DESKTOP VIEW (>= 1024px)

### 5.1 Desktop View: Executive Dashboard & Today's Battlecard (`/`)

```
+-------------------------------------------------------------------------------------------------------------------------------+
| [LOGO] PAK HUSNUL 90-DAY OS   | Fase: FASE 1 (Hari 1-30) | Date: 05 Okt 2026 (Mon) [Change Date] | [Supabase: CONNECTED] (O)  |
+-------------------------------------------------------------------------------------------------------------------------------+
| [NAVIGATION SIDEBAR]     | [MAIN CONTENT AREA]                                                                                |
|                          |                                                                                                    |
| [*] Dashboard (Battle)   |  +----------------------------------------------------------------------------------------------+  |
| [ ] Master Calendar (91) |  | TODAY'S BATTLECARD -- Senin, 05 Okt 2026 | Week 1: Reset & Tracking | Priority: P0 (CRITICAL) |  |
| [ ] 13-Week Sprints      |  +----------------------------------------------------------------------------------------------+  |
| [ ] Daily Social Studio  |  | [1. DAILY SOCIAL]         | [2. YOUTUBE CADENCE]    | [3. WHATSAPP (PUBLIC)] | [4. SUMBER BELAJAR]|  |
| [ ] YouTube Command      |  | Channel: TikTok + Threads | Slot: Hari Distribusi   | Pool: Guru Mahir AI    | Menu: Bank Prompt  |  |
| [ ] WhatsApp Station     |  | Angle: [PAIN POINT]       | Status: No Long-form/LV | Theme: Problem Awarness| Aset: Cleanup Ref  |  |
| [ ] Sumber Belajar (50)  |  | Product: ModulAjar Online | Fokus: Repurpose Only   | Rule: Jangan Hard Sell | Tier: [FREE]       |  |
| [ ] Revenue Simulator    |  | CTA: pakhusnul.id         |                         | Soft CTA: Lihat Link   | Status: [Planned]  |  |
| [ ] KPI & Analytics      |  | [X] Mark Published        | [View YT Alignment]     | [COPY WA BROADCAST]    | [View Details]     |  |
| [ ] Settings / Import    |  +----------------------------------------------------------------------------------------------+  |
|                          |                                                                                                    |
| ------------------------ |  +-- FINANCIAL NORTH STAR: ROADMAP 500K BERSIH / HARI ------------------------------------------+  |
| QUICK STATS:             |  | TARGET BERSIH / HARI | TARGET 30 HARI NET | ESTIMASI GROSS / MINGGU | KEBUTUHAN SALES / HARI |  |
| Target: Rp 500.000/day   |  | Rp 500.000           | Rp 15.000.000      | Rp 4.081.173            | ~3.5 Transaksi / Hari  |  |
| Current Phase: Fase 1    |  | (Fase 1: Rp 350.000) | (Fase 1: Rp 10.5M) | (Fase 1: Rp 2.914.506)  | Weighted AOV: 169K     |  |
| Phase Net: Rp 350K/day   |  +----------------------------------------------------------------------------------------------+  |
| Calendar Done: 14/91     |                                                                                                    |
| Total Assets: 50         |  +-- 13-WEEK PROGRESS OVERVIEW -----------------------------------------------------------------+  |
|                          |  | [W1: Active]==== [W2: Next]---- [W3]---- [W4]---- [W5]---- [W6]---- [W7]---- [W8]---- ... [W13] |  |
| [Collapse Sidebar <]     |  | Current Campaign: "Post & Cuan reset + segmentasi customer" | Gross Target: Rp 2.914.506         |  |
+--------------------------+--+----------------------------------------------------------------------------------------------+--+
```

### 5.2 Desktop View: 90-Day Master Calendar Cockpit (`/calendar`)

```
+-------------------------------------------------------------------------------------------------------------------------------+
| MASTER CALENDAR COCKPIT (91 HARI OPERASIONAL)                     [Export Excel] [Add Custom Note] [Filter: All Phases v]     |
| Search: [ Cari topik/campaign...     ] | Week: [ All Weeks v ] | Status: [ All Status v ] | Channel: [ All Channels v ]       |
+-------------------------------------------------------------------------------------------------------------------------------+
| Date       | Day | Wk | Theme / Campaign           | Daily Product Social | YouTube Cadence           | WA Touchpoint | Stat | Act|
+------------+-----+----+----------------------------+----------------------+---------------------------+---------------+------+----+
| 05/10/2026 | Mon | W1 | Reset & Tracking           | ModulAjar (Pain Pt)  | -- (Distribusi / Istirahat| Edukasi WA    | DONE | [v]|
| 06/10/2026 | Tue | W1 | Reset & Tracking           | ModulAjar (Edu)      | LF #1: Gemini Canvas Deply| Share YT Proof| DONE | [v]|
| 07/10/2026 | Wed | W1 | Reset & Tracking           | BuatSoal (Demo)      | Shorts #1: Repurpose LF#1 | Free Resource | DONE | [v]|
| 08/10/2026 | Thu | W1 | Reset & Tracking           | ModulAjar (Use Case) | -- (Nurture Day)          | Practical Tut | PLAN | [v]|
| 09/10/2026 | Fri | W1 | Reset & Tracking           | BuatSoal (Feature)   | LF #2: Bikin App Tanpa Cod| Share YT Case | PLAN | [v]|
| 10/10/2026 | Sat | W1 | Reset & Tracking           | ModulAjar (Testimoni)| Shorts #2: Repurpose LF#2 | Resource Cklst| PLAN | [v]|
| 11/10/2026 | Sun | W1 | Reset & Tracking           | BuatSoal (Offer/CTA) | LIVE: Web App dari Nol AI | Live Reminder | PLAN | [v]|
| 12/10/2026 | Mon | W2 | Cross-sell #1 (Modul->Soal)| ModulAjar (Pain Pt)  | -- (Distribusi / Prep)    | Problem Frame | PLAN | [v]|
+------------+-----+----+----------------------------+----------------------+---------------------------+---------------+------+----+
| [Selected Day Drawer: Kamis, 08 Okt 2026]                                                                                     |
| Primary Revenue Action : Campaign edukasi & segmentasi customer lama ModulAjar.                                               |
| YouTube Coordination   : Tidak ada video YouTube baru. Dilarang menambah beban upload.                                        |
| WA Pool 1 (Public)     : Practical tutorial workflow guru. Jangan spam.                                                       |
| WA Pool 2 (Aidukasi)   : Deep workflow + soft offer BuatSoal Pro.                                                             |
| Status Toggle          : ( ) Planned   ( ) In Progress   (*) Done   ( ) Skipped    [Save Quick Update]                        |
+-------------------------------------------------------------------------------------------------------------------------------+
```

### 5.3 Desktop View: WhatsApp Dual-Pool Station (`/wa-station`)

```
+-------------------------------------------------------------------------------------------------------------------------------+
| WHATSAPP DISTRIBUTION COMMAND CENTER                              Hari Terpilih: [ Rabu (Wednesday) v ] [Sync with Today]    |
+-------------------------------------------------------------------------------------------------------------------------------+
| POOL 1: GURU MAHIR AI (Public / Warm Pool)                    | POOL 2: AIDUKASI (Closed / Warmer Member Pool)                |
+---------------------------------------------------------------+---------------------------------------------------------------+
| Target Audiens : Komunitas Guru Umum & Calon Pembeli          | Target Audiens : Pembeli Produk & Member Loyal Aktif          |
| Fokus Hari Ini : Free prompt / resource activation            | Fokus Hari Ini : Free + Deeper explanation & member retention |
| Typical CTA    : "Daftar Free Member / download di link ini"  | Typical CTA    : "Akses resource lengkap di Member Area"      |
| ATURAN TEGAS   : [!] JANGAN GATE SEMUA HAL (Harus ada value)  | ATURAN TEGAS   : [!] JANGAN MEMBUAT KONTEN BARU TERPISAH      |
+---------------------------------------------------------------+---------------------------------------------------------------+
| [GENERATED BROADCAST TEMPLATE]                                | [GENERATED BROADCAST TEMPLATE]                                |
| Halo Bapak/Ibu guru hebat di Guru Mahir AI!                  | Rekan-rekan pendidik di komunitas Aidukasi,                  |
|                                                               |                                                               |
| Sesuai janji saya, hari ini saya bagikan 1 Prompt Gratis      | Melanjutkan pembahasan deploy web aplikasi kemarin,           |
| untuk merapikan modul ajar dan kisi-kisi asesmen semester...  | ini dia arsitektur prompt khusus yang sudah saya uji...       |
|                                                               |                                                               |
| Silakan download langsung melalui link berikut:               | Teman-teman bisa langsung salin dan jalankan di platform:     |
| https://pakhusnul.id/free-resource                            | https://aidukasi.id/member-vault                              |
|                                                               |                                                               |
| [Button: COPY PUBLIC BROADCAST] [Open WhatsApp Web]          | [Button: COPY CLOSED BROADCAST] [Open WhatsApp Web]           |
+---------------------------------------------------------------+---------------------------------------------------------------+
```

### 5.4 Desktop View: Interactive Revenue Simulator (`/simulator`)

```
+-------------------------------------------------------------------------------------------------------------------------------+
| INTERACTIVE REVENUE & ECONOMIC SIMULATOR                                     [Reset Default] [Save Preset] [Export Report]    |
+-------------------------------------------------------------------------------------------------------------------------------+
| [KIRI: PARAMETER INPUT & ASUMSI]                              | [KANAN: HASIL KALKULASI & BREAKDOWN FINANSIAL]                |
|                                                               |                                                               |
| 1. Target Bersih / Hari    : [ Rp 500.000         ] [Slider]  | ESTIMASI PENDAPATAN BULANAN (30 HARI):                        |
| 2. Hari Operasional / Bulan: [ 30 Hari            ]           | - Target Bersih Bersih (Net)     : Rp 15.000.000              |
| 3. Langganan AI / Produk   : [ Rp 350.000 / bln   ]           | - Total Biaya Tetap (Fixed Cost) : Rp    741.667              |
| 4. Jumlah Hero Product     : [ 2 Produk           ]           | - Retained Factor Setelah Komisi : 90.0% (10% dialokasikan)   |
| 5. Biaya Domain / Thn      : [ Rp 250.000 / thn   ]           | = TARGET GROSS REVENUE / BULAN   : Rp 17.490.741              |
| 6. Komisi Affiliate        : [ 40 %               ]           | = TARGET GROSS REVENUE / MINGGU  : Rp  4.081.173              |
| 7. Porsi Gross dr Affiliate: [ 25 %               ]           |                                                               |
|                                                               | ANALISIS TRANSAKSI & AOV:                                     |
| BAURAN PRODUK (PRODUCT MIX):                                  | - Weighted AOV (Rata-rata Order) : Rp    169.000              |
| - ModulAjar Online  (149K) : [ 40 % ] -> Rp 59.600           | - Kebutuhan Transaksi / Bulan    : 104 Penjualan              |
| - BuatSoal Pro      (149K) : [ 40 % ] -> Rp 59.600           | - Kebutuhan Transaksi / Minggu   : ~24 Penjualan              |
| - BuatSoal Max      (249K) : [ 20 % ] -> Rp 49.800           | - Kebutuhan Transaksi / Hari     : 3.45 (~3-4 Pembeli/Hari)   |
| Total Bauran: 100%         | Weighted AOV: Rp 169.000         |                                                               |
|                                                               | TARGET BERDASARKAN FASE:                                      |
| TARGET STRATEGIS:                                             | [Fase 1] Hari 1-30  : Net Rp 350K/hari | Gross Rp 2.91M/minggu |
| [*] 80% Marketing diarahkan ke ModulAjar + BuatSoal           | [Fase 2] Hari 31-60 : Net Rp 425K/hari | Gross Rp 3.50M/minggu |
| [*] Default campaign = Normal price + value bonus (No diskon) | [Fase 3] Hari 61-90 : Net Rp 500K/hari | Gross Rp 4.08M/minggu |
+---------------------------------------------------------------+---------------------------------------------------------------+
```

---

## 6. DETAIL ASCII WIREFRAMES: MOBILE VIEW (375px - 430px)

### 6.1 Mobile View: Executive Dashboard & Today's Battlecard (`/`)

```
+------------------------------------------+
| [=] PAK HUSNUL 90D OS       [05 Okt] (O) |
| Fase 1 (Hari 1-30) | Run-rate: Rp 350K/d |
+------------------------------------------+
| TODAY'S BATTLECARD                       |
| Senin, 05 Oktober 2026 (Week 1)          |
| Theme: "Reset & Tracking"                |
+------------------------------------------+
| [!] PRIORITY P0 -- HARUS TUNTAS          |
|                                          |
| [1] SOCIAL (TikTok & Threads)            |
| * Angle: PAIN POINT                      |
| * Produk: ModulAjar Online               |
| * Min: >= 1 post | CTA: pakhusnul.id     |
| [ ] Centang Sudah Upload                 |
| [ + Masukkan Link Konten ]               |
| ---------------------------------------- |
| [2] YOUTUBE CADENCE                      |
| * Hari Ini: Distribusi & Repurpose       |
| * Status: No Long-form/Live (Safe)       |
| ---------------------------------------- |
| [3] WHATSAPP BROADCAST                   |
| * Guru Mahir AI: Edukasi & Problem       |
| * Aidukasi: Deeper Problem Framing       |
| [ COPY BROADCAST GURU MAHIR AI ]         |
| [ COPY BROADCAST AIDUKASI ]              |
| ---------------------------------------- |
| [4] SUMBER BELAJAR                       |
| * Clean up 1 Free Resource               |
| * Tier: FREE | Effort: Low               |
+------------------------------------------+
| PROGRESS PEKAN INI (WEEK 1)              |
| Gross Target: Rp 2.914.506               |
| [=========>..................] 35%       |
+------------------------------------------+
| QUICK NAVIGATION DOCK:                   |
| [Today]  [Calendar]  [Social]  [WA]  [=] |
+------------------------------------------+
```

### 6.2 Mobile View: Daily Content Quick Logger (`/daily-product`)

```
+------------------------------------------+
| <- Kembali          DAILY SOCIAL STUDIO  |
+------------------------------------------+
| Tanggal: [ < 05 Okt 2026 > ]             |
| Hari: Senin | Week 1                     |
+------------------------------------------+
| PANDUAN KONTEN HARI INI:                 |
|                                          |
| Fokus Kampanye:                          |
| Post & Cuan reset + segmentasi           |
|                                          |
| Produk Rekomendasi:                      |
| [ ModulAjar Online ]                     |
|                                          |
| Sudut Konten (Angle):                    |
| >>> [ PAIN POINT ] <<<                   |
| Ceritakan keluhan guru saat jam pulang   |
| tertunda karena modul belum rapi.        |
|                                          |
| Target Saluran:                          |
| Minimal 1 Post di TikTok & Threads       |
|                                          |
| Call to Action (CTA):                    |
| "Komen 'MODUL' saya kirim solusinya"     |
+------------------------------------------+
| STATUS PUBLISHING:                       |
| Status: (o) Planned   ( ) Published      |
|                                          |
| URL Video TikTok:                        |
| [ https://tiktok.com/@...              ] |
|                                          |
| URL Threads:                             |
| [ https://threads.net/@...             ] |
|                                          |
| Catatan / Hook yang dipakai:             |
| [ Hook: Guru jangan lembur lagi...     ] |
|                                          |
| [ SIMPAN PROGRESS KONTEN ]               |
+------------------------------------------+
| [Today]  [Calendar]  [Social]  [WA]  [=] |
+------------------------------------------+
```

### 6.3 Mobile View: WhatsApp 1-Tap Broadcast Sender (`/wa-station`)

```
+------------------------------------------+
| <- Kembali           WHATSAPP STATION    |
+------------------------------------------+
| Hari: [ SENIN (Monday) v ]               |
|                                          |
| [ TAB: GURU MAHIR AI ]  [ Tab: Aidukasi ]|
+------------------------------------------+
| POOL: GURU MAHIR AI (Public/Warm)        |
| Tujuan: Start Weekly Theme               |
| Peringatan: [!] JANGAN JUALAN KERAS      |
|                                          |
| DRAF PESAN SIAP KIRIM:                   |
| +--------------------------------------+ |
| | Selamat pagi rekan-rekan Guru Mahir  | |
| | AI!                                  | |
| |                                      | |
| | Berapa jam waktu yang dihabiskan     | |
| | minggu lalu hanya untuk menyusun     | |
| | modul ajar dan perangkat kelas?      | |
| |                                      | |
| | Pekan ini kita akan bahas bagaimana  | |
| | AI bisa memangkas 80% beban tsb.     | |
| | Simak panduan awalnya di sini ya:    | |
| | https://pakhusnul.id/edukasi-guru    | |
| +--------------------------------------+ |
|                                          |
| [ SALIN TEKS BROADCAST ]                 |
| [ BUKA APLIKASI WHATSAPP ]               |
+------------------------------------------+
| [Today]  [Calendar]  [Social]  [WA]  [=] |
+------------------------------------------+
```

### 6.4 Mobile View: 90-Day Calendar Strip (`/calendar`)

```
+------------------------------------------+
| 90-DAY CALENDAR              [Filter]    |
| Week 1: 05 Okt - 11 Okt 2026             |
+------------------------------------------+
| [05 Mon] [06 Tue] [07 Wed] [08 Thu] ...  |
|  (DONE)   (DONE)   (DONE)   (PLAN)       |
+------------------------------------------+
| DETAIL: KAMIS, 08 OKTOBER 2026           |
| Status: [ PLANNED v ]  Priority: [ P0 ]  |
|                                          |
| Theme: Reset & Tracking                  |
| Revenue Focus: Post & Cuan Reset         |
|                                          |
| - Social: ModulAjar (Use Case Angle)     |
| - YouTube: Rest/Distribusi (No Video)    |
| - Sumber Belajar: AI Skill - Reset       |
| - WA Public: Practical Tutorial          |
| - WA Closed: Deep Workflow + Offer       |
|                                          |
| Catatan Khusus:                          |
| "WA sequence 4-5 sentuhan: edukasi ->    |
| demo -> proof -> offer."                 |
|                                          |
| [ TANDAI HARI INI SELESAI (DONE) ]       |
+------------------------------------------+
| [Today]  [Calendar]  [Social]  [WA]  [=] |
+------------------------------------------+
```

### 6.5 Mobile View: Bottom Navigation & Drawer Menu

```
+------------------------------------------+
| MENU LENGKAP PENGATURAN & MESIN      [X] |
+------------------------------------------+
| UTAMA:                                   |
| [*] Today's Battlecard                   |
| [ ] Master Calendar 91 Hari              |
| [ ] 13-Week Sprints Board                |
|                                          |
| KANAL KONTEN:                            |
| [ ] Daily Social (TikTok/Threads)        |
| [ ] YouTube Growth Command               |
| [ ] WhatsApp Broadcast Station           |
| [ ] Sumber Belajar Vault (50 Aset)       |
|                                          |
| KEUANGAN & PERFORMA:                     |
| [ ] Revenue Simulator 500K               |
| [ ] KPI Dashboard & Analytics            |
|                                          |
| SISTEM:                                  |
| [ ] Sinkronisasi Database Supabase       |
| [ ] Panduan Operasional (START HERE SOP) |
| [ ] Mode Tampilan: [ GELAP / TERANG ]    |
| [ ] Backup / Unduh Data Excel            |
+------------------------------------------+
```

---

## 7. PERSYARATAN NON-FUNGSIONAL (NFR)

1. **Responsivitas & Breakpoints:**
   - Ponsel Saku: 375px (iPhone SE) hingga 430px (iPhone Pro Max).
   - Tablet: 768px hingga 1024px (iPad portrait/landscape).
   - Desktop: 1280px, 1440px, hingga 1920px (Ultra-wide responsif).
2. **Kinerja & Kecepatan:**
   - *First Contentful Paint (FCP):* < 1,0 detik.
   - Pergantian tanggal atau filter kalender: Instan (< 50 milidetik, *client-side reactive*).
3. **Keandalan & Offline Graceful Degradation:**
   - Menyimpan status terakhir ke `localStorage` sehingga aplikasi tetap dapat dibuka saat jaringan internet putus atau lambat.
   - Sinkronisasi otomatis ke Supabase saat koneksi kembali aktif.
4. **Keamanan Data:**
   - Kredensial Supabase (`anon_key`) dilindungi dengan *Row Level Security (RLS)*.
   - Akses mutasi data penting divalidasi.
5. **Ergonomi Penggunaan:**
   - *Thumb-zone friendly:* Tombol aksi utama pada tampilan ponsel ditempatkan di sepertiga bawah layar agar nyaman ditekan satu tangan.
   - Konfirmasi cepat (*toast notification*) setiap kali teks disalin ke clipboard atau status diubah.

---

## 8. KRITERIA PENERIMAAN (ACCEPTANCE CRITERIA)

- [x] Seluruh 12 sheet dari Excel asli terwakili 100% tanpa ada data atau aturan bisnis yang hilang.
- [x] Tersedia kalender lengkap 91 hari (05 Okt 2026 - 03 Jan 2027) dengan 13 pekan dan 3 fase revenue.
- [x] Formula kalkulasi ekonomi 500K/hari (AOV 169K, fixed cost 741K, affiliate retained 90%) dapat dikalkulasi dinamis.
- [x] Tombol 1-Click Copy pesan WhatsApp berfungsi mulus di Android dan iOS.
- [x] Status Published dan link video TikTok/Threads dapat disimpan dan tersinkronisasi ke Supabase.
- [x] Tampilan desktop dan ponsel nyaman digunakan tanpa adanya teks terpotong (overflow) atau layout berantakan.
- [x] 100% patuh aturan Anti-Slop: nol em-dash dan nol en-dash, viewport min-h-[100dvh], font monospaced angka.

---

## 9. INTEGRASI POST & CUAN (OPERATING ENGINE TERPADU)

Sesuai arahan sheet Dashboard row 21 (*"Post & Cuan tetap source of truth harian. Workbook ini roll-up mingguan + keputusan revenue"*), aplikasi Post & Cuan (Lovable) telah dimerger 100%:
1. **9 Tabel Supabase:** `platforms`, `user_settings`, `user_xp`, `user_badges`, `revenue_sources`, `daily_logs`, `content_calendar`, `focus_sessions`, `goals`.
2. **Leveling & XP Engine:** Level 35 (3445 XP) dengan progress bar di TopHeader, penambahan XP dinamis (+10 XP per post, +5 XP per transaksi, +25 XP hari tuntas, +1 XP per 5 menit fokus).
3. **Koleksi 23 Badge:** Modal interaktif menampilkan 14 badge yang telah terbuka beserta tanggal unlock dan syarat badge terkunci.
4. **Counter Postingan Harian:** Tombol + dan - per platform (TikTok, Threads, Instagram, WA, YouTube) yang langsung mengupdate `daily_logs` dan menyinkronkan status tayang konten TikTok.
5. **Pencatatan Transaksi Langsung (+ Cuan):** Input nominal kotor, jalur penjualan (Direct / Affiliate), komisi affiliate, channel akuisisi, tipe pembeli (Baru / Repeat), dan hitungan net bersih instan.
6. **Focus Timer (Pomodoro):** Timer sirkular 15m, 25m, 45m, 60m dengan tema Deep Focus / Nature / Minimal, audio beep, dan pencatatan sesi ke database.
7. **Revenue Control Center (15M):** Progress meter target bulanan Rp 15.000.000, rasio direct vs affiliate net, breakdown pembeli baru vs repeat order, dan tabel 98 riwayat log harian.

