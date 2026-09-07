"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Listing } from "@/types";
import { api } from "@/lib/api";
import { useAuthPersona } from "./AuthPersonaContext";

interface WishlistContextType {
  wishlist: Listing[];
  wishlistIds: number[];
  isWishlisted: (id: number) => boolean;
  toggleWishlist: (listing: Listing) => Promise<boolean>;
  removeFromWishlist: (id: number) => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { persona } = useAuthPersona();
  const [wishlist, setWishlist] = useState<Listing[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load wishlist on mount / persona change
  useEffect(() => {
    let isMounted = true;
    const currentUserId = persona?.id || 1;

    async function loadWishlist() {
      setIsLoading(true);
      let localItems: Listing[] = [];
      let localIds: number[] = [];

      try {
        const savedItems = localStorage.getItem("airbnb_demo_wishlist_items");
        if (savedItems) {
          localItems = JSON.parse(savedItems);
        }
        const savedIds = localStorage.getItem("airbnb_demo_wishlist");
        if (savedIds) {
          localIds = JSON.parse(savedIds);
        }
      } catch (e) {
        console.warn("[Wishlist] Error reading localStorage:", e);
      }

      // Fetch from backend
      try {
        const serverListings = await api.getWishlist(currentUserId);
        if (isMounted) {
          // Merge server listings with local cached items (avoiding duplicates by id)
          const mergedMap = new Map<number, Listing>();
          (serverListings || []).forEach((l) => mergedMap.set(l.id, l));
          localItems.forEach((l) => {
            if (!mergedMap.has(l.id) && localIds.includes(l.id)) {
              mergedMap.set(l.id, l);
            }
          });

          const combined = Array.from(mergedMap.values());
          const ids = combined.map((l) => l.id);

          setWishlist(combined);
          setWishlistIds(ids);

          localStorage.setItem("airbnb_demo_wishlist", JSON.stringify(ids));
          localStorage.setItem("airbnb_demo_wishlist_items", JSON.stringify(combined));
        }
      } catch (e) {
        console.warn("[Wishlist] Backend fetch failed, relying on local:", e);
        if (isMounted && localItems.length > 0) {
          setWishlist(localItems);
          setWishlistIds(localIds);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadWishlist();

    return () => {
      isMounted = false;
    };
  }, [persona?.id]);

  const isWishlisted = (id: number): boolean => {
    return wishlistIds.includes(id);
  };

  const toggleWishlist = async (listing: Listing): Promise<boolean> => {
    const currentUserId = persona?.id || 1;
    const currentlyFavorited = wishlistIds.includes(listing.id);
    const nextState = !currentlyFavorited;

    let updatedWishlist: Listing[];
    let updatedIds: number[];

    if (currentlyFavorited) {
      updatedWishlist = wishlist.filter((l) => l.id !== listing.id);
      updatedIds = wishlistIds.filter((id) => id !== listing.id);
    } else {
      updatedWishlist = [listing, ...wishlist.filter((l) => l.id !== listing.id)];
      updatedIds = [listing.id, ...wishlistIds.filter((id) => id !== listing.id)];
    }

    // Immediately update UI state for instant responsiveness
    setWishlist(updatedWishlist);
    setWishlistIds(updatedIds);

    // Save to localStorage
    try {
      localStorage.setItem("airbnb_demo_wishlist", JSON.stringify(updatedIds));
      localStorage.setItem("airbnb_demo_wishlist_items", JSON.stringify(updatedWishlist));
    } catch (e) {
      console.error(e);
    }

    // Persist to backend database asynchronously
    try {
      await api.toggleWishlist(listing.id, currentUserId);
    } catch (err) {
      console.warn("[Wishlist] Backend sync error:", err);
    }

    return nextState;
  };

  const removeFromWishlist = async (id: number): Promise<void> => {
    const currentUserId = persona?.id || 1;
    const updatedWishlist = wishlist.filter((l) => l.id !== id);
    const updatedIds = wishlistIds.filter((favId) => favId !== id);

    setWishlist(updatedWishlist);
    setWishlistIds(updatedIds);

    try {
      localStorage.setItem("airbnb_demo_wishlist", JSON.stringify(updatedIds));
      localStorage.setItem("airbnb_demo_wishlist_items", JSON.stringify(updatedWishlist));
    } catch (e) {
      console.error(e);
    }

    try {
      await api.toggleWishlist(id, currentUserId);
    } catch (err) {
      console.warn("[Wishlist] Backend removal error:", err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
