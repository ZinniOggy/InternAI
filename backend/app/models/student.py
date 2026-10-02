from pydantic import BaseModel, Field


class StudentProfile(BaseModel):
    university: str
    degree: str
    academic_year: int

    skills: list[str] = Field(default_factory=list)
    projects: list[str] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)

    preferred_locations: list[str] = Field(default_factory=list)
    preferred_work_modes: list[str] = Field(default_factory=list)

    availability: str
    internship_duration: str


class StudentProfileResponse(StudentProfile):
    user_id: int