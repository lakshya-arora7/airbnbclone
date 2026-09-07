from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.listing import Listing
from app.models.wishlist import Wishlist, WishlistItem
from app.schemas.wishlist import WishlistResponse, WishlistToggleResponse
from app.api.v1.endpoints.auth import get_current_user
from app.api.v1.endpoints.listings import serialize_listing

router = APIRouter()

@router.get("", response_model=WishlistResponse)
def get_user_wishlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == current_user.id).first()
    if not wishlist:
        wishlist = Wishlist(user_id=current_user.id, name="Saved Homes")
        db.add(wishlist)
        db.commit()
        db.refresh(wishlist)

    listings = [serialize_listing(item.listing) for item in wishlist.items if item.listing]
    return {
        "id": wishlist.id,
        "user_id": wishlist.user_id,
        "name": wishlist.name,
        "created_at": wishlist.created_at,
        "listings": listings
    }

@router.post("/toggle/{listing_id}", response_model=WishlistToggleResponse)
def toggle_wishlist_item(
    listing_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")

    wishlist = db.query(Wishlist).filter(Wishlist.user_id == current_user.id).first()
    if not wishlist:
        wishlist = Wishlist(user_id=current_user.id, name="Saved Homes")
        db.add(wishlist)
        db.commit()
        db.refresh(wishlist)

    existing = db.query(WishlistItem).filter(
        WishlistItem.wishlist_id == wishlist.id,
        WishlistItem.listing_id == listing_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {
            "listing_id": listing_id,
            "is_favorited": False,
            "message": "Removed from wishlist."
        }
    else:
        new_item = WishlistItem(wishlist_id=wishlist.id, listing_id=listing_id)
        db.add(new_item)
        db.commit()
        return {
            "listing_id": listing_id,
            "is_favorited": True,
            "message": "Saved to wishlist."
        }
