# J-NEST Policy Lab V5 | OpenAI + GitHub + Vercel

Prototipe laboratorium simulasi kebijakan berbasis penelitian J-NEST-SKK, 27 kabupaten/kota Jawa Barat, panel 2020-2024, 135 observasi.

## Mulai di sini

Baca **`PANDUAN_GITHUB_VERCEL_OPENAI.md`** untuk langkah dari ZIP, GitHub, Vercel, penyimpanan API key, hingga pengujian AI.

## Struktur

- `index.html` - halaman utama. `app.js` dan file JS/CSS lain menjalankan aplikasi.
- `api/chat.js` - endpoint serverless untuk pertanyaan J-NEST menggunakan OpenAI Responses API; `OPENAI_API_KEY` hanya dibaca dari environment server.
- `api/status.js` - pemeriksaan apakah backend dan environment variable terpasang (bukan validasi model/key).
- `api/panel-summary.json` - 135 skor panel olahan yang dipilih sesuai wilayah dan tahun untuk konteks chat.
- `datasets/` - sumber hasil olahan dan file reproduksi; audit data primer tetap dibutuhkan.
- `vercel.json` - konfigurasi deploy termasuk durasi endpoint.
- `.gitignore` - mengecualikan environment variables lokal dan berkas rahasia.

**Jangan commit file `.env.local` atau API key.**

## Mode kerja

- Semua kalkulasi J-NEST, simulasi alternatif, alur G0-G4, tata kelola peran, dan pembuatan PDF tetap berfungsi tanpa AI.
- Setelah Vercel menerima `OPENAI_API_KEY`, halaman **Bantuan penelitian** akan menggunakan OpenAI API dari fungsi serverless; data pertanyaan dikirim ke endpoint tersebut.
- File HTML mandiri yang dibuka melalui `file://` tidak menjalankan endpoint server. Gunakan URL Vercel untuk AI generatif.
- AI merujuk ringkasan paper dan skor panel terpilih. AI **tidak** otomatis menerima seluruh dossier skenario pribadi atau menerbitkan rekomendasi izin.

## Peringatan

Aplikasi ini bukan aplikasi resmi Pemerintah Provinsi Jawa Barat, bukan sumber status izin OSS, bukan penetap kompensasi ekologis. Seluruh temuan dan pembagian peran merupakan alat simulasi yang membutuhkan validasi dan SOP dari instansi berwenang.
