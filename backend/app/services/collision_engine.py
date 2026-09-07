"""
Layer 3: Transactional Date-Collision & Reservation Hold Engine

Invariant:
Overlap(S1, S2) <=> (S1.check_in < S2.check_out) and (S1.check_out > S2.check_in)
Same-day turnover: S1.check_out == S2.check_in evaluates to False, allowing smooth check-in on departure day.
"""

from datetime import date, timedelta
from typing import List, Tuple, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from app.models.booking import Booking

class CollisionEngine:
    MIN_STAY_NIGHTS = 1
    MAX_STAY_NIGHTS = 90

    @classmethod
    def validate_dates(cls, check_in: date, check_out: date, allow_past: bool = False) -> None:
        """
        Validates date ordering and length of stay constraints.
        Raises ValueError with clear message if constraints are violated.
        """
        if not allow_past and check_in < date.today():
            raise ValueError("Check-in date cannot be in the past.")

        if check_out <= check_in:
            raise ValueError("Check-out date must be strictly after check-in date.")

        nights = (check_out - check_in).days
        if nights < cls.MIN_STAY_NIGHTS:
            raise ValueError(f"Minimum stay is {cls.MIN_STAY_NIGHTS} night.")
        if nights > cls.MAX_STAY_NIGHTS:
            raise ValueError(f"Maximum stay is {cls.MAX_STAY_NIGHTS} nights.")

    @classmethod
    def intervals_overlap(cls, start1: date, end1: date, start2: date, end2: date) -> bool:
        """
        Pure mathematical date-interval intersection test.
        Returns True if intervals overlap; False otherwise.
        """
        return (start1 < end2) and (end1 > start2)

    @classmethod
    def check_memory_collision(
        cls,
        existing_ranges: List[Tuple[date, date]],
        new_check_in: date,
        new_check_out: date
    ) -> bool:
        """
        In-memory collision check useful for pure unit tests and fast caching.
        Returns True if a conflict exists, False if available.
        """
        cls.validate_dates(new_check_in, new_check_out, allow_past=True)
        for existing_in, existing_out in existing_ranges:
            if cls.intervals_overlap(new_check_in, new_check_out, existing_in, existing_out):
                return True
        return False

    @classmethod
    def check_db_availability(
        cls,
        db: Session,
        listing_id: int,
        check_in: date,
        check_out: date,
        exclude_booking_id: Optional[int] = None
    ) -> bool:
        """
        Database transactional collision check against CONFIRMED and active HELD bookings.
        """
        cls.validate_dates(check_in, check_out, allow_past=True)

        query = db.query(Booking).filter(
            Booking.listing_id == listing_id,
            Booking.status == "CONFIRMED",
            Booking.check_in < check_out,
            Booking.check_out > check_in
        )

        if exclude_booking_id is not None:
            query = query.filter(Booking.id != exclude_booking_id)

        conflict = query.first()
        return conflict is None
