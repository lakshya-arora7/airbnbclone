import { Listing, ListingImage, UserPersona } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/**
 * Normalizes backend snake_case listing objects into typed frontend Listing entities.
 */
export function normalizeListing(raw: any): Listing {
  if (!raw) return raw;

  const images: ListingImage[] = (raw.images || []).map((img: any, idx: number) => ({
    id: img.id || idx + 1,
    url: img.url,
    caption: img.caption || undefined,
    displayOrder: img.display_order ?? img.displayOrder ?? idx + 1,
    isPrimary: img.is_primary ?? img.isPrimary ?? idx === 0,
  }));

  const host: UserPersona | undefined = raw.host
    ? {
        id: raw.host.id,
        email: raw.host.email,
        fullName: raw.host.full_name || raw.host.fullName,
        avatarUrl: raw.host.avatar_url || raw.host.avatarUrl,
        role: raw.host.role || "HOST",
        isSuperhost: raw.host.is_superhost ?? raw.host.isSuperhost ?? false,
        hostSince: raw.host.host_since || raw.host.hostSince || "March 2024",
        bio: raw.host.bio || undefined,
      }
    : undefined;

  return {
    id: raw.id,
    hostId: raw.host_id ?? raw.hostId ?? 2,
    host,
    title: raw.title,
    subtitle: raw.subtitle,
    description: raw.description,
    propertyType: raw.property_type || raw.propertyType || "Flat",
    category: raw.category || "Homes",
    city: raw.city,
    country: raw.country,
    latitude: raw.latitude,
    longitude: raw.longitude,
    pricePerNight: raw.price_per_night ?? raw.pricePerNight ?? 3600,
    originalPrice: raw.original_price ?? raw.originalPrice ?? undefined,
    cleaningFee: raw.cleaning_fee ?? raw.cleaningFee ?? 400,
    serviceFeePercent: raw.service_fee_percent ?? raw.serviceFeePercent ?? 14,
    maxGuests: raw.max_guests ?? raw.maxGuests ?? 4,
    bedrooms: raw.bedrooms ?? 2,
    beds: raw.beds ?? 2,
    bathrooms: raw.bathrooms ?? 2,
    bedDetails: raw.bed_details ?? raw.bedDetails ?? `${raw.bedrooms || 2} bedrooms · ${raw.beds || 2} beds`,
    amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
    rating: raw.rating ?? 4.95,
    reviewCount: raw.review_count ?? raw.reviewCount ?? 12,
    images: images.length > 0 ? images : [],
    isGuestFavourite: raw.is_guest_favourite ?? raw.isGuestFavourite ?? false,
    isSuperhost: raw.is_superhost ?? raw.isSuperhost ?? false,
    isPublished: raw.is_published ?? raw.isPublished ?? true,
    createdAt: raw.created_at || raw.createdAt || new Date().toISOString(),
  };
}

export interface BookingPayload {
  listingId: number;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guestsCount: number;
  paymentMethod?: string;
}

export interface BookedDateRange {
  checkIn: string;
  checkOut: string;
}

export interface FilterOptions {
  location?: string;
  category?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
}

export const api = {
  /**
   * Fetch listings with optional search/filter criteria.
   */
  async getListings(filters?: FilterOptions): Promise<Listing[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.location) params.append("location", filters.location);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.propertyType) params.append("property_type", filters.propertyType);
      if (filters?.minPrice) params.append("min_price", filters.minPrice.toString());
      if (filters?.maxPrice) params.append("max_price", filters.maxPrice.toString());
      if (filters?.guests) params.append("guests", filters.guests.toString());

      const res = await fetch(`${API_BASE_URL}/listings?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return (data || []).map(normalizeListing);
    } catch (err) {
      console.warn("[API] Backend unavailable for listings:", err);
      return [];
    }
  },

  /**
   * Fetch single listing detail by ID.
   */
  async getListingById(id: number): Promise<Listing | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      return normalizeListing(data);
    } catch (err) {
      console.warn(`[API] Backend unavailable for listing #${id}:`, err);
      return null;
    }
  },

  /**
   * Fetch booked date ranges for a listing to block conflicting dates in the calendar.
   */
  async getBookedDates(listingId: number): Promise<BookedDateRange[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/listings/${listingId}/booked-dates`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return (data || []).map((d: any) => ({
        checkIn: d.check_in || d.checkIn,
        checkOut: d.check_out || d.checkOut,
      }));
    } catch (err) {
      console.warn(`[API] Unable to fetch booked dates for #${listingId}:`, err);
      return [];
    }
  },

  /**
   * Create a reservation with transactional collision avoidance.
   */
  async createBooking(payload: BookingPayload, userId: number = 1): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId.toString(),
        },
        body: JSON.stringify({
          listing_id: payload.listingId,
          check_in: payload.checkIn,
          check_out: payload.checkOut,
          guests_count: payload.guestsCount,
          payment_method: payload.paymentMethod || "UPI / QR Code",
        }),
      });

      if (res.status === 409) {
        const errJson = await res.json().catch(() => ({ detail: "Dates are already booked" }));
        return { success: false, error: errJson.detail || "Dates are already booked." };
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ detail: `Error ${res.status}` }));
        return { success: false, error: errJson.detail || "Booking failed." };
      }

      const data = await res.json();
      return { success: true, data };
    } catch (err: any) {
      console.warn("[API] Booking request error:", err);
      return {
        success: false,
        error: "Unable to connect to booking server. Please verify your connection.",
      };
    }
  },

  /**
   * Fetch guest reservations for "My Trips".
   */
  async getMyTrips(userId: number = 1): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/my-trips`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      return (data || []).map((b: any) => ({
        id: b.id,
        confirmationCode: b.confirmation_code || b.confirmationCode,
        listingId: b.listing_id || b.listingId,
        listingTitle: b.listing?.title || "Luxury Stay",
        listingImage: b.listing?.image_url || b.listing?.images?.[0]?.url,
        city: b.listing?.city || "Unknown City",
        country: b.listing?.country || "India",
        lat: b.listing?.latitude || 28.627,
        lng: b.listing?.longitude || 77.372,
        checkIn: b.check_in || b.checkIn,
        checkOut: b.check_out || b.checkOut,
        guestsCount: b.guests_count || b.guestsCount || 1,
        totalPrice: b.total_price || b.totalPrice || 0,
        status: b.status || "CONFIRMED",
        createdAt: b.created_at || b.createdAt || new Date().toISOString(),
      }));
    } catch (err) {
      console.warn("[API] Unable to fetch live trips, checking localStorage:", err);
      try {
        const local = JSON.parse(localStorage.getItem("airbnb_demo_bookings") || "[]");
        return local;
      } catch {
        return [];
      }
    }
  },

  /**
   * Cancel reservation and immediately release dates.
   */
  async cancelBooking(bookingId: number, userId: number = 1): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId.toString(),
        },
      });

      return res.ok;
    } catch (err) {
      console.warn("[API] Cancel booking error:", err);
      return false;
    }
  },

  /**
   * Fetch listings owned by host.
   */
  async getHostListings(hostId: number = 2): Promise<Listing[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/host/listings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": hostId.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return (data || []).map(normalizeListing);
    } catch (err) {
      console.warn("[API] Unable to fetch host listings:", err);
      return [];
    }
  },

  /**
   * Fetch reservations on host properties.
   */
  async getHostReservations(hostId: number = 2): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/host/reservations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": hostId.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("[API] Unable to fetch host reservations:", err);
      return [];
    }
  },

  /**
   * Create a new property listing as host.
   */
  async createListing(listingData: any, hostId: number = 2): Promise<Listing | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": hostId.toString(),
        },
        body: JSON.stringify(listingData),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return normalizeListing(data);
    } catch (err) {
      console.warn("[API] Unable to create listing via backend:", err);
      return null;
    }
  },

  /**
   * Delete a listing as host.
   */
  async deleteListing(listingId: number, hostId: number = 2): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/listings/${listingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": hostId.toString(),
        },
      });

      return res.ok;
    } catch (err) {
      console.warn("[API] Delete listing error:", err);
      return false;
    }
  },

  /**
   * Fetch current user's wishlist listings from backend.
   */
  async getWishlist(userId: number = 1): Promise<Listing[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/wishlists`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return (data.listings || []).map(normalizeListing);
    } catch (err) {
      console.warn("[API] Unable to fetch live wishlist:", err);
      return [];
    }
  },

  /**
   * Toggle a listing in user wishlist.
   */
  async toggleWishlist(listingId: number, userId: number = 1): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/wishlists/toggle/${listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId.toString(),
        },
      });

      if (!res.ok) return false;
      const data = await res.json();
      return data.is_favorited ?? true;
    } catch (err) {
      console.warn("[API] Wishlist toggle error:", err);
      return false;
    }
  },

  /**
   * Submit a review for a completed stay.
   */
  async submitReview(reviewData: {
    listingId: number;
    rating: number;
    comment: string;
    cleanlinessRating?: number;
    accuracyRating?: number;
    checkinRating?: number;
    communicationRating?: number;
    locationRating?: number;
    valueRating?: number;
  }, userId: number = 1): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId.toString(),
        },
        body: JSON.stringify({
          listing_id: reviewData.listingId,
          rating: reviewData.rating,
          comment: reviewData.comment,
          cleanliness_rating: reviewData.cleanlinessRating ?? reviewData.rating,
          accuracy_rating: reviewData.accuracyRating ?? reviewData.rating,
          checkin_rating: reviewData.checkinRating ?? reviewData.rating,
          communication_rating: reviewData.communicationRating ?? reviewData.rating,
          location_rating: reviewData.locationRating ?? reviewData.rating,
          value_rating: reviewData.valueRating ?? reviewData.rating,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("[API] Submit review fallback:", err);
      return null;
    }
  },

  /**
   * Fetch reviews for a listing.
   */
  async getListingReviews(listingId: number): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/listing/${listingId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("[API] Unable to fetch reviews:", err);
      return [];
    }
  },

  /**
   * Fetch reviews written by a user.
   */
  async getUserReviews(userId: number = 1): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/user/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("[API] Unable to fetch user reviews:", err);
      try {
        const stored = localStorage.getItem("airbnb_user_reviews");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
  },

  /**
   * Log in or sign up with simplified guest vs host auth.
   */
  async login(loginId: string, role: "GUEST" | "HOST" = "GUEST", fullName?: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login_id: loginId,
          role,
          full_name: fullName,
        }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("[API] Login error, falling back:", err);
      return null;
    }
  },

  /**
   * Switch active persona role.
   */
  async switchPersona(role: "GUEST" | "HOST"): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/switch-persona`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("[API] Switch persona error:", err);
      return null;
    }
  },

  /**
   * Select persona by user ID.
   */
  async selectUser(userId: number): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/select-user/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("[API] Select user error:", err);
      return null;
    }
  },

  /**
   * List all available personas.
   */
  async getUsers(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("[API] Get users error:", err);
      return [];
    }
  },
};
