from enum import Enum

from pydantic import BaseModel


class ApplicationStatus(str, Enum):
    SAVED = "Saved"
    APPLIED = "Applied"
    ASSESSMENT = "Assessment"
    INTERVIEW = "Interview"
    OFFER = "Offer"
    REJECTED = "Rejected"


class Application(BaseModel):
    id: str
    internship_id: str
    user_id: int

    status: ApplicationStatus = ApplicationStatus.SAVED

    approved_by_student: bool = False

    cover_letter: str | None = None