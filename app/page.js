'use client';
import { useMemo, useState } from 'react';
import { profile, birthTimeLabel } from '../lib/profile';
import { castIChing, lineGlyph } from '../lib/iching';

function deg(d){
  const x=Math.floor(d);
  const m=Math.floor((d-x)*60);
  return `${x}°${String(m).padStart(2,'0')}′`;
}

function ConfidenceBadge({type}){
  return <span className={`confidence ${type==='stable'?'stable':'sensitive'}`}>
    {type==='stable'?'TIME-STABLE':'TIME-SENSITIVE'}
  </span>;
}

export default function Home(){
  const [tab,setTab]=useState('today');
  const [question,setQuestion]=useState('');
  const [cast,setCast]=useState(null);
  const [answer,setAnswer]=useState('');
  const [loading,setLoading]=useState(false);
  const [options,setOptions]=useState(['','','']);
  const [events,setEvents]=useState([
    {date:'',event:''},
    {date:'',event:''},
    {date:'',event:''}
  ]);
  const date = useMemo(()=>new Intl.DateTimeFormat('en-GB',{dateStyle:'full'}).format(new Date()),[]);

  async function ask(mode=tab, extraCast=cast){
    setLoading(true);
    setAnswer('');
    try {
      const r=await fetch('/api/read',{
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({
          mode,
          question,
          cast:extraCast,
          options:mode==='compare'?options.filter(Boolean):null
        })
      });
      const j=await r.json();
      setAnswer(j.text);
    } catch (e) {
      setAnswer(`Reading failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  function doCast(){
    const c=castIChing();
    setCast(c);
    setAnswer('');
  }

  const headings = {
    today:'Your current field',
    ask:'Ask your chart',
    iching:'Cast the I Ching',
    compare:'Compare decisions',
    chart:'Natal chart',
    accuracy:'Birth-time accuracy'
  };

  return <main>
    <aside>
      <div className="brand">JYOTISH<br/><span>ORACLE</span></div>
      {['today','ask','iching','compare','chart','accuracy'].map(x=>
        <button key={x} className={tab===x?'nav active':'nav'} onClick={()=>setTab(x)}>
          {x==='iching'?'Cast I Ching':x==='accuracy'?'Accuracy':x[0].toUpperCase()+x.slice(1)}
        </button>
      )}
      <div className="asideCard">
        <small>CURRENT PERIOD</small>
        <b>{profile.dasha.mahadasha} / {profile.dasha.antardasha}</b>
        <span>{profile.dasha.antardashaStart} → {profile.dasha.antardashaEnd}</span>
      </div>
      <div className="asideCard">
        <small>BIRTH TIME</small>
        <b>Provisional</b>
        <span>{birthTimeLabel()}</span>
      </div>
    </aside>

    <section className="content">
      <header>
        <div>
          <small>{date}</small>
          <h1>{headings[tab]}</h1>
        </div>
        <div className="pill">Lahiri · Sidereal · v1.2</div>
      </header>

      <div className="accuracyBanner">
        <div>
          <b>Birth time is currently estimated.</b>
          <span>Using {birthTimeLabel()}. House- and varga-sensitive claims are automatically treated as provisional.</span>
        </div>
        <button onClick={()=>setTab('accuracy')}>Review accuracy</button>
      </div>

      {tab==='today' && <>
        <div className="hero card">
          <div>
            <small>ACTIVE DASHA</small>
            <h2>Mars × Rahu</h2>
            <p>Use this as a timing lens, not an instruction. The system separates time-stable factors from anything that depends on your exact birth minute.</p>
          </div>
          <div className="orb">♂<span>☊</span></div>
        </div>

        <div className="grid3">
          <div className="card">
            <small>ASCENDANT</small>
            <div className="labelRow"><h3>Gemini {deg(profile.ascendant.degree)}</h3><ConfidenceBadge type="sensitive"/></div>
            <p>Reference value at 02:00 only. Do not treat exact Lagna degree or house-dependent readings as confirmed yet.</p>
          </div>
          <div className="card">
            <small>MOON</small>
            <div className="labelRow"><h3>Aries · Bharani</h3><ConfidenceBadge type="stable"/></div>
            <p>{deg(profile.moon.degree)} · Pada {profile.moon.pada}. This remains stable across the current birth-time window.</p>
          </div>
          <div className="card">
            <small>DECISION MODE</small>
            <h3>Evidence + Symbol</h3>
            <p>Jyotish provides context and timing; I Ching provides a fresh symbolic reading of the question. Neither replaces ordinary evidence.</p>
          </div>
        </div>

        <div className="question card">
          <small>QUICK QUESTION</small>
          <textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What am I trying to decide?"/>
          <button className="primary" onClick={()=>ask('ask')}>Read my current chart</button>
        </div>
      </>}

      {tab==='ask' && <div className="question card">
        <small>ASK JYOTISH</small>
        <h2>Make the question concrete.</h2>
        <p className="muted">The AI is instructed to flag any conclusion that relies on your provisional birth time.</p>
        <textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Should I continue releasing a song every week, change the cadence, or stop?"/>
        <div className="row">
          <button className="primary" onClick={()=>ask('ask')}>Analyse with Jyotish</button>
          <button onClick={()=>{const c=castIChing();setCast(c);ask('combined',c)}}>Add an I Ching cast</button>
        </div>
      </div>}

      {tab==='iching' && <div className="split">
        <div className="question card">
          <small>QUESTION</small>
          <h2>One situation. One cast.</h2>
          <textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What is the wise way to approach this decision?"/>
          <button className="primary" onClick={doCast}>Cast 3 coins × 6 lines</button>
          {cast && <button onClick={()=>ask('iching')}>Interpret this cast</button>}
        </div>

        <div className="card castCard">
          {!cast
            ? <div className="empty">Your six lines will appear here.<br/>Lines build from the bottom upward.</div>
            : <>
                <small>PRIMARY → RELATING</small>
                <h2>{cast.primary}. {cast.primaryName}</h2>
                <div className="hex">
                  {[...cast.lines].reverse().map((v,ri)=>{
                    const line=6-ri;
                    return <div className={(v===6||v===9)?'moving':''} key={line}>
                      <span>{line}</span>{lineGlyph(v)}<em>{v}</em>
                    </div>
                  })}
                </div>
                <p>Moving lines: {cast.moving.length?cast.moving.join(', '):'none'}</p>
                <h3>→ {cast.relating}. {cast.relatingName}</h3>
              </>
          }
        </div>
      </div>}

      {tab==='compare' && <div className="card question">
        <small>DECISION COMPARISON</small>
        <h2>Give the system the real alternatives.</h2>
        <textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What decision am I making?"/>
        {options.map((o,i)=>
          <input key={i} value={o} onChange={e=>setOptions(options.map((x,j)=>j===i?e.target.value:x))} placeholder={`Option ${String.fromCharCode(65+i)}`}/>
        )}
        <div className="row">
          <button className="primary" onClick={()=>ask('compare')}>Compare with Jyotish</button>
          <button onClick={()=>{const c=castIChing();setCast(c);ask('compare',c)}}>Compare + cast</button>
        </div>
      </div>}

      {tab==='chart' && <>
        <div className="card">
          <small>WORKING PROFILE</small>
          <h2>{profile.name}</h2>
          <p>{profile.birth.date} · {birthTimeLabel()} · {profile.birth.place} · {profile.birth.ayanamsa} ayanāṃśa</p>
        </div>

        <div className="planetGrid">
          {profile.planets.map(([p,s,d])=>
            <div className="planet card" key={p}>
              <small>{p}</small><b>{s}</b><span>{deg(d)}</span>
            </div>
          )}
        </div>

        <div className="card">
          <small>CALCULATION POLICY</small>
          <h3>Interpretation cannot outrank calculation confidence.</h3>
          <p>The current planetary snapshot is retained as the working reference, but exact Ascendant, houses and sensitive divisional-chart claims are provisional until your birth time is confirmed and the deterministic ephemeris layer recalculates them.</p>
        </div>
      </>}

      {tab==='accuracy' && <>
        <div className="card">
          <small>BIRTH-TIME STATUS</small>
          <h2>Estimated around {profile.birth.workingTime}</h2>
          <div className="statusGrid">
            <div><span>Working window</span><b>{profile.birth.earliestTime}–{profile.birth.latestTime}</b></div>
            <div><span>Source</span><b>Personal recollection</b></div>
            <div><span>Status</span><b className="amber">Awaiting confirmation</b></div>
          </div>
          <p>{profile.birth.timeSource}</p>
        </div>

        <div className="accuracyColumns">
          <div className="card">
            <small>SAFE TO USE NOW</small>
            <h3>Time-stable factors</h3>
            <ul>{profile.accuracyPolicy.stable.map(x=><li key={x}>{x}</li>)}</ul>
          </div>
          <div className="card">
            <small>PROVISIONAL</small>
            <h3>Time-sensitive factors</h3>
            <ul>{profile.accuracyPolicy.sensitive.map(x=><li key={x}>{x}</li>)}</ul>
          </div>
        </div>

        <div className="card">
          <small>RECTIFICATION WORKSPACE</small>
          <h2>Life-event anchors</h2>
          <p className="muted">Optional for now. If your confirmed time arrives, direct confirmation outranks rectification. These events can still be useful later for testing the chart.</p>
          {events.map((e,i)=><div className="eventRow" key={i}>
            <input type="date" value={e.date} onChange={ev=>setEvents(events.map((x,j)=>j===i?{...x,date:ev.target.value}:x))}/>
            <input value={e.event} onChange={ev=>setEvents(events.map((x,j)=>j===i?{...x,event:ev.target.value}:x))} placeholder="Major move, relationship, accident, launch, etc."/>
          </div>)}
          <button onClick={()=>setEvents([...events,{date:'',event:''}])}>Add event</button>
          <p className="tiny">Event storage is UI-only in v1.2. Persistence comes with the database layer.</p>
        </div>

        <div className="card">
          <small>WHEN THE EXACT TIME ARRIVES</small>
          <h3>One input changes; everything dependent on it recalculates.</h3>
          <p>Replace the provisional time, mark it as confirmed, then regenerate the Ascendant, houses, D9/D10 and all downstream confidence flags. The app is now structured for that handoff.</p>
        </div>
      </>}

      {(loading||answer) && <div className="answer card">
        <small>ORACLE SYNTHESIS</small>
        {loading?<p className="pulse">Reading the verified and provisional inputs separately…</p>:<div className="answerText">{answer}</div>}
      </div>}
    </section>
  </main>
}
