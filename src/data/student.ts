import type { StudentProfile } from "../lib/types";

export const studentProfile: StudentProfile = {
  id: "demo-student",
  university: "University of Dhaka",
  degree: "BSc in Computer Science and Engineering",
  academicYear: "Senior",
  skills: [
    "Python",
    "JavaScript",
    "TypeScript",
    "React",
    "Machine Learning",
    "Data Structures",
    "SQL",
    "Data Visualization",
    "Product Design",
    "HTML/CSS",
    "C++",
    "Embedded Systems",
  ],
  projects: [
    {
      name: "Campus Course Planner",
      summary: "A course planning tool for organizing prerequisites and schedules.",
    },
    {
      name: "Crop Disease Classifier",
      summary: "A machine learning project for classifying crop leaf conditions.",
    },
    {
      name: "Community Event Finder",
      summary: "A web project for browsing local events and community activities.",
    },
  ],
  interests: ["AI", "Web Development", "Data Visualization", "Product Design"],
  preferredLocations: ["Dhaka", "Remote"],
  availability: {
    startPeriods: ["Summer 2026", "Autumn 2026"],
    maxDurationWeeks: 8,
  },
  internshipDurationWeeks: 8,
};