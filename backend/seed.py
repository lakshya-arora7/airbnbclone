import json
import sys
from sqlalchemy.orm import Session
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.user import User
from app.models.listing import Listing, ListingImage
from app.models.booking import Booking
from app.models.review import Review
from app.models.wishlist import Wishlist, WishlistItem

def get_seed_stats(db: Session = None) -> dict:
    """Returns total record counts across all relational tables."""
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
            "wishlists": db.query(Wishlist).count(),
            "wishlist_items": db.query(WishlistItem).count()
        }
    finally:
        if close_at_end:
            db.close()

def seed_personas(db: Session):
    """Ensures core personas exist for authentication and host dashboards."""
    existing_count = db.query(User).count()
    if existing_count > 0:
        return
    guest = User(
        id=1,
        email="lakshya@gmail.com",
        full_name="Lakshya Arora",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        role="GUEST",
        is_superhost=False,
        host_since="January 2024",
        bio="Software engineer & world traveler passionate about architecture."
    )
    host_ravi = User(
        id=2,
        email="ravi.sharma@gmail.com",
        full_name="Ravi Sharma",
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        role="HOST",
        is_superhost=True,
        host_since="March 2022",
        bio="Architect and Superhost passionate about thoughtful interior spaces and authentic hospitality."
    )
    host_sarah = User(
        id=3,
        email="sarah.jenkins@gmail.com",
        full_name="Sarah Jenkins",
        avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
        role="HOST",
        is_superhost=True,
        host_since="August 2021",
        bio="Interior architect and luxury villa curator across Europe and Asia."
    )
    db.add(guest)
    db.add(host_ravi)
    db.add(host_sarah)
    db.commit()

def clean_database(db: Session = None):
    """Cleans all listings, bookings, reviews, and wishlist items from database, preserving user personas."""
    close_at_end = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_at_end = True

    try:
        db.query(WishlistItem).delete()
        db.query(Wishlist).delete()
        db.query(Review).delete()
        db.query(Booking).delete()
        db.query(ListingImage).delete()
        db.query(Listing).delete()
        db.commit()
        seed_personas(db)
        stats = get_seed_stats(db)
        print(f"[Clean] Database cleaned successfully: {stats}")
        return stats
    finally:
        if close_at_end:
            db.close()

def seed_database(db: Session = None):
    """Clean database without mock listings."""
    return clean_database(db)

def reset_database():
    """Drops all tables and re-creates clean database tables."""
    print("[Reset] Dropping all database tables...")
    Base.metadata.drop_all(bind=engine)
    print("[Reset] Creating fresh database tables...")
    Base.metadata.create_all(bind=engine)
    return clean_database()

if __name__ == "__main__":
    if "--reset" in sys.argv:
        reset_database()
    elif "--stats" in sys.argv:
        stats = get_seed_stats()
        print(f"[Stats] Database Status:\n{json.dumps(stats, indent=2)}")
    else:
        clean_database()
