import random
import string
from datetime import date
from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.booking import Booking
from app.models.listing import Listing
from app.schemas.booking import BookingCreate, BookedDateRange, PriceBreakdown

def check_date_availability(db: Session, listing_id: int, check_in: date, check_out: date) -> bool:
    """
    Evaluates transactional date collision invariant:
    Conflict <=> exists Confirmed booking such that (check_in < booking.check_out) and (check_out > booking.check_in)
    Same-day turnover rule is permitted (check_in == booking.check_out is allowed).
    """
    if check_out <= check_in:
        return False

    conflict = db.query(Booking).filter(
        Booking.listing_id == listing_id,
        Booking.status == "CONFIRMED",
        Booking.check_in < check_out,
        Booking.check_out > check_in
    ).first()
    
    return conflict is None

def calculate_pricing(listing: Listing, check_in: date, check_out: date) -> PriceBreakdown:
    nights = (check_out - check_in).days
    if nights <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-out date must be after check-in date."
        )

    nightly_total = round(listing.price_per_night * nights, 2)
    cleaning_fee = round(listing.cleaning_fee, 2)
    service_fee = round(nightly_total * (listing.service_fee_percent / 100.0), 2)
    total_price = round(nightly_total + cleaning_fee + service_fee, 2)

    return PriceBreakdown(
        nightly_rate=listing.price_per_night,
        total_nights=nights,
        nightly_total=nightly_total,
        cleaning_fee=cleaning_fee,
        service_fee=service_fee,
        total_price=total_price
    )

def generate_confirmation_code() -> str:
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"HM-{random_str}"

def create_booking(db: Session, guest_id: int, booking_in: BookingCreate) -> Booking:
    listing = db.query(Listing).filter(Listing.id == booking_in.listing_id, Listing.is_published == True).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found or unpublished.")

    if booking_in.guests_count > listing.max_guests:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Guests count ({booking_in.guests_count}) exceeds maximum allowed ({listing.max_guests})."
        )

    # Transactional overlap check
    is_available = check_date_availability(db, listing.id, booking_in.check_in, booking_in.check_out)
    if not is_available:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="These dates are already booked or held by another guest. Please choose other dates."
        )

    # Calculate authoritative server pricing
    pricing = calculate_pricing(listing, booking_in.check_in, booking_in.check_out)

    # Generate unique code
    confirmation_code = generate_confirmation_code()
    while db.query(Booking).filter(Booking.confirmation_code == confirmation_code).first():
        confirmation_code = generate_confirmation_code()

    new_booking = Booking(
        confirmation_code=confirmation_code,
        listing_id=listing.id,
        guest_id=guest_id,
        check_in=booking_in.check_in,
        check_out=booking_in.check_out,
        guests_count=booking_in.guests_count,
        nightly_rate=pricing.nightly_rate,
        total_nights=pricing.total_nights,
        cleaning_fee=pricing.cleaning_fee,
        service_fee=pricing.service_fee,
        total_price=pricing.total_price,
        payment_method=booking_in.payment_method,
        status="CONFIRMED"
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking

def cancel_booking(db: Session, booking_id: int, user_id: int) -> Booking:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")

    # Allow guest or host to cancel
    if booking.guest_id != user_id and booking.listing.host_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to cancel this reservation.")

    booking.status = "CANCELLED"
    db.commit()
    db.refresh(booking)
    return booking

def get_booked_dates(db: Session, listing_id: int) -> List[BookedDateRange]:
    bookings = db.query(Booking).filter(
        Booking.listing_id == listing_id,
        Booking.status == "CONFIRMED"
    ).all()
    
    return [BookedDateRange(check_in=b.check_in, check_out=b.check_out) for b in bookings]
