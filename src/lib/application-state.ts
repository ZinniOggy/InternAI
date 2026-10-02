import type { ActivityEvent, Application, ApplicationStatus } from "./types";

export type ApplicationAction = "save" | "unsave" | "prepare";

function createActivity(
  applicationId: string,
  eventIndex: number,
  type: ActivityEvent["type"],
  occurredAt: string,
  message: string,
): ActivityEvent {
  return {
    id: `${applicationId}-event-${eventIndex}`,
    applicationId,
    type,
    occurredAt,
    message,
  };
}

function createApplication(
  internshipId: string,
  status: ApplicationStatus,
  occurredAt: string,
): Application {
  const id = `application-${internshipId}`;
  const activity = [
    createActivity(id, 1, "Discovered", occurredAt, "Opportunity added to discovery."),
  ];

  if (status === "Saved") {
    activity.push(createActivity(id, 2, "Saved", occurredAt, "Student saved this opportunity."));
  }

  return {
    id,
    internshipId,
    status,
    decisionOutcome: null,
    approvedAt: null,
    createdAt: occurredAt,
    updatedAt: occurredAt,
    activity,
  };
}

function changeStatus(
  application: Application,
  status: ApplicationStatus,
  occurredAt: string,
): Application {
  const eventIndex = application.activity.length + 1;

  return {
    ...application,
    status,
    updatedAt: occurredAt,
    activity: [
      ...application.activity,
      createActivity(
        application.id,
        eventIndex,
        status === "Saved" ? "Saved" : "Status changed",
        occurredAt,
        status === "Saved" ? "Student saved this opportunity." : "Student unsaved this opportunity.",
      ),
    ],
  };
}

export function transitionApplications(
  applications: readonly Application[],
  internshipId: string,
  action: ApplicationAction,
  occurredAt = new Date().toISOString(),
): readonly Application[] {
  const existingIndex = applications.findIndex(
    (application) => application.internshipId === internshipId,
  );
  const existing = applications[existingIndex];

  if (!existing) {
    if (action === "save") {
      return [...applications, createApplication(internshipId, "Saved", occurredAt)];
    }
    if (action === "prepare") {
      return [...applications, createApplication(internshipId, "Discovered", occurredAt)];
    }
    return applications;
  }

  if (existing.decisionOutcome === "Student Declined") return applications;

  if (action === "save" && existing.status === "Discovered") {
    return applications.map((application, index) =>
      index === existingIndex ? changeStatus(application, "Saved", occurredAt) : application,
    );
  }

  if (action === "unsave" && existing.status === "Saved") {
    return applications.map((application, index) =>
      index === existingIndex ? changeStatus(application, "Discovered", occurredAt) : application,
    );
  }

  return applications;
}
