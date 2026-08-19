# Jyotish Oracle v1.2 — Accuracy Build

Personal Vedic astrology + I Ching decision intelligence.

## What changed in v1.2

- Birth time is now explicitly **provisional**, not presented as verified.
- Working time is ~02:00 with an initial 01:30–02:30 uncertainty window.
- New **Accuracy** workspace.
- Clear **time-stable** vs **time-sensitive** labels.
- AI prompt is forbidden from presenting exact Ascendant, house, D9/D10 or varga-sensitive conclusions as certain while the birth time is estimated.
- Rectification event-entry UI added as groundwork.
- Existing three-coin I Ching engine preserved.
- I Ching casts now include method, line-order and timestamp metadata.
- Next.js bumped from 16.0.0 to 16.0.10 to move off the vulnerable build line.
- No Qabalah layer in this release.

## Run

```bash
npm install
cp .env.example .env.local
# add OPENAI_API_KEY to .env.local
npm run dev
```

## Deploy to Vercel

Upload/replace the repo contents, ensure `OPENAI_API_KEY` exists in Vercel Environment Variables, then redeploy.

## Next accuracy milestone

Replace the stored working natal snapshot with a deterministic ephemeris service that recalculates:
- D1 / exact Lagna and houses
- D9 Navamsha
- D10 Dashamsha
- MD / AD / PD boundaries
- live gochara/transits
- candidate charts across an uncertainty window

When the exact birth time is confirmed, update the birth input and mark `timeStatus: 'confirmed'`, then regenerate all time-sensitive outputs.

## Product philosophy

Astrology and I Ching are reflective symbolic frameworks. They are not guaranteed predictions and should not replace evidence or qualified guidance for high-stakes decisions.
