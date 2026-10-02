import type { Application, ApplicationStatus } from "../lib/types";

const seedEvents = (
  applicationId: string,
  status: ApplicationStatus,
  occurredAt: string,
  message: string,
) => [
  {
    id: `${applicationId}-created`,
    applicationId,
    type: "Discovered" as const,
    occurredAt: "2026-09-28T09:00:00.000Z",
    message: "Internship discovered.",
  },
  {
    id: `${applicationId}-status`,
    applicationId,
    type: "Status changed" as const,
    occurredAt,
    message,
  },
  ...(status === "Applied" || status === "Assessment" || status === "Interview" || status === "Offer" || status === "Rejected"
    ? [
        {
          id: `${applicationId}-applied`,
          applicationId,
          type: "Applied (simulated)" as const,
          occurredAt: "2026-09-29T10:00:00.000Z",
          message: "Simulated application approved; nothing was sent.",
        },
      ]
    : []),
  ].sort((left, right) => left.occurredAt.localeCompare(right.occurredAt));

export const applications: readonly Application[] = [
  {
    id: "application-discovered",
    internshipId: "ai-research-intern",
    status: "Discovered",
    decisionOutcome: null,
    approvedAt: null,
    createdAt: "2026-09-28T09:00:00.000Z",
    updatedAt: "2026-09-28T09:00:00.000Z",
    activity: seedEvents("application-discovered", "Discovered", "2026-09-28T09:00:00.000Z", "Opportunity added to discovery."),
  },
  {
    id: "application-saved",
    internshipId: "frontend-engineer-intern",
    status: "Saved",
    decisionOutcome: null,
    approvedAt: null,
    createdAt: "2026-09-28T09:00:00.000Z",
    updatedAt: "2026-09-29T09:00:00.000Z",
    activity: seedEvents("application-saved", "Saved", "2026-09-29T09:00:00.000Z", "Student saved this opportunity."),
  },
  {
    id: "application-applied",
    internshipId: "data-science-intern",
    status: "Applied",
    decisionOutcome: null,
    approvedAt: "2026-09-29T10:00:00.000Z",
    createdAt: "2026-09-28T09:00:00.000Z",
    updatedAt: "2026-09-29T10:00:00.000Z",
    activity: seedEvents("application-applied", "Applied", "2026-09-29T10:00:00.000Z", "Application approved and simulated."),
  },
  {
    id: "application-assessment",
    internshipId: "web-development-intern",
    status: "Assessment",
    decisionOutcome: null,
    approvedAt: "2026-09-29T10:00:00.000Z",
    createdAt: "2026-09-28T09:00:00.000Z",
    updatedAt: "2026-09-30T11:00:00.000Z",
    activity: seedEvents("application-assessment", "Assessment", "2026-09-30T11:00:00.000Z", "Status advanced to Assessment."),
  },
  {
    id: "application-interview",
    internshipId: "ml-ops-intern",
    status: "Interview",
    decisionOutcome: null,
    approvedAt: "2026-09-29T10:00:00.000Z",
    createdAt: "2026-09-28T09:00:00.000Z",
    updatedAt: "2026-10-01T12:00:00.000Z",
    activity: seedEvents("application-interview", "Interview", "2026-10-01T12:00:00.000Z", "Status advanced to Interview."),
  },
  {
    id: "application-offer",
    internshipId: "product-analyst-intern",
    status: "Offer",
    decisionOutcome: null,
    approvedAt: "2026-09-29T10:00:00.000Z",
    createdAt: "2026-09-28T09:00:00.000Z",
    updatedAt: "2026-10-02T08:00:00.000Z",
    activity: seedEvents("application-offer", "Offer", "2026-10-02T08:00:00.000Z", "Status advanced to Offer."),
  },
  {
    id: "application-rejected",
    internshipId: "embedded-systems-intern",
    status: "Rejected",
    decisionOutcome: null,
    approvedAt: "2026-09-29T10:00:00.000Z",
    createdAt: "2026-09-28T09:00:00.000Z",
    updatedAt: "2026-10-02T08:30:00.000Z",
    activity: seedEvents("application-rejected", "Rejected", "2026-10-02T08:30:00.000Z", "Employer rejected the application."),
  },
  {
    id: "application-student-declined",
    internshipId: "ux-research-intern",
    status: "Saved",
    decisionOutcome: "Student Declined",
    approvedAt: null,
    createdAt: "2026-09-28T09:00:00.000Z",
    updatedAt: "2026-10-01T08:00:00.000Z",
    activity: [
      {
        id: "application-student-declined-created",
        applicationId: "application-student-declined",
        type: "Discovered",
        occurredAt: "2026-09-28T09:00:00.000Z",
        message: "Opportunity added to discovery.",
      },
      {
        id: "application-student-declined-decision",
        applicationId: "application-student-declined",
        type: "Student Declined",
        occurredAt: "2026-10-01T08:00:00.000Z",
        message: "Student chose not to apply.",
      },
    ],
  },
];

export function getSeedApplications(): readonly Application[] {
  return applications;
}

export function getApplicationById(id: string): Application | undefined {
  return applications.find((application) => application.id === id);
}

export function getApplicationCounts(): {
  byStatus: Record<ApplicationStatus, number>;
  studentDeclined: number;
} {
  const byStatus: Record<ApplicationStatus, number> = {
    Discovered: 0,
    Saved: 0,
    Applied: 0,
    Assessment: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  };
  let studentDeclined = 0;

  for (const application of applications) {
    byStatus[application.status] += 1;
    if (application.decisionOutcome === "Student Declined") {
      studentDeclined += 1;
    }
  }

  return { byStatus, studentDeclined };
}