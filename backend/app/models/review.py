from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    rating = Column(Float, nullable=False)
    cleanliness_rating = Column(Float, default=5.0)
    accuracy_rating = Column(Float, default=5.0)
    checkin_rating = Column(Float, default=5.0)
    communication_rating = Column(Float, default=5.0)
    location_rating = Column(Float, default=5.0)
    value_rating = Column(Float, default=5.0)
    
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    listing = relationship("Listing", back_populates="reviews")
    author = relationship("User", back_populates="reviews")
