from typing import Optional, List, Tuple
from datetime import date
from sqlalchemy.orm import Session, joinedload
from app.models.listing import Listing, ListingImage
from app.models.booking import Booking
from app.db.repository.base import BaseRepository

class ListingRepository(BaseRepository[Listing]):
    def __init__(self, db: Session):
        super().__init__(Listing, db)

    def get_with_details(self, id: int) -> Optional[Listing]:
        return self.db.query(Listing).options(
            joinedload(Listing.images),
            joinedload(Listing.host)
        ).filter(Listing.id == id).first()

    def get_by_host(self, host_id: int) -> List[Listing]:
        return self.db.query(Listing).filter(Listing.host_id == host_id).order_by(Listing.id.desc()).all()

    def get_booked_date_ranges(self, listing_id: int) -> List[Tuple[date, date]]:
        bookings = self.db.query(Booking.check_in, Booking.check_out).filter(
            Booking.listing_id == listing_id,
            Booking.status == "CONFIRMED"
        ).all()
        return [(b.check_in, b.check_out) for b in bookings]

    def add_image(
        self,
        listing_id: int,
        url: str,
        caption: Optional[str] = None,
        display_order: int = 1,
        is_primary: bool = False
    ) -> ListingImage:
        image = ListingImage(
            listing_id=listing_id,
            url=url,
            caption=caption,
            display_order=display_order,
            is_primary=is_primary
        )
        self.db.add(image)
        self.db.flush()
        return image
