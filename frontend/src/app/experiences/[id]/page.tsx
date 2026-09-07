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
  Globe2,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { getCategoryListingById } from "@/data/categoriesData";
import { Listing } from "@/types";
import MockCheckoutModal from "@/components/booking/MockCheckoutModal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ExperienceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const expId = parseInt(resolvedParams.id, 10);
  const { formatPrice, t } = useLanguageCurrency();
  const { isWishlisted, toggleWishlist } = useWishlist();

  // Find experience
  const experience: Listing | undefined = getCategoryListingById(expId);

  // Booking widget state
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-08");
  const [selectedTime, setSelectedTime] = useState<string>(experience?.timeSlot || "11:45 pm");
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isShareCopied, setIsShareCopied] = useState<boolean>(false);

  if (!experience) {
    return notFound();
  }

  const isFavorited = isWishlisted(experience.id);

  const pricePerGuest = experience.pricePerNight || 1500;
  const baseTotal = pricePerGuest * guestsCount;
  const serviceFee = Math.round(baseTotal * 0.14);
  const totalPrice = baseTotal + serviceFee;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setIsShareCopied(true);
      setTimeout(() => setIsShareCopied(false), 3000);
    }
  };

  // Images for the 4-photo collage matching Screenshot 3
  const collageImages = [
    experience.images[0]?.url || "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    experience.images[1]?.url || "https://images.unsplash.com/photo-1599818816942-835c24e6264d?w=800&auto=format&fit=crop&q=80",
    experience.images[2]?.url || "https://images.unsplash.com/photo-1598324789736-4861f89564a0?w=800&auto=format&fit=crop&q=80",
    experience.images[3]?.url || "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80",
  ];

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      {/* Top Navbar */}
      <Navbar activeMode="experiences" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Experience Header: Photo Grid (Left) + Detail & Title (Right) matching Screenshot 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: 4-Photo Collage Matching Screenshot 3 */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 rounded-3xl overflow-hidden shadow-sm">
              {/* Photo 1: Large Left Top (Food tour portrait) */}
              <div className="aspect-[4/3] sm:aspect-square w-full bg-[#EBEBEB] overflow-hidden rounded-2xl">
                <img
                  src={collageImages[0]}
                  alt={experience.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500 cursor-pointer"
                />
              </div>

              {/* Photo 2: Top Right (Illuminated Jama Masjid reflection) */}
              <div className="aspect-[4/3] sm:aspect-square w-full bg-[#EBEBEB] overflow-hidden rounded-2xl">
                <img
                  src={collageImages[1]}
                  alt="Night reflection"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500 cursor-pointer"
                />
              </div>

              {/* Photo 3: Bottom Left (Historic arches at dusk) */}
              <div className="aspect-[4/3] sm:aspect-square w-full bg-[#EBEBEB] overflow-hidden rounded-2xl">
                <img
                  src={collageImages[2]}
                  alt="Historic monument"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500 cursor-pointer"
                />
              </div>

              {/* Photo 4: Bottom Right (Taj Mahal white marble) */}
              <div className="aspect-[4/3] sm:aspect-square w-full bg-[#EBEBEB] overflow-hidden rounded-2xl">
                <img
                  src={collageImages[3]}
                  alt="Heritage landmark"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Title, Subtitle, Host Card, & Floating Action Widget matching Screenshot 3 */}
          <div className="lg:col-span-5 space-y-6">
            {/* Title & Summary */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#222222] tracking-tight leading-tight">
                {experience.title}
              </h1>

              <p className="text-sm text-[#717171] leading-relaxed">
                {experience.description ||
                  "Hear Delhi come alive. A unique sound walk with temples, prayer calls, and markets—designed to help you listen, relax, and experience the city differently."}
              </p>

              {/* Tags & Action Bar */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-[#717171]">
                  {experience.experienceTags || "New Delhi · Wellness · Food Tour"}
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
                    onClick={() => toggleWishlist(experience)}
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

            {/* Host Profile Row matching Screenshot 3 */}
            <div className="flex items-center gap-3.5 py-1">
              <img
                src={experience.experienceHostAvatar || "/images/ravi-avatar.jpg"}
                alt="Host avatar"
                className="w-12 h-12 rounded-full object-cover border border-[#DDDDDD] flex-shrink-0"
              />
              <div>
                <h4 className="font-bold text-sm text-[#222222]">
                  {experience.experienceHostName || "Hosted by Namaste India Tours or Dev"}
                </h4>
                <p className="text-xs text-[#717171] flex items-center gap-1 mt-0.5">
                  <span>{experience.experienceHostRole?.replace(/·.*/, "").trim() || "Heritage Licenced Tour Guide"}</span>
                  <span>·</span>
                  <Star className="w-3 h-3 fill-[#222222] text-[#222222] inline -mt-0.5" />
                  <span>5.0 (138 reviews)</span>
                </p>
              </div>
            </div>

            <hr className="border-[#EBEBEB]" />

            {/* Key Information Checklist matching Screenshot 3 */}
            <div className="space-y-4 text-xs sm:text-sm text-[#222222]">
              {/* Meeting Point */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#222222] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    {experience.meetingPoint || "Patel Chowk Metro Station Gate No 01"}
                  </span>
                  <span className="text-xs text-[#717171]">
                    Convenient central Delhi rendezvous point with easy metro connectivity.
                  </span>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="p-3 bg-[#F7F7F7] rounded-2xl border border-[#EBEBEB] flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-[#222222] block">
                    Free cancellation
                  </span>
                  <span className="text-[11px] text-[#717171]">
                    Up to 1 day before start time
                  </span>
                </div>
                <Calendar className="w-5 h-5 text-[#222222]" />
              </div>

              {/* Duration & Language */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#222222] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    {experience.duration || "Around 1 hr 45 min"}
                  </span>
                  <span className="text-xs text-[#717171]">
                    Hosted in English & Hindi
                  </span>
                </div>
              </div>

              {/* What's included */}
              <div className="p-4 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-2">
                <h5 className="font-bold text-xs text-[#222222] flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-[#FF385C]" />
                  What is included in this experience:
                </h5>
                <ul className="grid grid-cols-1 gap-1.5 text-xs text-[#717171]">
                  {(experience.includedItems || [
                    "Tastings at 7 legendary street stalls",
                    "Clay-pot Masala Chai & Jalebi tasting",
                    "Bottled mineral water",
                    "Certified heritage storytelling guide",
                  ]).map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 text-[#222222]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reservation Sticky Box matching Screenshot 3 */}
            <div className="bg-white rounded-3xl p-5 border border-[#DDDDDD] shadow-lg space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#717171]">From </span>
                  <span className="text-2xl font-extrabold text-[#222222] underline decoration-2">
                    {formatPrice(pricePerGuest)}
                  </span>
                  <span className="text-xs text-[#717171]"> / guest</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#222222]">
                  <Star className="w-3.5 h-3.5 fill-[#222222]" />
                  <span>5.0</span>
                  <span className="text-[#717171] font-normal">({experience.reviewCount || 138})</span>
                </div>
              </div>

              {/* Interactive Date & Time Pickers */}
              <div className="grid grid-cols-2 gap-2 border border-[#B0B0B0] rounded-2xl p-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#717171]">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full text-xs font-semibold text-[#222222] bg-transparent focus:outline-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#717171]">Time Slot</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full text-xs font-semibold text-[#222222] bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="11:45 pm">11:45 pm (Night Walk)</option>
                    <option value="6:00 pm">6:00 pm (Sunset Walk)</option>
                    <option value="8:00 pm">8:00 pm (Dinner Walk)</option>
                    <option value="10:00 am">10:00 am (Morning Market)</option>
                  </select>
                </div>
              </div>

              {/* Guest Count Stepper */}
              <div className="flex items-center justify-between p-2.5 bg-[#F7F7F7] rounded-xl border border-[#EBEBEB]">
                <div>
                  <span className="text-xs font-bold text-[#222222]">Guests</span>
                  <span className="text-[11px] text-[#717171] block">Ages 12+ welcome</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={guestsCount <= 1}
                    onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                    className="w-7 h-7 rounded-full border border-[#B0B0B0] flex items-center justify-center text-xs font-bold hover:border-[#222222] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-bold text-xs min-w-[16px] text-center">{guestsCount}</span>
                  <button
                    disabled={guestsCount >= (experience.maxGuests || 10)}
                    onClick={() => setGuestsCount(Math.min(experience.maxGuests || 10, guestsCount + 1))}
                    className="w-7 h-7 rounded-full border border-[#B0B0B0] flex items-center justify-center text-xs font-bold hover:border-[#222222] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Button: "Show dates" / "Reserve" */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3.5 bg-[#E00B41] hover:bg-[#D70438] text-white font-extrabold rounded-2xl text-sm shadow-md transition cursor-pointer active:scale-98"
              >
                Show dates & Reserve
              </button>

              <p className="text-center text-[11px] text-[#717171]">
                You won’t be charged yet · Free cancellation up to 24 hours prior
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Mock Checkout Modal for Experience */}
      <MockCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        listing={experience}
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
