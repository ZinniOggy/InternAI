from google.auth.transport import requests
from google.oauth2 import id_token

from app.config import settings


def verify_google_token(credential: str) -> dict:
    try:
        user_info = id_token.verify_oauth2_token(
            credential,
            requests.Request(),
            settings.google_client_id,
        )
    except ValueError as exc:
        raise ValueError("Invalid Google ID token") from exc

    if user_info.get("aud") != settings.google_client_id:
        raise ValueError("Invalid Google client")

    if not user_info.get("email_verified", False):
        raise ValueError("Google email is not verified")

    return user_info