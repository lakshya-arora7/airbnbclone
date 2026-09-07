"""
Layer 3: Geolocation & Multi-Facet Search Engine

Features:
- Haversine spherical distance calculation (km)
- Radial proximity sorting for "Nearby" searches
- Facet aggregation (price distribution, room types, amenities)
"""

import math
import json
from typing import List, Dict, Any, Optional

EARTH_RADIUS_KM = 6371.0

class SearchEngine:
    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculates the great-circle distance between two points on the Earth (in km).
        """
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)

        a = math.sin(delta_phi / 2.0) ** 2 + \
            math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2

        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return round(EARTH_RADIUS_KM * c, 2)

    @classmethod
    def filter_and_sort_by_proximity(
        cls,
        listings: List[Any],
        target_lat: float,
        target_lon: float,
        max_distance_km: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        """
        Calculates distance from target coordinates, filters by max radius if provided,
        and sorts listings in ascending order of distance.
        """
        enriched = []
        for l in listings:
            dist = cls.haversine_distance(target_lat, target_lon, l.latitude, l.longitude)
            if max_distance_km is None or dist <= max_distance_km:
                enriched.append({
                    "listing": l,
                    "distance_km": dist
                })

        enriched.sort(key=lambda x: x["distance_km"])
        return enriched

    @classmethod
    def compute_search_facets(cls, listings: List[Any]) -> Dict[str, Any]:
        """
        Computes statistical summary and facet buckets across search results.
        """
        if not listings:
            return {
                "total_count": 0,
                "price_stats": {"min": 0, "max": 0, "avg": 0},
                "property_types": {},
                "amenities": {}
            }

        prices = [l.price_per_night for l in listings]
        prop_types: Dict[str, int] = {}
        amenity_counts: Dict[str, int] = {}

        for l in listings:
            prop_types[l.property_type] = prop_types.get(l.property_type, 0) + 1
            try:
                amenities = json.loads(l.amenities_json or "[]")
                for a in amenities:
                    amenity_counts[a] = amenity_counts.get(a, 0) + 1
            except Exception:
                pass

        return {
            "total_count": len(listings),
            "price_stats": {
                "min": min(prices),
                "max": max(prices),
                "avg": round(sum(prices) / len(prices), 2)
            },
            "property_types": prop_types,
            "amenities": amenity_counts
        }
