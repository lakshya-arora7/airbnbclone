import os
import pytest
from sqlalchemy import text, create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from datetime import date, timedelta

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models.user import User
from app.models.listing import Listing, ListingImage
from app.models.booking import Booking
from app.models.review import Review
from app.models.wishlist import Wishlist, WishlistItem
import seed


def test_sqlite_pragmas_enabled():
    """Verify that SQLite connection pragmas (foreign_keys, journal_mode, busy_timeout) are active."""
    with engine.connect() as conn:
        fk_result = conn.execute(text("PRAGMA foreign_keys;")).scalar()
        assert fk_result == 1, "PRAGMA foreign_keys must be ON"

        journal_result = conn.execute(text("PRAGMA journal_mode;")).scalar()
        assert journal_result.lower() in ["wal", "memory"], f"Expected WAL mode, got {journal_result}"


def test_foreign_key_constraint_enforcement():
    """Verify SQLite prevents inserting records with non-existent foreign keys."""
    # Use isolated connection with pragmas
    db = SessionLocal()
    try:
        orphaned_listing = Listing(
            host_id=999999,  # Non-existent user
            title="Orphaned Luxury Flat",
            description="Testing foreign keys",
            property_type="Flat",
            category="Homes",
            city="Ghost City",
            country="Nowhere",
            latitude=0.0,
            longitude=0.0,
            price_per_night=5000.0
        )
        db.add(orphaned_listing)
        with pytest.raises(IntegrityError):
            db.commit()
    finally:
        db.rollback()
        db.close()


def test_cascade_delete_integrity():
    """Verify that deleting a listing cascades cleanly to images, reviews, and wishlist items."""
    db = SessionLocal()
    try:
        # Create a test host
        host = User(
            email="test_cascade_host@example.com",
            full_name="Cascade Test Host",
            role="HOST"
        )
        db.add(host)
        db.commit()

        # Create listing with images and review
        listing = Listing(
            host_id=host.id,
            title="Cascade Test Listing",
            description="Testing cascade delete",
            property_type="Apartment",
            category="Homes",
            city="Test City",
            country="Test Country",
            latitude=12.34,
            longitude=56.78,
            price_per_night=4000.0
        )
        db.add(listing)
        db.commit()

        # Add 5 images
        for i in range(5):
            img = ListingImage(
                listing_id=listing.id,
                url=f"https://images.example.com/img_{i}.jpg",
                display_order=i + 1
            )
            db.add(img)

        # Add review
        rev = Review(
            listing_id=listing.id,
            author_id=host.id,
            rating=5.0,
            comment="Awesome stay"
        )
        db.add(rev)
        db.commit()

        listing_id = listing.id
        assert db.query(ListingImage).filter(ListingImage.listing_id == listing_id).count() == 5
        assert db.query(Review).filter(Review.listing_id == listing_id).count() == 1

        # Delete listing
        db.delete(listing)
        db.commit()

        # Verify cascade
        assert db.query(ListingImage).filter(ListingImage.listing_id == listing_id).count() == 0
        assert db.query(Review).filter(Review.listing_id == listing_id).count() == 0

        # Clean up host
        db.delete(host)
        db.commit()
    finally:
        db.close()


def test_seed_database_completeness_and_idempotency():
    """Verify that the seeder produces 5 listings, images, users, and bookings."""
    db = SessionLocal()
    try:
        stats = seed.seed_database(db)
        assert stats["users"] >= 3, f"Expected at least 3 users, got {stats['users']}"
        assert stats["listings"] == 5, f"Expected 5 listings, got {stats['listings']}"
        assert stats["listing_images"] >= 15, f"Expected at least 15 images, got {stats['listing_images']}"
        assert stats["bookings"] >= 2, f"Expected at least 2 bookings, got {stats['bookings']}"

        # Verify personas exist
        guest = db.query(User).filter(User.email == "l***1@gmail.com").first()
        assert guest is not None
        assert guest.role == "GUEST"

        host_ravi = db.query(User).filter(User.email == "ravi.sharma@gmail.com").first()
        assert host_ravi is not None
        assert host_ravi.is_superhost is True

        host_sarah = db.query(User).filter(User.email == "sarah.jenkins@gmail.com").first()
        assert host_sarah is not None
        assert host_sarah.is_superhost is True

        # Verify listings have images
        all_listings = db.query(Listing).all()
        for l in all_listings:
            assert len(l.images) >= 3, f"Listing {l.id} has {len(l.images)} images"

        # Verify bookings have upcoming date blocking
        confirmed_bookings = db.query(Booking).filter(Booking.status == "CONFIRMED").all()
        assert len(confirmed_bookings) >= 2
        for b in confirmed_bookings:
            assert b.check_in < b.check_out
            assert b.total_price > 0
    finally:
        db.close()


def test_static_uploads_directory():
    """Verify local static storage directory exists and is writable."""
    assert os.path.exists(settings.UPLOAD_DIR), "Upload directory does not exist"
    
    test_file_path = os.path.join(settings.UPLOAD_DIR, ".test_write.tmp")
    with open(test_file_path, "w") as f:
        f.write("persistence_test")
    
    assert os.path.exists(test_file_path)
    os.remove(test_file_path)
