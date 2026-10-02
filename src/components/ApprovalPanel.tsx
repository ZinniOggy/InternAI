'use client';

import type { ApplicationDraft } from "../lib/types";
import DraftPreview from "./DraftPreview";

export default function ApprovalPanel({
  draft,
  approved,
  declined,
  canApprove,
  onApprove,
  onDecline,
}: {
  draft: ApplicationDraft;
  approved: boolean;
  declined: boolean;
  canApprove: boolean;
  onApprove: () => void;
  onDecline: () => void;
}) {
  return (
    <section className="approval-review" aria-labelledby="review-title">
      <header className="page-heading">
        <p className="eyebrow">PREPARE · REVIEW</p>
        <h1 className="page-title" id="review-title">Review your application drafts</h1>
        <p className="page-description">
          Both drafts are read-only. Review the profile facts and listing details before deciding.
        </p>
      </header>

      <div className="draft-preview-grid">
        <DraftPreview title="Resume summary" blocks={draft.resumeSummary} />
        <DraftPreview title="Cover-letter draft" blocks={draft.coverLetter} />
      </div>

      {approved ? (
        <p className="approval-confirmation" role="status">
          Simulated — nothing was sent.
        </p>
      ) : declined ? (
        <p className="approval-declined" role="status">
          Student Declined
        </p>
      ) : (
        <div className="approval-actions" aria-label="Application decision">
          <button
            className="button button-primary"
            type="button"
            disabled={!canApprove}
            onClick={onApprove}
          >
            Approve &amp; submit (simulated)
          </button>
          <button
            className="button button-secondary"
            type="button"
            disabled={!canApprove}
            onClick={onDecline}
          >
            Don&apos;t apply
          </button>
        </div>
      )}
    </section>
  );
}
