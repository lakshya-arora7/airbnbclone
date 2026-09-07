"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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

  const currentUserId = persona?.id || 1;
  const storageKey = `airbnb_liked_wishlist_u${currentUserId}`;

  // Purge legacy mock wishlist keys
  useEffect(() => {
    try {
      localStorage.removeItem("airbnb_demo_wishlist_items");
      localStorage.removeItem("airbnb_demo_wishlist");
    } catch (e) {
      // ignore
    }
  }, []);

  // Fetch actual liked properties from backend DB
  const loadWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const serverListings = await api.getWishlist(currentUserId);
      if (Array.isArray(serverListings)) {
        // Only actual liked properties from backend database
        setWishlist(serverListings);
        const ids = serverListings.map((l) => l.id);
        setWishlistIds(ids);

        // Cache exclusively the actual liked properties for this user
        try {
          localStorage.setItem(storageKey, JSON.stringify(serverListings));
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      console.warn("[Wishlist] Backend fetch failed, reading actual saved cache:", e);
      try {
        const cached = localStorage.getItem(storageKey);
        if (cached) {
          const parsed: Listing[] = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setWishlist(parsed);
            setWishlistIds(parsed.map((l) => l.id));
          }
        } else {
          setWishlist([]);
          setWishlistIds([]);
        }
      } catch (err) {
        setWishlist([]);
        setWishlistIds([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, storageKey]);

  // Load wishlist when user/persona changes
  useEffect(() => {
    loadWishlist();

    const handleSync = () => loadWishlist();
    window.addEventListener("airbnb_wishlist_updated", handleSync);
    window.addEventListener("focus", handleSync);

    return () => {
      window.removeEventListener("airbnb_wishlist_updated", handleSync);
      window.removeEventListener("focus", handleSync);
    };
  }, [loadWishlist]);

  const isWishlisted = useCallback(
    (id: number): boolean => {
      return wishlistIds.includes(id);
    },
    [wishlistIds]
  );

  const toggleWishlist = async (listing: Listing): Promise<boolean> => {
    const isLiked = wishlistIds.includes(listing.id);
    const nextState = !isLiked;

    let updatedWishlist: Listing[];
    let updatedIds: number[];

    if (isLiked) {
      updatedWishlist = wishlist.filter((l) => l.id !== listing.id);
      updatedIds = wishlistIds.filter((id) => id !== listing.id);
    } else {
      updatedWishlist = [listing, ...wishlist.filter((l) => l.id !== listing.id)];
      updatedIds = [listing.id, ...wishlistIds.filter((id) => id !== listing.id)];
    }

    // Immediately update UI state
    setWishlist(updatedWishlist);
    setWishlistIds(updatedIds);

    // Save actual user likes to local storage
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedWishlist));
    } catch (e) {
      console.error(e);
    }

    // Broadcast change to all listening views
    window.dispatchEvent(new CustomEvent("airbnb_wishlist_updated"));

    // Sync with backend database
    try {
      await api.toggleWishlist(listing.id, currentUserId);
    } catch (err) {
      console.warn("[Wishlist] Backend sync error:", err);
    }

    return nextState;
  };

  const removeFromWishlist = async (id: number): Promise<void> => {
    const updatedWishlist = wishlist.filter((l) => l.id !== id);
    const updatedIds = wishlistIds.filter((favId) => favId !== id);

    setWishlist(updatedWishlist);
    setWishlistIds(updatedIds);

    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedWishlist));
    } catch (e) {
      console.error(e);
    }

    window.dispatchEvent(new CustomEvent("airbnb_wishlist_updated"));

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
