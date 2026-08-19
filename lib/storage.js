import { seedLifeState } from './seed-profile';
const KEY='jyotish-life-state-v2';
export function loadState(){if(typeof window==='undefined')return seedLifeState;try{const raw=localStorage.getItem(KEY);return raw?{...structuredClone(seedLifeState),...JSON.parse(raw)}:structuredClone(seedLifeState)}catch{return structuredClone(seedLifeState)}}
export function saveState(state){if(typeof window!=='undefined')localStorage.setItem(KEY,JSON.stringify(state))}
export function resetState(){if(typeof window!=='undefined')localStorage.removeItem(KEY)}
export function exportState(state){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='jyotish-life-profile.json';a.click();URL.revokeObjectURL(url)}
