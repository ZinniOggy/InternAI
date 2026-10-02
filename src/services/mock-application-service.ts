import {
  getApplicationById as findSeedApplicationById,
  getApplicationCounts as countSeedApplications,
  getSeedApplications,
} from "../data/applications";
import type { Application } from "../lib/types";
import {
  transitionApplications,
  type ApplicationAction,
} from "../lib/application-state";

export function getApplications(): readonly Application[] {
  return getSeedApplications();
}

export function getApplicationById(id: string): Application | undefined {
  return findSeedApplicationById(id);
}

export function getApplicationCounts() {
  return countSeedApplications();
}

export function transitionMockApplications(
  current: readonly Application[],
  internshipId: string,
  action: ApplicationAction,
  occurredAt: string,
): readonly Application[] {
  return transitionApplications(current, internshipId, action, occurredAt);
}