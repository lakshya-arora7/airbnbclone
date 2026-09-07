# Airbnb Clone (Fullstack Next.js & FastAPI)

A production-ready fullstack Airbnb clone built with Next.js 16 (React 19, TypeScript, Tailwind CSS) and FastAPI (Python, SQLAlchemy, SQLite).

---

## Architecture Overview

- **Frontend**: Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS, Lucide React icons, Leaflet Maps.
- **Backend**: FastAPI, SQLAlchemy ORM, SQLite database with Unit of Work and Repository design patterns.
- **Real-Time Authentication & Personas**: Guest vs. Host persona switching with active session state.
- **Search & Filtering**: Real-time date collisions, guest counters, price ranges, amenities, and location queries.
- **Interactive Host Dashboard**: Create listings, manage reservations, block calendar dates, and update pricing.

---

## Project Structure

```
airbnb/
├── frontend/             # Next.js 16 web application
│   ├── src/
│   │   ├── app/          # App router pages (homes, rooms, hosting, trips, messages, etc.)
│   │   ├── components/   # Modular UI components (header, search, booking, map, hosting)
│   │   ├── context/      # Auth, wishlist, and language/currency contexts
│   │   ├── lib/          # API client for backend communication
│   │   └── types/        # TypeScript interfaces
├── backend/              # FastAPI Python backend
│   ├── app/
│   │   ├── api/v1/       # REST API endpoints (listings, bookings, host, reviews, auth)
│   │   ├── db/           # Database session, repositories, and unit-of-work
│   │   ├── models/       # SQLAlchemy database models
│   │   ├── schemas/      # Pydantic validation schemas
│   │   └── services/     # Search, pricing, collision, and booking engines
│   └── tests/            # Pytest test suite
└── package.json          # Root orchestration scripts
```

---

## Getting Started

### 1. Prerequisites
- Node.js 18+ and npm
- Python 3.10+

### 2. Start Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Backend API docs available at `http://localhost:8000/docs`.

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:3000`.

### 4. Run Both Concurrently (from root)
```bash
npm run dev
```

---

## Key Features

1. **Authentic Airbnb Identity**: Sleek typography, exact color tokens (`#FF385C`, `#222222`), photo-forward layouts, and zero emojis with clean SVG icons.
2. **True Guest vs. Host Modes**: Immediate switching between travelling (Guest) and hosting (Host) personas with role-based navigation.
3. **Collision & Booking Engine**: Real-time date availability checks, calendar blocking, and double-booking prevention.
4. **Comprehensive Host Suite**: Full CRUD listing creation, photo uploads, pricing rules, calendar date blocking, and booking management.
5. **Multi-Language & Currency**: Live currency conversions (INR, USD, EUR, GBP, JPY) and multi-language support.

---

## Database Schema Design (SQLite & SQLAlchemy)

The application uses a relational SQLite database with foreign key cascades and data integrity constraints:

```
[USERS] 1 ──── ∞ [LISTINGS] (host_id)
  │                 │
  │                 ├── 1 ──── ∞ [LISTING_IMAGES] (listing_id, cascade delete)
  │                 ├── 1 ──── ∞ [BOOKINGS] (listing_id, date range block)
  │                 └── 1 ──── ∞ [REVIEWS] (listing_id, 5-star metrics)
  │
  ├── 1 ──── ∞ [BOOKINGS] (guest_id)
  ├── 1 ──── ∞ [REVIEWS] (author_id)
  └── 1 ──── 1 [WISHLISTS] ──── ∞ [WISHLIST_ITEMS] (listing_id)
```

### Table Breakdown
- **`users`**: `id`, `email`, `full_name`, `avatar_url`, `role` (`GUEST` / `HOST`), `is_superhost`, `host_since`, `bio`.
- **`listings`**: `id`, `host_id`, `title`, `subtitle`, `description`, `property_type`, `category`, `city`, `country`, `latitude`, `longitude`, `price_per_night`, `original_price`, `cleaning_fee`, `service_fee_percent`, `max_guests`, `bedrooms`, `beds`, `bathrooms`, `amenities` (JSON), `is_published`, `is_guest_favourite`.
- **`listing_images`**: `id`, `listing_id`, `url`, `caption`, `display_order`, `is_primary`.
- **`bookings`**: `id`, `listing_id`, `guest_id`, `confirmation_code`, `check_in`, `check_out`, `guests_count`, `total_price`, `status` (`CONFIRMED`, `CANCELLED`).
- **`reviews`**: `id`, `listing_id`, `author_id`, `rating`, `cleanliness_rating`, `accuracy_rating`, `checkin_rating`, `communication_rating`, `location_rating`, `value_rating`, `comment`, `created_at`.
- **`wishlists` & `wishlist_items`**: `id`, `user_id`, `name` & `id`, `wishlist_id`, `listing_id`.

---

## Assumptions Made

1. **Payment Processing**: Real payment gateways (e.g. Stripe) are out of scope per assignment guidelines. The checkout workflow is fully interactive with realistic confirmation codes, price calculations, and state management.
2. **User Authentication**: Simplified persona-based authentication ("Guest vs. Host") allows effortless testing of guest booking workflows alongside host CRUD dashboards without email verification hurdles.
3. **Maps / Geolocation**: Implemented using interactive Leaflet maps with custom price bubble pins and coordinate matching, without requiring paid third-party Google Maps API keys.
4. **Data Persistence**: All created listings, edited bookings, reviews, and wishlist toggles persist directly into the relational SQLite database.

---

## Deployment & Live URLs

- **GitHub Repository**: [https://github.com/lakshya-arora7/airbnbclone](https://github.com/lakshya-arora7/airbnbclone)
- **Backend (Railway)**: `https://airbnbclone-production-cbcb.up.railway.app`
- **Frontend (Vercel)**: Deployed from `main` branch.

