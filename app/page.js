'use client';
import { useMemo, useState } from 'react';
import { profile } from '../lib/profile';
import { castIChing, lineGlyph } from '../lib/iching';

function deg(d){ const x=Math.floor(d); const m=Math.floor((d-x)*60); return `${x}°${String(m).padStart(2,'0')}′`; }

export default function Home(){
  const [tab,setTab]=useState('today');
  const [question,setQuestion]=useState('');
  const [cast,setCast]=useState(null);
  const [answer,setAnswer]=useState('');
  const [loading,setLoading]=useState(false);
  const [options,setOptions]=useState(['','','']);
  const date = useMemo(()=>new Intl.DateTimeFormat('en-GB',{dateStyle:'full'}).format(new Date()),[]);

  async function ask(mode=tab, extraCast=cast){
    setLoading(true); setAnswer('');
    const r=await fetch('/api/read',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode,question,cast:extraCast,options:mode==='compare'?options.filter(Boolean):null})});
    const j=await r.json(); setAnswer(j.text); setLoading(false);
  }
  function doCast(){ const c=castIChing(); setCast(c); setAnswer(''); }

  return <main>
    <aside>
      <div className="brand">JYOTISH<br/><span>ORACLE</span></div>
      {['today','ask','iching','compare','chart'].map(x=><button key={x} className={tab===x?'nav active':'nav'} onClick={()=>setTab(x)}>{x==='iching'?'Cast I Ching':x[0].toUpperCase()+x.slice(1)}</button>)}
      <div className="asideCard"><small>CURRENT PERIOD</small><b>{profile.dasha.mahadasha} / {profile.dasha.antardasha}</b><span>{profile.dasha.antardashaStart} → {profile.dasha.antardashaEnd}</span></div>
      <div className="asideCard"><small>MOON</small><b>{profile.moon.sign} · {profile.moon.nakshatra}</b><span>{deg(profile.moon.degree)} · Pada {profile.moon.pada}</span></div>
    </aside>
    <section className="content">
      <header><div><small>{date}</small><h1>{tab==='today'?'Your current field':tab==='ask'?'Ask your chart':tab==='iching'?'Cast the I Ching':tab==='compare'?'Compare decisions':'Verified natal chart'}</h1></div><div className="pill">Lahiri · Sidereal</div></header>

      {tab==='today' && <>
        <div className="hero card"><div><small>ACTIVE DASHA</small><h2>Mars × Rahu</h2><p>High-drive, high-amplification territory. The useful question is not merely “can I push?” but “what deserves the force?”</p></div><div className="orb">♂<span>☊</span></div></div>
        <div className="grid3"><div className="card"><small>ASCENDANT</small><h3>Gemini {deg(profile.ascendant.degree)}</h3><p>Reference anchor for houses and functional lordship.</p></div><div className="card"><small>MOON</small><h3>Aries · Bharani</h3><p>Used for nakshatra timing and Vimshottari sequencing.</p></div><div className="card"><small>DECISION MODE</small><h3>Evidence + Symbol</h3><p>Use the oracle to surface timing, tensions and blind spots — not outsource agency.</p></div></div>
        <div className="question card"><small>QUICK QUESTION</small><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What am I trying to decide?"/><button className="primary" onClick={()=>ask('ask')}>Read my current chart</button></div>
      </>}

      {tab==='ask' && <div className="question card"><small>ASK JYOTISH</small><h2>Make the question concrete.</h2><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Should I continue releasing a song every week, change the cadence, or stop?"/><div className="row"><button className="primary" onClick={()=>ask('ask')}>Analyse with Jyotish</button><button onClick={()=>{const c=castIChing();setCast(c);ask('combined',c)}}>Add an I Ching cast</button></div></div>}

      {tab==='iching' && <div className="split">
        <div className="question card"><small>QUESTION</small><h2>One situation. One cast.</h2><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What is the wise way to approach this decision?"/><button className="primary" onClick={doCast}>Cast 3 coins × 6 lines</button>{cast && <button onClick={()=>ask('iching')}>Interpret this cast</button>}</div>
        <div className="card castCard">{!cast?<div className="empty">Your six lines will appear here.<br/>Lines build from the bottom upward.</div>:<><small>PRIMARY → RELATING</small><h2>{cast.primary}. {cast.primaryName}</h2><div className="hex">{[...cast.lines].reverse().map((v,ri)=>{const line=6-ri;return <div className={(v===6||v===9)?'moving':''} key={line}><span>{line}</span>{lineGlyph(v)}<em>{v}</em></div>})}</div><p>Moving lines: {cast.moving.length?cast.moving.join(', '):'none'}</p><h3>→ {cast.relating}. {cast.relatingName}</h3></>}</div>
      </div>}

      {tab==='compare' && <div className="card question"><small>DECISION COMPARISON</small><h2>Give the system the real alternatives.</h2><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What decision am I making?"/>{options.map((o,i)=><input key={i} value={o} onChange={e=>setOptions(options.map((x,j)=>j===i?e.target.value:x))} placeholder={`Option ${String.fromCharCode(65+i)}`}/>)}<div className="row"><button className="primary" onClick={()=>ask('compare')}>Compare with Jyotish</button><button onClick={()=>{const c=castIChing();setCast(c);ask('compare',c)}}>Compare + cast</button></div></div>}

      {tab==='chart' && <><div className="card"><small>VERIFIED PROFILE</small><h2>{profile.name}</h2><p>{profile.birth.local} · {profile.birth.place} · {profile.birth.ayanamsa} ayanāṃśa</p></div><div className="planetGrid">{profile.planets.map(([p,s,d])=><div className="planet card" key={p}><small>{p}</small><b>{s}</b><span>{deg(d)}</span></div>)}</div><div className="card"><small>CALCULATION POLICY</small><p>This build stores the verified natal result as data. Production should replace the fixed profile with a Swiss Ephemeris calculation service, persist the exact birth inputs, and version every calculation setting.</p></div></>}

      {(loading||answer) && <div className="answer card"><small>ORACLE SYNTHESIS</small>{loading?<p className="pulse">Reading the verified inputs…</p>:<div className="answerText">{answer}</div>}</div>}
    </section>
  </main>
}
