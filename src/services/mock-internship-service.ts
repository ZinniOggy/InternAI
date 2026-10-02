import { internships } from "../data/internships";
import type { FilterCriteria, Internship } from "../lib/types";

function matchesExactLabel(left: string, right: string): boolean {
  return left.toLowerCase() === right.toLowerCase();
}

export function getInternships(): readonly Internship[] {
  return internships;
}

export function getInternshipById(id: string): Internship | undefined {
  return internships.find((internship) => internship.id === id);
}

export function filterInternships(
  criteria: FilterCriteria,
  getFitScore: (internship: Internship) => number,
): Internship[] {
  return internships
    .filter((internship) => {
      const matchesLocation =
        criteria.location === "Any" || matchesExactLabel(internship.location, criteria.location);
      const matchesWorkMode =
        criteria.workMode === "Any" || internship.workMode === criteria.workMode;
      const matchesSkill =
        criteria.skill === "Any" ||
        internship.requiredSkills.some((skill) => matchesExactLabel(skill, criteria.skill));

      return matchesLocation && matchesWorkMode && matchesSkill;
    })
    .map((internship) => ({ internship, score: getFitScore(internship) }))
    .filter(({ score }) => score >= criteria.minimumFit)
    .sort((left, right) => right.score - left.score)
    .map(({ internship }) => internship);
}