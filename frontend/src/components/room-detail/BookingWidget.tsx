"use client";

import React, { useState, useMemo } from "react";
import { Star, ChevronDown, Plus, Minus, Sparkles } from "lucide-react";
import { Listing } from "@/types";
import MockCheckoutModal from "@/components/booking/MockCheckoutModal";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";

interface BookingWidgetProps {
  listing: Listing;
  blockedDateRanges?: { checkIn: string; checkOut: string }[];
}

export default function BookingWidget({ listing, blockedDateRanges = [] }: BookingWidgetProps) {
  const { formatPrice, t } = useLanguageCurrency();

  // Default check-in: 3 days from now, checkout: 7 days from now (4 nights)
  const today = new Date();
  const defaultIn = new Date(today);
  defaultIn.setDate(today.getDate() + 3);
  const defaultOut = new Date(today);
  defaultOut.setDate(today.getDate() + 7);

  const formatDateString = (d: Date) => d.toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState<string>(formatDateString(defaultIn));
  const [checkOut, setCheckOut] = useState<string>(formatDateString(defaultOut));
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Smart date adjustments to guarantee valid positive range
  const handleCheckInChange = (newIn: string) => {
    setCheckIn(newIn);
    const inD = new Date(newIn);
    const outD = new Date(checkOut);
    if (outD <= inD) {
      const nextOut = new Date(inD);
      nextOut.setDate(nextOut.getDate() + 1);
      setCheckOut(formatDateString(nextOut));
    }
  };

  const handleCheckOutChange = (newOut: string) => {
    setCheckOut(newOut);
    const inD = new Date(checkIn);
    const outD = new Date(newOut);
    if (outD <= inD) {
      const prevIn = new Date(outD);
      prevIn.setDate(prevIn.getDate() - 1);
      setCheckIn(formatDateString(prevIn));
    }
  };

  const handleAdjustNights = (delta: number) => {
    const currentOut = new Date(checkOut);
    currentOut.setDate(currentOut.getDate() + delta);
    const inD = new Date(checkIn);
    if (currentOut > inD) {
      setCheckOut(formatDateString(currentOut));
    }
  };

  // Accurate Nights calculation
  const totalNights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [checkIn, checkOut]);

  // Dynamic pricing math reflecting BOTH nights AND guests count:
  // Base nightly rate covers up to 2 guests.
  // Each additional guest above 2 adds a 15% extra guest fee per night.
  const extraGuests = Math.max(0, guestsCount - 2);
  const extraGuestFeePerNight = extraGuests * Math.round(listing.pricePerNight * 0.15);
  const baseNightlyTotal = listing.pricePerNight * totalNights;
  const totalExtraGuestFee = extraGuestFeePerNight * totalNights;
  const nightlyTotal = baseNightlyTotal + totalExtraGuestFee;
  const cleaningFee = listing.cleaningFee;
  const serviceFee = Math.round(nightlyTotal * 0.14);
  const totalPrice = nightlyTotal + cleaningFee + serviceFee;

  const handleReserveClick = () => {
    // Check if dates conflict with any existing blocked ranges
    const reqStart = new Date(checkIn);
    const reqEnd = new Date(checkOut);

    const hasConflict = blockedDateRanges.some((range) => {
      const bookedStart = new Date(range.checkIn);
      const bookedEnd = new Date(range.checkOut);
      return reqStart < bookedEnd && reqEnd > bookedStart;
    });

    if (hasConflict) {
      setErrorMessage("The selected dates are already booked. Please pick different dates.");
      return;
    }

    setErrorMessage(null);
    setIsCheckoutModalOpen(true);
  };

  return (
    <>
      <div className="sticky top-28 bg-white rounded-3xl p-6 border border-[#DDDDDD] shadow-xl w-full">
        {/* Header: Price & Rating */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-[#222222]">
              {formatPrice(listing.pricePerNight)}
            </span>
            <span className="text-sm text-[#717171]"> {t("listing.night", "night")}</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-[#222222]">
            <Star className="w-3.5 h-3.5 fill-[#222222]" />
            <span>{listing.rating.toFixed(2)}</span>
            <span className="text-[#717171] font-normal">({listing.reviewCount})</span>
          </div>
        </div>

        {/* Date / Guest Segmented Box */}
        <div className="border border-[#B0B0B0] rounded-2xl overflow-hidden mb-3">
          {/* Top row: Checkin & Checkout */}
          <div className="grid grid-cols-2 divide-x divide-[#B0B0B0] border-b border-[#B0B0B0]">
            <div className="p-2.5">
              <label className="block text-[10px] font-bold uppercase text-[#222222]">Check-in</label>
              <input
                type="date"
                value={checkIn}
                min={formatDateString(today)}
                onChange={(e) => handleCheckInChange(e.target.value)}
                className="w-full text-xs font-semibold text-[#222222] focus:outline-none bg-transparent cursor-pointer"
              />
            </div>
            <div className="p-2.5">
              <label className="block text-[10px] font-bold uppercase text-[#222222]">Checkout</label>
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => handleCheckOutChange(e.target.value)}
                className="w-full text-xs font-semibold text-[#222222] focus:outline-none bg-transparent cursor-pointer"
              />
            </div>
          </div>

          {/* Bottom row: Guests with direct Stepper controls */}
          <div className="p-2.5 flex items-center justify-between bg-white">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase text-[#222222]">Guests</label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full text-xs font-semibold text-[#222222] focus:outline-none bg-transparent cursor-pointer"
              >
                {Array.from({ length: listing.maxGuests || 4 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "guest" : "guests"} {num > 2 ? "(+extra guest fee)" : ""}
                  </option>
                ))}
              </select>
            </div>
            {/* Quick Guest Stepper */}
            <div className="flex items-center gap-2 pl-2">
              <button
                type="button"
                disabled={guestsCount <= 1}
                onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                className="w-6 h-6 rounded-full border border-[#B0B0B0] flex items-center justify-center text-xs font-bold hover:border-[#222222] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="Decrease guests"
              >
                -
              </button>
              <span className="text-xs font-bold text-[#222222] min-w-[14px] text-center">{guestsCount}</span>
              <button
                type="button"
                disabled={guestsCount >= (listing.maxGuests || 4)}
                onClick={() => setGuestsCount(Math.min(listing.maxGuests || 4, guestsCount + 1))}
                className="w-6 h-6 rounded-full border border-[#B0B0B0] flex items-center justify-center text-xs font-bold hover:border-[#222222] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="Increase guests"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Quick Night Adjuster Pills */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xs text-[#717171] font-medium">Quick adjust nights:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={totalNights <= 1}
              onClick={() => handleAdjustNights(-1)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-[#F7F7F7] hover:bg-[#EBEBEB] border border-[#DDDDDD] rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              -1 night
            </button>
            <button
              type="button"
              onClick={() => handleAdjustNights(1)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-[#F7F7F7] hover:bg-[#EBEBEB] border border-[#DDDDDD] rounded-lg transition cursor-pointer"
            >
              +1 night
            </button>
          </div>
        </div>

        {/* Conflict Error Message */}
        {errorMessage && (
          <div className="mb-3 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 animate-in fade-in duration-150">
            {errorMessage}
          </div>
        )}

        {/* Reserve Button */}
        <button
          onClick={handleReserveClick}
          className="w-full airbnb-btn-primary py-3.5 rounded-xl text-base font-semibold transition hover:shadow-md active:scale-98 cursor-pointer"
        >
          {t("booking.reserve", "Reserve")}
        </button>
        <p className="text-center text-xs text-[#717171] mt-2.5">{t("booking.youWontBeCharged", "You won’t be charged yet")}</p>

        {/* Dynamic Cost Breakdown */}
        <div className="mt-4 space-y-2.5 text-sm text-[#717171] pt-4 border-t border-[#EBEBEB]">
          {/* Live Indicator */}
          <div className="flex items-center justify-between text-[11px] text-[#222222] bg-[#F7F7F7] px-3 py-1.5 rounded-xl border border-[#EBEBEB] mb-2 font-medium">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF385C]" /> Auto-calculated bill:
            </span>
            <span>{totalNights} {totalNights === 1 ? "night" : "nights"} · {guestsCount} {guestsCount === 1 ? "guest" : "guests"}</span>
          </div>

          <div className="flex justify-between text-xs sm:text-sm">
            <span className="underline">
              {formatPrice(listing.pricePerNight)} × {totalNights} {totalNights === 1 ? "night" : "nights"}
            </span>
            <span className="text-[#222222] font-medium">{formatPrice(baseNightlyTotal)}</span>
          </div>

          {extraGuests > 0 && (
            <div className="flex justify-between text-xs sm:text-sm text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <span className="underline">
                Extra guest fee ({extraGuests} guest{extraGuests > 1 ? "s" : ""} × {formatPrice(Math.round(listing.pricePerNight * 0.15))} × {totalNights}n)
              </span>
              <span className="font-semibold">+{formatPrice(totalExtraGuestFee)}</span>
            </div>
          )}

          <div className="flex justify-between text-xs sm:text-sm">
            <span className="underline">Cleaning fee</span>
            <span className="text-[#222222] font-medium">{formatPrice(cleaningFee)}</span>
          </div>

          <div className="flex justify-between text-xs sm:text-sm">
            <span className="underline">Airbnb service fee (14%)</span>
            <span className="text-[#222222] font-medium">{formatPrice(serviceFee)}</span>
          </div>

          <div className="flex items-baseline justify-between font-bold text-base text-[#222222] pt-3 border-t border-[#EBEBEB]">
            <span>Total before taxes</span>
            <span className="text-xl font-extrabold text-[#222222] tracking-tight">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Mock Checkout Modal with 15-Minute Date Hold */}
      <MockCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        listing={listing}
        checkIn={checkIn}
        checkOut={checkOut}
        guestsCount={guestsCount}
        totalNights={totalNights}
        nightlyTotal={nightlyTotal}
        cleaningFee={cleaningFee}
        serviceFee={serviceFee}
        totalPrice={totalPrice}
      />
    </>
  );
}
