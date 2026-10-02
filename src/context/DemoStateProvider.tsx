'use client';

import { createContext, useContext, useState, type ReactNode } from "react";
import { getSeedApplications } from "../data/applications";
import {
  transitionApplications,
  type ApplicationAction,
} from "../lib/application-state";
import type { Application } from "../lib/types";

interface DemoStateValue {
  applications: readonly Application[];
  applyToInternship: (internshipId: string, action: ApplicationAction) => void;
}

const DemoStateContext = createContext<DemoStateValue | null>(null);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<readonly Application[]>(getSeedApplications);

  function applyToInternship(internshipId: string, action: ApplicationAction) {
    const occurredAt = new Date().toISOString();
    setApplications((current) =>
      transitionApplications(current, internshipId, action, occurredAt),
    );
  }

  return (
    <DemoStateContext.Provider value={{ applications, applyToInternship }}>
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
