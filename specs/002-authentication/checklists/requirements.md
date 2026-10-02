# Specification Requirements Checklist: InternAI Authentication

**Purpose**: Track implementation acceptance coverage for the authentication specification
**Created**: 2026-10-02
**Feature**: [spec.md](../spec.md)

These are implementation checks, not evidence that authentication has already been implemented. Resolve the open items in `Clarifications needed` before planning affected architecture or Google callback setup.

## Authentication and Session

- [ ] CHK001 - Confirm Spec 002 scopes auth separately while preserving Spec 001 behavior. [FR-001]
- [ ] CHK002 - Confirm Google Identity Services loads once and renders the standard secondary-style Google button. [FR-002, FR-036]
- [ ] CHK003 - Confirm the transient credential is posted to `/auth/google` and never logged or persisted. [FR-003]
- [ ] CHK004 - Confirm the backend success response and cookie-setting contract match the documented shape. [FR-004]
- [ ] CHK005 - Confirm `/auth/me` maps 200 to authenticated and 401 to unauthenticated. [FR-005]
- [ ] CHK006 - Confirm the backend session cookie is HttpOnly, encrypted, and expires within seven days. [FR-006]
- [ ] CHK007 - Confirm the frontend user ID equals Google's stable `sub` and exposes only the allowed identity fields. [FR-007]
- [ ] CHK008 - Confirm the three auth states and two modes are explicit and no token is stored in localStorage. [FR-008]

## Onboarding and User Data

- [ ] CHK009 - Confirm first successful sign-in with no local profile starts onboarding without a separate registration flow. [FR-009, FR-010]
- [ ] CHK010 - Confirm Google name/email are prefilled and labeled `From Google`. [FR-011]
- [ ] CHK011 - Confirm onboarding includes university, major, skills, interests, location, work mode, and availability. [FR-012]
- [ ] CHK012 - Confirm every profile field carries `From Google`, `Student`, or `Sample profile` provenance. [FR-012, FR-013]
- [ ] CHK013 - Confirm sample-profile values come from the generic existing seed and remain labeled as sample data. [FR-013]
- [ ] CHK014 - Confirm missing facts show `Add to profile` and are not inferred or awarded unsupported fit credit. [FR-014]
- [ ] CHK015 - Confirm returning users with a profile skip onboarding and users without one are routed to onboarding. [FR-015]
- [ ] CHK016 - Confirm profile/application keys use `internai:v1:{userId}:...` and contain no credential/token. [FR-016]
- [ ] CHK017 - Confirm two users on one browser load and write only their own namespaced records. [FR-017]
- [ ] CHK018 - Confirm user-ID changes rehydrate the correct namespace before rendering user data. [FR-017]
- [ ] CHK019 - Confirm legacy un-namespaced data is never silently copied or deleted and any import waits for explicit consent. [FR-018]
- [ ] CHK020 - Confirm clearing browser site data results in onboarding without invented profile values. [FR-014, FR-015]

## Logout, Reset, and Protected Routes

- [ ] CHK021 - Confirm Logout calls `/auth/logout`, clears session state, and preserves user localStorage. [FR-019]
- [ ] CHK022 - Confirm Reset Demo resets only the active user's data and keeps the user signed in. [FR-020]
- [ ] CHK023 - Confirm every frontend backend request uses the configured API base and `credentials: "include"`. [FR-021]
- [ ] CHK024 - Confirm typed API errors and backend 401 events update auth state without logging secrets. [FR-022]
- [ ] CHK025 - Confirm `/login` and static assets are public and all other page routes are protected without adding unapproved Next callback routes. [FR-023]
- [ ] CHK026 - Confirm optimistic redirect, server-side session check, loading skeleton, and no protected-content flash. [FR-024]
- [ ] CHK027 - Confirm `sanitizeNext` rejects `//`, backslashes, absolute URLs, and `javascript:` and defaults to `/discover`. [FR-025]
- [ ] CHK028 - Confirm an authenticated visit to `/login` redirects to Dashboard. [FR-026]
- [ ] CHK029 - Confirm browser Back after Logout revalidates the session and does not reveal protected content. [FR-027]

## Demo Login and Google Setup

- [ ] CHK030 - Confirm the demo button requires the development/test flag, uses fixed ID `demo`, and does not simulate Google. [FR-028]
- [ ] CHK031 - Confirm production hides/disables demo login and backend failure never silently activates it. [FR-028, FR-029]
- [ ] CHK032 - Confirm denied/cancelled consent, unlisted test users, and backend failures show non-technical errors with retry. [FR-030, FR-034]
- [ ] CHK033 - Confirm frontend config uses only the named `NEXT_PUBLIC_` values and `.env.local` is ignored. [FR-031]
- [ ] CHK034 - Confirm backend secret names/values remain server-only, absent from client bundles and committed files. [FR-032]
- [ ] CHK035 - Confirm local origin and backend API base use the correct host/ports and `AUTH_URL` matches the origin in use. [FR-033]
- [ ] CHK036 - Confirm Google consent is Testing mode, only listed test users can sign in, and scopes are only `openid`, `email`, `profile`. [FR-034]
- [ ] CHK037 - Resolve the OAuth interaction and exact Authorized redirect URI before Google Console configuration. [FR-034, C3]
- [ ] CHK038 - Confirm login, onboarding, user menu, and auth errors use only DESIGN.md tokens and no new UI kit/style. [FR-035]
- [ ] CHK039 - Confirm the Google button uses Google's standard `G` mark and is not treated as freely stylable. [FR-036]
- [ ] CHK040 - Confirm no email/password, roles, admin, database, server profiles, cross-device sync, or other provider is added. [FR-038]

## Non-Functional Requirements

- [ ] CHK041 - Confirm auth UI uses semantic HTML, visible focus, and at least 44×44px interactive targets. [NFR-001]
- [ ] CHK042 - Confirm no horizontal scrolling at 375px, 768px, or 1280px and text contrast meets WCAG AA. [NFR-002]
- [ ] CHK043 - Confirm strict TypeScript and zero credentials/tokens/secrets in source, bundles, localStorage, or logs. [NFR-003, NFR-004]

## Spec 001 behavior unchanged

- [ ] CHK044 - Confirm only explicit `Approve & submit (simulated)` can set Applied. [FR-037]
- [ ] CHK045 - Confirm submission remains simulated and displays `Simulated — nothing was sent.` [FR-037]
- [ ] CHK046 - Confirm Student Declined stays separate and is never displayed as Rejected. [FR-037]
- [ ] CHK047 - Confirm deterministic fit scoring and explanations are unchanged. [FR-037]
- [ ] CHK048 - Confirm generated content and student-provided content remain clearly distinguished. [FR-037]
- [ ] CHK049 - Confirm discovery, filtering, Save/Prepare, and application tracker remain functional. [FR-001, FR-037]

## Clarifications

- [ ] CHK050 - Resolve Auth.js v5 versus FastAPI-owned session architecture and protected-layout check. [C1]
- [ ] CHK051 - Resolve explicit opt-in import versus absolute no-migration policy for legacy demo data. [C2]
- [ ] CHK052 - Resolve Google Identity Services callback mode versus required Authorized redirect URI. [C3]
- [ ] CHK053 - Resolve mapping of onboarding fields to existing Spec 001 profile fields. [C4]
