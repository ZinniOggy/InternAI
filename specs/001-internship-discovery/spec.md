# InternAI Internship Agent MVP

**Feature Branch**: `001-internship-discovery`

**Created**: 2026-10-02

**Status**: Draft

**Input**: Frontend-only demo MVP of a student's flow: Dashboard → Discover → Filter → Details → Fit Score → Prepare → Review/Approve → Track, using mock data.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Discover and evaluate internships for a student profile (Priority: P1)

A student opens the dashboard and sees a read-only profile together with internship recommendations. The dashboard uses a mock student profile and mock internship dataset to surface relevant opportunities, filter the list, and explain the fit score from visible factors such as required skills, interests, location/work mode, and availability/duration.

**Why this priority**: This is the core product value. Students need a clear, explainable path from discovery to match evaluation before they prepare or apply.

**Independent Test**: Can be fully tested by viewing the dashboard, applying filters, and confirming that internship cards are sorted by fit score and each one shows a visible fit explanation.

**Acceptance Scenarios**:

1. **Given** a student profile and a seeded internship dataset, **When** they open the dashboard, **Then** they see a list of internships ranked by fit score with a visible explanation.
2. **Given** one or more filters, **When** the student updates the filters, **Then** the list updates to the matching items and can be cleared back to the full set.
3. **Given** an internship card, **When** the student opens its details, **Then** they see the listing information, fit breakdown, and the actions available for save and prepare.

---

### User Story 2 - Prepare and review generated application materials before any application action (Priority: P1)

A student reviews a resume summary and cover-letter draft generated from the student profile and internship listing facts. The draft is clearly labeled as AI-generated and is read-only. The student must explicitly approve before the app allows the simulated submit action.

**Why this priority**: The approval gate is the safety boundary defined by the constitution and is central to trust and correctness in the product.

**Independent Test**: Can be fully tested by generating a draft, reviewing both read-only generated sections, and confirming that the only approval-driven path to Applied is the explicit "Approve & submit (simulated)" control.

**Acceptance Scenarios**:

1. **Given** an internship with a generated draft, **When** the student opens the review screen, **Then** they see both the resume summary and cover-letter draft labeled as AI-generated and read-only.
2. **Given** the student has not approved the draft, **When** they attempt to apply, **Then** the UI blocks the simulated submission and the state remains unchanged.
3. **Given** the student selects "Approve & submit (simulated)", **When** the action succeeds, **Then** the application status is updated to Applied and the UI shows "Simulated — nothing was sent."

---

### User Story 3 - Track application state and decision outcomes without confusion (Priority: P1)

A student tracks active and past applications, sees activity events in chronological order, and keeps the distinction between an application being rejected by an employer and a student deciding not to apply.

**Why this priority**: The product must make status meaning clear to avoid false signals and maintain trust in demo scenarios.

**Independent Test**: Can be fully tested by selecting applications in the tracker and confirming that the correct state labels, decision semantics, and activity log messages are shown.

**Acceptance Scenarios**:

1. **Given** a saved or applied internship, **When** the student opens the tracker, **Then** all application states are visible and grouped by status.
2. **Given** a student chooses "Don't apply", **When** the outcome is recorded, **Then** the application is marked as a separate Student Declined outcome rather than Rejected.
3. **Given** an employer rejects an application, **When** the status is updated, **Then** the UI shows Rejected and not Student Declined.

---

### User Story 4 - Use the product in a responsive, demo-safe environment (Priority: P2)

A student uses the product on different screen sizes and can reset the demo without losing the intended flow. The interface remains within the approved design system, avoids horizontal scrolling, and keeps the workflow understandable even on mobile widths.

**Why this priority**: The product is a frontend-only demo and must remain usable under realistic device widths while staying within the design constraints.

**Independent Test**: Can be fully tested by resizing to 375px, 768px, and 1280px and confirming that the layout remains readable, the stepper and tracker remain navigable, and no horizontal scroll appears.

**Acceptance Scenarios**:

1. **Given** the app is viewed at 375px width, **When** the student uses the flow, **Then** there is no horizontal scrolling and primary controls remain reachable.
2. **Given** the student selects Reset demo, **When** the system restores the seed data, **Then** the app returns to the intended default state without leaving stale records behind.

---

### Edge Cases

- What happens when a filter combination returns no results and the student needs a way to reset filters?
- What happens when the generated draft requires a fact that is absent from the student profile?
- What happens when the user opens an internship with an invalid or unknown ID?
- What happens when the student resets the demo during the middle of a flow?
- What happens when a mock application is saved, approved, or advanced through the tracker without any external API call?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST present a frontend-only demo MVP for a student workflow: Dashboard → Discover → Filter → Details → Fit Score → Prepare → Review/Approve → Track.
- **FR-002**: The system MUST show a workflow stepper labeled in this order: Dashboard → Discover → Filter → Details → Fit Score → Prepare → Review/Approve → Track. On narrow screens the stepper MAY collapse to 'Step N of 8: <label>'.
- **FR-003**: The system MUST present a read-only mock student profile containing the following fields: University, Degree, Academic year, Skills, Projects, Interests, Preferred locations, Availability, and Internship duration.
- **FR-004**: The system MUST provide a seeded mock profile for the student that is read-only in the MVP and not editable by the student in this release.
- **FR-005**: The system MUST seed a mock internship dataset with 8 to 12 listings covering Dhaka, Remote, and at least two non-matching locations. Each internship MUST include title, company, location, work mode, required skills, duration, and description. Each internship MUST also include domain tags (e.g., AI, Web Development) and a start period, so the interests and availability/duration factors can be computed.
- **FR-006**: The system MUST discover and filter internships by location/work mode, skill, and minimum fit score, and sort the results by fit score from highest to lowest.
- **FR-007**: The system MUST calculate a deterministic fit score from 0 to 100 using four visible factors: required skills, interests, location/work mode, and availability/duration.
- **FR-008**: The system MUST show, for each fit factor, the per-factor points, matched items, missing items, and an overall fit band of Strong, Good, or Partial.
- **FR-009**: The system MUST tag every fact used in the fit explanation with either "Your profile" or "Listing" to show provenance clearly.
- **FR-010**: The system MUST preserve DESIGN.md as the single source of truth for UI appearance, including color tokens, typography, spacing, radius scale, button rules, elevation, responsive behavior, and visual hierarchy.
- **FR-011**: The system MUST centralize design tokens through project-level CSS variables or Tailwind configuration and must not scatter visual decisions across the app.
- **FR-012**: The system MUST not invent student facts. Any missing student profile fact required for draft generation MUST appear as an "Add to profile" placeholder and never be fabricated. The placeholder is non-interactive text because the profile is read-only. At least one seeded listing MUST trigger a placeholder so the demo shows the truthfulness rule.
- **FR-013**: The system MUST generate a resume summary and cover-letter draft using only student-profile and internship-listing facts through a local deterministic generator with no external calls.
- **FR-014**: The system MUST label generated content clearly as "AI-generated" and facts pulled from the profile as "From your profile".
- **FR-015**: The system MUST display an Internship Details screen with listing information, fit breakdown, a Save toggle that switches between Discovered and Saved states, and a Prepare application action.
- **FR-016**: The system MUST show both generated drafts on the review screen in read-only form before approval.
- **FR-017**: The ONLY path to Applied MUST be the explicit action "Approve & submit (simulated)".
- **FR-018**: Without explicit approval, no UI control or state function MUST set Applied.
- **FR-019**: After approval, the UI MUST show "Simulated — nothing was sent." and the application MUST appear in the tracker as Applied.
- **FR-020**: The system MUST provide a separate "Don't apply" action that records a Student Declined decision outcome and must not display it as Rejected.
- **FR-021**: The system MUST keep the seven application states exactly as defined by the product: Discovered, Saved, Applied, Assessment, Interview, Offer, and Rejected.
- **FR-022**: "Student Declined" is a separate decision outcome and MUST NOT be added as an eighth application state.
- **FR-023**: The system MUST display an Application Tracker that lists applications by status, includes seeded examples for Discovered, Saved, Applied, Assessment, Interview, Offer, Rejected, and Student Declined, and shows the activity log for the selected application.
- **FR-024**: When a student approves a draft, the newly approved application MUST appear in the tracker as Applied.
- **FR-025**: The system MUST provide a clearly labeled demo-only control that advances an application that is already Applied or later through Assessment, Interview, and Offer, or to Rejected (employer). It MUST NOT move any application into Applied and MUST NOT bypass the approval gate.
- **FR-026**: The system MUST persist demo state in browser storage so navigation and refresh preserve the current application state, and a clearly labeled "Reset demo" control MUST restore the seed data.
- **FR-027**: The system MUST support responsive layouts at 375px, 768px, and 1280px without horizontal scrolling and in accordance with DESIGN.md breakpoints.
- **FR-028**: The system MUST use semantic HTML, visible keyboard focus states, at least 44px touch targets, and readable WCAG AA contrast.
- **FR-029**: The system MUST handle the following edge cases: no-result filters with a "Clear filters" action, missing profile facts with an "Add to profile" placeholder, invalid internship IDs with a not-found state, and demo reset during the active flow with seed restoration.
- **FR-030**: The system MUST avoid unnecessary MVP scope, including follow-up actions, profile editing, complex incomplete-profile workflows, advanced notification behavior, and unnecessary loading or error states for mock-only data.
- **FR-031**: The product MUST NOT include real internship scraping, authentication, database storage, email integration, real application submission, ML recommendation systems, mentor backends, or advanced notifications.
- **FR-032**: The system MUST keep agent actions observable through a timestamped activity log that records relevant events such as Discovered, Evaluated with score, Draft generated, Approved, Applied (simulated), and status changes.
- **FR-033**: The system MUST support a filter state that allows the student to restore the full list after a no-results state and to sort by fit score.
- **FR-034**: The Dashboard MUST show the demo student's profile summary, the top three internship matches by fit score, a count of applications by status, and a primary 'Discover internships' action.

### Demo Student Profile (Mock Data)

The demo student profile is a sample teaching dataset for the frontend only. The app must use a generic student flow; this data is only for seed/demo realism and not a product requirement for one specific student.

- **University**: University of Dhaka
- **Degree**: BSc in Computer Science and Engineering
- **Academic year**: Senior
- **Skills**: Python, JavaScript, TypeScript, React, Machine Learning, Data Structures, SQL
- **Projects**: "Campus Course Planner", "Crop Disease Classifier", "Community Event Finder"
- **Interests**: AI, Web Development, Data Visualization, Product Design
- **Preferred locations**: Dhaka, Remote
- **Availability**: Available for summer internships, 6-8 weeks
- **Internship duration**: 8 weeks

### Mock Internship Seed Data

1. **AI Research Intern** — OpenAI Labs Bangladesh — Dhaka — Hybrid — Required skills: Python, Machine Learning — Duration: 8 weeks — Description: Research and prototype AI workflows for internal product experiments.
2. **Frontend Engineer Intern** — PixelNest — Dhaka — Onsite — Required skills: React, TypeScript, JavaScript — Duration: 6 weeks — Description: Build UI features for a student marketplace and improve accessibility.
3. **Data Science Intern** — Dhaka Analytics Co. — Dhaka — Remote — Required skills: Python, SQL, Machine Learning — Duration: 8 weeks — Description: Analyze customer behavior data and prepare reports for sales and product teams.
4. **Web Development Intern** — BrightGrid Studio — Remote — Remote — Required skills: React, JavaScript, HTML/CSS — Duration: 10 weeks — Description: Build responsive web experiences for client marketing campaigns.
5. **ML Ops Intern** — NeuralFlow Labs — Remote — Remote — Required skills: Python, Machine Learning, SQL — Duration: 8 weeks — Description: Support model deployment pipelines, monitoring, and validation workflows.
6. **Product Analyst Intern** — SkillBridge Ltd. — Chittagong — Onsite — Required skills: SQL, Data Visualization — Duration: 6 weeks — Description: Analyze learner usage data to improve onboarding and user engagement.
7. **Embedded Systems Intern** — CircuitForge — Sylhet — Onsite — Required skills: C++, Embedded Systems — Duration: 8 weeks — Description: Develop firmware testing scripts and validate hardware interfaces.
8. **Marketing Ops Intern** — NovaReach — Singapore — Remote — Required skills: Data Visualization, SQL — Duration: 6 weeks — Description: Build dashboards to measure campaign conversion and optimize creative performance.
9. **UX Research Intern** — Aster Studio — Remote — Remote — Required skills: Product Design, User Research — Duration: 6 weeks — Description: Interview users and summarize product insights for design decisions.

The seeded internships are intentionally varied so the match logic can produce Strong, Good, and Partial fit bands across the dataset.

### Key Entities *(include if feature involves data)*

- **Student Profile**: The read-only profile for a student, including academic standing, skills, project history, interests, preferred locations, availability, and internship duration.
- **Internship**: A job listing with title, company, location, work mode, required skills, duration, and description.
- **Filter Criteria**: The active conditions used to narrow the list by location/work mode, skills, and minimum fit threshold, with sorting by fit score.
- **Fit Evaluation**: The deterministic 0–100 score and factor breakdown derived from required skills, interests, location/work mode, and availability/duration.
- **Application**: A student application record that tracks status, approval state, and the associated internship.
- **Activity Event**: A timestamped event in the application timeline, such as Discovered, Evaluated with score, Draft generated, Approved, Applied (simulated), or a status change.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A student can complete the Dashboard → Discover → Filter → Details → Fit Score → Prepare → Review → Tracker flow in under 3 minutes without dead ends or unclear transitions.
- **SC-002**: The tracker displays all seven application states with distinct labels, while Student Declined appears as a separate decision outcome rather than a state.
- **SC-003**: There is no horizontal scrolling at 375px, 768px, or 1280px, and the layout remains readable and consistent with DESIGN.md.
- **SC-004**: All user-facing text and controls meet readable WCAG AA contrast requirements and touch targets are at least 44px.
- **SC-005**: The application makes no network calls to external services and all data remains in local mock state or browser storage.
- **SC-006**: Every fit score can be traced to a visible explanation that lists the matched and missing items for each of the four factor groups.
- **SC-007**: The student can distinguish between AI-generated content and profile-sourced facts without ambiguity, and explicit approval is required before any simulated submission occurs.

## Assumptions

- The MVP is a frontend-only experience that uses a mock local dataset and browser storage for demo persistence.
- The product is designed for a generic university student rather than a single fixed persona, while sample seed data may use a representative demo profile.
- The product is intentionally limited to one demo path and does not include backend systems, profile editing, or production-grade integrations.
- Student-provided facts are authoritative, while generated draft content remains clearly labeled and cannot invent missing data.
- The approved design system in DESIGN.md is the source of truth and takes precedence over unrelated style experimentation.
- The state model excludes student-declined as an application state and treats it as a separate outcome from employer rejection.
- The demo may include status advancement controls, but only for local mock demonstration and never as a real external workflow.
- Authentication scope is now governed by [specs/002-authentication/spec.md](../002-authentication/spec.md); all other Spec 001 requirements remain unchanged.
