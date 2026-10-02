import json

from app.database import get_connection
from app.models.student import (
    StudentProfile,
    StudentProfileResponse,
)


def save_student_profile(
    user_id: int,
    profile: StudentProfile,
) -> StudentProfileResponse:

    connection = get_connection()

    connection.execute(
        """
        INSERT INTO student_profiles (
            user_id,
            university,
            degree,
            academic_year,
            skills,
            projects,
            interests,
            preferred_locations,
            preferred_work_modes,
            availability,
            internship_duration
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id)
        DO UPDATE SET
            university = excluded.university,
            degree = excluded.degree,
            academic_year = excluded.academic_year,
            skills = excluded.skills,
            projects = excluded.projects,
            interests = excluded.interests,
            preferred_locations = excluded.preferred_locations,
            preferred_work_modes = excluded.preferred_work_modes,
            availability = excluded.availability,
            internship_duration = excluded.internship_duration
        """,
        (
            user_id,
            profile.university,
            profile.degree,
            profile.academic_year,
            json.dumps(profile.skills),
            json.dumps(profile.projects),
            json.dumps(profile.interests),
            json.dumps(profile.preferred_locations),
            json.dumps(profile.preferred_work_modes),
            profile.availability,
            profile.internship_duration,
        ),
    )

    connection.commit()
    connection.close()

    return StudentProfileResponse(
        user_id=user_id,
        **profile.model_dump(),
    )


def get_student_profile(
    user_id: int,
) -> StudentProfileResponse | None:

    connection = get_connection()

    row = connection.execute(
        """
        SELECT *
        FROM student_profiles
        WHERE user_id = ?
        """,
        (user_id,),
    ).fetchone()

    connection.close()

    if row is None:
        return None

    return StudentProfileResponse(
        user_id=user_id,
        university=row["university"],
        degree=row["degree"],
        academic_year=row["academic_year"],
        skills=json.loads(row["skills"]),
        projects=json.loads(row["projects"]),
        interests=json.loads(row["interests"]),
        preferred_locations=json.loads(
            row["preferred_locations"]
        ),
        preferred_work_modes=json.loads(
            row["preferred_work_modes"]
        ),
        availability=row["availability"],
        internship_duration=row["internship_duration"],
    )