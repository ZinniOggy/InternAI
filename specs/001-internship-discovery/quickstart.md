# Quickstart: InternAI Internship Agent MVP

This guide validates the frontend-only demo. No backend, account, API key, database, or external runtime service is required.

## Prerequisites

- Node.js and npm supported by the selected Next.js release.
- Git checkout is on the existing `frontend` branch.
- Network access for initial package installation and build-time font acquisition; the running demo makes no external service calls.
- Repository root contains the existing Spec Kit documents. Preserve them while scaffolding; do not run `specify init`.

## Scaffold and Run

From the repository root, scaffold Next.js App Router with TypeScript, strict mode, Tailwind CSS, ESLint, and `src/`:

```powershell
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

If the scaffold prompts about existing files, preserve `.specify/`, `specs/`, `agent.md`, and `DESIGN.md`; do not overwrite or remove them. Keep app source at the repository root under `src/`.

Install Vitest and its TypeScript/test-environment dependencies, then expose a `test` script. Add Playwright only if the optional smoke-test time remains. Load Inter Variable with `next/font` as the open-source substitute explicitly permitted by DESIGN.md; set variable weights 460, 540, 600, and 700.

Run the application:

```powershell
npm run dev
```

Open `http://localhost:3000`.

## Automated Validation

```powershell
npm test -- --run
npm run build
```

Expected unit coverage:

- Fit-score tests verify deterministic results, 0–100 bounds, factor maxima of 50/20/20/10, sum-to-total, Strong/Good/Partial thresholds, matched/missing evidence, and source labels.
- Generator tests verify deterministic resume/cover-letter drafts, per-block provenance, and a non-interactive `Add to profile` placeholder for the UX Research listing's missing `User Research` fact.
- Application-state tests verify that an unapproved application cannot become Applied, only explicit approval can set Applied, `Don't apply` records Student Declined separately, and demo advancement never enters Applied.

## Manual Demo Validation

1. Open Dashboard. Confirm the read-only profile summary, top three ranked matches, application-state counts, primary `Discover internships` action, and stepper.
2. Open Discover. Filter by location/work mode, skill, and minimum fit; verify descending score order. Force an empty result and use `Clear filters`.
3. Open the UX Research Intern details. Confirm listing facts, four-factor fit breakdown, per-factor points, matched/missing items, fit band, and `Your profile` / `Listing` provenance.
4. Select Prepare application. Confirm the deterministic resume summary and cover-letter draft use only profile/listing facts, each block is labeled, and missing `User Research` appears as non-interactive `Add to profile` text.
5. Review both drafts. Verify no state becomes Applied before approval. Select `Approve & submit (simulated)` and confirm the UI says `Simulated — nothing was sent.` and the record appears in the tracker as Applied.
6. Repeat with `Don't apply`; confirm Student Declined is displayed separately and never as Rejected.
7. In Applications, select each seeded status and Student Declined outcome; confirm status grouping and the selected record's timestamped activity log. Use the clearly marked demo advancement control only on Applied-or-later records and confirm it cannot create Applied.
8. Save or prepare an application, navigate between routes, refresh, and confirm local state persists. Select `Reset demo` and confirm all seed data and initial state return.
9. At viewport widths 375px, 768px, and 1280px, confirm no horizontal scrolling, 8-step desktop stepper, compact `Step N of 8: <label>` at 375px, visible keyboard focus, readable contrast, and minimum 44px touch targets.
10. Confirm the application makes no runtime network requests to external services.

## Expected Outcome

The complete demo journey finishes in under three minutes with no dead ends. All seven application states have distinct labels; Student Declined is a separate outcome. `npm test -- --run` and `npm run build` pass. A Playwright happy-path smoke test is optional and is the first item dropped if the nine-hour budget is exceeded.
