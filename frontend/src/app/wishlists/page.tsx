"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/header/Navbar";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import ListingCard from "@/components/listings/ListingCard";
import { Heart, Sparkles } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { Listing } from "@/types";

export default function WishlistsPage() {
  const { wishlist, removeFromWishlist, isLoading } = useWishlist();

  // Ensure items are 100% deduplicated by id
  const uniqueWishlist = useMemo(() => {
    const map = new Map<number, Listing>();
    (wishlist || []).forEach((item) => {
      if (item && item.id) {
        map.set(item.id, item);
      }
    });
    return Array.from(map.values());
  }, [wishlist]);

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 sm:pb-10">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-[#222222]">Wishlists</h1>
            <span className="bg-rose-50 text-[#FF385C] border border-rose-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {uniqueWishlist.length} saved
            </span>
          </div>
          <p className="text-sm text-[#717171] mt-1">
            Properties, experiences, and services saved to your personal collection
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-[4/3] bg-[#EBEBEB] rounded-2xl" />
                <div className="h-4 bg-[#EBEBEB] rounded w-3/4" />
                <div className="h-3 bg-[#EBEBEB] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : uniqueWishlist.length === 0 ? (
          <div className="border border-[#DDDDDD] rounded-3xl p-12 text-center max-w-md mx-auto my-12 bg-[#F7F7F7]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 text-[#FF385C] shadow-sm">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#222222] mb-1">Your wishlist is empty</h3>
            <p className="text-xs text-[#717171] mb-6">
              As you browse, tap the heart icon on any stay, experience, or service to save it here.
            </p>
            <Link
              href="/"
              className="airbnb-btn-primary px-6 py-3 rounded-xl font-semibold text-sm inline-block"
            >
              Start exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {uniqueWishlist.map((listing) => (
              <ListingCard
                key={`wishlist-listing-${listing.id}`}
                listing={listing}
                isFavorited={true}
                onToggleFavorite={() => removeFromWishlist(listing.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
