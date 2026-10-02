from uuid import uuid4

from app.models.application import Application, ApplicationStatus


applications: list[Application] = []


def create_application(
    internship_id: str,
    user_id: int,
) -> Application:

    application = Application(
        id=str(uuid4()),
        internship_id=internship_id,
        user_id=user_id,
    )

    applications.append(application)

    return application


def prepare_application(
    application_id: str,
    cover_letter: str,
) -> Application:

    for application in applications:

        if application.id == application_id:

            application.cover_letter = cover_letter

            return application

    raise ValueError("Application not found")


def approve_application(
    application_id: str,
    user_id: int,
) -> Application:

    for application in applications:

        if (
            application.id == application_id
            and application.user_id == user_id
        ):

            application.approved_by_student = True
            application.status = ApplicationStatus.APPLIED

            return application

    raise ValueError("Application not found")


def update_application_status(
    application_id: str,
    user_id: int,
    status: ApplicationStatus,
) -> Application:

    for application in applications:

        if (
            application.id == application_id
            and application.user_id == user_id
        ):

            application.status = status

            return application

    raise ValueError("Application not found")


def get_user_applications(
    user_id: int,
) -> list[Application]:

    return [
        application
        for application in applications
        if application.user_id == user_id
    ]