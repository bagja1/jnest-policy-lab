/* Zero-dependency, offline, client-side A4 PDF writer.
   No network requests or AI-generated unverifiable claims are involved. */
(function(){
'use strict';
const PAGE_W=595.28,PAGE_H=841.89,MARGIN=45,MAX_W=PAGE_W-2*MARGIN;
const P={ink:[0.12,0.25,0.26],deep:[0.08,0.23,0.25],teal:[0.10,0.43,0.40],pale:[0.92,0.96,0.94],line:[0.85,0.90,0.87],grey:[0.38,0.48,0.47],gold:[0.73,0.52,0.28],white:[1,1,1],sand:[0.99,0.97,0.92],red:[0.62,0.33,0.28]};
function ascii(s){return String(s??'').replace(/\u00a0/g,' ').replace(/[\u2013\u2014\u2212]/g,'-').replace(/[\u2022\u00b7]/g,'-').replace(/\u2265/g,' >= ').replace(/\u2264/g,' <= ').replace(/\u2260/g,' != ').replace(/\u00b3/g,'3').replace(/\u00b2/g,'2').replace(/\u00b0/g,' derajat ').replace(/\u2192/g,' ke ').replace(/\u2194/g,' dan ').replace(/\u03c3/g,'sigma').replace(/\u03a3/g,'jumlah ').replace(/\u03b5/g,'epsilon').replace(/\u00d7/g,'x').replace(/\u221a/g,'akar ').replace(/\u2026/g,'...').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/\u00b1/g,'+/-').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7E]/g,'?');}
function escPdf(s){return ascii(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');}
function cmdcolor(c){return c.map(n=>Number(n).toFixed(3)).join(' ');}
class Writer{
 constructor(){this.pages=[];this.y=0;this.ctx=document.createElement('canvas').getContext('2d');this.newPage();}
 push(x){this.pages[this.pages.length-1].push(x);}
 rect(x,y,w,h,color){this.push(`${cmdcolor(color)} rg ${x.toFixed(2)} ${(PAGE_H-y-h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`);}
 line(x1,y1,x2,y2,color=P.line,width=0.7){this.push(`${cmdcolor(color)} RG ${width} w ${x1.toFixed(2)} ${(PAGE_H-y1).toFixed(2)} m ${x2.toFixed(2)} ${(PAGE_H-y2).toFixed(2)} l S`);}
 text(str,x,y,size=10,bold=false,color=P.ink){const font=bold?'F2':'F1';const content=escPdf(str);this.push(`BT /${font} ${size} Tf ${cmdcolor(color)} rg 1 0 0 1 ${x.toFixed(2)} ${(PAGE_H-y-size).toFixed(2)} Tm (${content}) Tj ET`);}
 measure(str,size=10,bold=false){this.ctx.font=`${bold?'700':'400'} ${size}px Arial`;return this.ctx.measureText(ascii(str)).width;}
 wrap(text,width,size=10,bold=false){const para=ascii(text).replace(/\s+/g,' ').trim();if(!para)return[''];const words=para.split(' '),out=[];let line='';for(const w of words){const t=line?line+' '+w:w;if(this.measure(t,size,bold) <=width*.97){line=t;continue;}if(line){out.push(line);line='';}if(this.measure(w,size,bold)<=width*.97){line=w;continue;}let partial='';for(const ch of w){if(partial&&this.measure(partial+ch,size,bold)>width*.97){out.push(partial);partial=ch;}else partial+=ch;}line=partial;}if(line)out.push(line);return out;}
 newPage(){this.pages.push([]);this.y=66;const page=this.pages.length;if(page>1){this.rect(0,0,PAGE_W,37,P.deep);this.text('J-NEST  /  LAPORAN SIMULASI KEBIJAKAN',MARGIN,13,9,true,P.white);this.text('DRAF PENELITIAN',PAGE_W-MARGIN-99,13,8,false,[.83,.92,.88]);this.line(MARGIN,PAGE_H-46,PAGE_W-MARGIN,PAGE_H-46,P.line,.6);this.text('Kerangka J-NEST-SKK | Bukan keputusan/izin pemerintah',MARGIN,PAGE_H-39,7,false,P.grey);}}
 ensure(h){if(this.y+h>PAGE_H-68)this.newPage();}
 gap(v=9){this.y+=v;}
 heading(text){this.ensure(46);this.gap(11);this.text(ascii(text),MARGIN,this.y,15,true,P.deep);this.y+=26;this.line(MARGIN,this.y,PAGE_W-MARGIN,this.y,P.line,.7);this.y+=13;}
 subheading(text){this.ensure(35);this.gap(7);this.text(text,MARGIN,this.y,11.2,true,P.teal);this.y+=20;}
 paragraph(text,opts={}){const size=opts.size||9.7,lh=opts.lh||15.7,x=opts.x||MARGIN,indent=opts.indent||0,w=(opts.width||MAX_W)-indent,lines=this.wrap(text,w,size,!!opts.bold);for(const l of lines){this.ensure(lh+5);this.text(l,x+indent,this.y,size,!!opts.bold,opts.color||P.ink);this.y+=lh;}this.gap(opts.after??5.5);}
 bullet(text){this.ensure(18);this.rect(MARGIN+3,this.y+5,4.4,4.4,P.teal);this.paragraph(text,{x:MARGIN+14,width:MAX_W-14,after:2.5,size:9.5,lh:15.2});}
 notice(text){const lines=this.wrap(text,MAX_W-28,9.3);const height=lines.length*15+21;this.ensure(height+13);const y0=this.y;this.rect(MARGIN,y0,MAX_W,height,P.sand);this.rect(MARGIN,y0,3,height,P.gold);lines.forEach((l,i)=>this.text(l,MARGIN+13,y0+10+i*15,9.3,false,P.ink));this.y+=height+14;}
 metrics(items){this.ensure(82);const n=Math.min(items.length,4),gap=8,w=(MAX_W-gap*(n-1))/n,y=this.y;items.slice(0,n).forEach((it,i)=>{const x=MARGIN+i*(w+gap);this.rect(x,y,w,70,i===0?P.deep:P.pale);this.text(ascii(it.label).slice(0,31),x+11,y+8,7.4,true,i===0?P.white:P.grey);let value=ascii(it.value);while(this.measure(value,20,true)>w-18&&value.length>4)value=value.slice(0,-2)+'..';this.text(value,x+11,y+24,19.5,true,i===0?P.white:P.deep);});this.y+=83;}
 table(headers,rows,widths){const widthsActual=widths?widths.map(v=>v*MAX_W/widths.reduce((a,b)=>a+b,0)):headers.map(()=>MAX_W/headers.length);const headerLines=headers.map((h,i)=>this.wrap(h,widthsActual[i]-16,8.2,true)),hH=Math.max(26,...headerLines.map(x=>x.length*11.5+15));
 const header=()=>{this.ensure(hH+20);this.rect(MARGIN,this.y,MAX_W,hH,P.deep);let xx=MARGIN;headers.forEach((h,i)=>{headerLines[i].forEach((l,j)=>this.text(l,xx+8,this.y+7+j*11.5,8.2,true,P.white));xx+=widthsActual[i];});this.y+=hH;};header();
 for(let ri=0;ri<rows.length;ri++){const cells=rows[ri].map((value,i)=>this.wrap(String(value===undefined||value===null?'Belum tersedia':value),widthsActual[i]-16,8.4));const h=Math.max(25,...cells.map(lines=>lines.length*13.1+12));if(this.y+h>PAGE_H-68){this.newPage();header();}if(ri%2===0)this.rect(MARGIN,this.y,MAX_W,h,[.966,.982,.975]);let xx=MARGIN;cells.forEach((lines,i)=>{lines.forEach((line,j)=>this.text(line,xx+8,this.y+5+j*13.1,8.4,false,P.ink));xx+=widthsActual[i];});this.line(MARGIN,this.y+h,PAGE_W-MARGIN,this.y+h,P.line,.48);this.y+=h;}
 this.y+=12;
 }
 cover(report){this.pages[0]=[];this.rect(0,0,PAGE_W,295,P.deep);this.rect(0,285,PAGE_W,10,P.teal);this.rect(MARGIN,40,55,55,[.89,.95,.83]);this.text('J',MARGIN+18,45,37,true,P.deep);this.text('J-NEST',MARGIN+68,48,18,true,P.white);this.text('POLICY SIMULATION LAB  /  V5.0',MARGIN+68,72,9,false,[.74,.87,.82]);this.text('LAPORAN ANALISIS DAN REKOMENDASI KEBIJAKAN',MARGIN,128,11,true,[.78,.93,.84]);
 const titleLines=this.wrap(report.title,MAX_W-3,23,true).slice(0,3);titleLines.forEach((s,i)=>this.text(s,MARGIN,156+i*29,23,true,P.white));
 this.text('DRAF PROTOTIPE  |  BUKAN PERSETUJUAN INVESTASI',MARGIN,265,8.8,true,[.96,.82,.60]);
 this.y=327;
 this.paragraph('Berdasarkan penghitungan panel J-NEST 27 kabupaten/kota periode 2020-2024, perbandingan alternatif rancangan, pemeriksaan G0-G4, dan orientasi Siksakandang Karesian.',{size:11,lh:18,after:22});
 this.metrics([{label:'WILAYAH OPSI FOKUS',value:report.regionShort||'Jawa Barat'},{label:'TAHUN PANEL',value:String(report.year)},{label:'SKOR J-NEST',value:report.score},{label:'DOKUMEN',value:'SIMULASI'}]);
 this.gap(17);this.subheading('Identitas laporan');const meta=[['Nama skenario',report.title],['Wilayah opsi fokus',report.region],['Tahun panel',String(report.year)],['Tanggal pembuatan',report.generatedAt],['Status pemeriksaan',report.status]];this.table(['Informasi','Nilai'],meta,[140,365]);
 this.notice('DOKUMEN UJI KEBIJAKAN. Data teritorial adalah hasil penelitian retrospektif. Parameter proyek, pernyataan ketersediaan dokumen dan pemeriksaan hukum merupakan masukan pengguna yang belum diverifikasi oleh instansi berwenang. Skor J-NEST tidak menentukan izin atau kompensasi ekologis.');
 this.newPage();
 }
 blocks(items){for(const item of items){if(item.kind==='heading')this.heading(item.text);else if(item.kind==='subheading')this.subheading(item.text);else if(item.kind==='paragraph')this.paragraph(item.text);else if(item.kind==='bullet')this.bullet(item.text);else if(item.kind==='notice')this.notice(item.text);else if(item.kind==='table')this.table(item.headers,item.rows,item.widths);else if(item.kind==='metrics')this.metrics(item.items);else if(item.kind==='gap')this.gap(item.height||12);}}
 finalize(){const total=this.pages.length;for(let p=0;p<total;p++)this.pages[p].push(`BT /F1 8 Tf ${cmdcolor(P.grey)} rg 1 0 0 1 ${(PAGE_W-105).toFixed(1)} ${(PAGE_H-(PAGE_H-40)-8).toFixed(1)} Tm (${p+1} / ${total}) Tj ET`);
 const objects=[null],add=o=>(objects.push(o),objects.length-1);const font1=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');const font2=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');const streamIDs=[],pageIDs=[];
 for(const page of this.pages){const content=page.join('\n')+'\n';const stream=add(`<< /Length ${content.length} >>\nstream\n${content}endstream`);streamIDs.push(stream);pageIDs.push(add(''));}
 const tree=add(`<< /Type /Pages /Count ${pageIDs.length} /Kids [${pageIDs.map(x=>`${x} 0 R`).join(' ')}] >>`);
 pageIDs.forEach((id,i)=>{objects[id]=`<< /Type /Page /Parent ${tree} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> /Contents ${streamIDs[i]} 0 R >>`;});
 const catalog=add(`<< /Type /Catalog /Pages ${tree} 0 R >>`);const info=add('<< /Title (J-NEST Policy Simulator - Rekomendasi Kebijakan) /Author (J-NEST Policy Lab - Prototype) /Subject (Analisis J-NEST-SKK berbasis panel teritorial dan telaah G0-G4) >>');
 let doc='%PDF-1.4\n%J-NEST\n';const offsets=[0];for(let i=1;i<objects.length;i++){offsets[i]=doc.length;doc+=`${i} 0 obj\n${objects[i]}\nendobj\n`;}const startxref=doc.length;doc+=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;for(let i=1;i<objects.length;i++)doc+=`${String(offsets[i]).padStart(10,'0')} 00000 n \n`;doc+=`trailer\n<< /Size ${objects.length} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${startxref}\n%%EOF`;return new Blob([new TextEncoder().encode(doc)],{type:'application/pdf'});}
}
function render(report){if(!report||!Array.isArray(report.blocks))throw Error('Rancangan laporan PDF tidak lengkap.');const writer=new Writer();writer.cover(report);writer.blocks(report.blocks);return writer.finalize();}
function download(report,filename){const blob=render(report),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename||'jnest-rekomendasi-kebijakan.pdf';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);return {blob,pages:0};}
window.JNestPDF={render,download};
})();
