from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.booking import Booking
from app.schemas.booking import BookingCreate, BookingResponse, BookingListingSummary, BookingGuestSummary
from app.services.booking_service import create_booking, cancel_booking
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

def serialize_booking(booking: Booking) -> dict:
    listing_summary = None
    if booking.listing:
        first_img = booking.listing.images[0].url if booking.listing.images else None
        listing_summary = BookingListingSummary(
            id=booking.listing.id,
            title=booking.listing.title,
            city=booking.listing.city,
            country=booking.listing.country,
            latitude=booking.listing.latitude,
            longitude=booking.listing.longitude,
            image_url=first_img
        )

    guest_summary = None
    if booking.guest:
        guest_summary = BookingGuestSummary(
            id=booking.guest.id,
            full_name=booking.guest.full_name,
            avatar_url=booking.guest.avatar_url,
            email=booking.guest.email
        )

    return {
        "id": booking.id,
        "confirmation_code": booking.confirmation_code,
        "listing_id": booking.listing_id,
        "guest_id": booking.guest_id,
        "check_in": booking.check_in,
        "check_out": booking.check_out,
        "guests_count": booking.guests_count,
        "nightly_rate": booking.nightly_rate,
        "total_nights": booking.total_nights,
        "cleaning_fee": booking.cleaning_fee,
        "service_fee": booking.service_fee,
        "total_price": booking.total_price,
        "payment_method": booking.payment_method,
        "status": booking.status,
        "created_at": booking.created_at,
        "listing": listing_summary,
        "guest": guest_summary
    }

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def make_booking(
    payload: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = create_booking(db=db, guest_id=current_user.id, booking_in=payload)
    return serialize_booking(booking)

from datetime import date
from typing import Optional
from pydantic import BaseModel

class BookingUpdate(BaseModel):
    check_in: Optional[date] = None
    check_out: Optional[date] = None
    guests_count: Optional[int] = None
    status: Optional[str] = None

@router.get("/my-trips", response_model=List[BookingResponse])
def get_my_trips(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    bookings = db.query(Booking).filter(
        Booking.guest_id == current_user.id
    ).order_by(Booking.check_in.desc()).all()
    
    return [serialize_booking(b) for b in bookings]

@router.get("/listing/{listing_id}", response_model=List[BookingResponse])
def get_bookings_for_listing(
    listing_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    bookings = db.query(Booking).filter(
        Booking.listing_id == listing_id
    ).order_by(Booking.check_in.desc()).all()
    return [serialize_booking(b) for b in bookings]

@router.patch("/{id}", response_model=BookingResponse)
def update_booking(
    id: int,
    payload: BookingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")

    if payload.check_in is not None:
        booking.check_in = payload.check_in
    if payload.check_out is not None:
        booking.check_out = payload.check_out
    if payload.guests_count is not None and payload.guests_count > 0:
        booking.guests_count = payload.guests_count
    if payload.status is not None:
        booking.status = payload.status.upper()

    if booking.check_in and booking.check_out:
        total_nights = (booking.check_out - booking.check_in).days
        if total_nights > 0:
            booking.total_nights = total_nights
            booking.total_price = (booking.nightly_rate * total_nights) + booking.cleaning_fee + booking.service_fee

    db.commit()
    db.refresh(booking)
    return serialize_booking(booking)

@router.patch("/{id}/cancel", response_model=BookingResponse)
def cancel_reservation(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = cancel_booking(db=db, booking_id=id, user_id=current_user.id)
    return serialize_booking(booking)
