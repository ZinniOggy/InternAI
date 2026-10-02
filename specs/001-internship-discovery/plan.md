# Implementation Plan: InternAI Internship Agent MVP

**Branch**: `frontend` | **Date**: 2026-10-02 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-internship-discovery/spec.md`

## Summary

Build a frontend-only, demo-ready internship assistant for a generic university student. Scaffold a Next.js App Router application at the repository root, then deliver the dashboard-to-tracker journey using typed mock fixtures, a deterministic explainable fit function, local draft generation, an approval-gated application transition, and browser-storage persistence. Complete the required experience within about nine working hours; do not add a backend or external service.

## Technical Context

**Language/Version**: TypeScript, strict mode; Node.js supported by the selected Next.js release.

**Primary Dependencies**: Next.js App Router, React, Tailwind CSS, `next/font` Inter Variable, Vitest. No UI kit or state library.

**Storage**: Typed fixture modules for seed data; browser `localStorage` for demo/application state only.

**Testing**: Vitest for fit scoring, generator truthfulness, and approval-gate transitions. `next build` for integration. One Playwright happy-path smoke test is optional if time remains.

**Target Platform**: Current desktop and mobile browsers; verify 375px, 768px, and 1280px widths.

**Project Type**: Single frontend web application scaffolded at the repository root with `src/`.

**Performance Goals**: Complete the specified Dashboard → Discover → Filter → Details → Fit Score → Prepare → Review → Tracker journey in under three minutes; all scoring and generation are local synchronous operations.

**Constraints**: About nine working hours; no external runtime requests, scraping, authentication, database, email, ML recommender, mentor backend, notifications, additional UI framework, or state library. Profile is read-only. The approval action is the only path to Applied. Use fictional listing company names. Keep one seed profile in fixtures; components and logic must not depend on a named student or a particular skill set. Dynamic route params are async in recent Next.js; use await params / use(params). Tests use relative imports.

**Scale/Scope**: One seed student profile, nine internship fixtures, a small application seed set covering seven application states plus a separate Student Declined outcome, five routes, and one responsive demo flow.

## Constitution Check

*GATE: Must pass before design and re-check after design.*

### Pre-Design Gate

- [x] **Human approval**: Only the explicit `Approve & submit (simulated)` transition can set Applied; state transition logic rejects any bypass. No external submission exists.
- [x] **Truthfulness and provenance**: Fit factors cite only profile/listing facts. Draft generation is deterministic and local, labels each content block, and renders missing facts as non-interactive `Add to profile` text.
- [x] **Design fidelity**: Centralize DESIGN.md tokens. Inter Variable is permitted by DESIGN.md as the open-source substitute for Super Sans VF; use variable weights 460/540/600/700 and retain the specified sizes, leading, spacing, radii, and color palette. Use the requested CSS radial indigo hero without a portrait asset; keep the white interior and single-action teal closing band.
- [x] **Demo-first scope**: Root-level Next.js app, typed fixtures behind thin services, localStorage only, no excluded backend/integration scope. Prioritize the end-to-end demo within the nine-hour budget.
- [x] **Observable actions**: Stepper exposes all eight steps (compact label on narrow screens); each application has a timestamped event log. Fit score is deterministic and factorized.
- [x] **Pragmatic quality**: Strict TypeScript and modular components; Vitest prioritizes fit score, generator truthfulness, and approval gate. Semantic HTML, visible focus, minimum 44px targets, readable contrast, and responsive checks are required.

**Pre-design result**: PASS. No constitution violation or unresolved technical choice remains. There is no project scaffold or font asset in the repository; use `create-next-app` at the root and the design-approved Inter Variable substitute through `next/font`.

### Post-Design Gate

- [x] Data model preserves Student Declined as a decision outcome, not an eighth status.
- [x] The transition contract prevents demo status advancement from creating Applied or bypassing approval.
- [x] Routes, fixtures, fit scoring, generator, activity log, persistence, and UI retain the same approval, truthfulness, observability, and design constraints.
- [x] No API contracts or research artifacts are needed: the MVP has no external interfaces, and the fixed stack and design font substitution are specified.

**Post-design result**: PASS.

## Project Structure

### Documentation (this feature)

```text
specs/001-internship-discovery/
├── plan.md
├── data-model.md
└── quickstart.md
```

No `research.md` or `contracts/` is needed: the technical choices are fixed and all interactions are local.

### Source Code (repository root)

```text
src/
├── app/
│   ├── page.tsx                         # Dashboard
│   ├── discover/page.tsx
│   ├── internships/[id]/page.tsx
│   ├── internships/[id]/prepare/page.tsx
│   ├── applications/page.tsx
│   ├── layout.tsx
│   └── globals.css                      # Central CSS variables/design tokens
├── components/
│   ├── AppShell.tsx
│   ├── WorkflowStepper.tsx
│   ├── InternshipCard.tsx
│   ├── FilterBar.tsx
│   ├── FitScoreBreakdown.tsx
│   ├── ProvenanceBadge.tsx
│   ├── DraftPreview.tsx
│   ├── ApprovalPanel.tsx
│   ├── StatusBadge.tsx
│   ├── ActivityTimeline.tsx
│   └── EmptyState.tsx
├── context/DemoStateProvider.tsx
├── data/
│   ├── student.ts                       # Exactly one generic seed profile
│   ├── internships.ts                   # Nine fictional-company listings
│   └── applications.ts                  # Seven statuses + separate declined outcome
├── services/mock-internship-service.ts
├── services/mock-application-service.ts
└── lib/
    ├── fit-score.ts
    ├── generator.ts
    └── application-state.ts
tests/
├── fit-score.test.ts
├── generator.test.ts
└── application-state.test.ts
```

**Structure Decision**: One Next.js application at the repository root, with route files under `src/app`, shared UI under `src/components`, seed fixtures under `src/data`, mock access behind `src/services`, and pure deterministic domain functions under `src/lib`. Persisted browser state is owned by one hydration-safe client context. No separate backend or contracts are introduced.

## Build Order and Time Budget

| Priority | Work | Estimate | Acceptance checkpoint |
|---|---|---:|---|
| P0 | Scaffold Next.js at repo root with `src/`, strict TypeScript, Tailwind, app routes/layout, Inter Variable via `next/font`, and centralized design tokens. Scaffold into a lowercase temp folder (for example internai-app) and move the contents to the repo root, because create-next-app rejects the folder name InternAI; set package.json name to internai. | 1.25 h | App builds; existing Spec Kit files remain untouched; branch is `frontend`. |
| P1 | Add one generic profile fixture, nine fictional-company listings with tags/start periods, seeded application records, and thin mock services | 0.75 h | Fixtures satisfy required fields; UX Research listing lacks User Research in profile and triggers the missing-fact placeholder. |
| P1 | Implement pure weighted fit scoring and Vitest coverage | 1.0 h | Scores are deterministic 0–100, factor points sum to total, match/missing/source evidence is returned, and Strong/Good/Partial bands occur. |
| P1 | Build AppShell, workflow stepper, dashboard, discover/filter/ranking, details, Save, and responsive list states | 1.5 h | Top three dashboard matches, status counts, all filters, details and stepper work at target widths. |
| P1 | Implement deterministic generator, read-only review, approval panel, transition function, and unit tests | 1.25 h | Both drafts have provenance labels; missing fact remains a placeholder; only approval sets Applied; Don't apply records separate outcome. |
| P1 | Add hydration-safe context/localStorage, reset, tracker, seeded activity timelines, and constrained demo status advancement | 1.25 h | Navigation/refresh preserve data; reset restores fixtures; advancement cannot set Applied; event log is timestamped. |
| P1 | Finish responsive/accessibility pass and run unit tests plus production build | 1.0 h | No horizontal scroll at 375/768/1280px; focus, contrast, and touch targets pass manual review; build/tests pass. |
| P2 | Add one Playwright happy-path smoke test and small visual polish | 0.75 h | Optional only after all P1 acceptance checkpoints pass. |
| Reserve | Integration fixes | 0.25 h | Use only for defects blocking the P1 demo. |

**Total**: 9 hours.

**Cut line**: Drop the optional Playwright smoke test first, then non-essential visual polish. Do not cut the approval gate, deterministic fit explanation, truthfulness/provenance, core routes, tracker, localStorage/reset, required responsive behavior, or the named Vitest tests; these are MVP requirements, not stretch work.

## Design and State Decisions

- Centralize color, typography, spacing, radii, and elevation as CSS variables in `src/app/globals.css`, mapped into Tailwind utilities there; components consume tokens rather than raw color values.
- Load Inter Variable with `next/font` as DESIGN.md's recommended substitute for Super Sans VF. Use custom variable weights 460, 540, 600, and 700 while retaining token metrics. Keep no external font request at runtime.
- Dashboard uses the specified indigo radial-gradient hero, one pale-violet pill CTA, white content canvas, indigo navigation, and a closing deep-teal band with one CTA. Interior routes remain white-canvas and follow the same token system. No new accent colors or heavy shadows.
- Use 8px rectangular buttons; full pills are limited to the hero CTA and tracker tabs. At 375px the stepper presents `Step N of 8: <label>`; at wider widths it shows all eight labels.
- Application `status` is exactly Discovered, Saved, Applied, Assessment, Interview, Offer, or Rejected. Student Declined is an optional independent decision outcome and is never displayed as Rejected or counted as an eighth state.
- Create an application record on first Save or Prepare. `Approve & submit (simulated)` alone authorizes transition into Applied; `Don't apply` only records Student Declined. Demo advancement accepts Applied or a later state and can advance through Assessment, Interview, Offer, or employer Rejected, never Applied.
