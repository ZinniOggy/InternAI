import json
from pathlib import Path

from app.models.internship import Internship


DATA_FILE = (
    Path(__file__).resolve().parent.parent / "data" / "internships.json"
)


def load_internships() -> list[Internship]:
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    return [Internship(**item) for item in data]


def get_all_internships() -> list[Internship]:
    return load_internships()


def get_internship(internship_id: str) -> Internship | None:
    internships = load_internships()

    for internship in internships:
        if internship.id == internship_id:
            return internship

    return None