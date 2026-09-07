from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.user import UserResponse

class ReviewCreate(BaseModel):
    listing_id: int
    rating: float = Field(..., ge=1.0, le=5.0)
    cleanliness_rating: float = Field(default=5.0, ge=1.0, le=5.0)
    accuracy_rating: float = Field(default=5.0, ge=1.0, le=5.0)
    checkin_rating: float = Field(default=5.0, ge=1.0, le=5.0)
    communication_rating: float = Field(default=5.0, ge=1.0, le=5.0)
    location_rating: float = Field(default=5.0, ge=1.0, le=5.0)
    value_rating: float = Field(default=5.0, ge=1.0, le=5.0)
    comment: str

class ReviewResponse(BaseModel):
    id: int
    listing_id: int
    author_id: int
    rating: float
    cleanliness_rating: float
    accuracy_rating: float
    checkin_rating: float
    communication_rating: float
    location_rating: float
    value_rating: float
    comment: str
    created_at: datetime
    author: UserResponse

    class Config:
        from_attributes = True
