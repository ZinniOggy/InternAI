from pydantic import BaseModel, Field


class Internship(BaseModel):
    id: str
    title: str
    company: str
    location: str
    work_mode: str

    duration: str
    start_period: str

    required_skills: list[str] = Field(default_factory=list)
    domains: list[str] = Field(default_factory=list)

    description: str

    application_url: str | None = None