import {
  getApplicationById as findSeedApplicationById,
  getApplicationCounts as countSeedApplications,
  getSeedApplications,
} from "../data/applications";
import type { Application } from "../lib/types";

export function getApplications(): readonly Application[] {
  return getSeedApplications();
}

export function getApplicationById(id: string): Application | undefined {
  return findSeedApplicationById(id);
}

export function getApplicationCounts() {
  return countSeedApplications();
}