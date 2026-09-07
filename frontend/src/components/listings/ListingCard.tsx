"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Listing } from "@/types";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";
import { useWishlist } from "@/context/WishlistContext";

interface ListingCardProps {
  listing: Listing;
  isFavorited?: boolean;
  onToggleFavorite?: (listingId: number) => void;
}

export default function ListingCard({ listing, isFavorited, onToggleFavorite }: ListingCardProps) {
  const { formatPrice, t } = useLanguageCurrency();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isFav = isFavorited !== undefined ? isFavorited : isWishlisted(listing.id);

  const images = listing.images && listing.images.length > 0
    ? listing.images
    : [{ id: 1, url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80", displayOrder: 1, isPrimary: true }];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(listing.id);
    } else {
      toggleWishlist(listing);
    }
  };

  // Determine dynamic link
  const targetHref = listing.category === "Experiences"
    ? `/experiences/${listing.id}`
    : listing.category === "Services"
    ? `/services/${listing.id}`
    : `/rooms/${listing.id}`;

  const isExperience = listing.category === "Experiences";
  const isService = listing.category === "Services";

  return (
    <div className="group flex flex-col cursor-pointer">
      <Link href={targetHref} className="block">
        {/* Photo Container */}
        <div className="relative aspect-[1.25/1] sm:aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#EBEBEB]">
          <img
            src={images[currentImageIndex].url}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Time Slot Badge (for Experiences, Screenshot 2) */}
          {listing.timeSlot && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#222222] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              {listing.timeSlot}
            </div>
          )}

          {/* Guest Favourite Badge (for Stays, Screenshot 1) */}
          {!listing.timeSlot && listing.isGuestFavourite && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#222222] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              Guest favourite
            </div>
          )}

          {/* Heart / Wishlist Toggle */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:scale-110 transition active:scale-90 text-white drop-shadow-md z-10"
            aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                isFav ? "fill-[#FF385C] stroke-[#FF385C] animate-heart-pop" : "stroke-white fill-black/30"
              }`}
            />
          </button>

          {/* Carousel Arrows (Appear on Hover) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 hover:bg-white text-[#222222]"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 hover:bg-white text-[#222222]"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </>
          )}

          {/* Carousel Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`rounded-full transition-all ${
                    idx === currentImageIndex ? "w-1.5 h-1.5 bg-white scale-125" : "w-1 h-1 bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Listing Info */}
        <div className="mt-2.5 flex flex-col gap-0.5 text-xs">
          {isExperience ? (
            /* Layout for Experience Cards matching Screenshot 2 */
            <>
              <p className="font-semibold text-sm text-[#222222] line-clamp-2 leading-snug">
                {listing.title}
              </p>
              <div className="mt-1 flex items-center gap-1 text-[#717171]">
                <span>From ₹{listing.pricePerNight.toLocaleString("en-IN")} / guest</span>
                {listing.rating > 0 && (
                  <>
                    <span>·</span>
                    <div className="flex items-center gap-0.5 text-[#222222] font-semibold">
                      <Star className="w-3 h-3 fill-[#222222] text-[#222222]" />
                      <span>{listing.rating.toFixed(1)}</span>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : isService ? (
            /* Layout for Service Cards */
            <>
              <p className="font-semibold text-sm text-[#222222] truncate">
                {listing.title}
              </p>
              <p className="text-[#717171]">{listing.propertyType}</p>
              <div className="mt-1 flex items-center gap-1 text-[#222222]">
                <span className="font-semibold">From ₹{listing.pricePerNight.toLocaleString("en-IN")}</span>
                <span className="text-[#717171] flex items-center gap-1">
                  / service · <Star className="w-3 h-3 fill-[#222222] text-[#222222] inline -mt-0.5" /> {listing.rating.toFixed(1)}
                </span>
              </div>
            </>
          ) : (
            /* Layout for Homes / Stays matching official Airbnb Card Design */
            <>
              {/* Row 1: Title & Rating */}
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-sm text-[#222222] truncate flex-1" title={listing.title}>
                  {listing.title}
                </span>
                {listing.rating > 0 && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#222222] flex-shrink-0">
                    <Star className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                    <span>{listing.rating.toFixed(1)}</span>
                    {listing.reviewCount > 0 && (
                      <span className="text-[#717171] font-normal text-[11px]">({listing.reviewCount})</span>
                    )}
                  </div>
                )}
              </div>

              {/* Row 2: Location */}
              <p className="text-xs text-[#717171] truncate">
                {listing.subtitle || `${listing.city}, ${listing.country}`}
              </p>

              {/* Row 3: Property Type & Bedroom Details */}
              <p className="text-[11px] text-[#717171] truncate">
                {listing.propertyType} · {listing.bedrooms || 1} bed{(listing.bedrooms || 1) > 1 ? "s" : ""} · Up to {listing.maxGuests || 2} guests
              </p>

              {/* Row 4: Price per night */}
              <div className="mt-1 flex items-baseline gap-1.5 text-xs text-[#222222]">
                <span className="font-extrabold text-sm">
                  ₹{listing.pricePerNight.toLocaleString("en-IN")}
                </span>
                <span className="text-[#717171] text-xs font-normal">night</span>
                {listing.cleaningFee > 0 && (
                  <span className="text-[10px] text-[#717171]">· ₹{listing.cleaningFee} clean</span>
                )}
              </div>
            </>
          )}
        </div>
      </Link>
    </div>
  );
}
