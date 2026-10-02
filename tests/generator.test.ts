import { describe, expect, it } from "vitest";
import { generateApplicationDraft } from "../src/lib/generator";
import type { Internship, StudentProfile } from "../src/lib/types";

const smallProfile: StudentProfile = {
  id: "profile-generator-test",
  university: "Example University",
  degree: "BSc Computer Science",
  academicYear: "Third year",
  skills: ["Python", "React"],
  projects: [{ name: "Tiny Planner", summary: "A schedule planning project." }],
  interests: ["Web Development"],
  preferredLocations: ["Remote"],
  availability: { startPeriods: ["Summer 2026"], maxDurationWeeks: 8 },
  internshipDurationWeeks: 6,
};

const uxInternship: Internship = {
  id: "ux-research-test",
  title: "UX Research Intern",
  company: "Example Studio",
  location: "Remote",
  workMode: "Remote",
  requiredSkills: ["React", "User Research"],
  durationWeeks: 6,
  description: "Interview users and summarize product insights.",
  tags: ["Web Development"],
  startPeriod: "Summer 2026",
};

const allBlocks = (draft: ReturnType<typeof generateApplicationDraft>) => [
  ...draft.resumeSummary,
  ...draft.coverLetter,
];

describe("generateApplicationDraft", () => {
  it("is deterministic and labels every factual or generated block", () => {
    const draft = generateApplicationDraft(smallProfile, uxInternship);
    const blocks = allBlocks(draft);

    expect(generateApplicationDraft(smallProfile, uxInternship)).toEqual(draft);
    expect(blocks.length).toBeGreaterThan(0);
    expect(blocks.every((block) =>
      block.label === "AI-generated" || block.label === "From your profile",
    )).toBe(true);
    expect(blocks.some((block) => block.label === "From your profile")).toBe(true);
    expect(blocks.some((block) => block.label === "AI-generated")).toBe(true);
    expect(blocks.flatMap((block) => block.sourceFacts).every((fact) =>
      fact.source === "Your profile" || fact.source === "Listing",
    )).toBe(true);
  });

  it("uses no unprovided profile claim and shows missing listing skills as inert text", () => {
    const draft = generateApplicationDraft(smallProfile, uxInternship);
    const blocks = allBlocks(draft);
    const placeholder = blocks.find((block) => block.content === "Add to profile: User Research");

    expect(placeholder).toBeDefined();
    expect(placeholder?.label).toBe("AI-generated");
    expect(placeholder?.sourceFacts).toContainEqual({
      item: "User Research",
      source: "Listing",
    });
    expect(placeholder).not.toHaveProperty("href");
    expect(placeholder).not.toHaveProperty("onClick");

    const allContent = blocks.map((block) => block.content).join(" ");
    expect(allContent).toContain("Tiny Planner");
    expect(allContent).toContain("React");
    expect(allContent).not.toContain("Professional experience");
    expect(allContent).not.toContain("User Research experience");
  });
});
