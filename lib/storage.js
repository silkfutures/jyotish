import { seedLifeState } from './seed-profile';

const KEY='signal-life-state-v3';

export function loadState(){
  if(typeof window==='undefined') return seedLifeState;
  try{
    const raw=localStorage.getItem(KEY);
    if(!raw) return structuredClone(seedLifeState);
    const parsed=JSON.parse(raw);
    return {...structuredClone(seedLifeState),...parsed};
  }catch{
    return structuredClone(seedLifeState);
  }
}

export function saveState(state){
  if(typeof window!=='undefined') localStorage.setItem(KEY,JSON.stringify(state));
}

export function resetState(){
  if(typeof window!=='undefined') localStorage.removeItem(KEY);
}

export function exportState(state){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='signal-life-profile-v3.json';
  a.click();
  URL.revokeObjectURL(url);
}
