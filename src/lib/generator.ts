import type {
  ApplicationDraft,
  DraftBlock,
  FitEvidence,
  Internship,
  StudentProfile,
} from "./types";

function profileFact(item: string): FitEvidence {
  return { item, source: "Your profile" };
}

function listingFact(item: string): FitEvidence {
  return { item, source: "Listing" };
}

function draftBlock(
  id: string,
  content: string,
  label: DraftBlock["label"],
  sourceFacts: readonly FitEvidence[],
): DraftBlock {
  return { id, content, label, sourceFacts };
}

function missingRequiredSkills(
  profile: StudentProfile,
  internship: Internship,
): readonly string[] {
  return internship.requiredSkills.filter(
    (requiredSkill) =>
      !profile.skills.some(
        (skill) => skill.toLowerCase() === requiredSkill.toLowerCase(),
      ),
  );
}

export function generateApplicationDraft(
  profile: StudentProfile,
  internship: Internship,
): ApplicationDraft {
  const profileOverview = `${profile.degree}, ${profile.academicYear}, ${profile.university}.`;
  const profileSkills = profile.skills.length > 0
    ? `Skills from your profile: ${profile.skills.join(", ")}.`
    : "Add to profile: Skills";
  const projects = profile.projects.map((project, index) =>
    draftBlock(
      `resume-project-${index + 1}`,
      `${project.name}: ${project.summary}`,
      "From your profile",
      [profileFact(project.name), profileFact(project.summary)],
    ),
  );
  const skillBlock = profile.skills.length > 0
    ? draftBlock(
        "resume-skills",
        profileSkills,
        "From your profile",
        profile.skills.map(profileFact),
      )
    : draftBlock(
        "resume-skills-missing",
        profileSkills,
        "AI-generated",
        [],
      );
  const missingFacts = missingRequiredSkills(profile, internship).map((skill, index) =>
    draftBlock(
      `missing-skill-${index + 1}`,
      `Add to profile: ${skill}`,
      "AI-generated",
      [listingFact(skill)],
    ),
  );
  const titleAndCompany = `Draft for ${internship.title} at ${internship.company}.`;
  const coverLetter = [
    draftBlock(
      "cover-letter-opening",
      titleAndCompany,
      "AI-generated",
      [listingFact(internship.title), listingFact(internship.company)],
    ),
    draftBlock(
      "cover-letter-listing-facts",
      `The listing describes: ${internship.description}`,
      "AI-generated",
      [listingFact(internship.description)],
    ),
    draftBlock(
      "cover-letter-profile-facts",
      profileOverview,
      "From your profile",
      [
        profileFact(profile.degree),
        profileFact(profile.academicYear),
        profileFact(profile.university),
      ],
    ),
    draftBlock(
      "cover-letter-skills",
      profileSkills,
      profile.skills.length > 0 ? "From your profile" : "AI-generated",
      profile.skills.map(profileFact),
    ),
    ...missingFacts,
  ];

  return {
    resumeSummary: [
      draftBlock(
        "resume-profile-overview",
        profileOverview,
        "From your profile",
        [
          profileFact(profile.degree),
          profileFact(profile.academicYear),
          profileFact(profile.university),
        ],
      ),
      skillBlock,
      ...projects,
      ...missingFacts,
    ],
    coverLetter,
  };
}