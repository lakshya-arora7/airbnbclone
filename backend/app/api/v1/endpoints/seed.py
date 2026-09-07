from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
import seed

router = APIRouter()

@router.get("/stats")
def get_database_stats(db: Session = Depends(get_db)):
    stats = seed.get_seed_stats(db)
    return {
        "status": "success",
        "data": stats
    }

@router.post("")
def trigger_database_seed(db: Session = Depends(get_db)):
    stats = seed.seed_database(db)
    return {
        "status": "success",
        "message": "Database seeded with rich sample listings, personas, and reviews.",
        "data": stats
    }

@router.post("/reset")
def trigger_database_reset():
    stats = seed.reset_database()
    return {
        "status": "success",
        "message": "Database tables recreated and cleanly reseeded.",
        "data": stats
    }
