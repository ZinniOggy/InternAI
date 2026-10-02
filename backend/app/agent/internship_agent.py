from app.models.internship import Internship
from app.models.student import StudentProfile
from app.services.matching import evaluate_match


class InternshipAgent:

    def discover(
        self,
        internships: list[Internship],
    ) -> list[Internship]:

        return internships

    def evaluate(
        self,
        student: StudentProfile,
        internship: Internship,
    ) -> dict:

        return evaluate_match(
            student,
            internship,
        )

    def filter(
        self,
        student: StudentProfile,
        internships: list[Internship],
    ) -> list[dict]:

        results = []

        for internship in internships:

            evaluation = self.evaluate(
                student,
                internship,
            )

            results.append(
                {
                    "internship": internship,
                    "evaluation": evaluation,
                }
            )

        results.sort(
            key=lambda item: item[
                "evaluation"
            ]["match_score"],
            reverse=True,
        )

        return results