"use client";

import React, { useState } from "react";
import ListingCard from "./ListingCard";
import { Listing } from "@/types";
import { Map, ListFilter, Sparkles } from "lucide-react";

interface ListingGridProps {
  listings: Listing[];
  favorites: number[];
  onToggleFavorite: (listingId: number) => void;
  onResetFilters?: () => void;
}

export default function ListingGrid({
  listings,
  favorites,
  onToggleFavorite,
  onResetFilters
}: ListingGridProps) {
  const [showMap, setShowMap] = useState(false);

  if (listings.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#F7F7F7] flex items-center justify-center mb-4 text-[#717171]">
          <ListFilter className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-[#222222] mb-1">No exact matches found</h3>
        <p className="text-[#717171] text-sm max-w-md mb-6">
          Try adjusting your search criteria, clearing some filters, or exploring all destinations.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-5 py-2.5 rounded-xl border border-[#222222] text-[#222222] text-sm font-semibold hover:bg-[#F7F7F7] transition"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Listing Cards Grid */}
      {!showMap ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isFavorited={favorites.includes(listing.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        /* Map View Split Mode */
        <div className="w-full h-[650px] rounded-3xl overflow-hidden border border-[#DDDDDD] bg-[#F7F7F7] relative flex flex-col items-center justify-center text-center p-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#EBEBEB] max-w-md">
            <div className="w-12 h-12 rounded-full bg-[#FF385C]/10 text-[#FF385C] flex items-center justify-center mx-auto mb-3">
              <Map className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#222222] mb-1">Interactive Map View</h4>
            <p className="text-xs text-[#717171] mb-4">
              Showing {listings.length} listings with pricing pins across global destinations.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {listings.slice(0, 6).map((l) => (
                <span
                  key={l.id}
                  className="bg-[#222222] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm"
                >
                  ₹{l.pricePerNight.toLocaleString("en-IN")} · {l.city}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Pill Button (Show Map / Show List) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2 bg-[#222222] hover:bg-black text-white px-5 py-3 rounded-full font-semibold text-sm shadow-xl hover:scale-105 transition active:scale-95"
        >
          {showMap ? (
            <>
              <span>Show list</span>
              <ListFilter className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Show map</span>
              <Map className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
