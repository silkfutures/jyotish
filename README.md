# Jyotish Oracle v1

Personal Vedic astrology + I Ching decision intelligence.

## What works now
- Personalized Lahiri sidereal natal profile for Nathan.
- Current Vimshottari MD/AD displayed.
- 3-coin I Ching casting with moving lines and relating hexagram.
- Ask / compare / combined Jyotish + I Ching AI modes.
- OpenAI Responses API backend with `store: false`.

## Run
```bash
npm install
cp .env.example .env.local
# add OPENAI_API_KEY to .env.local
npm run dev
```

## Production accuracy upgrade
Replace `lib/profile.js` fixed chart data with a deterministic Swiss Ephemeris service. Persist: birth time, timezone, coordinates, ayanamsa, ephemeris version, house system, node choice, and calculation version. The LLM must only interpret verified calculation output.

## Safety / product philosophy
Astrology and I Ching are presented as reflective symbolic frameworks. The interface should not frame them as guaranteed predictions or a substitute for evidence and qualified advice in high-stakes decisions.
