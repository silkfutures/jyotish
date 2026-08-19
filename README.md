# SIGNAL — Jyotish Oracle v3

A private life-intelligence operating system.

## Product shift

v3 is designed around one idea: **the user should not have to think in app features**.

- **Today** = command centre
- **Ask** = universal entry point
- **Decision Lab** = structured decision intelligence
- **Dreams** = personal symbolic vocabulary
- **People** = relationship activation map
- **Patterns** = longitudinal hypotheses with confidence
- **Projects** = competing claims on attention
- **Life Map** = inspect/export the model underneath the intelligence

## Improvements over v2

- Answers appear exactly where the action happened.
- Visible in-place loading state.
- Auto-scrolls to the AI response.
- Daily briefing is actionable rather than generic.
- Decision Lab separates evidence, intuition and cost of waiting before symbolic analysis.
- Dream analysis follows Personal → Archetypal → Spiritual → Life resonance.
- People analysis explicitly avoids destiny claims and hidden-motive guessing.
- Adaptive questions continue building the life picture over time.
- Seeded with Nathan's current projects, people, goals and working patterns.
- Local browser persistence remains for the private prototype.
- Export profile JSON from Life Map.

## API

Set in Vercel:

```text
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.6
```

`OPENAI_MODEL` is optional; the server defaults to `gpt-5.6`.

## Important Jyotish limitation

This build still does **not** calculate live gochara or deterministic D1/D9/D10. It uses the stored broad Mars/Rahu period and explicitly forbids the model from inventing live transits.

The next astrology milestone should be a deterministic calculation service, not more prompt interpretation.

## Storage warning

This prototype stores learned data in `localStorage`. Export the Life Map JSON regularly. Multi-user sharing should not happen until storage is moved behind authenticated per-user isolation.
