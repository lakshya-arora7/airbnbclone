"use client";

import React, { useState } from "react";
import { Star, X, CheckCircle, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: number;
  listingTitle: string;
  userId?: number;
  initialRating?: number;
  initialComment?: string;
  initialCleanliness?: number;
  initialAccuracy?: number;
  initialCheckin?: number;
  initialCommunication?: number;
  initialLocation?: number;
  initialValue?: number;
  onReviewSubmitted?: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  listingId,
  listingTitle,
  userId = 1,
  initialRating,
  initialComment,
  initialCleanliness,
  initialAccuracy,
  initialCheckin,
  initialCommunication,
  initialLocation,
  initialValue,
  onReviewSubmitted,
}: ReviewModalProps) {
  const [rating, setRating] = useState(initialRating ?? 5);
  const [comment, setComment] = useState(initialComment ?? "");
  const [cleanliness, setCleanliness] = useState(initialCleanliness ?? 5);
  const [accuracy, setAccuracy] = useState(initialAccuracy ?? 5);
  const [checkin, setCheckin] = useState(initialCheckin ?? 5);
  const [communication, setCommunication] = useState(initialCommunication ?? 5);
  const [location, setLocation] = useState(initialLocation ?? 5);
  const [value, setValue] = useState(initialValue ?? 5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setRating(initialRating ?? 5);
      setComment(initialComment ?? "");
      setCleanliness(initialCleanliness ?? 5);
      setAccuracy(initialAccuracy ?? 5);
      setCheckin(initialCheckin ?? 5);
      setCommunication(initialCommunication ?? 5);
      setLocation(initialLocation ?? 5);
      setValue(initialValue ?? 5);
      setSubmitted(false);
    }
  }, [isOpen, initialRating, initialComment]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await api.submitReview(
        {
          listingId,
          rating,
          comment: comment.trim(),
          cleanlinessRating: cleanliness,
          accuracyRating: accuracy,
          checkinRating: checkin,
          communicationRating: communication,
          locationRating: location,
          valueRating: value,
        },
        userId
      );

      // Save to localStorage for instant local reactivity across trips and room page
      try {
        const stored = JSON.parse(localStorage.getItem("airbnb_user_reviews") || "{}");
        stored[listingId] = {
          listingId,
          rating,
          comment: comment.trim(),
          cleanliness,
          accuracy,
          checkin,
          communication,
          location,
          value,
          date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        };
        localStorage.setItem("airbnb_user_reviews", JSON.stringify(stored));
      } catch (e) {
        console.error("Local storage review save error:", e);
      }

      setSubmitted(true);
      setTimeout(() => {
        onReviewSubmitted?.();
        onClose();
        setSubmitted(false);
        setComment("");
      }, 1200);
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F7F7F7] text-[#222222] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#222222]">Thank you for your review!</h3>
            <p className="text-sm text-[#717171]">
              Your ratings and comments have been recorded and will help future travelers and hosts.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FF385C]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Guest Review</span>
              </div>
              <h3 className="text-xl font-bold text-[#222222] mt-1">Rate your stay</h3>
              <p className="text-xs text-[#717171] mt-0.5 truncate">{listingTitle}</p>
            </div>

            {/* Overall Star Rating */}
            <div className="bg-[#F7F7F7] p-4 rounded-2xl text-center space-y-2">
              <p className="text-xs font-semibold text-[#717171]">Overall Rating</p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? "fill-[#FF385C] text-[#FF385C]"
                          : "fill-transparent text-[#DDDDDD]"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm font-bold text-[#222222]">{rating} of 5 stars</span>
            </div>

            {/* 6 Airbnb Category Rating Sliders */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[#717171] font-medium block">Cleanliness: {cleanliness}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={cleanliness}
                  onChange={(e) => setCleanliness(Number(e.target.value))}
                  className="w-full accent-[#FF385C]"
                />
              </div>
              <div>
                <label className="text-[#717171] font-medium block">Accuracy: {accuracy}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={accuracy}
                  onChange={(e) => setAccuracy(Number(e.target.value))}
                  className="w-full accent-[#FF385C]"
                />
              </div>
              <div>
                <label className="text-[#717171] font-medium block">Check-in: {checkin}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={checkin}
                  onChange={(e) => setCheckin(Number(e.target.value))}
                  className="w-full accent-[#FF385C]"
                />
              </div>
              <div>
                <label className="text-[#717171] font-medium block">Communication: {communication}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={communication}
                  onChange={(e) => setCommunication(Number(e.target.value))}
                  className="w-full accent-[#FF385C]"
                />
              </div>
              <div>
                <label className="text-[#717171] font-medium block">Location: {location}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={location}
                  onChange={(e) => setLocation(Number(e.target.value))}
                  className="w-full accent-[#FF385C]"
                />
              </div>
              <div>
                <label className="text-[#717171] font-medium block">Value: {value}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full accent-[#FF385C]"
                />
              </div>
            </div>

            {/* Written Comments */}
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1">
                Your review & feedback
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What made your stay memorable? Share details about the host, amenities, and surroundings..."
                rows={4}
                required
                className="w-full p-3 text-sm border border-[#DDDDDD] rounded-2xl focus:outline-none focus:border-[#222222] transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="w-full bg-[#FF385C] hover:bg-[#E00B41] disabled:opacity-50 text-white font-bold py-3 rounded-2xl transition shadow-md cursor-pointer text-sm"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
