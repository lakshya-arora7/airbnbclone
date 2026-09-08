"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/header/Navbar";
import {
  Star,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Users,
  Utensils,
  Car,
} from "lucide-react";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { getCategoryListingById, SERVICES_LISTINGS } from "@/data/categoriesData";
import { Listing } from "@/types";
import MockCheckoutModal from "@/components/booking/MockCheckoutModal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const srvId = parseInt(resolvedParams.id, 10);
  const { formatPrice } = useLanguageCurrency();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const service: Listing | undefined =
    getCategoryListingById(srvId) ||
    SERVICES_LISTINGS.find((s) => s.id === srvId) ||
    SERVICES_LISTINGS[0];

  // Service Booking state
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-08");
  const [selectedSlot, setSelectedSlot] = useState<string>("Lunch (1:00 PM)");
  const [guestsCount, setGuestsCount] = useState<number>(4);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isShareCopied, setIsShareCopied] = useState<boolean>(false);

  if (!service) {
    return notFound();
  }

  const isFavorited = isWishlisted(service.id);

  const pricePerUnit = service.pricePerNight || 2400;
  const baseTotal = pricePerUnit;
  const serviceFee = Math.round(baseTotal * 0.14);
  const totalPrice = baseTotal + serviceFee;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setIsShareCopied(true);
      setTimeout(() => setIsShareCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      {/* Top Navbar */}
      <Navbar activeMode="services" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Collage */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl overflow-hidden shadow-sm aspect-16/10 bg-[#EBEBEB]">
              <img
                src={service.images[0]?.url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"}
                alt={service.title}
                className="w-full h-full object-cover hover:scale-105 transition duration-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column: Service Details & Booking */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#008489] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                bnbair Services
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight leading-tight">
                {service.title}
              </h1>
              <p className="text-sm text-[#717171] leading-relaxed">
                {service.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-[#717171]">
                  {service.experienceTags || "Delhi NCR · On-Demand Hospitality Service"}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#222222] hover:underline cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{isShareCopied ? "Link copied!" : "Share"}</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(service)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#222222] hover:underline cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFavorited ? "fill-[#FF385C] stroke-[#FF385C]" : "stroke-[#222222]"
                      }`}
                    />
                    <span>{isFavorited ? "Saved" : "Save"}</span>
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-[#EBEBEB]" />

            {/* Provider Card */}
            <div className="flex items-center gap-3.5 py-1">
              <div className="w-12 h-12 rounded-full bg-[#222222] text-white flex items-center justify-center font-bold text-lg">
                {service.experienceHostName ? service.experienceHostName[0] : "S"}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#222222]">
                  {service.experienceHostName || "Prime Hospitality Partner"}
                </h4>
                <p className="text-xs text-[#717171] flex items-center gap-1 mt-0.5">
                  <span>{service.experienceHostRole?.replace(/·.*/, "").trim() || "Verified Airbnb Service Professional"}</span>
                  <span>·</span>
                  <Star className="w-3 h-3 fill-[#222222] text-[#222222] inline -mt-0.5" />
                  <span>4.98</span>
                </p>
              </div>
            </div>

            <hr className="border-[#EBEBEB]" />

            {/* Service Highlights */}
            <div className="space-y-3.5 text-xs sm:text-sm text-[#222222]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#222222] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Direct At Your Booked Stay</span>
                  <span className="text-xs text-[#717171]">
                    Professional service team arrives directly at your accommodation.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#222222] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    Duration: {service.duration || "Bespoke schedule"}
                  </span>
                  <span className="text-xs text-[#717171]">Prompt, verified timing</span>
                </div>
              </div>

              {/* What is included */}
              <div className="p-4 bg-[#F7F7F7] rounded-2xl border border-[#EBEBEB] space-y-2">
                <h5 className="font-bold text-xs text-[#222222] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#008489]" />
                  What is included in this service:
                </h5>
                <ul className="space-y-1 text-xs text-[#717171]">
                  {(service.includedItems || [
                    "All required professional equipment",
                    "Certified & background-verified professionals",
                    "Complete service cleanup & satisfaction guarantee",
                  ]).map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[#222222]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reservation Widget */}
            <div className="bg-white rounded-3xl p-5 border border-[#DDDDDD] shadow-lg space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#717171]">Service rate: </span>
                  <span className="text-2xl font-extrabold text-[#222222]">
                    {formatPrice(pricePerUnit)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#222222]">
                  <Star className="w-3.5 h-3.5 fill-[#222222]" />
                  <span>{service.rating.toFixed(2)}</span>
                  <span className="text-[#717171] font-normal">({service.reviewCount})</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border border-[#B0B0B0] rounded-2xl p-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#717171]">Service Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full text-xs font-semibold text-[#222222] bg-transparent focus:outline-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#717171]">Time / Window</label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full text-xs font-semibold text-[#222222] bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="Morning (9:00 AM)">Morning (9:00 AM)</option>
                    <option value="Lunch (1:00 PM)">Lunch (1:00 PM)</option>
                    <option value="Evening (5:00 PM)">Evening (5:00 PM)</option>
                    <option value="Dinner (8:00 PM)">Dinner (8:00 PM)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3.5 bg-[#FF385C] hover:bg-[#E00B41] text-white font-extrabold rounded-2xl text-sm shadow-md transition cursor-pointer active:scale-98"
              >
                Book this Service
              </button>

              <p className="text-center text-[11px] text-[#717171]">
                Free cancellation up to 24 hours prior to scheduled start
              </p>
            </div>
          </div>
        </div>
      </main>

      <MockCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        listing={service}
        checkIn={selectedDate}
        checkOut={selectedDate}
        guestsCount={guestsCount}
        totalNights={1}
        nightlyTotal={baseTotal}
        cleaningFee={0}
        serviceFee={serviceFee}
        totalPrice={totalPrice}
      />
    </div>
  );
}
