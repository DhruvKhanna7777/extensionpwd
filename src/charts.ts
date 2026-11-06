const ns='http://www.w3.org/2000/svg';
let sequence=0;
export function enhanceCharts(doc:Document,undo:(()=>void)[]) {
 let charts=0;const warnings:string[]=[];
 for(const svg of doc.querySelectorAll<SVGSVGElement>('svg[data-av-chart="bar"]')) {
  const bars=[...svg.querySelectorAll<SVGRectElement>('rect[data-av-value]')];
  if(bars.some(bar=>bar.parentNode!==svg || bar.hasAttribute('transform') || !!bar.style.transform)){warnings.push('Chart cannot be enhanced reliably: transformed or grouped bars are unsupported.');continue;}
  const rows=bars.map(bar=>({bar,label:bar.getAttribute('data-av-label')?.trim(),raw:bar.getAttribute('data-av-value')??'',value:Number(bar.getAttribute('data-av-value')),x:Number(bar.getAttribute('x')),y:Number(bar.getAttribute('y')),width:Number(bar.getAttribute('width')),height:Number(bar.getAttribute('height'))}));
  if(!rows.length || rows.some(r=>!r.label || !r.raw.trim() || !Number.isFinite(r.value) || ![r.x,r.y,r.width,r.height].every(Number.isFinite) || r.width<=0 || r.height<0)) {warnings.push('Chart cannot be enhanced reliably: missing labels, values or geometry.');continue;}
  const owned=doc.createElementNS(ns,'g');owned.setAttribute('data-ableverse-owned','');owned.setAttribute('pointer-events','none');
  const defs=doc.createElementNS(ns,'defs');owned.append(defs);
  const table=doc.createElement('table');table.style.cssText='border-collapse:collapse;margin:16px 0;font:16px system-ui;color:#142339;background:white;max-width:100%;';table.setAttribute('data-ableverse-owned','');
  const caption=table.createCaption();caption.textContent=(svg.getAttribute('aria-label')||'Chart')+' — verified source data';
  const head=table.createTHead().insertRow();for(const title of ['Category','Value','Unit']){const th=doc.createElement('th');th.scope='col';th.textContent=title;head.append(th);}
  const body=table.createTBody();
  rows.forEach((r,i)=>{
   const id=`ableverse-pattern-${++sequence}`;const pattern=doc.createElementNS(ns,'pattern');pattern.id=id;pattern.setAttribute('width','8');pattern.setAttribute('height','8');pattern.setAttribute('patternUnits','userSpaceOnUse');
   const bg=doc.createElementNS(ns,'rect');bg.setAttribute('width','8');bg.setAttribute('height','8');bg.setAttribute('fill',['#dce9fb','#e0f4ed','#fff0cb','#f0e4fa'][i%4]);pattern.append(bg);
   const path=doc.createElementNS(ns,'path');path.setAttribute('d',i%2?'M0 0L8 8M-2 6L2 10M6 -2L10 2':'M0 8L8 0M-2 2L2 -2M6 10L10 6');path.setAttribute('stroke','#142339');path.setAttribute('stroke-width',String(1+i%3));pattern.append(path);defs.append(pattern);
   const old=r.bar.getAttribute('fill');const fill=`url(#${id})`;r.bar.setAttribute('fill',fill);undo.push(()=>{if(r.bar.getAttribute('fill')===fill)old===null?r.bar.removeAttribute('fill'):r.bar.setAttribute('fill',old);});
   const label=doc.createElementNS(ns,'text');label.setAttribute('x',String(r.x+r.width/2));label.setAttribute('y',String(Math.max(14,r.y-8)));label.setAttribute('text-anchor','middle');label.setAttribute('fill','#142339');label.setAttribute('stroke','white');label.setAttribute('stroke-width','3');label.setAttribute('paint-order','stroke');label.setAttribute('font-size','13');label.textContent=`${r.label}: ${r.raw}`;owned.append(label);
   const row=body.insertRow();const title=doc.createElement('th');title.scope='row';title.textContent=r.label!;row.append(title);row.insertCell().textContent=r.raw;row.insertCell().textContent=svg.getAttribute('data-av-unit')||'Not specified';
  });
  for(const cell of table.querySelectorAll('th,td'))(cell as HTMLElement).style.cssText='border:1px solid #9aacbc;padding:8px;text-align:left;overflow-wrap:anywhere;';
  svg.append(owned);svg.after(table);undo.push(()=>{owned.remove();table.remove();});charts++;
 }
 if(doc.querySelector('canvas,svg:not([data-av-chart="bar"])'))warnings.push('Other canvas or unrecognised SVG charts are unsupported and were left unchanged.');
 if(!charts&&!warnings.length)warnings.push('No supported annotated SVG bar charts found.');
 return {charts,warnings};
}
