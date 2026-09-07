import pytest
from datetime import date
from app.services.collision_engine import CollisionEngine

def test_intervals_overlap_exact_match():
    # Existing: Oct 10 to Oct 15. New: Oct 10 to Oct 15 -> Collision
    start1 = date(2026, 10, 10)
    end1 = date(2026, 10, 15)
    start2 = date(2026, 10, 10)
    end2 = date(2026, 10, 15)
    assert CollisionEngine.intervals_overlap(start1, end1, start2, end2) is True

def test_intervals_overlap_partial_left():
    # Existing: Oct 10 to Oct 15. New: Oct 8 to Oct 12 -> Collision
    start1 = date(2026, 10, 10)
    end1 = date(2026, 10, 15)
    start2 = date(2026, 10, 8)
    end2 = date(2026, 10, 12)
    assert CollisionEngine.intervals_overlap(start1, end1, start2, end2) is True

def test_intervals_overlap_partial_right():
    # Existing: Oct 10 to Oct 15. New: Oct 13 to Oct 18 -> Collision
    start1 = date(2026, 10, 10)
    end1 = date(2026, 10, 15)
    start2 = date(2026, 10, 13)
    end2 = date(2026, 10, 18)
    assert CollisionEngine.intervals_overlap(start1, end1, start2, end2) is True

def test_intervals_overlap_enclosing():
    # Existing: Oct 10 to Oct 15. New: Oct 5 to Oct 20 -> Collision
    start1 = date(2026, 10, 10)
    end1 = date(2026, 10, 15)
    start2 = date(2026, 10, 5)
    end2 = date(2026, 10, 20)
    assert CollisionEngine.intervals_overlap(start1, end1, start2, end2) is True

def test_intervals_overlap_enclosed():
    # Existing: Oct 10 to Oct 15. New: Oct 11 to Oct 14 -> Collision
    start1 = date(2026, 10, 10)
    end1 = date(2026, 10, 15)
    start2 = date(2026, 10, 11)
    end2 = date(2026, 10, 14)
    assert CollisionEngine.intervals_overlap(start1, end1, start2, end2) is True

def test_same_day_turnover_not_a_collision():
    # Existing: Oct 10 to Oct 15.
    # New Guest checks in on Oct 15 to Oct 20 -> Must be allowed (same-day turnover)
    start1 = date(2026, 10, 10)
    end1 = date(2026, 10, 15)
    start2 = date(2026, 10, 15)
    end2 = date(2026, 10, 20)
    assert CollisionEngine.intervals_overlap(start1, end1, start2, end2) is False

def test_disjoint_intervals_not_a_collision():
    # Existing: Oct 10 to Oct 15. New: Oct 20 to Oct 25 -> No collision
    start1 = date(2026, 10, 10)
    end1 = date(2026, 10, 15)
    start2 = date(2026, 10, 20)
    end2 = date(2026, 10, 25)
    assert CollisionEngine.intervals_overlap(start1, end1, start2, end2) is False

def test_validate_dates_invalid_order_raises_error():
    # Check-out before check-in must raise ValueError
    with pytest.raises(ValueError, match="strictly after"):
        CollisionEngine.validate_dates(date(2026, 10, 15), date(2026, 10, 10), allow_past=True)

def test_validate_dates_same_day_raises_error():
    # Same check-in and check-out (0 nights) must raise ValueError
    with pytest.raises(ValueError, match="strictly after"):
        CollisionEngine.validate_dates(date(2026, 10, 15), date(2026, 10, 15), allow_past=True)

def test_memory_collision_multi_intervals():
    existing = [
        (date(2026, 10, 1), date(2026, 10, 5)),
        (date(2026, 10, 10), date(2026, 10, 15)),
        (date(2026, 10, 20), date(2026, 10, 25))
    ]
    # Oct 5 to Oct 10 falls perfectly in the gap -> Available!
    assert CollisionEngine.check_memory_collision(existing, date(2026, 10, 5), date(2026, 10, 10)) is False

    # Oct 12 to Oct 18 overlaps second interval -> Conflict!
    assert CollisionEngine.check_memory_collision(existing, date(2026, 10, 12), date(2026, 10, 18)) is True
