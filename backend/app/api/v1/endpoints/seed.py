from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.seed_data import seed_database
from seed import get_seed_stats, clean_database

router = APIRouter()

@router.get("/stats")
def get_database_stats(db: Session = Depends(get_db)):
    stats = get_seed_stats(db)
    return {
        "status": "success",
        "data": stats
    }

@router.post("")
def trigger_database_seed(db: Session = Depends(get_db)):
    stats = seed_database(db)
    return {
        "status": "success",
        "message": "Database seeded with rich sample listings, personas, bookings, and reviews.",
        "data": stats
    }

@router.post("/reset")
def trigger_database_reset(db: Session = Depends(get_db)):
    stats = seed_database(db)
    return {
        "status": "success",
        "message": "Database tables cleanly reseeded.",
        "data": stats
    }
