import { Listing } from "@/types";

/**
 * Exactly 3 authentic mock experiences for the Experiences section
 */
export const MOCK_EXPERIENCES: Listing[] = [
  {
    id: 201,
    hostId: 101,
    title: "Old Delhi Secret Food & Night Heritage Walk",
    subtitle: "Taste 8 authentic recipes hidden across Chandni Chowk",
    description: "Hear Old Delhi come alive at dusk. A unique culinary and historic sound walk exploring generational kebabs, parathas, and spice bazaars with certified heritage storytellers.",
    propertyType: "Food Tour",
    category: "Experiences",
    city: "New Delhi",
    country: "India",
    latitude: 28.6562,
    longitude: 77.2310,
    pricePerNight: 1800,
    cleaningFee: 0,
    serviceFeePercent: 12,
    maxGuests: 10,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    amenities: ["Food tastings", "Drinks", "Audio headsets", "Walking guide"],
    rating: 4.98,
    reviewCount: 146,
    isPublished: true,
    isGuestFavourite: true,
    createdAt: "2026-01-10T00:00:00Z",
    timeSlot: "Today · 6:30 pm",
    duration: "3 hours",
    meetingPoint: "Chandni Chowk Metro Station, Gate 1, Old Delhi",
    experienceHostName: "Hosted by Chef Devendra",
    experienceHostRole: "Culinary Historian & Certified Storyteller",
    experienceHostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    includedItems: [
      "Tastings at 8 legendary street stalls",
      "Clay-cup Kulhad Masala Chai & freshly fried Jalebi",
      "Spice market fragrance sensory walk",
      "Heritage audio headsets & mineral water"
    ],
    experienceTags: "Food & Drink · Cultural Walk · Tasting Tour",
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80", displayOrder: 1, isPrimary: true, caption: "Street Food Cooking" },
      { id: 2, url: "https://images.unsplash.com/photo-1599818816942-835c24e6264d?w=800&auto=format&fit=crop&q=80", displayOrder: 2, isPrimary: false, caption: "Spices Market" },
      { id: 3, url: "https://images.unsplash.com/photo-1598324789736-4861f89564a0?w=800&auto=format&fit=crop&q=80", displayOrder: 3, isPrimary: false, caption: "Old Delhi Alleys" },
      { id: 4, url: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80", displayOrder: 4, isPrimary: false, caption: "Jama Masjid at Dusk" }
    ]
  },
  {
    id: 202,
    hostId: 102,
    title: "Sunrise Taj Mahal Masterclass & Secret Angles Photography",
    subtitle: "Capture the Golden Hour with an award-winning NatGeo photographer",
    description: "Witness the iconic ivory marble dome bathed in soft sunrise hues. Gain VIP early-entry guidance to capture timeless reflections, arches, and symmetry away from the crowds.",
    propertyType: "Photography Tour",
    category: "Experiences",
    city: "Agra",
    country: "India",
    latitude: 27.1751,
    longitude: 78.0421,
    pricePerNight: 3200,
    cleaningFee: 0,
    serviceFeePercent: 12,
    maxGuests: 6,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    amenities: ["Camera guidance", "Priority entry assistance", "Photo editing tips", "Breakfast"],
    rating: 5.0,
    reviewCount: 98,
    isPublished: true,
    isGuestFavourite: true,
    createdAt: "2026-02-05T00:00:00Z",
    timeSlot: "Tomorrow · 5:45 am",
    duration: "3.5 hours",
    meetingPoint: "Taj Mahal East Gate VIP Counter, Agra",
    experienceHostName: "Hosted by Aarav Mehta",
    experienceHostRole: "Editorial Travel Photographer",
    experienceHostAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    includedItems: [
      "Personalized 1-on-1 composition & lighting guidance",
      "Pre-arranged priority sunrise entry assistance",
      "High-res edited photo gallery delivered post-tour",
      "Rooftop breakfast & Masala Chai overlooking the Yamuna"
    ],
    experienceTags: "Photography · Heritage Tour · Sunrise Walk",
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80", displayOrder: 1, isPrimary: true, caption: "Taj Mahal Reflection" },
      { id: 2, url: "https://images.unsplash.com/photo-1524492417244-63be84050d27?w=800&auto=format&fit=crop&q=80", displayOrder: 2, isPrimary: false, caption: "Historic Arches" },
      { id: 3, url: "https://images.unsplash.com/photo-1585506942812-e72b29cef752?w=800&auto=format&fit=crop&q=80", displayOrder: 3, isPrimary: false, caption: "Yamuna River View" },
      { id: 4, url: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80", displayOrder: 4, isPrimary: false, caption: "Marble Inlay Art" }
    ]
  },
  {
    id: 203,
    hostId: 103,
    title: "Traditional Terracotta Pottery & Wheel Sculpting Workshop",
    subtitle: "Shape your own artisanal clay tea set in an open-air village studio",
    description: "Get your hands into earthy terracotta clay. Learn traditional wheel throwing, trimming, and carving techniques from generational potters, and bring home your very own kiln-fired creation.",
    propertyType: "Craft Workshop",
    category: "Experiences",
    city: "Noida",
    country: "India",
    latitude: 28.5355,
    longitude: 77.3910,
    pricePerNight: 1400,
    cleaningFee: 0,
    serviceFeePercent: 12,
    maxGuests: 8,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    amenities: ["Motorized wheels", "All clay materials", "Aprons provided", "Tea & snacks"],
    rating: 4.95,
    reviewCount: 72,
    isPublished: true,
    isGuestFavourite: false,
    createdAt: "2026-02-20T00:00:00Z",
    timeSlot: "Today · 4:00 pm",
    duration: "2 hours",
    meetingPoint: "Clay & Craft Village Studio, Sector 128, Noida",
    experienceHostName: "Hosted by Meera Sharma",
    experienceHostRole: "Master Ceramicist & Studio Artist",
    experienceHostAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    includedItems: [
      "All natural terracotta clay and potter's wheel access",
      "Kiln firing and custom glaze for 2 handmade vessels",
      "Safe shockproof protective takeaway packaging",
      "Organic chamomile tea and freshly baked biscuits"
    ],
    experienceTags: "Art & Design · Workshop · Hands-on Craft",
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80", displayOrder: 1, isPrimary: true, caption: "Wheel Sculpting" },
      { id: 2, url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80", displayOrder: 2, isPrimary: false, caption: "Terracotta Vessels" },
      { id: 3, url: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=800&auto=format&fit=crop&q=80", displayOrder: 3, isPrimary: false, caption: "Studio Display" },
      { id: 4, url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80", displayOrder: 4, isPrimary: false, caption: "Handmade Glazes" }
    ]
  }
];

export const TODAY_EXPERIENCES: Listing[] = [MOCK_EXPERIENCES[0], MOCK_EXPERIENCES[2]];
export const TOMORROW_EXPERIENCES: Listing[] = [MOCK_EXPERIENCES[1]];
export const SERVICES_LISTINGS: Listing[] = [];
export const ALL_CATEGORIZED_LISTINGS: Listing[] = MOCK_EXPERIENCES;

export function getCategoryListingById(id: number): Listing | undefined {
  return MOCK_EXPERIENCES.find((exp) => exp.id === id);
}
