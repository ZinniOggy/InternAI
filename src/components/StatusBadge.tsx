import type { ApplicationStatus } from "../lib/types";

export type VisibleApplicationStatus = ApplicationStatus | "Student Declined";

export default function StatusBadge({ status }: { status: VisibleApplicationStatus }) {
  return <span className="status-badge">{status}</span>;
}
