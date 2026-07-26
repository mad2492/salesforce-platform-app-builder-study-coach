# Builder Bench project knowledge

## Repository and publication

- Repository: `mad2492/salesforce-platform-app-builder-study-coach` (public).
- Live app: `https://mad2492.github.io/salesforce-platform-app-builder-study-coach/`.
- GitHub Pages deploys from `main` through `.github/workflows/deploy-pages.yml`.
- Static Pages build: `pnpm run build:pages`; full verification: `pnpm test`.
- `pnpm-workspace.yaml` explicitly allows required dependency build scripts for pnpm 11. Do not remove it without replacing the CI policy safely.
- Use branches and PRs for feature work. Commit as `Marina Brillas <23558618+mad2492@users.noreply.github.com>`.

## App surfaces

- `app/StudyCoach.tsx`: quiz engine, local progress, adaptive selection, study-brief copy, phone installation, and GitHub check-in creation.
- `app/questions.ts`: `Question` type, domain weights, short names, and question bank.
- `app/globals.css`: visual system and responsive behavior.
- `tests/rendered-html.test.mjs`: rendered app, question-count, Pages, installability, and credential-safety checks.
- `web/` and `vite.pages.config.ts`: static GitHub Pages entry point and repository base path.

## Check-in contract

- Issue label: `study-check-in`.
- Expected author: `mad2492`.
- Machine marker: `<!-- builder-bench-check-in:v1 -->`.
- Check-ins are public and contain study performance only.
- The app opens a prefilled issue; GitHub publishes it only after the user selects **Submit new issue**.
- No GitHub token, AI key, or webhook credential belongs in browser code.
- Progress remains in browser `localStorage` and is separate on each device. GitHub issues are the cross-device review bridge.

## Current exam model in the app

The repository currently encodes these domains and weights:

- Salesforce Fundamentals: 23%
- Data Modeling and Management: 22%
- Business Logic and Process Automation: 28%
- User Interface: 17%
- App Deployment: 10%

These are repository facts, not a promise that Salesforce's current outline is unchanged. Verify the official Salesforce exam guide before changing weights or making current-outline claims.

## Product boundaries

- The bank contains original practice questions, not exam dumps or copied certification items.
- Overall accuracy is raw practice accuracy; it is not exam-weighted and does not predict a passing score.
- The 80% UI marker is a deliberately conservative practice target, not an official Salesforce threshold.
- Repeated attempts can reflect memorization. Favor fresh scenarios and concept transfer when judging readiness.
