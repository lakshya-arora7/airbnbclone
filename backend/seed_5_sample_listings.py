import json
import os
import sys
from datetime import date, datetime, timedelta, timezone

# Ensure project root & backend are in Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.user import User
from app.models.listing import Listing, ListingImage
from app.models.booking import Booking
from app.models.review import Review
from app.models.wishlist import Wishlist, WishlistItem

def seed_five_sample_listings(db=None):
    print("[Seed] Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    close_at_end = False
    if db is None:
        db = SessionLocal()
        close_at_end = True

    try:
        # 1. Clean existing listings, images, bookings, reviews, wishlist items
        db.query(WishlistItem).delete()
        db.query(Wishlist).delete()
        db.query(Review).delete()
        db.query(Booking).delete()
        db.query(ListingImage).delete()
        db.query(Listing).delete()
        db.commit()

        # 2. Ensure core personas exist
        guest = db.query(User).filter(User.id == 1).first()
        if not guest:
            guest = User(
                id=1,
                email="lakshya@gmail.com",
                full_name="Lakshya Arora",
                avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
                role="GUEST",
                is_superhost=False,
                host_since="January 2024",
                bio="Software engineer & world traveler."
            )
            db.add(guest)

        host_ravi = db.query(User).filter(User.id == 2).first()
        if not host_ravi:
            host_ravi = User(
                id=2,
                email="ravi.sharma@gmail.com",
                full_name="Ravi Sharma",
                avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
                role="HOST",
                is_superhost=True,
                host_since="March 2022",
                bio="Architect and Superhost passionate about thoughtful spaces."
            )
            db.add(host_ravi)

        host_sarah = db.query(User).filter(User.id == 3).first()
        if not host_sarah:
            host_sarah = User(
                id=3,
                email="sarah.jenkins@gmail.com",
                full_name="Sarah Jenkins",
                avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
                role="HOST",
                is_superhost=True,
                host_since="August 2021",
                bio="Luxury villa curator across Europe and Asia."
            )
            db.add(host_sarah)

        db.commit()

        # 3. Exactly 5 authentic listings extracted from real Airbnb sample data
        sample_listings_data = [
            {
                "id": 1,
                "host_id": 2,
                "title": "Modern Minimalist 2BHK Flat in Sector 63",
                "subtitle": "Sector 63, Noida, Uttar Pradesh",
                "description": "Sunlit and elegantly styled contemporary apartment located in the prime hub of Sector 63. Features an open-concept living area, high-speed fiber internet, dedicated ergonomic workstation, fully stocked modular kitchen, and private sunset balcony. Ideal for professionals and holiday makers.",
                "property_type": "Flat",
                "category": "Homes",
                "city": "Noida",
                "country": "India",
                "latitude": 28.627,
                "longitude": 77.372,
                "price_per_night": 7400.0,
                "original_price": 8500.0,
                "cleaning_fee": 350.0,
                "service_fee_percent": 14.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2,
                "bed_details": "2 bedrooms · 2 king beds · 2 attached bathrooms",
                "amenities": ["Wifi", "Air conditioning", "Kitchen", "Free parking", "Dedicated workspace", "Elevator", "Attached bathroom", "TV"],
                "rating": 5.0,
                "review_count": 8,
                "is_published": True,
                "is_guest_favourite": True,
                "is_superhost": True,
                "images": [
                    {"url": "https://a0.muscache.com/im/pictures/hosting/Hosting-1760086790841856144/original/e30142cd-f498-4e07-802c-92072edd922d.png", "caption": "Living Area with Modern Decor", "is_primary": True},
                    {"url": "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?w=800&auto=format&fit=crop&q=80", "caption": "Sunset Balcony & Lounge", "is_primary": False},
                    {"url": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80", "caption": "Master Bedroom Suite", "is_primary": False},
                    {"url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80", "caption": "Luxury Attached Bathroom", "is_primary": False},
                ]
            },
            {
                "id": 2,
                "host_id": 2,
                "title": "Royal Serenity Villa with Private Lawn & Pool",
                "subtitle": "Sector 44, Noida, Uttar Pradesh",
                "description": "Expansive architectural estate featuring private landscaped gardens, heated outdoor plunge pool, serene gazebo, and bespoke artisan interiors. Enjoy serene mornings with birdsong and luxurious evenings by the barbecue patio. Perfect for family getaways and intimate retreats.",
                "property_type": "Villa",
                "category": "Homes",
                "city": "Noida",
                "country": "India",
                "latitude": 28.552,
                "longitude": 77.339,
                "price_per_night": 9397.0,
                "original_price": 11000.0,
                "cleaning_fee": 600.0,
                "service_fee_percent": 14.0,
                "max_guests": 8,
                "bedrooms": 4,
                "beds": 5,
                "bathrooms": 4,
                "bed_details": "4 bedrooms · 5 beds · 4 attached bathrooms",
                "amenities": ["Pool", "Wifi", "Air conditioning", "Garden", "Free parking", "Kitchen", "Attached bathroom", "TV", "Security cameras"],
                "rating": 5.0,
                "review_count": 8,
                "is_published": True,
                "is_guest_favourite": True,
                "is_superhost": True,
                "images": [
                    {"url": "https://a0.muscache.com/im/pictures/hosting/Hosting-1727363874952159666/original/64b2769f-5e1d-4c41-b6a9-901c8986ed61.jpeg", "caption": "Villa Exterior & Private Lawn", "is_primary": True},
                    {"url": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80", "caption": "Private Swimming Pool View", "is_primary": False},
                    {"url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80", "caption": "Sunlit Grand Living Hall", "is_primary": False},
                    {"url": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80", "caption": "Modern Designer Dining", "is_primary": False},
                ]
            },
            {
                "id": 3,
                "host_id": 2,
                "title": "Skyline Luxury Penthouse Suite in Sector 75",
                "subtitle": "Sector 75, Noida, Uttar Pradesh",
                "description": "Perched on the 24th floor, this penthouse offers 270-degree wraparound vistas of the city skyline. Tastefully curated with Italian marble, custom ambient lighting, automated climate control, and high-speed Wi-Fi. Steps away from metro connectivity and vibrant shopping hubs.",
                "property_type": "Flat",
                "category": "Homes",
                "city": "Noida",
                "country": "India",
                "latitude": 28.583,
                "longitude": 77.382,
                "price_per_night": 10385.0,
                "original_price": 12500.0,
                "cleaning_fee": 450.0,
                "service_fee_percent": 14.0,
                "max_guests": 5,
                "bedrooms": 3,
                "beds": 3,
                "bathrooms": 3,
                "bed_details": "3 bedrooms · 3 king beds · 3 bathrooms",
                "amenities": ["Wifi", "Air conditioning", "City view balcony", "Elevator", "Kitchen", "Dedicated workspace", "Gym access", "Free parking"],
                "rating": 5.0,
                "review_count": 12,
                "is_published": True,
                "is_guest_favourite": True,
                "is_superhost": True,
                "images": [
                    {"url": "https://a0.muscache.com/im/pictures/hosting/Hosting-1723081944410646004/original/c6be1912-bcee-478c-91c9-df409629533c.jpeg", "caption": "Skyline Living Room", "is_primary": True},
                    {"url": "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&auto=format&fit=crop&q=80", "caption": "Penthouse Balcony Sunset", "is_primary": False},
                    {"url": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80", "caption": "King Master Suite", "is_primary": False},
                ]
            },
            {
                "id": 4,
                "host_id": 2,
                "title": "The Glasshouse Studio with Panoramic Views",
                "subtitle": "Expressway Corridor, Noida, Uttar Pradesh",
                "description": "Floor-to-ceiling soundproof glass walls flood this chic designer studio with natural daylight. Equipped with a plush queen bed, smart streaming 4K TV, boutique kitchenette, and sleek spa-style rain shower. Ideal for solo explorers and couples looking for a stylish urban stay.",
                "property_type": "Apartment",
                "category": "Homes",
                "city": "Noida",
                "country": "India",
                "latitude": 28.514,
                "longitude": 77.378,
                "price_per_night": 9900.0,
                "original_price": 10800.0,
                "cleaning_fee": 300.0,
                "service_fee_percent": 14.0,
                "max_guests": 2,
                "bedrooms": 1,
                "beds": 1,
                "bathrooms": 1,
                "bed_details": "1 bedroom · 1 queen bed · 1 bathroom",
                "amenities": ["Wifi", "Air conditioning", "TV", "Kitchenette", "Free parking", "Elevator", "Attached bathroom"],
                "rating": 5.0,
                "review_count": 6,
                "is_published": True,
                "is_guest_favourite": False,
                "is_superhost": True,
                "images": [
                    {"url": "https://a0.muscache.com/im/pictures/hosting/Hosting-1758129629623373262/original/124d23b4-8807-4361-b447-ae8d826fc13f.jpeg", "caption": "Glasshouse Studio Interior", "is_primary": True},
                    {"url": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80", "caption": "Sunlit Studio Bedroom Corner", "is_primary": False},
                    {"url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80", "caption": "Spa Rain Shower Bath", "is_primary": False},
                ]
            },
            {
                "id": 5,
                "host_id": 2,
                "title": "Sunlit Urban Oasis with Private Terrace",
                "subtitle": "Sector 50, Noida, Uttar Pradesh",
                "description": "A tranquil sanctuary tucked away in a quiet residential neighborhood of Sector 50. Features a private leafy open-air terrace with comfortable seating, fully equipped gourmet kitchen, washing machine, and cozy bedrooms with blackout curtains for restful nights.",
                "property_type": "Flat",
                "category": "Homes",
                "city": "Noida",
                "country": "India",
                "latitude": 28.575,
                "longitude": 77.362,
                "price_per_night": 7813.0,
                "original_price": 8900.0,
                "cleaning_fee": 350.0,
                "service_fee_percent": 14.0,
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": 2,
                "bed_details": "2 bedrooms · 2 double beds · 2 bathrooms",
                "amenities": ["Wifi", "Air conditioning", "Private terrace", "Kitchen", "Washing machine", "Free parking", "Attached bathroom"],
                "rating": 4.89,
                "review_count": 87,
                "is_published": True,
                "is_guest_favourite": True,
                "is_superhost": True,
                "images": [
                    {"url": "https://a0.muscache.com/im/pictures/hosting/Hosting-1259942929662348274/original/9513bdb4-9a4c-4d69-a556-997f579258fa.jpeg", "caption": "Terrace View & Open Lounge", "is_primary": True},
                    {"url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80", "caption": "Cozy Bedroom with Ambient Lighting", "is_primary": False},
                    {"url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80", "caption": "Modern Modular Kitchen", "is_primary": False},
                ]
            }
        ]

        # Insert Listings & Images
        for item in sample_listings_data:
            listing = Listing(
                id=item["id"],
                host_id=item["host_id"],
                title=item["title"],
                subtitle=item["subtitle"],
                description=item["description"],
                property_type=item["property_type"],
                category=item["category"],
                city=item["city"],
                country=item["country"],
                latitude=item["latitude"],
                longitude=item["longitude"],
                price_per_night=item["price_per_night"],
                original_price=item.get("original_price"),
                cleaning_fee=item["cleaning_fee"],
                service_fee_percent=item["service_fee_percent"],
                max_guests=item["max_guests"],
                bedrooms=item["bedrooms"],
                beds=item["beds"],
                bathrooms=item["bathrooms"],
                bed_details=item["bed_details"],
                amenities_json=json.dumps(item["amenities"]),
                rating=item["rating"],
                review_count=item["review_count"],
                is_published=item["is_published"],
                is_guest_favourite=item["is_guest_favourite"],
                is_superhost=item["is_superhost"]
            )
            db.add(listing)
            db.flush()

            for idx, img in enumerate(item["images"]):
                db.add(ListingImage(
                    listing_id=listing.id,
                    url=img["url"],
                    caption=img["caption"],
                    display_order=idx + 1,
                    is_primary=img["is_primary"]
                ))

        db.commit()

        # 4. Insert 2 authentic bookings so user can view & edit bookings immediately
        today = date.today()
        booking_1 = Booking(
            id=1,
            confirmation_code="HM-849204",
            listing_id=1,
            guest_id=1,
            check_in=today + timedelta(days=5),
            check_out=today + timedelta(days=9),
            guests_count=2,
            nightly_rate=7400.0,
            total_nights=4,
            cleaning_fee=350.0,
            service_fee=4144.0,
            total_price=(7400.0 * 4) + 350.0 + 4144.0,
            payment_method="UPI / QR Code",
            status="CONFIRMED",
            created_at=datetime.now(timezone.utc)
        )
        booking_2 = Booking(
            id=2,
            confirmation_code="HM-918231",
            listing_id=2,
            guest_id=1,
            check_in=today + timedelta(days=12),
            check_out=today + timedelta(days=15),
            guests_count=4,
            nightly_rate=9397.0,
            total_nights=3,
            cleaning_fee=600.0,
            service_fee=3946.0,
            total_price=(9397.0 * 3) + 600.0 + 3946.0,
            payment_method="Credit Card",
            status="CONFIRMED",
            created_at=datetime.now(timezone.utc)
        )
        booking_completed = Booking(
            id=4,
            confirmation_code="HM-CMP942",
            listing_id=3,
            guest_id=1,
            check_in=today - timedelta(days=22),
            check_out=today - timedelta(days=19),
            guests_count=2,
            nightly_rate=8900.0,
            total_nights=3,
            cleaning_fee=400.0,
            service_fee=3738.0,
            total_price=(8900.0 * 3) + 400.0 + 3738.0,
            payment_method="UPI / Net Banking",
            status="COMPLETED",
            created_at=datetime.now(timezone.utc) - timedelta(days=25)
        )
        db.add(booking_1)
        db.add(booking_2)
        db.add(booking_completed)
        db.commit()

        print(f"[Success] Seeded exactly 5 listings and bookings (confirmed & completed) successfully into {engine.url}!")
        return True
    except Exception as e:
        db.rollback()
        print(f"[Error] Failed to seed sample listings: {e}")
        raise e
    finally:
        if close_at_end:
            db.close()

if __name__ == "__main__":
    seed_five_sample_listings()
