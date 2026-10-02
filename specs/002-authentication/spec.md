# Feature Specification: InternAI Authentication

**Feature Branch**: `frontend`

**Created**: 2026-10-02

**Status**: Draft

**Input**: User description: "Add backend-driven authentication to the InternAI frontend while keeping the existing internship discovery MVP working unchanged."

## Overview

This specification formally adds authentication and first-time student onboarding to InternAI. It extends, but does not replace, [Spec 001](../001-internship-discovery/spec.md). Internship discovery, deterministic fit scoring, generated application preparation, the explicit approval gate, application tracking, demo reset, and all existing demo behavior MUST continue unchanged.

The frontend adds Auth.js v5 with the Google provider and JWT sessions without a database or adapter. Auth.js owns the encrypted HttpOnly session cookie. This is a specification only; no application code, dependency, auth route, or environment file is created in this phase.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sign in with Google (Priority: P1)

A university student chooses Google sign-in from the public login page and returns to InternAI with a verified session and a frontend user identity.

**Why this priority**: A verified identity is required before the app can safely isolate student data.

**Independent Test**: With a configured Google Testing-mode test account, complete sign-in and confirm the Auth.js session contains the stable Google identity and is authenticated.

**Acceptance Scenarios**:

1. **Given** a listed Google test user is on `/login`, **When** they choose Google sign-in and complete consent, **Then** Auth.js signs them in through the Google provider without a password or database account.
2. **Given** Google returns a valid identity, **When** the session is created, **Then** the Google `sub` is exposed as `session.user.id` and the browser receives the encrypted HttpOnly session cookie.

### User Story 2 - Complete first-time onboarding (Priority: P1)

A first-time student completes an onboarding profile after their first successful sign-in, with Google-provided identity fields clearly identified and student-entered fields left under their control.

**Why this priority**: Discovery and explainable recommendations need student facts, while the app must not fabricate profile data.

**Independent Test**: Sign in as a user without a namespaced profile and verify onboarding is shown, Google name/email are prefilled and labeled, and entered profile facts are saved only for that user.

**Acceptance Scenarios**:

1. **Given** a successful sign-in returns `isNewUser: true`, **When** the student lands in InternAI, **Then** they are routed to onboarding rather than the discovery dashboard.
2. **Given** Google supplies name and email, **When** onboarding is displayed, **Then** both values are prefilled and labeled `From Google`; university, major, skills, interests, location, work mode, and availability are student-entered.

### User Story 3 - Use the sample profile (Priority: P1)

A student may choose a generic sample profile to explore the demo without entering a personal profile from scratch.

**Why this priority**: It preserves the demo path while making the source of sample facts explicit.

**Independent Test**: Choose `Use sample profile` and verify the existing generic seed values are copied to the current user's profile namespace with sample provenance.

**Acceptance Scenarios**:

1. **Given** the student is on onboarding, **When** they select `Use sample profile`, **Then** the generic seed profile is used and populated values are labeled `Sample profile`.
2. **Given** the sample profile contains a fact not supplied by Google or the student, **When** drafts or fit explanations use it, **Then** it remains distinguishable as sample data and is never represented as a student-entered fact.

### User Story 4 - Return without repeating onboarding (Priority: P1)

A returning student with a complete profile resumes the app without being asked to register or repeat onboarding.

**Why this priority**: Returning users should continue their workflow while their identity remains session-verified.

**Independent Test**: Sign in for a user with a profile under their user-ID namespace and verify onboarding is skipped and their own data is loaded.

**Acceptance Scenarios**:

1. **Given** an Auth.js session for a user whose profile exists in that user's namespace, **When** the session is restored, **Then** the student lands on the dashboard.
2. **Given** the Auth.js session is valid but no local profile exists, **When** the student signs in, **Then** onboarding is shown instead of constructing a profile from missing facts.

### User Story 5 - Keep the session across refresh and restart (Priority: P1)

A student remains signed in across page refreshes and browser restarts while the Auth.js JWT session is valid.

**Why this priority**: Session continuity prevents accidental loss of the current authenticated workflow.

**Independent Test**: Sign in, refresh, restart the browser before the seven-day maximum age, and verify `auth()` restores the same user.

**Acceptance Scenarios**:

1. **Given** a valid Auth.js session cookie, **When** the app loads or refreshes, **Then** the frontend starts in `loading`, resolves the session, and becomes authenticated for the same user.
2. **Given** the cookie has expired or Auth.js returns no session, **When** a protected page is opened, **Then** the user is treated as unauthenticated and is not shown protected content.

### User Story 6 - Sign out without deleting student data (Priority: P1)

A student can sign out while retaining their browser-local profile and application data for a later sign-in.

**Why this priority**: Logout must end the session without destroying work that belongs to that user.

**Independent Test**: Sign in, create local demo state, sign out, and verify the Auth.js session ends while that user's local storage namespace remains unchanged.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they select Logout, **Then** the frontend calls Auth.js `signOut`, clears the session cookie/in-memory auth state, and preserves all localStorage data.
2. **Given** the user signs out, **When** they choose Reset Demo instead, **Then** only the current user's app data resets and the session remains authenticated.

### User Story 7 - Protect authenticated routes (Priority: P1)

A signed-out visitor is redirected to login before protected InternAI content is shown; a signed-in visitor does not remain on the login page.

**Why this priority**: Protected student data must not be exposed through direct URLs, stale pages, or navigation history.

**Independent Test**: Open protected routes directly while signed out, then repeat while signed in; use browser Back after logout and confirm protected content is not exposed.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor requests a protected route, **When** the optimistic request-layer check runs, **Then** they are sent to `/login?next=<requested-path>` and see no protected content while auth status is loading.
2. **Given** a signed-in visitor opens `/login`, **When** their valid Auth.js session is confirmed, **Then** they are redirected to the dashboard.
3. **Given** a user logs out and presses Back, **When** a protected route is revisited, **Then** `auth()` in the protected layout prevents protected content from being displayed.

### User Story 8 - Keep two users' data separate on one browser (Priority: P1)

Two users who sign in sequentially on the same browser each see only data stored under their own stable user ID.

**Why this priority**: Browser-local storage is shared by the browser profile, so isolation must be explicit in key construction and hydration.

**Independent Test**: Sign in as two distinct Google users in turn and compare their profiles and application data before and after switching sessions.

**Acceptance Scenarios**:

1. **Given** user A and user B have different IDs and stored profiles, **When** each is authenticated in turn, **Then** only that user's namespace is loaded and written.
2. **Given** the authenticated user ID changes, **When** the provider rehydrates, **Then** the previous user's data is not rendered or copied into the new user's state.

### User Story 9 - Continue as the demo user when enabled (Priority: P2)

A student can use an explicitly labeled demo identity when the development/test setting enables this fallback.

**Why this priority**: It keeps local demos available without making a password account or silently masking backend failures.

**Independent Test**: Enable `AUTH_DEMO_LOGIN` in development, use the button, and verify the fixed `demo` identity and demo namespace; disable the flag or use production mode and verify the button is absent.

**Acceptance Scenarios**:

1. **Given** `AUTH_DEMO_LOGIN` is enabled outside production, **When** the student selects `Continue as demo student`, **Then** the app enters demo mode with fixed user ID `demo` and no password flow.
2. **Given** the environment is production, **When** the login page is displayed, **Then** the demo login button is not rendered.

### User Story 10 - Recover from Google sign-in failure or cancellation (Priority: P1)

A student who cancels Google consent or encounters a sign-in failure receives an understandable message and can retry.

**Why this priority**: A failed sign-in must not leave the user with a blank screen or an unintended demo session.

**Independent Test**: Cancel consent, simulate Google sign-in failure, and use an unlisted test account; verify each path provides a non-technical error and retry option without signing in as demo.

**Acceptance Scenarios**:

1. **Given** the student cancels Google consent, **When** control returns to InternAI, **Then** a clear non-technical message and retry path are shown.
2. **Given** Google sign-in fails or Auth.js cannot complete the provider flow, **When** sign-in fails, **Then** the app remains unauthenticated, shows a clear error and retry path, and does not automatically switch to demo mode.

## Edge Cases

- A session expires while the student is viewing a protected page.
- Google consent is denied, cancelled, or initiated by an account not listed in the consent screen's Testing users.
- Browser localStorage is cleared while the Auth.js session cookie remains valid; the student is sent to onboarding without invented facts.
- The student switches between `127.0.0.1` and `localhost`; each is a separate origin with separate browser cookie/localStorage scope, and `AUTH_URL` must match the origin in use.
- The student presses Back after Logout; protected content must not be shown from stale client state or browser history.
- The profile is incomplete; missing facts remain missing, appear as `Add to profile`, and do not receive invented fit credit.
- Browser storage is unavailable, corrupt, or full; the app reports an understandable local-data problem and does not throw or treat storage as proof of login.
- A saved legacy `internai-demo-state` key exists but the signed-in user's namespace does not; show the one-time import prompt and preserve the legacy key unless the student accepts import.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: This feature MUST add an authentication extension governed by this specification while leaving all Spec 001 discovery, fit scoring, preparation, approval, tracking, and demo behavior unchanged unless explicitly extended here.
- **FR-002**: The public login page MUST provide Google sign-in through the Google Identity Services button, load its script only once, and render Google's standard `G` button in a secondary-style container using DESIGN.md tokens.
- **FR-003**: On Google callback, the frontend MUST send the transient `response.credential` as `{ credential }` to `POST /auth/google`; it MUST NOT log, persist, or otherwise retain that credential after the request.
- **FR-004**: The backend contract for `POST /auth/google` MUST be `200 { user: { id, email, name, picture }, isNewUser }` on success and MUST set the backend-owned HttpOnly session cookie.
- **FR-005**: On application start, the frontend MUST call `GET /auth/me`; `200 { user }` establishes the current backend identity and 401 establishes unauthenticated state. A 401 MUST emit an `unauthenticated` event for protected data consumers.
- **FR-006**: The backend session cookie MUST be encrypted, HttpOnly, and have a maximum age of seven days; the session MUST survive refresh and browser restart until expiry. The frontend MUST NOT use localStorage as proof of authentication.
- **FR-007**: For Google users, the stable Google `sub` claim MUST be exposed as `session.user.id`; the client-visible session user MUST contain only `id`, `email`, `name`, and `image`/picture fields needed by the UI.
- **FR-008**: Authentication MUST have `loading`, `authenticated`, and `unauthenticated` states and a `backend` or `demo` mode. The Google credential and all session tokens MUST remain out of application storage and logs.
- **FR-009**: The first successful sign-in with no stored profile for that user MUST be treated as sign-up; there MUST NOT be a separate registration system.
- **FR-010**: If `isNewUser` is true OR the current user's profile is absent, the user MUST be routed to onboarding. A returning user with a profile MUST skip onboarding.
- **FR-011**: Onboarding MUST prefill the Google name and email and visibly label both `From Google`.
- **FR-012**: Onboarding MUST allow the student to enter university, major, skills, interests, location, work mode, and availability. The form MUST record provenance for each profile field.
- **FR-013**: Onboarding MUST provide `Use sample profile`, which loads the existing generic seed persona and labels its values `Sample profile` rather than implying the student supplied them.
- **FR-014**: The system MUST never invent profile facts. Missing facts MUST appear as `Add to profile`; fit explanations MUST use only known facts and incomplete profiles MUST receive no unsupported fit credit.
- **FR-015**: Returning authenticated users with a profile in their own namespace MUST proceed to the dashboard without repeating onboarding.
- **FR-016**: Profile and application data MUST be stored per browser under keys following `internai:v1:{userId}:...`; session credentials and OAuth tokens MUST never be stored there.
- **FR-017**: Data for two user IDs MUST remain isolated in one browser. When user ID changes, the app MUST rehydrate only that user's namespace before showing their data.
- **FR-018**: A pre-existing un-namespaced `internai-demo-state` MUST NOT be silently consumed or deleted. If a one-time import is enabled by resolution of Clarification C2, it MUST be explicitly approved and copy data into the current user's namespace.
- **FR-019**: Logout MUST call `POST /auth/logout` with credentials included, clear only session state/cookie, and MUST NOT delete localStorage data.
- **FR-020**: Reset Demo MUST reset only the current user's namespaced data and MUST NOT log the user out or clear the session cookie.
- **FR-021**: Every frontend request to the backend MUST use `credentials: "include"` and the configured API base URL. `POST /auth/logout` MUST return 204; `GET /auth/me` MUST return 200 or 401; `POST /auth/google` MUST follow FR-004.
- **FR-022**: The API client MUST use typed errors and convert backend 401 responses into the unauthenticated state/event without logging credentials or secret response content.
- **FR-023**: Public frontend routes MUST include `/login` and static assets. All other page routes MUST be protected; backend auth endpoints `/auth/*` are served by the separate backend, not added as Next.js callback routes in this phase.
- **FR-024**: Protected routes MUST use an optimistic request-level middleware/proxy redirect plus a server-side protected-layout session check against the backend session. A client `RequireAuth` guard MUST show a skeleton while loading and redirect unauthenticated users to `/login?next=<path>` without flashing protected content.
- **FR-025**: A `sanitizeNext(path)` requirement MUST accept only relative paths beginning with exactly one `/`; it MUST reject `//`, backslashes, absolute URLs, and `javascript:` URLs and otherwise default to `/discover`.
- **FR-026**: Authenticated users visiting `/login` MUST be redirected to the dashboard.
- **FR-027**: Returning from browser history after Logout MUST re-check authentication and MUST NOT expose cached protected content.
- **FR-028**: `Continue as demo student` MUST appear only when the demo-login setting is enabled outside production, MUST use fixed user ID `demo`, and MUST NOT be a password flow or simulated Google identity.
- **FR-029**: Backend unavailability MUST NOT automatically activate demo mode; the frontend MUST show an error and retry option instead.
- **FR-030**: Google consent cancellation, denied consent, unlisted test users, and backend sign-in failures MUST show a clear non-technical error with a retry path.
- **FR-031**: Frontend configuration MUST use the Next.js public environment names `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_API_BASE_URL`, and `NEXT_PUBLIC_ENABLE_DEMO_LOGIN`. Only empty placeholders may appear in a committed `.env.example`; `.env.local` MUST be gitignored.
- **FR-032**: Backend-only configuration names supplied for this feature are `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_URL`, and `AUTH_DEMO_LOGIN`; values MUST remain server-only, MUST NOT use `NEXT_PUBLIC_`, and MUST NOT be committed. No real values belong in this specification.
- **FR-033**: The primary local frontend origin MUST be `http://127.0.0.1:4173` and the backend API base URL MUST be `http://127.0.0.1:8000`. `http://localhost:4173` is a separate origin; cookie and storage behavior MUST be tested for the exact origin in use, and `AUTH_URL` MUST match that origin.
- **FR-034**: Google Cloud setup MUST use a consent screen in Testing mode, allow only explicitly listed test users, and request only `openid`, `email`, and `profile` scopes.
- **FR-035**: Authentication UI for login, onboarding, user menu, and errors MUST use only DESIGN.md tokens, typography, spacing, radii, buttons, inputs, and cards; no new palette, font, shadow system, or UI kit may be introduced.
- **FR-036**: The Google sign-in button MUST use Google's standard `G` mark and a secondary button treatment within the existing design language; the Google-rendered button itself is not freely restyled.
- **FR-037**: Authentication MUST NOT change Spec 001's simulated approval action, `Simulated — nothing was sent.` confirmation, Student Declined semantics, deterministic explainable fit score, or generated-versus-student-provided distinction.
- **FR-038**: Email/password authentication, password storage, roles, admin features, email verification, password reset, database adapters, server-side student profiles, cross-device sync, other OAuth providers, and production Google app verification/publishing MUST remain out of scope.

### Non-Functional Requirements

- **NFR-001**: Authentication screens MUST use semantic HTML, visible keyboard focus, and interactive targets at least 44×44px.
- **NFR-002**: Authentication screens MUST meet WCAG AA text contrast and have no horizontal scrolling at 375px, 768px, or 1280px.
- **NFR-003**: Frontend source and types MUST use strict TypeScript; Google credentials, session tokens, and backend secrets MUST NOT appear in client bundles, browser storage, logs, or committed frontend files.
- **NFR-004**: The frontend MUST treat localStorage as non-secure, browser-local data storage; it MUST never store authentication credentials or session proof there.

### Design Requirements

All new login, onboarding, user-menu, and authentication-error UI MUST follow `DESIGN.md`: centralized existing colors/tokens, Inter Variable, existing typography and weights, spacing, radii, buttons, inputs, card treatment, and hierarchy. The Google button uses the standard Google `G` mark inside the existing secondary-button style. No unrelated visual style or new design tokens are authorized by this feature.

### Unchanged Behavior

Authentication MUST NOT modify Spec 001's discovery/filtering and ranking behavior, deterministic fit score or visible explanations, application draft content/provenance, read-only review, explicit `Approve & submit (simulated)` gate, simulated-only submission, seven application states, separate Student Declined outcome, activity timeline, Reset Demo semantics, or responsive/accessibility requirements.

### Key Entities *(include if feature involves data)*

- **Session User**: `id` (Google stable `sub`), `name`, `email`, and `image`; name/email/image from Google are labeled `From Google`. Demo mode has fixed ID `demo` and is visibly identified as demo.
- **Student Profile**: Owned by one `userId`, stored in that user's browser namespace, and composed of profile fields with individual provenance (`From Google`, `Student`, or `Sample profile`). Fields include university, major, skills, interests, location, work mode, availability, and any existing Spec 001 profile fields that are present; absent facts remain absent rather than inferred.
- **Browser Session**: Backend-owned HttpOnly cookie/session with at most seven days lifetime; not copied into localStorage or returned as a client token.
- **Namespaced Local Data**: Profile and application slices addressed by `internai:v1:{userId}:...`; separate for each user on the same browser and not synchronized across devices.

### Out of Scope

- Email/password authentication, passwords, roles, admin, email verification, password reset, and other OAuth providers.
- Database, database adapter, persistent server-side user records or student profiles, and cross-device synchronization.
- Production Google consent verification/publication; only Testing mode and listed test users are in this feature.
- Changes to Spec 001 discovery, fit scoring, application generation, approval, tracking, or demo behavior beyond authentication gating and per-user storage namespacing.

### Assumptions and Known Limitations

- User and session authority is the separate FastAPI backend contract in FR-004–FR-006; frontend profile/application content remains per browser and per user ID.
- Clearing browser site data removes the local profile/application state and requires re-onboarding; the backend session may remain valid until cookie expiry.
- localStorage is not secure storage; it contains no tokens, Google credential, or secrets.
- The frontend uses the stated `NEXT_PUBLIC_` names only for public client configuration; secret values belong to the separately built backend and are not written into frontend files.
- `127.0.0.1` and `localhost` are distinct origins; users must consistently use the origin configured for their local OAuth client and backend cookie/CORS settings.

### Clarifications needed

- **C1 - Session implementation conflict**: The supplied decisions name Auth.js v5/JWT and a server `auth()` check, while the explicit hard constraint prohibits Auth.js and the current architecture makes FastAPI own sessions/cookies. Confirm whether Auth.js v5 is fully superseded and whether the protected-layout check is a frontend helper that calls the backend contract. This spec documents the FastAPI API boundary and does not authorize adding Auth.js.
- **C2 - Legacy-data policy conflict**: One decision says the existing un-namespaced key is ignored with no migration; another requires a one-time prompt to import it. FR-018 requires no automatic migration and an explicit opt-in prompt, but confirm whether user-approved copying is allowed or legacy data must remain ignored absolutely.
- **C3 - OAuth route/redirect conflict**: The public-route list names `/api/auth/*` and requests authorized redirect URIs, while the active backend contract is `/auth/*` on port 8000 and the Google Identity Services callback posts a credential to `/auth/google`; the hard constraint also forbids Next.js `/api/auth/*` callback routes. Confirm which OAuth interaction mode and exact redirect URI, if any, Google Cloud should register. Do not guess a URI.
- **C4 - Profile-field mapping**: Onboarding collects university, major, skills, interests, location, work mode, and availability, while Spec 001 also uses academic year, projects, preferred locations, and internship duration. Confirm which omitted fields remain incomplete/`Add to profile` versus being added to onboarding, so fit scoring and draft generation do not infer them.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every listed Google Testing-mode acceptance scenario ends in the specified authenticated or recoverable error state; no scenario silently falls into demo mode.
- **SC-002**: For every test user with a valid cookie aged less than seven days, reload and browser restart restore the same `session.user.id`; expired/invalid sessions show unauthenticated state.
- **SC-003**: In a two-user same-browser scenario, zero profile or application records from user A are displayed or written while user B is active, and vice versa.
- **SC-004**: 100% of direct requests to protected page routes while unauthenticated are redirected without protected content, including browser Back after logout.
- **SC-005**: Logout removes the session while preserving the current user's localStorage keys; Reset Demo restores only those keys while preserving the session.
- **SC-006**: A source/bundle/storage/log inspection finds zero Google credentials, OAuth/session tokens, or backend secret values in frontend source, client bundles, localStorage, or logs.
- **SC-007**: All six specified Spec 001 regression behaviors remain unchanged and the existing fit-score, generator, and application-state test suites remain green.
- **SC-008**: At 375px, 768px, and 1280px, authentication screens have no horizontal scrolling, keyboard focus is visible, targets are at least 44×44px, and text contrast meets WCAG AA.
- **SC-009**: A first-time user can complete Google sign-in and onboarding or sample-profile selection without being asked for email/password or a separate registration flow.

## External Setup Required

Before implementation/testing with Google:

1. Create/select a Google Cloud project.
2. Configure the OAuth consent screen in **Testing** mode.
3. Add only approved test accounts to the Testing user list; no personal email addresses are embedded in this specification.
4. Create a web OAuth client and configure the authorized JavaScript origin `http://127.0.0.1:4173`. Add `http://localhost:4173` only if that separate origin will also be used.
5. Request scopes `openid`, `email`, and `profile` only.
6. Set the client ID and API base URL through the public frontend environment names in FR-031; keep all secret values in the backend environment only.
7. **Authorized redirect URI**: unresolved by C3. The specified Google Identity Services JavaScript credential callback posts to the backend and does not itself establish which redirect URI, if any, is required. Do not register a guessed callback path; resolve the OAuth interaction mode and backend callback contract first.

