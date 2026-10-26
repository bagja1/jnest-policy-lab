# Panduan GitHub + Vercel + OpenAI API untuk J-NEST Policy Lab V5

Dokumen ini digunakan untuk menempatkan kode J-NEST di GitHub dan menjalankan website serta endpoint AI di Vercel. Kode siap dipublikasikan, tetapi belum otomatis terhubung ke akun GitHub, Vercel, atau OpenAI milik Anda.

## 1. Siapkan dan lindungi API key

- Buka https://platform.openai.com/api-keys dan pastikan proyek API Anda memiliki akses model dan anggaran yang sesuai.
- **Jangan kirim API key melalui chat. Jangan tulis API key ke file HTML, app.js, chat.js, .env.example atau repository GitHub.**
- API key sesungguhnya dimasukkan hanya lewat dashboard Vercel, pada tahap 4.
- Penggunaan OpenAI API ditagih terpisah dari langganan ChatGPT.

## 2. Unggah source code ke GitHub

1. Unduh ZIP `J-NEST_V5_OpenAI_GitHub_Vercel.zip`, lalu **ekstrak** ZIP di komputer. Jangan mengunggah ZIP sebagai satu file GitHub karena GitHub tidak otomatis mengekstraknya.
2. Login ke https://github.com/new .
3. Buat repository misalnya `jnest-policy-lab` dan pilih **Private** untuk tahap uji coba. Biarkan repository tanpa template README jika Anda hendak menggunakan perintah Git di bawah.
4. Cara termudah tanpa terminal: gunakan GitHub Desktop, pilih **File > Add local repository**. Bila folder belum repository, pilih opsi untuk membuat repository di folder itu. Setelah commit pertama, klik **Publish repository** dan pastikan **Keep this code private**.
5. Alternatif melalui Terminal (sesuaikan lokasi folder dan nama akun):

```bash
cd /lokasi/folder/JNEST_V5_OpenAI_GitHub
git init
git add .
git commit -m "J-NEST V5 dengan backend OpenAI aman"
git branch -M main
git remote add origin https://github.com/USERNAME/jnest-policy-lab.git
git push -u origin main
```

Sebelum `git add .`, periksa bahwa `.env.local`, `.env`, berkas kunci, serta dokumen rahasia tidak ada dalam staging. Repository pada tahap pengujian sebaiknya Private.

## 3. Hubungkan GitHub ke Vercel

1. Login https://vercel.com/new .
2. Pilih **Import Git Repository** dan beri akses ke repository `jnest-policy-lab`.
3. Pilih **Framework Preset: Other** untuk HTML/CSS/JavaScript statis.
4. Pilih **Root Directory: `./`** (direktori yang berisi `index.html`, `api/`, dan `vercel.json`).
5. Untuk proyek ini tidak perlu `npm install`, bundler atau build command khusus. Biarkan output directory pada setelan default untuk proyek tanpa build, jika konfigurasi proyek Anda mengizinkan.

Vercel menyediakan website dan mengenali file `api/chat.js` serta `api/status.js` sebagai serverless functions. GitHub Pages hanya menjalankan aset statis; **jangan gunakan GitHub Pages sebagai satu-satunya host jika membutuhkan backend AI rahasia**.

## 4. Tambahkan environment variables di Vercel

Di dalam proyek Vercel, buka **Settings > Environment Variables**, lalu tambahkan:

| Name | Value | Lingkungan |
|---|---|---|
| `OPENAI_API_KEY` | API key asli Anda (jangan disimpan di kode) | Production, dan Preview bila Anda ingin menguji di URL preview |
| `OPENAI_MODEL` | `gpt-5.4-mini` (atau model yang tersedia untuk proyek API Anda) | Production/Preview |

Simpan. Jika website sudah terlanjur ter-deploy sebelum env ditambahkan, pilih **Redeploy** agar fungsi menerima variabel baru. Jangan memakai awalan `NEXT_PUBLIC_` atau `VITE_` untuk API key rahasia.

## 5. Uji website dan AI

1. Buka alamat yang disediakan Vercel, misalnya `https://jnest-policy-lab-xxxx.vercel.app/`.
2. Buka `/api/status` pada domain itu. Hasil `{"backend":true,"configured":true}` berarti backend mengenali variabel kunci. **Belum berarti kuncinya valid atau billing aktif.**
3. Di menu **Bantuan penelitian / Tanya J-NEST**, kirim: `Bagaimana menghitung IDI, SEC, dan ESP?`.
4. Jika sukses, muncul jawaban dan label **AI aktif**. Pertanyaan tentang profil `Kabupaten Subang 2024` juga akan mengambil skor dari ringkasan panel 135 baris.
5. Bila label kembali **Lokal**, periksa Vercel > Logs, environment variable, izin model, kredit/limit API dan nama `OPENAI_MODEL`. Saat API gagal, jawaban tetap tersedia dalam mode panduan lokal.
6. Uji juga **Hitung J-NEST**, **Laboratorium A/B/C**, **Alur DPMPTSP-Bappeda**, dan **Unduh PDF**. Fitur-fitur tersebut tidak membutuhkan OpenAI API untuk bekerja.

## 6. Pengembangan dan deploy berikutnya

Setiap perubahan yang di-commit dan di-push ke branch produksi GitHub akan memicu deployment Vercel baru. Untuk menjaga kualitas, lakukan perubahan pada branch terpisah dan tinjau deployment Preview sebelum digabungkan ke `main`.

## 7. Mengembangkan AI untuk kebutuhan Pemprov

Paket ini mengaktifkan **AI hanya untuk bantuan penelitian dan tanya jawab berbasis paper/panel**. Perhitungan indeks, evaluasi G0-G4, status legalitas, dan ekspor PDF tetap berasal dari logika dan bukti yang tercatat, bukan putusan AI.

Sebelum digunakan untuk data proyek yang tidak publik: tambahkan login/role-based access, audit trail tahan ubah, proteksi deployment, kontrol biaya, rate limiter berbagi state (bukan hanya memori function), dan aturan penanganan data. Jangan menempelkan informasi proyek yang rahasia atau data pribadi ke chat publik.

Status hasil J-NEST tidak boleh diperlakukan sebagai izin OSS, keputusan AMDAL, atau besaran kompensasi ekologis.

## Rujukan resmi

- OpenAI API key security: https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety
- OpenAI Responses API: https://developers.openai.com/api/reference/resources/responses/methods/create
- GitHub upload project: https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github
- Vercel Git deployment: https://vercel.com/docs/deployments
- Vercel environment variables: https://vercel.com/docs/environment-variables
- Vercel serverless functions: https://vercel.com/docs/project-configuration/vercel-json
