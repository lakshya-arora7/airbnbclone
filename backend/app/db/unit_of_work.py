from typing import Optional
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.db.repository import (
    UserRepository,
    ListingRepository,
    BookingRepository,
    ReviewRepository,
    WishlistRepository
)

class UnitOfWork:
    def __init__(self, session: Optional[Session] = None):
        self._external_session = session is not None
        self.session: Session = session if session is not None else SessionLocal()

        # Initialize domain repositories with scoped session
        self.users = UserRepository(self.session)
        self.listings = ListingRepository(self.session)
        self.bookings = BookingRepository(self.session)
        self.reviews = ReviewRepository(self.session)
        self.wishlists = WishlistRepository(self.session)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type is not None:
                self.rollback()
            else:
                self.commit()
        finally:
            if not self._external_session:
                self.session.close()

    def commit(self):
        self.session.commit()

    def rollback(self):
        self.session.rollback()
