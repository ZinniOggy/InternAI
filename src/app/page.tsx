'use client';

import Link from "next/link";
import InternshipCard from "../components/InternshipCard";
import { useDemoState } from "../context/DemoStateProvider";
import { internships } from "../data/internships";
import { studentProfile } from "../data/student";
import { calculateFitScore } from "../lib/fit-score";
import { APPLICATION_STATUSES, type ApplicationStatus } from "../lib/types";

export default function Home() {
  const { applications } = useDemoState();
  const statusCounts = Object.fromEntries(
    APPLICATION_STATUSES.map((status) => [status, 0]),
  ) as Record<ApplicationStatus, number>;
  let studentDeclinedCount = 0;

  for (const application of applications) {
    if (application.decisionOutcome === "Student Declined") {
      studentDeclinedCount += 1;
    } else {
      statusCounts[application.status] += 1;
    }
  }

  const topMatches = internships
    .map((internship) => ({
      internship,
      evaluation: calculateFitScore(studentProfile, internship),
    }))
    .sort((left, right) => right.evaluation.total - left.evaluation.total)
    .slice(0, 3);

  return (
    <div className="dashboard-page">
      <section className="hero-surface" aria-labelledby="hero-title">
        <div className="hero-content">
          <p className="eyebrow">INTERNSHIP DISCOVERY, WITH CLARITY</p>
          <h1 className="hero-title" id="hero-title">
            Find the internship that fits your next step.
          </h1>
          <p className="hero-summary">
            Explore opportunities with a clear view of what matches your profile.
          </p>
          <Link className="button button-hero" href="/discover">
            Discover internships <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="page-container dashboard-overview" aria-labelledby="profile-title">
        <div className="page-heading">
          <p className="eyebrow">YOUR DASHBOARD</p>
          <h2 className="section-title" id="profile-title">
            Opportunities, with the reasons behind each match.
          </h2>
        </div>
        <div className="dashboard-summary">
          <section className="profile-summary" aria-labelledby="student-profile-title">
            <h3 className="panel-title" id="student-profile-title">Your profile</h3>
            <p className="profile-degree">{studentProfile.degree}</p>
            <p className="profile-muted">
              {studentProfile.university} · {studentProfile.academicYear}
            </p>
            <div className="profile-facts">
              <div>
                <h4>Skills</h4>
                <p>{studentProfile.skills.slice(0, 5).join(" · ")}</p>
              </div>
              <div>
                <h4>Interests</h4>
                <p>{studentProfile.interests.join(" · ")}</p>
              </div>
            </div>
          </section>
          <section className="application-counts" aria-labelledby="application-count-title">
            <h3 className="panel-title" id="application-count-title">Applications</h3>
            <ul>
              {APPLICATION_STATUSES.map((status) => (
                <li key={status}>
                  <span>{status}</span>
                  <strong>{statusCounts[status]}</strong>
                </li>
              ))}
              <li className="declined-count">
                <span>Student Declined</span>
                <strong>{studentDeclinedCount}</strong>
              </li>
            </ul>
            <Link className="text-link" href="/applications">View tracker</Link>
          </section>
        </div>
      </section>

      <section className="page-container top-matches" aria-labelledby="matches-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">MATCHED TO YOUR PROFILE</p>
            <h2 className="section-title" id="matches-title">Top internship matches</h2>
          </div>
          <Link className="text-link" href="/discover">See all internships</Link>
        </div>
        <div className="opportunity-grid">
          {topMatches.map(({ internship, evaluation }) => (
            <InternshipCard key={internship.id} internship={internship} evaluation={evaluation} />
          ))}
        </div>
      </section>

      <section className="teal-band" aria-labelledby="closing-title">
        <div className="teal-inner">
          <h2 className="teal-title" id="closing-title">
            Your next opportunity is waiting to be explored.
          </h2>
          <Link className="button button-teal" href="/discover">
            Discover internships
          </Link>
        </div>
      </section>
      <footer className="site-footer">
        <div className="site-footer-inner">InternAI · Internship discovery assistant</div>
      </footer>
    </div>
  );
}
