from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, listings, bookings, host, reviews, wishlists, upload, seed, messages, notifications
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth & Personas"])
api_router.include_router(listings.router, prefix="/listings", tags=["Listings"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
api_router.include_router(host.router, prefix="/host", tags=["Host Dashboard"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
api_router.include_router(wishlists.router, prefix="/wishlists", tags=["Wishlists"])
api_router.include_router(messages.router, prefix="/messages", tags=["Messages"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(upload.router, prefix="/upload", tags=["File Upload"])
api_router.include_router(seed.router, prefix="/seed", tags=["Database Seeder"])

