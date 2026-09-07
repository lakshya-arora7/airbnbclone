import pytest
from app.services.search_engine import SearchEngine

class MockListing:
    def __init__(self, id, title, lat, lon, price, prop_type, amenities):
        self.id = id
        self.title = title
        self.latitude = lat
        self.longitude = lon
        self.price_per_night = price
        self.property_type = prop_type
        self.amenities_json = amenities

def test_haversine_distance_calculation():
    # Noida Sector 63: 28.627, 77.372
    # Delhi Hauz Khas: 28.553, 77.194
    dist = SearchEngine.haversine_distance(28.627, 77.372, 28.553, 77.194)
    # Approximately 19-20 km
    assert 17.0 <= dist <= 22.0

def test_haversine_same_point_is_zero():
    dist = SearchEngine.haversine_distance(28.627, 77.372, 28.627, 77.372)
    assert dist == 0.0

def test_filter_and_sort_by_proximity():
    # Target: Central Delhi (28.6139, 77.2090)
    # Listing 1: Hauz Khas Delhi (28.553, 77.194) ~ 7 km
    # Listing 2: Noida Sector 63 (28.627, 77.372) ~ 16 km
    # Listing 3: Candolim Goa (15.518, 73.763) ~ 1500 km
    l1 = MockListing(1, "Delhi Haveli", 28.553, 77.194, 4600, "Heritage home", '["Wifi"]')
    l2 = MockListing(2, "Noida Flat", 28.627, 77.372, 3600, "Flat", '["Wifi", "Pool"]')
    l3 = MockListing(3, "Goa Villa", 15.518, 73.763, 9800, "Villa", '["Pool"]')

    sorted_results = SearchEngine.filter_and_sort_by_proximity(
        listings=[l3, l2, l1],
        target_lat=28.6139,
        target_lon=77.2090
    )

    # Nearest must be l1, then l2, then l3
    assert sorted_results[0]["listing"].id == 1
    assert sorted_results[1]["listing"].id == 2
    assert sorted_results[2]["listing"].id == 3
    assert sorted_results[0]["distance_km"] < sorted_results[1]["distance_km"] < sorted_results[2]["distance_km"]

def test_compute_search_facets():
    l1 = MockListing(1, "A", 0, 0, 2000, "Flat", '["Wifi", "Kitchen"]')
    l2 = MockListing(2, "B", 0, 0, 4000, "Flat", '["Wifi", "Pool"]')
    l3 = MockListing(3, "C", 0, 0, 6000, "Villa", '["Pool"]')

    facets = SearchEngine.compute_search_facets([l1, l2, l3])
    assert facets["total_count"] == 3
    assert facets["price_stats"]["min"] == 2000
    assert facets["price_stats"]["max"] == 6000
    assert facets["price_stats"]["avg"] == 4000.0
    assert facets["property_types"]["Flat"] == 2
    assert facets["property_types"]["Villa"] == 1
    assert facets["amenities"]["Wifi"] == 2
    assert facets["amenities"]["Pool"] == 2
    assert facets["amenities"]["Kitchen"] == 1
