# Snapbooth — Modern Web Photobooth Application

Snapbooth adalah aplikasi web photobooth digital modern yang memungkinkan pengguna mengambil foto candid langsung melalui webcam, menyesuaikan filter estetik (vintage film, B&W, pastel glow), menyusun tata letak foto strip (photo strips 3-frame, 4-frame, 2x2 collage), menambahkan bingkai & stiker, serta mengunduh hasil cetak resolusi tinggi secara instan.

Semua pemrosesan foto dan efek kamera berjalan 100% di browser (client-side) demi privasi maksimal pengguna tanpa mewajibkan pendaftaran akun. Tersedia pula integrasi opsional dengan Supabase (PostgreSQL & Storage) untuk sinkronisasi galeri cloud.

---

## 📸 Fitur Utama

1. **Photobooth Studio Interaktif**
   - Live viewfinder webcam dengan kontrol rasio aspek nyata.
   - Pilihan countdown timer: 3, 5, dan 10 detik dengan umpan balik audio synthesized (Web Audio API).
   - Efek flash visual yang lembut dan autentik.
   - Mode pengambilan: Single Photo, 3-Shot Strip, 4-Shot Strip, dan Burst Session.
   - Tombol retake (ambil ulang) per slot foto jika ada foto yang kurang pas.
   - Mode kamera simulasi/sampel (Sample Mode) untuk pengujian cepat tanpa hardware kamera fisik.
   - Pilihan mirror preview (pembalik horizontal) dan pemilihan multi-kamera (kamera depan / belakang / USB eksternal).

2. **Mesin Komposisi Canvas Resolusi Tinggi**
   - Format tata letak:
     - **Vertical 3-Strip**: Format photobooth strip vertikal 3 foto klasik.
     - **Vertical 4-Strip**: Format bookmark photobooth arkade 4 foto.
     - **2x2 Square Collage**: Kolase persegi seimbang untuk media sosial.
     - **Single Polaroid**: Foto polaroid tunggal dengan bagian bawah luas untuk teks.
     - **Duo Side-by-Side**: Format diptych perbandingan dua foto.
   - Gaya bingkai bawaan: Classic Cardstock, Editorial Noir, Millennial Blush, 35mm Film Negative (dengan lubang sprocket), Vintage Cream, Minimal Platinum, dan Confetti Party.
   - Palet warna kustom & color picker untuk latar belakang bingkai.
   - Slider ketebalan border, jarak antar foto (photo gap), dan kelengkungan sudut (border radius).

3. **Filter Foto & Penyesuaian Detail**
   - Preset filter: Original, B&W Classic, Warm Film, Cool Nordic, Vintage Sepia, Soft Glow, High Noir, dan Rose Blush.
   - Slider penyesuaian: Kecerahan (Brightness), Kontras (Contrast), Kejenuhan (Saturation), Vignette falloff, dan tekstur Film Grain analog.

4. **Kustomisasi Teks & Stiker**
   - Input judul utama, sub-judul studio, dan pilihan tanggal otomatis/kustom.
   - Pilihan tipografi: Modern Sans (`Plus Jakarta Sans`), Editorial Serif (`Playfair Display`), atau Vintage Mono (`Space Mono`).
   - Stiker stempel sudut: Hati, Bintang, Masking Tape, Peace sign, Ciuman, atau Kamera.

5. **Ekspor & Berbagi**
   - Download resolusi tinggi dalam format PNG atau JPEG (skala retina 2x).
   - Salin ke clipboard browser (`navigator.clipboard.write`).
   - Cetak langsung (native print dialog) yang disesuaikan ukuran strip.
   - Efek konfeti selebrasi saat mengunduh.

6. **Galeri & Penyimpanan (Lokal & Cloud)**
   - Galeri offline-first yang tersimpan di penyimpanan browser lokal.
   - Modal Lightbox layar penuh untuk melihat detail strip beresolusi tinggi.
   - Integrasi opsional dengan Supabase Storage & Database PostgreSQL.

---

## 🛠️ Prasyarat & Persyaratan Sistem

- **Node.js**: Versi 18.x atau lebih baru (direkomendasikan Node.js 20+).
- **NPM** atau **PNPM / Yarn**.
- **Browser Modern**: Chrome, Firefox, Safari, atau Edge versi terbaru yang mendukung `navigator.mediaDevices.getUserMedia` dan HTML5 Canvas API.
- **Kamera Webcam**: Webcam terpasang atau eksternal (atau gunakan fitur "Use Sample Mode" di dalam aplikasi jika berjalan di lingkungan tanpa perangkat kamera).
- **Protokol HTTPS**: Sesuai kebijakan keamanan browser modern, akses kamera (`getUserMedia`) **hanya diizinkan** pada konteks aman (**HTTPS**) atau pada domain `http://localhost` / `http://127.0.0.1`.

---

## 🚀 Instalasi & Menjalankan Lokal

1. **Clone repository atau buka direktori proyek**:
   ```bash
   git clone <repo-url>
   cd snapbooth
   ```

2. **Instal seluruh dependensi**:
   ```bash
   npm install
   ```

3. **Salin berkas konfigurasi lingkungan (opsional)**:
   ```bash
   cp .env.example .env.local
   ```

4. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`. Buka alamat tersebut di browser Anda.

5. **Build untuk produksi**:
   ```bash
   npm run build
   ```

---

## 🔒 Izin Kamera & Masalah Umum Browser

### Mengapa kamera meminta izin?
Browser membutuhkan konfirmasi pengguna sebelum menyalakan video stream. Saat jendela Studio dibuka pertama kali, klik **Enable Camera** dan pilih **Allow / Izinkan** pada pop-up browser.

### Masalah: "Camera access was denied"
- Klik ikon kamera atau gembok di sebelah kiri address bar browser Anda.
- Ubah pengaturan **Camera** menjadi **Allow**.
- Refresh halaman dan klik **Retry Camera**.

### Masalah: "No camera device detected"
- Pastikan kabel webcam terhubung dengan benar dan tidak sedang digunakan oleh aplikasi lain (seperti Zoom, Google Meet, atau OBS).
- Anda dapat memilih tombol **Use Sample Mode** di dalam aplikasi untuk mencoba seluruh alur photobooth, filter, tata letak, dan pengunduhan tanpa kamera fisik.

---

## ☁️ Konfigurasi Supabase (Opsional)

Jika Anda ingin mengaktifkan sinkronisasi galeri ke cloud, ikuti langkah berikut:

### 1. Buat Proyek di Supabase
Buka [supabase.com](https://supabase.com), buat proyek baru, lalu catat **Project URL** dan **Anon Public API Key** dari menu *Project Settings -> API*.

### 2. Jalankan Migrasi Database SQL
Buka menu **SQL Editor** pada dashboard Supabase Anda dan jalankan skrip berikut:

```sql
-- 1. Tabel Sesi Foto
CREATE TABLE IF NOT EXISTS public.photo_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  title TEXT NOT NULL,
  layout_type TEXT NOT NULL,
  frame_type TEXT NOT NULL,
  storage_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Foto Individual
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES public.photo_sessions(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_format TEXT DEFAULT 'image/png',
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.photo_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- 4. Kebijakan Akses (RLS Policies)
CREATE POLICY "Allow public read access for photo_sessions" 
  ON public.photo_sessions FOR SELECT USING (true);

CREATE POLICY "Allow public insert for photo_sessions" 
  ON public.photo_sessions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read for photos" 
  ON public.photos FOR SELECT USING (true);

CREATE POLICY "Allow public insert for photos" 
  ON public.photos FOR INSERT WITH CHECK (true);
```

### 3. Buat Bucket Storage di Supabase
1. Buka menu **Storage** di Supabase Dashboard.
2. Buat bucket baru dengan nama `photobooth-photos`.
3. Aktifkan opsi **Public bucket** agar preview gambar dapat diakses oleh browser klien.

### 4. Menghubungkan ke Aplikasi
Anda dapat memasukkan kredensial melalui:
- **Menu Pengaturan di Aplikasi**: Klik tombol **Cloud Storage** di navbar atau galeri, masukkan URL dan Anon Key, lalu simpan.
- **Environment Variables**: Masukkan di `.env.local`:
  ```env
  VITE_SUPABASE_URL="https://xxxxxxxx.supabase.co"
  VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."
  ```

---

## 🚢 Deployment ke Vercel

1. Dorong kode Anda ke GitHub / GitLab.
2. Buka [vercel.com](https://vercel.com) dan impor repository Anda.
3. Vercel akan otomatis mendeteksi konfigurasi Vite:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Di bagian **Environment Variables**, tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` (jika menggunakan Supabase).
5. Klik **Deploy**. Vercel akan otomatis menyediakan sertifikat SSL HTTPS sehingga webcam dapat berfungsi normal pada domain live.

---

## 📂 Struktur Berkas Proyek

```
/
├── .env.example                         # Contoh variabel lingkungan
├── index.html                           # Entry HTML & pemuatan font Outfit/Plus Jakarta Sans
├── metadata.json                        # Metadata AI Studio & izin frame kamera
├── package.json                         # Dependensi (React 19, Vite, Tailwind CSS, Canvas Confetti)
├── README.md                            # Dokumentasi lengkap berbahasa Indonesia
├── src/
│   ├── assets/images/                   # Aset gambar demo otentik photobooth
│   ├── components/
│   │   ├── Footer.tsx                   # Footer navigasi & privasi
│   │   ├── HowItWorks.tsx               # Penjelasan 3 langkah & keunggulan privasi
│   │   ├── LandingHero.tsx              # Hero editorial dengan strip preview riil
│   │   ├── Navbar.tsx                   # Top bar navigation 3-zona
│   │   ├── SupabaseModal.tsx            # Pengaturan cloud storage & panduan SQL
│   │   ├── Gallery/
│   │   │   └── GalleryView.tsx          # Arsip sesi tersimpan, lightbox & unduhan
│   │   ├── Showcase/
│   │   │   └── ShowcaseView.tsx         # Katalog gaya bingkai & tata letak
│   │   └── Studio/
│   │       ├── CameraBooth.tsx          # Viewfinder kamera, timer, reticle & shutter
│   │       ├── CapturedFilmstrip.tsx    # Filmstrip thumbnail, retake & hapus slot
│   │       ├── CompositionPreview.tsx   # Pratinjau canvas strip & ekspor PNG/JPEG
│   │       ├── PhotoboothStudio.tsx     # Komponen induk studio photobooth
│   │       └── StudioControls.tsx       # Kustomisasi tata letak, warna, filter & stiker
│   ├── hooks/
│   │   ├── useCamera.ts                 # Hook webcam, device enumeration & mirror
│   │   └── useCaptureSession.ts         # Hook sequence capture, countdown & flash
│   ├── types/
│   │   └── photobooth.ts                # TypeScript types & interface
│   ├── utils/
│   │   ├── audio.ts                     # Web Audio API synthesizer suara shutter & beeps
│   │   ├── canvasComposer.ts            # Komposisi canvas resolusi tinggi & sprockets
│   │   ├── imageFilters.ts              # Pengolahan pixel filter, vignette & film grain
│   │   ├── presets.ts                   # Definisi preset bingkai, warna & sampel foto
│   │   ├── storage.ts                   # Penyimpanan galeri lokal
│   │   └── supabase.ts                  # Integrasi klien Supabase & skema SQL
│   ├── App.tsx                          # Root router & manajemen state
│   ├── index.css                        # Styling Tailwind v4 & keyframes animasi
│   └── main.tsx                         # Entry React DOM
```

---

Selamat berkreasi dengan **Snapbooth**! 📸✨
