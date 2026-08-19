import OpenAI from 'openai';
import { profile } from '../../../lib/profile';

export async function POST(req) {
  try {
    const body = await req.json();
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({
        text: 'AI interpretation is ready but OPENAI_API_KEY is not configured yet. The deterministic chart and I Ching cast are still available.'
      });
    }
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const system = `You are a rigorous Jyotish + I Ching decision-analysis assistant. Treat astrology and I Ching as reflective symbolic systems, not deterministic authorities. Never invent placements, degrees, dashas or cast details. Distinguish what comes from Jyotish, what comes from the I Ching, and what is synthesis. For consequential medical, legal, financial or safety decisions, explicitly advise using ordinary evidence and qualified professional guidance as primary.\n\nVerified natal profile:\n${JSON.stringify(profile)}\n\nWhen an I Ching cast is provided, moving lines are numbered bottom-up. Interpret the primary hexagram, moving lines, and relating hexagram. Do not fabricate traditional line text verbatim; paraphrase the pattern and explain the logic.`;
    const input = `Mode: ${body.mode || 'ask'}\nQuestion: ${body.question || ''}\nI Ching cast: ${JSON.stringify(body.cast || null)}\nComparison options: ${JSON.stringify(body.options || null)}\n\nReturn: 1) concise answer, 2) Jyotish signal, 3) I Ching signal if present, 4) synthesis, 5) practical action.`;
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
