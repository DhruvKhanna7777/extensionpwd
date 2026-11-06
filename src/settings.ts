export const defaults = {reading:false,fontFamily:'system-ui',fontScale:100,lineHeight:1.5,letterSpacing:0,wordSpacing:0,motion:false,focus:false,emphasis:false,calm:'default',chroma:false,rate:1};
export type Settings = typeof defaults;
export function validateSettings(raw:unknown):Settings {
 const s={...defaults}; if(!raw || typeof raw!=='object')return s;
 const r=raw as Record<string,unknown>;
 for(const k of ['reading','motion','focus','emphasis','chroma'] as const)if(typeof r[k]==='boolean')s[k]=r[k];
 const ranges={fontScale:[90,180],lineHeight:[1.35,2.2],letterSpacing:[0,.12],wordSpacing:[0,.25],rate:[.7,1.5]};
 for(const k of Object.keys(ranges) as (keyof typeof ranges)[]) {const v=r[k];if(typeof v==='number' && Number.isFinite(v))s[k]=Math.min(ranges[k][1],Math.max(ranges[k][0],v));}
 if(['system-ui','Arial','Georgia','Verdana'].includes(String(r.fontFamily)))s.fontFamily=String(r.fontFamily);
 if(['default','warm','dark','contrast'].includes(String(r.calm)))s.calm=String(r.calm);
 return s;
}
