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
        // Guarantee deduplicated list by id
        const uniqueMap = new Map<number, Listing>();
        serverListings.forEach((l) => {
          if (l && l.id) uniqueMap.set(l.id, l);
        });
        const deduplicated = Array.from(uniqueMap.values());
        setWishlist(deduplicated);
        setWishlistIds(deduplicated.map((l) => l.id));

        try {
          localStorage.setItem(storageKey, JSON.stringify(deduplicated));
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
            const uniqueMap = new Map<number, Listing>();
            parsed.forEach((l) => {
              if (l && l.id) uniqueMap.set(l.id, l);
            });
            const deduplicated = Array.from(uniqueMap.values());
            setWishlist(deduplicated);
            setWishlistIds(deduplicated.map((l) => l.id));
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
    window.addEventListener("focus", handleSync);

    return () => {
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
    let nextState = false;

    setWishlist((prev) => {
      const exists = prev.some((l) => l.id === listing.id);
      nextState = !exists;
      let next: Listing[];
      if (exists) {
        next = prev.filter((l) => l.id !== listing.id);
      } else {
        next = [listing, ...prev.filter((l) => l.id !== listing.id)];
      }
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    setWishlistIds((prev) => {
      if (prev.includes(listing.id)) {
        return prev.filter((id) => id !== listing.id);
      } else {
        return [listing.id, ...prev.filter((id) => id !== listing.id)];
      }
    });

    try {
      await api.toggleWishlist(listing.id, currentUserId);
    } catch (err) {
      console.warn("[Wishlist] Backend sync error:", err);
    }

    return nextState;
  };

  const removeFromWishlist = async (id: number): Promise<void> => {
    setWishlist((prev) => {
      const next = prev.filter((l) => l.id !== id);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    setWishlistIds((prev) => prev.filter((favId) => favId !== id));

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
