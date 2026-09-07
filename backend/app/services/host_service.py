from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.listing import Listing
from app.models.booking import Booking

def get_host_listings(db: Session, host_id: int) -> List[Listing]:
    return db.query(Listing).filter(Listing.host_id == host_id).order_by(Listing.id.desc()).all()

def get_host_reservations(db: Session, host_id: int) -> List[Booking]:
    return db.query(Booking).join(Listing).filter(Listing.host_id == host_id).order_by(Booking.check_in.desc()).all()

def get_host_stats(db: Session, host_id: int) -> Dict[str, Any]:
    total_listings = db.query(Listing).filter(Listing.host_id == host_id).count()
    
    reservations_query = db.query(Booking).join(Listing).filter(Listing.host_id == host_id)
    total_reservations = reservations_query.count()
    confirmed_reservations = reservations_query.filter(Booking.status == "CONFIRMED").count()
    
    earnings = db.query(func.sum(Booking.total_price)).join(Listing).filter(
        Listing.host_id == host_id,
        Booking.status == "CONFIRMED"
    ).scalar() or 0.0

    return {
        "host_id": host_id,
        "total_listings": total_listings,
        "total_reservations": total_reservations,
        "confirmed_reservations": confirmed_reservations,
        "total_earnings": round(earnings, 2)
    }
