from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.listing import ListingResponse
from app.schemas.booking import BookingResponse
from app.services.host_service import get_host_listings, get_host_reservations, get_host_stats
from app.api.v1.endpoints.auth import get_current_user
from app.api.v1.endpoints.listings import serialize_listing
from app.api.v1.endpoints.bookings import serialize_booking

router = APIRouter()

@router.get("/listings", response_model=List[ListingResponse])
def list_host_properties(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listings = get_host_listings(db, current_user.id)
    return [serialize_listing(l) for l in listings]

@router.get("/reservations", response_model=List[BookingResponse])
def list_host_reservations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reservations = get_host_reservations(db, current_user.id)
    return [serialize_booking(b) for b in reservations]

@router.get("/stats", response_model=Dict[str, Any])
def host_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_host_stats(db, current_user.id)
