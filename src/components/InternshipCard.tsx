import Link from "next/link";
import type { FitEvaluation, Internship } from "../lib/types";

export default function InternshipCard({
  internship,
  evaluation,
  headingLevel = 3,
}: {
  internship: Internship;
  evaluation: FitEvaluation;
  headingLevel?: 2 | 3;
}) {
  const TitleHeading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="internship-card">
      <div className="internship-card-top">
        <span className="fit-band">{evaluation.band} fit</span>
        <strong className="fit-score-value">{evaluation.total}/100</strong>
      </div>
      <div>
        <TitleHeading>{internship.title}</TitleHeading>
        <p className="internship-company">{internship.company}</p>
      </div>
      <p className="internship-description">{internship.description}</p>
      <p className="internship-card-meta">
        {internship.location} · {internship.workMode} · {internship.durationWeeks} weeks
      </p>
      <Link className="text-link" href={`/internships/${internship.id}`}>
        View details
      </Link>
    </article>
  );
}
