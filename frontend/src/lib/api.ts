import { Listing, ListingImage, UserPersona } from "@/types";

const LIVE_RAILWAY_API_URL = "https://airbnbclone-production-cbcb.up.railway.app/api/v1";

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return LIVE_RAILWAY_API_URL;
  }
  return "http://localhost:8000/api/v1";
}

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

export const CUSTOM_LISTINGS_STORAGE_KEY = "airbnb_custom_user_listings";

export function getLocalCustomListings(): Listing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_LISTINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("[API] Failed to read local custom listings:", e);
    return [];
  }
}

export function saveLocalCustomListing(listing: Listing): void {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalCustomListings();
    const filtered = current.filter((l) => l.id !== listing.id);
    const updated = [listing, ...filtered];
    localStorage.setItem(CUSTOM_LISTINGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("airbnb_listings_updated"));
  } catch (e) {
    console.warn("[API] Failed to save local custom listing:", e);
  }
}

export function removeLocalCustomListing(listingId: number): void {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalCustomListings();
    const updated = current.filter((l) => l.id !== listingId);
    localStorage.setItem(CUSTOM_LISTINGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("airbnb_listings_updated"));
  } catch (e) {
    console.warn("[API] Failed to remove local custom listing:", e);
  }
}

export const api = {
  /**
   * Fetch listings with optional search/filter criteria.
   * Merges server listings with any locally published custom host listings.
   */
  async getListings(filters?: FilterOptions): Promise<Listing[]> {
    let serverListings: Listing[] = [];
    try {
      const params = new URLSearchParams();
      if (filters?.location) params.append("location", filters.location);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.propertyType) params.append("property_type", filters.propertyType);
      if (filters?.minPrice) params.append("min_price", filters.minPrice.toString());
      if (filters?.maxPrice) params.append("max_price", filters.maxPrice.toString());
      if (filters?.guests) params.append("guests", filters.guests.toString());

      const res = await fetch(`${getApiBaseUrl()}/listings?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        serverListings = (data || []).map(normalizeListing);
      }
    } catch (err) {
      console.warn("[API] Backend unavailable for listings, checking local store:", err);
    }

    const localCustom = getLocalCustomListings();
    if (localCustom.length === 0) {
      return serverListings;
    }

    const serverIds = new Set(serverListings.map((l) => l.id));
    const uniqueLocal = localCustom.filter((l) => !serverIds.has(l.id));

    const filteredLocal = uniqueLocal.filter((item) => {
      if (filters?.location) {
        const loc = filters.location.toLowerCase();
        if (
          !item.city.toLowerCase().includes(loc) &&
          !item.country.toLowerCase().includes(loc) &&
          !item.title.toLowerCase().includes(loc)
        ) {
          return false;
        }
      }
      if (filters?.category && filters.category.toLowerCase() !== "all") {
        if (item.category?.toLowerCase() !== filters.category.toLowerCase()) return false;
      }
      if (filters?.propertyType) {
        if (item.propertyType?.toLowerCase() !== filters.propertyType.toLowerCase()) return false;
      }
      if (filters?.minPrice && item.pricePerNight < filters.minPrice) return false;
      if (filters?.maxPrice && item.pricePerNight > filters.maxPrice) return false;
      if (filters?.guests && item.maxGuests < filters.guests) return false;
      return true;
    });

    return [...filteredLocal, ...serverListings];
  },

  /**
   * Fetch single listing detail by ID with fallback to local store.
   */
  async getListingById(id: number): Promise<Listing | null> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/listings/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        return normalizeListing(data);
      }
    } catch (err) {
      console.warn(`[API] Backend unavailable for listing #${id}:`, err);
    }

    const local = getLocalCustomListings().find((l) => l.id === id);
    if (local) return local;

    return null;
  },

  /**
   * Fetch booked date ranges for a listing to block conflicting dates in the calendar.
   */
  async getBookedDates(listingId: number): Promise<BookedDateRange[]> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/listings/${listingId}/booked-dates`, {
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
      const res = await fetch(`${getApiBaseUrl()}/bookings`, {
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
      const res = await fetch(`${getApiBaseUrl()}/bookings/my-trips`, {
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
      const res = await fetch(`${getApiBaseUrl()}/bookings/${bookingId}/cancel`, {
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
    let serverListings: Listing[] = [];
    try {
      const res = await fetch(`${getApiBaseUrl()}/host/listings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": hostId.toString(),
        },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        serverListings = (data || []).map(normalizeListing);
      }
    } catch (err) {
      console.warn("[API] Unable to fetch host listings from server:", err);
    }

    const localListings = getLocalCustomListings().filter(
      (l) => (l.hostId || 2) === hostId || hostId === 2
    );
    const serverIds = new Set(serverListings.map((l) => l.id));
    const uniqueLocal = localListings.filter((l) => !serverIds.has(l.id));

    return [...uniqueLocal, ...serverListings];
  },

  /**
   * Fetch reservations on host properties.
   */
  async getHostReservations(hostId: number = 2): Promise<any[]> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/host/reservations`, {
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
   * Persists to live backend when available and always syncs to local storage
   * so it reflects immediately on the homescreen and throughout the frontend.
   */
  async createListing(listingData: any, hostId: number = 2): Promise<Listing | null> {
    let createdListing: Listing | null = null;
    try {
      const res = await fetch(`${getApiBaseUrl()}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": hostId.toString(),
        },
        body: JSON.stringify(listingData),
      });

      if (res.ok) {
        const data = await res.json();
        createdListing = normalizeListing(data);
      }
    } catch (err) {
      console.warn("[API] Unable to create listing via backend, falling back to client persistence:", err);
    }

    if (!createdListing) {
      createdListing = normalizeListing({
        ...listingData,
        id: Date.now(),
        host_id: hostId,
        rating: 5.0,
        review_count: 0,
        is_published: true,
        created_at: new Date().toISOString(),
      });
    }

    saveLocalCustomListing(createdListing);
    return createdListing;
  },

  /**
   * Delete a listing as host.
   */
  async deleteListing(listingId: number, hostId: number = 2): Promise<boolean> {
    removeLocalCustomListing(listingId);
    try {
      const res = await fetch(`${getApiBaseUrl()}/listings/${listingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": hostId.toString(),
        },
      });

      return res.ok;
    } catch (err) {
      console.warn("[API] Delete listing error:", err);
      return true;
    }
  },

  /**
   * Update an existing property listing as host.
   */
  async updateListing(listingId: number, updateData: any, hostId: number = 2): Promise<Listing | null> {
    let updatedListing: Listing | null = null;
    try {
      const res = await fetch(`${getApiBaseUrl()}/listings/${listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": hostId.toString(),
        },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        const data = await res.json();
        updatedListing = normalizeListing(data);
      }
    } catch (err) {
      console.warn("[API] Unable to update listing via backend, applying local update:", err);
    }

    const local = getLocalCustomListings();
    const existing = local.find((l) => l.id === listingId);
    if (existing) {
      const merged: Listing = {
        ...existing,
        ...updateData,
        pricePerNight: updateData.price_per_night ?? updateData.pricePerNight ?? existing.pricePerNight,
        cleaningFee: updateData.cleaning_fee ?? updateData.cleaningFee ?? existing.cleaningFee,
        maxGuests: updateData.max_guests ?? updateData.maxGuests ?? existing.maxGuests,
        bedrooms: updateData.bedrooms ?? existing.bedrooms,
        beds: updateData.beds ?? existing.beds,
        bathrooms: updateData.bathrooms ?? existing.bathrooms,
        title: updateData.title ?? existing.title,
        description: updateData.description ?? existing.description,
        isPublished: updateData.is_published ?? updateData.isPublished ?? existing.isPublished,
      };
      saveLocalCustomListing(merged);
      if (!updatedListing) updatedListing = merged;
    } else if (updatedListing) {
      saveLocalCustomListing(updatedListing);
    }

    return updatedListing;
  },

  /**
   * Fetch all bookings associated with a specific listing.
   */
  async getListingBookings(listingId: number, hostId: number = 2): Promise<any[]> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/bookings/listing/${listingId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": hostId.toString(),
        },
        cache: "no-store",
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("[API] Unable to fetch bookings for listing:", err);
    }
    return [];
  },

  /**
   * Update/modify a reservation (check-in, check-out, guests, status).
   */
  async updateBooking(
    bookingId: number,
    payload: { checkIn?: string; checkOut?: string; guestsCount?: number; status?: string },
    userId: number = 1
  ): Promise<any> {
    try {
      const body: any = {};
      if (payload.checkIn) body.check_in = payload.checkIn;
      if (payload.checkOut) body.check_out = payload.checkOut;
      if (payload.guestsCount) body.guests_count = payload.guestsCount;
      if (payload.status) body.status = payload.status;

      const res = await fetch(`${getApiBaseUrl()}/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId.toString(),
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("airbnb_bookings_updated"));
        }
        return { success: true, data };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, error: errJson.detail || "Failed to update booking." };
    } catch (err) {
      console.warn("[API] Modify booking error:", err);
      return { success: false, error: "Network error modifying booking." };
    }
  },

  /**
   * Fetch current user's wishlist listings from backend.
   */
  async getWishlist(userId: number = 1): Promise<Listing[]> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/wishlists`, {
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
      const res = await fetch(`${getApiBaseUrl()}/wishlists/toggle/${listingId}`, {
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
      const res = await fetch(`${getApiBaseUrl()}/reviews`, {
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
      const res = await fetch(`${getApiBaseUrl()}/reviews/listing/${listingId}`, {
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
      const res = await fetch(`${getApiBaseUrl()}/reviews/user/${userId}`, {
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
      const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
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
      const res = await fetch(`${getApiBaseUrl()}/auth/switch-persona`, {
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
      const res = await fetch(`${getApiBaseUrl()}/auth/select-user/${userId}`, {
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
      const res = await fetch(`${getApiBaseUrl()}/auth/users`, {
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

  /**
   * Get user conversation threads (both as guest or host).
   */
  async getMessagesThreads(userId: number = 1): Promise<any[]> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/messages/threads`, {
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId.toString(),
        },
        cache: "no-store",
      });
      if (res.ok) {
        const threads = await res.json();
        return threads;
      }
    } catch (err) {
      console.warn("[API] getMessagesThreads network error:", err);
    }
    return [];
  },

  /**
   * Send a message to host or guest.
   */
  async sendMessage(
    payload: { recipientId: number; listingId?: number; text: string },
    senderId: number = 1
  ): Promise<any> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": senderId.toString(),
        },
        body: JSON.stringify({
          recipient_id: payload.recipientId,
          listing_id: payload.listingId || null,
          text: payload.text,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("airbnb_messages_updated"));
          window.dispatchEvent(new CustomEvent("airbnb_notifications_updated"));
        }
        return data;
      }
    } catch (err) {
      console.warn("[API] sendMessage error:", err);
    }
    return null;
  },

  /**
   * Mark a conversation thread as read.
   */
  async markThreadAsRead(threadId: string, userId: number = 1): Promise<boolean> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/messages/thread/${threadId}/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId.toString(),
        },
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  },

  /**
   * Delete a thread.
   */
  async deleteThread(threadId: string, userId: number = 1): Promise<boolean> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/messages/thread/${threadId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId.toString(),
        },
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("airbnb_messages_updated"));
      }
      return res.ok;
    } catch (err) {
      return false;
    }
  },

  /**
   * Get user notifications.
   */
  async getNotifications(userId: number = 1): Promise<any[]> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/notifications`, {
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId.toString(),
        },
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn("[API] getNotifications network error:", err);
    }
    return [];
  },

  /**
   * Mark single notification as read.
   */
  async markNotificationAsRead(notificationId: number, userId: number = 1): Promise<boolean> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/notifications/${notificationId}/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId.toString(),
        },
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("airbnb_notifications_updated"));
      }
      return res.ok;
    } catch (err) {
      return false;
    }
  },

  /**
   * Mark all notifications as read.
   */
  async markAllNotificationsAsRead(userId: number = 1): Promise<boolean> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/notifications/read-all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId.toString(),
        },
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("airbnb_notifications_updated"));
      }
      return res.ok;
    } catch (err) {
      return false;
    }
  },

  /**
   * Clear all notifications.
   */
  async clearNotifications(userId: number = 1): Promise<boolean> {
    try {
      const res = await fetch(`${getApiBaseUrl()}/notifications`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId.toString(),
        },
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("airbnb_notifications_updated"));
      }
      return res.ok;
    } catch (err) {
      return false;
    }
  },
};

