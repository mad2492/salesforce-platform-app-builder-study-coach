# Builder Bench

Builder Bench is a private, local study coach for the Salesforce Certified Platform App Builder exam. It turns exam preparation into short, interactive practice rounds and produces a compact study brief that can be pasted into Codex for follow-up coaching.

## What it includes

- A 10-question readiness diagnostic weighted across the five current exam domains
- Focused practice by domain
- Adaptive rounds that prioritize weaker and untested areas
- Immediate answer explanations
- Browser-local progress and scoring
- A copyable study brief containing domain performance and recent missed topics
- Responsive desktop and mobile layouts

The included question bank contains 25 original scenario-based questions. It does not contain exam dumps or copied certification questions.

## Run locally

On Marina's Windows computer, double-click `Start Builder Bench.cmd` and keep its window open while studying.

For development:

```bash
pnpm install
pnpm run dev
```

Then open `http://localhost:3000/`.

## Verify

```bash
pnpm test
```

The application uses browser storage only. Answers and scores stay on the device and are not uploaded.

## Project structure

- `app/StudyCoach.tsx` — quiz engine, scoring, adaptive selection, and study-brief export
- `app/questions.ts` — question bank and official exam-domain weights
- `app/globals.css` — visual system and responsive behavior
- `Start Builder Bench.cmd` — one-click Windows launcher

