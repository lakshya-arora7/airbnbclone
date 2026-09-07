from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    role = Column(String, default="GUEST")  # "GUEST" or "HOST"
    is_superhost = Column(Boolean, default=False)
    host_since = Column(String, default="March 2024")
    bio = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    listings = relationship("Listing", back_populates="host", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="guest")
    reviews = relationship("Review", back_populates="author")
    wishlists = relationship("Wishlist", back_populates="user", cascade="all, delete-orphan")
