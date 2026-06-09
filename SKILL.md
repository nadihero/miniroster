# UI/UX Design Skill: Premium Minimalist Roster Style

Dokumen ini berisi panduan, prinsip desain, dan standar implementasi frontend untuk membangun antarmuka **App Roster Viewer**. Fokus utama adalah mereplikasi estetika premium, bersih, dan minimalis (Apple/Google Tech-inspired), namun dioptimalkan untuk kebutuhan visualisasi jadwal kerja (roster) dan timesheet.

---

## 1. Prinsip Desain Utama

### A. Ekstrim Minimalis & Ruang Napas (Whitespace)
*   **Layout:** Berpusat pada simetri yang kuat. Konten utama diletakkan tepat di tengah layar dengan *padding* atas dan bawah yang sangat longgar untuk memberikan kesan premium dan tidak padat.
*   **Tipografi:** Menggunakan font sans-serif modern (seperti Inter, SF Pro, atau Geist Sans) dengan ketebalan medium/semi-bold (bukan bold yang terlalu tebal). Pengaturan jarak antar huruf (*letter-spacing/tracking*) diatur sedikit rapat (`tracking-tight` atau `-0.02em`) untuk estetika editorial.

### B. Tekstur Latar Belakang Komposit (Micro-particle Canvas)
*   Latar belakang tidak menggunakan warna solid putih bersih, melainkan warna *off-white/light-grey* sangat lembut yang dilapisi oleh tekstur butiran halus (*fine grain/specks*).
*   Di area tengah-kiri belakang teks utama, terdapat aksen dekoratif berupa sebaran organik partikel atau bintik-bintik kecil berwarna kontras (biru, ungu, merah) untuk memecah kebosanan visual tanpa mengganggu keterbacaan teks.

### C. Kontras Komponen Kontrol (Pill-Shaped Elements)
*   Navigasi dan tombol menggunakan bentuk elips sempurna (*fully rounded/pill-shaped*).
*   Elemen primer menggunakan warna hitam pekat (`#000000` atau `slate-950`) untuk menarik perhatian instan, sedangkan elemen sekunder menggunakan warna abu-abu transparan yang sangat lembut dengan border tipis.

---

## 2. Token Desain & Implementasi Tailwind CSS

Gunakan token berikut untuk menjaga konsistensi komponen pada aplikasi Roster Viewer:

### A. Struktur Latar Belakang & Partikel
Untuk mengimplementasikan efek kanvas bertekstur secara ringan menggunakan Tailwind dan CSS/SVG:
```html
<!-- Wrapper Utama dengan warna dasar off-white -->
<div class="relative min-h-screen bg-[#f8f9fa] overflow-hidden">
  <!-- Efek Grain/Partikel Dekoratif (Absolute Layer) -->
  <div class="absolute inset-0 opacity-[0.08] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
  
  <!-- Kluster Partikel Warna-warni di Sisi Kiri (Abstract Design Element) -->
  <div class="absolute left-[-10%] top-[20%] w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-red-500/5 blur-3xl rounded-full pointer-events-none"></div>
  
  <!-- Konten Aplikasi -->
</div>