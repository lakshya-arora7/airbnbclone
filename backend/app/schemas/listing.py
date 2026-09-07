from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.user import UserResponse

class ListingImageBase(BaseModel):
    url: str
    caption: Optional[str] = None
    display_order: int = 1
    is_primary: bool = False

class ListingImageCreate(ListingImageBase):
    pass

class ListingImageResponse(ListingImageBase):
    id: int

    class Config:
        from_attributes = True

class ListingBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    description: str
    property_type: str = "Flat"
    category: str = "Homes"
    city: str
    country: str = "India"
    latitude: float
    longitude: float
    price_per_night: float
    original_price: Optional[float] = None
    cleaning_fee: float = 400.0
    service_fee_percent: float = 14.0
    max_guests: int = 4
    bedrooms: int = 2
    beds: int = 2
    bathrooms: int = 2
    bed_details: Optional[str] = None
    amenities: List[str] = Field(default_factory=list)
    is_published: bool = True
    is_guest_favourite: bool = False
    is_superhost: bool = False

class ListingCreate(ListingBase):
    images: List[ListingImageCreate] = Field(default_factory=list)

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    property_type: Optional[str] = None
    category: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price_per_night: Optional[float] = None
    original_price: Optional[float] = None
    cleaning_fee: Optional[float] = None
    max_guests: Optional[int] = None
    bedrooms: Optional[int] = None
    beds: Optional[int] = None
    bathrooms: Optional[int] = None
    bed_details: Optional[str] = None
    amenities: Optional[List[str]] = None
    is_published: Optional[bool] = None

class ListingResponse(ListingBase):
    id: int
    host_id: int
    rating: float
    review_count: int
    images: List[ListingImageResponse] = Field(default_factory=list)
    created_at: datetime

    class Config:
        from_attributes = True

class ListingDetailResponse(ListingResponse):
    host: Optional[UserResponse] = None
