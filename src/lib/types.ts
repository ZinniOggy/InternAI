export const APPLICATION_STATUSES = [
  "Discovered",
  "Saved",
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type WorkMode = "Onsite" | "Hybrid" | "Remote";
export type FitBand = "Strong" | "Good" | "Partial";
export type FactSource = "Your profile" | "Listing";

export interface StudentProject {
  name: string;
  summary: string;
}

export interface StudentAvailability {
  startPeriods: readonly string[];
  maxDurationWeeks: number;
}

export interface StudentProfile {
  id: string;
  university: string;
  degree: string;
  academicYear: string;
  skills: readonly string[];
  projects: readonly StudentProject[];
  interests: readonly string[];
  preferredLocations: readonly string[];
  availability: StudentAvailability;
  internshipDurationWeeks: number;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: WorkMode;
  requiredSkills: readonly string[];
  durationWeeks: number;
  description: string;
  tags: readonly string[];
  startPeriod: string;
}

export interface FilterCriteria {
  location: string | "Any";
  workMode: WorkMode | "Any";
  skill: string | "Any";
  minimumFit: number;
  sort: "fit-desc";
}

export type FitFactorKey =
  | "requiredSkills"
  | "interests"
  | "locationWorkMode"
  | "availabilityDuration";

export interface FitEvidence {
  item: string;
  source: FactSource;
}

export interface FitFactor {
  key: FitFactorKey;
  earnedPoints: number;
  maxPoints: number;
  matchedItems: readonly FitEvidence[];
  missingItems: readonly FitEvidence[];
}

export interface FitEvaluation {
  internshipId: string;
  total: number;
  band: FitBand;
  factors: readonly FitFactor[];
}

export type DraftLabel = "AI-generated" | "From your profile";

export interface DraftBlock {
  id: string;
  content: string;
  label: DraftLabel;
  sourceFacts: readonly FitEvidence[];
}

export interface ApplicationDraft {
  resumeSummary: readonly DraftBlock[];
  coverLetter: readonly DraftBlock[];
}

export type ActivityEventType =
  | "Discovered"
  | "Evaluated"
  | "Draft generated"
  | "Approved"
  | "Applied (simulated)"
  | "Status changed"
  | "Student Declined"
  | "Saved";

export interface ActivityEvent {
  id: string;
  applicationId: string;
  type: ActivityEventType;
  occurredAt: string;
  message: string;
}

export interface Application {
  id: string;
  internshipId: string;
  status: ApplicationStatus;
  decisionOutcome: "Student Declined" | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  activity: readonly ActivityEvent[];
}