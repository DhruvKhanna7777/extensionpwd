import {PageEngine} from './engine';
import {defaults,validateSettings} from './settings';
// This file is bundled as an isolated-world IIFE. Repeated injection reuses this listener.
const scope=globalThis as typeof globalThis & {__ableverse?:boolean};
if(!scope.__ableverse) {
 scope.__ableverse=true;const engine=new PageEngine(document);let speaking=false;let route=location.href;let current={...defaults};
 const visibility=()=>{if(document.hidden)stop();};
 const escape=(e:KeyboardEvent)=>{if(e.key==='Escape')stop();};
 const stop=()=>{if(speaking){speechSynthesis.cancel();speaking=false;}document.removeEventListener('visibilitychange',visibility);document.removeEventListener('keydown',escape);};
 const observer=new MutationObserver(()=>{if(location.href!==route)restore();});
 const restore=()=>{observer.disconnect();stop();engine.restore();current={...defaults};window.removeEventListener('pagehide',restore);};
 const selection=()=>{
  const sel=getSelection();if(!sel||sel.isCollapsed)return '';
  const protectedSelector='input,textarea,select,button,code,pre,[contenteditable]:not([contenteditable="false"]),[aria-hidden="true"]';
  // Reject the entire range if it intersects protected content, including middle nodes.
  for(const el of document.querySelectorAll(protectedSelector))for(let i=0;i<sel.rangeCount;i++)if(sel.getRangeAt(i).intersectsNode(el))return '';
  const parent=sel.anchorNode?.parentElement;if(parent?.closest(protectedSelector))return '';
  return sel.toString().trim().slice(0,5000);
 };
 chrome.runtime.onMessage.addListener((msg,_sender,respond)=>{
  try {
   if(!msg||typeof msg.type!=='string')return;
   switch(msg.type){
    case 'GET_STATE':respond({ok:true,settings:current});break;
    case 'APPLY':{stop();observer.disconnect();current=validateSettings(msg.settings);const result=engine.apply(current);route=location.href;observer.observe(document,{childList:true,subtree:true});window.addEventListener('pagehide',restore);respond({ok:true,...result});break;}
    case 'RESTORE':restore();respond({ok:true});break;
    case 'READ':{
     const text=selection();if(!text){respond({ok:false,error:'Select up to 5,000 characters of page text first. Form fields and code are excluded.'});break;}
     if(!('speechSynthesis' in window)||!speechSynthesis.getVoices().length){respond({ok:false,error:'No browser speech voice is ready. Check your device speech settings, then retry.'});break;}
     stop();const utterance=new SpeechSynthesisUtterance(text);utterance.rate=validateSettings(msg.settings).rate;utterance.onend=utterance.onerror=()=>{speaking=false;document.removeEventListener('visibilitychange',visibility);document.removeEventListener('keydown',escape);};speaking=true;document.addEventListener('visibilitychange',visibility);document.addEventListener('keydown',escape);window.addEventListener('pagehide',restore);speechSynthesis.speak(utterance);respond({ok:true});break;
    }
    case 'PAUSE':if(speaking)speechSynthesis.paused?speechSynthesis.resume():speechSynthesis.pause();respond({ok:true});break;
    case 'STOP':stop();respond({ok:true});break;
   }
  }catch(error){respond({ok:false,error:error instanceof Error?error.message:'Page operation failed.'});}
 });
}
