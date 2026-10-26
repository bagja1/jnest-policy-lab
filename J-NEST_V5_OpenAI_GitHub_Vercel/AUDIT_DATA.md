# Audit dan reproduksi panel J-NEST 2020–2024

**Status: reproduksi yang berhasil pada panel olahan terunggah; bukan audit independen sumber primer.**

Tanggal pemeriksaan: 25 Oktober 2026. Berkas yang diterima pengguna: `jnes_master_panel_2020_2024.csv`, `jnes_gee_features_admin2_year_2020_2024.csv`, dan `jnest_bps_manufacturing_admin2_year_2020_2024.csv`. Berkas asli disimpan tanpa perubahan dalam folder `datasets/`. SHA-256 masing-masing tercantum dalam `datasets/jnest_validation_summary.json`.

## 1. Integritas panel terunggah

- Ketiga berkas: masing-masing **135 baris**, 27 kode administrasi kabupaten/kota, lima tahun 2020–2024 dengan 27 baris setiap tahun.
- Kunci `bps_domain` × `year`: 0 duplikasi, tidak ditemukan pasangan kunci yang hilang antara tiga berkas.
- Seluruh kolom numerik yang sama pada panel utama dan masing-masing CSV sumber **identik** sampai toleransi numerik yang sangat ketat.
- **Delapan indikator inti tidak memiliki data hilang.** Kolom pertumbuhan PDRB industri tahun 2020 kosong pada 27 baris; kolom itu **tidak** dipakai dalam indeks.
- Satuan PDRB yang dipilih untuk indeks adalah `manufacturing_grdp_adhk2010_billion_rupiah`, bukan ADHB. Penerapan log natural terhadap nilai dalam juta/miliar memberikan normalisasi min–maks sama, sebab keduanya hanya berbeda faktor konstan.

## 2. Cara menghitung sesuai paper

1. Gunakan logaritma natural PDRB industri ADHK 2010 dan jumlah penduduk. Variabel lainnya tidak di-log.
2. Normalisasi min–maks delapan indikator menggunakan nilai minimum dan maksimum pada **seluruh gabungan 135 observasi**. Arah positif: PDRB industri, NDBI, cahaya malam, jumlah penduduk, NDVI. Arah negatif: kemiskinan, TPT, LST.
3. Hitung CRITIC terpisah untuk indikator dalam IDI, SEC, ESP. Simpangan baku menggunakan pembagi **N=135** (bukan N−1); korelasi Pearson pada indikator yang dinormalisasi. Jika hanya satu indikator tersisa dalam sebuah dimensi, bobotnya adalah **1**, bukan 0/0.
4. IDI/SEC/ESP = 100 × jumlah indikator ternormalisasi × bobot CRITIC masing-masing.
5. Indeks utama = (IDI + SEC + ESP)/3. Agregasi geometrik dipakai untuk sensitivitas dengan epsilon 10⁻⁶ pada nilai dimensi sebelum logaritma.
6. Peringkat ditetapkan **di dalam tahun** atas 27 wilayah Jawa Barat, dan **bukan** hanya tujuh Rebana. Tipologi lima kelompok hanya berasal dari profil **2024**, dan tidak diperluas ke 2020–2023 tanpa perhitungan ulang klaster tahun tersebut.

## 3. Hasil reproduksi terhadap paper

### Bobot CRITIC

| Dimensi | Indikator | Hasil reproduksi (6 desimal) |
| --- | --- | ---: |
| IDI | ln PDRB industri | 0,468390 |
| IDI | NDBI | 0,297534 |
| IDI | Cahaya malam | 0,234076 |
| SEC | ln jumlah penduduk | 0,333472 |
| SEC | Kemiskinan | 0,353220 |
| SEC | TPT | 0,313308 |
| ESP | NDVI | 0,562511 |
| ESP | LST | 0,437489 |

### Uji konsistensi

| Ukuran | Perhitungan ulang | Paper (dibulatkan) |
| --- | ---: | ---: |
| Korelasi IDI–ESP seluruh panel | −0,8092414 | −0,80924 |
| Rerata tujuh wilayah Rebana 2024 | 44,69357 | 44,69 |
| Rentang Rebana 2024 | 35,35733–52,63499 | 35,36–52,63 |
| Korelasi Spearman peringkat aritmetika–geometrik | 0,797314 | 0,797314 |
| Rerata perubahan peringkat | 3,77778 | 3,78 |
| Pergeseran peringkat maksimal | 11 | 11 |
| Silhouette k-means 2024, k=5 | 0,4160028 | 0,416003 |
| SEC tanpa jumlah penduduk: Spearman / rata-rata / maks / ARI | 0,933 / 2,30 / 6 / 0,377 | 0,933 / 2,30 / 6 / 0,377 |
| ESP hanya NDVI: Spearman / rata-rata / maks / ARI | 0,930 / 1,93 / 10 / 1,000 | 0,930 / 1,93 / 10 / 1,000 |
| ESP hanya LST: Spearman / rata-rata / maks / ARI | 0,968 / 1,63 / 4 / 1,000 | 0,968 / 1,63 / 4 / 1,000 |

Pada panel dan spesifikasi yang diperiksa, anggota lima klaster 2024 juga sesuai Tabel 5 paper. Hasil reproduksi *tidak* berarti lima klaster terbukti optimal atau merupakan kategori kapasitas lingkungan.

### Tujuh anggota Rebana resmi 2024

| Wilayah | J-NEST | IDI | SEC | ESP |
| --- | ---: | ---: | ---: | ---: |
| Kabupaten Sumedang | 52,635 | 28,966 | 50,878 | 78,060 |
| Kabupaten Majalengka | 49,382 | 37,561 | 51,823 | 58,763 |
| Kabupaten Subang | 46,216 | 27,730 | 51,564 | 59,355 |
| Kabupaten Kuningan | 43,496 | 12,272 | 38,026 | 80,191 |
| Kabupaten Cirebon | 43,058 | 40,351 | 50,202 | 38,620 |
| Kabupaten Indramayu | 42,710 | 46,413 | 46,155 | 35,562 |
| Kota Cirebon | 35,357 | 49,591 | 38,499 | 17,982 |

Kabupaten Bekasi dan Karawang adalah pembanding Pantura, **bukan** wilayah Rebana resmi sesuai Perpres 87/2021.

## 4. Apa yang sudah dan belum diverifikasi

**Sudah:** kekonsistenan tiga berkas CSV, integritas kunci panel, tidak adanya data hilang pada delapan indikator inti, persamaan normalisasi–CRITIC–agregasi, hasil korelasi, peringkat, klaster, dan sensitivitas menggunakan panel yang sama.

**Belum:** pemeriksaan publikasi primer BPS per tahun/satuan, identitas dan versi produk satelit, resolusi spasial/temporal, cloud masking, periode agregasi, nilai hilang sebelum data gabungan, batas poligon, pemrosesan curah hujan, serta kode asal pembuat ketiga CSV. Bukti proyek tapak, kesesuaian tata ruang, izin, pengguna eksisting, neraca sumber daya, serta atribusi dampak juga belum tersedia pada panel ini.

**Implikasi kebijakan:** hasil atlas dapat dipakai sebagai *konteks diagnosis awal penelitian*, bukan sebagai pembuktian kelayakan investasi, kerusakan ekologis, besaran kompensasi, atau persetujuan administratif. Simulasi G0–G4 harus menggunakan dokumen tapak yang relevan. Tingkat manfaat tambahan J-NEST terhadap proses pemerintah masih memerlukan evaluasi prospektif.

## 5. Reproduksi ulang

```bash
python -m pip install -r requirements-audit.txt
python tools/reproduce_panel.py
```

Hasilnya disimpan di `datasets/jnest_reproduced_scores_2020_2024.csv` (135 observasi) dan `datasets/jnest_validation_summary.json` (parameter/metrik dan SHA-256). Browser menghitung ulang melalui `assets/panel-engine.js` dan data `assets/panel-2020-2024.js` tanpa tergantung koneksi internet.


## 6. Jembatan teritorial V3 (26 Oktober 2026)

Engine `assets/territorial-bridge.js` membaca rekaman dari `assets/panel-engine.js` yang direproduksi, bukan profil yang diimpor pengguna. Untuk setiap tahun dan kode BPS, V3 menyajikan delapan nilai indikator dan kontribusi ke komposit, median 27 wilayah pada tahun sama, skor/peringkat aritmetika dan geometrik, serta nilai pendamping (yang **bukan** anggota indeks).

Rekaman 135 baris juga diekspor sebagai `datasets/jnest_territorial_context_2020_2024.csv`. Pada 2020 nilai pertumbuhan industri tahunan kosong dan kolom perubahan dari tahun awal juga kosong. Tipologi dibatasi untuk tahun 2024.

Matriks pertanyaan G0–G4 pada enam prompt per alternatif merupakan **logika pengalihan bukti**, bukan model statistik baru atau ambang penerimaan pemerintah. Perbedaan antarwilayah bukan efek relokasi proyek. Lihat `CATATAN_INTEGRASI_V3.md` dan `node tools/test_territorial.js`.

### Pemeriksaan produk

- 135 profil × empat jenis sektor diperiksa, dengan 27 kode BPS dan kesepadanan hash tiga CSV sumber.
- Uji browser meliputi perubahan tahun, lokasi dan alternatif fokus, pengaman G1 per alternatif, serta ekspor dossier/CSV/JSON.
- Tidak ditemukan kesalahan JavaScript pada pengujian utama dan tidak ditemukan luapan horizontal pada viewport mobile 390 px dan 375 px.
- Ini **QA prototipe**, bukan validasi formal, pengujian keamanan penetrasi, atau audit instansi.
