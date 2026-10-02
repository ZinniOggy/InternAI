# Data Model: InternAI Internship Agent MVP

This model supports the approved local demo only. Seed data is typed and separate from domain logic. Components and logic do not depend on a specific student's name or skills.

## Student Profile

One immutable seed record, stored in `src/data/student.ts`.

| Field | Type | Validation / use |
|---|---|---|
| `id` | `string` | Stable fixture identifier. |
| `university` | `string` | Required profile fact. |
| `degree` | `string` | Required profile fact. |
| `academicYear` | `string` | Required profile fact. |
| `skills` | `string[]` | Used only as provided for fit and draft content. |
| `projects` | `{ name: string; summary: string }[]` | Use only seeded facts; no inferred achievements. |
| `interests` | `string[]` | Compared with internship domain tags. |
| `preferredLocations` | `string[]` | Exact location or Remote preference. |
| `availability` | `{ startPeriods: string[]; maxDurationWeeks: number }` | Compared with listing start period and duration. |
| `internshipDurationWeeks` | `number` | Positive duration preference for fit. |

Profile is read-only in the MVP. Missing values stay missing; there is no profile editing or complex completion workflow.

## Internship

Nine typed records in `src/data/internships.ts`; company names are fictional. Every record includes all required fields.

| Field | Type | Validation / use |
|---|---|---|
| `id` | `string` | Stable route identifier; unknown IDs render not-found state. |
| `title`, `company`, `location`, `description` | `string` | Required listing details. |
| `workMode` | `'Onsite' \| 'Hybrid' \| 'Remote'` | Used by location/work-mode factor and filter. |
| `requiredSkills` | `string[]` | Used for skill filter and required-skills factor. |
| `durationWeeks` | `number` | Positive integer; compared with profile capacity/preference. |
| `tags` | `string[]` | Listing domain tags compared with student interests. |
| `startPeriod` | `string` | Named period compared with student availability. |

Seed coverage includes Dhaka and Remote, plus Chittagong, Sylhet, and Singapore. The nine role concepts remain those in the spec; company names are fictional. The UX Research Intern requires `User Research`, which is absent from the profile, and exercises the missing-fact placeholder.

## Filter Criteria

| Field | Type | Validation / use |
|---|---|---|
| `location` | `string \| 'Any'` | Matches a listing location. |
| `workMode` | `WorkMode \| 'Any'` | Matches a listing work mode. |
| `skill` | `string \| 'Any'` | Matches one required skill. |
| `minimumFit` | `number` | Integer from 0 through 100. |
| `sort` | `'fit-desc'` | Fixed descending fit-score order. |

Filtering is deterministic and applied to the full listing set; `Clear filters` restores default criteria.

## Fit Evaluation

Pure result from `src/lib/fit-score.ts`; no persistence required.

| Field | Type | Validation / use |
|---|---|---|
| `internshipId` | `string` | Listing evaluated. |
| `total` | `number` | Integer from 0 to 100; sum of factor points. |
| `band` | `'Strong' \| 'Good' \| 'Partial'` | Strong ≥75; Good 50–74; Partial <50. |
| `factors` | `FitFactor[]` | Exactly four ordered factors. |

Each `FitFactor` contains `key`, `earnedPoints`, `maxPoints`, `matchedItems`, `missingItems`, and evidence facts with source tag `'Your profile' | 'Listing'`.

| Factor | Maximum points | Deterministic rule |
|---|---:|---|
| Required skills | 50 | `round(50 × matched required skills / required skill count)`; each skill uses exact case-insensitive token matching. |
| Interests | 20 | `round(20 × matched listing tags / listing tag count)`; a match is a case-insensitive exact match to a profile interest. |
| Location/work mode | 20 | Full points when a Remote listing is preferred as Remote, or when a non-Remote listing location exactly matches a preferred location; otherwise zero. |
| Availability/duration | 10 | Full points when `startPeriod` is in profile availability and `durationWeeks` does not exceed the profile's maximum; otherwise zero. |

Matched and missing items are returned for each factor, including location/work-mode and availability/duration facts. All score evidence is tagged by source; no generated inference participates in scoring.

## Application

Persisted in `src/context/DemoStateProvider.tsx` localStorage state and seeded by `src/data/applications.ts`.

| Field | Type | Validation / use |
|---|---|---|
| `id` | `string` | Stable application identifier. |
| `internshipId` | `string` | Must reference a seeded listing. |
| `status` | `ApplicationStatus` | Exactly Discovered, Saved, Applied, Assessment, Interview, Offer, or Rejected. |
| `decisionOutcome` | `'Student Declined' \| null` | Separate from `status`; never presented as Employer Rejected. |
| `approvedAt` | `string \| null` | ISO timestamp; required before status can become Applied. |
| `createdAt`, `updatedAt` | `string` | ISO timestamps. |
| `activity` | `ActivityEvent[]` | Ordered timestamped history. |

An application is created on first Save or Prepare. The approval transition requires explicit `Approve & submit (simulated)` intent and sets `approvedAt` plus Applied. The demo advancement intent is valid only from Applied, Assessment, Interview, or Offer and cannot transition into Applied. `Don't apply` records `decisionOutcome: 'Student Declined'` without adding an application state.

## Draft and Provenance

The pure generator returns a read-only resume summary and cover-letter draft. Each displayed block has `content`, `label` (`'AI-generated'` or `'From your profile'`), and source references. An unavailable required fact is represented by literal non-interactive `Add to profile` placeholder text; the generator never fills it with a guess. The UX Research listing must produce at least one such placeholder.

## Activity Event

| Field | Type | Validation / use |
|---|---|---|
| `id` | `string` | Unique within the local demo state. |
| `applicationId` | `string` | Owning application. |
| `type` | `'Discovered' \| 'Evaluated' \| 'Draft generated' \| 'Approved' \| 'Applied (simulated)' \| 'Status changed' \| 'Student Declined' \| 'Saved'` | Relevant visible workflow event. |
| `occurredAt` | `string` | ISO timestamp. |
| `message` | `string` | Concise event description; score events include the numeric score. |

Events are appended through the same state transitions that mutate an application, then persisted with the application record.

## Demo State

One context-owned state object contains the seed profile reference, fixture-derived application records, current filters, and persistence version. On first client hydration, initialize from localStorage when valid or seed data otherwise. Reset replaces persisted demo state with the original seed. No network-backed state is present.
