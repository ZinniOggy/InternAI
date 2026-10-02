'use client';

import { useState } from "react";
import FilterBar from "../../components/FilterBar";
import InternshipCard from "../../components/InternshipCard";
import { studentProfile } from "../../data/student";
import { calculateFitScore } from "../../lib/fit-score";
import type { FilterCriteria } from "../../lib/types";
import { filterInternships, getInternships } from "../../services/mock-internship-service";

const initialCriteria: FilterCriteria = {
  location: "Any",
  workMode: "Any",
  skill: "Any",
  minimumFit: 0,
  sort: "fit-desc",
};

export default function DiscoverPage() {
  const [criteria, setCriteria] = useState(initialCriteria);
  const allInternships = getInternships();
  const filteredInternships = filterInternships(criteria, (internship) =>
    calculateFitScore(studentProfile, internship).total,
  );

  return (
    <div className="page-container">
      <header className="page-heading">
        <p className="eyebrow">DISCOVER</p>
        <h1 className="page-title">Internships that fit your next step.</h1>
        <p className="page-description">
          Filter by location, work mode, skill, and minimum fit score. Results are
          ranked by fit.
        </p>
      </header>
      <FilterBar
        criteria={criteria}
        internships={allInternships}
        onChange={setCriteria}
        onClear={() => setCriteria(initialCriteria)}
      />
      {filteredInternships.length > 0 ? (
        <div className="opportunity-grid">
          {filteredInternships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              evaluation={calculateFitScore(studentProfile, internship)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state" role="status">
          <p>No internships match these filters.</p>
          <button
            className="button button-primary"
            type="button"
            onClick={() => setCriteria(initialCriteria)}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
