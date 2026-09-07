from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.models.user import User
from app.models.listing import Listing
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewResponse
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/listing/{listing_id}", response_model=List[ReviewResponse])
def get_listing_reviews(listing_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.listing_id == listing_id).order_by(Review.created_at.desc()).all()

@router.get("/user/me", response_model=List[ReviewResponse])
def get_current_user_reviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Review).filter(Review.author_id == current_user.id).order_by(Review.created_at.desc()).all()

@router.get("/user/{user_id}", response_model=List[ReviewResponse])
def get_user_reviews(user_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.author_id == user_id).order_by(Review.created_at.desc()).all()

@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def submit_review(
    payload: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(Listing.id == payload.listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")

    new_review = Review(
        listing_id=payload.listing_id,
        author_id=current_user.id,
        rating=payload.rating,
        cleanliness_rating=payload.cleanliness_rating,
        accuracy_rating=payload.accuracy_rating,
        checkin_rating=payload.checkin_rating,
        communication_rating=payload.communication_rating,
        location_rating=payload.location_rating,
        value_rating=payload.value_rating,
        comment=payload.comment
    )
    db.add(new_review)
    db.commit()

    # Recalculate listing rating and review count dynamically
    stats = db.query(
        func.avg(Review.rating).label("avg_rating"),
        func.count(Review.id).label("total_reviews")
    ).filter(Review.listing_id == payload.listing_id).first()

    if stats:
        listing.rating = round(float(stats.avg_rating or 5.0), 2)
        listing.review_count = int(stats.total_reviews or 0)
        db.commit()

    db.refresh(new_review)
    return new_review
