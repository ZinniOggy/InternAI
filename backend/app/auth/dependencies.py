import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import Cookie, HTTPException

from app.config import settings
from app.database import get_connection
from app.models.user import User


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_session(user_id: int) -> tuple[str, datetime]:
    raw_token = secrets.token_urlsafe(32)

    expires_at = datetime.now(timezone.utc) + timedelta(
        days=settings.session_expire_days
    )

    token_hash = hash_token(raw_token)

    connection = get_connection()

    connection.execute(
        """
        INSERT INTO sessions (user_id, token_hash, expires_at)
        VALUES (?, ?, ?)
        """,
        (
            user_id,
            token_hash,
            expires_at.isoformat(),
        ),
    )

    connection.commit()
    connection.close()

    return raw_token, expires_at


def get_current_user(
    internai_session: str | None = Cookie(
        default=None,
        alias=settings.session_cookie_name,
    ),
) -> User:

    if not internai_session:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    token_hash = hash_token(internai_session)

    connection = get_connection()

    row = connection.execute(
        """
        SELECT
            users.id,
            users.google_sub,
            users.email,
            users.name,
            users.picture,
            sessions.expires_at
        FROM sessions
        JOIN users ON users.id = sessions.user_id
        WHERE sessions.token_hash = ?
        """,
        (token_hash,),
    ).fetchone()

    connection.close()

    if row is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid session",
        )

    expires_at = datetime.fromisoformat(row["expires_at"])

    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=401,
            detail="Session expired",
        )

    return User(
        id=row["id"],
        google_sub=row["google_sub"],
        email=row["email"],
        name=row["name"],
        picture=row["picture"],
    )


def delete_session(token: str) -> None:
    token_hash = hash_token(token)

    connection = get_connection()

    connection.execute(
        "DELETE FROM sessions WHERE token_hash = ?",
        (token_hash,),
    )

    connection.commit()
    connection.close()