// @vitest-environment jsdom
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {defaults} from '../src/settings';
let handler:(m:unknown,s:unknown,r:(value:any)=>void)=>void;
let spoken:string[]=[];
beforeEach(async()=>{
 vi.resetModules();delete (globalThis as any).__ableverse;
 document.body.innerHTML='<main><p id="text">Original readable sentence.</p><input value="private"/><p contenteditable="true">Private draft</p></main>';
 spoken=[];
 vi.stubGlobal('chrome',{runtime:{onMessage:{addListener:(fn:typeof handler)=>{handler=fn;}}}});
 const synth={getVoices:()=>[{name:'test device voice'}],speak:(u:{text:string})=>spoken.push(u.text),cancel:()=>{},paused:false,pause:()=>{},resume:()=>{}};
 vi.stubGlobal('speechSynthesis',synth);Object.defineProperty(window,'speechSynthesis',{value:synth,configurable:true});
 vi.stubGlobal('SpeechSynthesisUtterance',class{rate=1;constructor(public text:string){}});
 await import('../src/content');
});
afterEach(()=>{request('RESTORE');});
function request(type:string,settings=defaults):any {let response:any;handler({type,settings},{},r=>response=r);return response;}
it('reports effective page settings and resets them on Restore',()=>{
 request('APPLY',{...defaults,reading:true,fontScale:130});expect(request('GET_STATE')?.settings.reading).toBe(true);
 request('RESTORE');expect(request('GET_STATE')?.settings).toEqual(defaults);expect(document.querySelector('[data-ableverse-prose]')).toBeNull();
});
it('speaks only explicitly selected prose and preserves source content',()=>{
 const p=document.querySelector('#text')!;const range=document.createRange();range.selectNodeContents(p);getSelection()!.removeAllRanges();getSelection()!.addRange(range);
 expect(request('READ')).toEqual({ok:true});expect(spoken).toEqual(['Original readable sentence.']);expect(p.textContent).toBe('Original readable sentence.');
});
it('refuses a selection spanning editable content',()=>{
 const range=document.createRange();range.selectNodeContents(document.querySelector('main')!);getSelection()!.removeAllRanges();getSelection()!.addRange(range);
 expect(request('READ').ok).toBe(false);expect(spoken).toEqual([]);
});
it('refuses empty selection without unsolicited speech',()=>{
 getSelection()!.removeAllRanges();expect(request('READ').ok).toBe(false);expect(spoken).toEqual([]);
});
