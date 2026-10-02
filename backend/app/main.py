from datetime import datetime, timezone

from fastapi import (
    Cookie,
    Depends,
    FastAPI,
    HTTPException,
    Response,
)
from fastapi.middleware.cors import CORSMiddleware

from app.auth.dependencies import (
    create_session,
    delete_session,
    get_current_user,
)
from app.auth.google import verify_google_token
from app.config import settings
from app.database import get_connection, init_database
from app.models.application import (
    Application,
    ApplicationStatus,
)
from app.models.internship import Internship
from app.models.student import (
    StudentProfile,
    StudentProfileResponse,
)
from app.models.user import (
    GoogleAuthRequest,
    User,
    UserResponse,
)
from app.services.applications import (
    approve_application,
    create_application,
    get_user_applications,
    prepare_application,
    update_application_status,
)
from app.services.discovery import (
    get_all_internships,
    get_internship,
)
from app.services.gemini import generate_application_material
from app.services.matching import evaluate_match
from app.services.student import (
    get_student_profile,
    save_student_profile,
)


app = FastAPI(
    title="InternAI API",
    description="AI Internship Agent for University Students",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_database()


@app.get("/")
def root():
    return {
        "message": "InternAI API is running"
    }


# ---------------------------------------------------------
# AUTHENTICATION
# ---------------------------------------------------------


@app.post("/auth/google", response_model=UserResponse)
def google_login(
    payload: GoogleAuthRequest,
    response: Response,
):

    try:
        google_user = verify_google_token(
            payload.credential
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=401,
            detail=str(exc),
        )

    google_sub = google_user["sub"]
    email = google_user["email"]
    name = google_user.get("name", email)
    picture = google_user.get("picture")

    connection = get_connection()

    existing_user = connection.execute(
        """
        SELECT *
        FROM users
        WHERE google_sub = ?
        """,
        (google_sub,),
    ).fetchone()

    if existing_user:

        user_id = existing_user["id"]

        connection.execute(
            """
            UPDATE users
            SET email = ?, name = ?, picture = ?
            WHERE id = ?
            """,
            (
                email,
                name,
                picture,
                user_id,
            ),
        )

    else:

        cursor = connection.execute(
            """
            INSERT INTO users (
                google_sub,
                email,
                name,
                picture
            )
            VALUES (?, ?, ?, ?)
            """,
            (
                google_sub,
                email,
                name,
                picture,
            ),
        )

        user_id = cursor.lastrowid

    connection.commit()
    connection.close()

    session_token, expires_at = create_session(
        user_id
    )

    response.set_cookie(
        key=settings.session_cookie_name,
        value=session_token,
        httponly=True,
        secure=False,
        samesite="lax",
        expires=expires_at,
    )

    return UserResponse(
        id=user_id,
        email=email,
        name=name,
        picture=picture,
    )


@app.get("/auth/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
):

    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        picture=current_user.picture,
    )


@app.post("/auth/logout")
def logout(
    response: Response,
    internai_session: str | None = Cookie(
        default=None,
        alias=settings.session_cookie_name,
    ),
):

    if internai_session:
        delete_session(internai_session)

    response.delete_cookie(
        key=settings.session_cookie_name
    )

    return {
        "message": "Logged out successfully"
    }


# ---------------------------------------------------------
# STUDENT PROFILE
# ---------------------------------------------------------


@app.get(
    "/profile",
    response_model=StudentProfileResponse,
)
def get_profile(
    current_user: User = Depends(get_current_user),
):

    profile = get_student_profile(
        current_user.id
    )

    if profile is None:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found",
        )

    return profile


@app.put(
    "/profile",
    response_model=StudentProfileResponse,
)
def update_profile(
    profile: StudentProfile,
    current_user: User = Depends(get_current_user),
):

    return save_student_profile(
        current_user.id,
        profile,
    )


# ---------------------------------------------------------
# INTERNSHIPS
# ---------------------------------------------------------


@app.get(
    "/internships",
    response_model=list[Internship],
)
def internships():

    return get_all_internships()


@app.get(
    "/internships/{internship_id}",
    response_model=Internship,
)
def internship(
    internship_id: str,
):

    result = get_internship(
        internship_id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Internship not found",
        )

    return result


# ---------------------------------------------------------
# MATCHING
# ---------------------------------------------------------


@app.post("/match")
def match_internships(
    current_user: User = Depends(get_current_user),
):

    profile = get_student_profile(
        current_user.id
    )

    if profile is None:
        raise HTTPException(
            status_code=400,
            detail="Please create your student profile first.",
        )

    internships = get_all_internships()

    results = []

    for internship_item in internships:

        match = evaluate_match(
            profile,
            internship_item,
        )

        results.append(
            {
                "internship": internship_item,
                "match": match,
            }
        )

    results.sort(
        key=lambda item: item["match"]["match_score"],
        reverse=True,
    )

    return results


# ---------------------------------------------------------
# APPLICATIONS
# ---------------------------------------------------------


@app.post(
    "/applications",
    response_model=Application,
)
def create_new_application(
    internship_id: str,
    current_user: User = Depends(get_current_user),
):

    internship_item = get_internship(
        internship_id
    )

    if internship_item is None:
        raise HTTPException(
            status_code=404,
            detail="Internship not found",
        )

    return create_application(
        internship_id=internship_id,
        user_id=current_user.id,
    )


@app.post(
    "/applications/{application_id}/prepare",
    response_model=Application,
)
def prepare_new_application(
    application_id: str,
    current_user: User = Depends(get_current_user),
):

    profile = get_student_profile(
        current_user.id
    )

    if profile is None:
        raise HTTPException(
            status_code=400,
            detail="Student profile not found",
        )

    application = next(
        (
            item
            for item in get_user_applications(
                current_user.id
            )
            if item.id == application_id
        ),
        None,
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    internship_item = get_internship(
        application.internship_id
    )

    if internship_item is None:
        raise HTTPException(
            status_code=404,
            detail="Internship not found",
        )

    cover_letter = generate_application_material(
        profile,
        internship_item,
    )

    return prepare_application(
        application_id,
        cover_letter,
    )


@app.post(
    "/applications/{application_id}/approve",
    response_model=Application,
)
def approve_new_application(
    application_id: str,
    current_user: User = Depends(get_current_user),
):

    application = approve_application(
        application_id,
        current_user.id,
    )

    return application


@app.patch(
    "/applications/{application_id}/status",
    response_model=Application,
)
def change_application_status(
    application_id: str,
    status: ApplicationStatus,
    current_user: User = Depends(get_current_user),
):

    return update_application_status(
        application_id,
        current_user.id,
        status,
    )


@app.get(
    "/applications",
    response_model=list[Application],
)
def applications(
    current_user: User = Depends(get_current_user),
):

    return get_user_applications(
        current_user.id
    )