"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
    amenities: string[];
  }) => void;
  initialFilters?: {
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
    amenities?: string[];
  };
  totalCount?: number;
}

const PROPERTY_TYPES = ["Any type", "Entire place", "Room", "Villa", "Cabin"];

const AVAILABLE_AMENITIES = [
  "Wifi",
  "Pool",
  "Kitchen",
  "Air conditioning",
  "Free parking",
  "Hot tub",
  "Dedicated workspace",
  "EV charger",
  "Beachfront",
  "Mountain view"
];

export default function FilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  totalCount = 0
}: FilterModalProps) {
  const { currentCurrency } = useLanguageCurrency();
  const [minPrice, setMinPrice] = useState<number | undefined>(initialFilters?.minPrice);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialFilters?.maxPrice);
  const [propertyType, setPropertyType] = useState<string>(initialFilters?.propertyType || "Any type");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialFilters?.amenities || []);

  if (!isOpen) return null;

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleClear = () => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setPropertyType("Any type");
    setSelectedAmenities([]);
  };

  const handleApply = () => {
    onApply({
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      propertyType: propertyType !== "Any type" ? propertyType : undefined,
      amenities: selectedAmenities
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#DDDDDD] w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EBEBEB] flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-[#F7F7F7] text-[#222222] transition"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-base font-bold text-[#222222]">Filters</h3>
          <div className="w-8" />
        </div>

        {/* Scrollable Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-6 divide-y divide-[#EBEBEB]">
          {/* Price Range Section */}
          <div>
            <h4 className="text-base font-bold text-[#222222] mb-1">Price range</h4>
            <p className="text-xs text-[#717171] mb-4">Nightly prices before taxes and fees</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[#DDDDDD] rounded-2xl p-3 focus-within:border-[#222222]">
                <label className="block text-[11px] font-bold text-[#717171] uppercase">Minimum</label>
                <div className="flex items-center text-sm font-semibold text-[#222222]">
                  <span className="pr-1">{currentCurrency.symbol}</span>
                  <input
                    type="number"
                    placeholder="1,000"
                    value={minPrice || ""}
                    onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full pl-1 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="border border-[#DDDDDD] rounded-2xl p-3 focus-within:border-[#222222]">
                <label className="block text-[11px] font-bold text-[#717171] uppercase">Maximum</label>
                <div className="flex items-center text-sm font-semibold text-[#222222]">
                  <span className="pr-1">{currentCurrency.symbol}</span>
                  <input
                    type="number"
                    placeholder="50,000+"
                    value={maxPrice || ""}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full pl-1 focus:outline-none font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Type of Place */}
          <div className="pt-6">
            <h4 className="text-base font-bold text-[#222222] mb-3">Type of place</h4>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((pt) => (
                <button
                  key={pt}
                  onClick={() => setPropertyType(pt)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                    propertyType === pt
                      ? "border-[#222222] bg-[#222222] text-white"
                      : "border-[#DDDDDD] text-[#222222] hover:border-[#222222]"
                  }`}
                >
                  {pt}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="pt-6">
            <h4 className="text-base font-bold text-[#222222] mb-4">Amenities</h4>
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-medium transition ${
                      isChecked
                        ? "border-[#222222] bg-[#F7F7F7] text-[#222222]"
                        : "border-[#DDDDDD] text-[#717171] hover:border-[#222222]"
                    }`}
                  >
                    <span>{amenity}</span>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                        isChecked ? "bg-[#222222] border-[#222222] text-white" : "border-[#DDDDDD]"
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#F7F7F7] border-t border-[#EBEBEB] flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-sm font-semibold text-[#222222] underline hover:text-black transition"
          >
            Clear all
          </button>

          <button
            onClick={handleApply}
            className="airbnb-btn-primary px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-md"
          >
            Show {totalCount > 0 ? `${totalCount} places` : "places"}
          </button>
        </div>
      </div>
    </div>
  );
}
