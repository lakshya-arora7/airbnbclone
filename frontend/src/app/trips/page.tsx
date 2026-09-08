"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/header/Navbar";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import { useAuthPersona } from "@/context/AuthPersonaContext";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";
import {
  Calendar,
  MapPin,
  CheckCircle,
  Star,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  X,
  Clock,
  HelpCircle,
  ArrowRight,
  Info,
} from "lucide-react";
import { api } from "@/lib/api";
import ReviewModal from "@/components/reviews/ReviewModal";

// Dynamically import Leaflet World Map with SSR disabled
const TripsWorldMap = dynamic(() => import("@/components/map/TripsWorldMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] lg:min-h-[640px] bg-[#E5E3DF] rounded-3xl flex items-center justify-center text-sm font-semibold text-[#717171] animate-pulse">
      Loading interactive map...
    </div>
  ),
});

interface TripRecord {
  id: number;
  confirmationCode: string;
  listingId: number;
  listingTitle: string;
  listingImage?: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalPrice: number;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | string;
  createdAt: string;
}

/**
 * Calculate cancellation eligibility based on the 24-hour cutoff rule.
 * Standard check-in is assumed at 3:00 PM (15:00) on the check-in date.
 */
function getCancellationInfo(checkInStr: string) {
  if (!checkInStr) {
    return { isEligible: false, hoursRemaining: 0, isPast: true };
  }

  const parts = checkInStr.split("-");
  let checkInDate: Date;
  if (parts.length === 3) {
    checkInDate = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2]),
      15,
      0,
      0
    );
  } else {
    checkInDate = new Date(checkInStr);
  }

  const now = new Date();
  const diffMs = checkInDate.getTime() - now.getTime();
  const hoursRemaining = diffMs / (1000 * 60 * 60);

  return {
    isEligible: hoursRemaining >= 24,
    hoursRemaining: Math.max(0, Math.round(hoursRemaining)),
    isPast: hoursRemaining <= 0,
  };
}

export default function MyTripsPage() {
  const { persona } = useAuthPersona();
  const { formatPrice, t } = useLanguageCurrency();

  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [reviewingTrip, setReviewingTrip] = useState<TripRecord | null>(null);
  const [userReviews, setUserReviews] = useState<Record<number, any>>({});

  // Cancellation State
  const [cancellingTrip, setCancellingTrip] = useState<TripRecord | null>(null);
  const [policyTrip, setPolicyTrip] = useState<TripRecord | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [cancelToast, setCancelToast] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const loadUserReviews = async () => {
    try {
      const reviewsMap: Record<number, any> = {};

      // 1. Fetch live user reviews from backend
      const liveReviews = await api.getUserReviews(persona.id || 1);
      if (Array.isArray(liveReviews)) {
        liveReviews.forEach((rev: any) => {
          const lid = rev.listing_id || rev.listingId;
          if (lid) {
            reviewsMap[lid] = {
              id: rev.id,
              listingId: lid,
              rating: rev.rating,
              comment: rev.comment,
              cleanliness: rev.cleanliness_rating,
              accuracy: rev.accuracy_rating,
              checkin: rev.checkin_rating,
              communication: rev.communication_rating,
              location: rev.location_rating,
              value: rev.value_rating,
              created_at: rev.created_at,
              authorName: rev.author?.full_name || persona.fullName || "Lakshya Arora",
            };
          }
        });
      }

      // 2. Merge local reviews from localStorage
      try {
        const stored = JSON.parse(localStorage.getItem("airbnb_user_reviews") || "{}");
        Object.keys(stored).forEach((lidStr) => {
          const lid = Number(lidStr);
          if (stored[lid]) {
            reviewsMap[lid] = {
              ...reviewsMap[lid],
              ...stored[lid],
            };
          }
        });
      } catch (e) {
        console.error("Local reviews load error:", e);
      }

      setUserReviews(reviewsMap);
    } catch (err) {
      console.warn("Unable to load user reviews:", err);
    }
  };

  const fetchTrips = () => {
    api.getMyTrips(persona.id || 1).then((liveTrips) => {
      setTrips(liveTrips || []);
    });
  };

  useEffect(() => {
    fetchTrips();
    loadUserReviews();
  }, [persona.id]);

  // Handle Confirmed Cancellation with Refund
  const handleConfirmCancellation = async () => {
    if (!cancellingTrip) return;
    setIsCancelling(true);
    setCancelError(null);

    const res = await api.cancelBooking(cancellingTrip.id, persona.id || 1);
    setIsCancelling(false);

    if (res.success) {
      // Update local state immediately
      setTrips((prev) =>
        prev.map((t) =>
          t.id === cancellingTrip.id ? { ...t, status: "CANCELLED" } : t
        )
      );

      const code = cancellingTrip.confirmationCode;
      const amount = formatPrice(cancellingTrip.totalPrice);
      setCancelToast(
        `Reservation #${code} has been successfully cancelled. A full refund of ${amount} has been initiated to your original payment method.`
      );
      setCancellingTrip(null);

      // Trigger cross-tab/component update
      window.dispatchEvent(new CustomEvent("airbnb_listings_updated"));
    } else {
      setCancelError(res.error || "Failed to cancel reservation. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 pb-24 sm:pb-8 flex flex-col">
        {/* Toast Alert Banner upon successful cancellation & refund initiation */}
        {cancelToast && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-sm flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-emerald-900">Cancellation Confirmed · Refund Initiated</h4>
                <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">{cancelToast}</p>
                <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                  Expected credit timeline: 3–5 business days depending on your bank / UPI provider.
                </p>
              </div>
            </div>
            <button
              onClick={() => setCancelToast(null)}
              className="p-1 rounded-full text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EBEBEB]">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#222222]">
            {t("trips.title", "Trips")}
          </h1>
          {trips.length > 0 && (
            <span className="text-xs font-semibold text-[#717171] px-3 py-1 bg-[#F7F7F7] border border-[#DDDDDD] rounded-full">
              {trips.length} {trips.length === 1 ? "stay" : "stays"}
            </span>
          )}
        </div>

        {/* 2-Column Split View Matching Authentic Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-h-[640px]">
          {/* Left Column: Empty State Banner OR Booked Trips List */}
          <div className="lg:col-span-5 flex flex-col justify-center py-4 sm:py-8 lg:pr-4">
            {trips.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
                <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square flex items-center justify-center">
                  <img
                    src="/images/trips-map-illustration.jpg"
                    alt="Map out your next trip"
                    className="w-full h-full object-contain rounded-2xl drop-shadow-sm hover:scale-[1.02] transition duration-300"
                  />
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#222222]">
                    {t("trips.mapOut", "Map out your next trip")}
                  </h2>
                  <p className="text-sm text-[#717171] leading-relaxed max-w-sm mx-auto">
                    {t(
                      "trips.mapOutSubtitle",
                      "After you book a trip, experience or service, come back here to see details, explore the map and save places to visit."
                    )}
                  </p>
                </div>

                <div>
                  <Link
                    href="/"
                    className="inline-block bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                  >
                    {t("trips.getStarted", "Get started")}
                  </Link>
                </div>
              </div>
            ) : (
              /* Booked Trips List */
              <div className="space-y-6 overflow-y-auto max-h-[680px] pr-2 menu-scrollbar">
                <div className="flex items-center justify-between pb-2 border-b border-[#EBEBEB]">
                  <h3 className="font-bold text-lg text-[#222222]">Your Booked Stays</h3>
                  <span className="text-xs font-semibold text-[#FF385C] bg-[#FFF0F3] px-2.5 py-1 rounded-full">
                    {trips.length} Total
                  </span>
                </div>

                {trips.map((trip: TripRecord) => {
                  const isCancelled = trip.status === "CANCELLED";
                  const isCompleted = trip.status === "COMPLETED";
                  const isConfirmed = trip.status === "CONFIRMED";
                  const userReview = userReviews[trip.listingId];
                  const { isEligible, hoursRemaining, isPast } = getCancellationInfo(trip.checkIn);

                  return (
                    <div
                      key={trip.id}
                      className={`border rounded-2xl p-4 sm:p-5 transition bg-white space-y-4 ${
                        isCancelled
                          ? "border-gray-200 bg-gray-50/50 opacity-90"
                          : "border-[#DDDDDD] hover:shadow-md"
                      }`}
                    >
                      <div className="flex gap-4">
                        {trip.listingImage && (
                          <img
                            src={trip.listingImage}
                            alt={trip.listingTitle}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            {/* Status Badge */}
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                isCompleted
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : isCancelled
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : isEligible
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {isCompleted ? (
                                <>
                                  <CheckCircle className="w-3 h-3 text-blue-600" />
                                  <span>Completed</span>
                                </>
                              ) : isCancelled ? (
                                <>
                                  <RotateCcw className="w-3 h-3 text-rose-600" />
                                  <span>Cancelled · Refund initiated</span>
                                </>
                              ) : isEligible ? (
                                <>
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  <span>Confirmed · Free cancellation</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-3 h-3 text-amber-600" />
                                  <span>Confirmed · Non-refundable</span>
                                </>
                              )}
                            </span>
                            <span className="text-xs font-mono text-[#717171]">
                              #{trip.confirmationCode}
                            </span>
                          </div>

                          <h4 className="font-bold text-base text-[#222222] mt-1 truncate">
                            {trip.listingTitle}
                          </h4>
                          <p className="text-xs text-[#717171] mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{trip.city}, {trip.country}</span>
                          </p>

                          {/* Check-in & Check-out Dates */}
                          <div className="mt-2 text-xs font-semibold text-[#222222] flex items-center gap-1.5 flex-wrap">
                            <Calendar className="w-3.5 h-3.5 text-[#717171]" />
                            <span>{trip.checkIn} – {trip.checkOut}</span>
                          </div>
                        </div>
                      </div>

                      {/* Refund Status Box if Cancelled */}
                      {isCancelled && (
                        <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-200">
                          <div className="flex items-center gap-2.5 text-emerald-900">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <div>
                              <p className="font-bold">
                                100% Refund of {formatPrice(trip.totalPrice)} initiated
                              </p>
                              <p className="text-[11px] text-emerald-700">
                                Refund initiated to original payment method (credit within 3–5 business days)
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 uppercase">
                            REFUNDED
                          </span>
                        </div>
                      )}

                      {/* Cancellation Policy Banner for Confirmed Active Trips */}
                      {isConfirmed && (
                        <div>
                          {isEligible ? (
                            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              <span className="text-[11px] font-medium leading-tight">
                                <strong>Free cancellation:</strong> You can cancel up to 24h before check-in ({hoursRemaining}h remaining) for a 100% full refund.
                              </span>
                            </div>
                          ) : !isPast ? (
                            <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-800">
                              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                              <span className="text-[11px] font-medium leading-tight">
                                <strong>Non-refundable:</strong> Check-in is in {hoursRemaining}h (within 24h cutoff). Full refund is no longer automated.
                              </span>
                            </div>
                          ) : null}
                        </div>
                      )}

                      {/* Posted User Review Display Card */}
                      {userReview && (
                        <div className="p-3.5 bg-[#FFF8F6] border border-[#FFE4E8] rounded-2xl space-y-2 animate-in fade-in duration-300">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="bg-[#FF385C] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider shadow-xs">
                                Your Review
                              </span>
                              <div className="flex items-center gap-1 font-bold text-[#222222]">
                                <Star className="w-3.5 h-3.5 fill-[#FF385C] text-[#FF385C]" />
                                <span>{Number(userReview.rating).toFixed(1)} / 5.0</span>
                              </div>
                            </div>
                            <span className="text-[11px] text-[#717171]">
                              {userReview.created_at
                                ? new Date(userReview.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                : userReview.date || "Recently posted"}
                            </span>
                          </div>
                          <p className="text-xs text-[#222222] italic leading-relaxed bg-white/80 p-2.5 rounded-xl border border-[#FEE2E2]">
                            &ldquo;{userReview.comment}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Actions Row */}
                      <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[#717171]">{t("listing.total", "Total")}: </span>
                          <span className="font-bold text-[#222222]">
                            {formatPrice(trip.totalPrice)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Cancel & Refund Button if within 24h window */}
                          {isConfirmed && isEligible && (
                            <button
                              type="button"
                              onClick={() => setCancellingTrip(trip)}
                              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition shadow-2xs active:scale-95 cursor-pointer"
                            >
                              Cancel & get refund
                            </button>
                          )}

                          {/* Cancellation Policy info if within 24h cutoff */}
                          {isConfirmed && !isEligible && !isPast && (
                            <button
                              type="button"
                              onClick={() => setPolicyTrip(trip)}
                              className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#717171] hover:text-[#222222] bg-[#F7F7F7] hover:bg-[#EBEBEB] border border-[#DDDDDD] transition cursor-pointer"
                            >
                              Cancellation policy
                            </button>
                          )}

                          {/* Leave a review is ONLY active for COMPLETED trips */}
                          {isCompleted && (
                            <button
                              type="button"
                              onClick={() => setReviewingTrip(trip)}
                              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#FF385C] to-[#E00B41] hover:from-[#E00B41] hover:to-[#D70466] shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
                            >
                              <Star className="w-3.5 h-3.5 fill-white text-white group-hover:rotate-12 transition-transform duration-200" />
                              <span>{userReview ? "Edit your review" : "Leave a review"}</span>
                            </button>
                          )}

                          <Link
                            href={`/rooms/${trip.listingId}`}
                            className="font-semibold text-[#222222] hover:text-[#FF385C] hover:underline transition-colors"
                          >
                            View stay
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Book More Adventures */}
                <div className="p-4 bg-[#F7F7F7] rounded-2xl text-center space-y-2">
                  <p className="text-xs font-semibold text-[#222222]">
                    Planning another getaway?
                  </p>
                  <Link
                    href="/"
                    className="inline-block text-xs font-bold text-[#FF385C] hover:underline"
                  >
                    Explore unique homes & experiences →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Full Interactive World Map matching Screenshot 1 */}
          <div className="lg:col-span-7 h-[520px] lg:h-full min-h-[500px]">
            <TripsWorldMap
              trips={trips
                .filter((t) => t.status !== "CANCELLED")
                .map((t: TripRecord) => ({
                  id: t.id,
                  title: t.listingTitle,
                  city: t.city,
                  country: t.country,
                  lat: t.lat,
                  lng: t.lng,
                  image: t.listingImage,
                  dates: `${t.checkIn} to ${t.checkOut}`,
                }))}
            />
          </div>
        </div>
      </main>

      {/* Cancellation Confirmation Modal */}
      {cancellingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#DDDDDD] space-y-5 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#EBEBEB]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-200">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[#222222]">
                    Cancel Reservation
                  </h3>
                  <p className="text-xs text-[#717171]">
                    Confirmation #{cancellingTrip.confirmationCode}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCancellingTrip(null);
                  setCancelError(null);
                }}
                className="p-1 rounded-full text-[#717171] hover:bg-[#F7F7F7] hover:text-[#222222] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message if any */}
            {cancelError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{cancelError}</span>
              </div>
            )}

            {/* Trip Info Card */}
            <div className="p-3.5 bg-[#F7F7F7] rounded-2xl flex items-center gap-3.5">
              {cancellingTrip.listingImage && (
                <img
                  src={cancellingTrip.listingImage}
                  alt={cancellingTrip.listingTitle}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-[#DDDDDD]"
                />
              )}
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-[#222222] truncate">
                  {cancellingTrip.listingTitle}
                </h4>
                <p className="text-xs text-[#717171] mt-0.5">
                  {cancellingTrip.city}, {cancellingTrip.country}
                </p>
                <p className="text-xs font-semibold text-[#222222] mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#717171]" />
                  <span>{cancellingTrip.checkIn} to {cancellingTrip.checkOut}</span>
                </p>
              </div>
            </div>

            {/* Full Refund Guarantee Box */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>100% Full Refund Eligible</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                You are cancelling more than 24 hours prior to check-in ({getCancellationInfo(cancellingTrip.checkIn).hoursRemaining}h remaining). Under bnbair cancellation policy, you are eligible for an immediate full refund.
              </p>
              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>Refund Amount:</span>
                <span className="text-base text-emerald-700">{formatPrice(cancellingTrip.totalPrice)}</span>
              </div>
            </div>

            {/* Breakdown Details */}
            <div className="space-y-2 text-xs text-[#717171]">
              <div className="flex justify-between">
                <span>Total Amount Paid</span>
                <span className="font-semibold text-[#222222]">{formatPrice(cancellingTrip.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Refund Method</span>
                <span className="font-semibold text-[#222222]">Original Payment Method</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Processing Time</span>
                <span className="font-semibold text-[#222222]">3–5 Business Days</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setCancellingTrip(null);
                  setCancelError(null);
                }}
                disabled={isCancelling}
                className="px-5 py-2.5 rounded-xl border border-[#DDDDDD] text-xs font-bold text-[#222222] hover:bg-[#F7F7F7] transition cursor-pointer"
              >
                Keep reservation
              </button>
              <button
                type="button"
                onClick={handleConfirmCancellation}
                disabled={isCancelling}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm hover:shadow-md transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Initiating refund...</span>
                  </>
                ) : (
                  <span>Confirm cancellation & refund</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Policy Explanation Modal (for trips within 24h cutoff) */}
      {policyTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#DDDDDD] space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-[#EBEBEB]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[#222222]">
                    24-Hour Cancellation Policy
                  </h3>
                  <p className="text-xs text-[#717171]">
                    #{policyTrip.confirmationCode} · {policyTrip.city}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPolicyTrip(null)}
                className="p-1 rounded-full text-[#717171] hover:bg-[#F7F7F7] hover:text-[#222222] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs text-amber-900 leading-relaxed">
              <p className="font-bold">Automated full refund cutoff reached</p>
              <p>
                Under bnbair policy, free cancellations with full refund are available up to <strong>24 hours before check-in</strong>.
              </p>
              <p>
                Your check-in is scheduled for <strong>{policyTrip.checkIn}</strong> (less than 24 hours away). Because the host has reserved and prepared the accommodation, automated refunds are no longer available for this stay.
              </p>
            </div>

            <div className="space-y-2 text-xs text-[#717171]">
              <p className="font-semibold text-[#222222]">Have an emergency or extenuating circumstance?</p>
              <p>
                You can reach out directly to your host through Messages or contact bnbair 24/7 Support to request assistance.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPolicyTrip(null)}
                className="px-5 py-2.5 rounded-xl bg-[#222222] hover:bg-black text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                I understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave / Edit Review Modal */}
      {reviewingTrip && (
        <ReviewModal
          isOpen={!!reviewingTrip}
          onClose={() => setReviewingTrip(null)}
          listingId={reviewingTrip.listingId}
          listingTitle={reviewingTrip.listingTitle}
          userId={persona.id || 1}
          initialRating={userReviews[reviewingTrip.listingId]?.rating}
          initialComment={userReviews[reviewingTrip.listingId]?.comment}
          initialCleanliness={userReviews[reviewingTrip.listingId]?.cleanliness}
          initialAccuracy={userReviews[reviewingTrip.listingId]?.accuracy}
          initialCheckin={userReviews[reviewingTrip.listingId]?.checkin}
          initialCommunication={userReviews[reviewingTrip.listingId]?.communication}
          initialLocation={userReviews[reviewingTrip.listingId]?.location}
          initialValue={userReviews[reviewingTrip.listingId]?.value}
          onReviewSubmitted={(savedReview) => {
            if (savedReview) {
              setUserReviews((prev) => ({
                ...prev,
                [savedReview.listingId]: savedReview,
              }));
            }
            loadUserReviews();
          }}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
