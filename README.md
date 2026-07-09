# 🌲 Link in Bio - ghiffa.dev

Aplikasi **Link in Bio** personal yang minimalis, performan, dan memiliki estetika editorial/neo-brutalisme. Aplikasi ini menyajikan tautan direktori sosial media, proyek terbaru, artikel terbaru, serta informasi pribadi secara dinamis yang bersumber langsung dari database **Supabase**.

---

## 🚀 Tech Stack

Aplikasi ini dibangun menggunakan teknologi modern berikut:

- **Frontend Framework:** [React 19](https://react.dev/) + [Vite 7](https://vite.dev/) (cepat, ringan, dengan Hot Module Replacement/HMR).
- **Styling & Desain:** [Tailwind CSS v4.0](https://tailwindcss.com/) dengan pendekatan CSS modern (`@import "tailwindcss"`), dipadukan dengan *noise overlay* SVG untuk efek koran/editorial.
- **State Management & Data Fetching:** [SWR](https://swr.vercel.app/) untuk sinkronisasi data yang cepat, reaktif, dan hemat kuota request ke database.
- **Database & Backend-as-a-Service:** [Supabase](https://supabase.com/) sebagai penyimpanan data utama (PostgreSQL) yang aman.
- **Animasi:** [GSAP (GreenSock Animation Platform) 3](https://gsap.com/) untuk transisi masuk (*entrance animations*) elemen UI secara halus dan presisi.

---

## 📂 Struktur Direktori

Berikut adalah pemetaan berkas dan folder penting di dalam proyek ini:

```text
linkinbio/
├── public/                 # Aset statis publik
│   ├── favicon.png         # Icon tab browser (Format PNG)
│   ├── favicon.svg         # Icon tab browser (Format SVG)
│   └── vite.svg            # Default Vite icon
├── src/
│   ├── assets/             # Aset gambar/ikon internal proyek
│   │   └── react.svg
│   ├── lib/
│   │   └── supabaseClient.js # Inisialisasi & konfigurasi Supabase SDK
│   ├── utils/
│   │   └── slugify.js      # Helper untuk mengubah teks menjadi slug URL bersih
│   ├── App.css             # CSS bawaan template (tidak diimpor di App.jsx)
│   ├── App.jsx             # Komponen utama: UI, Data fetching, dan GSAP logic
│   ├── index.css           # Konfigurasi Tailwind CSS v4.0
│   └── main.jsx            # Entry point React & konfigurasi SWR Cache
├── .gitignore              # Daftar file/folder yang diabaikan oleh Git
├── eslint.config.js        # Konfigurasi linting kode JavaScript/React
├── index.html              # HTML utama tempat aplikasi di-mount
├── package.json            # Daftar dependensi & script build
├── supabase.sql            # Script SQL untuk inisialisasi tabel & kebijakan RLS
└── vite.config.js          # Konfigurasi bundler Vite dan plugin Tailwind
```

---

## ⚙️ Konfigurasi Database (Supabase Schema)

Data yang ditampilkan diambil secara dinamis dari **5 tabel utama** di database Supabase Anda. Anda dapat menginisialisasi skema ini dengan menjalankan query di SQL Editor Supabase:

### 1. Tabel `bio_links`
Menyimpan daftar tautan media sosial atau direktori eksternal.
```sql
CREATE TABLE IF NOT EXISTS public.bio_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    url TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 2. Tabel `personal_info`
Menyimpan nama lengkap, profesi, bio/headline singkat, dan kontak.
```sql
CREATE TABLE IF NOT EXISTS public.personal_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL DEFAULT 'Haikal Jibran Al Ghiffarry',
    role TEXT NOT NULL DEFAULT 'Systems Architect & Full-stack Developer',
    headline TEXT NOT NULL DEFAULT 'Crafting digital experiences with precision and passion.',
    email TEXT NOT NULL DEFAULT 'hello@ghiffa.dev',
    phone_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 3. Tabel `general_settings`
Menyimpan konfigurasi global aplikasi (seperti nama aplikasi).
```sql
CREATE TABLE IF NOT EXISTS public.general_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_name TEXT NOT NULL DEFAULT 'ghiffa.dev',
    seo_title TEXT NOT NULL DEFAULT 'Portfolio & Resume',
    seo_description TEXT NOT NULL DEFAULT 'Creative Software Engineer...',
    maintenance_mode BOOLEAN DEFAULT false
);
```

### 4. Tabel `projects` & `articles`
Aplikasi secara otomatis mendeteksi dan menampilkan proyek terbaru (`projects`) dan artikel yang dipublikasikan paling baru (`articles` dengan status `'published'`).

### Kebijakan Keamanan (Row Level Security - RLS)
Semua tabel di atas memiliki RLS aktif dengan kebijakan:
- **Public:** Hanya memiliki akses baca (`SELECT`) untuk data yang aktif atau dipublikasikan.
- **Admin/Authenticated:** Memiliki kontrol penuh (`INSERT`, `UPDATE`, `DELETE`) menggunakan akun admin Supabase Anda.

---

## ⚡ Optimalisasi Kinerja & Caching (SWR)

Untuk menghindari kuota pemanggilan API Supabase gratisan cepat habis, SWR dikonfigurasi di `main.jsx` untuk mempertahankan cache selama **5 menit**:

```javascript
<SWRConfig 
  value={{
    revalidateOnFocus: false,      // Tidak menembak API ulang saat tab browser di-focus
    revalidateIfStale: false,      // Tidak revalidasi jika data cache masih ada
    dedupingInterval: 300000,      // Menahan cache di memori selama 5 menit (300.000 ms)
  }}
>
  <App />
</SWRConfig>
```

---

## 🛠️ Instalasi & Menjalankan Project

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini secara lokal:

### 1. Prasyarat
Pastikan Anda sudah menginstal **Node.js** (rekomendasi LTS).

### 2. Kloning & Masuk ke Folder Proyek
```bash
cd /home/ghiffa/Documents/personal-web/linkinbio
```

### 3. Konfigurasi Environment Variables
Buat berkas `.env.local` di root folder `linkinbio/` dan tambahkan detail kredensial Supabase Anda:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anonymous-key
```

### 4. Install Dependensi
```bash
npm install
```

### 5. Jalankan Server Dev Lokal
```bash
npm run dev
```
Buka `http://localhost:5173` pada browser Anda.

### 6. Build untuk Produksi
```bash
npm run build
```
Hasil build siap dideploy akan berada di direktori `dist/`.

---

## ✨ Fitur Desain Utama

1. **Editorial Newspaper Grid:** Estetika minimalis hitam-putih (#FAFAFA & #111111) dengan garis tipis grid (1px hairline) menyerupai koran premium.
2. **Noise Overlay Background:** Filter grain SVG transparan (opacity 3%) yang terpasang tetap (*fixed*) di background untuk memberi tekstur organik.
3. **Responsive Container:** Layout otomatis di-center dengan lebar maksimal `480px` di desktop (menyerupai tampilan smartphone mockup) dan tanpa border penuh jika dibuka langsung di handphone.
4. **Entrance Animations:** Efek slide up dan fade down dari GSAP yang terkoordinasi secara runut (staggered) saat halaman selesai memuat data.
5. **Skeleton Loader:** Animasi denyut (*pulse animation*) berwarna abu-abu tipis yang menyerupai bentuk asli layout konten selama proses loading berjalan.
