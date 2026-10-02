import type {
  FitBand,
  FitEvaluation,
  FitEvidence,
  FitFactor,
  Internship,
  StudentProfile,
} from "./types";

function exactMatch(left: string, right: string): boolean {
  return left.toLowerCase() === right.toLowerCase();
}

function evidence(item: string, source: FitEvidence["source"]): FitEvidence {
  return { item, source };
}

function getFitBand(total: number): FitBand {
  if (total >= 75) return "Strong";
  if (total >= 50) return "Good";
  return "Partial";
}

function calculateRatioPoints(maxPoints: number, matched: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((maxPoints * matched) / total);
}

function scoreRequiredSkills(
  profile: StudentProfile,
  internship: Internship,
): FitFactor {
  const matchedItems: FitEvidence[] = [];
  const missingItems: FitEvidence[] = [];

  for (const requiredSkill of internship.requiredSkills) {
    const profileSkill = profile.skills.find((skill) => exactMatch(skill, requiredSkill));
    if (profileSkill) {
      matchedItems.push(evidence(profileSkill, "Your profile"));
      matchedItems.push(evidence(requiredSkill, "Listing"));
    } else {
      missingItems.push(evidence(requiredSkill, "Listing"));
    }
  }

  return {
    key: "requiredSkills",
    earnedPoints: calculateRatioPoints(
      50,
      matchedItems.length / 2,
      internship.requiredSkills.length,
    ),
    maxPoints: 50,
    matchedItems,
    missingItems,
  };
}

function scoreInterests(profile: StudentProfile, internship: Internship): FitFactor {
  const matchedItems: FitEvidence[] = [];
  const missingItems: FitEvidence[] = [];

  for (const tag of internship.tags) {
    const profileInterest = profile.interests.find((interest) => exactMatch(interest, tag));
    if (profileInterest) {
      matchedItems.push(evidence(profileInterest, "Your profile"));
      matchedItems.push(evidence(tag, "Listing"));
    } else {
      missingItems.push(evidence(tag, "Listing"));
    }
  }

  return {
    key: "interests",
    earnedPoints: calculateRatioPoints(20, matchedItems.length / 2, internship.tags.length),
    maxPoints: 20,
    matchedItems,
    missingItems,
  };
}

function scoreLocationWorkMode(
  profile: StudentProfile,
  internship: Internship,
): FitFactor {
  const isRemote = internship.workMode === "Remote";
  const matchedPreference = profile.preferredLocations.find((location) =>
    isRemote
      ? exactMatch(location, "Remote")
      : exactMatch(location, internship.location),
  );
  if (matchedPreference) {
    return {
      key: "locationWorkMode",
      earnedPoints: 20,
      maxPoints: 20,
      matchedItems: [
        evidence(matchedPreference, "Your profile"),
        evidence(internship.location, "Listing"),
        evidence(internship.workMode, "Listing"),
      ],
      missingItems: [],
    };
  }

  return {
    key: "locationWorkMode",
    earnedPoints: 0,
    maxPoints: 20,
    matchedItems: [],
    missingItems: [
      evidence(profile.preferredLocations.join(", "), "Your profile"),
      evidence(internship.location, "Listing"),
      evidence(internship.workMode, "Listing"),
    ],
  };
}

function scoreAvailabilityDuration(
  profile: StudentProfile,
  internship: Internship,
): FitFactor {
  const startPeriodMatch = profile.availability.startPeriods.find((period) =>
    exactMatch(period, internship.startPeriod),
  );
  const durationMatches = internship.durationWeeks <= profile.availability.maxDurationWeeks;
  const matchedItems: FitEvidence[] = [];
  const missingItems: FitEvidence[] = [];

  if (startPeriodMatch) {
    matchedItems.push(evidence(startPeriodMatch, "Your profile"));
    matchedItems.push(evidence(internship.startPeriod, "Listing"));
  } else {
    missingItems.push(
      evidence(profile.availability.startPeriods.join(", "), "Your profile"),
      evidence(internship.startPeriod, "Listing"),
    );
  }

  if (durationMatches) {
    matchedItems.push(
      evidence(`Up to ${profile.availability.maxDurationWeeks} weeks`, "Your profile"),
      evidence(`${internship.durationWeeks} weeks`, "Listing"),
    );
  } else {
    missingItems.push(
      evidence(`Up to ${profile.availability.maxDurationWeeks} weeks`, "Your profile"),
      evidence(`${internship.durationWeeks} weeks`, "Listing"),
    );
  }

  return {
    key: "availabilityDuration",
    earnedPoints: startPeriodMatch && durationMatches ? 10 : 0,
    maxPoints: 10,
    matchedItems,
    missingItems,
  };
}

export function calculateFitScore(
  profile: StudentProfile,
  internship: Internship,
): FitEvaluation {
  const factors = [
    scoreRequiredSkills(profile, internship),
    scoreInterests(profile, internship),
    scoreLocationWorkMode(profile, internship),
    scoreAvailabilityDuration(profile, internship),
  ] as const;
  const total = factors.reduce((sum, factor) => sum + factor.earnedPoints, 0);

  return {
    internshipId: internship.id,
    total,
    band: getFitBand(total),
    factors,
  };
}