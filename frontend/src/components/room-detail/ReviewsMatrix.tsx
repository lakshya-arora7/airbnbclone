"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";

interface ReviewsMatrixProps {
  listingId?: number;
  rating: number;
  reviewCount: number;
}

interface ReviewDisplay {
  id: number | string;
  name: string;
  date: string;
  avatar: string;
  comment: string;
  rating?: number;
  isUserReview?: boolean;
}

export default function ReviewsMatrix({ listingId, rating: initialRating, reviewCount: initialCount }: ReviewsMatrixProps) {
  const [reviews, setReviews] = useState<ReviewDisplay[]>([]);
  const [computedRating, setComputedRating] = useState<number>(initialRating || 5.0);
  const [computedCount, setComputedCount] = useState<number>(initialCount || 0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadReviews() {
      setIsLoading(true);
      const allDisplayReviews: ReviewDisplay[] = [];
      const seenComments = new Set<string>();

      // 1. Check localStorage for user-submitted review for this listing
      if (listingId) {
        try {
          const localStr = localStorage.getItem("airbnb_user_reviews");
          if (localStr) {
            const parsed = JSON.parse(localStr);
            const userReview = parsed[listingId];
            if (userReview) {
              allDisplayReviews.push({
                id: `local-user-${listingId}`,
                name: "Lakshya Arora",
                date: userReview.date || "September 2026",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
                comment: userReview.comment,
                rating: userReview.rating || 5,
                isUserReview: true,
              });
              seenComments.add(userReview.comment.trim().toLowerCase());
            }
          }
        } catch (e) {
          console.error("Failed to parse local user reviews:", e);
        }
      }

      // 2. Fetch live reviews from backend SQLite database
      if (listingId) {
        try {
          const liveReviews = await api.getListingReviews(listingId);
          if (liveReviews && Array.isArray(liveReviews) && liveReviews.length > 0) {
            liveReviews.forEach((r: any) => {
              const commentKey = (r.comment || "").trim().toLowerCase();
              if (seenComments.has(commentKey)) return;
              seenComments.add(commentKey);

              const createdDate = r.created_at
                ? new Date(r.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                : "Recently";

              allDisplayReviews.push({
                id: r.id,
                name: r.author?.full_name || (r.author_id === 1 ? "Lakshya Arora" : "Verified Guest"),
                date: createdDate,
                avatar: r.author?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
                comment: r.comment,
                rating: r.rating || 5,
                isUserReview: r.author_id === 1 || r.author?.full_name?.toLowerCase().includes("lakshya"),
              });
            });
          }
        } catch (err) {
          console.warn("Failed to fetch live reviews:", err);
        }
      }

      setReviews(allDisplayReviews);

      // Recompute stats strictly based on live database data
      const validScores = allDisplayReviews.filter((r) => r.rating !== undefined).map((r) => r.rating as number);
      if (validScores.length > 0) {
        const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
        setComputedRating(Number(avg.toFixed(2)));
        setComputedCount(allDisplayReviews.length);
      } else {
        setComputedCount(0);
      }
      setIsLoading(false);
    }

    loadReviews();
  }, [listingId, initialRating, initialCount]);

  const categories = [
    { label: "Cleanliness", score: computedRating || 5.0 },
    { label: "Accuracy", score: computedRating || 4.9 },
    { label: "Communication", score: computedRating || 5.0 },
    { label: "Location", score: computedRating || 4.9 },
    { label: "Check-in", score: computedRating || 5.0 },
    { label: "Value", score: computedRating || 4.8 }
  ];

  return (
    <div className="py-10 border-t border-[#EBEBEB]">
      {/* Title & Rating Badge */}
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 fill-[#222222] text-[#222222]" />
        <h3 className="text-xl font-bold text-[#222222]">
          {computedCount > 0 ? (
            `${computedRating.toFixed(2)} · ${computedCount} ${computedCount === 1 ? "review" : "reviews"}`
          ) : (
            "No reviews yet"
          )}
        </h3>
      </div>

      {computedCount > 0 && (
        /* 6 Category Score Bars */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 mb-10">
          {categories.map((cat) => (
            <div key={cat.label} className="flex items-center justify-between text-sm">
              <span className="text-[#222222]">{cat.label}</span>
              <div className="flex items-center gap-3">
                <div className="w-28 h-1 bg-[#DDDDDD] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#222222] rounded-full"
                    style={{ width: `${(cat.score / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-[#222222] w-6 text-right">
                  {cat.score.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviews Cards 2-Column Grid or Clean Empty State */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className={`space-y-3 rounded-2xl p-4 transition ${
                rev.isUserReview
                  ? "bg-[#FFF8F6] border border-[#FF385C]/30 shadow-xs"
                  : "border border-[#F0F0F0]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover border border-[#DDDDDD]" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#222222]">{rev.name}</p>
                      {rev.isUserReview && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF385C] text-white">
                          Your Review
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#717171]">{rev.date}</p>
                  </div>
                </div>

                {/* Star Rating Badge */}
                {rev.rating !== undefined && (
                  <div className="flex items-center gap-1 text-xs font-bold text-[#222222]">
                    <Star className="w-3.5 h-3.5 fill-[#222222] text-[#222222]" />
                    <span>{rev.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-[#222222] leading-relaxed whitespace-pre-line">{rev.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 border border-dashed border-[#DDDDDD] rounded-3xl text-center space-y-2 bg-[#FAFAFA]">
          <MessageSquare className="w-8 h-8 text-[#717171] mx-auto opacity-50" />
          <h4 className="text-base font-bold text-[#222222]">No guest reviews yet</h4>
          <p className="text-xs text-[#717171] max-w-sm mx-auto">
            Reviews from verified travelers will appear here after they complete their stay at this property.
          </p>
        </div>
      )}
    </div>
  );
}
