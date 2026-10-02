'use client';

import Link from "next/link";
import { useDemoState } from "../context/DemoStateProvider";
import type { FitEvaluation, Internship } from "../lib/types";
import FitScoreBreakdown from "./FitScoreBreakdown";

export default function InternshipDetailsClient({
  internship,
  evaluation,
}: {
  internship: Internship;
  evaluation: FitEvaluation;
}) {
  const { applications, applyToInternship } = useDemoState();
  const application = applications.find((item) => item.internshipId === internship.id);
  const isSaved = application?.status === "Saved";
  const isStudentDeclined = application?.decisionOutcome === "Student Declined";
  const canToggleSave =
    !isStudentDeclined &&
    (!application || application.status === "Discovered" || application.status === "Saved");
  const canPrepare =
    !isStudentDeclined &&
    (!application || application.status === "Discovered" || application.status === "Saved");

  function toggleSaved() {
    applyToInternship(internship.id, isSaved ? "unsave" : "save");
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <p className="eyebrow">INTERNSHIP DETAILS</p>
      </div>
      <div className="internship-details">
        <section className="details-copy" aria-labelledby="internship-title">
          <p className="fit-band">{evaluation.band} fit · {evaluation.total}/100</p>
          <h1 id="internship-title">{internship.title}</h1>
          <p className="details-company">{internship.company}</p>
          <p className="details-description">{internship.description}</p>
          <ul className="details-listing-facts">
            <li><strong>Location:</strong> {internship.location}</li>
            <li><strong>Work mode:</strong> {internship.workMode}</li>
            <li><strong>Duration:</strong> {internship.durationWeeks} weeks</li>
            <li><strong>Start period:</strong> {internship.startPeriod}</li>
            <li><strong>Required skills:</strong> {internship.requiredSkills.join(", ")}</li>
            <li><strong>Domains:</strong> {internship.tags.join(", ")}</li>
          </ul>
          <div className="details-actions">
            <button
              className="button button-secondary"
              type="button"
              aria-pressed={isSaved}
              disabled={!canToggleSave}
              onClick={toggleSaved}
            >
              {isStudentDeclined ? "Student Declined" : isSaved ? "Unsave" : "Save internship"}
            </button>
            <button
              className="button button-primary"
              type="button"
              disabled={!canPrepare}
              onClick={() => applyToInternship(internship.id, "prepare")}
            >
              Prepare application
            </button>
          </div>
          {application && (
            <p className="profile-muted" role="status">
              Current state: {application.decisionOutcome ?? application.status}
            </p>
          )}
        </section>
        <FitScoreBreakdown evaluation={evaluation} />
      </div>
      <p className="details-back-link">
        <Link className="text-link" href="/discover">Back to Discover</Link>
      </p>
    </div>
  );
}
