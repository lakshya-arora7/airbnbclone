"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Plus, Minus, ChevronLeft, ChevronRight, X, MapPin, Building2, Landmark, Mountain, Trees, Waves, Sparkles } from "lucide-react";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";
import { searchIndianCities, IndianCity } from "@/data/indianCities";

export interface SearchState {
  location: string;
  startDate: string | null; // e.g., '2026-09-08'
  endDate: string | null;   // e.g., '2026-09-09'
  displayDates: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
  flexibility: string;
}

interface SearchDeckProps {
  isOpen: boolean;
  activeTab: "where" | "when" | "who" | null;
  onOpenTab: (tab: "where" | "when" | "who") => void;
  onClose: () => void;
  onSearch: (state: SearchState) => void;
  initialState?: Partial<SearchState>;
  activeMode?: "all" | "homes" | "experiences" | "services";
}

// Destination suggestions from user Screenshot 2
const SUGGESTED_DESTINATIONS = [
  {
    id: "nearby",
    title: "Nearby",
    subtitle: "Find what’s around you",
    badgeBg: "bg-[#F0F9FF] border-[#E0F2FE]",
    iconColor: "text-[#0284C7]",
    icon: (
      <svg className="w-5 h-5 text-[#0284C7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L19 21L12 17L5 21L12 2Z" fill="currentColor" fillOpacity="0.15" />
      </svg>
    ),
    locationValue: "Noida"
  },
  {
    id: "gr-noida",
    title: "Greater Noida, Uttar Pradesh",
    subtitle: "Guests interested in Noida also looked here",
    badgeBg: "bg-[#FFF1F2] border-[#FFE4E6]",
    iconColor: "text-[#E11D48]",
    icon: (
      <svg className="w-5 h-5 text-[#E11D48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 10L12 3L21 10V20C21 20.5 20.5 21 20 21H4C3.5 21 3 20.5 3 20V10Z" />
        <path d="M9 21V12H15V21" />
        <line x1="18" y1="6" x2="20" y2="4" />
      </svg>
    ),
    locationValue: "Greater Noida"
  },
  {
    id: "ghaziabad",
    title: "Ghaziabad, Uttar Pradesh",
    subtitle: "Near you",
    badgeBg: "bg-[#FEFCE8] border-[#FEF08A]",
    iconColor: "text-[#854D0E]",
    icon: (
      <svg className="w-5 h-5 text-[#854D0E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="6" width="10" height="15" rx="1" />
        <path d="M17 10C19 8 20 5 20 5C20 5 17 6 15 8" />
        <path d="M16 13C18 12 21 11 21 11C21 11 18 13 16 15" />
        <line x1="16" y1="8" x2="16" y2="21" />
      </svg>
    ),
    locationValue: "Ghaziabad"
  },
  {
    id: "gurgaon",
    title: "Gurgaon District, Haryana",
    subtitle: "Guests interested in Noida also looked here",
    badgeBg: "bg-[#FEF3C7] border-[#FDE68A]",
    iconColor: "text-[#B45309]",
    icon: (
      <svg className="w-5 h-5 text-[#B45309]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="11" height="17" rx="1" />
        <path d="M17 9C19 7 20 4 20 4C20 4 17 5 15 7" />
        <line x1="16" y1="7" x2="16" y2="21" />
        <rect x="6" y="8" width="2" height="2" fill="currentColor" />
        <rect x="10" y="8" width="2" height="2" fill="currentColor" />
        <rect x="6" y="12" width="2" height="2" fill="currentColor" />
        <rect x="10" y="12" width="2" height="2" fill="currentColor" />
      </svg>
    ),
    locationValue: "Gurgaon"
  },
  {
    id: "delhi",
    title: "New Delhi, Delhi",
    subtitle: "For sights like India Gate & Hauz Khas",
    badgeBg: "bg-[#ECFDF5] border-[#D1FAE5]",
    iconColor: "text-[#059669]",
    icon: (
      <svg className="w-5 h-5 text-[#059669]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 21V9L12 4L20 9V21" />
        <path d="M9 21V13C9 11.5 10.5 10 12 10C13.5 10 15 11.5 15 13V21" />
        <line x1="2" y1="21" x2="22" y2="21" />
      </svg>
    ),
    locationValue: "New Delhi"
  },
  {
    id: "goa",
    title: "Goa, India",
    subtitle: "For sunny beaches, Candolim & private luxury villas",
    badgeBg: "bg-[#FFF7ED] border-[#FFEDD5]",
    iconColor: "text-[#EA580C]",
    icon: (
      <svg className="w-5 h-5 text-[#EA580C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    locationValue: "Goa"
  },
  {
    id: "mumbai",
    title: "Mumbai, Maharashtra",
    subtitle: "For Bandra West sea-facing penthouses & city vibes",
    badgeBg: "bg-[#F5F3FF] border-[#EDE9FE]",
    iconColor: "text-[#7C3AED]",
    icon: (
      <svg className="w-5 h-5 text-[#7C3AED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="9" y1="6" x2="9.01" y2="6" strokeWidth="2.5" />
        <line x1="15" y1="6" x2="15.01" y2="6" strokeWidth="2.5" />
        <line x1="9" y1="10" x2="9.01" y2="10" strokeWidth="2.5" />
        <line x1="15" y1="10" x2="15.01" y2="10" strokeWidth="2.5" />
        <line x1="9" y1="14" x2="9.01" y2="14" strokeWidth="2.5" />
        <line x1="15" y1="14" x2="15.01" y2="14" strokeWidth="2.5" />
      </svg>
    ),
    locationValue: "Mumbai"
  },
  {
    id: "manali",
    title: "Manali, Himachal Pradesh",
    subtitle: "For snowy cedar chalets & mountain valley views",
    badgeBg: "bg-[#EFF6FF] border-[#DBEAFE]",
    iconColor: "text-[#2563EB]",
    icon: (
      <svg className="w-5 h-5 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 3l4 8 5-5 5 15H2L8 3z" />
      </svg>
    ),
    locationValue: "Manali"
  },
  {
    id: "paris",
    title: "Paris, France",
    subtitle: "For Eiffel Tower views & classic Parisian balconies",
    badgeBg: "bg-[#FFF1F2] border-[#FFE4E6]",
    iconColor: "text-[#E11D48]",
    icon: (
      <svg className="w-5 h-5 text-[#E11D48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2v20M7 22l5-18 5 18M9 15h6M6 22h12" />
      </svg>
    ),
    locationValue: "Paris"
  }
];

export default function SearchDeck({
  isOpen,
  activeTab,
  onOpenTab,
  onClose,
  onSearch,
  initialState,
  activeMode = "all"
}: SearchDeckProps) {
  const { t } = useLanguageCurrency();
  const wherePlaceholder = activeMode === "experiences"
    ? "Search by city or landmark"
    : t("search.searchDestinations", "Search destinations");
  const [location, setLocation] = useState(initialState?.location || "");
  const [startDate, setStartDate] = useState<string | null>(initialState?.startDate || "2026-09-08");
  const [endDate, setEndDate] = useState<string | null>(initialState?.endDate || "2026-09-09");
  const [calendarMode, setCalendarMode] = useState<"dates" | "flexible">("dates");
  const [flexibility, setFlexibility] = useState("Exact dates");

  const [adults, setAdults] = useState(initialState?.adults || 0);
  const [children, setChildren] = useState(initialState?.children || 0);
  const [infants, setInfants] = useState(initialState?.infants || 0);
  const [pets, setPets] = useState(initialState?.pets || 0);
  const [selectedServiceType, setSelectedServiceType] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  // Dynamically match Indian cities based on initial letters resembling the place
  const matchedIndianCities = useMemo(() => {
    return searchIndianCities(location, 12);
  }, [location]);

  const getCityIcon = (city: IndianCity) => {
    const t = city.type.toLowerCase();
    if (t.includes("hill") || t.includes("mountain") || t.includes("snow") || t.includes("valley")) {
      return <Mountain className="w-5 h-5 text-sky-600" />;
    }
    if (t.includes("beach") || t.includes("coast") || t.includes("island") || t.includes("sea")) {
      return <Waves className="w-5 h-5 text-teal-600" />;
    }
    if (t.includes("spiritual") || t.includes("heritage") || t.includes("temple") || t.includes("palace") || t.includes("wonder")) {
      return <Landmark className="w-5 h-5 text-amber-600" />;
    }
    if (t.includes("wildlife") || t.includes("forest") || t.includes("nature") || t.includes("tea") || t.includes("garden")) {
      return <Trees className="w-5 h-5 text-emerald-600" />;
    }
    if (t.includes("tech") || t.includes("capital") || t.includes("metropolis") || t.includes("city")) {
      return <Building2 className="w-5 h-5 text-[#FF385C]" />;
    }
    return <MapPin className="w-5 h-5 text-[#FF385C]" />;
  };

  const renderHighlightedCityName = (cityName: string, query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return <span>{cityName}</span>;

    const lower = cityName.toLowerCase();
    const idx = lower.indexOf(q);
    if (idx === -1) return <span>{cityName}</span>;

    return (
      <span>
        {cityName.substring(0, idx)}
        <span className="font-extrabold text-[#FF385C] underline underline-offset-2">
          {cityName.substring(idx, idx + q.length)}
        </span>
        {cityName.substring(idx + q.length)}
      </span>
    );
  };

  // Focus location input when tab becomes 'where'
  useEffect(() => {
    if (activeTab === "where") {
      setTimeout(() => locationInputRef.current?.focus(), 50);
    }
  }, [activeTab]);

  // Handle outside click to close popovers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Compute display dates string
  const getDisplayDates = () => {
    if (startDate && endDate) {
      const sDay = parseInt(startDate.split("-")[2]);
      const eDay = parseInt(endDate.split("-")[2]);
      return `${sDay}–${eDay} Sept`;
    } else if (startDate) {
      return `${parseInt(startDate.split("-")[2])} Sept`;
    }
    return t("search.addDates", "Add dates");
  };

  // Compute guests display string
  const totalGuests = adults + children;
  const getDisplayGuests = () => {
    if (totalGuests > 0) {
      let text = `${totalGuests} guest${totalGuests > 1 ? "s" : ""}`;
      if (infants > 0) text += `, ${infants} infant${infants > 1 ? "s" : ""}`;
      if (pets > 0) text += `, ${pets} pet${pets > 1 ? "s" : ""}`;
      return text;
    }
    return t("search.addGuests", "Add guests");
  };

  const handleExecuteSearch = () => {
    onSearch({
      location: location.trim(),
      startDate,
      endDate,
      displayDates: getDisplayDates(),
      adults,
      children,
      infants,
      pets,
      flexibility
    });
    onClose();
  };

  // Date selection logic
  const handleDateClick = (dateStr: string) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateStr);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (new Date(dateStr) < new Date(startDate)) {
        setStartDate(dateStr);
        setEndDate(null);
      } else {
        setEndDate(dateStr);
        // Automatically smoothly advance to 'who' step
        setTimeout(() => onOpenTab("who"), 150);
      }
    }
  };

  const isDateSelected = (dateStr: string) => dateStr === startDate || dateStr === endDate;
  const isDateInRange = (dateStr: string) => {
    if (!startDate || !endDate) return false;
    return dateStr > startDate && dateStr < endDate;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Background Dim Backdrop when expanded */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/25 backdrop-blur-[0.5px] z-20 transition-opacity duration-300"
        />
      )}

      {/* Interactive Segmented Search Capsule */}
      <div className="flex justify-center w-full px-2 sm:px-4 pb-4 sm:pb-5 pt-1 sm:pt-1.5 relative z-30">
        <div
          className={`flex items-center rounded-full border transition-all duration-300 ease-out ${
            isOpen
              ? "bg-[#EBEBEB] border-[#DDDDDD] shadow-[0_6px_24px_rgba(0,0,0,0.14)] p-1 sm:p-2"
              : "bg-white border-[#DDDDDD] shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] p-1 sm:p-1.5"
          } w-full max-w-2xl sm:max-w-[850px]`}
        >
          {/* Segment 1: Where */}
          <div
            onClick={() => onOpenTab("where")}
            className={`flex-1 px-2.5 sm:px-6 py-1.5 sm:py-3 cursor-pointer transition-all duration-300 rounded-full ${
              activeTab === "where"
                ? "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.14)]"
                : "hover:bg-black/5"
            }`}
          >
            <p className="text-[11px] sm:text-[13px] font-extrabold tracking-wide text-[#222222]">{t("search.where", "Where")}</p>
            {activeTab === "where" ? (
              <div className="flex items-center">
                <input
                  ref={locationInputRef}
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleExecuteSearch();
                    }
                  }}
                  placeholder={wherePlaceholder}
                  className="w-full bg-transparent text-xs sm:text-[15px] font-medium text-[#222222] focus:outline-none placeholder-[#717171] truncate"
                  onClick={(e) => e.stopPropagation()}
                />
                {location && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation("");
                    }}
                    className="p-1 rounded-full hover:bg-[#EBEBEB] text-[#717171]"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            ) : (
              <p className="text-xs sm:text-[15px] font-medium text-[#717171] truncate">
                {location || wherePlaceholder}
              </p>
            )}
          </div>

          <span
            className={`h-6 sm:h-8 w-px transition-opacity duration-200 ${
              activeTab === "where" || activeTab === "when" ? "opacity-0" : "bg-[#DDDDDD]"
            }`}
          />

          {/* Segment 2: When */}
          <div
            onClick={() => onOpenTab("when")}
            className={`flex-1 px-2.5 sm:px-6 py-1.5 sm:py-3 cursor-pointer transition-all duration-300 rounded-full ${
              activeTab === "when"
                ? "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.14)]"
                : "hover:bg-black/5"
            }`}
          >
            <p className="text-[11px] sm:text-[13px] font-extrabold tracking-wide text-[#222222]">{t("search.when", "When")}</p>
            <p className="text-xs sm:text-[15px] font-medium text-[#717171] truncate">
              {getDisplayDates()}
            </p>
          </div>

          <span
            className={`h-6 sm:h-8 w-px transition-opacity duration-200 ${
              activeTab === "when" || activeTab === "who" ? "opacity-0" : "bg-[#DDDDDD]"
            }`}
          />

          {/* Segment 3: Who & Search Button */}
          <div
            onClick={() => onOpenTab("who")}
            className={`flex-1 pl-2.5 sm:pl-6 pr-1 sm:pr-2.5 py-1 sm:py-2 cursor-pointer transition-all duration-300 rounded-full flex items-center justify-between gap-1.5 sm:gap-2.5 ${
              activeTab === "who"
                ? "bg-white shadow-[0_4px_16px_rgba(0,0,0,0.14)]"
                : "hover:bg-black/5"
            }`}
          >
            <div className="truncate min-w-0">
              <p className="text-[11px] sm:text-[13px] font-extrabold tracking-wide text-[#222222]">
                {activeMode === "services" ? "Type of service" : t("search.who", "Who")}
              </p>
              <p className="text-xs sm:text-[15px] font-medium text-[#717171] truncate">
                {activeMode === "services" ? (selectedServiceType || "Add service") : getDisplayGuests()}
              </p>
            </div>

            {/* Action Search Button matching Screenshot 3 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleExecuteSearch();
              }}
              className={`rounded-full bg-[#FF385C] hover:bg-[#E00B41] text-white flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-md ${
                isOpen || activeTab === "who" ? "px-3 sm:px-6 py-2 sm:py-3 gap-1.5 sm:gap-2 text-xs sm:text-[15px]" : "w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0"
              }`}
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.8]" />
              {(isOpen || activeTab === "who") && <span className="pr-0.5 sm:pr-1 font-bold">{t("search.search", "Search")}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* POP OVERS WITH SMOOTH ANIMATION & EXACT SCREENSHOT DESIGNS   */}
      {/* ============================================================ */}
      {isOpen && (
        <div className="absolute top-[80px] left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
          {/* Matched to the exact max-w-2xl / sm:max-w-3xl of the search capsule for pixel alignment */}
          <div className="w-full max-w-2xl sm:max-w-3xl relative pointer-events-auto">
            {/* 1. WHERE POPOVER (Matches Screenshot 2: Aligned to Left Edge of Capsule) */}
            <div
              className={`absolute top-0 left-0 w-[460px] max-w-[calc(100vw-24px)] max-h-[82vh] overflow-y-auto overscroll-contain bg-white rounded-[32px] border border-[#DDDDDD] shadow-[0_12px_36px_rgba(0,0,0,0.16)] p-4 sm:p-6 transition-all duration-300 ease-out origin-top-left menu-scrollbar ${
                activeTab === "where"
                  ? "opacity-100 scale-100 translate-y-0 visible"
                  : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
              }`}
            >
              {/* Dynamic Where Content: Autocomplete across all cities in India */}
              {!location.trim() ? (
                <div className="space-y-5">
                  {/* Recent searches header & card */}
                  <div>
                    <p className="text-xs font-bold text-[#222222] mb-3">Recent searches</p>
                    <div
                      onClick={() => {
                        setLocation("Noida");
                        setStartDate("2026-09-08");
                        setEndDate("2026-09-09");
                        setAdults(4);
                        onOpenTab("when");
                      }}
                      className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-[#F7F7F7] cursor-pointer transition group"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-[#FFF0F3] border border-[#FFE4E8] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Building2 className="w-5 h-5 text-[#FF385C]" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-[#222222]">Noida, Uttar Pradesh</h5>
                        <p className="text-xs text-[#717171] mt-0.5">8–9 Sept · 4 guests</p>
                      </div>
                    </div>
                  </div>

                  {/* Popular destinations in India */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-[#222222]">Popular destinations in India</p>
                      <span className="text-[11px] text-[#717171]">Explore places</span>
                    </div>
                    <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
                      {matchedIndianCities.map((city) => (
                        <div
                          key={city.id}
                          onClick={() => {
                            setLocation(city.name);
                            onOpenTab("when");
                          }}
                          className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-[#F7F7F7] cursor-pointer transition group"
                        >
                          <div className="w-11 h-11 rounded-2xl bg-[#F7F7F7] border border-[#EBEBEB] flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-[#FFF0F3] group-hover:border-[#FFE4E8] transition-all">
                            {getCityIcon(city)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-sm text-[#222222] truncate">
                              {city.name}, {city.state}
                            </h5>
                            <p className="text-xs text-[#717171] mt-0.5 truncate">
                              {city.type} · India
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EBEBEB]">
                    <p className="text-xs font-bold text-[#222222] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF385C]" />
                      <span>Cities in India matching &ldquo;{location}&rdquo;</span>
                    </p>
                    <span className="text-[11px] font-semibold text-[#717171]">
                      {matchedIndianCities.length} {matchedIndianCities.length === 1 ? "city" : "cities"} found
                    </span>
                  </div>

                  <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
                    {matchedIndianCities.length > 0 ? (
                      matchedIndianCities.map((city) => (
                        <div
                          key={city.id}
                          onClick={() => {
                            setLocation(city.name);
                            onOpenTab("when");
                          }}
                          className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-[#F7F7F7] cursor-pointer transition group"
                        >
                          <div className="w-11 h-11 rounded-2xl bg-[#FFF0F3] border border-[#FFE4E8] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            {getCityIcon(city)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-sm text-[#222222] truncate">
                              {renderHighlightedCityName(city.name, location)}, {city.state}
                            </h5>
                            <p className="text-xs text-[#717171] mt-0.5 truncate">
                              {city.type} · India
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        onClick={() => {
                          onOpenTab("when");
                        }}
                        className="p-4 rounded-2xl hover:bg-[#F7F7F7] cursor-pointer transition text-left"
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <MapPin className="w-5 h-5 text-[#FF385C]" />
                          <h5 className="font-bold text-sm text-[#222222]">
                            Search for &ldquo;{location}&rdquo; anywhere in India
                          </h5>
                        </div>
                        <p className="text-xs text-[#717171] pl-8">
                          Browse all available stays and listings in India
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. WHEN POPOVER (Matches Screenshot 1: Centered under Capsule) */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-[820px] max-w-[calc(100vw-24px)] max-h-[82vh] overflow-y-auto overscroll-contain bg-white rounded-[32px] border border-[#DDDDDD] shadow-[0_12px_36px_rgba(0,0,0,0.16)] p-4 sm:p-7 transition-all duration-300 ease-out origin-top menu-scrollbar ${
                activeTab === "when"
                  ? "opacity-100 scale-100 translate-y-0 visible"
                  : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
              }`}
            >
              {/* Top Segmented Toggle: Dates vs Flexible */}
              <div className="flex justify-center mb-6">
                <div className="bg-[#EBEBEB] p-1 rounded-full inline-flex items-center">
                  <button
                    onClick={() => setCalendarMode("dates")}
                    className={`px-7 py-2 rounded-full text-xs font-bold transition-all ${
                      calendarMode === "dates"
                        ? "bg-white text-[#222222] shadow-sm"
                        : "text-[#717171] hover:text-[#222222]"
                    }`}
                  >
                    Dates
                  </button>
                  <button
                    onClick={() => setCalendarMode("flexible")}
                    className={`px-7 py-2 rounded-full text-xs font-bold transition-all ${
                      calendarMode === "flexible"
                        ? "bg-white text-[#222222] shadow-sm"
                        : "text-[#717171] hover:text-[#222222]"
                    }`}
                  >
                    Flexible
                  </button>
                </div>
              </div>

              {/* Dual-Month Calendar Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                {/* Month 1: September 2026 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      className="p-1 rounded-full hover:bg-[#F7F7F7] text-[#222222] transition"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h4 className="font-bold text-sm text-[#222222]">September 2026</h4>
                    <span className="w-6" /> {/* Placeholder for balance */}
                  </div>

                  {/* Day Header S M T W T F S */}
                  <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#717171] mb-2">
                    <span>S</span>
                    <span>M</span>
                    <span>T</span>
                    <span>W</span>
                    <span>T</span>
                    <span>F</span>
                    <span>S</span>
                  </div>

                  {/* September Dates: Starts on Tuesday (index 2) */}
                  <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
                    {/* Blank Sunday, Monday */}
                    <span />
                    <span />

                    {/* Past days (1-5) grayed out matching screenshot */}
                    <span className="py-2.5 text-[#B0B0B0] cursor-not-allowed">1</span>
                    <span className="py-2.5 text-[#B0B0B0] cursor-not-allowed">2</span>
                    <span className="py-2.5 text-[#B0B0B0] cursor-not-allowed">3</span>
                    <span className="py-2.5 text-[#B0B0B0] cursor-not-allowed">4</span>
                    <span className="py-2.5 text-[#B0B0B0] cursor-not-allowed">5</span>

                    {/* Active days (6 to 30) */}
                    {Array.from({ length: 25 }, (_, i) => i + 6).map((day) => {
                      const dayStr = day < 10 ? `0${day}` : `${day}`;
                      const dateKey = `2026-09-${dayStr}`;
                      const isSelected = isDateSelected(dateKey);
                      const inRange = isDateInRange(dateKey);

                      return (
                        <button
                          key={day}
                          onClick={() => handleDateClick(dateKey)}
                          className={`py-2.5 font-semibold relative transition rounded-full hover:border hover:border-[#222222] ${
                            isSelected
                              ? "bg-[#222222] text-white"
                              : inRange
                              ? "bg-[#F7F7F7] text-[#222222]"
                              : "text-[#222222]"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Month 2: October 2026 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-6" /> {/* Placeholder for balance */}
                    <h4 className="font-bold text-sm text-[#222222]">October 2026</h4>
                    <button
                      className="p-1 rounded-full hover:bg-[#F7F7F7] text-[#222222] transition"
                      aria-label="Next month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Day Header S M T W T F S */}
                  <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#717171] mb-2">
                    <span>S</span>
                    <span>M</span>
                    <span>T</span>
                    <span>W</span>
                    <span>T</span>
                    <span>F</span>
                    <span>S</span>
                  </div>

                  {/* October Dates: Starts on Thursday (index 4) */}
                  <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
                    {/* Blank Sunday to Wednesday */}
                    <span />
                    <span />
                    <span />
                    <span />

                    {/* All October Days (1 to 31) */}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                      const dayStr = day < 10 ? `0${day}` : `${day}`;
                      const dateKey = `2026-10-${dayStr}`;
                      const isSelected = isDateSelected(dateKey);
                      const inRange = isDateInRange(dateKey);

                      return (
                        <button
                          key={day}
                          onClick={() => handleDateClick(dateKey)}
                          className={`py-2.5 font-semibold relative transition rounded-full hover:border hover:border-[#222222] ${
                            isSelected
                              ? "bg-[#222222] text-white"
                              : inRange
                              ? "bg-[#F7F7F7] text-[#222222]"
                              : "text-[#222222]"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Tolerance Pills matching Screenshot 1 */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#EBEBEB]">
                {[
                  "Exact dates",
                  "± 1 day",
                  "± 2 days",
                  "± 3 days",
                  "± 7 days",
                  "± 14 days"
                ].map((pill) => (
                  <button
                    key={pill}
                    onClick={() => setFlexibility(pill)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                      flexibility === pill
                        ? "border-[#222222] bg-white text-[#222222] shadow-xs"
                        : "border-[#DDDDDD] bg-white text-[#222222] hover:border-[#222222]"
                    }`}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. WHO / SERVICES POPOVER */}
            <div
              className={`absolute top-0 right-0 w-[420px] max-w-[calc(100vw-24px)] max-h-[82vh] overflow-y-auto overscroll-contain bg-white rounded-[32px] border border-[#DDDDDD] shadow-[0_12px_36px_rgba(0,0,0,0.16)] p-4 sm:p-6 transition-all duration-300 ease-out origin-top-right menu-scrollbar ${
                activeTab === "who"
                  ? "opacity-100 scale-100 translate-y-0 visible"
                  : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
              }`}
            >
              {activeMode === "services" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-3">
                    <h5 className="font-bold text-sm text-[#222222]">Select Type of Service</h5>
                    {selectedServiceType && (
                      <button
                        type="button"
                        onClick={() => setSelectedServiceType("")}
                        className="text-xs font-semibold text-[#717171] underline hover:text-[#222222]"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: "Photography", desc: "Portraits, couples, events & street sessions" },
                      { name: "Chefs", desc: "Private gourmet dining, multi-course meals & live cooking" },
                      { name: "Training", desc: "Personal fitness coaches, yoga & HIIT sessions" },
                      { name: "Make-up", desc: "Glamour, bridal, editorial & evening make-up" },
                      { name: "Hair", desc: "Blowouts, styling, cutting & personalized hair care" },
                    ].map((svc) => (
                      <button
                        key={svc.name}
                        type="button"
                        onClick={() => {
                          setSelectedServiceType(svc.name);
                          onClose();
                        }}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition ${
                          selectedServiceType === svc.name
                            ? "border-[#222222] bg-[#F7F7F7] font-semibold"
                            : "border-[#EBEBEB] hover:border-[#222222] hover:bg-[#F7F7F7]/60"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm text-[#222222]">{svc.name}</div>
                          <div className="text-xs text-[#717171] mt-0.5">{svc.desc}</div>
                        </div>
                        {selectedServiceType === svc.name && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FF385C] flex-shrink-0 ml-3" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                {/* Adults */}
                <div className="flex items-center justify-between pb-5 border-b border-[#EBEBEB]">
                  <div>
                    <h5 className="font-bold text-sm text-[#222222]">Adults</h5>
                    <p className="text-xs text-[#717171] mt-0.5">Ages 13 or above</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setAdults(Math.max(0, adults - 1))}
                      disabled={adults <= 0}
                      className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[#717171] hover:border-[#222222] hover:text-[#222222] disabled:opacity-30 disabled:hover:border-[#DDDDDD] transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{adults}</span>
                    <button
                      onClick={() => setAdults(adults + 1)}
                      className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[#717171] hover:border-[#222222] hover:text-[#222222] transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between pb-5 border-b border-[#EBEBEB]">
                  <div>
                    <h5 className="font-bold text-sm text-[#222222]">Children</h5>
                    <p className="text-xs text-[#717171] mt-0.5">Ages 2–12</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={children <= 0}
                      className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[#717171] hover:border-[#222222] hover:text-[#222222] disabled:opacity-30 disabled:hover:border-[#DDDDDD] transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{children}</span>
                    <button
                      onClick={() => setChildren(children + 1)}
                      className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[#717171] hover:border-[#222222] hover:text-[#222222] transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between pb-5 border-b border-[#EBEBEB]">
                  <div>
                    <h5 className="font-bold text-sm text-[#222222]">Infants</h5>
                    <p className="text-xs text-[#717171] mt-0.5">Under 2</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                      disabled={infants <= 0}
                      className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[#717171] hover:border-[#222222] hover:text-[#222222] disabled:opacity-30 disabled:hover:border-[#DDDDDD] transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{infants}</span>
                    <button
                      onClick={() => setInfants(infants + 1)}
                      className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[#717171] hover:border-[#222222] hover:text-[#222222] transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Pets */}
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-[#222222]">Pets</h5>
                    <span className="text-xs text-[#717171] mt-0.5 block">
                      Service animals stay free of charge
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPets(Math.max(0, pets - 1))}
                      disabled={pets <= 0}
                      className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[#717171] hover:border-[#222222] hover:text-[#222222] disabled:opacity-30 disabled:hover:border-[#DDDDDD] transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{pets}</span>
                    <button
                      onClick={() => setPets(pets + 1)}
                      className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center text-[#717171] hover:border-[#222222] hover:text-[#222222] transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
