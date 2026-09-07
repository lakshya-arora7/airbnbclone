import pytest
from app.services.review_engine import ReviewEngine

class MockReview:
    def __init__(self, rating, cleanliness, accuracy, checkin, comms, loc, value):
        self.rating = rating
        self.cleanliness_rating = cleanliness
        self.accuracy_rating = accuracy
        self.checkin_rating = checkin
        self.communication_rating = comms
        self.location_rating = loc
        self.value_rating = value

def test_superhost_eligibility_constants():
    assert ReviewEngine.SUPERHOST_MIN_RATING == 4.80
    assert ReviewEngine.SUPERHOST_MIN_REVIEWS == 3
