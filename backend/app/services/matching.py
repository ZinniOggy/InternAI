from app.models.internship import Internship
from app.models.student import StudentProfile


def normalize(values: list[str]) -> set[str]:
    return {
        value.strip().lower()
        for value in values
        if value.strip()
    }


def evaluate_match(
    student: StudentProfile,
    internship: Internship,
) -> dict:

    student_skills = normalize(student.skills)
    required_skills = normalize(internship.required_skills)

    student_interests = normalize(student.interests)
    internship_domains = normalize(internship.domains)

    matched_skills = student_skills & required_skills
    missing_skills = required_skills - student_skills

    matched_interests = student_interests & internship_domains
    missing_interests = internship_domains - student_interests

    preferred_locations = normalize(
        student.preferred_locations
    )

    preferred_work_modes = normalize(
        student.preferred_work_modes
    )

    internship_location = internship.location.strip().lower()
    internship_work_mode = internship.work_mode.strip().lower()

    location_match = (
        not preferred_locations
        or internship_location in preferred_locations
        or internship_location == "remote"
    )

    work_mode_match = (
        not preferred_work_modes
        or internship_work_mode in preferred_work_modes
    )

    if required_skills:
        skill_score = (
            len(matched_skills)
            / len(required_skills)
            * 50
        )
    else:
        skill_score = 50

    if internship_domains:
        interest_score = (
            len(matched_interests)
            / len(internship_domains)
            * 25
        )
    else:
        interest_score = 25

    location_score = 15 if location_match else 0
    work_mode_score = 10 if work_mode_match else 0

    score = round(
        skill_score
        + interest_score
        + location_score
        + work_mode_score
    )

    reasons = []

    if matched_skills:
        reasons.append(
            "Matching skills: "
            + ", ".join(sorted(matched_skills))
        )

    if matched_interests:
        reasons.append(
            "Matching interests: "
            + ", ".join(sorted(matched_interests))
        )

    if location_match:
        reasons.append(
            "The internship matches a preferred location."
        )

    if work_mode_match:
        reasons.append(
            "The work mode matches the student's preference."
        )

    return {
        "internship_id": internship.id,
        "match_score": min(score, 100),
        "skills": {
            "matched": sorted(matched_skills),
            "missing": sorted(missing_skills),
        },
        "interests": {
            "matched": sorted(matched_interests),
            "missing": sorted(missing_interests),
        },
        "location_match": location_match,
        "work_mode_match": work_mode_match,
        "reasons": reasons,
    }