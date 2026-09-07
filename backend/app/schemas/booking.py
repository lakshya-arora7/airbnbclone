from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel

class BookingCreate(BaseModel):
    listing_id: int
    check_in: date
    check_out: date
    guests_count: int = 1
    payment_method: str = "UPI / QR Code"

class BookedDateRange(BaseModel):
    check_in: date
    check_out: date

class PriceBreakdown(BaseModel):
    nightly_rate: float
    total_nights: int
    nightly_total: float
    cleaning_fee: float
    service_fee: float
    total_price: float

class BookingListingSummary(BaseModel):
    id: int
    title: str
    city: str
    country: str
    latitude: float
    longitude: float
    image_url: Optional[str] = None

class BookingGuestSummary(BaseModel):
    id: int
    full_name: str
    avatar_url: Optional[str] = None
    email: Optional[str] = None

class BookingResponse(BaseModel):
    id: int
    confirmation_code: str
    listing_id: int
    guest_id: int
    check_in: date
    check_out: date
    guests_count: int
    nightly_rate: float
    total_nights: int
    cleaning_fee: float
    service_fee: float
    total_price: float
    payment_method: str
    status: str
    created_at: datetime
    listing: Optional[BookingListingSummary] = None
    guest: Optional[BookingGuestSummary] = None

    class Config:
        from_attributes = True
