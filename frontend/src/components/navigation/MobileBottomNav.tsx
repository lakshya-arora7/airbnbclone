"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, Luggage, MessageSquare, User } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useAuthPersona } from "@/context/AuthPersonaContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { wishlist } = useWishlist();
  const { persona, openAuthModal, isHost } = useAuthPersona();

  // If currently in host mode or host route, the host dashboard has its own top tabs
  const isHostingRoute = pathname?.startsWith("/hosting");

  const wishlistsCount = wishlist?.length || 0;

  const navItems = [
    {
      id: "explore",
      label: "Explore",
      href: "/",
      icon: Compass,
      isActive: pathname === "/" || pathname?.startsWith("/s/"),
    },
    {
      id: "wishlists",
      label: "Wishlists",
      href: "/wishlists",
      icon: Heart,
      badge: wishlistsCount > 0 ? wishlistsCount : undefined,
      isActive: pathname === "/wishlists",
    },
    {
      id: "trips",
      label: "Trips",
      href: "/trips",
      icon: Luggage,
      isActive: pathname === "/trips",
    },
    {
      id: "messages",
      label: "Messages",
      href: "/messages",
      icon: MessageSquare,
      isActive: pathname === "/messages",
    },
    {
      id: "profile",
      label: persona.fullName ? "Profile" : "Log in",
      href: "/profile",
      icon: User,
      avatarUrl: persona.avatarUrl,
      isActive: pathname === "/profile" || pathname === "/account-settings",
    },
  ];

  if (isHostingRoute) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile Navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EBEBEB] h-16 px-2 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)] select-none"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.isActive;

        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
              active ? "text-[#FF385C]" : "text-[#717171] hover:text-[#222222]"
            }`}
          >
            <div className="relative flex items-center justify-center">
              {item.avatarUrl && active ? (
                <img
                  src={item.avatarUrl}
                  alt={item.label}
                  className="w-6 h-6 rounded-full object-cover border border-[#FF385C]"
                />
              ) : (
                <Icon
                  className={`w-6 h-6 transition-transform duration-200 ${
                    active ? "scale-105 stroke-[2.4]" : "stroke-[1.8]"
                  }`}
                />
              )}

              {/* Badge for Wishlists or unread indicators */}
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-2 bg-[#FF385C] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center border-2 border-white">
                  {item.badge}
                </span>
              )}
            </div>

            <span
              className={`text-[10px] tracking-tight mt-1 transition-all ${
                active ? "font-bold text-[#FF385C]" : "font-medium text-[#717171]"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
