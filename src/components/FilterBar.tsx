import type { FilterCriteria, Internship, WorkMode } from "../lib/types";

const workModes: readonly WorkMode[] = ["Onsite", "Hybrid", "Remote"];

export default function FilterBar({
  criteria,
  internships,
  onChange,
  onClear,
}: {
  criteria: FilterCriteria;
  internships: readonly Internship[];
  onChange: (criteria: FilterCriteria) => void;
  onClear: () => void;
}) {
  const locations = [...new Set(internships.map((internship) => internship.location))].sort();
  const skills = [...new Set(internships.flatMap((internship) => internship.requiredSkills))].sort();

  return (
    <section className="filter-bar" aria-label="Filter internship listings">
      <label className="filter-control">
        Location
        <select
          value={criteria.location}
          onChange={(event) => onChange({ ...criteria, location: event.target.value })}
        >
          <option value="Any">Any location</option>
          {locations.map((location) => <option key={location} value={location}>{location}</option>)}
        </select>
      </label>
      <label className="filter-control">
        Work mode
        <select
          value={criteria.workMode}
          onChange={(event) =>
            onChange({ ...criteria, workMode: event.target.value as WorkMode | "Any" })
          }
        >
          <option value="Any">Any work mode</option>
          {workModes.map((workMode) => <option key={workMode} value={workMode}>{workMode}</option>)}
        </select>
      </label>
      <label className="filter-control">
        Skill
        <select
          value={criteria.skill}
          onChange={(event) => onChange({ ...criteria, skill: event.target.value })}
        >
          <option value="Any">Any skill</option>
          {skills.map((skill) => <option key={skill} value={skill}>{skill}</option>)}
        </select>
      </label>
      <label className="filter-control">
        <span className="fit-range-label">
          <span>Minimum fit</span>
          <output className="fit-range-output">{criteria.minimumFit}%</output>
        </span>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={criteria.minimumFit}
          aria-label="Minimum fit score"
          onChange={(event) =>
            onChange({ ...criteria, minimumFit: Number(event.target.value) })
          }
        />
      </label>
      <button className="text-link filter-clear" type="button" onClick={onClear}>
        Clear filters
      </button>
    </section>
  );
}
