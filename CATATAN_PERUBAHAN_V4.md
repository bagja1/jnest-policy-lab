# Catatan pengembangan dan pengujian V4 — J-NEST Policy Simulator

## Perubahan dibanding V3

- **Navigasi utama berorientasi proses**, bukan katalog hasil riset: enam tahap kalkulasi → proyek → alternatif → G0–G4 → rekomendasi → PDF.
- **Kalkulator indeks terbuka pada layar pertama**, menghitung tiap indikator, transformasi, normalisasi, CRITIC, kontribusi, dimensi, total dan peringkat wilayah–tahun.
- **Perubahan bobot dan agregasi** diberi label *eksploratif*; spesifikasi utama paper tetap sama pada penapisan proyek dan PDF.
- **Studi kasus Patimban dihapus dari menu utama**; dua contoh dokumen hanya tersedia melalui pilihan proyek contoh opsional di dalam laboratorium.
- **Hasil utama adalah laporan PDF A4**, dengan narasi, tabel, penelusuran G0–G4, rekomendasi dan pemisahan bukti/ketidakpastian. Tidak memerlukan CDN maupun penyimpanan/server; berkas PDF dibuat secara lokal dalam browser.
- **Orientasi SKK** hadir langsung pada layar rekomendasi sekaligus bab khusus laporan PDF, dengan pembedaan eksplisit antara pembacaan budaya dan rekomendasi tata kelola kontemporer.
- **Status G1 per alternatif** dipertahankan; dugaan konflik pada lokasi yang dipilih menghasilkan tahan dan rujuk, tanpa menetapkan keputusan resmi.

## Ringkasan pengujian lokal

| Uji | Hasil |
| --- | --- |
| Muat satu-file HTML di Chromium (dengan konten disuntikkan langsung untuk menghindari pembatasan navigasi lingkungan tes) | Berhasil; tidak ada error JavaScript |
| Hitung Subang 2024 | **46,216**, sesuai skor panel yang direproduksi |
| Ubah ke Sumedang 2023 | **50,328**, peringkat **14/27** |
| Sensitivitas geometrik dan bobot berubah | Skor/rank skenario berubah; baseline tetap terpisah |
| Transfer wilayah/tahun ke simulator | Berhasil |
| Alternatif kedua pindah ke Karawang dan diberi dugaan konflik batas | Status **Tahan & Rujuk Pemeriksaan G1** |
| Kartu orientasi SKK pada halaman rekomendasi | 3 orientasi tersedia |
| PDF diunduh langsung dalam browser, dibuka kembali dan teks diekstrak | Berhasil; contoh sekitar **9 halaman A4** |
| Layar mobile lebar 390px | Tidak ada overflow horizontal, navigasi ke langkah G0–G4 berfungsi |

Pengujian adalah **QA perangkat lunak prototipe**, bukan validasi substantif atas kelayakan proyek, ketepatan status hukum, pengolahan citra primer, atau manfaat keputusan Pemprov.

## Batasan esensial

1. Panel tetap periode **2020–2024**; gunakan pembaruan dan kalibrasi transparan ketika data baru ditambahkan.
2. Unit data **kabupaten/kota**, bukan tapak. Perbedaan dua kabupaten/kota tidak memprediksi dampak relokasi.
3. GEE/BPS, batas wilayah, biaya dan kebutuhan proyek, validitas izin, serta pemantauan dampak memerlukan audit primer.
4. Tidak ada model optimasi, perizinan otomatis, atribusi kausal, nilai ekologis total, atau besaran kompensasi.
5. Simulasi disimpan di `localStorage`, tidak mendukung penelaah lintas instansi, autentikasi, tanda tangan elektronik, ataupun jejak audit terpusat. Sistem produksi memerlukan tata kelola dan pengamanan terpisah.
6. Validasi melalui pilot enam bulan perlu membandingkan proses biasa vs penelaahan J-NEST/pertanyaan SKK dan memeriksa perubahan rancangan substantif yang terverifikasi serta beban kerja.
