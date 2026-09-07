"use client";

import React, { useState } from "react";
import { X, Search, MapPin, Calendar, Users, Plus, Minus } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (params: { location?: string; checkIn?: string; checkOut?: string; guests?: number }) => void;
  initialParams?: { location?: string; checkIn?: string; checkOut?: string; guests?: number };
}

const POPULAR_DESTINATIONS = [
  { name: "Paris", country: "France", desc: "Iconic sights & culture" },
  { name: "Bali", country: "Indonesia", desc: "Tropical beaches & villas" },
  { name: "Kyoto", country: "Japan", desc: "Temples & zen gardens" },
  { name: "Amalfi", country: "Italy", desc: "Dramatic cliffs & seaside" },
  { name: "New Delhi", country: "India", desc: "Historic landmarks & heritage" },
  { name: "Swiss Alps", country: "Switzerland", desc: "Mountain peaks & skiing" }
];

export default function SearchModal({ isOpen, onClose, onSearch, initialParams }: SearchModalProps) {
  const [activeTab, setActiveTab] = useState<"where" | "when" | "who">("where");
  const [location, setLocation] = useState(initialParams?.location || "");
  const [checkIn, setCheckIn] = useState(initialParams?.checkIn || "");
  const [checkOut, setCheckOut] = useState(initialParams?.checkOut || "");
  const [adults, setAdults] = useState(initialParams?.guests || 1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  if (!isOpen) return null;

  const totalGuests = adults + children;

  const handleSearch = () => {
    onSearch({
      location: location.trim() || undefined,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      guests: totalGuests > 1 ? totalGuests : undefined
    });
    onClose();
  };

  const handleClear = () => {
    setLocation("");
    setCheckIn("");
    setCheckOut("");
    setAdults(1);
    setChildren(0);
    setInfants(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#DDDDDD] w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header with Close & Tabs */}
        <div className="p-4 border-b border-[#EBEBEB] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F7F7F7] text-[#222222] transition"
              aria-label="Close search modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab("where")}
                className={`text-sm font-semibold pb-1 border-b-2 transition ${
                  activeTab === "where" ? "border-[#222222] text-[#222222]" : "border-transparent text-[#717171]"
                }`}
              >
                Where
              </button>
              <button
                onClick={() => setActiveTab("when")}
                className={`text-sm font-semibold pb-1 border-b-2 transition ${
                  activeTab === "when" ? "border-[#222222] text-[#222222]" : "border-transparent text-[#717171]"
                }`}
              >
                When
              </button>
              <button
                onClick={() => setActiveTab("who")}
                className={`text-sm font-semibold pb-1 border-b-2 transition ${
                  activeTab === "who" ? "border-[#222222] text-[#222222]" : "border-transparent text-[#717171]"
                }`}
              >
                Who
              </button>
            </div>
          </div>

          <button onClick={handleClear} className="text-xs font-semibold text-[#717171] hover:underline px-2">
            Clear all
          </button>
        </div>

        {/* Modal Body Based on Active Tab */}
        <div className="p-6">
          {activeTab === "where" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#717171] mb-2">
                Search by destination
              </label>
              <div className="relative mb-6">
                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-[#717171]" />
                <input
                  type="text"
                  placeholder="Search destinations (e.g. Paris, Bali, Kyoto, New Delhi)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#DDDDDD] focus:border-[#222222] focus:outline-none text-sm font-medium text-[#222222]"
                  autoFocus
                />
              </div>

              <p className="text-xs font-semibold text-[#717171] mb-3">Popular suggestions</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {POPULAR_DESTINATIONS.map((dest) => (
                  <button
                    key={dest.name}
                    onClick={() => {
                      setLocation(dest.name);
                      setActiveTab("when");
                    }}
                    className="p-3 text-left border border-[#DDDDDD] rounded-xl hover:border-[#222222] hover:bg-[#F7F7F7] transition group"
                  >
                    <p className="text-sm font-semibold text-[#222222] group-hover:text-[#FF385C] transition">
                      {dest.name}
                    </p>
                    <p className="text-xs text-[#717171]">{dest.country}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "when" && (
            <div>
              <p className="text-sm font-semibold text-[#222222] mb-4">Choose your dates</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="border border-[#DDDDDD] rounded-xl p-3">
                  <label className="block text-[11px] font-bold uppercase text-[#717171] mb-1">Check in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-sm font-medium text-[#222222] focus:outline-none"
                  />
                </div>
                <div className="border border-[#DDDDDD] rounded-xl p-3">
                  <label className="block text-[11px] font-bold uppercase text-[#717171] mb-1">Check out</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || undefined}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-sm font-medium text-[#222222] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "who" && (
            <div className="space-y-4">
              {/* Adults */}
              <div className="flex items-center justify-between py-2 border-b border-[#EBEBEB]">
                <div>
                  <p className="text-sm font-semibold text-[#222222]">Adults</p>
                  <p className="text-xs text-[#717171]">Ages 13 or above</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                    className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center disabled:opacity-30 hover:border-[#222222] transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{adults}</span>
                  <button
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:border-[#222222] transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between py-2 border-b border-[#EBEBEB]">
                <div>
                  <p className="text-sm font-semibold text-[#222222]">Children</p>
                  <p className="text-xs text-[#717171]">Ages 2–12</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    disabled={children <= 0}
                    className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center disabled:opacity-30 hover:border-[#222222] transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{children}</span>
                  <button
                    onClick={() => setChildren(children + 1)}
                    className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:border-[#222222] transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-semibold text-[#222222]">Infants</p>
                  <p className="text-xs text-[#717171]">Under 2</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setInfants(Math.max(0, infants - 1))}
                    disabled={infants <= 0}
                    className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center disabled:opacity-30 hover:border-[#222222] transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{infants}</span>
                  <button
                    onClick={() => setInfants(infants + 1)}
                    className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:border-[#222222] transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F7F7F7] border-t border-[#EBEBEB] flex items-center justify-between">
          <button
            onClick={() => {
              if (activeTab === "who") setActiveTab("when");
              else if (activeTab === "when") setActiveTab("where");
            }}
            disabled={activeTab === "where"}
            className="text-xs font-semibold text-[#222222] underline disabled:opacity-0"
          >
            Back
          </button>

          <button
            onClick={handleSearch}
            className="airbnb-btn-primary px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold hover:shadow-md"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
