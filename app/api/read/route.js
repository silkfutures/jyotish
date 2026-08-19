import OpenAI from 'openai';
import { chartProfile } from '../../../lib/profile';

function compactLife(state){
  if(!state) return {};
  return {
    profile:state.profile,
    goals:state.goals,
    projects:state.projects,
    people:state.people,
    events:(state.events||[]).slice(-40),
    patterns:(state.patterns||[]).slice(-30),
    dreams:(state.dreams||[]).slice(-10),
    decisions:(state.decisions||[]).slice(-12),
    journal:(state.journal||[]).slice(-15),
    dailyReports:(state.dailyReports||[]).slice(-7),
    questionsAnswered:(state.questionsAnswered||[]).slice(-20)
  };
}

export async function POST(req){
  try{
    const body=await req.json();
    if(!process.env.OPENAI_API_KEY){
      return Response.json({text:'The intelligence layer is online, but OPENAI_API_KEY is not configured in this deployment.'},{status:503});
    }

    const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
    const model=process.env.OPENAI_MODEL || 'gpt-5.6';
    const life=compactLife(body.lifeState);

    const instructions=`You are SIGNAL, the intelligence layer of a private life operating system.

The user wants unusually deep, useful analysis. They prefer clear recommendations, challenge, blind-spot detection, historical comparison and meaningful symbolism. Do not flatter. Do not merely mirror their question back.

EPISTEMIC RULES
- Keep FACT, GOAL, BELIEF, INTERPRETATION, PATTERN/HYPOTHESIS and SYMBOLIC SIGNAL conceptually separate.
- Never turn an interpretation into a biographical fact.
- Do not claim another person was destined, sent, karmically assigned or objectively present for a specific purpose.
- Symbolic frameworks can surface hypotheses. Practical evidence remains primary for consequential business, money, medical, legal and safety decisions.
- Detect repeated questioning and possible confirmation-seeking where the supplied history supports it.
- When there are multiple plausible interpretations, name the tension rather than forcing certainty.

JYOTISH ACCURACY
- Birth time is estimated around 02:00 in a working window of 01:30–02:30.
- Exact Ascendant, houses, house-lord claims, D9/D10/vargas and fine angular timing are provisional.
- The app does not yet supply live planetary transits. Never invent them.
- The current Mars/Rahu dasha may be used as broad context only.

I CHING
- Never create a cast yourself. Interpret only a cast supplied in the request.
- Moving lines are bottom-up.
- Paraphrase symbolic/traditional logic rather than inventing quotations.

DREAMS
Use four layers:
1. personal association / actual biography,
2. archetypal or Jungian structure,
3. spiritual / metaphysical symbolism,
4. resonance with current projects, people, decisions and earlier dreams.
Treat interpretations as hypotheses. Identify the emotional movement of the dream, not only object meanings.

PEOPLE
Analyse what the relationship appears to activate in the user, based on known interactions and patterns. Do not psychologise or diagnose the other person from limited data.

LIFE MODEL:
${JSON.stringify(life)}

WORKING JYOTISH PROFILE:
${JSON.stringify(chartProfile)}`;

    let input='';
    const context=body.context || 'whole life';

    switch(body.mode){
      case 'daily':
        input=`Generate a highly personal daily command-centre briefing using the life model and broad Mars/Rahu dasha context. There are no live transits supplied. Use this structure exactly:

FIELD — one paragraph naming the central tension/opportunity today.
FOCUS 3 — three concrete priorities, each tied to a real project or life area.
DON'T FEED — the behaviour, loop or distraction most worth refusing today.
PEOPLE — only if a known relationship is materially relevant; otherwise say "No relationship signal needs forcing today."
INNER WEATHER — what may be psychologically or spiritually active.
ONE MOVE — the single action that would make today feel aligned by tonight.
QUESTION — one genuinely high-information question the user should answer.

Avoid generic horoscope language.`;
        break;
      case 'decision':
        input=`Decision: ${body.question||''}
Options: ${JSON.stringify(body.options||[])}
Evidence supplied by user: ${body.evidence||''}
Gut / intuition supplied by user: ${body.intuition||''}
Cost of waiting supplied by user: ${body.waitCost||''}
I Ching cast: ${JSON.stringify(body.cast||null)}

Return:
READ
REALITY
PATTERN MATCH
JYOTISH CONTEXT
I CHING (only if supplied)
BLIND SPOT
RECOMMENDATION
CONFIDENCE (0-100 with one-line explanation)
NEXT TEST — one practical experiment or piece of evidence that could improve the decision.`;
        break;
      case 'dream':
        input=`Dream title: ${body.title||''}
Dream: ${body.question||''}
Emotion on waking: ${body.emotion||''}
I Ching cast: ${JSON.stringify(body.cast||null)}

Return:
MOVEMENT — describe what psychologically happens across the dream.
ELEMENTS — break down every important person, place, object and action separately.
PERSONAL LAYER
ARCHETYPAL LAYER
SPIRITUAL / METAPHYSICAL LAYER
CURRENT-LIFE RESONANCE
RECURRING SIGNALS — compare with stored dreams only if supported.
I CHING — only if supplied.
WORKING INTERPRETATION — a concise synthesis framed as hypothesis.
WHAT TO NOTICE — 2-3 things to watch in waking life.
QUESTION — one question that would materially sharpen the reading.`;
        break;
      case 'person':
        input=`Person / relationship query: ${body.question||''}
Focus context: ${context}
Return:
WHAT IS KNOWN
WHAT THIS RELATIONSHIP APPEARS TO ACTIVATE IN YOU
CURRENT ROLE / PHASE
TENSION
GIFT
BOUNDARY OR QUESTION
TIMING CONTEXT — only broad dasha/life timing; do not invent transits or destiny.
ONE QUESTION TO ASK YOURSELF`;
        break;
      case 'pattern':
        input=`Audit the supplied life model for meaningful recurring patterns relevant to: ${body.question||'the user right now'}.
Prioritise patterns that are evidenced across more than one domain or date.
Return 3-6 patterns with:
PATTERN
EVIDENCE
POSSIBLE MISREAD
WHAT CHANGES IF TRUE
CONFIDENCE`;
        break;
      default:
        input=`User question: ${body.question||''}
Context lens: ${context}
I Ching cast: ${JSON.stringify(body.cast||null)}

Give a direct answer first. Then:
WHY
WHAT YOUR HISTORY ADDS
WHAT YOU MAY NOT BE SEEING
JYOTISH CONTEXT
I CHING only if supplied
RECOMMENDATION
ONE QUESTION worth answering next.`;
    }

    const response=await client.responses.create({
      model,
      instructions,
      input,
      store:false
    });

    return Response.json({text:response.output_text,model});
  }catch(e){
    console.error('SIGNAL /api/read failed',e);
    return Response.json({text:`Reading failed: ${e.message}`},{status:500});
  }
}
