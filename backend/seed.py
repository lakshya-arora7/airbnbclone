"""
Unified Database Seed Script
Invokes app.db.seed_data.seed_database to populate:
- Personas (Lakshya GUEST, Ravi HOST, Sarah HOST, Priya GUEST)
- 5 Authentic Detailed Indian Listings with high-res photos
- Verified Bookings (Confirmed & Completed)
- Verified 5-Star Reviews
- Sample Messages between Host & Guest
"""
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.user import User
from app.models.listing import Listing, ListingImage
from app.models.booking import Booking
from app.models.review import Review
from app.models.wishlist import Wishlist, WishlistItem
from app.models.message import Message
from app.db.seed_data import seed_database

def get_seed_stats(db=None):
    close_at_end = False
    if db is None:
        db = SessionLocal()
        close_at_end = True
    try:
        return {
            "users": db.query(User).count(),
            "listings": db.query(Listing).count(),
            "listing_images": db.query(ListingImage).count(),
            "bookings": db.query(Booking).count(),
            "reviews": db.query(Review).count(),
            "messages": db.query(Message).count()
        }
    finally:
        if close_at_end:
            db.close()

def clean_database(db=None):
    close_at_end = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_at_end = True
    try:
        db.query(Message).delete()
        db.query(WishlistItem).delete()
        db.query(Wishlist).delete()
        db.query(Review).delete()
        db.query(Booking).delete()
        db.query(ListingImage).delete()
        db.query(Listing).delete()
        db.commit()
        return get_seed_stats(db)
    finally:
        if close_at_end:
            db.close()

if __name__ == "__main__":
    stats = seed_database()
    print(f"Seed complete: {stats}")
