/*
 * J-NEST reproducible index engine (panel 27 regions x 5 years).
 * Method: log-transformation, global pooled min-max, population-standard-deviation
 * CRITIC within each dimension, and equal-weight arithmetic aggregation.
 * Source: uploaded panel 2020-2024, paper equations 1-5 and Table 1.
 * NO project-impact or permit predictions are made here.
 */
const PANEL_MODEL = (() => {
  'use strict';
  const FIELDS = [
    {id:'pdrb',field:'manufacturing_grdp_adhk2010_billion_rupiah',name:'PDRB industri ADHK 2010',unit:'Rp miliar',direction:'+',transform:'ln',dimension:'IDI'},
    {id:'ndbi',field:'ndbi_mean',name:'NDBI',unit:'indeks',direction:'+',transform:'raw',dimension:'IDI'},
    {id:'ntl',field:'nightlight_mean',name:'Cahaya malam',unit:'rata-rata',direction:'+',transform:'raw',dimension:'IDI'},
    {id:'pop',field:'population_total_persons',name:'Jumlah penduduk',unit:'jiwa',direction:'+',transform:'ln',dimension:'SEC'},
    {id:'poor',field:'poverty_rate_percent',name:'Kemiskinan',unit:'%',direction:'-',transform:'raw',dimension:'SEC'},
    {id:'tpt',field:'open_unemployment_rate_percent',name:'TPT',unit:'%',direction:'-',transform:'raw',dimension:'SEC'},
    {id:'ndvi',field:'ndvi_mean',name:'NDVI',unit:'indeks',direction:'+',transform:'raw',dimension:'ESP'},
    {id:'lst',field:'lst_mean_c',name:'Suhu permukaan lahan (LST)',unit:'°C',direction:'-',transform:'raw',dimension:'ESP'}
  ];
  const DIMENSIONS={IDI:['pdrb','ndbi','ntl'],SEC:['pop','poor','tpt'],ESP:['ndvi','lst']};
  const CODE_BY_ID=REGIONS.map((r,i)=>({id:r.id,code:String(i<18?3201+i:3271+i-18)}));
  const codeToId=new Map(CODE_BY_ID.map(x=>[x.code,x.id]));
  const iByName=Object.fromEntries(PANEL_DATA.columns.map((x,i)=>[x,i]));
  const raw=PANEL_DATA.rows.map(arr=>{
    const r={};PANEL_DATA.columns.forEach((name,i)=>{r[name]=arr[i]});
    r.code=String(r.bps_domain);r.regionId=codeToId.get(r.code);
    if(!r.regionId || !Number.isInteger(r.year))throw Error('Kode wilayah/tahun tidak dikenal pada panel.');
    r.feature={};r.normalized={};r.contribution={};
    FIELDS.forEach(f=>{
      const v=Number(r[f.field]);if(!Number.isFinite(v)||f.transform==='ln'&&v<=0)throw Error('Indikator inti invalid: '+f.field+' '+r.code+'/'+r.year);
      r.feature[f.id]=f.transform==='ln'?Math.log(v):v;
    });
    return r;
  });
  if(raw.length!==135)throw Error('Panel harus mencakup tepat 135 baris.');
  const mins={};
  FIELDS.forEach(f=>{
    const vals=raw.map(r=>r.feature[f.id]);const min=Math.min(...vals),max=Math.max(...vals);
    if(!(max>min))throw Error('Rentang indikator tidak positif: '+f.id);
    mins[f.id]={min,max,rawMin:Math.min(...raw.map(r=>r[f.field])),rawMax:Math.max(...raw.map(r=>r[f.field]))};
    raw.forEach(r=>{const v=r.feature[f.id],z=(f.direction==='+')?(v-min)/(max-min):(max-v)/(max-min);r.normalized[f.id]=z;});
  });
  const mean=(a)=>a.reduce((s,v)=>s+v,0)/a.length;
  const sd=(a)=>{const m=mean(a);return Math.sqrt(mean(a.map(v=>(v-m)**2)))};
  const corr=(xs,ys)=>{
    const mx=mean(xs),my=mean(ys);const sx=sd(xs),sy=sd(ys);
    if(sx===0||sy===0)return null;
    return mean(xs.map((x,i)=>(x-mx)*(ys[i]-my)))/(sx*sy);
  };
  const weightedCritic=(fields)=>{
    if(fields.length===1)return {[fields[0]]:1};
    const v=fields.map(k=>raw.map(r=>r.normalized[k]));
    const ss=v.map(sd);
    const info=v.map((arr,i)=>ss[i]*v.reduce((s,arr2,j)=>s+(1-corr(arr,arr2)),0));
    const total=info.reduce((s,x)=>s+x,0);
    if(total<=0)throw Error('Informasi CRITIC nol.');
    return Object.fromEntries(fields.map((k,i)=>[k,info[i]/total]));
  };
  const weights=Object.fromEntries(Object.entries(DIMENSIONS).map(([d,keys])=>[d,weightedCritic(keys)]));
  const dimensionsFor=(r,sections=DIMENSIONS)=>Object.fromEntries(Object.entries(sections).map(([d,keys])=>{
    const useWeight=keys.join('|')===DIMENSIONS[d].join('|')?weights[d]:weightedCritic(keys);
    return[d,100*keys.reduce((acc,k)=>acc+r.normalized[k]*useWeight[k],0)];
  }));
  raw.forEach(r=>{
    r.dimensions=dimensionsFor(r);
    r.IDI=r.dimensions.IDI;r.SEC=r.dimensions.SEC;r.ESP=r.dimensions.ESP;
    r.score=(r.IDI+r.SEC+r.ESP)/3;
    r.geometric=Math.cbrt(Math.max(1e-6,r.IDI)*Math.max(1e-6,r.SEC)*Math.max(1e-6,r.ESP));
    for(const d of Object.keys(DIMENSIONS))for(const k of DIMENSIONS[d])r.contribution[k]=100*r.normalized[k]*weights[d][k]/3;
  });
  const byKey=new Map(raw.map(r=>[`${r.year}:${r.regionId}`,r]));
  if(byKey.size!==135)throw Error('Terdapat kunci wilayah–tahun ganda.');
  const years=[2020,2021,2022,2023,2024];
  const sorted=(entries,property='score')=>[...entries].sort((a,b)=>b[property]-a[property]||a.regionId-b.regionId);
  const byYear=Object.fromEntries(years.map(year=>{
    const arr=raw.filter(r=>r.year===year);
    if(arr.length!==27)throw Error('Panel tidak seimbang pada tahun '+year);
    sorted(arr).forEach((r,i)=>r.rank=i+1);
    sorted(arr,'geometric').forEach((r,i)=>r.geometricRank=i+1);
    return[year,sorted(arr)];
  }));
  const row=(regionId,year=2024)=>byKey.get(`${year}:${regionId}`)||null;
  const summary=({arr=byYear[2024],ranks=true}={})=>{
    const b=sorted(arr),n=b.length;
    const rankMap=new Map(b.map((r,i)=>[r.regionId,i+1]));
    const g=sorted(arr,'geometric');const rankG=new Map(g.map((r,i)=>[r.regionId,i+1]));
    const shifts=arr.map(r=>Math.abs(rankMap.get(r.regionId)-rankG.get(r.regionId)));
    return{meanShift:mean(shifts),maxShift:Math.max(...shifts),spearman:1-6*arr.reduce((s,r)=>s+(rankMap.get(r.regionId)-rankG.get(r.regionId))**2,0)/(n*(n*n-1))};
  };
  const sensitivityConfig={noPopulation:{SEC:['poor','tpt']},ndviOnly:{ESP:['ndvi']},lstOnly:{ESP:['lst']}};
  const scenario=(key)=>{
    const change=sensitivityConfig[key];if(!change)throw Error('Skenario tidak dikenal');
    const dims={...DIMENSIONS,...change};const scores=raw.filter(r=>r.year===2024).map(r=>{
      const d=dimensionsFor(r,dims);return {regionId:r.regionId,score:(d.IDI+d.SEC+d.ESP)/3,IDI:d.IDI,SEC:d.SEC,ESP:d.ESP};
    });
    const rankList=sorted(scores);const rank=new Map(rankList.map((r,i)=>[r.regionId,i+1]));
    const changes=scores.map(r=>Math.abs(rank.get(r.regionId)-row(r.regionId,2024).rank));
    const a=scores.map(r=>r.score),b=scores.map(r=>row(r.regionId,2024).score);
    const diffs=scores.map(r=>rank.get(r.regionId)-row(r.regionId,2024).rank);
    const n=27;return{key,weights:Object.fromEntries(Object.entries(dims).map(([d,keys])=>[d,keys.join('|')===DIMENSIONS[d].join('|')?weights[d]:weightedCritic(keys)])),meanShift:mean(changes),maxShift:Math.max(...changes),spearman:1-6*diffs.reduce((s,x)=>s+x*x,0)/(n*(n*n-1)),rows:scores.map(r=>({...r,rank:rank.get(r.regionId)}))};
  };
  const coefficient=(()=>{
    const ids=['IDI','SEC','ESP'];const all={};for(const a of ids)for(const b of ids){all[`${a}_${b}`]=corr(raw.map(r=>r[a]),raw.map(r=>r[b]));}return all;
  })();
  const rebanaIds=new Set([8,9,10,11,12,13,22]);const rebana2024=raw.filter(r=>r.year===2024&&rebanaIds.has(r.regionId)).map(r=>r.score);
  const reference={weights:{IDI:{pdrb:0.468390,ndbi:0.297534,ntl:0.234076},SEC:{pop:0.333472,poor:0.353220,tpt:0.313308},ESP:{ndvi:0.562511,lst:0.437489}},corrIDI_ESP:-0.80924,rebanaAverage:44.69,maxRankShift:11};
  const maxWeightDifference=Math.max(...Object.keys(reference.weights).flatMap(d=>Object.keys(reference.weights[d]).map(k=>Math.abs(weights[d][k]-reference.weights[d][k]))));
  const report={...PANEL_DATA.audit,weightsWithinPaperTolerance:maxWeightDifference<0.000001,maxWeightDifference,corrIDI_ESP:coefficient.IDI_ESP,rebanaAverage:mean(rebana2024),rebanaRange:[Math.min(...rebana2024),Math.max(...rebana2024)],arithmeticGeometric:summary(),scenarioChecks:{noPopulation:scenario('noPopulation'),ndviOnly:scenario('ndviOnly'),lstOnly:scenario('lstOnly')}};
  const whatIf=(year=2024,inputWeights={IDI:1/3,SEC:1/3,ESP:1/3},method='arithmetic')=>{
    const w=['IDI','SEC','ESP'].map(d=>Math.max(0,Number(inputWeights[d])||0));const total=w.reduce((s,x)=>s+x,0);
    if(total<=0)throw Error('Total bobot nol');
    const arr=byYear[year].map(r=>({regionId:r.regionId,name:REGIONS[r.regionId-1].name,baseRank:r.rank,IDI:r.IDI,SEC:r.SEC,ESP:r.ESP,score:method==='geometric'?Math.exp(['IDI','SEC','ESP'].reduce((s,d,i)=>s+(w[i]/total)*Math.log(Math.max(1e-6,r[d])),0)):['IDI','SEC','ESP'].reduce((s,d,i)=>s+r[d]*(w[i]/total),0)}));
    return sorted(arr).map((r,i)=>({...r,rank:i+1,shift:r.baseRank-(i+1)}));
  };
  return {FIELDS,DIMENSIONS,rows:raw,row,byYear,years,weights,coefficient,report,range:mins,scenario,whatIf,reference,source:PANEL_DATA.dataset};
})();
