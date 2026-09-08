"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Share,
  Heart,
  ShieldCheck,
  Medal,
  Sparkles,
  Bed,
  Bath,
  Users,
  Wifi,
  Tv,
  Car,
  Utensils,
  AirVent,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import Navbar from "@/components/header/Navbar";
import PhotoMosaic from "@/components/room-detail/PhotoMosaic";
import BookingWidget from "@/components/room-detail/BookingWidget";
import ReviewsMatrix from "@/components/room-detail/ReviewsMatrix";
import ContactHostModal from "@/components/room-detail/ContactHostModal";
import { getCategoryListingById } from "@/data/categoriesData";
import { api, BookedDateRange } from "@/lib/api";
import { Listing } from "@/types";
import { useWishlist } from "@/context/WishlistContext";

export default function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const listingId = Number(resolvedParams.id);
  const initialCategoryListing = getCategoryListingById(listingId);
  const [listing, setListing] = useState<Listing | null>(initialCategoryListing || null);
  const [loading, setLoading] = useState(!initialCategoryListing);
  const [blockedDates, setBlockedDates] = useState<BookedDateRange[]>([]);
  const [copied, setCopied] = useState(false);
  const [isContactHostOpen, setIsContactHostOpen] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    let isMounted = true;
    // 1. Fetch live listing detail from backend
    api.getListingById(listingId).then((data) => {
      if (!isMounted) return;
      if (data) {
        setListing(data);
      }
      setLoading(false);
    });

    // 2. Fetch live booked dates for calendar blocking
    api.getBookedDates(listingId).then((ranges) => {
      if (isMounted) setBlockedDates(ranges);
    });

    return () => {
      isMounted = false;
    };
  }, [listingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-2/3 mb-4" />
          <div className="h-96 bg-gray-200 rounded-3xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-32 bg-gray-100 rounded-2xl" />
            </div>
            <div className="h-80 bg-gray-200 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return notFound();
  }

  const isFavorited = isWishlisted(listing.id);

  const handleToggleFavorite = async () => {
    await toggleWishlist(listing);
  };

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      {/* Top Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Title Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#222222] mb-2">
            {listing.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between text-sm text-[#717171] gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 font-semibold text-[#222222]">
                <Star className="w-4 h-4 fill-[#222222]" />
                <span>{listing.rating.toFixed(2)}</span>
              </div>
              <span>·</span>
              <span className="underline cursor-pointer">{listing.reviewCount} reviews</span>
              {listing.isGuestFavourite && (
                <>
                  <span>·</span>
                  <span className="font-semibold text-[#222222] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF385C]" /> Guest favourite
                  </span>
                </>
              )}
              <span>·</span>
              <span className="underline cursor-pointer">
                {listing.city}, {listing.country}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-[#222222]">
              <button 
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1.5 hover:bg-[#F7F7F7] px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Share className="w-4 h-4" /> {copied ? "Link copied!" : "Share"}
              </button>
              <button 
                onClick={handleToggleFavorite}
                className={`flex items-center gap-1.5 hover:bg-[#F7F7F7] px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  isFavorited ? "text-[#FF385C]" : "text-[#222222]"
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? "fill-[#FF385C]" : ""}`} /> 
                {isFavorited ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>

        {/* 5-Photo Mosaic Gallery */}
        <PhotoMosaic images={listing.images} title={listing.title} />

        {/* 2-Column Content Layout (Details on Left, Sticky Booking on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
          {/* Left Column: Property & Host Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Specs & Contact Host */}
            <div className="pb-6 border-b border-[#EBEBEB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#222222] mb-1">
                  {listing.propertyType} hosted by {listing.host?.fullName || "Superhost Ravi"}
                </h2>
                <p className="text-sm text-[#717171]">
                  {listing.maxGuests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds · {listing.bathrooms} baths
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsContactHostOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#222222] font-semibold text-sm hover:bg-[#F7F7F7] active:scale-98 transition cursor-pointer self-start sm:self-center shadow-2xs"
              >
                <MessageSquare className="w-4 h-4 text-[#FF385C]" />
                <span>Contact host</span>
              </button>
            </div>

            {/* Highlights */}
            <div className="space-y-4 pb-6 border-b border-[#EBEBEB]">
              <div className="flex items-start gap-4">
                <Medal className="w-6 h-6 text-[#FF385C] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#222222]">Experienced Superhost</h4>
                  <p className="text-xs text-[#717171]">
                    Superhosts are experienced, highly rated hosts committed to great stays.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#222222]">Dedicated check-in experience</h4>
                  <p className="text-xs text-[#717171]">
                    100% of recent guests gave the check-in process a 5-star rating.
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pb-6 border-b border-[#EBEBEB]">
              <h3 className="text-lg font-bold text-[#222222] mb-3">About this space</h3>
              <p className="text-sm text-[#222222] leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Where you'll sleep */}
            <div className="pb-6 border-b border-[#EBEBEB]">
              <h3 className="text-lg font-bold text-[#222222] mb-4">Where you’ll sleep</h3>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: listing.bedrooms }).map((_, idx) => (
                  <div key={idx} className="border border-[#DDDDDD] rounded-2xl p-4">
                    <Bed className="w-6 h-6 text-[#222222] mb-3" />
                    <p className="font-bold text-sm text-[#222222]">Bedroom {idx + 1}</p>
                    <p className="text-xs text-[#717171]">1 king bed</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="pb-6 border-b border-[#EBEBEB]">
              <h3 className="text-lg font-bold text-[#222222] mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {listing.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 text-sm text-[#222222]">
                    <Sparkles className="w-4 h-4 text-[#717171]" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Reservation Card */}
          <div className="lg:col-span-1">
            <BookingWidget listing={listing} blockedDateRanges={blockedDates} />
          </div>
        </div>

        {/* Reviews Matrix Component with live database reviews */}
        <ReviewsMatrix listingId={listing.id} rating={listing.rating} reviewCount={listing.reviewCount} />

        {/* Contact Host Modal */}
        <ContactHostModal
          isOpen={isContactHostOpen}
          onClose={() => setIsContactHostOpen(false)}
          listing={listing}
        />
      </main>
    </div>
  );
}
