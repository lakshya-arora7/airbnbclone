"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/header/Navbar";
import CategoryBar from "@/components/categories/CategoryBar";
import ListingCard from "@/components/listings/ListingCard";
import FilterModal from "@/components/filters/FilterModal";
import { Listing } from "@/types";
import { api } from "@/lib/api";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Map as MapIcon,
  List,
  Home as HomeIcon,
  Globe as GlobeIcon
} from "lucide-react";

// Dynamically import Leaflet Map with SSR disabled
const SearchMap = dynamic(() => import("@/components/map/SearchMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-[#E5E3DF] rounded-3xl flex items-center justify-center text-sm font-semibold text-[#717171] animate-pulse">
      Loading interactive map...
    </div>
  ),
});

/**
 * Reusable horizontal scrolling section with independent scroll navigation
 */
function CarouselSection({
  title,
  href,
  items,
}: {
  title: string;
  href: string;
  items: Listing[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -450 : 450;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="my-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3.5">
        <Link
          href={href}
          className="flex items-center gap-1.5 text-xl font-bold text-[#222222] hover:opacity-80 transition group"
        >
          <span>{title}</span>
          <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:shadow-md transition text-[#717171] hover:text-[#222222] bg-white cursor-pointer active:scale-95"
            aria-label="Previous listings"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:shadow-md transition text-[#717171] hover:text-[#222222] bg-white cursor-pointer active:scale-95"
            aria-label="Next listings"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Row */}
      <div
        ref={scrollRef}
        className="flex items-start gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1"
      >
        {items.map((listing) => (
          <div key={listing.id} className="w-[230px] sm:w-[260px] flex-shrink-0">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [activeMode, setActiveMode] = useState<"all" | "homes" | "experiences">("homes");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [hoveredListingId, setHoveredListingId] = useState<number | null>(null);

  const [searchParams, setSearchParams] = useState<{
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  }>({});

  const [filterParams, setFilterParams] = useState<{
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
    amenities: string[];
  }>({
    amenities: []
  });

  const fetchListings = useCallback(() => {
    // Fetch live listings from backend + synced local store
    api.getListings().then((data) => {
      if (data) {
        setAllListings(data);
      }
    });
  }, []);

  useEffect(() => {
    fetchListings();

    const handleUpdate = () => fetchListings();
    window.addEventListener("airbnb_listings_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("focus", handleUpdate);

    return () => {
      window.removeEventListener("airbnb_listings_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, [fetchListings]);

  // Filter listings based on search parameters and selectedCategory
  const filteredListings = useMemo(() => {
    return allListings.filter((item: Listing) => {
      if (selectedCategory && selectedCategory !== "all") {
        const cat = selectedCategory.toLowerCase();
        const matchCategory = item.category?.toLowerCase() === cat;
        const matchProperty = item.propertyType?.toLowerCase().includes(cat);
        const matchTitle = item.title?.toLowerCase().includes(cat);
        const matchAmenity = item.amenities?.some((a) => a.toLowerCase().includes(cat));
        if (!matchCategory && !matchProperty && !matchTitle && !matchAmenity) return false;
      }

      if (searchParams.location) {
        const query = searchParams.location.toLowerCase();
        const cityMatch = item.city.toLowerCase().includes(query);
        const countryMatch = item.country.toLowerCase().includes(query);
        const titleMatch = item.title.toLowerCase().includes(query);
        if (!cityMatch && !countryMatch && !titleMatch) return false;
      }

      if (searchParams.guests && item.maxGuests < searchParams.guests) return false;
      if (filterParams.minPrice && item.pricePerNight < filterParams.minPrice) return false;
      if (filterParams.maxPrice && item.pricePerNight > filterParams.maxPrice) return false;
      if (filterParams.propertyType && item.propertyType.toLowerCase() !== filterParams.propertyType.toLowerCase()) return false;

      if (filterParams.amenities && filterParams.amenities.length > 0) {
        const hasAll = filterParams.amenities.every((a) =>
          item.amenities.some((itemAmenity) => itemAmenity.toLowerCase() === a.toLowerCase())
        );
        if (!hasAll) return false;
      }

      return true;
    });
  }, [allListings, selectedCategory, searchParams, filterParams]);

  // Dynamic search pill summary text
  const searchSummary = useMemo(() => {
    const loc = searchParams.location || undefined;
    let dt = undefined;
    if (searchParams.checkIn && searchParams.checkOut) {
      dt = `${searchParams.checkIn.slice(5)} - ${searchParams.checkOut.slice(5)}`;
    }
    const gst = searchParams.guests ? `${searchParams.guests} guests` : undefined;
    return { location: loc, dates: dt, guests: gst };
  }, [searchParams]);

  // Live experiences from database
  const liveExperiences = useMemo(() => {
    return allListings.filter((l) => l.category === "Experiences");
  }, [allListings]);

  // All listings with valid coordinates for the interactive map
  const mapListings: Listing[] = useMemo(() => {
    return allListings.filter((l) => l.latitude && l.longitude);
  }, [allListings]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#222222]">
      {/* Header with All, Homes, Experiences Switchers & Interactive Search Deck */}
      <Navbar
        activeMode={activeMode}
        onSelectMode={(mode) => setActiveMode(mode)}
        searchSummary={searchSummary}
        onSearch={(params) => setSearchParams(params)}
      />

      {/* Category Filter Bar with Authentic Icons */}
      {activeMode !== "experiences" && (
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => setSelectedCategory(id)}
          onOpenFilters={() => setIsFilterOpen(true)}
          filterCount={
            (filterParams.minPrice ? 1 : 0) +
            (filterParams.maxPrice ? 1 : 0) +
            (filterParams.propertyType ? 1 : 0) +
            filterParams.amenities.length
          }
        />
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* ========================================================================= */}
        {/* INTERACTIVE MAP SPLIT SCREEN VIEW                                         */}
        {/* When user clicks "Show map", layout splits into Cards (Left) & Map (Right) */}
        {/* ========================================================================= */}
        {showMap ? (
          <div className="flex flex-col-reverse lg:flex-row w-full gap-6 my-2">
            {/* Left Column: Property Cards */}
            <div className="w-full lg:w-[55%] xl:w-[58%] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#222222]">
                    {mapListings.length > 0
                      ? `Over ${mapListings.length} verified stays on the map`
                      : "No stays on the map yet"}
                  </h2>
                  <p className="text-xs text-[#717171] mt-0.5">
                    {mapListings.length > 0
                      ? "Click any authentic price pin to preview and explore properties"
                      : "When listings with coordinates are published, authentic price pins will appear here"}
                  </p>
                </div>
                <button
                  onClick={() => setShowMap(false)}
                  className="text-xs font-semibold text-[#717171] hover:text-[#222222] underline cursor-pointer"
                >
                  Close map view
                </button>
              </div>

              {mapListings.length === 0 ? (
                <div className="py-16 text-center text-[#717171] bg-[#FAFAFA] rounded-2xl p-6 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFF0F3] flex items-center justify-center text-[#FF385C] mb-3 border border-rose-100 shadow-xs">
                    <HomeIcon className="w-7 h-7 text-[#FF385C]" />
                  </div>
                  <p className="font-semibold text-[#222222]">No homes on the map</p>
                  <p className="text-xs mt-1">When hosts publish listings, they will appear here live with map pins.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {mapListings.map((listing) => {
                    const isHovered = hoveredListingId === listing.id;
                    return (
                      <div
                        key={listing.id}
                        id={`listing-${listing.id}`}
                        onMouseEnter={() => setHoveredListingId(listing.id)}
                        onMouseLeave={() => setHoveredListingId(null)}
                        className={`rounded-2xl transition-all duration-200 ${
                          isHovered ? "ring-2 ring-[#222222] p-1 -m-1" : ""
                        }`}
                      >
                        <ListingCard listing={listing} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Sticky Interactive Leaflet Map with Authentic Price Bubble Pins */}
            <div className="w-full lg:w-[45%] xl:w-[42%] lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] min-h-[520px] rounded-3xl overflow-hidden border border-[#EBEBEB] shadow-sm">
              <SearchMap
                listings={mapListings}
                hoveredListingId={hoveredListingId}
                onHoverListing={(id) => setHoveredListingId(id)}
                onSelectListing={(id) => {
                  const el = document.getElementById(`listing-${id}`);
                  el?.scrollIntoView({ behavior: "smooth" });
                  setHoveredListingId(id);
                }}
              />
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* STANDARD EXPLORE CATEGORY VIEWS (Homes, Experiences, All)                 */
          /* ========================================================================= */
          <>
            {/* 1. HOMES MODE */}
            {activeMode === "homes" && (
              <>
                {filteredListings.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-[#FFF0F3] flex items-center justify-center text-[#FF385C] border border-rose-100 shadow-sm mb-1">
                      <HomeIcon className="w-10 h-10 text-[#FF385C] stroke-[1.8]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#222222]">
                      {allListings.length === 0 ? "No homes listed yet" : "No matching stays found"}
                    </h2>
                    <p className="text-xs text-[#717171] leading-relaxed">
                      {allListings.length === 0
                        ? "The database is clean. Hosts can create and manage their own listings anytime."
                        : "Try adjusting your search criteria or clearing your filters to discover more stays."}
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      {(allListings.length > 0 || selectedCategory !== "all" || searchParams.location) && (
                        <button
                          onClick={() => {
                            setSelectedCategory("all");
                            setSearchParams({});
                            setFilterParams({ amenities: [] });
                          }}
                          className="px-5 py-2.5 border border-[#222222] rounded-xl text-xs font-bold hover:bg-[#F7F7F7] transition cursor-pointer"
                        >
                          Clear all filters
                        </button>
                      )}
                      <Link
                        href="/hosting"
                        className="px-5 py-2.5 bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
                      >
                        <HomeIcon className="w-3.5 h-3.5" />
                        <span>Host your home</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10 py-4">
                    {filteredListings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* 2. EXPERIENCES MODE */}
            {activeMode === "experiences" && (
              <>
                {liveExperiences.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-[#FFF0F3] flex items-center justify-center text-[#FF385C] border border-rose-100 shadow-sm mb-1">
                      <Sparkles className="w-10 h-10 text-[#FF385C] stroke-[1.8]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#222222]">No experiences listed yet</h2>
                    <p className="text-xs text-[#717171] leading-relaxed">
                      The database is clean. When hosts publish guided tours, workshops, or heritage walks, they will appear here live.
                    </p>
                    <Link
                      href="/hosting"
                      className="px-5 py-2.5 bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Host an experience</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10 py-4">
                    {liveExperiences.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* 3. ALL MODE */}
            {activeMode === "all" && (
              <>
                {filteredListings.length === 0 && liveExperiences.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-[#FFF0F3] flex items-center justify-center text-[#FF385C] border border-rose-100 shadow-sm mb-1">
                      <GlobeIcon className="w-10 h-10 text-[#FF385C] stroke-[1.8]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#222222]">No listings published yet</h2>
                    <p className="text-xs text-[#717171] leading-relaxed">
                      The database is clean. Hosts can create and manage their own listings anytime.
                    </p>
                    <Link
                      href="/hosting"
                      className="px-5 py-2.5 bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <HomeIcon className="w-3.5 h-3.5" />
                      <span>Host a stay</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-10 py-2">
                    {filteredListings.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-[#222222] mb-4">Verified Stays</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
                          {filteredListings.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                          ))}
                        </div>
                      </div>
                    )}
                    {liveExperiences.length > 0 && (
                      <div className="pt-6 border-t border-[#EBEBEB]">
                        <h2 className="text-xl font-bold text-[#222222] mb-4">Live Experiences</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
                          {liveExperiences.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* ========================================================================= */}
      {/* FLOATING "SHOW MAP" / "SHOW LIST" PILL BUTTON (AUTHENTIC AIRBNB POSITION) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => {
            setShowMap(!showMap);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="bg-[#222222] hover:bg-black text-white px-5 py-3.5 rounded-full font-bold text-sm shadow-[0_6px_24px_rgba(0,0,0,0.32)] flex items-center gap-2.5 hover:scale-105 active:scale-95 transition cursor-pointer"
          aria-label={showMap ? "Show list" : "Show map"}
        >
          <span>{showMap ? "Show list" : "Show map"}</span>
          {showMap ? (
            <List className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <MapIcon className="w-4 h-4 stroke-[2.5]" />
          )}
        </button>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(filters) => setFilterParams(filters)}
        initialFilters={filterParams}
        totalCount={filteredListings.length}
      />
    </div>
  );
}
