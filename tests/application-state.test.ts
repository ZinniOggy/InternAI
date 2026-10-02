import { describe, expect, it } from "vitest";
import {
  transitionApplications,
  type ApplicationAction,
} from "../src/lib/application-state";
import type { Application, ApplicationStatus } from "../src/lib/types";

const internshipId = "transition-test-internship";
const occurredAt = "2026-10-02T10:00:00.000Z";

function application(
  status: ApplicationStatus,
  decisionOutcome: Application["decisionOutcome"] = null,
  approvedAt: string | null = null,
): Application {
  return {
    id: "transition-test-application",
    internshipId,
    status,
    decisionOutcome,
    approvedAt,
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
    activity: [],
  };
}

function apply(
  existing: readonly Application[],
  action: ApplicationAction,
): readonly Application[] {
  return transitionApplications(existing, internshipId, action, occurredAt);
}

describe("transitionApplications", () => {
  it("creates Saved on first Save and Discovered on first Prepare", () => {
    const saved = apply([], "save")[0];
    const prepared = apply([], "prepare")[0];

    expect(saved).toMatchObject({
      status: "Saved",
      decisionOutcome: null,
      approvedAt: null,
      createdAt: occurredAt,
    });
    expect(prepared).toMatchObject({
      status: "Discovered",
      decisionOutcome: null,
      approvedAt: null,
      createdAt: occurredAt,
    });
  });

  it("toggles only Discovered and Saved without changing other states", () => {
    const saved = apply([application("Discovered")], "save")[0];
    const discovered = apply([saved], "unsave")[0];
    const applied = application("Applied", null, occurredAt);

    expect(saved.status).toBe("Saved");
    expect(discovered.status).toBe("Discovered");
    expect(apply([applied], "unsave")[0]).toBe(applied);
  });

  it("does not set Applied from Save, Unsave, Prepare, or Don't apply", () => {
    const actions: ApplicationAction[] = [
      "save",
      "unsave",
      "prepare",
      "decline",
      "demo-advance",
      "demo-employer-reject",
    ];
    const startStates = [application("Discovered"), application("Saved")];

    for (const start of startStates) {
      for (const action of actions) {
        const result = apply([start], action);
        expect(result.every((item) => item.status !== "Applied")).toBe(true);
      }
    }
  });

  it("advances only the documented post-approval stages and treats Rejected as employer rejection", () => {
    const applied = application("Applied", null, occurredAt);
    const assessment = apply([applied], "demo-advance")[0];
    const interview = apply([application("Assessment", null, occurredAt)], "demo-advance")[0];
    const offer = apply([application("Interview", null, occurredAt)], "demo-advance")[0];
    const rejected = apply([applied], "demo-employer-reject")[0];

    expect(assessment.status).toBe("Assessment");
    expect(interview.status).toBe("Interview");
    expect(offer.status).toBe("Offer");
    expect(rejected.status).toBe("Rejected");
    expect(rejected.activity.at(-1)?.message).toContain("Employer rejected");
    expect(apply([application("Offer", null, occurredAt)], "demo-advance")[0].status).toBe("Offer");
    expect(apply([application("Rejected", null, occurredAt)], "demo-advance")[0].status).toBe("Rejected");
    expect(apply([application("Saved")], "demo-employer-reject")[0].status).toBe("Saved");
  });

  it("records Student Declined without changing the application status", () => {
    const start = application("Saved");
    const declined = apply([start], "decline")[0];

    expect(declined.status).toBe("Saved");
    expect(declined.decisionOutcome).toBe("Student Declined");
    expect(declined.approvedAt).toBeNull();
    expect(declined.activity.at(-1)).toMatchObject({ type: "Student Declined" });
  });

  it("atomically sets approvedAt and Applied only through simulated approval", () => {
    const fromDiscovered = apply([application("Discovered")], "approve-and-submit-simulated")[0];
    const fromSaved = apply([application("Saved")], "approve-and-submit-simulated")[0];

    for (const result of [fromDiscovered, fromSaved]) {
      expect(result.status).toBe("Applied");
      expect(result.approvedAt).toBe(occurredAt);
      expect(result.activity.map((event) => event.type)).toContain("Approved");
      expect(result.activity.map((event) => event.type)).toContain("Applied (simulated)");
    }
  });

  it("rejects approval after Student Declined and cannot apply without a record", () => {
    const declined = application("Discovered", "Student Declined");

    expect(() => apply([declined], "approve-and-submit-simulated")).toThrow(
      "Student Declined cannot be approved in the MVP",
    );
    expect(apply([], "approve-and-submit-simulated")).toEqual([]);
  });
});
