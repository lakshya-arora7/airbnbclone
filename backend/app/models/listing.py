from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String, index=True, nullable=False)
    subtitle = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    property_type = Column(String, nullable=False)  # "Flat", "Villa", "Apartment", "Chalet"
    category = Column(String, default="Homes")       # "Homes", "Experiences", "Services"
    
    city = Column(String, index=True, nullable=False)
    country = Column(String, index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    price_per_night = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    cleaning_fee = Column(Float, default=400.0)
    service_fee_percent = Column(Float, default=14.0)
    
    max_guests = Column(Integer, default=4)
    bedrooms = Column(Integer, default=2)
    beds = Column(Integer, default=2)
    bathrooms = Column(Integer, default=2)
    bed_details = Column(String, nullable=True)
    
    amenities_json = Column(Text, default="[]")  # JSON encoded list of amenities
    
    rating = Column(Float, default=5.0)
    review_count = Column(Integer, default=0)
    
    is_published = Column(Boolean, default=True)
    is_guest_favourite = Column(Boolean, default=False)
    is_superhost = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    host = relationship("User", back_populates="listings")
    images = relationship("ListingImage", back_populates="listing", cascade="all, delete-orphan", order_by="ListingImage.display_order")
    bookings = relationship("Booking", back_populates="listing", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="listing", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="listing", cascade="all, delete-orphan")


class ListingImage(Base):
    __tablename__ = "listing_images"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    url = Column(String, nullable=False)
    caption = Column(String, nullable=True)
    display_order = Column(Integer, default=1)
    is_primary = Column(Boolean, default=False)

    listing = relationship("Listing", back_populates="images")
