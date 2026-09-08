"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/header/Navbar";
import { useAuthPersona } from "@/context/AuthPersonaContext";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";
import { Calendar, MapPin, AlertCircle, CheckCircle, ArrowRight, X, Sparkles, Star, Edit3 } from "lucide-react";
import { api } from "@/lib/api";
import ReviewModal from "@/components/reviews/ReviewModal";
import ModifyBookingModal from "@/components/hosting/ModifyBookingModal";

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

export default function MyTripsPage() {
  const { persona } = useAuthPersona();
  const { formatPrice, t } = useLanguageCurrency();
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [cancellingTripId, setCancellingTripId] = useState<number | null>(null);
  const [reviewingTrip, setReviewingTrip] = useState<TripRecord | null>(null);
  const [modifyingTrip, setModifyingTrip] = useState<TripRecord | null>(null);
  const [userReviews, setUserReviews] = useState<Record<number, any>>({});

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

      // 2. Also check localStorage to merge any immediate local reviews
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

  useEffect(() => {
    // Fetch live trips from backend for current persona
    api.getMyTrips(persona.id || 1).then((liveTrips) => {
      setTrips(liveTrips || []);
    });

    // Fetch user's reviews
    loadUserReviews();
  }, [persona.id]);

  const handleCancelTrip = async (tripId: number) => {
    // 1. Call live backend cancellation
    await api.cancelBooking(tripId, persona.id || 1);

    // 2. Update local state
    const updated = trips.map((t) =>
      t.id === tripId ? { ...t, status: "CANCELLED" as const } : t
    );
    setTrips(updated);
    try {
      localStorage.setItem("airbnb_demo_bookings", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setCancellingTripId(null);
  };

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 flex flex-col">
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
          {/* Left Column: Empty State Banner OR Previous Trips List */}
          <div className="lg:col-span-5 flex flex-col justify-center py-4 sm:py-8 lg:pr-4">
            {trips.length === 0 ? (
              /* Exact Screenshot 1 Left Empty State */
              <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
                {/* High quality 3D illustration generated for Trips */}
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
              /* Previous Trips List when user has previous trips */
              <div className="space-y-6 overflow-y-auto max-h-[680px] pr-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#EBEBEB]">
                  <h3 className="font-bold text-lg text-[#222222]">Your Booked Stays</h3>
                  <span className="text-xs font-semibold text-[#FF385C] bg-[#FFF0F3] px-2.5 py-1 rounded-full">
                    {trips.length} Booked
                  </span>
                </div>

                {trips.map((trip: TripRecord) => {
                  const isCancelled = trip.status === "CANCELLED";
                  const isCompleted = trip.status === "COMPLETED";
                  const isConfirmed = trip.status === "CONFIRMED";
                  const userReview = userReviews[trip.listingId];
                  return (
                    <div
                      key={trip.id}
                      className="border border-[#DDDDDD] rounded-2xl p-4 sm:p-5 hover:shadow-md transition bg-white space-y-4"
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
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                isCompleted
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : isCancelled
                                  ? "bg-gray-100 text-[#717171]"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              {isCompleted ? (
                                <>
                                  <CheckCircle className="w-3 h-3 text-blue-600" />
                                  <span>Completed</span>
                                </>
                              ) : isCancelled ? (
                                <span>Cancelled</span>
                              ) : (
                                <span>Confirmed</span>
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

                          <div className="mt-2 text-xs font-semibold text-[#222222] flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#717171]" />
                            <span>{trip.checkIn} – {trip.checkOut}</span>
                          </div>
                        </div>
                      </div>

                      {/* Posted User Review Display Card */}
                      {userReview && (
                        <div className="p-3.5 bg-[#FFF8F6] border border-[#FFE4E8] rounded-2xl space-y-2">
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

                      <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[#717171]">{t("listing.total", "Total")}: </span>
                          <span className="font-bold text-[#222222]">
                            {formatPrice(trip.totalPrice)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Leave a review is ONLY active for COMPLETED trips */}
                          {isCompleted && (
                            <button
                              type="button"
                              onClick={() => setReviewingTrip(trip)}
                              className="font-bold text-[#FF385C] hover:underline cursor-pointer flex items-center gap-1 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition shadow-2xs"
                            >
                              <Star className="w-3.5 h-3.5 fill-[#FF385C]" />
                              <span>{userReview ? "Edit review" : "Leave a review"}</span>
                            </button>
                          )}

                          <Link
                            href={`/rooms/${trip.listingId}`}
                            className="font-semibold text-[#222222] hover:underline"
                          >
                            View stay
                          </Link>

                          {/* Modify & Cancel are only available for CONFIRMED trips */}
                          {isConfirmed && (
                            <>
                              <button
                                type="button"
                                onClick={() => setModifyingTrip(trip)}
                                className="font-semibold text-sky-700 hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Modify</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setCancellingTripId(trip.id)}
                                className="text-rose-600 hover:underline cursor-pointer font-medium"
                              >
                                Cancel
                              </button>
                            </>
                          )}
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
              trips={trips.map((t: TripRecord) => ({
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

      {/* Cancel Trip Confirmation Modal */}
      {cancellingTripId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#DDDDDD] space-y-4">
            <h3 className="text-lg font-bold text-[#222222]">Cancel reservation?</h3>
            <p className="text-xs text-[#717171] leading-relaxed">
              Are you sure you want to cancel this reservation? Full refund will be processed to
              your original payment method within 3–5 business days under Flexible cancellation policy.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancellingTripId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-full border border-[#DDDDDD] hover:bg-[#F7F7F7] cursor-pointer"
              >
                Keep reservation
              </button>
              <button
                type="button"
                onClick={() => handleCancelTrip(cancellingTripId)}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
              >
                Confirm cancel
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
          onReviewSubmitted={() => {
            loadUserReviews();
          }}
        />
      )}
      {/* Modify Booking Modal */}
      <ModifyBookingModal
        isOpen={!!modifyingTrip}
        booking={modifyingTrip}
        onClose={() => setModifyingTrip(null)}
        onSuccess={(updated) => {
          setTrips((prev) =>
            prev.map((t) =>
              t.id === updated.id
                ? {
                    ...t,
                    checkIn: updated.check_in || updated.checkIn,
                    checkOut: updated.check_out || updated.checkOut,
                    guestsCount: updated.guests_count || updated.guestsCount,
                    totalPrice: updated.total_price || updated.totalPrice,
                    status: updated.status || t.status,
                  }
                : t
            )
          );
          setModifyingTrip(null);
        }}
        userId={persona.id || 1}
      />
    </div>
  );
}
