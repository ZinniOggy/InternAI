---

description: "Task list for InternAI Internship Agent MVP"
---

# Tasks: InternAI Internship Agent MVP

**Input**: Design documents from `/specs/001-internship-discovery/`

**Prerequisites**: `plan.md`, `spec.md`, `data-model.md`, and `quickstart.md`

**Tests**: Vitest is required for fit scoring, generator truthfulness, and application approval/transition behavior. Playwright remains optional.

**Organization**: Tasks follow the plan's build order: P0, each P1 row in sequence, then P2 optional work.

## Phase 1: Setup (P0)

**Purpose**: Complete the root scaffold, establish tests, and replace starter visuals with the approved design tokens.

- [ ] T001 Install root dependencies from `package.json` and `package-lock.json` with `npm install`, then verify the scaffold's current `npm run build` succeeds (`package.json`, `package-lock.json`).
- [ ] T002 Add Vitest and an `npm test` script, configure TypeScript test discovery and `passWithNoTests: true` until story tests exist (`package.json`, `vitest.config.ts`).
- [ ] T003 Replace starter styles with centralized DESIGN.md CSS/Tailwind v4 tokens, load Inter Variable through `next/font`, and replace the default dashboard with the specified indigo hero, white content canvas, and teal CTA band (`src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`).
- [ ] T004 After P0 changes, run `npm run build` and `npm test` from the root and resolve failures before P1 work (`package.json`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `vitest.config.ts`).

## Phase 2: Foundational Data and Mock Services (P1 build-order row 1)

**Purpose**: Define shared typed contracts, seed data, and the thin local service boundary.

- [ ] T005 Define strict shared types for student profile, internships, filters, fit evaluation, drafts, applications, statuses, decision outcomes, and activity events (`src/lib/types.ts`).
- [ ] T006 Create exactly one generic student fixture, nine fictional-company internship fixtures, and seeded applications covering all seven statuses plus separate Student Declined; include shared-vocabulary tags/start periods and ensure User Research is absent from profile skills (`src/data/student.ts`, `src/data/internships.ts`, `src/data/applications.ts`).
- [ ] T007 [P] Implement typed mock internship and application services over the fixtures with listing lookup, deterministic filtering, and fit-descending results; use relative imports (`src/services/mock-internship-service.ts`, `src/services/mock-application-service.ts`).
- [ ] T008 After this P1 row, run `npm run build` and `npm test`; resolve errors while keeping all records local (`package.json`, `src/data/student.ts`, `src/data/internships.ts`, `src/data/applications.ts`, `src/services/mock-internship-service.ts`, `src/services/mock-application-service.ts`).

## Phase 3: User Story 1 - Discover and Evaluate (P1 build-order rows 2-3)

**Goal**: Show the read-only student summary and ranked, filterable listings with deterministic, explainable fit scores.

**Independent Test**: Open Dashboard and Discover, confirm score ordering and all filters, clear a no-result filter, then open a listing and inspect its fit breakdown and provenance.

- [ ] T009 [P] [US1] Write fit-score tests for deterministic 0–100 totals, 50/20/20/10 factor maxima, matched/missing evidence, source tags, and Strong ≥75 / Good 50–74 / Partial <50 bands; run scoring over all seed fixtures and assert Strong, Good, and Partial each occur (`tests/fit-score.test.ts`).
- [ ] T010 [US1] Implement the pure weighted fit evaluator with exact-string skill/tag matching, location/work-mode and availability/duration rules, factor points, matched/missing items, and source tags (`src/lib/fit-score.ts`).
- [ ] T011 [P] [US1] Build the factor breakdown and provenance components showing per-factor points, matched/missing items, overall fit band, and `Your profile` / `Listing` labels (`src/components/FitScoreBreakdown.tsx`, `src/components/ProvenanceBadge.tsx`).
- [ ] T012 [P] [US1] Build internship cards and filter controls for location/work mode, skill, minimum fit, descending fit sort, and the no-results `Clear filters` action (`src/components/InternshipCard.tsx`, `src/components/FilterBar.tsx`).
- [ ] T013 [P] [US1] Build shared app navigation and the eight-step workflow stepper; use `Step N of 8: <label>` on narrow screens (`src/components/AppShell.tsx`, `src/components/WorkflowStepper.tsx`).
- [ ] T014 [US1] Implement the Dashboard profile summary, top three ranked matches, seven-state counts plus a separate Student Declined count, and primary `Discover internships` action (`src/app/page.tsx`).
- [ ] T015 [US1] Implement Discover with mock listings, fit ranking, filters, and the clearable empty state (`src/app/discover/page.tsx`).
- [ ] T016 [US1] Implement internship details with listing facts, fit breakdown, Discovered/Saved toggle, Prepare action, and invalid-ID not-found state (`src/app/internships/[id]/page.tsx`).
- [ ] T017 [US1] After the fit-score row and discovery UI row respectively, run `npm run build` and `npm test`; resolve failures before beginning the next build-order row (`package.json`, `src/lib/fit-score.ts`, `src/app/page.tsx`, `src/app/discover/page.tsx`, `src/app/internships/[id]/page.tsx`).

## Phase 4: User Story 2 - Prepare, Review, and Approve (P1 build-order row 4)

**Goal**: Generate truthful, read-only application drafts and make explicit student approval the only path to Applied.

**Independent Test**: Generate and review both drafts, confirm missing facts remain placeholders, verify an unapproved application cannot become Applied, and verify demo advance can never create Applied.

- [ ] T018 [P] [US2] Write generator tests for deterministic resume summary/cover letter, provenance labels, no invented facts, and the UX Research listing's non-interactive `Add to profile` placeholder (`tests/generator.test.ts`).
- [ ] T019 [P] [US2] Write state tests proving Applied is unreachable without explicit approval, approval is the only path to Applied, demo advance can never create Applied, Student Declined is separate, and terminal states reject transitions (`tests/application-state.test.ts`).
- [ ] T020 [US2] Implement the pure local deterministic resume-summary and cover-letter generator using only profile/listing facts and labeled missing-fact placeholders (`src/lib/generator.ts`).
- [ ] T021 [US2] Implement the pure application transition function for Save/Unsave, Prepare, approved submission, Don't apply, and constrained demo advancement (`src/lib/application-state.ts`).
- [ ] T022 [US2] Implement mock application operations through the transition function; create records on first Save or Prepare and use relative imports (`src/services/mock-application-service.ts`).
- [ ] T023 [P] [US2] Build read-only draft previews with `AI-generated` and `From your profile` labels and a clear missing-fact placeholder (`src/components/DraftPreview.tsx`).
- [ ] T024 [P] [US2] Build the approval panel with both drafts, `Approve & submit (simulated)`, `Don't apply`, and the post-approval `Simulated — nothing was sent.` message (`src/components/ApprovalPanel.tsx`).
- [ ] T025 [US2] Implement the Prepare/review route and connect generation, explicit approval, and Student Declined handling (`src/app/internships/[id]/prepare/page.tsx`).
- [ ] T026 [US2] After this P1 row, run `npm run build` and `npm test`; resolve failures without enabling any other path to Applied (`package.json`, `src/lib/generator.ts`, `src/lib/application-state.ts`, `src/app/internships/[id]/prepare/page.tsx`).

## Phase 5: User Story 3 - Track Applications (P1 build-order row 5)

**Goal**: Persist application state and show seven statuses, separate Student Declined outcomes, and timestamped activity.

**Independent Test**: Select seeded records across all statuses and Student Declined; verify separate grouping, status labels, and chronological activity for each selected application.

- [ ] T027 [US3] Implement hydration-safe client state backed by localStorage, seed fallback, reset operation, and timestamped activity updates (`src/context/DemoStateProvider.tsx`).
- [ ] T028 [P] [US3] Build status badges and a timestamped activity timeline for the selected application (`src/components/StatusBadge.tsx`, `src/components/ActivityTimeline.tsx`).
- [ ] T029 [US3] Implement the tracker grouped by the seven statuses with Student Declined in a separate group and a demo-only status advancement control that cannot set Applied (`src/app/applications/page.tsx`).
- [ ] T030 [US3] Connect Dashboard counts and Save, Prepare, approval, decline, and status advancement actions to persisted state; append relevant activity events (`src/app/page.tsx`, `src/app/internships/[id]/page.tsx`, `src/app/internships/[id]/prepare/page.tsx`, `src/app/applications/page.tsx`).
- [ ] T031 [US3] After this P1 row, run `npm run build` and `npm test`; verify the newly approved application appears as Applied and existing state persists through navigation (`package.json`, `src/context/DemoStateProvider.tsx`, `src/app/applications/page.tsx`).

## Phase 6: User Story 4 - Responsive Demo and Reset (P1 build-order row 6)

**Goal**: Keep all routes usable at required viewport widths, accessible, persistent, and resettable.

**Independent Test**: Use all routes at 375px, 768px, and 1280px without horizontal scrolling, navigate and refresh to confirm persistence, then reset to seed data.

- [ ] T032 [P] [US4] Apply DESIGN.md breakpoints and responsive behavior to the stepper, dashboard, Discover, details, Prepare, and tracker; remove horizontal overflow (`src/app/globals.css`, `src/components/WorkflowStepper.tsx`, `src/app/page.tsx`, `src/app/discover/page.tsx`, `src/app/internships/[id]/page.tsx`, `src/app/internships/[id]/prepare/page.tsx`, `src/app/applications/page.tsx`).
- [ ] T033 [P] [US4] Add the clearly labeled `Reset demo` control and restore fixtures plus initial demo state through the provider (`src/components/AppShell.tsx`, `src/context/DemoStateProvider.tsx`).
- [ ] T034 [US4] Complete semantic HTML, visible keyboard focus, readable WCAG AA contrast, and at least 44px touch-target review; then run `npm run build` and `npm test` and resolve failures (`src/components/`, `src/app/globals.css`, `package.json`).

## Phase 7: Optional P2 Work

**Purpose**: Only after all required P1 rows pass their build and test checkpoints.

- [ ] T035 [US4] OPTIONAL: Add one Playwright happy-path smoke test for the generic demo-student flow (`tests/e2e/internai-demo.spec.ts`, `playwright.config.ts`, `package.json`).
- [ ] T036 OPTIONAL: Apply visual polish using existing DESIGN.md tokens only; do not add colors or change the approved visual direction (`src/app/page.tsx`, `src/app/globals.css`).

## Dependencies and Parallel Opportunities

- P0 order: T001 → T002 → T003 → T004. Do not begin P1 until the P0 build and test checkpoint passes.
- P1 data row: T005 → T006 → T007 → T008.
- P1 fit row: T009 → T010 → T017 checkpoint. T011–T013 are independent component files after shared types are established; T014–T016 integrate them in route order.
- P1 preparation row: T018/T019 can be written in parallel; T020/T021 implement separate pure modules after the tests are specified; T023/T024 are separate presentation components; T025 integrates them.
- P1 tracking row: T027 and T028 can proceed in parallel after shared types; T029 and T030 integrate provider and UI before T031 validation.
- P1 responsive row: T032 and T033 affect separate UI/state surfaces and can proceed in parallel; T034 validates the completed row.
- P2 T035 and T036 are sequential optional tasks and are dropped first if time runs out.

## Implementation Strategy

1. Complete P0 and stop for the requested build/test review.
2. Deliver US1 discovery and explainable scoring; validate after the fixture, scoring, and discovery UI build-order rows.
3. Deliver US2 draft truthfulness and approval gate; pass both focused Vitest files plus the full build/test checkpoint.
4. Deliver US3 persistence, activity history, status tracking, and separate Student Declined grouping.
5. Deliver US4 responsive behavior, accessibility, and reset; rerun build and all tests.
6. Attempt P2 only if the required MVP is complete and the time budget remains.

## Manual Verification Checklist

| Check | Procedure | Expected result |
|---|---|---|
| Viewport widths | Exercise Dashboard, Discover, Details, Prepare, and Tracker at 375px, 768px, and 1280px. | No horizontal scrolling; stepper and controls remain usable. |
| Keyboard focus | Navigate all routes and actions using only the keyboard. | Focus is visible and follows a logical order. |
| Offline / no external calls | Inspect browser network activity while completing the demo with external connectivity unavailable. | No external service request is required by the application. |
| Refresh persistence | Change/save/approve demo state, navigate, and refresh. | State and activity remain consistent after reload. |
| Reset demo | Select `Reset demo` after changing state. | Seed applications, initial state, and activity return. |
