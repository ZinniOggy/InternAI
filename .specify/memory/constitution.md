# InternAI Constitution

<!-- Sync Impact Report
Version change: n/a -> 1.0.0
Modified principles: n/a (new constitution)
Added sections: Core Principles, Product Constraints, Development Workflow, Governance
Removed sections: n/a
Follow-up TODOs: none
-->

## Core Principles

### I. Human Approval Is Mandatory (NON-NEGOTIABLE)
No application may ever be submitted, or appear as submitted, without an explicit student approval action. The student must be able to review the generated resume, cover letter, and application summary before approving. For this MVP, "Apply" is simulated only: it changes local mock state and sends nothing to any external service.

Rationale: Student consent is the safety boundary. The product must never treat a generated application as real until the student expressly approves it.

### II. Truthfulness and Provenance (NON-NEGOTIABLE)
The system must never invent student skills, education, work experience, projects, achievements, or certifications. Every generated artifact must clearly distinguish AI-generated content from student-provided content using labels such as "AI-generated" and "From your profile". Fit-score explanations must cite only facts present in the student profile and internship data.

Rationale: Trust depends on factual integrity. A fit score is only credible if it is based on visible, checkable inputs.

### III. Design Fidelity
DESIGN.md is the single source of truth for the interface. The product must follow its color tokens, typography, font weights, spacing, radius scale, button rules, elevation, responsive behavior, and visual hierarchy. All design tokens must be centralized through CSS variables or Tailwind configuration; no ad hoc visual styles or unrelated accent treatments are permitted.

Rationale: The MVP is judged against the approved design, not against a different visual language. Design fidelity is a product requirement, not a preference.

### IV. Demo-First Simplicity
This is a time-boxed frontend MVP with about ten working hours. The team must prioritize working end-to-end flow, fidelity to DESIGN.md, explainable fit score, application preparation and review, application tracking, responsive layout, and a bug-free demo. Mock data stays behind a typed service/data layer so a real backend can replace it later.

Out of scope: real internship scraping, real application submission, authentication, database, email integration, ML recommendation system, mentor backend, advanced notification system, or any other work outside the approved specification. Any work outside the approved specification requires a specification update first.

Rationale: Demo value comes from shipping the correct flow clearly and reliably, not from building speculative infrastructure.

### V. Observable Agent Actions
The student workflow must make the agent's actions visible: Discover → Filter → Evaluate → Prepare → Ask Approval → Apply → Track. Important actions must appear in UI elements such as an activity history or timeline, and the fit score must be explainable and deterministic from visible factors rather than an opaque AI-generated number.

Rationale: Students must be able to understand what the agent is doing, why it is doing it, and which facts drive the recommendation.

## Product Constraints

- Application states: Discovered, Saved, Applied, Assessment, Interview, Offer, Rejected.
- "Student Declined / Not Applying" means the student chose not to apply. "Employer Rejected" means the employer rejected an application after submission. The product must not conflate these meanings.
- Demo persona: Alice, a Computer Science senior in Dhaka, with Python, Machine Learning, and React skills, interests in AI and Web Development, and preferred locations of Dhaka and Remote.
- The product must validate user input, avoid unnecessary exposure of personal information, and not expose secrets or API keys in frontend code.
- The product must use Next.js App Router, TypeScript, and Tailwind CSS without adding another UI framework.

## Development Workflow

- Constitution → Specify → Review specification → Plan → Review plan → Tasks → Implement.
- All implementation work occurs on the existing frontend branch.
- The implementation plan must include a Constitution Check verifying compliance with these principles.
- Use modular, strictly typed TypeScript components and prioritize tests for fit-score calculation and approval gate. If time permits, add one happy-path smoke test for the Alice demo flow.
- Follow accessibility basics: semantic HTML, keyboard focus, minimum 44px touch targets, readable contrast, and graceful loading, error, and empty states.

## Governance
The constitution supersedes conflicting project practices. Amendments require a version bump and a short rationale. Any change to core rules or product constraints must be reviewed against the approved specification, the design source of truth, and the current implementation status before approval.

**Version**: 1.0.0 | **Ratified**: 2026-10-02 | **Last Amended**: 2026-10-02
