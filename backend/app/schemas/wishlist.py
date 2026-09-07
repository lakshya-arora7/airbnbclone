from typing import List
from datetime import datetime
from pydantic import BaseModel
from app.schemas.listing import ListingResponse

class WishlistToggleResponse(BaseModel):
    listing_id: int
    is_favorited: bool
    message: str

class WishlistResponse(BaseModel):
    id: int
    user_id: int
    name: str
    created_at: datetime
    listings: List[ListingResponse] = []

    class Config:
        from_attributes = True
