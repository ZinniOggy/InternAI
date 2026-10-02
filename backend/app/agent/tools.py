from app.models.internship import Internship
from app.models.student import StudentProfile
from app.services.discovery import get_all_internships
from app.services.matching import evaluate_match


def discover_internships() -> list[Internship]:
    return get_all_internships()


def evaluate_internship(
    student: StudentProfile,
    internship: Internship,
) -> dict:

    return evaluate_match(
        student,
        internship,
    )