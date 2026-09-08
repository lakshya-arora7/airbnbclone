"use client";

import React, { useState, useEffect } from "react";
import { Star, X, CheckCircle2, Sparkles, Heart } from "lucide-react";
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
  onReviewSubmitted?: (newReview?: any) => void;
}

const QUICK_TAGS = [
  "✨ Spotless clean",
  "🌟 Exceptional host",
  "🔑 Seamless check-in",
  "📍 Prime location",
  "💎 Great value",
  "🛋️ Incredibly comfortable",
];

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
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState(initialComment ?? "");
  const [cleanliness, setCleanliness] = useState(initialCleanliness ?? 5);
  const [accuracy, setAccuracy] = useState(initialAccuracy ?? 5);
  const [checkin, setCheckin] = useState(initialCheckin ?? 5);
  const [communication, setCommunication] = useState(initialCommunication ?? 5);
  const [location, setLocation] = useState(initialLocation ?? 5);
  const [value, setValue] = useState(initialValue ?? 5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
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
      setHoverRating(null);
    }
  }, [
    isOpen,
    initialRating,
    initialComment,
    initialCleanliness,
    initialAccuracy,
    initialCheckin,
    initialCommunication,
    initialLocation,
    initialValue,
  ]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const currentDisplayRating = hoverRating !== null ? hoverRating : rating;

  const getRatingFeedback = (val: number) => {
    switch (val) {
      case 5:
        return "5 of 5 stars · Outstanding & memorable experience!";
      case 4:
        return "4 of 5 stars · Great stay, highly recommended";
      case 3:
        return "3 of 5 stars · Good experience overall";
      case 2:
        return "2 of 5 stars · Several aspects need attention";
      case 1:
        return "1 of 5 stars · Disappointing stay";
      default:
        return `${val} of 5 stars`;
    }
  };

  const handleToggleTag = (tag: string) => {
    if (comment.includes(tag)) {
      setComment((prev) =>
        prev
          .replace(new RegExp(`(\\s*·\\s*)?${tag}`, "g"), "")
          .trim()
      );
    } else {
      setComment((prev) => (prev.trim() ? `${prev.trim()} · ${tag}` : tag));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    const newReviewPayload = {
      listingId,
      rating,
      comment: comment.trim(),
      cleanlinessRating: cleanliness,
      accuracyRating: accuracy,
      checkinRating: checkin,
      communicationRating: communication,
      locationRating: location,
      valueRating: value,
    };

    const savedReview = {
      id: Date.now(),
      listingId,
      rating,
      comment: comment.trim(),
      cleanliness,
      accuracy,
      checkin,
      communication,
      location,
      value,
      created_at: new Date().toISOString(),
      authorName: "Lakshya Arora",
    };

    // 1. Optimistic Local Save for instantaneous UI reactivity
    try {
      const stored = JSON.parse(localStorage.getItem("airbnb_user_reviews") || "{}");
      stored[listingId] = savedReview;
      localStorage.setItem("airbnb_user_reviews", JSON.stringify(stored));
    } catch (e) {
      console.error("Local storage review save error:", e);
    }

    try {
      await api.submitReview(newReviewPayload, userId);
    } catch (err) {
      console.warn("Backend review submission warning:", err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      onReviewSubmitted?.(savedReview);

      // Smooth auto close after success confirmation
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 1000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out animate-in zoom-in-95 border border-[#DDDDDD]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#EBEBEB] hover:bg-[#F7F7F7] text-[#222222] flex items-center justify-center transition cursor-pointer disabled:opacity-30"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#FFF0F3] text-[#FF385C] rounded-full flex items-center justify-center mx-auto border border-rose-100 shadow-sm animate-bounce">
              <CheckCircle2 className="w-9 h-9 text-[#FF385C]" />
            </div>
            <h3 className="text-xl font-extrabold text-[#222222]">Thank you for your review!</h3>
            <p className="text-xs text-[#717171] max-w-xs mx-auto leading-relaxed">
              Your ratings and verified feedback have been saved and will guide future travelers.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#FF385C]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Guest Review</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#222222] mt-1">Rate your completed stay</h3>
              <p className="text-xs text-[#717171] mt-0.5 truncate max-w-sm">{listingTitle}</p>
            </div>

            {/* Overall Star Rating with Smooth Hover Animation */}
            <div className="bg-[#F7F7F7] p-4 sm:p-5 rounded-3xl text-center space-y-2 border border-[#EBEBEB]">
              <p className="text-[11px] font-bold text-[#717171] uppercase tracking-wider">Overall Experience</p>
              <div
                className="flex items-center justify-center gap-2 py-1"
                onMouseLeave={() => setHoverRating(null)}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= currentDisplayRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-all duration-150 transform hover:scale-125 active:scale-95 cursor-pointer group"
                      aria-label={`${star} star`}
                    >
                      <Star
                        className={`w-8 h-8 transition-all duration-150 ${
                          isFilled
                            ? "fill-[#FF385C] text-[#FF385C] drop-shadow-xs scale-105"
                            : "fill-transparent text-[#DDDDDD] group-hover:text-rose-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-xs font-bold text-[#222222] transition-colors duration-150">
                {getRatingFeedback(currentDisplayRating)}
              </p>
            </div>

            {/* 6 Category Sub-Ratings */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAFAFA] p-4 rounded-3xl border border-[#EBEBEB]">
              {[
                { label: "Cleanliness", val: cleanliness, set: setCleanliness },
                { label: "Accuracy", val: accuracy, set: setAccuracy },
                { label: "Check-in", val: checkin, set: setCheckin },
                { label: "Communication", val: communication, set: setCommunication },
                { label: "Location", val: location, set: setLocation },
                { label: "Value", val: value, set: setValue },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#717171]">
                    <span>{item.label}</span>
                    <span className="font-bold text-[#222222]">{item.val}.0</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={item.val}
                    onChange={(e) => item.set(Number(e.target.value))}
                    className="w-full accent-[#FF385C] cursor-pointer h-1.5 bg-[#EBEBEB] rounded-lg transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Quick Praise Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#717171] uppercase tracking-wider block">
                Quick praise (tap to add)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TAGS.map((tag) => {
                  const isSelected = comment.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#FFF0F3] text-[#FF385C] border-rose-300 font-bold shadow-xs"
                          : "bg-white text-[#717171] border-[#E0E0E0] hover:border-[#222222] hover:text-[#222222]"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Written Comments */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#222222]">
                Your feedback & recommendations
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What made your stay special? Share details about the host, cleanliness, comfort, and neighborhood..."
                rows={3}
                required
                className="w-full p-3.5 text-xs border border-[#DDDDDD] rounded-2xl focus:outline-none focus:border-[#222222] focus:ring-1 focus:ring-[#222222] transition-all resize-none font-medium leading-relaxed text-[#222222]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="w-full bg-[#FF385C] hover:bg-[#E00B41] disabled:opacity-40 text-white font-bold py-3 rounded-2xl transition-all shadow-md active:scale-98 cursor-pointer text-xs flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting review...</span>
                </>
              ) : (
                <span>Publish Review</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
