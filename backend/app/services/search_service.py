import json
from datetime import date
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from app.models.listing import Listing
from app.models.booking import Booking

def search_listings(
    db: Session,
    location: Optional[str] = None,
    category: Optional[str] = None,
    property_type: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    guests: Optional[int] = None,
    check_in: Optional[date] = None,
    check_out: Optional[date] = None,
    amenities: Optional[List[str]] = None,
    skip: int = 0,
    limit: int = 50
) -> List[Listing]:
    query = db.query(Listing).filter(Listing.is_published == True)

    # 1. Location text match (City, Country, Title, Description, Subtitle)
    if location and location.strip():
        loc_str = location.strip().lower()
        if loc_str not in ["all", "homes", "stays"]:
            terms = [t for t in loc_str.split() if len(t) > 1]
            conditions = [
                Listing.city.ilike(f"%{loc_str}%"),
                Listing.country.ilike(f"%{loc_str}%"),
                Listing.title.ilike(f"%{loc_str}%"),
                Listing.description.ilike(f"%{loc_str}%"),
                Listing.subtitle.ilike(f"%{loc_str}%")
            ]
            for term in terms:
                conditions.append(Listing.city.ilike(f"%{term}%"))
                conditions.append(Listing.title.ilike(f"%{term}%"))
            query = query.filter(or_(*conditions))

    # 2. Category match
    if category and category.strip() and category.lower() != "all":
        query = query.filter(Listing.category.ilike(category.strip()))

    # 3. Property Type match
    if property_type and property_type.strip():
        query = query.filter(Listing.property_type.ilike(property_type.strip()))

    # 4. Price range match
    if min_price is not None:
        query = query.filter(Listing.price_per_night >= min_price)
    if max_price is not None:
        query = query.filter(Listing.price_per_night <= max_price)

    # 5. Guest capacity match
    if guests is not None and guests > 0:
        query = query.filter(Listing.max_guests >= guests)

    # 6. Check-in & Check-out date availability
    if check_in and check_out and check_out > check_in:
        # Subquery of listings that HAVE a conflicting confirmed booking
        conflicting_listings = db.query(Booking.listing_id).filter(
            Booking.status == "CONFIRMED",
            Booking.check_in < check_out,
            Booking.check_out > check_in
        ).subquery()

        query = query.filter(~Listing.id.in_(conflicting_listings))

    listings = query.order_by(Listing.rating.desc(), Listing.id.desc()).offset(skip).limit(limit).all()

    # 7. Post-filter amenities if provided
    if amenities and len(amenities) > 0:
        filtered = []
        for l in listings:
            try:
                l_amenities = [a.lower() for a in json.loads(l.amenities_json or "[]")]
                if all(req.lower() in l_amenities for req in amenities):
                    filtered.append(l)
            except Exception:
                pass
        return filtered

    return listings
