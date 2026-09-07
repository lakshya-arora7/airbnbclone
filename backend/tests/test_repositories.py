import pytest
from datetime import date
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.models.user import User
from app.models.listing import Listing, ListingImage
from app.models.booking import Booking
from app.models.review import Review
from app.models.wishlist import Wishlist, WishlistItem
from app.db.repository import (
    UserRepository,
    ListingRepository,
    BookingRepository,
    ReviewRepository,
    WishlistRepository
)
from app.db.unit_of_work import UnitOfWork

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    # Pre-seed one guest and one host
    guest = User(id=1, email="guest@test.com", full_name="Test Guest", role="GUEST")
    host = User(id=2, email="host@test.com", full_name="Test Host", role="HOST", is_superhost=False)
    session.add(guest)
    session.add(host)
    session.commit()

    yield session
    session.close()

def test_user_repository_crud(db_session):
    repo = UserRepository(db_session)
    assert repo.count() == 2

    # Get by email
    host = repo.get_by_email("host@test.com")
    assert host is not None
    assert host.id == 2

    # Set superhost
    repo.set_superhost(2, True)
    db_session.commit()
    assert repo.get(2).is_superhost is True

    # Filter by role
    hosts = repo.get_by_role("HOST")
    assert len(hosts) == 1
    assert hosts[0].email == "host@test.com"

def test_listing_repository_and_images(db_session):
    repo = ListingRepository(db_session)
    listing = repo.create({
        "host_id": 2,
        "title": "Beach Villa",
        "description": "Oceanfront villa",
        "property_type": "Villa",
        "category": "Homes",
        "city": "Goa",
        "country": "India",
        "latitude": 15.5,
        "longitude": 73.7,
        "price_per_night": 5000.0,
        "cleaning_fee": 500.0
    })
    db_session.commit()

    # Add images
    repo.add_image(listing.id, "https://example.com/img1.jpg", is_primary=True)
    repo.add_image(listing.id, "https://example.com/img2.jpg", is_primary=False)
    db_session.commit()

    # Fetch with joined details
    fetched = repo.get_with_details(listing.id)
    assert fetched is not None
    assert len(fetched.images) == 2
    assert fetched.host.full_name == "Test Host"

def test_booking_repository_overlap_and_cancellation(db_session):
    listing_repo = ListingRepository(db_session)
    booking_repo = BookingRepository(db_session)

    listing = listing_repo.create({
        "host_id": 2,
        "title": "Cozy Flat",
        "description": "City flat",
        "property_type": "Flat",
        "category": "Homes",
        "city": "Delhi",
        "country": "India",
        "latitude": 28.6,
        "longitude": 77.2,
        "price_per_night": 2000.0
    })
    db_session.commit()

    b1 = booking_repo.create({
        "confirmation_code": "HM-TEST01",
        "listing_id": listing.id,
        "guest_id": 1,
        "check_in": date(2026, 12, 1),
        "check_out": date(2026, 12, 5),
        "nightly_rate": 2000.0,
        "total_nights": 4,
        "total_price": 8000.0,
        "status": "CONFIRMED"
    })
    db_session.commit()

    # Overlap test
    assert booking_repo.has_overlap(listing.id, date(2026, 12, 3), date(2026, 12, 7)) is True
    # Non-overlap test (same day turnover)
    assert booking_repo.has_overlap(listing.id, date(2026, 12, 5), date(2026, 12, 10)) is False

    # Cancel booking
    cancelled = booking_repo.cancel(b1.id)
    db_session.commit()
    assert cancelled.status == "CANCELLED"
    # Now that it is cancelled, dates are released
    assert booking_repo.has_overlap(listing.id, date(2026, 12, 3), date(2026, 12, 7)) is False

def test_wishlist_repository_toggle(db_session):
    listing_repo = ListingRepository(db_session)
    wishlist_repo = WishlistRepository(db_session)

    listing = listing_repo.create({
        "host_id": 2,
        "title": "Mountain Chalet",
        "description": "Snow views",
        "property_type": "Chalet",
        "category": "Homes",
        "city": "Manali",
        "country": "India",
        "latitude": 32.2,
        "longitude": 77.1,
        "price_per_night": 4500.0
    })
    db_session.commit()

    # Toggle 1: Save to wishlist
    is_saved = wishlist_repo.toggle_favorite(user_id=1, listing_id=listing.id)
    db_session.commit()
    assert is_saved is True

    wishlist = wishlist_repo.get_user_wishlist(1)
    assert len(wishlist.items) == 1

    # Toggle 2: Remove from wishlist
    is_saved_again = wishlist_repo.toggle_favorite(user_id=1, listing_id=listing.id)
    db_session.commit()
    assert is_saved_again is False

    wishlist_after = wishlist_repo.get_user_wishlist(1)
    assert len(wishlist_after.items) == 0

def test_cascade_delete_listing(db_session):
    listing_repo = ListingRepository(db_session)
    listing = listing_repo.create({
        "host_id": 2,
        "title": "Cascade House",
        "description": "Testing cascade deletion",
        "property_type": "House",
        "category": "Homes",
        "city": "Noida",
        "country": "India",
        "latitude": 28.5,
        "longitude": 77.3,
        "price_per_night": 3000.0
    })
    db_session.commit()

    listing_repo.add_image(listing.id, "https://example.com/test.jpg")
    rev = Review(listing_id=listing.id, author_id=1, rating=5.0, comment="Great!")
    db_session.add(rev)
    db_session.commit()

    # Verify children exist
    assert db_session.query(ListingImage).filter(ListingImage.listing_id == listing.id).count() == 1
    assert db_session.query(Review).filter(Review.listing_id == listing.id).count() == 1

    # Delete listing
    listing_repo.remove(listing.id)
    db_session.commit()

    # Verify children were automatically cascaded
    assert db_session.query(ListingImage).filter(ListingImage.listing_id == listing.id).count() == 0
    assert db_session.query(Review).filter(Review.listing_id == listing.id).count() == 0

def test_unit_of_work_commit_and_rollback(db_session):
    # Test UoW Commit
    with UnitOfWork(session=db_session) as uow:
        uow.users.create({
            "id": 99,
            "email": "uow_user@test.com",
            "full_name": "UoW User",
            "role": "GUEST"
        })
    
    assert db_session.query(User).filter(User.id == 99).first() is not None

    # Test UoW Rollback on Exception
    try:
        with UnitOfWork(session=db_session) as uow:
            uow.users.create({
                "id": 100,
                "email": "rollback_user@test.com",
                "full_name": "Rollback User",
                "role": "GUEST"
            })
            # Simulate unexpected failure
            raise RuntimeError("Database transaction failed!")
    except RuntimeError:
        pass

    # Must be completely rolled back
    assert db_session.query(User).filter(User.id == 100).first() is None
