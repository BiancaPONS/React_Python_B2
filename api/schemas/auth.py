from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=72,
    )


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(
        min_length=1,
        max_length=72,
    )


class VerifyLoginCodeRequest(BaseModel):
    challenge_id: int
    code: str = Field(
        min_length=6,
        max_length=6,
        pattern=r"^\d{6}$",
    )


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    message: str
    challenge_id: int | None = None


class ResetPasswordRequest(BaseModel):
    challenge_id: int
    code: str = Field(
        min_length=6,
        max_length=6,
        pattern=r"^\d{6}$",
    )
    new_password: str = Field(
        min_length=8,
        max_length=72,
    )


class ResetPasswordResponse(BaseModel):
    message: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr


class LoginChallengeResponse(BaseModel):
    challenge_id: int
    message: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str