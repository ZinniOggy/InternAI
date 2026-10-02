from pydantic import BaseModel


class User(BaseModel):
    id: int
    google_sub: str
    email: str
    name: str
    picture: str | None = None


class GoogleAuthRequest(BaseModel):
    credential: str


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    picture: str | None = None