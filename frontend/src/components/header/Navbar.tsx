"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  User,
  Home,
  Luggage,
  Heart,
  HelpCircle,
  Globe,
  Moon,
  Sun,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  ArrowLeftRight,
  Sparkles
} from "lucide-react";
import { useAuthPersona } from "@/context/AuthPersonaContext";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";
import {
  AllGlobeIcon,
  HomesHouseIcon,
  ExperiencesBalloonIcon
} from "./CategoryIcons";
import SearchDeck, { SearchState } from "../search/SearchDeck";

interface NavbarProps {
  activeMode?: "all" | "homes" | "experiences";
  onSelectMode?: (mode: "all" | "homes" | "experiences") => void;
  searchSummary?: {
    location?: string;
    dates?: string;
    guests?: string;
  };
  onSearch?: (params: {
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  }) => void;
}

export default function Navbar({
  activeMode = "all",
  onSelectMode,
  searchSummary,
  onSearch
}: NavbarProps) {
  const router = useRouter();
  const { persona, switchToHosting, switchToTravelling, isHost, openAuthModal, logout } = useAuthPersona();
  const { openLanguageModal, t } = useLanguageCurrency();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchDeckOpen, setIsSearchDeckOpen] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState<"where" | "when" | "who" | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("airbnb_theme");
      if (savedTheme === "dark") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleToggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    try {
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("airbnb_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("airbnb_theme", "light");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleHostRole = () => {
    if (isHost) {
      switchToTravelling();
      router.push("/");
    } else {
      switchToHosting();
      router.push("/hosting");
    }
  };

  const handleOpenSearchTab = (tab: "where" | "when" | "who") => {
    setIsSearchDeckOpen(true);
    setActiveSearchTab(tab);
  };

  const handleCloseSearchDeck = () => {
    setIsSearchDeckOpen(false);
    setActiveSearchTab(null);
  };

  const handleSearchExecute = (searchState: SearchState) => {
    const totalGuests = searchState.adults + searchState.children;
    const loc = searchState.location.trim();

    onSearch?.({
      location: loc || undefined,
      checkIn: searchState.startDate || undefined,
      checkOut: searchState.endDate || undefined,
      guests: totalGuests > 0 ? totalGuests : undefined
    });

    handleCloseSearchDeck();

    const locSlug = loc ? encodeURIComponent(loc.replace(/\s+/g, "-")) : "all";
    const query = new URLSearchParams();
    if (searchState.startDate) query.set("checkin", searchState.startDate);
    if (searchState.endDate) query.set("checkout", searchState.endDate);
    if (totalGuests > 0) query.set("guests", String(totalGuests));

    const queryString = query.toString();
    router.push(`/s/${locSlug}/homes${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#EBEBEB] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {/* Top Row: Symmetrical 3-Column Layout (1fr auto 1fr) for Perfect Center Alignment */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Column 1 (Left): Brand Logo */}
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center group flex-shrink-0" title="Airbnb Clone Home">
            <span className="font-extrabold text-2xl tracking-tight text-[#FF385C]">airbnbclone</span>
          </Link>
        </div>

        {/* Column 2 (Center): The 3 Mode Switchers - Simple Pink Icons */}
        <div className="flex items-center justify-center">
          <nav className="flex items-center gap-4 sm:gap-8 h-full">
            {/* All: Simple Pink Globe */}
            <button
              onClick={() => onSelectMode?.("all")}
              className={`flex items-center gap-2 h-full relative transition-all group py-2 cursor-pointer ${
                activeMode === "all" ? "text-[#FF385C]" : "text-[#717171] hover:text-[#FF385C]"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                activeMode === "all" ? "bg-[#FFF0F3] text-[#FF385C]" : "bg-gray-100 text-[#717171] group-hover:bg-[#FFF0F3] group-hover:text-[#FF385C]"
              }`}>
                <Globe className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <span className={`text-[15px] tracking-tight ${activeMode === "all" ? "font-bold text-[#FF385C]" : "font-semibold text-[#717171]"}`}>
                {t("nav.all", "All")}
              </span>
              {activeMode === "all" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#FF385C] rounded-full" />
              )}
            </button>

            {/* Homes: Simple Pink House */}
            <button
              onClick={() => onSelectMode?.("homes")}
              className={`flex items-center gap-2 h-full relative transition-all group py-2 cursor-pointer ${
                activeMode === "homes" ? "text-[#FF385C]" : "text-[#717171] hover:text-[#FF385C]"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                activeMode === "homes" ? "bg-[#FFF0F3] text-[#FF385C]" : "bg-gray-100 text-[#717171] group-hover:bg-[#FFF0F3] group-hover:text-[#FF385C]"
              }`}>
                <Home className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <span className={`text-[15px] tracking-tight ${activeMode === "homes" ? "font-bold text-[#FF385C]" : "font-semibold text-[#717171]"}`}>
                {t("nav.homes", "Homes")}
              </span>
              {activeMode === "homes" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#FF385C] rounded-full" />
              )}
            </button>

            {/* Experiences: Simple Pink Sparkles */}
            <button
              onClick={() => onSelectMode?.("experiences")}
              className={`flex items-center gap-2 h-full relative transition-all group py-2 cursor-pointer ${
                activeMode === "experiences" ? "text-[#FF385C]" : "text-[#717171] hover:text-[#FF385C]"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                activeMode === "experiences" ? "bg-[#FFF0F3] text-[#FF385C]" : "bg-gray-100 text-[#717171] group-hover:bg-[#FFF0F3] group-hover:text-[#FF385C]"
              }`}>
                <Sparkles className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <span className={`text-[15px] tracking-tight ${activeMode === "experiences" ? "font-bold text-[#FF385C]" : "font-semibold text-[#717171]"}`}>
                {t("nav.experiences", "Experiences")}
              </span>
              {activeMode === "experiences" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#FF385C] rounded-full" />
              )}
            </button>
          </nav>
        </div>

        {/* Column 3 (Right): Role Switcher, Language/Currency, Profile Menu */}
        <div className="flex items-center justify-end gap-2 relative" ref={menuRef}>
          <button
            onClick={handleToggleHostRole}
            className="text-sm font-semibold text-[#222222] hover:bg-[#FFF0F3] hover:text-[#FF385C] px-3.5 py-2 rounded-full transition cursor-pointer whitespace-nowrap hidden sm:inline-block"
          >
            {isHost ? t("nav.switchToTravelling", "Switch to travelling") : t("nav.switchToHosting", "Switch to hosting")}
          </button>

          {/* Simple Pink Globe Icon for Language & Currency */}
          <button
            onClick={openLanguageModal}
            className="p-2.5 rounded-full hover:bg-[#FFF0F3] text-[#FF385C] transition cursor-pointer flex-shrink-0"
            aria-label="Choose a language and currency"
          >
            <Globe className="w-4 h-4 text-[#FF385C]" />
          </button>

          {/* Authentic Airbnb User Menu Capsule Button with Pink Accents */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2.5 border border-[#DDDDDD] hover:border-[#FF385C] hover:shadow-md transition bg-white pl-3.5 pr-2 py-1.5 rounded-full cursor-pointer relative"
            aria-label="Main menu"
          >
            <Menu className="w-4 h-4 text-[#FF385C]" />
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-[#DDDDDD] bg-[#FFF0F3] flex items-center justify-center relative">
              {persona.avatarUrl ? (
                <img src={persona.avatarUrl} alt={persona.fullName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-[#FF385C]" />
              )}
            </div>
            {/* Role indicator badge */}
            <span
              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full hidden sm:inline-block ${
                isHost ? "bg-amber-100 text-amber-800" : "bg-[#FFF0F3] text-[#FF385C]"
              }`}
            >
              {isHost ? "Host" : "Guest"}
            </span>
          </button>

          {/* Exact Dropdown Menu with Complete Lucide Icons */}
          {isMenuOpen && (
            <div className="absolute right-0 top-14 w-80 max-h-[calc(100vh-90px)] overflow-y-auto overscroll-contain bg-white rounded-3xl shadow-[0_6px_28px_rgba(0,0,0,0.16)] border border-[#DDDDDD] py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 menu-scrollbar">
              {/* Profile Card / Role Display */}
              <div className="sticky top-0 z-10 px-5 py-3 border-b border-[#EBEBEB] bg-[#FAFAFA] rounded-t-3xl shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#DDDDDD] bg-white flex-shrink-0">
                    {persona.avatarUrl ? (
                      <img src={persona.avatarUrl} alt={persona.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-[#717171] m-auto mt-2.5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-bold text-sm text-[#222222] truncate">{persona.fullName || "Guest User"}</p>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer flex-shrink-0"
                        title="Sign out immediately"
                      >
                        Sign out
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                          isHost ? "bg-amber-100 text-amber-800" : "bg-[#FFF0F3] text-[#FF385C]"
                        }`}
                      >
                        {isHost ? "Host" : "Guest"}
                      </span>
                      <p className="text-[11px] text-[#717171] truncate">{persona.email || "No email"}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Role Switcher Button */}
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleHostRole();
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-[#222222] hover:bg-black text-white transition cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>{isHost ? "Switch to Guest" : "Switch to Host"}</span>
                  </button>
                </div>
              </div>

              {/* Section 1: User Actions with Authentic Icons */}
              <div className="py-1">
                {isHost && (
                  <Link
                    href="/hosting"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-left px-5 py-2.5 text-sm font-bold text-[#222222] hover:bg-[#F7F7F7] flex items-center gap-3 transition"
                  >
                    <Home className="w-4 h-4 text-amber-600" />
                    <span>Host Dashboard</span>
                  </Link>
                )}

                <Link
                  href="/wishlists"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left px-5 py-2.5 text-sm font-medium text-[#222222] hover:bg-[#F7F7F7] flex items-center gap-3 transition"
                >
                  <Heart className="w-4 h-4 text-[#222222] stroke-[1.8]" />
                  <span>{t("menu.wishlists", "Wishlists")}</span>
                </Link>

                <Link
                  href="/trips"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left px-5 py-2.5 text-sm font-medium text-[#222222] hover:bg-[#F7F7F7] flex items-center gap-3 transition"
                >
                  <Luggage className="w-4 h-4 text-[#222222]" />
                  <span>{t("menu.trips", "Trips")}</span>
                </Link>

                <Link
                  href="/messages"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left px-5 py-2.5 text-sm font-medium text-[#222222] hover:bg-[#F7F7F7] flex items-center gap-3 transition"
                >
                  <MessageSquare className="w-4 h-4 text-[#222222]" />
                  <span>{t("menu.messages", "Messages")}</span>
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left px-5 py-2.5 text-sm font-medium text-[#222222] hover:bg-[#F7F7F7] flex items-center gap-3 transition"
                >
                  <User className="w-4 h-4 text-[#222222]" />
                  <span>{t("menu.profile", "Profile")}</span>
                </Link>
              </div>

              <div className="h-px bg-[#EBEBEB] my-1.5" />

              {/* Section 2: Settings & Support with Authentic Icons */}
              <div className="py-1">
                <Link
                  href="/notifications"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left px-5 py-2.5 text-sm font-medium text-[#222222] hover:bg-[#F7F7F7] flex items-center gap-3 transition"
                >
                  <Bell className="w-4 h-4 text-[#222222]" />
                  <span>{t("menu.notifications", "Notifications")}</span>
                </Link>

                <Link
                  href="/account-settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left px-5 py-2.5 text-sm font-medium text-[#222222] hover:bg-[#F7F7F7] flex items-center gap-3 transition"
                >
                  <Settings className="w-4 h-4 text-[#222222]" />
                  <span>{t("menu.accountSettings", "Account settings")}</span>
                </Link>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    openLanguageModal();
                  }}
                  className="w-full text-left px-5 py-2.5 text-sm font-medium text-[#222222] hover:bg-[#F7F7F7] flex items-center gap-3 transition cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-[#222222]" />
                  <span>{t("menu.languagesAndCurrency", "Languages & currency")}</span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={handleToggleDarkMode}
                  className="w-full text-left px-5 py-2.5 text-sm font-medium text-[#222222] hover:bg-[#F7F7F7] flex items-center justify-between transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {isDarkMode ? (
                      <Sun className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Moon className="w-4 h-4 text-[#222222]" />
                    )}
                    <span>{isDarkMode ? "Light theme" : "Dark mode"}</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EBEBEB] text-[#717171]">
                    {isDarkMode ? "Active" : "Off"}
                  </span>
                </button>

                <Link
                  href="/help"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left px-5 py-2.5 text-sm font-medium text-[#222222] hover:bg-[#F7F7F7] flex items-center gap-3 transition"
                >
                  <HelpCircle className="w-4 h-4 text-[#222222]" />
                  <span>{t("menu.helpCentre", "Help Centre")}</span>
                </Link>
              </div>

              <div className="h-px bg-[#EBEBEB] my-1.5" />

              {/* Section 3: Log out / Sign out */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-5 py-2.5 text-sm font-bold text-[#222222] hover:text-rose-600 hover:bg-rose-50 flex items-center justify-between transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4 text-[#717171] group-hover:text-rose-600" />
                    <span>{t("menu.logOut", "Log out")}</span>
                  </div>
                  <span className="text-xs text-[#717171] font-normal group-hover:text-rose-500">Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Interactive Search Deck matching Screenshots 1, 2, 3 */}
      <SearchDeck
        isOpen={isSearchDeckOpen}
        activeTab={activeSearchTab}
        onOpenTab={handleOpenSearchTab}
        onClose={handleCloseSearchDeck}
        onSearch={handleSearchExecute}
        activeMode={activeMode}
        initialState={{
          location: searchSummary?.location || "",
          startDate: "2026-09-08",
          endDate: "2026-09-09"
        }}
      />
    </header>
  );
}
