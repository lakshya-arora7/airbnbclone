"use client";

import React, { useState, useEffect, useMemo, use, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  Search,
  Heart,
  ChevronLeft,
  ChevronRight,
  Menu,
  User,
  Sparkles,
  Home,
  Luggage,
  HelpCircle,
  Map,
  List,
  Star
} from "lucide-react";
import { Listing } from "@/types";
import { useAuthPersona } from "@/context/AuthPersonaContext";
import { HomesHouseIcon } from "@/components/header/CategoryIcons";
import dynamic from "next/dynamic";
import FilterModal from "@/components/filters/FilterModal";
import SearchDeck, { SearchState } from "@/components/search/SearchDeck";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";
import { api } from "@/lib/api";

const SearchMap = dynamic(() => import("@/components/map/SearchMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-[#E5E3DF] rounded-3xl flex items-center justify-center text-sm font-semibold text-[#717171] animate-pulse">
      Loading map...
    </div>
  ),
});

interface PageProps {
  params: Promise<{ location: string }>;
}

function SearchResultsContent({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const locationRaw = resolvedParams.location || "Noida";
  const locationName = decodeURIComponent(locationRaw).replace(/--.*$/, "").replace(/-/g, " ");

  const checkinParam = searchParams.get("checkin");
  const checkoutParam = searchParams.get("checkout");
  const guestsParam = searchParams.get("guests");

  const { persona, switchToHosting, switchToTravelling, isHost } = useAuthPersona();
  const { formatPrice, t } = useLanguageCurrency();

  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [isSearchDeckOpen, setIsSearchDeckOpen] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState<"where" | "when" | "who" | null>(null);

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [hoveredListingId, setHoveredListingId] = useState<number | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false);

  // Active image index per card for carousel
  const [activeImageIndices, setActiveImageIndices] = useState<Record<number, number>>({});

  useEffect(() => {
    // 1. Fetch live listings from backend
    api.getListings({ location: locationName }).then((data) => {
      if (data && data.length > 0) {
        setAllListings(data);
      }
    });
  }, [locationName]);

  const formattedDates = useMemo(() => {
    if (checkinParam && checkoutParam) {
      try {
        const inDate = new Date(checkinParam);
        const outDate = new Date(checkoutParam);
        const inDay = inDate.getDate();
        const outDay = outDate.getDate();
        const month = inDate.toLocaleDateString("en-US", { month: "short" });
        return `${inDay}–${outDay} ${month}`;
      } catch (e) {
        return "8–9 Sept";
      }
    }
    return "8–9 Sept";
  }, [checkinParam, checkoutParam]);

  const formattedGuests = useMemo(() => {
    if (guestsParam) {
      const g = parseInt(guestsParam, 10);
      if (!isNaN(g) && g > 0) {
        return `${g} guest${g > 1 ? "s" : ""}`;
      }
    }
    return "4 guests";
  }, [guestsParam]);

  const handleToggleFilter = (filterKey: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterKey) ? prev.filter((f) => f !== filterKey) : [...prev, filterKey]
    );
  };

  const handleToggleFavorite = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNextImage = (listingId: number, maxImages: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndices((prev) => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) + 1) % maxImages
    }));
  };

  const handlePrevImage = (listingId: number, maxImages: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndices((prev) => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) - 1 + maxImages) % maxImages
    }));
  };

  // Filter listings based on active filter chips and searched location
  const filteredListings = useMemo(() => {
    const rawQuery = locationName.toLowerCase().trim();
    const isAll = !rawQuery || rawQuery === "all" || rawQuery === "homes" || rawQuery === "stays";

    return allListings.filter((item: Listing) => {
      if (!isAll) {
        const cityMatch = item.city.toLowerCase().includes(rawQuery);
        const countryMatch = item.country.toLowerCase().includes(rawQuery);
        const titleMatch = item.title.toLowerCase().includes(rawQuery);
        const descMatch = item.description.toLowerCase().includes(rawQuery);
        const subMatch = item.subtitle?.toLowerCase().includes(rawQuery);

        // Word-level matching for compound locations
        const words = rawQuery.split(/\s+/).filter((w) => w.length > 2);
        const anyWordMatch = words.some(
          (w) =>
            item.city.toLowerCase().includes(w) ||
            item.country.toLowerCase().includes(w) ||
            item.title.toLowerCase().includes(w)
        );

        if (!cityMatch && !countryMatch && !titleMatch && !descMatch && !subMatch && !anyWordMatch) {
          return false;
        }
      }

      if (activeFilters.includes("2+ bedrooms") && item.bedrooms < 2) return false;
      if (activeFilters.includes("Pool") && !item.amenities.includes("Pool")) return false;
      if (activeFilters.includes("Self check-in") && !item.amenities.includes("Self check-in")) return false;
      if (activeFilters.includes("Instant Book") && !item.amenities.includes("Instant Book")) return false;
      if (activeFilters.includes("Air conditioning") && !item.amenities.includes("Air conditioning")) return false;
      return true;
    });
  }, [allListings, locationName, activeFilters]);

  // If no direct matches, provide fallback recommendations
  const displayListings = filteredListings.length > 0 ? filteredListings : allListings;

  const handleSearchExecute = (searchState: SearchState) => {
    const totalGuests = searchState.adults + searchState.children;
    const loc = searchState.location.trim();
    const locSlug = loc ? encodeURIComponent(loc.replace(/\s+/g, "-")) : "all";
    const query = new URLSearchParams();
    if (searchState.startDate) query.set("checkin", searchState.startDate);
    if (searchState.endDate) query.set("checkout", searchState.endDate);
    if (totalGuests > 0) query.set("guests", String(totalGuests));

    setIsSearchDeckOpen(false);
    setActiveSearchTab(null);
    const queryString = query.toString();
    router.push(`/s/${locSlug}/homes${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col">
      {/* ============================================================ */}
      {/* 1. TOP HEADER MATCHING SCREENSHOT                            */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#EBEBEB] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <svg
            className="h-8 w-auto text-[#FF385C] transition-transform group-hover:scale-105"
            viewBox="0 0 32 32"
            fill="currentColor"
          >
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.371c0 4.14-3.328 7.75-8.5 7.75-3.08 0-5.836-1.503-7.5-3.873-1.664 2.37-4.42 3.873-7.5 3.873-5.172 0-8.5-3.61-8.5-7.75 0-1.127.284-2.22.971-3.767l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C8.537 1.963 9.992 1 12 1h4zm0 2.5h-4c-1.144 0-2.083.568-3.083 2.387l-.462.887C6.54 10.536 2.42 19.167 1.48 21.36c-.57 1.306-.78 2.062-.78 2.89 0 2.98 2.348 5.25 6.3 5.25 3.018 0 5.485-1.742 6.577-4.444l.423-1.146.423 1.146c1.092 2.702 3.559 4.444 6.577 4.444 3.952 0 6.3-2.27 6.3-5.25 0-.828-.21-1.584-.78-2.89-.94-2.193-5.06-10.824-6.975-14.586l-.462-.887C19.083 4.068 18.144 3.5 17 3.5h-1zm0 13c2.485 0 4.5 2.015 4.5 4.5S18.485 24.5 16 24.5s-4.5-2.015-4.5-4.5 2.015-4.5 4.5-4.5zm0 2.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z" />
          </svg>
          <span className="font-bold text-xl tracking-tight text-[#FF385C] hidden md:inline">airbnb</span>
        </Link>

        {/* Center: Interactive Search Capsule matching Screenshot */}
        <div
          onClick={() => {
            setIsSearchDeckOpen(true);
            setActiveSearchTab("where");
          }}
          className="flex items-center gap-3 bg-white border border-[#DDDDDD] rounded-full py-2 px-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md cursor-pointer transition text-xs font-semibold text-[#222222]"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsSearchDeckOpen(true);
              setActiveSearchTab("where");
            }}
            className="flex items-center gap-1.5 font-bold hover:text-[#FF385C] transition"
          >
            <HomesHouseIcon className="w-5 h-5 flex-shrink-0" />
            <span>Homes in {locationName}</span>
          </div>

          <span className="h-4 w-px bg-[#DDDDDD]" />

          <span
            onClick={(e) => {
              e.stopPropagation();
              setIsSearchDeckOpen(true);
              setActiveSearchTab("when");
            }}
            className="text-[#222222] hover:text-[#FF385C] transition"
          >
            {formattedDates}
          </span>

          <span className="h-4 w-px bg-[#DDDDDD]" />

          <span
            onClick={(e) => {
              e.stopPropagation();
              setIsSearchDeckOpen(true);
              setActiveSearchTab("who");
            }}
            className="text-[#222222] hover:text-[#FF385C] transition"
          >
            {formattedGuests}
          </span>

          {/* Red Search Icon */}
          <div className="w-7 h-7 rounded-full bg-[#FF385C] text-white flex items-center justify-center flex-shrink-0 ml-1 hover:bg-[#E00B41] transition">
            <Search className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        {/* Right: Switch to hosting & Profile Menu */}
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => {
              if (isHost) {
                switchToTravelling();
                router.push("/");
              } else {
                switchToHosting();
                router.push("/hosting");
              }
            }}
            className="text-xs sm:text-sm font-semibold text-[#222222] hover:bg-[#F7F7F7] px-3.5 py-2 rounded-full transition hidden sm:inline"
          >
            {isHost ? "Switch to travelling" : "Switch to hosting"}
          </button>

          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#DDDDDD] bg-[#EBEBEB] flex items-center justify-center">
            {persona.avatarUrl ? (
              <img src={persona.avatarUrl} alt={persona.fullName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-[#717171]" />
            )}
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-9 h-9 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:shadow-md transition bg-white"
            aria-label="Main menu"
          >
            <Menu className="w-4 h-4 text-[#222222]" />
          </button>

          {/* Persona Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-xl border border-[#DDDDDD] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-[#EBEBEB]">
                <p className="font-bold text-sm text-[#222222]">{persona.fullName}</p>
                <p className="text-xs text-[#717171]">{persona.email}</p>
              </div>

              <div className="py-1">
                <Link
                  href="/trips"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-[#222222] hover:bg-[#F7F7F7] flex items-center gap-2.5 transition"
                >
                  <Luggage className="w-4 h-4 text-[#717171]" />
                  <span>My Trips</span>
                </Link>

                <Link
                  href="/account-settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-[#222222] hover:bg-[#F7F7F7] flex items-center gap-2.5 transition"
                >
                  <User className="w-4 h-4 text-[#717171]" />
                  <span>Account</span>
                </Link>
              </div>

              <div className="h-px bg-[#EBEBEB] my-1" />

              <div className="py-1">
                <button
                  onClick={() => {
                    if (isHost) {
                      switchToTravelling();
                      router.push("/");
                    } else {
                      switchToHosting();
                      router.push("/hosting");
                    }
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-[#FF385C] hover:bg-[#FFF8F6] flex items-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isHost ? "Switch to travelling" : "Switch to hosting"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Interactive Search Deck in Search Results */}
      {isSearchDeckOpen && (
        <div className="border-b border-[#EBEBEB] bg-white relative z-50">
          <SearchDeck
            isOpen={isSearchDeckOpen}
            activeTab={activeSearchTab}
            onOpenTab={(tab) => {
              setIsSearchDeckOpen(true);
              setActiveSearchTab(tab);
            }}
            onClose={() => {
              setIsSearchDeckOpen(false);
              setActiveSearchTab(null);
            }}
            onSearch={handleSearchExecute}
            initialState={{
              location: locationName,
              startDate: checkinParam || "2026-09-08",
              endDate: checkoutParam || "2026-09-09",
              adults: guestsParam ? parseInt(guestsParam, 10) : 4
            }}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. FILTER PILLS HEADER MATCHING SCREENSHOT                   */}
      {/* ============================================================ */}
      <div className="px-4 sm:px-8 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar border-b border-[#EBEBEB] bg-white sticky top-[65px] z-30">
        {/* Main Filters Button */}
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#DDDDDD] hover:border-[#222222] text-xs font-semibold text-[#222222] transition flex-shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>

        {/* Quick Filter Chips matching screenshot */}
        {[
          "2+ bedrooms",
          "Pool",
          "Self check-in",
          "Instant Book",
          "Air conditioning"
        ].map((chip) => {
          const isActive = activeFilters.includes(chip);
          return (
            <button
              key={chip}
              onClick={() => handleToggleFilter(chip)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition flex-shrink-0 ${
                isActive
                  ? "bg-[#222222] text-white border border-[#222222]"
                  : "bg-white text-[#222222] border border-[#DDDDDD] hover:border-[#222222]"
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 3. SPLIT SCREEN: LISTINGS ON LEFT, MAP ON RIGHT              */}
      {/* ============================================================ */}
      <main className={`flex-1 flex ${isMapVisible ? "flex-col-reverse lg:flex-row" : "flex-col"} w-full`}>
        {/* Left Side: Listing Cards Column */}
        <div className={`px-4 sm:px-8 py-6 overflow-y-auto ${isMapVisible ? "w-full lg:w-[55%] xl:w-[58%]" : "w-full max-w-7xl mx-auto"}`}>
          {/* Subheading matching screenshot */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[#222222]">
              {filteredListings.length > 0
                ? `${filteredListings.length} ${filteredListings.length === 1 ? "place" : "places"} in ${locationName}`
                : `Places in ${locationName}`}
            </h1>
          </div>

          {/* No Direct Match Notice */}
          {filteredListings.length === 0 && allListings.length > 0 && (
            <div className="bg-[#FFF8F6] border border-[#FF385C]/20 rounded-2xl p-4 mb-6 text-xs text-[#222222]">
              <span className="font-bold">No exact properties found in &ldquo;{locationName}&rdquo;. </span>
              <span className="text-[#717171]">Explore these popular verified stays near your destination:</span>
            </div>
          )}

          {displayListings.length === 0 ? (
            <div className="py-20 text-center text-[#717171]">
              <p className="text-base font-semibold text-[#222222]">No properties found for &ldquo;{locationName}&rdquo;</p>
              <p className="text-xs mt-1">Try searching for other destinations like Goa, Delhi, or Paris.</p>
            </div>
          ) : (
            /* Grid of Listing Cards: 2-column if map visible, 4-column if full list */
            <div className={`grid gap-6 ${isMapVisible ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}>
              {displayListings.map((listing) => {
                const currentImgIdx = activeImageIndices[listing.id] || 0;
                const isHovered = hoveredListingId === listing.id;

                return (
                  <div
                    key={listing.id}
                    id={`listing-${listing.id}`}
                    onMouseEnter={() => setHoveredListingId(listing.id)}
                    onMouseLeave={() => setHoveredListingId(null)}
                    className={`group rounded-2xl transition-all duration-200 ${
                      isHovered ? "ring-2 ring-[#222222] p-1 -m-1" : ""
                    }`}
                  >
                    <Link href={`/rooms/${listing.id}`} className="block">
                      {/* Image Carousel Container */}
                      <div className="relative aspect-[1.28/1] w-full overflow-hidden rounded-2xl bg-[#EBEBEB]">
                        <img
                          src={listing.images[currentImgIdx]?.url || listing.images[0]?.url}
                          alt={listing.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Top Overlays */}
                        {listing.isGuestFavourite && (
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#222222] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm z-10">
                            Guest favourite
                          </div>
                        )}

                        <button
                          onClick={(e) => handleToggleFavorite(listing.id, e)}
                          className="absolute top-3 right-3 p-1.5 rounded-full hover:scale-110 active:scale-95 transition text-white drop-shadow-md z-10"
                          aria-label="Save"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              favorites.includes(listing.id)
                                ? "fill-[#FF385C] stroke-[#FF385C]"
                                : "stroke-white fill-black/30"
                            }`}
                          />
                        </button>

                        {/* Carousel Arrow Buttons (Visible on hover if multiple images) */}
                        {listing.images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => handlePrevImage(listing.id, listing.images.length, e)}
                              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#222222] opacity-0 group-hover:opacity-100 transition hover:scale-110 active:scale-90 z-10"
                              aria-label="Previous photo"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleNextImage(listing.id, listing.images.length, e)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#222222] opacity-0 group-hover:opacity-100 transition hover:scale-110 active:scale-90 z-10"
                              aria-label="Next photo"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>

                            {/* Dots pagination */}
                            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
                              {listing.images.map((_, dotIdx) => (
                                <span
                                  key={dotIdx}
                                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                                    dotIdx === currentImgIdx
                                      ? "bg-white scale-125"
                                      : "bg-white/60"
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Listing Details Card Body */}
                      <div className="mt-3">
                        {/* Row 1: Title and Star Rating */}
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="font-bold text-sm text-[#222222] truncate">
                            {listing.title}
                          </h3>
                          <div className="flex items-center gap-1 text-xs font-semibold text-[#222222] flex-shrink-0">
                            <Star className="w-3 h-3 fill-[#222222] text-[#222222]" />
                            <span>{listing.rating.toFixed(listing.rating % 1 === 0 ? 1 : 2)}</span>
                            <span className="text-[#717171] font-normal">({listing.reviewCount})</span>
                          </div>
                        </div>

                        {/* Row 2: Subtitle / Location Highlight */}
                        <p className="text-xs text-[#717171] mt-0.5 truncate font-normal">
                          {listing.subtitle || `${listing.city}, ${listing.country}`}
                        </p>

                        {/* Row 3: Bed and room specifications */}
                        <p className="text-xs text-[#717171] mt-0.5 font-normal">
                          {listing.bedDetails || `${listing.bedrooms} bedrooms · ${listing.beds} beds · ${listing.bathrooms} bathrooms`}
                        </p>

                        {/* Row 4: Pricing with slashed original price if available */}
                        <div className="mt-1 flex items-baseline gap-1.5">
                          {listing.originalPrice && (
                            <span className="line-through text-[#717171] text-xs">
                              {formatPrice(listing.originalPrice)}
                            </span>
                          )}
                          <span className="font-bold text-sm text-[#222222]">
                            {formatPrice(listing.pricePerNight)}
                          </span>
                          <span className="text-[#717171] text-xs">{t("listing.perNight", "per night")}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Sticky Interactive Map */}
        {isMapVisible && (
          <div className="w-full lg:w-[45%] xl:w-[42%] p-4 lg:p-6 lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] min-h-[500px]">
            <SearchMap
              listings={displayListings}
              hoveredListingId={hoveredListingId}
              onHoverListing={(id) => setHoveredListingId(id)}
              onSelectListing={(id) => {
                const el = document.getElementById(`listing-${id}`);
                el?.scrollIntoView({ behavior: "smooth" });
                setHoveredListingId(id);
              }}
            />
          </div>
        )}
      </main>

      {/* Floating Show Map / Show List Pill Button for Search Results */}
      <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => {
            setIsMapVisible(!isMapVisible);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="bg-[#222222] hover:bg-black text-white px-5 py-3.5 rounded-full font-bold text-sm shadow-[0_6px_24px_rgba(0,0,0,0.32)] flex items-center gap-2.5 hover:scale-105 active:scale-95 transition cursor-pointer"
          aria-label={isMapVisible ? "Show list" : "Show map"}
        >
          <span>{isMapVisible ? "Show list" : "Show map"}</span>
          {isMapVisible ? (
            <List className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <Map className="w-4 h-4 stroke-[2.5]" />
          )}
        </button>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(filters) => {
          if (filters.propertyType) handleToggleFilter(filters.propertyType);
          setIsFilterModalOpen(false);
        }}
        initialFilters={{ amenities: activeFilters }}
        totalCount={filteredListings.length}
      />
    </div>
  );
}

export default function SearchResultsPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-sm text-[#717171]">Loading homes...</div>}>
      <SearchResultsContent params={params} />
    </Suspense>
  );
}
