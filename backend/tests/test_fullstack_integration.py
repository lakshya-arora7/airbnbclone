import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
import seed

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """Ensure database has clean seed data for integration testing."""
    db = SessionLocal()
    try:
        seed.seed_database(db)
    finally:
        db.close()


def test_api_get_listings_returns_catalog():
    """Verify GET /api/v1/listings returns 16 curated listings."""
    response = client.get("/api/v1/listings")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 16
    assert any(item["city"] == "Noida" for item in data)
    assert any(item["city"] == "Paris" for item in data)
    assert any(item["city"] == "Goa" for item in data)


def test_api_get_listing_detail_and_booked_dates():
    """Verify listing detail and booked dates endpoints."""
    # Listing 3 (Noida Studio) has a confirmed booking from seed.py
    detail_res = client.get("/api/v1/listings/3")
    assert detail_res.status_code == 200
    listing = detail_res.json()
    assert listing["id"] == 3
    assert len(listing["images"]) == 5

    dates_res = client.get("/api/v1/listings/3/booked-dates")
    assert dates_res.status_code == 200
    booked_ranges = dates_res.json()
    assert len(booked_ranges) >= 1
    assert "check_in" in booked_ranges[0]
    assert "check_out" in booked_ranges[0]


def test_transactional_date_collision_avoidance():
    """Verify HTTP 409 Conflict when attempting to book overlapping dates."""
    today = date.today()
    # The seeded booking on listing 3 is from today+5 to today+8
    conflict_payload = {
        "listing_id": 3,
        "check_in": (today + timedelta(days=6)).isoformat(),
        "check_out": (today + timedelta(days=10)).isoformat(),
        "guests_count": 2,
        "payment_method": "UPI / QR Code"
    }

    headers = {"X-User-Id": "1"}
    response = client.post("/api/v1/bookings", json=conflict_payload, headers=headers)
    assert response.status_code == 409, f"Expected 409 Conflict, got {response.status_code}: {response.text}"
    assert "already booked" in response.json()["detail"]


def test_successful_booking_creation_and_blocking_persistence():
    """Verify a valid booking persists to SQLite, blocks dates, and appears in My Trips."""
    today = date.today()
    # Book free dates: today + 20 to today + 23 on listing 3
    check_in = (today + timedelta(days=20)).isoformat()
    check_out = (today + timedelta(days=23)).isoformat()

    valid_payload = {
        "listing_id": 3,
        "check_in": check_in,
        "check_out": check_out,
        "guests_count": 2,
        "payment_method": "Credit Card"
    }

    headers = {"X-User-Id": "1"}
    booking_res = client.post("/api/v1/bookings", json=valid_payload, headers=headers)
    assert booking_res.status_code == 201
    booking_data = booking_res.json()
    assert booking_data["status"] == "CONFIRMED"
    booking_id = booking_data["id"]
    conf_code = booking_data["confirmation_code"]
    assert conf_code.startswith("HM-")

    # 1. Verify date blocking is immediately reflected in booked-dates endpoint
    dates_res = client.get("/api/v1/listings/3/booked-dates")
    assert dates_res.status_code == 200
    ranges = dates_res.json()
    assert any(r["check_in"] == check_in and r["check_out"] == check_out for r in ranges)

    # 2. Verify booking appears in My Trips for Guest Lakshya
    trips_res = client.get("/api/v1/bookings/my-trips", headers=headers)
    assert trips_res.status_code == 200
    trips = trips_res.json()
    assert any(t["id"] == booking_id for t in trips)

    # 3. Cancel booking and verify date release
    cancel_res = client.patch(f"/api/v1/bookings/{booking_id}/cancel", headers=headers)
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] == "CANCELLED"

    # 4. Verify cancelled booking is no longer blocking dates
    dates_res_after = client.get("/api/v1/listings/3/booked-dates")
    ranges_after = dates_res_after.json()
    assert not any(r["check_in"] == check_in and r["check_out"] == check_out for r in ranges_after)


def test_host_listings_and_reservations():
    """Verify host endpoints return properties and guest reservations."""
    host_headers = {"X-User-Id": "2"}
    host_listings_res = client.get("/api/v1/host/listings", headers=host_headers)
    assert host_listings_res.status_code == 200
    host_listings = host_listings_res.json()
    assert len(host_listings) >= 1

    host_reservations_res = client.get("/api/v1/host/reservations", headers=host_headers)
    assert host_reservations_res.status_code == 200
