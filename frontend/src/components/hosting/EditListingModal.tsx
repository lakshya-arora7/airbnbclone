"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Sparkles, Building2, MapPin, DollarSign, Users, Bed, Bath } from "lucide-react";
import { Listing } from "@/types";
import { api } from "@/lib/api";

interface EditListingModalProps {
  isOpen: boolean;
  listing: Listing | null;
  onClose: () => void;
  onSuccess: (updated: Listing) => void;
  hostId: number;
}

export default function EditListingModal({
  isOpen,
  listing,
  onClose,
  onSuccess,
  hostId,
}: EditListingModalProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState<number>(3000);
  const [cleaningFee, setCleaningFee] = useState<number>(400);
  const [maxGuests, setMaxGuests] = useState<number>(4);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [beds, setBeds] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (listing) {
      setTitle(listing.title || "");
      setSubtitle(listing.subtitle || "");
      setDescription(listing.description || "");
      setPricePerNight(listing.pricePerNight || 3000);
      setCleaningFee(listing.cleaningFee || 400);
      setMaxGuests(listing.maxGuests || 4);
      setBedrooms(listing.bedrooms || 2);
      setBeds(listing.beds || 2);
      setBathrooms(listing.bathrooms || 2);
      setIsPublished(listing.isPublished !== false);
      setErrorMsg(null);
    }
  }, [listing]);

  if (!isOpen || !listing) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Listing title cannot be empty.");
      return;
    }
    if (pricePerNight <= 0) {
      setErrorMsg("Price per night must be greater than 0.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        description: description.trim(),
        price_per_night: Number(pricePerNight),
        pricePerNight: Number(pricePerNight),
        cleaning_fee: Number(cleaningFee),
        cleaningFee: Number(cleaningFee),
        max_guests: Number(maxGuests),
        maxGuests: Number(maxGuests),
        bedrooms: Number(bedrooms),
        beds: Number(beds),
        bathrooms: Number(bathrooms),
        is_published: isPublished,
        isPublished: isPublished,
      };

      const updated = await api.updateListing(listing.id, payload, hostId);
      if (updated) {
        onSuccess(updated);
        onClose();
      } else {
        setErrorMsg("Failed to update listing. Please try again.");
      }
    } catch (err: any) {
      console.error("Update listing error:", err);
      setErrorMsg("An unexpected error occurred while saving changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#DDDDDD] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EBEBEB] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF385C]" />
              <h2 className="text-lg font-extrabold text-[#222222]">Edit Listing</h2>
            </div>
            <p className="text-xs text-[#717171] mt-0.5">
              Update details, pricing, and guest capacity for #{listing.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:bg-[#F7F7F7] text-[#222222] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          {/* Property Title */}
          <div>
            <label className="block text-xs font-bold text-[#222222] mb-1">Property Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDDDDD] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222222]"
              required
            />
          </div>

          {/* Subtitle / Location note */}
          <div>
            <label className="block text-xs font-bold text-[#222222] mb-1">Subtitle / Location Tagline</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDDDDD] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222222]"
            />
          </div>

          {/* Price & Cleaning Fee */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#222222] mb-1">Price per Night (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#717171] font-bold">₹</span>
                <input
                  type="number"
                  min="500"
                  step="50"
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-[#DDDDDD] text-sm font-bold text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222222]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#222222] mb-1">Cleaning Fee (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#717171] font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={cleaningFee}
                  onChange={(e) => setCleaningFee(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-[#DDDDDD] text-sm font-bold text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222222]"
                />
              </div>
            </div>
          </div>

          {/* Guest Capacity, Bedrooms, Beds, Bathrooms */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-[#717171] mb-1">Max Guests</label>
              <input
                type="number"
                min="1"
                max="20"
                value={maxGuests}
                onChange={(e) => setMaxGuests(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DDDDDD] text-sm font-semibold text-[#222222] text-center"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#717171] mb-1">Bedrooms</label>
              <input
                type="number"
                min="1"
                max="10"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DDDDDD] text-sm font-semibold text-[#222222] text-center"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#717171] mb-1">Beds</label>
              <input
                type="number"
                min="1"
                max="15"
                value={beds}
                onChange={(e) => setBeds(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DDDDDD] text-sm font-semibold text-[#222222] text-center"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#717171] mb-1">Bathrooms</label>
              <input
                type="number"
                min="1"
                max="10"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DDDDDD] text-sm font-semibold text-[#222222] text-center"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#222222] mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDDDDD] text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222222] resize-none leading-relaxed"
            />
          </div>

          {/* Publication Status Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F7F7] border border-[#EBEBEB]">
            <div>
              <p className="text-xs font-bold text-[#222222]">Listing Visibility</p>
              <p className="text-[11px] text-[#717171]">
                {isPublished ? "Published — visible on search and homescreen" : "Unlisted — hidden from public search"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`w-12 h-6.5 flex items-center rounded-full p-1 transition cursor-pointer ${
                isPublished ? "bg-emerald-600 justify-end" : "bg-gray-300 justify-start"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Footer Actions */}
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
                  Saving...
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
