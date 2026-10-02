from google import genai

from app.config import settings
from app.models.internship import Internship
from app.models.student import StudentProfile


client = genai.Client(
    api_key=settings.gemini_api_key
)


def generate_application_material(
    student: StudentProfile,
    internship: Internship,
) -> str:

    prompt = f"""
You are an internship application assistant.

Prepare a professional draft cover letter for this student
and internship.

IMPORTANT:
Only use information explicitly provided below.
Never invent skills, projects, achievements, work experience,
certifications, education, or other qualifications.

STUDENT:
University: {student.university}
Degree: {student.degree}
Academic year: {student.academic_year}

Skills:
{", ".join(student.skills)}

Projects:
{", ".join(student.projects)}

Interests:
{", ".join(student.interests)}

INTERNSHIP:
Title: {internship.title}
Company: {internship.company}
Location: {internship.location}
Work mode: {internship.work_mode}

Required skills:
{", ".join(internship.required_skills)}

Domains:
{", ".join(internship.domains)}

Description:
{internship.description}

Write a concise application draft.
Clearly avoid claiming anything not present in the student information.
"""

    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
    )

    return response.text or ""