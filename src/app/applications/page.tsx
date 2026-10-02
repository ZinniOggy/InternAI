'use client';

import { useState } from "react";
import ActivityTimeline from "../../components/ActivityTimeline";
import StatusBadge from "../../components/StatusBadge";
import { useDemoState } from "../../context/DemoStateProvider";
import { APPLICATION_STATUSES, type ApplicationStatus } from "../../lib/types";
import { getInternshipById } from "../../services/mock-internship-service";

const demoAdvanceStatuses: readonly ApplicationStatus[] = [
  "Applied",
  "Assessment",
  "Interview",
];

export default function ApplicationsPage() {
  const { applications, applyToInternship } = useDemoState();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedApplication =
    applications.find((application) => application.id === selectedId) ?? applications[0];
  const declinedApplications = applications.filter(
    (application) => application.decisionOutcome === "Student Declined",
  );

  return (
    <div className="page-container">
      <header className="page-heading">
        <p className="eyebrow">APPLICATIONS</p>
        <h1 className="page-title">Application tracker</h1>
        <p className="page-description">
          Review each application&apos;s current status and activity history.
        </p>
      </header>

      <div className="tracker-layout">
        <div className="tracker-groups" aria-label="Applications grouped by status">
          {APPLICATION_STATUSES.map((status) => {
            const records = applications.filter((application) => application.status === status);
            return (
              <section className="tracker-group" key={status} aria-labelledby={`group-${status}`}>
                <h2 id={`group-${status}`}>
                  <StatusBadge status={status} />
                  <span>{records.length}</span>
                </h2>
                {records.length > 0 ? (
                  <ul>
                    {records.map((application) => {
                      const internship = getInternshipById(application.internshipId);
                      return (
                        <li key={application.id}>
                          <button
                            className="tracker-record-button"
                            type="button"
                            aria-pressed={selectedApplication?.id === application.id}
                            onClick={() => setSelectedId(application.id)}
                          >
                            <span>{internship?.title ?? "Internship"}</span>
                            <span className="profile-muted">{internship?.company}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="profile-muted">No applications</p>
                )}
              </section>
            );
          })}

          <section className="tracker-group tracker-declined" aria-labelledby="group-declined">
            <h2 id="group-declined">
              <StatusBadge status="Student Declined" />
              <span>{declinedApplications.length}</span>
            </h2>
            {declinedApplications.length > 0 ? (
              <ul>
                {declinedApplications.map((application) => {
                  const internship = getInternshipById(application.internshipId);
                  return (
                    <li key={application.id}>
                      <button
                        className="tracker-record-button"
                        type="button"
                        aria-pressed={selectedApplication?.id === application.id}
                        onClick={() => setSelectedId(application.id)}
                      >
                        <span>{internship?.title ?? "Internship"}</span>
                        <span className="profile-muted">{internship?.company}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="profile-muted">No student-declined decisions</p>
            )}
          </section>
        </div>

        <section className="tracker-detail" aria-labelledby="selected-application-title">
          {selectedApplication ? (
            <>
              <header className="tracker-detail-header">
                <div>
                  <p className="eyebrow">SELECTED APPLICATION</p>
                  <h2 id="selected-application-title">
                    {getInternshipById(selectedApplication.internshipId)?.title ?? "Internship"}
                  </h2>
                </div>
                <StatusBadge
                  status={selectedApplication.decisionOutcome ?? selectedApplication.status}
                />
              </header>
              <ActivityTimeline events={selectedApplication.activity} />
              {demoAdvanceStatuses.includes(selectedApplication.status) &&
                selectedApplication.approvedAt !== null &&
                selectedApplication.decisionOutcome === null && (
                  <div className="demo-advance-actions" aria-label="Demo-only status controls">
                    <p className="eyebrow">DEMO ONLY</p>
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() =>
                        applyToInternship(selectedApplication.internshipId, "demo-advance")
                      }
                    >
                      Advance demo status
                    </button>
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() =>
                        applyToInternship(selectedApplication.internshipId, "demo-employer-reject")
                      }
                    >
                      Demo: employer rejected
                    </button>
                  </div>
                )}
            </>
          ) : (
            <p className="profile-muted">Select an application to view its activity.</p>
          )}
        </section>
      </div>
    </div>
  );
}
