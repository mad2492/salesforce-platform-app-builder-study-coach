# Builder Bench

Builder Bench is a personal study coach for the Salesforce Certified Platform App Builder exam. It turns exam preparation into short, interactive practice rounds and produces a compact study brief that can be pasted into Codex for follow-up coaching.

Study online at [mad2492.github.io/salesforce-platform-app-builder-study-coach](https://mad2492.github.io/salesforce-platform-app-builder-study-coach/).

## What it includes

- A 10-question readiness diagnostic weighted across the five current exam domains
- Focused practice by domain
- Adaptive rounds that prioritize weaker and untested areas
- Immediate answer explanations
- Browser-local progress and scoring
- A copyable study brief containing domain performance and recent missed topics
- Responsive desktop and mobile layouts
- An installable home-screen experience for iPhone, iPad, and Android

The included question bank contains 25 original scenario-based questions. It does not contain exam dumps or copied certification questions.

## Run locally

On Marina's Windows computer, double-click `Start Builder Bench.cmd` and keep its window open while studying.

For development:

```bash
pnpm install
pnpm run dev
```

Then open `http://localhost:3000/`.

## GitHub Pages

Every push to `main` automatically builds and publishes the static study coach through GitHub Pages. The online version uses the repository subpath configured in `vite.pages.config.ts`.

Progress is browser-local. A phone and a computer maintain separate scores unless their study briefs are brought back to Codex and combined manually.

### Add it to your phone

- **iPhone or iPad:** Open the live site in Safari, tap **Share**, choose **Add to Home Screen**, then tap **Add**.
- **Android:** Open the live site in Chrome, tap the browser menu, choose **Install app** or **Add to Home screen**, then confirm.

You can also tap **Add to Home Screen** in the app footer for device-specific guidance. The installed icon launches Builder Bench in its own app-style window.

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
