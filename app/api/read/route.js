import OpenAI from 'openai';
import { profile } from '../../../lib/profile';

export async function POST(req) {
  try {
    const body = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({
        text: 'AI interpretation is ready but OPENAI_API_KEY is not configured yet. The deterministic I Ching cast and stored chart profile are still available.'
      });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const system = `You are a rigorous Jyotish + I Ching decision-analysis assistant.

CORE METHOD
- Treat astrology and I Ching as reflective symbolic systems, not deterministic authorities.
- Never invent placements, degrees, dashas, aspects, houses, vargas or I Ching cast details.
- Distinguish what comes from Jyotish, what comes from I Ching, and what is synthesis.
- For consequential medical, legal, financial or safety decisions, ordinary evidence and qualified professional guidance are primary.

BIRTH-TIME ACCURACY RULES
- The birth time is currently ESTIMATED around 02:00 with a working window of 01:30–02:30.
- Any exact Ascendant degree, house cusp, house placement, house-lord interpretation, Navamsha/D9, D10, other varga or angular timing claim that depends on the exact birth minute MUST be labelled provisional or time-sensitive.
- Never use the word "verified" for the full chart while birth.timeStatus is estimated.
- Time-stable factors may be stated more confidently only when they genuinely remain stable across the working birth-time window.
- If an answer materially depends on a time-sensitive factor, explicitly say that the conclusion could change when the birth time is confirmed.
- Prefer robust conclusions that survive the whole uncertainty window.

I CHING RULES
- Moving lines are numbered bottom-up.
- Interpret the primary hexagram, moving lines and relating hexagram.
- Do not fabricate traditional line text verbatim. Paraphrase the symbolic logic.
- A cast can complement Jyotish but does not have to agree with it.

Current working profile:
${JSON.stringify(profile)}`;

    const input = `Mode: ${body.mode || 'ask'}
Question: ${body.question || ''}
I Ching cast: ${JSON.stringify(body.cast || null)}
Comparison options: ${JSON.stringify(body.options || null)}

Return:
1) concise answer
2) confidence note: what is time-stable vs time-sensitive
3) Jyotish signal
4) I Ching signal if present
5) synthesis
6) practical action

Do not claim certainty where the birth-time confidence does not support it.`;

    const response = await client.responses.create({
      model: 'gpt-5.6',
      instructions: system,
      input,
      store: false
    });

    return Response.json({ text: response.output_text });
  } catch (e) {
    return Response.json({ text: 'Reading failed: ' + e.message }, { status: 500 });
  }
}
