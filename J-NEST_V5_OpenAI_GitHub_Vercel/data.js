/* Research metadata and paper reference values; core scores are now recalculated from the uploaded processed panel.
   The panel 2020-2024 is processed research data, not an independent verification of original BPS/GEE sources. */
const STUDY = {
  title: 'J-NEST–SKK: Penapisan Investasi dan Telaah Kompensasi Ekologis Pantura–Rebana',
  author: 'Bagja Kurniawan',
  period: '2020–2024',
  units: 27,
  observations: 135,
  dimensions: {
    IDI: {label:'Aktivitas industri', desc:'PDRB industri pengolahan (ln), NDBI, cahaya malam', weights:[['ln PDRB industri',0.468390,'+'],['NDBI',0.297534,'+'],['Cahaya malam',0.234076,'+']]},
    SEC: {label:'Profil sosial-ekonomi', desc:'Jumlah penduduk (ln), kemiskinan, TPT', weights:[['ln jumlah penduduk',0.333472,'+'],['Kemiskinan',0.353220,'−'],['TPT',0.313308,'−']]},
    ESP: {label:'Vegetasi–termal', desc:'NDVI dan suhu permukaan lahan (LST)', weights:[['NDVI',0.562511,'+'],['LST',0.437489,'−']]}
  },
  findings: {corr:-0.80924,meanRebana:44.69,rebanaMin:35.36,rebanaMax:52.63, maxRankShift:11,arithGeoSpearman:0.797314, avgRankShift:3.7778, silhouette5:0.416003, silhouette6:0.423},
  types: {
    ESLI:{name:'Environmental Strength',short:'Vegetasi–termal relatif kuat',color:'#2b9198',n:6,IDI:19.7,SEC:58.4,ESP:88.7,desc:'Profil ESP relatif tinggi; tidak berarti lahan bebas untuk dikonversi.'},
    ETR:{name:'Environmental Transition',short:'Profil transisi deskriptif',color:'#88b99a',n:9,IDI:28.7,SEC:46.2,ESP:67.2,desc:'Label deskriptif; tidak membuktikan perubahan transisi antarwaktu.'},
    BHC:{name:'Balanced High-Capacity',short:'Tiga dimensi relatif tinggi',color:'#7b6da9',n:2,IDI:51.3,SEC:70.8,ESP:77.1,desc:'Bukan ukuran daya tampung investasi atau legalitas proyek.'},
    IET:{name:'Industrial–Environmental Trade-off',short:'Industri dan ESP berbeda',color:'#d98b68',n:6,IDI:53.0,SEC:49.8,ESP:31.0,desc:'Bukan bukti kausal aktivitas industri merusak ekologi.'},
    ISC:{name:'Industrial Core',short:'Intensitas industri tinggi',color:'#d6ad58',n:4,IDI:78.2,SEC:72.8,ESP:19.2,desc:'Tidak menetapkan batas atau izin investasi.'}
  },
  sensitivity: [
    {name:'Aritmetika → geometrik',spearman:0.797314,meanShift:3.7778,maxShift:11,ari:null,note:'Seluruh 27 wilayah, skor dimensi studi; perubahan urutan akibat pilihan agregasi.'},
    {name:'SEC tanpa jumlah penduduk',spearman:0.933,meanShift:2.30,maxShift:6,ari:0.377,note:'Perubahan konstruk SEC memengaruhi keanggotaan tipologi.'},
    {name:'ESP hanya NDVI',spearman:0.930,meanShift:1.93,maxShift:10,ari:1.000,note:'Bobot indikator tunggal = 1 direproduksi pada panel; kode asal penelitian belum diaudit.'},
    {name:'ESP hanya LST',spearman:0.968,meanShift:1.63,maxShift:4,ari:1.000,note:'Bobot indikator tunggal = 1 direproduksi pada panel; kode asal penelitian belum diaudit.'}
  ],
  gates:[
    {id:'G0',name:'Kelengkapan bukti',subtitle:'Definisikan objek penelaahan',question:'Fungsi lingkungan, pengguna, kebutuhan proyek, dan data dasar apa yang relevan?',checklist:['Identitas dan lokasi proyek jelas','Fungsi lingkungan dan pengguna sumber daya teridentifikasi','Data dasar dan sumber bukti dapat ditelusuri'],follow:'Tetapkan objek telaah dan kebutuhan bukti dari dokumen awal.',source:'Tabel 8'},
    {id:'G1',name:'Batas hukum dan ekologis',subtitle:'Rujuk batas yang berlaku',question:'Apakah ada larangan atau batas yang berlaku pada lokasi?',checklist:['Kesesuaian lokasi diperiksa menurut instrumen yang berlaku','Batas atau larangan relevan telah dicatat','Pemeriksaan dirujuk ke instansi berwenang'],follow:'Rujukan penilaian kesesuaian lokasi kepada instansi berwenang.',source:'Tabel 8'},
    {id:'G2',name:'Kesesuaian proyek',subtitle:'Bandingkan alternatif desain',question:'Bagaimana kebutuhan proyek dan alternatif desain memengaruhi fungsi yang ditelaah?',checklist:['Kebutuhan sumber daya dan pengguna eksisting diperiksa','Alternatif lokasi, teknologi, kapasitas, atau tahap dibandingkan','Dasar teknis, biaya, dan ketidakpastian terdokumentasi'],follow:'Bandingkan alternatif berdasarkan kajian teknis dan ketidakpastian.',source:'Tabel 8'},
    {id:'G3',name:'Proses dan tanggung jawab',subtitle:'Tautkan penelaah dan tindak lanjut',question:'Apakah penelaah kompeten dan berwenang; bagaimana isu pengguna ditanggapi?',checklist:['Kompetensi dan peran penelaah jelas','Masukan pengguna dan isu material dicatat','Ada tanggapan dan penanggung jawab tindak lanjut'],follow:'Catat sumber pengetahuan, alasan pilihan, dan tindak lanjut.',source:'Tabel 8'},
    {id:'G4',name:'Bukti dampak residual',subtitle:'Pisahkan proyeksi dan pengamatan',question:'Apa dampak tersisa setelah mitigasi, dan bukti apa yang dapat diatribusikan?',checklist:['Tahap perencanaan atau pelaksanaan dinyatakan','Data kondisi awal dan lanjutan dapat dibandingkan jika diperlukan','Sumber perubahan lain dan efektivitas mitigasi ditelaah'],follow:'Pisahkan proyeksi dari pengamatan; rujuk penilaian resmi.',source:'Tabel 8'}
  ],
  references: [
    {label:'Perpres 87/2021 — kawasan Rebana',url:'https://peraturan.bpk.go.id/Details/179928/perpres-no-87-tahun-2021'},
    {label:'Perda Jabar 4/2025 — investasi',url:'https://jdih.jabarprov.go.id/page/info/produk/53480'},
    {label:'Laporan bantuan teknis Tol Akses Patimban (JICA)',url:'https://openjicareport.jica.go.jp/pdf/12371431.pdf'},
    {label:'RKL–RPL Tol Akses Patimban',url:'https://www.jica.go.jp/english/our_work/social_environmental/id/asia/southeast/indonesia/gh13tc000000zfcz-att/dbil86000000ypwh.pdf'},
    {label:'Profil penawaran air bersih Patimban (DPMPTSP)',url:'https://dpmptsp.jabarprov.go.id/investasi-jabar/src/assets/invest/file/Clean_Water_Services_for-the_Patimban_Port_Area%26Surroundings.pdf'}
  ]
};

// Scores for the 15 highest regions are as printed in Figure 4, 2024 (1 decimal).
const TOP15 = [
  ['Kab. Bandung',67.1], ['Kab. Bogor',65.8], ['Kab. Sukabumi',60.9], ['Kota Bandung',57.8],
  ['Kab. Bekasi',57.3], ['Kab. Ciamis',57.1], ['Kab. Garut',57.0], ['Kota Depok',57.0],
  ['Kab. Tasikmalaya',56.0], ['Kab. Bandung Barat',55.7], ['Kota Bekasi',55.0],
  ['Kab. Cianjur',54.9], ['Kab. Purwakarta',53.6], ['Kab. Sumedang',52.6], ['Kab. Karawang',50.4]
];
// Nine complete dimension profiles: Table 3 of the paper. The two comparators are NOT official Rebana members.
const PROFILES = {
  'Kab. Bekasi':       {score:57.3,IDI:71.4,SEC:68.5,ESP:31.8,rank:5},
  'Kab. Sumedang':     {score:52.6,IDI:29.0,SEC:50.9,ESP:78.1,rank:14},
  'Kab. Karawang':     {score:50.4,IDI:54.0,SEC:58.0,ESP:39.2,rank:15},
  'Kab. Majalengka':   {score:49.4,IDI:37.6,SEC:51.8,ESP:58.8,rank:16},
  'Kab. Subang':       {score:46.2,IDI:27.7,SEC:51.6,ESP:59.4,rank:20},
  'Kab. Kuningan':     {score:43.5,IDI:12.3,SEC:38.0,ESP:80.2,rank:23},
  'Kab. Cirebon':      {score:43.1,IDI:40.4,SEC:50.2,ESP:38.6,rank:24},
  'Kab. Indramayu':    {score:42.7,IDI:46.4,SEC:46.2,ESP:35.6,rank:25},
  'Kota Cirebon':      {score:35.4,IDI:49.6,SEC:38.5,ESP:18.0,rank:27},
};

const REGION_NAMES = [
  'Kab. Bogor','Kab. Sukabumi','Kab. Cianjur','Kab. Bandung','Kab. Garut','Kab. Tasikmalaya',
  'Kab. Ciamis','Kab. Kuningan','Kab. Cirebon','Kab. Majalengka','Kab. Sumedang',
  'Kab. Indramayu','Kab. Subang','Kab. Purwakarta','Kab. Karawang','Kab. Bekasi',
  'Kab. Bandung Barat','Kab. Pangandaran','Kota Bogor','Kota Sukabumi','Kota Bandung',
  'Kota Cirebon','Kota Bekasi','Kota Depok','Kota Cimahi','Kota Tasikmalaya','Kota Banjar'
];
const ASSIGNMENTS = {
  ESLI:[2,3,5,6,7,18],
  ISC:[16,21,23,24],
  ETR:[8,11,13,14,10,17,20,26,27],
  BHC:[1,4],
  IET:[9,12,15,19,22,25]
};
const REBANA = new Set([8,9,10,11,12,13,22]);
const PANTURA = new Set([15,16]);
const TYPE_BY_ID = Object.fromEntries(Object.entries(ASSIGNMENTS).flatMap(([code,ids])=>ids.map(id=>[id,code])));
const RANKS = Object.fromEntries(TOP15.map(([name,score],i)=>[name,i+1]));
const SCORES = Object.fromEntries(TOP15);
Object.entries(PROFILES).forEach(([name,profile])=>{SCORES[name]=profile.score;RANKS[name]=profile.rank;});
const REGIONS=REGION_NAMES.map((name,i)=>({
  id:i+1,name,typology:TYPE_BY_ID[i+1],zone:REBANA.has(i+1)?'rebana':PANTURA.has(i+1)?'pantura':'jabar',
  score:SCORES[name]??null,rank:RANKS[name]??null,IDI:PROFILES[name]?.IDI??null,SEC:PROFILES[name]?.SEC??null,ESP:PROFILES[name]?.ESP??null,
  source:PROFILES[name]?'Tabel 3':SCORES[name]!=null?'Gambar 4':'Tabel 5 (tipologi saja)'
}));
const TYPE_ORDER=['ESLI','ETR','BHC','IET','ISC'];
