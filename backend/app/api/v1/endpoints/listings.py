import json
from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.listing import Listing, ListingImage
from app.schemas.listing import (
    ListingResponse, ListingDetailResponse, ListingCreate, ListingUpdate
)
from app.schemas.booking import BookedDateRange
from app.services.search_service import search_listings
from app.services.booking_service import get_booked_dates
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

def serialize_listing(listing: Listing) -> dict:
    try:
        amenities = json.loads(listing.amenities_json or "[]")
    except Exception:
        amenities = []

    return {
        "id": listing.id,
        "host_id": listing.host_id,
        "title": listing.title,
        "subtitle": listing.subtitle,
        "description": listing.description,
        "property_type": listing.property_type,
        "category": listing.category,
        "city": listing.city,
        "country": listing.country,
        "latitude": listing.latitude,
        "longitude": listing.longitude,
        "price_per_night": listing.price_per_night,
        "original_price": listing.original_price,
        "cleaning_fee": listing.cleaning_fee,
        "service_fee_percent": listing.service_fee_percent,
        "max_guests": listing.max_guests,
        "bedrooms": listing.bedrooms,
        "beds": listing.beds,
        "bathrooms": listing.bathrooms,
        "bed_details": listing.bed_details,
        "amenities": amenities,
        "rating": listing.rating,
        "review_count": listing.review_count,
        "is_published": listing.is_published,
        "is_guest_favourite": listing.is_guest_favourite,
        "is_superhost": listing.is_superhost,
        "images": [
            {
                "id": img.id,
                "url": img.url,
                "caption": img.caption,
                "display_order": img.display_order,
                "is_primary": img.is_primary
            } for img in listing.images
        ],
        "created_at": listing.created_at
    }

@router.get("", response_model=List[ListingResponse])
def get_listings(
    location: Optional[str] = Query(None, description="City, country, or keyword search"),
    category: Optional[str] = Query(None, description="Homes, Experiences, Services"),
    property_type: Optional[str] = Query(None, description="Flat, Villa, Apartment, Chalet"),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    guests: Optional[int] = Query(None),
    check_in: Optional[date] = Query(None),
    check_out: Optional[date] = Query(None),
    amenities: Optional[List[str]] = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    results = search_listings(
        db=db,
        location=location,
        category=category,
        property_type=property_type,
        min_price=min_price,
        max_price=max_price,
        guests=guests,
        check_in=check_in,
        check_out=check_out,
        amenities=amenities,
        skip=skip,
        limit=limit
    )
    return [serialize_listing(l) for l in results]

@router.get("/{id}", response_model=ListingDetailResponse)
def get_listing_detail(id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")
    
    data = serialize_listing(listing)
    data["host"] = listing.host
    return data

@router.get("/{id}/booked-dates", response_model=List[BookedDateRange])
def get_listing_booked_dates(id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")
    return get_booked_dates(db, id)

@router.post("", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
def create_listing(
    payload: ListingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_listing = Listing(
        host_id=current_user.id,
        title=payload.title,
        subtitle=payload.subtitle,
        description=payload.description,
        property_type=payload.property_type,
        category=payload.category,
        city=payload.city,
        country=payload.country,
        latitude=payload.latitude,
        longitude=payload.longitude,
        price_per_night=payload.price_per_night,
        original_price=payload.original_price,
        cleaning_fee=payload.cleaning_fee,
        service_fee_percent=payload.service_fee_percent,
        max_guests=payload.max_guests,
        bedrooms=payload.bedrooms,
        beds=payload.beds,
        bathrooms=payload.bathrooms,
        bed_details=payload.bed_details,
        amenities_json=json.dumps(payload.amenities),
        is_published=payload.is_published,
        is_guest_favourite=payload.is_guest_favourite,
        is_superhost=current_user.is_superhost
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)

    # Attach images
    for idx, img_in in enumerate(payload.images):
        img = ListingImage(
            listing_id=new_listing.id,
            url=img_in.url,
            caption=img_in.caption,
            display_order=img_in.display_order or (idx + 1),
            is_primary=img_in.is_primary or (idx == 0)
        )
        db.add(img)

    db.commit()
    db.refresh(new_listing)
    return serialize_listing(new_listing)

@router.put("/{id}", response_model=ListingResponse)
def update_listing(
    id: int,
    payload: ListingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")
    if listing.host_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this listing.")

    update_dict = payload.model_dump(exclude_unset=True)
    if "amenities" in update_dict:
        listing.amenities_json = json.dumps(update_dict.pop("amenities"))

    for key, val in update_dict.items():
        setattr(listing, key, val)

    db.commit()
    db.refresh(listing)
    return serialize_listing(listing)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_listing(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")
    if listing.host_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this listing.")

    db.delete(listing)
    db.commit()
    return None
