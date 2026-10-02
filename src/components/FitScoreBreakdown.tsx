import type { FitEvaluation, FitFactorKey } from "../lib/types";
import ProvenanceBadge from "./ProvenanceBadge";

const factorLabels: Record<FitFactorKey, string> = {
  requiredSkills: "Required skills",
  interests: "Interests",
  locationWorkMode: "Location and work mode",
  availabilityDuration: "Availability and duration",
};

export default function FitScoreBreakdown({ evaluation }: { evaluation: FitEvaluation }) {
  return (
    <section className="fit-breakdown" aria-labelledby="fit-breakdown-title">
      <div className="fit-score-heading">
        <div>
          <p className="eyebrow">DETERMINISTIC MATCH</p>
          <h2 id="fit-breakdown-title">Fit score</h2>
        </div>
        <div className="internship-card-top">
          <span className="fit-band">{evaluation.band}</span>
          <strong className="fit-score-value">{evaluation.total}/100</strong>
        </div>
      </div>
      <div className="fit-factor-list">
        {evaluation.factors.map((factor) => (
          <section className="fit-factor" key={factor.key}>
            <div className="fit-factor-heading">
              <h3>{factorLabels[factor.key]}</h3>
              <span className="fit-factor-points">
                {factor.earnedPoints}/{factor.maxPoints} points
              </span>
            </div>
            <div className="fit-evidence-columns">
              <div>
                <h4>Matched</h4>
                {factor.matchedItems.length > 0 ? (
                  <ul>
                    {factor.matchedItems.map((fact, index) => (
                      <li key={`${fact.source}-${fact.item}-${index}`}>
                        <span>{fact.item}</span>
                        <ProvenanceBadge source={fact.source} />
                      </li>
                    ))}
                  </ul>
                ) : <p className="profile-muted">No matched items</p>}
              </div>
              <div>
                <h4>Missing</h4>
                {factor.missingItems.length > 0 ? (
                  <ul>
                    {factor.missingItems.map((fact, index) => (
                      <li key={`${fact.source}-${fact.item}-${index}`}>
                        <span>{fact.item}</span>
                        <ProvenanceBadge source={fact.source} />
                      </li>
                    ))}
                  </ul>
                ) : <p className="profile-muted">No missing items</p>}
              </div>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
