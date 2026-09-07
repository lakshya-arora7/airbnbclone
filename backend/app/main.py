import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.api.v1.api import api_router
from app.models.listing import Listing
import seed

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize SQLite tables
    Base.metadata.create_all(bind=engine)

    # 2. Ensure initial auth personas exist if users table is empty
    db = SessionLocal()
    try:
        from app.models.user import User
        if db.query(User).count() == 0:
            seed.seed_personas(db)

        from app.models.listing import Listing
        if db.query(Listing).count() == 0:
            from seed_5_sample_listings import seed_five_sample_listings
            seed_five_sample_listings(db)
    except Exception as e:
        print(f"[Startup] Error during initialization: {e}")
    finally:
        db.close()

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permissive for local pair-programming dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static file uploads directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include API v1 routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health"])
@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
def root():
    return {
        "status": "healthy",
        "service": "airbnb-backend",
        "app": settings.PROJECT_NAME,
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }
