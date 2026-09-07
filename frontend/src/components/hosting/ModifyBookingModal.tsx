"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Calendar, Users, DollarSign, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";

interface ModifyBookingModalProps {
  isOpen: boolean;
  booking: any | null;
  onClose: () => void;
  onSuccess: (updated: any) => void;
  userId?: number;
}

export default function ModifyBookingModal({
  isOpen,
  booking,
  onClose,
  onSuccess,
  userId = 1,
}: ModifyBookingModalProps) {
  const { formatPrice } = useLanguageCurrency();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [status, setStatus] = useState<string>("CONFIRMED");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (booking) {
      setCheckIn(booking.check_in || booking.checkIn || "");
      setCheckOut(booking.check_out || booking.checkOut || "");
      setGuestsCount(booking.guests_count || booking.guestsCount || 1);
      setStatus(booking.status || "CONFIRMED");
      setErrorMsg(null);
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  // Calculate nights
  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : booking.total_nights || 1;

  const nightlyRate = booking.nightly_rate || booking.nightlyRate || 7400;
  const cleaningFee = booking.cleaning_fee || booking.cleaningFee || 350;
  const estimatedTotal = (nightlyRate * nights) + cleaningFee + Math.round((nightlyRate * nights) * 0.14);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setErrorMsg("Please select both check-in and check-out dates.");
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setErrorMsg("Check-out date must be after check-in date.");
      return;
    }
    if (guestsCount < 1) {
      setErrorMsg("At least 1 guest is required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await api.updateBooking(booking.id, {
        checkIn,
        checkOut,
        guestsCount,
        status,
      }, userId);

      if (res.success && res.data) {
        onSuccess(res.data);
        onClose();
      } else {
        setErrorMsg(res.error || "Failed to update reservation.");
      }
    } catch (err) {
      setErrorMsg("An error occurred while updating the booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#DDDDDD] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EBEBEB] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF385C]" />
              <h2 className="text-lg font-extrabold text-[#222222]">Modify Booking</h2>
            </div>
            <p className="text-xs text-[#717171] mt-0.5 font-mono">
              Confirmation Code: #{booking.confirmation_code || booking.confirmationCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:bg-[#F7F7F7] text-[#222222] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          {/* Stay Info Card */}
          <div className="p-3.5 bg-[#F7F7F7] rounded-2xl border border-[#EBEBEB] flex items-center gap-3">
            {booking.listing?.image_url && (
              <img
                src={booking.listing.image_url}
                alt="Stay"
                className="w-12 h-12 rounded-xl object-cover border border-[#DDDDDD]"
              />
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-[#222222] truncate">
                {booking.listing?.title || "Property Stay"}
              </h4>
              <p className="text-[11px] text-[#717171]">
                Guest: {booking.guest?.full_name || "Guest"}
              </p>
            </div>
          </div>

          {/* Date Picker Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#222222] mb-1">Check-in Date</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#DDDDDD] text-xs font-semibold text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222222]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#222222] mb-1">Check-out Date</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#DDDDDD] text-xs font-semibold text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222222]"
                required
              />
            </div>
          </div>

          {/* Guests Count & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#222222] mb-1">Number of Guests</label>
              <input
                type="number"
                min="1"
                max="16"
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDDDDD] text-sm font-semibold text-[#222222]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#222222] mb-1">Reservation Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDDDDD] text-xs font-bold text-[#222222] bg-white"
              >
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          {/* Pricing & Nights Calculation Summary */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-emerald-900">
              <span>Duration:</span>
              <span className="font-bold">{nights} nights</span>
            </div>
            <div className="flex items-center justify-between text-emerald-900">
              <span>Nightly Rate:</span>
              <span>{formatPrice(nightlyRate)} / night</span>
            </div>
            <div className="flex items-center justify-between text-emerald-950 font-extrabold pt-1 border-t border-emerald-200 text-sm">
              <span>Updated Total Payout:</span>
              <span>{formatPrice(estimatedTotal)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#EBEBEB] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#DDDDDD] text-xs font-bold text-[#222222] hover:bg-[#F7F7F7] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
