'use client';

import Link from "next/link";
import { useDemoState } from "../context/DemoStateProvider";
import type { ApplicationDraft } from "../lib/types";
import ApprovalPanel from "./ApprovalPanel";

export default function PrepareReviewClient({
  internshipId,
  draft,
}: {
  internshipId: string;
  draft: ApplicationDraft;
}) {
  const { applications, applyToInternship } = useDemoState();
  const application = applications.find((item) => item.internshipId === internshipId);
  const approved = application?.status === "Applied" && application.approvedAt !== null;
  const declined = application?.decisionOutcome === "Student Declined";
  const canApprove =
    !approved &&
    !declined &&
    (!application || application.status === "Discovered" || application.status === "Saved");

  return (
    <div className="page-container">
      <ApprovalPanel
        draft={draft}
        approved={approved}
        declined={declined}
        canApprove={canApprove}
        onApprove={() => applyToInternship(internshipId, "approve-and-submit-simulated")}
        onDecline={() => applyToInternship(internshipId, "decline")}
      />
      {application && (
        <p className="profile-muted" role="status">
          Application state: {application.decisionOutcome ?? application.status}
        </p>
      )}
      <Link className="text-link" href={`/internships/${internshipId}`}>
        Back to internship details
      </Link>
    </div>
  );
}
