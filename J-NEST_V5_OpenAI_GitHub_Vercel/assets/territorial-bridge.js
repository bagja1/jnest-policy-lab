/* Territorial-to-policy bridge V3.
   Every numeric regional value comes from PANEL_MODEL (the uploaded 135-row processed panel).
   It does not classify project permits, forecast causal effects, infer site conditions, or set ecological limits.
*/
const TERRITORIAL = (() => {
  'use strict';
  const baseYears = [2020, 2021, 2022, 2023, 2024];
  const supplementary = [
    {id:'rainfall',field:'rainfall_annual_mm',name:'Curah hujan tahunan',unit:'mm/tahun',note:'Proksi wilayah; bukan air yang dapat dialokasikan'},
    {id:'rainmax',field:'rainfall_max_daily_mm',name:'Hujan harian maksimum',unit:'mm/hari',note:'Bukan estimasi banjir tapak'},
    {id:'ndwi',field:'ndwi_mean',name:'NDWI',unit:'indeks',note:'Proksi spektral; bukan debit atau mutu air'},
    {id:'s1water',field:'sentinel1_water_proxy_mean',name:'Proksi air Sentinel-1',unit:'indeks',note:'Bukan kapasitas sumber air'},
    {id:'harvest',field:'rice_harvested_area_hectare',name:'Luas panen padi',unit:'ha',note:'Statistik wilayah; bukan peta lahan proyek'},
    {id:'rice',field:'rice_production_ton',name:'Produksi padi',unit:'ton',note:'Statistik wilayah; bukan dampak proyek'},
    {id:'manufacturingGrowth',field:'manufacturing_grdp_real_growth_yoy_percent',name:'Pertumbuhan riil industri (yoy)',unit:'%',note:'2020 kosong pada berkas, bukan 0'}
  ];
  const byYear = new Map(baseYears.map(year=>[year,PANEL_MODEL.byYear[year]]));
  const names=new Map(REGIONS.map(r=>[r.id,r]));
  const finite=v=>typeof v==='number'&&Number.isFinite(v);
  const median=(list)=>{const values=list.filter(finite).sort((a,b)=>a-b);if(!values.length)return null;const i=Math.floor(values.length/2);return values.length%2?values[i]:(values[i-1]+values[i])/2;};
  const peer=(year,field)=>{
    const rows=byYear.get(year);
    if(!rows)throw new Error('Tahun panel tidak tersedia: '+year);
    const values=rows.map(x=>x[field]).filter(finite);
    return {median:median(values),count:values.length,min:Math.min(...values),max:Math.max(...values)};
  };
  const relative=(value,reference)=>!finite(value)||!finite(reference)?'tidak tersedia':value<reference?'di bawah median':value>reference?'di atas median':'sama dengan median';
  const profile=(regionId,year=2024)=>{
    const region=names.get(Number(regionId));const row=PANEL_MODEL.row(Number(regionId),Number(year));
    if(!region||!row)throw new Error('Kunci wilayah–tahun tidak ditemukan.');
    const first=PANEL_MODEL.row(region.id,2020);
    const indicators=PANEL_MODEL.FIELDS.map(f=>{
      const value=row[f.field];const p=peer(Number(year),f.field);
      return {id:f.id,label:f.name,field:f.field,value,unit:f.unit,dimension:f.dimension,direction:f.direction,
        normalized:row.normalized[f.id],criticWeight:PANEL_MODEL.weights[f.dimension][f.id],
        compositeContribution:row.contribution[f.id],median:p.median,relative:relative(value,p.median),count:p.count};
    });
    const companions=supplementary.map(f=>({id:f.id,label:f.name,field:f.field,value:finite(row[f.field])?row[f.field]:null,unit:f.unit,
      note:f.note,median:peer(Number(year),f.field).median}));
    const timeline=baseYears.filter(y=>y<=Number(year)).map(y=>{
      const r=PANEL_MODEL.row(region.id,y);
      return {year:y,score:r.score,IDI:r.IDI,SEC:r.SEC,ESP:r.ESP,ndvi:r.ndvi_mean,lst:r.lst_mean_c,poor:r.poverty_rate_percent,tpt:r.open_unemployment_rate_percent};
    });
    const base=timeline[0],last=timeline[timeline.length-1];
    const delta={};for(const k of ['score','IDI','SEC','ESP','ndvi','lst','poor','tpt'])delta[k]=last[k]-base[k];
    const zone=region.zone==='rebana'?'Rebana resmi':region.zone==='pantura'?'Pembanding Pantura (bukan Rebana)':'Jawa Barat di luar 7 Rebana';
    const geometricRanks=PANEL_MODEL.whatIf(Number(year),{IDI:1/3,SEC:1/3,ESP:1/3},'geometric');
    const geo=geometricRanks.find(x=>x.regionId===region.id);
    const dimensions=['IDI','SEC','ESP'].map(k=>({key:k,value:row[k],median:median(byYear.get(Number(year)).map(r=>r[k]))}));
    return {regionId:region.id,code:String(row.bps_domain),name:region.name,zone,typology2024:region.typology,
      year:Number(year),score:row.score,rank:row.rank,IDI:row.IDI,SEC:row.SEC,ESP:row.ESP,
      geometricScore:geo.score,geometricRank:geo.rank,rankDifference:row.rank-geo.rank,
      dimensions,indicators,companions,timeline,delta,
      provenance:{origin:'Panel master olahan terunggah (27 wilayah × 2020–2024)',sourceFiles:['jnes_master_panel_2020_2024.csv','jnes_gee_features_admin2_year_2020_2024.csv','jnest_bps_manufacturing_admin2_year_2020_2024.csv'],
      method:'ln (PDRB industri ADHK dan populasi), min–maks gabungan 135, CRITIC internal, 1/3 per dimensi',verified:'reproduksi perhitungan pada panel olahan; sumber primer belum diaudit'}};
  };
  const item=(p,id)=>p.indicators.find(x=>x.id===id);
  const extra=(p,id)=>p.companions.find(x=>x.id===id);
  const display=(n,d=2)=>finite(n)?n.toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d}):'—';
  const question=(gate,headline,observation,prompt,requirement,evidenceId)=>({gate,headline,observation,prompt,requirement,evidenceId,
    basis:'Panel olahan '+(observation?'2020–'+(observation.year||'2024'):'2020–2024')+' / paper Tabel 8 dan 12'});
  const questions=(p,sector='other')=>{
    const ndvi=item(p,'ndvi'),lst=item(p,'lst'),ndbi=item(p,'ndbi'),poor=item(p,'poor'),tpt=item(p,'tpt'),pdrb=item(p,'pdrb');
    const rs=[];
    rs.push({gate:'G0',evidenceId:'baseline',headline:'Tutupan vegetasi dan kondisi termal',
      observation:`NDVI ${display(ndvi.value,3)} (${ndvi.relative} ${p.year}); LST ${display(lst.value,2)} °C (${lst.relative}).`,
      prompt:'Fungsi vegetasi dan penggunaan lahan apa yang benar-benar bersinggungan dengan tapak proyek?',
      requirement:'Peta tutupan lahan tapak bertanggal, pengukuran kondisi awal, fungsi pengguna dan desain poligon proyek.',
      basis:'Indikator NDVI dan LST panel olahan; paper Tabel 8 & 12'});
    rs.push({gate:'G1',evidenceId:'spatial',headline:'Kesesuaian ruang tidak tersedia pada indeks',
      observation:`Skor J-NEST ${display(p.score,2)} dan peringkat ${p.rank}/27 bukan pemeriksaan legalitas lokasi.`,
      prompt:'Apakah lokasi alternatif melintasi atau berbenturan dengan batas/larangan yang berlaku?',
      requirement:'Koordinat tapak yang terverifikasi, overlay RTRW/RDTR dan batas relevan, hasil pemeriksaan instansi berwenang.',
      basis:'Paper G1; data batas hukum tapak tidak ada pada tiga CSV'});
    rs.push({gate:'G2',evidenceId:'alternatives',headline:'Aktivitas terbangun dan kebutuhan desain',
      observation:`NDBI ${display(ndbi.value,3)} (${ndbi.relative}); IDI ${display(p.IDI,1)}; PDRB industri ADHK ${display(pdrb.value,1)} Rp miliar.`,
      prompt:'Apakah perbedaan rancangan lokasi, teknologi, luas atau tahapan menghasilkan perubahan kebutuhan sumber daya yang dapat dibandingkan?',
      requirement:'Gambar desain alternatif, satuan layanan yang sama, kebutuhan sumber daya, konsekuensi biaya dan ketidakpastian.',
      basis:'IDI + NDBI adalah proksi wilayah; paper Tabel 8 & 12'});
    if(sector==='air'){
      const rain=extra(p,'rainfall'),ndwi=extra(p,'ndwi');
      rs.push({gate:'G2',evidenceId:'resource',headline:'Neraca layanan air dan kebutuhan pengguna',
        observation:`Curah hujan wilayah ${display(rain.value,1)} mm/tahun dan NDWI ${display(ndwi.value,3)} adalah indikator pendamping, bukan volume pasokan.`,
        prompt:'Berapa pasokan tambahan yang benar-benar dapat dialokasikan setelah pengguna eksisting dan komitmen lain menurut periode?',
        requirement:'Neraca pasokan–permintaan operator, izin/komitmen alokasi, kehilangan air, batas jaringan dan proyeksi per tahap.',
        basis:'Indikator pendamping GEE + paper Tabel 10 & 12'});
    }else if(sector==='transport'){
      const rain=extra(p,'rainmax');
      rs.push({gate:'G2',evidenceId:'resource',headline:'Alternatif trase dan penanganan air',
        observation:`Hujan harian maksimum wilayah ${display(rain.value,1)} mm/hari hanya konteks data pendamping.`,
        prompt:'Bagaimana alternatif trase/tata letak menangani drainase, pembebasan lahan, dan fungsi penghidupan di tapak?',
        requirement:'Trase dan data topografi, kajian hidrologi/drainase setempat, lahan terdampak dan alternatif rute.',
        basis:'Hujan tahunan/hari dari GEE; paper Tabel 9 & 12'});
    }else if(sector==='industry'){
      const harvest=extra(p,'harvest');
      rs.push({gate:'G2',evidenceId:'resource',headline:'Lahan pertanian dan kebutuhan industri',
        observation:`Luas panen padi kabupaten/kota ${display(harvest.value,1)} ha merupakan statistik wilayah, bukan luas tapak.`,
        prompt:'Apakah alternatif tata letak atau kapasitas mengubah fungsi lahan yang digunakan masyarakat atau kebutuhan air/energi?',
        requirement:'Inventarisasi pengguna lahan tapak, studi teknis kebutuhan air/energi, pilihan tapak, pengelolaan dampak.',
        basis:'BPS panel pendamping + paper Tabel 12'});
    }else{
      rs.push({gate:'G2',evidenceId:'resource',headline:'Kebutuhan sumber daya per sektor',
        observation:'Panel J-NEST tidak mengukur sumber daya yang dapat dialokasikan kepada usulan tertentu.',
        prompt:'Sumber daya mana yang menjadi pembatas nyata dan bagaimana alternatif mengubah kebutuhannya?',
        requirement:'Kajian sektoral tapak, data pengguna eksisting dan rancangan yang konsisten antaralternatif.',
        basis:'Paper Tabel 8 & 12'});
    }
    rs.push({gate:'G3',evidenceId:'users',headline:'Fungsi penghidupan dan sumber pengetahuan',
      observation:`Kemiskinan wilayah ${display(poor.value,2)}% dan TPT ${display(tpt.value,2)}%; angka ini bukan besaran dampak sosial proyek.`,
      prompt:'Siapa pengguna sumber daya yang berpotensi terkena perubahan, dan pengetahuan siapa yang diperlukan untuk menilai klaim?',
      requirement:'Pemetaan pengguna/fungsi penghidupan di tapak, sumber pengetahuan, catatan masukan serta tanggapan.',
      basis:'SEC, SKK bagian I dan XV–XVI; paper Tabel 6–8'});
    rs.push({gate:'G4',evidenceId:'attribution',headline:'Perubahan panel bukan atribusi dampak proyek',
      observation:p.year===2020?`2020 adalah awal panel; perubahan antarwaktu belum dapat dihitung.`:`Δ NDVI 2020–${p.year}: ${p.delta.ndvi>=0?'+':''}${display(p.delta.ndvi,3)}; Δ LST ${p.delta.lst>=0?'+':''}${display(p.delta.lst,2)} °C (agregat wilayah).`,
      prompt:'Bila ada perubahan setelah proyek, apakah metode/titik/waktu pembanding sepadan dan penyebab lain telah dipertimbangkan?',
      requirement:'Data awal-lanjutan tapak, data sumber pembanding, model proyeksi pada perencanaan atau bukti pemantauan saat pelaksanaan, catatan mitigasi.',
      basis:'Perubahan panel retrospektif + paper G4; tidak mengidentifikasi dampak kausal'});
    return rs;
  };
  const compare=(ids,year)=>ids.map(id=>profile(id,year));
  const testInvariants=()=>{
    if(PANEL_MODEL.rows.length!==135||REGIONS.length!==27)throw Error('Ukuran panel berubah dari penelitian.');
    for(const y of baseYears)if(!byYear.get(y)||byYear.get(y).length!==27)throw Error('Tahun tidak lengkap: '+y);
    if(!PANEL_MODEL.report.weightsWithinPaperTolerance)throw Error('Bobot tidak cocok dengan paper.');
    const subang=profile(13,2024);
    if(Math.abs(subang.score-46.216)>0.02)throw Error('Reproduksi Subang tidak cocok.');
    return {regions:27,years:baseYears,rows:135,weightsReproduced:true,subang2024:subang.score};
  };
  return {profile,questions,compare,display,peer,relative,supplementary,testInvariants,years:baseYears};
})();
