import OpenAI from 'openai';
import { profile } from '../../../lib/profile';

function compactLife(state) {
  if(!state) return {};
  return {
    profile: state.profile,
    goals: state.goals,
    projects: state.projects,
    people: state.people,
    events: (state.events || []).slice(-30),
    patterns: (state.patterns || []).slice(-30),
    recentDreams: (state.dreams || []).slice(-8),
    recentDecisions: (state.decisions || []).slice(-10),
    recentJournal: (state.journal || []).slice(-10),
    questionsAnswered: (state.questionsAnswered || []).slice(-20)
  };
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ text:'AI interpretation is ready, but OPENAI_API_KEY is not configured yet.' });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const life = compactLife(body.lifeState);

    const instructions = `You are the intelligence layer of a private personal decision system combining Jyotish, I Ching, dream interpretation and longitudinal life-pattern analysis.

Do not convert interpretations into facts.
Challenge blind spots where supported by the user's history.
Practical evidence outranks astrology or divination in high-stakes matters.
Never secretly generate an I Ching cast; only interpret a supplied cast.
For dreams, use personal association first, then archetypal/Jungian, then spiritual/metaphysical, then current-life resonance.
Do not claim to know why a person was "sent" into the user's life.

Birth time is estimated around 02:00 with a working window of 01:30–02:30. Exact Ascendant, houses, D9/D10/vargas and fine angular timing are provisional.

WORKING CHART:
${JSON.stringify(profile)}

LIFE MODEL:
${JSON.stringify(life)}`;

    let input = '';
    if(body.mode === 'daily') {
      input = `Create today's personalised field report tied to the user's real projects, goals and people. Do not invent live transits. Use the stored dasha context only. Structure: TODAY'S FIELD, PROJECTS, RELATIONSHIPS / PEOPLE, INNER WEATHER, WHAT TO PRIORITISE, WHAT TO WATCH, ONE QUESTION FOR TODAY.`;
    } else if(body.mode === 'dream') {
      input = `Analyse this dream: ${body.question || ''}. Break down people, places, objects, actions and emotion. Then give personal associations, archetypal/Jungian layer, spiritual/metaphysical layer, current-life resonance, and clarifying questions. I Ching cast if provided: ${JSON.stringify(body.cast || null)}.`;
    } else if(body.mode === 'person') {
      input = `Analyse this relationship in context: ${body.question || ''}. Distinguish facts from inferred patterns. Do not invent synastry when birthday data is missing.`;
    } else if(body.mode === 'compare') {
      input = `Decision: ${body.question || ''}. Options: ${JSON.stringify(body.options || [])}. I Ching cast: ${JSON.stringify(body.cast || null)}. Compare practical reality, life patterns, stored Jyotish context and supplied cast. Give a recommendation and confidence.`;
    } else {
      input = `Question: ${body.question || ''}. I Ching cast: ${JSON.stringify(body.cast || null)}. Answer using the user's life model, stored Jyotish context and supplied cast if present. Include blind spots, historical patterns when supported, and a practical recommendation.`;
    }

    const response = await client.responses.create({
      model: 'gpt-5.6',
      instructions,
      input,
      store: false
    });

    return Response.json({ text: response.output_text });
  } catch (e) {
    return Response.json({ text:'Reading failed: ' + e.message }, { status:500 });
  }
}
