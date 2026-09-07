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

1. **Brand New Identity**: Sleek `airbnbclone` branding with zero emojis and 100% SVG/Lucide icons.
2. **True Guest vs. Host Modes**: Immediate switching between travelling and hosting modes.
3. **Collision & Booking Engine**: Real-time date availability hold and booking conflict prevention.
4. **Comprehensive Host Suite**: Multi-step listing creation, photo uploads, calendar date blocking, and pricing control.
5. **Multi-Language & Currency**: Live currency conversions and localized interface dictionaries.
