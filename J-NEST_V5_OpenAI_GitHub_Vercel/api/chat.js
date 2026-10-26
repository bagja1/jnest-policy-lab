/* Optional Vercel serverless AI adapter.
   Set OPENAI_API_KEY in Vercel (never in the browser). The dashboard always has a
   local, non-generative reference answer mode when no API key is configured. */
'use strict';
const rolling = new Map();
const CONTEXT = `ANDA ADALAH ASISTEN J-NEST–SKK. Jawab HANYA berdasar ringkasan paper penelitian di bawah. Gunakan bahasa Indonesia yang singkat, jelas, bernuansa akademik. Sebut sumber (tabel/bagian) di akhir. Bila jawaban tidak didukung data ini, katakan belum tersedia, jangan mengarang angka, dokumen, peringkat, tahun, atau atribusi kausal. Jangan memberi izin investasi atau menghitung kompensasi. Jangan jadikan SKK peraturan teknis modern.

Paper: “Kerangka J-NEST untuk Penapisan Investasi dan Telaah Kompensasi Ekologis Pantura–Rebana Berbasis Siksa Kandang Karesian” (2026). Unit 27 kabupaten/kota Jawa Barat selama 2020–2024; panel 135 pengamatan; delapan proksi. Indeks utama J-NEST ialah rerata aritmetika IDI, SEC, ESP yang masing-masing berskala 0–100 dengan bobot sepertiga. Normalisasi min–maks gabungan panel; pembobotan indikator CRITIC dalam dimensi. IDI: ln PDRB industri pengolahan bobot 0,468390, NDBI 0,297534, cahaya malam 0,234076. SEC: ln penduduk 0,333472, kemiskinan 0,353220 berarah negatif, TPT 0,313308 berarah negatif. ESP: NDVI 0,562511 positif, LST 0,437489 negatif. SEC bukan kesejahteraan per kapita, ESP tidak mengukur mutu air, biodiversitas atau seluruh daya dukung ekologi. Bobot dimensi utama setara, geometrik hanya uji sensitivitas.

Kawasan Rebana resmi Perpres 87/2021: Kabupaten Subang, Sumedang, Indramayu, Majalengka, Cirebon, Kuningan, dan Kota Cirebon. Kabupaten Bekasi dan Karawang hanya pembanding Pantura, BUKAN anggota resmi. Tujuh Rebana 2024: rentang 35,36–52,63, rerata 44,69. Profil sembilan wilayah (Tabel 3; JNEST, IDI, SEC, ESP, peringkat/27): Kab Bekasi 57,3;71,4;68,5;31,8;5. Kab Sumedang 52,6;29,0;50,9;78,1;14. Kab Karawang 50,4;54,0;58,0;39,2;15. Kab Majalengka 49,4;37,6;51,8;58,8;16. Kab Subang 46,2;27,7;51,6;59,4;20. Kab Kuningan 43,5;12,3;38,0;80,2;23. Kab Cirebon 43,1;40,4;50,2;38,6;24. Kab Indramayu 42,7;46,4;46,2;35,6;25. Kota Cirebon 35,4;49,6;38,5;18,0;27. Tiga tertinggi seluruh provinsi 2024: Kab Bandung 67,1, Kab Bogor 65,8, Kab Sukabumi 60,9 (Gambar 4).

Asosiasi pada panel: r IDI–ESP = −0,80924; IDI–SEC ~0,478; SEC–ESP ~−0,129. TIDAK menunjukkan dampak kausal industri atau investasi. PCA pertama 68,7% variasi. Uji sensitivitas aritmetika–geometrik Spearman 0,797314; geser peringkat rerata 3,7778, maksimum 11. SEC tanpa jumlah penduduk ARI=0,377, Spearman=0,933, geser rerata 2,30, maksimum 6. ESP hanya NDVI Spearman 0,930, geser rerata 1,93, maksimum 10, ARI1,000. ESP hanya LST Spearman 0,968, geser rerata 1,63, maksimum 4, ARI1,000; penghitungan ulang panel olahan dengan bobot tunggal 1 sesuai, tetapi kode asal penelitian belum diaudit. k-means tahun2024 lima klaster (silhouette0,416, k=6 silhouette0,423), tipologi bukan klasifikasi izin: ESLI (n6;IDI19,7 SEC58,4 ESP88,7) Kab Sukabumi, Ciamis, Garut, Tasikmalaya, Cianjur, Pangandaran. ETR (n9; 28,7;46,2;67,2) Bandung Barat,Purwakarta,Sumedang,Majalengka,Subang,Kota Tasikmalaya,Kota Banjar,Kuningan,Kota Sukabumi. BHC (n2;51,3;70,8;77,1) Kab Bandung,Bogor. IET (n6;53,0;49,8;31,0) Karawang,Kota Bogor,Kota Cimahi,Kab Cirebon,Kab Indramayu,Kota Cirebon. ISC (n4;78,2;72,8;19,2) Kota Bandung,Kab Bekasi,Kota Depok,Kota Bekasi (Tabel 5).

Orientasi SKK: Bagian I = pemeliharaan fungsi penghidupan; XV–XVI = sumber pengetahuan yang tepat; tritangtu = pembedaan peran; ini pembacaan interpretatif peneliti, bukan hukum atau baku mutu. G0 bukti dasar proyek, fungsi dan pengguna; G1 batas hukum dan ekologis yang berlaku; G2 kebutuhan sumber daya dan alternatif lokasi/teknologi/kapasitas/tahapan; G3 kompetensi, peran, tanggapan pengguna; G4 bukti dampak residual sesuai tahap perencanaan atau pelaksanaan. Status kekurangan bukti ialah belum dapat dinilai (Tabel 8).

Kasus Tol Akses Patimban: G2 alternatif tiga trase sudah diperbandingkan dalam kajian 2017 yang dirangkum laporan JICA 2022. Laporan Pemantauan I menyebut persetujuan AMDAL 17 Mei 2022, tetapi keabsahan izin tidak diaudit penelitian. RKL–RPL menetapkan baku mutu BOD 3 mg/L dan metode pemantauan; Laporan Pemantauan I melaporkan BOD 6–13,6 mg/L pada 7 titik berlabel baseline (Okt2023–Feb2024). Pelampauan batas tidak membuktikan dampak konstruksi; belum ada seri sepadan, pembanding sumber lain, atau atribusi. Dampak residual/kompensasi belum dapat dihitung (Tabel 9).

Kasus AIR BERSIH Patimban: dua profil resmi sama pada investasi Rp134,2 miliar, IRR10,9%, payback11 tahun, skema BOT. NPV lembar ditulis “IDR 29.0 Milion” dan portal “29,000,000,000” tanpa label mata uang di bidang NPV; perlu klarifikasi, jangan menyimpulkan mana yang benar. Kapasitas terpasang bukan pasokan tambahan yang tersedia; perlu neraca layanan pengguna eksisting, kapasitas, produksi, waktu dan asumsi arus kas. (Tabel 10).

Batas penelitian: penelitian tidak menguji nilai tambah J-NEST dibanding proses pemerintah yang berjalan, tidak membuktikan manfaat ekologis atau keputusan investasi. Panel olahan tiga CSV berisi 135 baris dan telah direproduksi di browser J-NEST Policy Lab V2, dan data rinci untuk wilayah atau tahun yang ditanyakan dapat dilampirkan secara terpilih dari CSV. Jangan mengarang nilai lain yang tidak tersedia. Audit sumber primer BPS, metode citra, kode asal, dan data tapak tetap diperlukan sebelum pemakaian kebijakan.`;


// Actual panel rows are loaded from a read-only snapshot reproduced from the uploaded CSV.
// This is contextual retrieval, NOT prediction of environmental impacts or permit outcomes.
const PANEL = require('./panel-summary.json');
function selection(question) {
  const q = String(question).toLocaleLowerCase('id-ID');
  const years = [...q.matchAll(/\b(202[0-4])\b/g)].map(x=>Number(x[1]));
  const year = years.length ? years[0] : 2024;
  const trend = /tren|perubahan|perkembangan|2020.?2024|lima tahun|seluruh tahun|antar.?tahun/.test(q);
  const names = [...new Set(PANEL.map(x=>x.wilayah))];
  const matched = names.filter(name => {
    const n=name.toLocaleLowerCase('id-ID');
    const short=n.replace(/^kabupaten /,'kab. ');
    return q.includes(n) || q.includes(short);
  });
  // "Bogor" alone may mean both Kabupaten Bogor and Kota Bogor.
  if(!matched.length) {
    for(const n of names) {
      const suffix=n.replace(/^(Kabupaten|Kota) /,'').toLocaleLowerCase('id-ID');
      if(suffix.length>=5 && new RegExp('(^|[^a-z])'+suffix+'([^a-z]|$)').test(q)) matched.push(n);
    }
  }
  const unique=[...new Set(matched)].slice(0,3);
  const subset = unique.length
    ? PANEL.filter(x=>unique.includes(x.wilayah) && (trend || x.year===year)).slice(0,15)
    : PANEL.filter(x=>x.year===year).sort((a,b)=>b.jnest-a.jnest).slice(0,3);
  return 'DATA PANEL OLAHAN TERPILIH (bukan data tapak atau proyeksi dampak):\n'+subset.map(x=>
    `${x.wilayah}, tahun ${x.year}: J-NEST=${x.jnest.toFixed(3)}, IDI=${x.IDI.toFixed(3)}, SEC=${x.SEC.toFixed(3)}, ESP=${x.ESP.toFixed(3)}, peringkat ${x.rank}/27.`).join('\n')+
    '\nAngka disalin dari panel olahan 2020-2024 yang direproduksi; audit data primer masih diperlukan. Jangan simpulkan izin proyek atau dampak sebab-akibat.';
}
function outputText(payload) {
  if(typeof payload?.output_text === 'string' && payload.output_text.trim()) return payload.output_text;
  const parts=[];
  for(const item of payload?.output||[]) if(item.type==='message') {
    for(const content of item.content||[]) if(content.type==='output_text' && typeof content.text==='string') parts.push(content.text);
  }
  return parts.join('\n').trim();
}
function send(res,status,data) {return res.status(status).json(data);}


module.exports = async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='POST') {res.setHeader('Allow','POST');return send(res,405,{error:'Gunakan metode POST.'});}
  if(!process.env.OPENAI_API_KEY) return send(res,503,{error:'OPENAI_API_KEY belum diatur pada server.'});
  const rawBody=req.body;
  if(typeof rawBody==='string' && rawBody.length>12000) return send(res,413,{error:'Permintaan terlalu besar.'});
  let body=rawBody;
  if(typeof body==='string') {try{body=JSON.parse(body);}catch(_){return send(res,400,{error:'JSON tidak sah.'});}}
  const question=body && typeof body.question==='string' ? body.question.trim() : '';
  if(question.length<2 || question.length>2000) return send(res,400,{error:'Pertanyaan harus 2-2000 karakter.'});

  // This in-memory limiter is only a best-effort safety net in serverless.
  // Production deployments still need managed rate limiting and/or authentication.
  const ip=String(req.headers?.['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim().slice(0,100);
  const now=Date.now();
  const recent=(rolling.get(ip)||[]).filter(t=>now-t<60000);
  if(recent.length>=10) return send(res,429,{error:'Terlalu banyak permintaan. Coba kembali nanti.'});
  recent.push(now); rolling.set(ip,recent);
  if(rolling.size>1000) rolling.clear();

  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),22000);
  try {
    const response=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',signal:controller.signal,
      headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:process.env.OPENAI_MODEL||'gpt-5.4-mini',
        instructions:CONTEXT+'\n\n'+selection(question)+'\nSebut sumber paper (tabel/bagian) dan jelaskan batasnya. Jangan mengklaim telah melihat berkas proyek pribadi pengguna.',
        input:question,
        max_output_tokens:1050,
        store:false
      })
    });
    if(!response.ok) {
      // Keep upstream errors and API keys private; details belong in Vercel logs.
      console.error('OpenAI request failed',response.status);
      return send(res,502,{error:'Layanan AI belum merespons. Periksa model, kuota API, dan environment variable di Vercel.'});
    }
    const payload=await response.json();
    const answer=outputText(payload);
    if(!answer) return send(res,502,{error:'Respons AI kosong. Coba pertanyaan yang lebih singkat.'});
    return send(res,200,{answer:answer.slice(0,5500),mode:'openai'});
  } catch(err) {
    console.error('OpenAI connection problem',err?.name||'network');
    return send(res,502,{error:'Koneksi AI gagal. Panduan lokal tetap tersedia.'});
  } finally {clearTimeout(timeout);}
};
