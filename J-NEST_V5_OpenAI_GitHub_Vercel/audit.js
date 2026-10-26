/* Audit and exploration of the uploaded processed panel. No external services. */
(function(){
'use strict';
const ui={region:13,year:2024,metric:'score',allYears:false,query:''};
const get=id=>document.getElementById(id);
const numeric=(n,d=2)=>Number.isFinite(n)?n.toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d}):'—';
const safe=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const METRIC={score:['J-NEST','skor 0–100'],IDI:['IDI – industri','skor 0–100'],SEC:['SEC – sosial ekonomi','skor 0–100'],ESP:['ESP – vegetasi–termal','skor 0–100'],ndvi:['NDVI','indeks asli'],ndbi:['NDBI','indeks asli'],lst:['Suhu permukaan lahan','°C'],ntl:['Cahaya malam','nilai rata-rata']};
function v(r,metric){const field=PANEL_MODEL.FIELDS.find(f=>f.id===metric);return field?r[field.field]:r[metric];}
function renderKpis(){const a=PANEL_MODEL.report;
  get('audit-kpis').innerHTML=`<div class="audit-kpi"><span>REKAMAN LENGKAP</span><b>135 <small>/ 135</small></b><p>27 wilayah × lima tahun</p></div><div class="audit-kpi"><span>KUNCI GABUNGAN</span><b>135 <small>/ 135</small></b><p>Identitas BPS dan tahun cocok di tiga CSV</p></div><div class="audit-kpi"><span>SELISIH DATA SUMBER</span><b>${a.numericDiscrepanciesAcrossSourceFiles}</b><p>Antarkolom yang sama pada berkas terunggah</p></div><div class="audit-kpi"><span>IDI–ESP (PANEL)</span><b>${numeric(a.corrIDI_ESP,4)}</b><p>Asosiasi, bukan pengaruh kausal investasi</p></div>`;
}
function chart(){const r=region(ui.region);const data=PANEL_MODEL.years.map(year=>PANEL_MODEL.row(r.id,year));const metric=ui.metric,values=data.map(x=>v(x,metric));const low=Math.min(...values),hi=Math.max(...values),range=Math.max(0.00001,hi-low),padding=range*.25;
 const min=low-padding,max=hi+padding,width=670,height=255,margin={left:62,right:25,top:23,bottom:40};const plotW=width-margin.left-margin.right,plotH=height-margin.top-margin.bottom;
 const xp=i=>margin.left+i*plotW/4,yp=x=>margin.top+(max-x)/(max-min)*plotH;
 const grid=Array.from({length:5},(_,i)=>{const yy=margin.top+i*plotH/4,val=max-i*(max-min)/4;return `<line x1="${margin.left}" x2="${width-margin.right}" y1="${yy}" y2="${yy}" stroke="#e4eeec" stroke-width="1"/><text x="${margin.left-10}" y="${yy+4}" text-anchor="end" fill="#738d8b" font-size="11">${numeric(val,metric==='score'||['IDI','SEC','ESP'].includes(metric)?1:3)}</text>`;}).join('');
 const poly=values.map((x,i)=>`${xp(i)},${yp(x)}`).join(' ');const area=values.map((x,i)=>`${xp(i)},${yp(x)}`).join(' ')+` ${xp(4)},${margin.top+plotH} ${xp(0)},${margin.top+plotH}`;
 const circles=values.map((x,i)=>`<circle cx="${xp(i)}" cy="${yp(x)}" r="${data[i].year===ui.year?6:4}" fill="${data[i].year===ui.year?'#d3a656':'#197b7a'}" stroke="white" stroke-width="2"><title>${data[i].year}: ${numeric(x,4)}</title></circle><text x="${xp(i)}" y="${height-15}" font-size="12" text-anchor="middle" fill="#667f80">${data[i].year}</text>`).join('');
 get('audit-chart-title').textContent=`${METRIC[metric][0]} · ${r.name}`;
 get('audit-trend').innerHTML=`<svg class="audit-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Perubahan ${METRIC[metric][0]} di ${r.name} dari 2020 sampai 2024">${grid}<polygon points="${area}" fill="#c9e5dc" opacity=".45"/><polyline points="${poly}" fill="none" stroke="#197b7a" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>${circles}</svg><div class="audit-trend-label"><b>${METRIC[metric][0]}</b><span>${numeric(values[0],4)} (2020) → ${numeric(values[4],4)} (2024)</span><strong>${(values[4]-values[0])>0?'+':''}${numeric(values[4]-values[0],4)} <small>perubahan nilai, bukan estimasi dampak proyek</small></strong></div>`;
}
function breakdown(){const row=PANEL_MODEL.row(ui.region,ui.year);const info=PANEL_MODEL.FIELDS.map(f=>{
 const raw=row[f.field],norm=row.normalized[f.id],weight=PANEL_MODEL.weights[f.dimension][f.id],contrib=row.contribution[f.id];return `<div class="audit-feature"><div><span class="audit-feature-dim">${f.dimension}</span><b>${safe(f.name)}</b><small>${numeric(raw,4)} ${safe(f.unit)} · arah ${f.direction} ${f.transform==='ln'?'· ln':''}</small></div><div class="audit-feature-values"><div class="audit-feature-track"><i style="width:${norm*100}%"></i></div><b>${numeric(contrib,3)} <small>poin</small></b><small>z ${numeric(norm,3)} · w ${numeric(weight,4)}</small></div></div>`;
 }).join('');get('audit-breakdown-title').textContent=`${region(ui.region).name} · ${ui.year}`;
 get('audit-breakdown').innerHTML=`<div class="audit-score-header"><div><span>J-NEST ${ui.year}</span><strong>${numeric(row.score,3)}</strong><small>Peringkat ${row.rank}/27</small></div><div><span>IDI</span><b>${numeric(row.IDI,2)}</b><span>SEC</span><b>${numeric(row.SEC,2)}</b><span>ESP</span><b>${numeric(row.ESP,2)}</b></div></div><div class="audit-feature-list">${info}</div><div class="audit-feature-sum">Σ kontribusi delapan indikator = <b>${numeric(PANEL_MODEL.FIELDS.reduce((acc,f)=>acc+row.contribution[f.id],0),3)} / 100</b></div>`;
}
function table(){const rows=ui.allYears?PANEL_MODEL.rows.filter(r=>r.year>=2020):PANEL_MODEL.byYear[ui.year];const q=ui.query.toLowerCase().trim();const sub=rows.filter(r=>!q||region(r.regionId).name.toLowerCase().includes(q)||String(r.bps_domain).includes(q)).sort((a,b)=>b.year-a.year||a.rank-b.rank);
 get('audit-panel-body').innerHTML=sub.map(r=>`<tr class="${r.regionId===ui.region&&r.year===ui.year?'audit-selected':''}" data-audit-id="${r.regionId}" data-audit-year="${r.year}" tabindex="0" title="Lihat rincian ${safe(region(r.regionId).name)} ${r.year}"><td><b>${safe(region(r.regionId).name)}</b><small>${r.bps_domain}</small></td><td>${r.year}</td><td class="num">${numeric(r.score,2)}</td><td class="num">${numeric(r.IDI,1)}</td><td class="num">${numeric(r.SEC,1)}</td><td class="num">${numeric(r.ESP,1)}</td><td class="num">${r.rank}/27</td><td class="num">${numeric(r.ndvi_mean,3)}</td><td class="num">${numeric(r.ndbi_mean,3)}</td><td class="num">${numeric(r.lst_mean_c,2)}</td></tr>`).join('');get('audit-panel-caption').textContent=`Menampilkan ${sub.length} dari ${ui.allYears?'135':'27'} baris. Klik satu baris untuk meninjau delapan indikator, skor, dan tren. Urutan berdasarkan tahun dan peringkat tahunan.`;
}
function checks(){const m=PANEL_MODEL,a=m.report;const yes=(condition)=>condition?'<span class="audit-check-ok">Sesuai</span>':'<span class="audit-check-warning">Perlu periksa</span>';
 const q=[
 ['Gabungan sumber','135 dari 135 kunci cocok; tidak ada perbedaan kolom numerik yang sama dalam tiga CSV.',a.oneToOneMatches===135&&a.numericDiscrepanciesAcrossSourceFiles===0],
 ['Bobot CRITIC','Deviasi maksimum terhadap bobot enam desimal paper: '+numeric(a.maxWeightDifference,9)+'.',a.weightsWithinPaperTolerance],
 ['Asosiasi IDI–ESP','Hasil '+numeric(a.corrIDI_ESP,6)+' · paper −0,80924.',Math.abs(a.corrIDI_ESP+0.80924)<0.00001],
 ['Rebana tujuh resmi','Rerata '+numeric(a.rebanaAverage,4)+' · rentang '+numeric(a.rebanaRange[0],3)+'–'+numeric(a.rebanaRange[1],3)+' (basis provinsi).',Math.abs(a.rebanaAverage-44.69)<.01],
 ['Aritmetika vs geometrik','Spearman '+numeric(a.arithmeticGeometric.spearman,6)+' · pergeseran rata-rata '+numeric(a.arithmeticGeometric.meanShift,4)+' · maksimum '+a.arithmeticGeometric.maxShift+'.',a.arithmeticGeometric.maxShift===11&&Math.abs(a.arithmeticGeometric.spearman-.797314)<.00001],
 ['SEC tanpa penduduk','Spearman '+numeric(a.scenarioChecks.noPopulation.spearman,3)+' · geser rata-rata '+numeric(a.scenarioChecks.noPopulation.meanShift,2)+' · maks '+a.scenarioChecks.noPopulation.maxShift+'.',a.scenarioChecks.noPopulation.maxShift===6],
 ['ESP hanya NDVI / hanya LST','Spearman '+numeric(a.scenarioChecks.ndviOnly.spearman,3)+' / '+numeric(a.scenarioChecks.lstOnly.spearman,3)+' · penghitungan indikator tunggal memakai bobot 1.',a.scenarioChecks.ndviOnly.maxShift===10&&a.scenarioChecks.lstOnly.maxShift===4]
 ];get('audit-checks').innerHTML='<div class="audit-check-list">'+q.map(row=>`<div><div><b>${safe(row[0])}</b><p>${safe(row[1])}</p></div>${yes(row[2])}</div>`).join('')+'</div><p class="audit-check-foot">Untuk PDRB dan jumlah penduduk digunakan log natural. Nilai indikator diubah min–maks bersama, simpangan baku menggunakan pembagi N=135, CRITIC dihitung per dimensi. Kolom pertumbuhan industri tahun 2020 kosong pada 27 wilayah karena tidak ada tahun pembanding dalam ketiga CSV; kolom tersebut tidak termasuk delapan indikator indeks.</p>';
}
function redraw(){renderKpis();chart();breakdown();table();checks();}
function select(row,year){ui.region=row;ui.year=year;get('audit-region').value=String(row);get('audit-year').value=String(year);redraw();}
function init(){if(!get('page-data'))return;
 get('audit-region').innerHTML=REGIONS.map(r=>`<option value="${r.id}">${safe(r.name)}</option>`).join('');get('audit-region').value=String(ui.region);
 get('audit-region').addEventListener('change',e=>select(Number(e.target.value),ui.year));
 get('audit-year').addEventListener('change',e=>select(ui.region,Number(e.target.value)));
 get('audit-metric').addEventListener('change',e=>{ui.metric=e.target.value;chart();});
 get('audit-all-years').addEventListener('change',e=>{ui.allYears=e.target.checked;table();});
 get('audit-search').addEventListener('input',e=>{ui.query=e.target.value;table();});
 get('audit-export-panel').addEventListener('click',exportScores);
 get('audit-panel-body').addEventListener('click',e=>{const r=e.target.closest('[data-audit-id]');if(r)select(Number(r.dataset.auditId),Number(r.dataset.auditYear));});
 get('audit-panel-body').addEventListener('keydown',e=>{const r=e.target.closest('[data-audit-id]');if(r&&(e.key==='Enter'||e.key===' ')){e.preventDefault();select(Number(r.dataset.auditId),Number(r.dataset.auditYear));}});
 redraw();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
