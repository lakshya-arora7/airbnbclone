from typing import Optional, List
from datetime import date
from sqlalchemy.orm import Session, joinedload
from app.models.booking import Booking
from app.models.listing import Listing
from app.db.repository.base import BaseRepository

class BookingRepository(BaseRepository[Booking]):
    def __init__(self, db: Session):
        super().__init__(Booking, db)

    def has_overlap(
        self,
        listing_id: int,
        check_in: date,
        check_out: date,
        exclude_booking_id: Optional[int] = None
    ) -> bool:
        query = self.db.query(Booking).filter(
            Booking.listing_id == listing_id,
            Booking.status == "CONFIRMED",
            Booking.check_in < check_out,
            Booking.check_out > check_in
        )
        if exclude_booking_id is not None:
            query = query.filter(Booking.id != exclude_booking_id)
        return query.first() is not None

    def get_by_confirmation_code(self, code: str) -> Optional[Booking]:
        return self.db.query(Booking).filter(Booking.confirmation_code == code.strip().upper()).first()

    def get_by_guest(self, guest_id: int) -> List[Booking]:
        return self.db.query(Booking).options(
            joinedload(Booking.listing).joinedload(Listing.images)
        ).filter(Booking.guest_id == guest_id).order_by(Booking.check_in.desc()).all()

    def get_by_host(self, host_id: int) -> List[Booking]:
        return self.db.query(Booking).join(Listing).options(
            joinedload(Booking.listing)
        ).filter(Listing.host_id == host_id).order_by(Booking.check_in.desc()).all()

    def cancel(self, booking_id: int) -> Optional[Booking]:
        booking = self.get(booking_id)
        if booking:
            booking.status = "CANCELLED"
            self.db.flush()
        return booking
