# Jyotish Oracle v2 — Life Intelligence

Single-user private prototype. No login yet.

## New
- Seeded Life Profile from Nathan's corrected onboarding profile.
- Local browser memory using localStorage.
- Daily personalised field tied to real projects, goals, people and recent entries.
- Adaptive onboarding questions.
- Dream Diary: personal + Jungian/archetypal + spiritual/metaphysical + current-life resonance.
- Optional deliberate I Ching cast for dreams.
- People graph with birthday if known and relationship presence/theme.
- Decision history and comparisons.
- Projects, life timeline and quick journal.
- Exportable JSON profile backup.
- Birth-time uncertainty rules preserved.
- No login and no Qabalah.

## Important
All learned data is currently stored in the browser. Export your Life Profile JSON periodically. Before gifting to friends, move memory to an authenticated database with per-user isolation.

The Daily page does not yet calculate live transits. It uses the stored Mars/Rahu dasha context and life model and is instructed not to invent planetary movement.

## Run
```bash
npm install
cp .env.example .env.local
# add OPENAI_API_KEY
npm run dev
```

## Next
Deterministic ephemeris, D1/D9/D10, MD/AD/PD, live gochara, database persistence, outcome-learning, recurring dream-symbol detection, then login/profiles when ready to share.
