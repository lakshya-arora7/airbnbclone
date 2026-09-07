export type UserRole = "GUEST" | "HOST";

export interface UserPersona {
  id: number;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: UserRole;
  isSuperhost: boolean;
  hostSince: string;
  bio?: string;
}

export interface ListingImage {
  id: number;
  url: string;
  caption?: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface Listing {
  id: number;
  hostId: number;
  host?: UserPersona;
  title: string;
  description: string;
  propertyType: string;
  category: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  pricePerNight: number;
  cleaningFee: number;
  serviceFeePercent: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  rating: number;
  reviewCount: number;
  images: ListingImage[];
  subtitle?: string;
  originalPrice?: number;
  bedDetails?: string;
  isSuperhost?: boolean;
  isGuestFavourite?: boolean;
  isPublished: boolean;
  createdAt: string;
  timeSlot?: string;
  duration?: string;
  meetingPoint?: string;
  experienceHostName?: string;
  experienceHostRole?: string;
  experienceHostAvatar?: string;
  includedItems?: string[];
  experienceTags?: string;
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";

export interface Booking {
  id: number;
  confirmationCode: string;
  listingId: number;
  listing?: Listing;
  guestId: number;
  guest?: UserPersona;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guestsCount: number;
  nightlyRate: number;
  totalNights: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
  status: BookingStatus;
  holdExpiresAt?: string;
  createdAt: string;
}

export interface Review {
  id: number;
  listingId: number;
  authorId: number;
  author?: UserPersona;
  rating: number;
  cleanlinessRating: number;
  accuracyRating: number;
  checkinRating: number;
  communicationRating: number;
  locationRating: number;
  valueRating: number;
  comment: string;
  createdAt: string;
}

export interface FilterParams {
  category?: string;
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  amenities?: string[];
}
