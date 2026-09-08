"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/header/Navbar";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import {
  PhotographyServiceIcon,
  ChefsServiceIcon,
  TrainingServiceIcon,
  MakeupServiceIcon,
  HairServiceIcon,
} from "@/components/services/ServiceCategoryIcons";
import { SERVICES_LISTINGS } from "@/data/categoriesData";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { ChevronLeft, ChevronRight, Heart, Star, Sparkles, MapPin, CheckCircle2 } from "lucide-react";
import { Listing } from "@/types";

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  subtitle: string;
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "Photography",
    name: "Photography",
    icon: <PhotographyServiceIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    subtitle: "Portraits, candid street & travel shoots",
  },
  {
    id: "Chefs",
    name: "Chefs",
    icon: <ChefsServiceIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    subtitle: "Private multi-course dining & live cooking",
  },
  {
    id: "Training",
    name: "Training",
    icon: <TrainingServiceIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    subtitle: "Personal trainers, yoga & fitness coaches",
  },
  {
    id: "Make-up",
    name: "Make-up",
    icon: <MakeupServiceIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    subtitle: "Bridal, glam & party makeover artists",
  },
  {
    id: "Hair",
    name: "Hair",
    icon: <HairServiceIcon className="w-12 h-12 sm:w-14 sm:h-14" />,
    subtitle: "Hair styling, blowouts & grooming",
  },
];

export default function ServicesPage() {
  const { formatPrice } = useLanguageCurrency();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedCategory, setSelectedCategory] = useState<string>("Photography");
  const [searchLocation, setSearchLocation] = useState<string>("Gurgaon District");

  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const cardsScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (dir: "left" | "right") => {
    if (categoriesScrollRef.current) {
      const amount = dir === "left" ? -280 : 280;
      categoriesScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const scrollCards = (dir: "left" | "right") => {
    if (cardsScrollRef.current) {
      const amount = dir === "left" ? -340 : 340;
      cardsScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  // Filter or prioritize services matching the selected category
  const displayedServices = useMemo(() => {
    const directMatches = SERVICES_LISTINGS.filter(
      (s) => s.propertyType.toLowerCase() === selectedCategory.toLowerCase()
    );
    if (directMatches.length > 0) {
      // Include direct matches first, followed by others to keep 2-3 items visible
      const others = SERVICES_LISTINGS.filter(
        (s) => s.propertyType.toLowerCase() !== selectedCategory.toLowerCase()
      );
      return [...directMatches, ...others];
    }
    return SERVICES_LISTINGS;
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col antialiased">
      {/* Top Navbar with active mode = 'services' */}
      <Navbar
        activeMode="services"
        searchSummary={{
          location: searchLocation,
          dates: "Add dates",
          guests: "Add service",
        }}
        onSearch={(params) => {
          if (params.location) setSearchLocation(params.location);
        }}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 sm:pb-16 w-full">
        {/* Section 1: Services in Region Header matching Screenshot */}
        <div className="flex items-center justify-between mt-2 mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-[#222222] tracking-tight">
            Services in {searchLocation}
          </h1>

          {/* Carousel Arrows for Categories */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollCategories("left")}
              className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:border-[#222222] hover:shadow-xs transition text-[#717171] hover:text-[#222222] bg-white cursor-pointer active:scale-95"
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button
              onClick={() => scrollCategories("right")}
              className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:border-[#222222] hover:shadow-xs transition text-[#717171] hover:text-[#222222] bg-white cursor-pointer active:scale-95"
              aria-label="Next categories"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* Section 2: 5 Category Tiles matching Screenshot */}
        <div
          ref={categoriesScrollRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1"
        >
          {SERVICE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className="flex flex-col items-center text-center group cursor-pointer focus:outline-none flex-shrink-0"
              >
                {/* Rounded square container with soft #F7F7F7 bg */}
                <div
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl flex items-center justify-center p-3 transition-all duration-200 ${
                    isSelected
                      ? "bg-[#EFEFEF] ring-2 ring-[#222222] shadow-sm scale-[1.02]"
                      : "bg-[#F7F7F7] hover:bg-[#EBEBEB] group-hover:scale-105"
                  }`}
                >
                  <div className="transition-transform duration-200 group-hover:scale-110">
                    {cat.icon}
                  </div>
                </div>

                {/* Category label */}
                <span
                  className={`mt-2.5 text-xs sm:text-sm font-semibold tracking-tight transition ${
                    isSelected ? "text-[#222222] font-bold" : "text-[#717171] group-hover:text-[#222222]"
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Section 3: Category Subheading with Arrow matching Screenshot ("Photography →") */}
        <div className="flex items-center justify-between mt-10 mb-5">
          <div className="flex items-center gap-2 group cursor-pointer">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#222222] tracking-tight">
              {selectedCategory}
            </h2>
            <span className="text-xl sm:text-2xl font-bold text-[#222222] group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>

          {/* Carousel Arrows for Service Cards */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollCards("left")}
              className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:border-[#222222] hover:shadow-xs transition text-[#717171] hover:text-[#222222] bg-white cursor-pointer active:scale-95"
              aria-label="Previous services"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button
              onClick={() => scrollCards("right")}
              className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:border-[#222222] hover:shadow-xs transition text-[#717171] hover:text-[#222222] bg-white cursor-pointer active:scale-95"
              aria-label="Next services"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* Section 4: Exactly 2-3 Service Cards matching Screenshot */}
        <div
          ref={cardsScrollRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 pt-1"
        >
          {displayedServices.map((service: Listing, idx: number) => {
            const isFav = isWishlisted(service.id);
            const badgeText =
              idx === 0
                ? "Popular"
                : idx === 1
                ? "Top rated"
                : "Guest favourite";

            return (
              <div
                key={service.id}
                className="group relative flex flex-col cursor-pointer transition-transform duration-200"
              >
                {/* Card Image Container */}
                <Link
                  href={`/services/${service.id}`}
                  className="block relative aspect-[4/3] sm:aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#EBEBEB] shadow-xs"
                >
                  <img
                    src={service.images[0]?.url || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&auto=format&fit=crop&q=80"}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

                  {/* Top-Left Badge (e.g., 'Popular') */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-white/95 text-[#222222] shadow-sm backdrop-blur-xs">
                      {badgeText}
                    </span>
                  </div>

                  {/* Top-Right Heart Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(service);
                    }}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                    aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={`w-6 h-6 transition-colors duration-200 ${
                        isFav
                          ? "fill-[#FF385C] stroke-[#FF385C]"
                          : "fill-black/30 stroke-white stroke-[2.2] drop-shadow-md"
                      }`}
                    />
                  </button>
                </Link>

                {/* Details under Card */}
                <Link href={`/services/${service.id}`} className="mt-3 block space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-[#222222] leading-snug line-clamp-1 group-hover:underline">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#222222] flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                      <span>{service.rating?.toFixed(2) || "4.98"}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#717171]">
                    {service.city}, India · {service.propertyType}
                  </p>

                  <div className="pt-1 flex items-baseline gap-1 text-xs sm:text-sm">
                    <span className="font-extrabold text-[#222222]">
                      {formatPrice(service.pricePerNight)}
                    </span>
                    <span className="text-[#717171] font-normal">
                      / {service.propertyType === "Chefs" ? "meal" : "session"}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Quality Guarantee Callout Banner */}
        <div className="mt-14 p-6 sm:p-8 bg-[#F7F7F7] border border-[#EBEBEB] rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-[#008489] text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>bnbair Verified Professionals</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#222222]">
              Handpicked hospitality experts in {searchLocation}
            </h3>
            <p className="text-xs sm:text-sm text-[#717171] leading-relaxed">
              Every photographer, private chef, and wellness instructor is identity-verified, background-checked, and reviewed by travelers worldwide.
            </p>
          </div>

          <Link
            href="/services/301"
            className="px-6 py-3 bg-[#222222] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs flex-shrink-0"
          >
            Explore featured session
          </Link>
        </div>
      </main>

      {/* Responsive Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
