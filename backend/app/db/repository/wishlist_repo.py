from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from app.models.wishlist import Wishlist, WishlistItem
from app.models.listing import Listing
from app.db.repository.base import BaseRepository

class WishlistRepository(BaseRepository[Wishlist]):
    def __init__(self, db: Session):
        super().__init__(Wishlist, db)

    def get_user_wishlist(self, user_id: int) -> Wishlist:
        wishlist = self.db.query(Wishlist).options(
            joinedload(Wishlist.items).joinedload(WishlistItem.listing).joinedload(Listing.images)
        ).filter(Wishlist.user_id == user_id).first()

        if not wishlist:
            wishlist = Wishlist(user_id=user_id, name="Saved Homes")
            self.db.add(wishlist)
            self.db.flush()

        return wishlist

    def toggle_favorite(self, user_id: int, listing_id: int) -> bool:
        wishlist = self.get_user_wishlist(user_id)
        existing = self.db.query(WishlistItem).filter(
            WishlistItem.wishlist_id == wishlist.id,
            WishlistItem.listing_id == listing_id
        ).first()

        if existing:
            self.db.delete(existing)
            self.db.flush()
            return False
        else:
            new_item = WishlistItem(wishlist_id=wishlist.id, listing_id=listing_id)
            self.db.add(new_item)
            self.db.flush()
            return True
