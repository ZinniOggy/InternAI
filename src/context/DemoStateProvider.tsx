'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSeedApplications } from "../data/applications";
import { getInternships } from "../services/mock-internship-service";
import type { ApplicationAction } from "../lib/application-state";
import { transitionMockApplications } from "../services/mock-application-service";
import {
  APPLICATION_STATUSES,
  type ActivityEvent,
  type ActivityEventType,
  type Application,
  type ApplicationStatus,
} from "../lib/types";

const STORAGE_KEY = "internai-demo-state";
const PERSISTENCE_VERSION = 1;

interface PersistedDemoState {
  version: number;
  applications: readonly Application[];
}

interface DemoStateValue {
  applications: readonly Application[];
  isHydrated: boolean;
  applyToInternship: (internshipId: string, action: ApplicationAction) => void;
  resetDemo: () => void;
}

const DemoStateContext = createContext<DemoStateValue | null>(null);
const validEventTypes: readonly ActivityEventType[] = [
  "Discovered",
  "Evaluated",
  "Draft generated",
  "Approved",
  "Applied (simulated)",
  "Status changed",
  "Student Declined",
  "Saved",
];
const validInternshipIds = new Set(getInternships().map((internship) => internship.id));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTimestamp(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return typeof value === "string" && APPLICATION_STATUSES.includes(value as ApplicationStatus);
}

function isActivityEvent(value: unknown): value is ActivityEvent {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.applicationId === "string" &&
    typeof value.type === "string" &&
    validEventTypes.includes(value.type as ActivityEventType) &&
    isTimestamp(value.occurredAt) &&
    typeof value.message === "string"
  );
}

function isApplication(value: unknown): value is Application {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.internshipId !== "string" ||
    !validInternshipIds.has(value.internshipId) ||
    !isApplicationStatus(value.status) ||
    !(value.decisionOutcome === null || value.decisionOutcome === "Student Declined") ||
    !(value.approvedAt === null || isTimestamp(value.approvedAt)) ||
    !isTimestamp(value.createdAt) ||
    !isTimestamp(value.updatedAt) ||
    !Array.isArray(value.activity) ||
    !value.activity.every(isActivityEvent)
  ) {
    return false;
  }

  const requiresApproval = !["Discovered", "Saved"].includes(value.status);
  if (requiresApproval !== (value.approvedAt !== null)) return false;
  if (
    value.decisionOutcome === "Student Declined" &&
    (requiresApproval || value.approvedAt !== null)
  ) {
    return false;
  }

  return true;
}

function parsePersistedState(raw: string): readonly Application[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      !isRecord(parsed) ||
      parsed.version !== PERSISTENCE_VERSION ||
      !Array.isArray(parsed.applications) ||
      !parsed.applications.every(isApplication)
    ) {
      return null;
    }

    const applicationIds = new Set(parsed.applications.map((application) => application.id));
    const internshipIds = new Set(parsed.applications.map((application) => application.internshipId));
    if (
      applicationIds.size !== parsed.applications.length ||
      internshipIds.size !== parsed.applications.length
    ) {
      return null;
    }

    return parsed.applications;
  } catch {
    return null;
  }
}

function writePersistedState(applications: readonly Application[]): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: PERSISTENCE_VERSION, applications } satisfies PersistedDemoState),
    );
  } catch {
    // Storage can be unavailable or full; the in-memory demo remains usable.
  }
}

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<readonly Application[]>(getSeedApplications);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw !== null) {
        const persistedApplications = parsePersistedState(raw);
        if (persistedApplications !== null) setApplications(persistedApplications);
      }
    } catch {
      // Keep the seed state when browser storage is blocked.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) writePersistedState(applications);
  }, [applications, isHydrated]);

  function applyToInternship(internshipId: string, action: ApplicationAction) {
    const occurredAt = new Date().toISOString();
    setApplications((current) =>
      transitionMockApplications(current, internshipId, action, occurredAt),
    );
  }

  function resetDemo() {
    const seedApplications = getSeedApplications();
    setApplications(seedApplications);
    if (isHydrated) writePersistedState(seedApplications);
  }

  return (
    <DemoStateContext.Provider value={{ applications, isHydrated, applyToInternship, resetDemo }}>
      {children}
    </DemoStateContext.Provider>
  );
}

export function useDemoState(): DemoStateValue {
  const context = useContext(DemoStateContext);
  if (!context) {
    throw new Error("useDemoState must be used within DemoStateProvider");
  }
  return context;
}
