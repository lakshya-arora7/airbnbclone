from typing import List, Tuple
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.models.review import Review
from app.db.repository.base import BaseRepository

class ReviewRepository(BaseRepository[Review]):
    def __init__(self, db: Session):
        super().__init__(Review, db)

    def get_by_listing(self, listing_id: int) -> List[Review]:
        return self.db.query(Review).options(
            joinedload(Review.author)
        ).filter(Review.listing_id == listing_id).order_by(Review.created_at.desc()).all()

    def get_listing_stats(self, listing_id: int) -> Tuple[float, int]:
        stats = self.db.query(
            func.avg(Review.rating).label("avg_rating"),
            func.count(Review.id).label("total_reviews")
        ).filter(Review.listing_id == listing_id).first()
        
        avg_rating = round(float(stats.avg_rating or 5.0), 2) if stats else 5.0
        total_reviews = int(stats.total_reviews or 0) if stats else 0
        return (avg_rating, total_reviews)
