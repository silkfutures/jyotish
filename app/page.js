'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { chartProfile, birthTimeLabel } from '../lib/profile';
import { castIChing, lineGlyph } from '../lib/iching';
import { loadState, saveState, resetState, exportState } from '../lib/storage';
import { nextQuestion } from '../lib/questions';

const uid=(p='x')=>`${p}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const isoDay=()=>new Date().toISOString().slice(0,10);

const NAV=[
 ['today','Today','✦'],
 ['ask','Ask','⌁'],
 ['decide','Decision Lab','◇'],
 ['dreams','Dreams','☾'],
 ['people','People','◎'],
 ['patterns','Patterns','∿'],
 ['projects','Projects','▦'],
 ['life','Life Map','⌘']
];

function SignalAnswer({loading,text,errorRef}){
  if(!loading && !text) return null;
  return <div className="signalAnswer" ref={errorRef}>
    <div className="answerTop">
      <span className="liveDot"/><small>{loading?'SIGNAL IS READING':'SIGNAL'}</small>
    </div>
    {loading
      ? <div className="thinking"><i/><i/><i/><span>Looking across your life model…</span></div>
      : <div className="answerText">{text}</div>}
  </div>;
}

function Chip({children,active,onClick}){
  return <button className={`chip ${active?'chipActive':''}`} onClick={onClick}>{children}</button>;
}

function Meter({value}){
  return <div className="meter"><span style={{width:`${value}%`}}/></div>;
}

export default function Home(){
  const [state,setState]=useState(null);
  const [tab,setTab]=useState('today');
  const [question,setQuestion]=useState('');
  const [answer,setAnswer]=useState('');
  const [loading,setLoading]=useState(false);
  const [context,setContext]=useState('whole life');
  const [cast,setCast]=useState(null);
  const [options,setOptions]=useState(['','','']);
  const [evidence,setEvidence]=useState('');
  const [intuition,setIntuition]=useState('');
  const [waitCost,setWaitCost]=useState('');
  const [dream,setDream]=useState('');
  const [dreamTitle,setDreamTitle]=useState('');
  const [dreamEmotion,setDreamEmotion]=useState('');
  const [personId,setPersonId]=useState('');
  const [newPersonOpen,setNewPersonOpen]=useState(false);
  const [newPerson,setNewPerson]=useState({name:'',relationship:'',birthday:'',presence:'',tags:[]});
  const [capture,setCapture]=useState('');
  const [adaptiveAnswer,setAdaptiveAnswer]=useState('');
  const answerRef=useRef(null);

  const date=useMemo(()=>new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long'}).format(new Date()),[]);

  useEffect(()=>setState(loadState()),[]);
  useEffect(()=>{if(state)saveState(state)},[state]);
  useEffect(()=>{if((loading||answer)&&answerRef.current)answerRef.current.scrollIntoView({behavior:'smooth',block:'nearest'})},[loading,answer]);

  if(!state) return <main className="boot"><div className="sigil">✦</div><span>Opening your field…</span></main>;

  const aq=nextQuestion(state);
  const selected=state.people.find(p=>p.id===personId);
  const activeProjects=[...state.projects].sort((a,b)=>(b.weight||0)-(a.weight||0)).filter(p=>p.status!=='idea');
  const recentDream=state.dreams?.at(-1);
  const recentDecision=state.decisions?.at(-1);

  async function run(mode,payload={}){
    setLoading(true);setAnswer('');
    try{
      const r=await fetch('/api/read',{
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({
          mode,
          question:payload.question ?? question,
          context:payload.context ?? context,
          cast:payload.cast ?? null,
          options:payload.options ?? null,
          evidence:payload.evidence ?? '',
          intuition:payload.intuition ?? '',
          waitCost:payload.waitCost ?? '',
          title:payload.title ?? '',
          emotion:payload.emotion ?? '',
          lifeState:state
        })
      });
      const data=await r.json();
      const text=data.text || `No reading returned (${r.status}).`;
      setAnswer(text);
      return text;
    }catch(e){
      const text=`Reading failed: ${e.message}`;
      setAnswer(text);
      return text;
    }finally{
      setLoading(false);
    }
  }

  async function generateDaily(){
    const text=await run('daily');
    if(text && !text.startsWith('Reading failed')){
      setState(s=>({...s,dailyReports:[...(s.dailyReports||[]),{id:uid('daily'),date:isoDay(),text}].slice(-14)}));
    }
  }

  function deliberateCast(){
    const c=castIChing();
    setCast(c);
    setState(s=>({...s,memory:[...(s.memory||[]),{id:uid('signal'),type:'symbolic_signal',createdAt:new Date().toISOString(),text:`I Ching ${c.primary} ${c.primaryName}${c.moving.length?` lines ${c.moving.join(',')}`:''} → ${c.relating} ${c.relatingName}`}] }));
    return c;
  }

  async function analyseDream(withCast=false){
    if(!dream.trim()) return;
    const c=withCast?deliberateCast():null;
    const text=await run('dream',{question:dream,title:dreamTitle,emotion:dreamEmotion,cast:c});
    setState(s=>({...s,dreams:[...(s.dreams||[]),{
      id:uid('dream'),date:isoDay(),title:dreamTitle||'Untitled dream',text:dream,emotion:dreamEmotion,cast:c,analysis:text
    }]}));
    setDream('');setDreamTitle('');setDreamEmotion('');
  }

  async function analyseDecision(withCast=false){
    if(!question.trim()) return;
    const c=withCast?deliberateCast():null;
    const opts=options.filter(Boolean);
    const text=await run('decision',{question,options:opts,evidence,intuition,waitCost,cast:c});
    setState(s=>({...s,decisions:[...(s.decisions||[]),{
      id:uid('decision'),date:isoDay(),question,options:opts,evidence,intuition,waitCost,cast:c,reading:text,outcome:''
    }]}));
  }

  function quickCapture(){
    if(!capture.trim()) return;
    setState(s=>({...s,journal:[...(s.journal||[]),{id:uid('j'),date:isoDay(),text:capture}]}));
    setCapture('');
  }

  function answerAdaptive(){
    if(!aq||!adaptiveAnswer.trim()) return;
    setState(s=>({...s,
      questionsAnswered:[...(s.questionsAnswered||[]),{id:aq.id,question:aq.question,answer:adaptiveAnswer,area:aq.area,date:isoDay()}],
      memory:[...(s.memory||[]),{id:uid('memory'),type:'user_answer',createdAt:new Date().toISOString(),text:`${aq.question} — ${adaptiveAnswer}`}]
    }));
    setAdaptiveAnswer('');
  }

  function addPerson(){
    if(!newPerson.name.trim())return;
    setState(s=>({...s,people:[...s.people,{...newPerson,id:uid('person'),active:true}]}));
    setNewPerson({name:'',relationship:'',birthday:'',presence:'',tags:[]});
    setNewPersonOpen(false);
  }

  function navigate(id){
    setTab(id);setAnswer('');setLoading(false);
    window.scrollTo({top:0,behavior:'smooth'});
  }

  return <main className="shell">
    <aside className="rail">
      <div className="logo"><span>✦</span><div><b>SIGNAL</b><small>LIFE INTELLIGENCE</small></div></div>
      <nav>
        {NAV.map(([id,label,icon])=><button key={id} className={tab===id?'navItem navActive':'navItem'} onClick={()=>navigate(id)}><span>{icon}</span>{label}</button>)}
      </nav>
      <div className="railBottom">
        <div className="period"><small>CURRENT PERIOD</small><b>Mars × Rahu</b><span>Broad dasha context</span></div>
        <button className="avatarBtn" onClick={()=>navigate('life')}><span>NM</span><div><b>Nathan</b><small>{state.people.length} people · {state.projects.length} projects</small></div></button>
      </div>
    </aside>

    <section className="main">
      {tab==='today' && <>
        <div className="topbar"><div><small>{date.toUpperCase()}</small><h1>What matters now?</h1></div><div className="statusPill"><span/>Life model active</div></div>

        <div className="commandGrid">
          <section className="fieldCard">
            <div className="fieldGlow"/>
            <div className="eyebrow"><span>✦</span> YOUR FIELD</div>
            <h2>{state.profile.northStar}</h2>
            <p>Today is not another horoscope. Signal reads your current life structure, recent history and broad Jyotish period, then tells you where your attention has the most leverage.</p>
            <div className="buttonRow">
              <button className="cta" onClick={generateDaily} disabled={loading}>{loading?'Reading your field…':'Read today’s field'} <span>→</span></button>
              <button className="ghost" onClick={()=>navigate('ask')}>Ask something</button>
            </div>
            <SignalAnswer loading={loading} text={answer} errorRef={answerRef}/>
          </section>

          <aside className="sideSignal">
            <div className="miniCard">
              <div className="miniHead"><small>FOCUS MAP</small><span>{activeProjects.length} active</span></div>
              {activeProjects.slice(0,4).map((p,i)=><div className="focusRow" key={p.id}><span className="rank">{i+1}</span><div><b>{p.name}</b><small>{p.next}</small></div><em>{p.weight}/10</em></div>)}
            </div>
            <div className="miniCard">
              <small>YOUR OPERATING TENSION</small>
              <h3>Meaning × capacity</h3>
              <p>You rarely lack meaningful directions. The recurring problem is deciding which meaning deserves your finite force.</p>
            </div>
          </aside>
        </div>

        <div className="pulseGrid">
          <div className="panel">
            <div className="panelHead"><div><small>PATTERN RADAR</small><h3>What keeps repeating</h3></div><button onClick={()=>navigate('patterns')}>See all →</button></div>
            {state.patterns.slice(0,3).map(p=><div className="patternRow" key={p.id}><div className="patternScore">{p.confidence}</div><div><b>{p.label}</b><p>{p.text}</p><Meter value={p.confidence}/></div></div>)}
          </div>

          <div className="panel">
            <div className="panelHead"><div><small>PEOPLE IN YOUR FIELD</small><h3>Relationships carrying signal</h3></div><button onClick={()=>navigate('people')}>Open map →</button></div>
            <div className="peopleStrip">{state.people.filter(p=>p.active).slice(0,5).map(p=><button key={p.id} onClick={()=>{setPersonId(p.id);navigate('people')}}><span>{p.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</span><b>{p.name.split(' ')[0]}</b><small>{p.tags?.[0]||'relationship'}</small></button>)}</div>
            <div className="softNote">Signal interprets what a relationship appears to activate in you — not another person’s hidden motives or destiny.</div>
          </div>
        </div>

        <div className="lowerGrid">
          <div className="captureCard">
            <small>QUICK CAPTURE</small>
            <h3>What’s happening today?</h3>
            <textarea value={capture} onChange={e=>setCapture(e.target.value)} placeholder="A feeling, event, thought, win, tension, synchronicity…"/>
            <div className="buttonRow"><button className="smallCta" onClick={quickCapture}>Remember this</button><span className="micro">Builds your longitudinal life model.</span></div>
          </div>
          {aq && <div className="questionCard">
            <div className="eyebrow">SIGNAL WANTS TO KNOW</div>
            <h3>{aq.question}</h3>
            <p>{aq.reason}</p>
            <textarea value={adaptiveAnswer} onChange={e=>setAdaptiveAnswer(e.target.value)} placeholder="Answer naturally…"/>
            <button className="smallCta" onClick={answerAdaptive}>Teach Signal</button>
          </div>}
        </div>
      </>}

      {tab==='ask' && <>
        <div className="pageHead"><small>UNIVERSAL ENTRY POINT</small><h1>Ask anything.</h1><p>Signal answers from the whole picture rather than treating each question in isolation.</p></div>
        <div className="askSurface">
          <textarea autoFocus value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What am I not seeing about where I’m putting my energy right now?"/>
          <div className="contextBar"><span>Read through</span>{['whole life','business','music','relationships','spirituality'].map(x=><Chip key={x} active={context===x} onClick={()=>setContext(x)}>{x}</Chip>)}</div>
          <div className="askActions"><button className="cta" onClick={()=>run('ask')} disabled={loading}>{loading?'Reading…':'Ask Signal'} <span>→</span></button><button className="ghost" onClick={()=>{const c=deliberateCast();run('ask',{cast:c})}}>Ask + I Ching</button></div>
          <SignalAnswer loading={loading} text={answer} errorRef={answerRef}/>
        </div>
        <div className="promptGrid">
          {[
            ['ENERGY','What should I stop carrying right now?'],
            ['BUSINESS','Which project deserves the next 30 days?'],
            ['RELATIONSHIPS','What pattern am I repeating in who I let close?'],
            ['SPIRIT','Where am I using meaning to avoid reality?']
          ].map(([k,q])=><button key={q} onClick={()=>setQuestion(q)}><small>{k}</small><span>{q}</span></button>)}
        </div>
      </>}

      {tab==='decide' && <>
        <div className="pageHead"><small>DECISION LAB</small><h1>Separate signal from noise.</h1><p>Put reality, intuition, history, Jyotish and optional I Ching in the same room.</p></div>
        <div className="labGrid">
          <div className="labForm">
            <label>THE DECISION<textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Should I…"/></label>
            <label>OPTIONS<div className="optionStack">{options.map((o,i)=><input key={i} value={o} onChange={e=>setOptions(options.map((x,j)=>j===i?e.target.value:x))} placeholder={`Option ${String.fromCharCode(65+i)}`}/>)}</div></label>
            <div className="twoFields">
              <label>WHAT THE EVIDENCE SAYS<textarea value={evidence} onChange={e=>setEvidence(e.target.value)} placeholder="Facts, numbers, commitments, constraints…"/></label>
              <label>WHAT YOUR GUT SAYS<textarea value={intuition} onChange={e=>setIntuition(e.target.value)} placeholder="What do you already feel before asking?"/></label>
            </div>
            <label>COST OF WAITING<input value={waitCost} onChange={e=>setWaitCost(e.target.value)} placeholder="What happens if you do nothing for 30 days?"/></label>
            <div className="askActions"><button className="cta" onClick={()=>analyseDecision(false)} disabled={loading}>Run decision analysis →</button><button className="ghost" onClick={()=>analyseDecision(true)}>Add deliberate I Ching cast</button></div>
            <SignalAnswer loading={loading} text={answer} errorRef={answerRef}/>
          </div>
          <aside className="methodCard"><small>THE METHOD</small>{['Reality','Pattern match','Jyotish context','Symbolic signal','Blind spot','Recommendation'].map((x,i)=><div key={x}><span>0{i+1}</span><b>{x}</b></div>)}</aside>
        </div>
        {recentDecision && <div className="historyCard"><small>MOST RECENT DECISION</small><h3>{recentDecision.question}</h3><p>{recentDecision.options.join(' · ')}</p></div>}
      </>}

      {tab==='dreams' && <>
        <div className="pageHead"><small>DREAM INTELLIGENCE</small><h1>Your unconscious has a vocabulary.</h1><p>The aim is to learn yours — not impose a generic dream dictionary.</p></div>
        <div className="dreamGrid">
          <div className="dreamEntry">
            <input className="titleInput" value={dreamTitle} onChange={e=>setDreamTitle(e.target.value)} placeholder="Name this dream"/>
            <textarea value={dream} onChange={e=>setDream(e.target.value)} placeholder="Start wherever you remember. People, places, atmosphere, details that felt strangely important…"/>
            <input value={dreamEmotion} onChange={e=>setDreamEmotion(e.target.value)} placeholder="How did you feel on waking?"/>
            <div className="askActions"><button className="cta" onClick={()=>analyseDream(false)} disabled={loading}>Interpret dream →</button><button className="ghost" onClick={()=>analyseDream(true)}>Dream + I Ching</button></div>
            <SignalAnswer loading={loading} text={answer} errorRef={answerRef}/>
          </div>
          <aside className="dreamMethod">
            <div><span>01</span><b>Personal</b><p>What the image means in your actual biography.</p></div>
            <div><span>02</span><b>Archetypal</b><p>The deeper psychological movement.</p></div>
            <div><span>03</span><b>Spiritual</b><p>Metaphysical and religious symbolism as hypothesis.</p></div>
            <div><span>04</span><b>Life resonance</b><p>Where the dream touches projects, people and choices now.</p></div>
          </aside>
        </div>
        <div className="archiveHead"><h3>Dream archive</h3><span>{state.dreams.length} recorded</span></div>
        <div className="archiveGrid">{[...state.dreams].reverse().map(d=><article key={d.id} className="archiveCard"><small>{d.date}</small><h3>{d.title}</h3><p>{d.text}</p><button onClick={()=>{setAnswer(d.analysis);answerRef.current?.scrollIntoView({behavior:'smooth'})}}>Open interpretation →</button></article>)}</div>
      </>}

      {tab==='people' && <>
        <div className="pageHead rowBetween"><div><small>RELATIONSHIP MAP</small><h1>Who changes the field?</h1><p>Track what relationships actually activate in your life over time.</p></div><button className="cta compact" onClick={()=>setNewPersonOpen(!newPersonOpen)}>+ Add person</button></div>
        {newPersonOpen && <div className="newPerson">
          <input placeholder="Name" value={newPerson.name} onChange={e=>setNewPerson({...newPerson,name:e.target.value})}/>
          <input placeholder="Relationship" value={newPerson.relationship} onChange={e=>setNewPerson({...newPerson,relationship:e.target.value})}/>
          <input placeholder="Birthday if known" value={newPerson.birthday} onChange={e=>setNewPerson({...newPerson,birthday:e.target.value})}/>
          <textarea placeholder="What presence do they currently hold in your life?" value={newPerson.presence} onChange={e=>setNewPerson({...newPerson,presence:e.target.value})}/>
          <button className="smallCta" onClick={addPerson}>Save person</button>
        </div>}
        <div className="peopleLayout">
          <div className="peopleIndex">{state.people.map(p=><button key={p.id} className={personId===p.id?'personIndex activePersonIndex':'personIndex'} onClick={()=>{setPersonId(p.id);setAnswer('')}}><span>{p.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</span><div><b>{p.name}</b><small>{p.relationship}</small></div><em>{p.active?'NOW':'PAST'}</em></button>)}</div>
          <div className="personCanvas">
            {selected ? <>
              <div className="personHero"><span>{selected.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</span><div><small>{selected.active?'ACTIVE RELATIONSHIP':'PAST / INACTIVE'}</small><h2>{selected.name}</h2><p>{selected.relationship}</p></div></div>
              <div className="presence"><small>PRESENCE IN YOUR LIFE</small><p>{selected.presence}</p></div>
              <div className="tagRow">{selected.tags?.map(t=><span key={t}>{t}</span>)}</div>
              <textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder={`What are you trying to understand about ${selected.name}?`}/>
              <button className="cta" onClick={()=>run('person',{question:`${selected.name}: ${question}`})}>Read this relationship →</button>
              <SignalAnswer loading={loading} text={answer} errorRef={answerRef}/>
            </> : <div className="emptyState"><div>◎</div><h3>Select a person</h3><p>Signal will show the role, tension, gift and question this relationship appears to carry for you.</p></div>}
          </div>
        </div>
      </>}

      {tab==='patterns' && <>
        <div className="pageHead rowBetween"><div><small>LONGITUDINAL INTELLIGENCE</small><h1>Patterns, not labels.</h1><p>These are working hypotheses supported by your history — and they should be revised when reality disagrees.</p></div><button className="cta compact" onClick={()=>run('pattern',{question:'what matters most in my current life phase'})}>Run fresh audit</button></div>
        <SignalAnswer loading={loading} text={answer} errorRef={answerRef}/>
        <div className="patternCards">{state.patterns.map(p=><article key={p.id}><div className="patternCardTop"><div><small>{p.status}</small><h3>{p.label}</h3></div><b>{p.confidence}%</b></div><p>{p.text}</p><Meter value={p.confidence}/></article>)}</div>
      </>}

      {tab==='projects' && <>
        <div className="pageHead"><small>YOUR ACTIVE WORLDS</small><h1>Projects are claims on your life.</h1><p>Not everything meaningful deserves equal energy at the same time.</p></div>
        <div className="projectList">{[...state.projects].sort((a,b)=>b.weight-a.weight).map(p=><article key={p.id}><div className="projectRank">{p.weight}</div><div className="projectBody"><div className="projectMeta"><span>{p.status}</span><span>{p.signal}</span></div><h2>{p.name}</h2><p>{p.current}</p><div className="nextMove"><small>NEXT QUESTION / MOVE</small><b>{p.next}</b></div></div><div className="projectVision"><small>VISION</small><p>{p.vision}</p></div></article>)}</div>
      </>}

      {tab==='life' && <>
        <div className="pageHead rowBetween"><div><small>THE MODEL BEHIND SIGNAL</small><h1>Your life map.</h1><p>Facts, goals, people, events and hypotheses remain separate so the system does not slowly turn interpretation into biography.</p></div><div className="buttonRow"><button className="ghost" onClick={()=>exportState(state)}>Export profile</button><button className="dangerGhost" onClick={()=>{if(confirm('Reset all v3 learned data?')){resetState();location.reload()}}}>Reset</button></div></div>
        <div className="lifeSummary">
          <div><small>NORTH STAR</small><p>{state.profile.northStar}</p></div>
          <div><small>BIRTH-TIME CONFIDENCE</small><p>{birthTimeLabel()}</p><span>Exact houses and vargas remain provisional.</span></div>
        </div>
        <div className="lifeColumns">
          <section><div className="sectionTitle"><h3>Goals</h3><span>{state.goals.length}</span></div>{state.goals.map(g=><div className="lifeItem" key={g.id}><span>{g.area}</span><p>{g.text}</p></div>)}</section>
          <section><div className="sectionTitle"><h3>Timeline</h3><span>{state.events.length}</span></div>{[...state.events].sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,10).map((e,i)=><div className="timelineMini" key={i}><span>{e.date}</span><div><small>{e.category}</small><p>{e.title}</p></div></div>)}</section>
        </div>
        <div className="accuracyBand"><div><small>JYOTISH ACCURACY</small><h3>Useful now</h3>{chartProfile.accuracy.stable.map(x=><span key={x}>✓ {x}</span>)}</div><div><small>PROVISIONAL UNTIL EXACT TIME</small><h3>Handle carefully</h3>{chartProfile.accuracy.sensitive.map(x=><span key={x}>△ {x}</span>)}</div></div>
      </>}
    </section>
  </main>;
}
