# InternAI Agent Instructions

## Project

InternAI is an AI-powered internship discovery and application assistant
for university students.

## Goal

Help university students discover relevant internship opportunities,
understand why they match, prepare applications, request student approval,
and track application progress.

## Core Workflow

Discover
→ Filter
→ Evaluate
→ Prepare
→ Ask Approval
→ Apply
→ Track

## Student Profile

The system should support:

- University
- Degree
- Academic year
- Skills
- Projects
- Preferred locations
- Availability
- Internship duration

## Agent Responsibilities

The agent should:

1. Discover internship opportunities.
2. Filter opportunities based on the student's preferences and requirements.
3. Evaluate compatibility between the student and opportunities.
4. Explain why an opportunity matches the student.
5. Prepare application materials.
6. Ask the student for explicit approval.
7. Proceed with application actions only after approval.
8. Track application status.

## Application States

- Discovered
- Saved
- Applied
- Assessment
- Interview
- Offer
- Rejected

## Human Approval

The agent must never submit an application without explicit student approval.

The student must be able to review generated application materials before
any submission.

## Truthfulness

The agent must never invent:

- Skills
- Education
- Work experience
- Projects
- Achievements
- Certifications

Generated content must be clearly distinguishable from information
provided by the student.

## Privacy and Security

- Do not expose API keys or secrets in frontend code.
- Do not unnecessarily expose student personal information.
- Validate user input.
- Handle errors safely.

## Engineering Principles

- Keep components modular.
- Prefer simple solutions.
- Write tests for important functionality.
- Keep agent actions observable.
- Document important architectural decisions.
- Avoid unnecessary complexity.

## UI

The UI must follow `DESIGN.md`.

Do not introduce unrelated visual styles.

## Development Process

Follow the project's Spec Kit specification, plan, and tasks.

Do not implement major features that are not represented in the approved
specification without updating the specification.