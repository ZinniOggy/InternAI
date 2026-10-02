import { describe, expect, it } from "vitest";
import { internships } from "../src/data/internships";
import { studentProfile } from "../src/data/student";
import { calculateFitScore } from "../src/lib/fit-score";
import type { Internship, StudentProfile } from "../src/lib/types";

const smallProfile: StudentProfile = {
  id: "profile-one",
  university: "Example University",
  degree: "BSc Computer Science",
  academicYear: "Third year",
  skills: ["Python", "AI"],
  projects: [],
  interests: ["AI"],
  preferredLocations: ["Remote"],
  availability: {
    startPeriods: ["Summer 2026"],
    maxDurationWeeks: 8,
  },
  internshipDurationWeeks: 6,
};

const weightedInternship: Internship = {
  id: "weighted-role",
  title: "Data Intern",
  company: "Example Company",
  location: "Remote",
  workMode: "Remote",
  requiredSkills: ["python", "SQL"],
  durationWeeks: 6,
  description: "Analyze data for a small product team.",
  tags: ["ai", "Web Development"],
  startPeriod: "Summer 2026",
};

const makeScoringCase = (
  id: string,
  requiredSkills: readonly string[],
  tags: readonly string[],
  startPeriod = "Summer 2026",
): Internship => ({
  ...weightedInternship,
  id,
  requiredSkills,
  tags,
  startPeriod,
});

const boundaryProfile: StudentProfile = {
  ...smallProfile,
  skills: ["Python", "SQL", "JavaScript", "React"],
  interests: [
    "AI",
    "Web Development",
    "Product Design",
    "Data Visualization",
    "Python",
    "SQL",
    "React",
  ],
  availability: {
    startPeriods: ["Summer 2026"],
    maxDurationWeeks: 8,
  },
};

describe("calculateFitScore", () => {
  it("calculates deterministic weighted factors and reports matched, missing, and source evidence", () => {
    const evaluation = calculateFitScore(smallProfile, weightedInternship);

    expect(calculateFitScore(smallProfile, weightedInternship)).toEqual(evaluation);
    expect(evaluation).toMatchObject({
      internshipId: "weighted-role",
      total: 65,
      band: "Good",
      factors: [
        { key: "requiredSkills", earnedPoints: 25, maxPoints: 50 },
        { key: "interests", earnedPoints: 10, maxPoints: 20 },
        { key: "locationWorkMode", earnedPoints: 20, maxPoints: 20 },
        { key: "availabilityDuration", earnedPoints: 10, maxPoints: 10 },
      ],
    });

    const [skills, interests, location, availability] = evaluation.factors;
    expect(skills.matchedItems).toEqual([
      { item: "Python", source: "Your profile" },
      { item: "python", source: "Listing" },
    ]);
    expect(skills.missingItems).toEqual([{ item: "SQL", source: "Listing" }]);
    expect(interests.matchedItems).toEqual([
      { item: "AI", source: "Your profile" },
      { item: "ai", source: "Listing" },
    ]);
    expect(interests.missingItems).toEqual([
      { item: "Web Development", source: "Listing" },
    ]);
    expect(location.matchedItems).toContainEqual({
      item: "Remote",
      source: "Your profile",
    });
    expect(location.matchedItems).toContainEqual({
      item: "Remote",
      source: "Listing",
    });
    expect(availability.matchedItems).toContainEqual({
      item: "Summer 2026",
      source: "Your profile",
    });
    expect(availability.matchedItems).toContainEqual({
      item: "6 weeks",
      source: "Listing",
    });

    for (const factor of evaluation.factors) {
      expect(factor.earnedPoints).toBeGreaterThanOrEqual(0);
      expect(factor.earnedPoints).toBeLessThanOrEqual(factor.maxPoints);
      expect([...factor.matchedItems, ...factor.missingItems].every((fact) =>
        fact.source === "Your profile" || fact.source === "Listing",
      )).toBe(true);
    }
  });

  it("scores empty listing skill and tag factors as zero", () => {
    const listing = makeScoringCase("empty-lists", [], []);
    const evaluation = calculateFitScore(smallProfile, listing);

    expect(evaluation.factors[0]).toMatchObject({
      key: "requiredSkills",
      earnedPoints: 0,
      maxPoints: 50,
      matchedItems: [],
      missingItems: [],
    });
    expect(evaluation.factors[1]).toMatchObject({
      key: "interests",
      earnedPoints: 0,
      maxPoints: 20,
      matchedItems: [],
      missingItems: [],
    });
  });

  it("requires exact item matches and both availability conditions", () => {
    const listing = makeScoringCase(
      "missing-facts",
      ["Python Programming"],
      ["Artificial Intelligence"],
      "Winter 2027",
    );
    const evaluation = calculateFitScore(smallProfile, listing);

    expect(evaluation.factors[0].earnedPoints).toBe(0);
    expect(evaluation.factors[1].earnedPoints).toBe(0);
    expect(evaluation.factors[1].missingItems).toEqual([
      { item: "Artificial Intelligence", source: "Listing" },
    ]);
    expect(evaluation.factors[2].earnedPoints).toBe(20);
    expect(evaluation.factors[3].earnedPoints).toBe(0);
    expect(evaluation.factors[3].missingItems).toContainEqual({
      item: "Winter 2027",
      source: "Listing",
    });
  });

  it("uses the documented Good/Strong threshold at scores 74 and 75", () => {
    const goodListing: Internship = {
      ...weightedInternship,
      id: "good-boundary",
      location: "Chittagong",
      workMode: "Onsite",
      requiredSkills: ["Python", "SQL", "JavaScript", "React"],
      tags: [
        "AI",
        "Web Development",
        "Product Design",
        "Data Visualization",
        "Python",
        "SQL",
        "React",
        "No Match 1",
        "No Match 2",
        "No Match 3",
      ],
    };
    const strongListing = makeScoringCase(
      "strong-boundary",
      ["Python", "No Match"],
      ["AI"],
    );

    expect(calculateFitScore(boundaryProfile, goodListing)).toMatchObject({
      total: 74,
      band: "Good",
    });
    expect(calculateFitScore(smallProfile, strongListing)).toMatchObject({
      total: 75,
      band: "Strong",
    });
    expect(calculateFitScore(smallProfile, makeScoringCase("partial", [], []))).toMatchObject({
      total: 30,
      band: "Partial",
    });
  });

  it("produces Strong, Good, and Partial bands across the seed listings", () => {
    const bands = new Set(
      internships.map((internship) => calculateFitScore(studentProfile, internship).band),
    );

    expect(bands).toEqual(new Set(["Strong", "Good", "Partial"]));
  });
});
