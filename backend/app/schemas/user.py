from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    avatar_url: Optional[str] = None
    role: str = "GUEST"
    is_superhost: bool = False
    host_since: Optional[str] = "March 2024"
    bio: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PersonaSwitchRequest(BaseModel):
    role: str  # "GUEST" or "HOST"

class AuthLoginRequest(BaseModel):
    login_id: str
    role: str = "GUEST"
    full_name: Optional[str] = None
