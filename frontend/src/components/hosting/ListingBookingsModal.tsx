"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Users, Edit3, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Listing } from "@/types";
import { api } from "@/lib/api";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";

interface ListingBookingsModalProps {
  isOpen: boolean;
  listing: Listing | null;
  onClose: () => void;
  onModifyBooking: (booking: any) => void;
  hostId: number;
}

export default function ListingBookingsModal({
  isOpen,
  listing,
  onClose,
  onModifyBooking,
  hostId,
}: ListingBookingsModalProps) {
  const { formatPrice } = useLanguageCurrency();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchBookings = async () => {
    if (!listing) return;
    setIsLoading(true);
    try {
      const data = await api.getListingBookings(listing.id, hostId);
      setBookings(data || []);
    } catch (err) {
      console.warn("Failed to fetch bookings for listing:", err);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && listing) {
      fetchBookings();
    }
  }, [isOpen, listing]);

  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#DDDDDD] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EBEBEB] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF385C]" />
              <h2 className="text-lg font-extrabold text-[#222222]">Stay Reservations</h2>
            </div>
            <p className="text-xs text-[#717171] mt-0.5 truncate max-w-md">
              {listing.title} ({listing.city})
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:bg-[#F7F7F7] text-[#222222] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2 text-[#717171]">
              <div className="w-6 h-6 border-2 border-[#222222] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold">Loading reservations...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-14 text-center flex flex-col items-center justify-center space-y-3 bg-[#FAFAFA] rounded-2xl p-6 border border-[#EBEBEB]">
              <div className="w-12 h-12 rounded-full bg-[#FFF0F3] flex items-center justify-center text-[#FF385C]">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#222222]">No bookings yet</h4>
                <p className="text-xs text-[#717171] max-w-xs mt-0.5">
                  When guests reserve dates for this property, their details and dates will appear here for you to manage.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#717171] font-semibold px-1">
                <span>{bookings.length} {bookings.length === 1 ? "Reservation" : "Reservations"} Found</span>
                <span>Click modify to update dates or guests</span>
              </div>

              {bookings.map((b) => {
                const guestName = b.guest?.full_name || `Guest #${b.guest_id}`;
                const checkInStr = new Date(b.check_in).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                const checkOutStr = new Date(b.check_out).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                const isCancelled = b.status === "CANCELLED";

                return (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl border border-[#DDDDDD] bg-white hover:border-[#222222] transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      {b.guest?.avatar_url ? (
                        <img
                          src={b.guest.avatar_url}
                          alt={guestName}
                          className="w-11 h-11 rounded-full object-cover border border-[#DDDDDD]"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-[#F7F7F7] flex items-center justify-center font-bold text-xs text-[#222222] border border-[#DDDDDD]">
                          {guestName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#222222]">{guestName}</h4>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              isCancelled
                                ? "bg-rose-100 text-rose-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#717171] mt-0.5">
                          #{b.confirmation_code} · {b.guests_count} {b.guests_count === 1 ? "guest" : "guests"}
                        </p>
                        <p className="text-xs font-semibold text-[#222222] mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#717171]" />
                          <span>{checkInStr} – {checkOutStr}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#F0F0F0]">
                      <div className="text-left sm:text-right">
                        <span className="text-sm font-extrabold text-[#222222]">
                          {formatPrice(b.total_price)}
                        </span>
                        <p className="text-[10px] text-[#717171]">
                          {b.total_nights} {b.total_nights === 1 ? "night" : "nights"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onModifyBooking(b);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#222222] text-white text-xs font-bold hover:bg-black transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Modify</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EBEBEB] flex items-center justify-end bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#DDDDDD] text-xs font-bold text-[#222222] hover:bg-[#F7F7F7] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
