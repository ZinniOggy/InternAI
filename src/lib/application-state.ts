import type { ActivityEvent, Application, ApplicationStatus } from "./types";

export type ApplicationAction =
  | "save"
  | "unsave"
  | "prepare"
  | "decline"
  | "approve-and-submit-simulated"
  | "demo-advance"
  | "demo-employer-reject";

type PostApprovalStatus = Extract<
  ApplicationStatus,
  "Assessment" | "Interview" | "Offer" | "Rejected"
>;

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
  status: Extract<ApplicationStatus, "Discovered" | "Saved">,
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
  status: Extract<ApplicationStatus, "Discovered" | "Saved">,
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

function changePostApprovalStatus(
  application: Application,
  status: PostApprovalStatus,
  occurredAt: string,
  message: string,
): Application {
  return {
    ...application,
    status,
    updatedAt: occurredAt,
    activity: [
      ...application.activity,
      createActivity(
        application.id,
        application.activity.length + 1,
        "Status changed",
        occurredAt,
        message,
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

  if (action === "approve-and-submit-simulated") {
    if (existing.decisionOutcome === "Student Declined") {
      throw new Error("Student Declined cannot be approved in the MVP");
    }
    if (
      (existing.status !== "Discovered" && existing.status !== "Saved") ||
      existing.approvedAt !== null
    ) {
      return applications;
    }

    return applications.map((application, index) => {
      if (index !== existingIndex) return application;
      const approvalIndex = application.activity.length + 1;

      return {
        ...application,
        status: "Applied",
        approvedAt: occurredAt,
        updatedAt: occurredAt,
        activity: [
          ...application.activity,
          createActivity(
            application.id,
            approvalIndex,
            "Approved",
            occurredAt,
            "Student explicitly approved the application.",
          ),
          createActivity(
            application.id,
            approvalIndex + 1,
            "Applied (simulated)",
            occurredAt,
            "Simulated — nothing was sent.",
          ),
        ],
      };
    });
  }

  if (existing.decisionOutcome === "Student Declined") return applications;

  if (action === "demo-advance") {
    const nextStatus: Partial<Record<ApplicationStatus, PostApprovalStatus>> = {
      Applied: "Assessment",
      Assessment: "Interview",
      Interview: "Offer",
    };
    const targetStatus = nextStatus[existing.status];
    if (!targetStatus) return applications;

    return applications.map((application, index) =>
      index === existingIndex
        ? changePostApprovalStatus(
            application,
            targetStatus,
            occurredAt,
            `Demo status advanced to ${targetStatus}.`,
          )
        : application,
    );
  }

  if (action === "demo-employer-reject") {
    if (
      existing.status !== "Applied" &&
      existing.status !== "Assessment" &&
      existing.status !== "Interview"
    ) {
      return applications;
    }

    return applications.map((application, index) =>
      index === existingIndex
        ? changePostApprovalStatus(
            application,
            "Rejected",
            occurredAt,
            "Employer rejected the application in the demo.",
          )
        : application,
    );
  }

  if (
    action === "decline" &&
    (existing.status === "Discovered" || existing.status === "Saved")
  ) {
    return applications.map((application, index) => {
      if (index !== existingIndex) return application;
      return {
        ...application,
        decisionOutcome: "Student Declined",
        updatedAt: occurredAt,
        activity: [
          ...application.activity,
          createActivity(
            application.id,
            application.activity.length + 1,
            "Student Declined",
            occurredAt,
            "Student chose not to apply.",
          ),
        ],
      };
    });
  }

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
