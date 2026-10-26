# Catatan integrasi J-NEST Policy Lab V3

Tanggal: **26 Oktober 2026**. Basis: tiga CSV unggahan pengguna dan paper J-NEST–SKK yang disediakan dalam percakapan.

## Apa yang benar-benar telah terhubung

**Setiap alternatif proyek → kode kabupaten/kota → tahun referensi → rekaman panel olahan → hasil normalisasi–CRITIC → indikator dan pertanyaan G0–G4 → dossier.**

Yang dihitung secara deterministik dari panel (bukan isian proyek): skor J-NEST, IDI/SEC/ESP, peringkat dalam tahun, peringkat geometrik, nilai mentah 8 indikator, normalisasi, bobot internal dimensi, kontribusi indikator, median tahunan 27 wilayah, dan perubahan dari 2020 sampai tahun yang dipilih. Tidak ada proyeksi setelah 2024.

Yang disajikan sebagai **konteks pendamping, bukan konstruk indeks**: curah hujan tahunan, hujan harian maksimum, NDWI, proksi air Sentinel-1, luas panen, produksi padi dan pertumbuhan riil PDRB industri. Pada 2020 kolom terakhir tidak tersedia, bukan nol. Nilai ini tidak dipakai untuk penilaian risiko tapak maupun perhitungan neraca air.

Yang tetap berupa **masukan pengguna**: kebutuhan air dan layanan pengguna, model kapasitas, biaya, teknologi, tahun mulai, luas lahan, dokumentasi dan status G1 tapak. Simulasi aritmetika tidak membuktikan ketersediaan pasokan atau kesesuaian lokasi.

## Peta pertanyaan per opsi

| Gate | Fakta/indikator pembuka | Yang ditanyakan kepada pemilik data |
| --- | --- | --- |
| G0 | NDVI dan LST wilayah–tahun | Fungsi vegetasi, pengguna, dan tutupan aktual tapak mana yang relevan? |
| G1 | Peringkat/skor J-NEST tidak menguji legalitas | Apakah tapak alternatif sesuai batas ruang dan larangan resmi? |
| G2 (desain) | NDBI, IDI, PDRB industri | Bagaimana lokasi, teknologi, kapasitas atau tahapan mengubah kebutuhan sumber daya? |
| G2 (sektoral) | Air: curah hujan dan NDWI; jalan: hujan harian; industri: luas panen; lainnya: indikator umum | Bukti teknis sumber daya dan layanan eksisting apa yang diperlukan? |
| G3 | Kemiskinan dan TPT (konteks sosial, bukan efek proyek) | Siapa pengguna sumber daya dan pihak yang kompeten, bagaimana tanggapan dicatat? |
| G4 | Perubahan NDVI/LST 2020–tahun terpilih (bukan atribusi) | Adakah proyeksi residual atau hasil pengamatan sepadan yang membedakan pengaruh proyek dari penyebab lain? |

Tidak ada pertanyaan yang menambahkan ambang hukum/ekologis atau mengubah status 15 bukti secara otomatis. G1 per alternatif disimpan terpisah sebagai klaim pengguna dan memerlukan sumber. Indikasi konflik menghasilkan status **tahan & rujuk**.

## Pengujian yang dijalankan

- `node tools/test_territorial.js` — **LULUS**: 135 profil, 27 kode BPS, delapan indikator, tujuh indikator pendamping, median 27 wilayah, pertanyaan lima gate untuk empat kategori sektor, dan hash sumber yang tidak berubah.
- Browser Chromium — **LULUS**: jalur lima langkah, perubahan tahun 2024→2022, perubahan lokasi dasar Subang→Sumedang, pengalihan alternatif fokus, pertanyaan G2, ekspor HTML/JSON/CSV, dan tidak ada kesalahan JavaScript.
- Uji ketahanan G1 — **LULUS**: lokasi alternatif tanpa verifikasi → kebutuhan bukti tambahan; konflik yang diisi → tahan/rujuk; klaim ditelaah setelah diberi rujukan → tetap tidak menghasilkan persetujuan otomatis.
- Tampilan smartphone — **LULUS** pada viewport 390 px dan 375 px, lima tahapan tanpa pelebaran horizontal.

## Keterbatasan yang masih menentukan

1. **Keaslian sumber primer:** perlu memeriksa rilis BPS, definisi satuan tahunan, produk GEE, resolusi, cloud masking, jangka agregasi, poligon dan versi kode asal.
2. **Skala tapak:** koordinat serta poligon proyek, RTRW/RDTR/batas hutan, lingkungan, sempadan dan aturan relevan dengan rujukan instansi; tidak tersedia dalam tiga berkas panel.
3. **Model dampak sektoral:** neraca air operator, kapasitas layanan, pengguna, biaya dan arus kas tiap desain; atau studi transportasi, lahan dan monitoring untuk sektor lain.
4. **Bukti G4:** data awal dan lanjutan sepadan, penyebab perubahan lain, hasil mitigasi dan penilaian yang dapat diatribusikan; panel tidak menyediakan model kausal proyek.
5. **Sistem pemerintahan:** akun/peran resmi, pengesahan telaah, manajemen berkas, audit immutable, integrasi sumber data, keamanan dan evaluasi prospektif dibanding prosedur biasa.

*J-NEST tetap alat bantu rumusan pertanyaan, alternatif dan keterlacakan bukti. Tidak ada izin, ranking kelayakan atau tarif kompensasi yang dihitung.*
