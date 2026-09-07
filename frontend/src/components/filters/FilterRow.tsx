"use client";

import React from "react";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";

export interface FilterParams {
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  amenities: string[];
}

interface FilterRowProps {
  filterParams: FilterParams;
  onFilterChange: (newFilters: FilterParams) => void;
  onOpenFilterModal: () => void;
  onClearAll: () => void;
  totalResults: number;
}

const PROPERTY_TYPES = ["Flat", "Villa", "Penthouse", "Studio"];

const PRICE_TIERS = [
  { label: "< ₹8,000", min: undefined, max: 8000 },
  { label: "₹8,000 – ₹10,000", min: 8000, max: 10000 },
  { label: "> ₹10,000", min: 10000, max: undefined }
];

const POPULAR_AMENITIES = ["Pool", "Air conditioning", "Wifi", "Kitchen", "Free parking"];

export default function FilterRow({
  filterParams,
  onFilterChange,
  onOpenFilterModal,
  onClearAll,
  totalResults
}: FilterRowProps) {
  const activeFilterCount =
    (filterParams.minPrice ? 1 : 0) +
    (filterParams.maxPrice ? 1 : 0) +
    (filterParams.propertyType ? 1 : 0) +
    filterParams.amenities.length;

  const handleTogglePropertyType = (type: string) => {
    if (filterParams.propertyType?.toLowerCase() === type.toLowerCase()) {
      onFilterChange({ ...filterParams, propertyType: undefined });
    } else {
      onFilterChange({ ...filterParams, propertyType: type });
    }
  };

  const handleTogglePriceTier = (min?: number, max?: number) => {
    if (filterParams.minPrice === min && filterParams.maxPrice === max) {
      onFilterChange({ ...filterParams, minPrice: undefined, maxPrice: undefined });
    } else {
      onFilterChange({ ...filterParams, minPrice: min, maxPrice: max });
    }
  };

  const handleToggleAmenity = (amenity: string) => {
    const exists = filterParams.amenities.includes(amenity);
    const updated = exists
      ? filterParams.amenities.filter((a) => a !== amenity)
      : [...filterParams.amenities, amenity];
    onFilterChange({ ...filterParams, amenities: updated });
  };

  return (
    <div className="w-full py-3.5 border-b border-[#EBEBEB] bg-white sticky top-20 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
        {/* Left: Quick Filter Pills (Property Type, Price Range, Key Amenities) */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-nowrap min-w-max">
          {/* 1. All Stays Pill */}
          <button
            type="button"
            onClick={() => onFilterChange({ ...filterParams, propertyType: undefined })}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition cursor-pointer ${
              !filterParams.propertyType
                ? "bg-[#222222] text-white border-[#222222] shadow-xs"
                : "bg-white text-[#222222] border-[#DDDDDD] hover:border-[#222222]"
            }`}
          >
            All stays
          </button>

          {/* 2. Property Type Pills */}
          {PROPERTY_TYPES.map((type) => {
            const isSelected = filterParams.propertyType?.toLowerCase() === type.toLowerCase();
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleTogglePropertyType(type)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition cursor-pointer ${
                  isSelected
                    ? "bg-[#222222] text-white border-[#222222] shadow-xs"
                    : "bg-white text-[#222222] border-[#DDDDDD] hover:border-[#222222]"
                }`}
              >
                {type}
              </button>
            );
          })}

          <span className="h-5 w-px bg-[#DDDDDD] mx-1" />

          {/* 3. Price Range Tiers */}
          {PRICE_TIERS.map((tier) => {
            const isSelected =
              filterParams.minPrice === tier.min && filterParams.maxPrice === tier.max;
            return (
              <button
                key={tier.label}
                type="button"
                onClick={() => handleTogglePriceTier(tier.min, tier.max)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition cursor-pointer ${
                  isSelected
                    ? "bg-[#222222] text-white border-[#222222] shadow-xs"
                    : "bg-white text-[#222222] border-[#DDDDDD] hover:border-[#222222]"
                }`}
              >
                {tier.label}
              </button>
            );
          })}

          <span className="h-5 w-px bg-[#DDDDDD] mx-1" />

          {/* 4. Amenities Quick Toggles */}
          {POPULAR_AMENITIES.map((amenity) => {
            const isSelected = filterParams.amenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => handleToggleAmenity(amenity)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#FFF0F3] text-[#FF385C] border-[#FF385C] font-bold"
                    : "bg-white text-[#222222] border-[#DDDDDD] hover:border-[#222222]"
                }`}
              >
                <span>{amenity}</span>
                {isSelected && <X className="w-3 h-3 text-[#FF385C]" />}
              </button>
            );
          })}
        </div>

        {/* Right: All Filters Modal Trigger & Reset */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="px-3 py-2 text-xs font-semibold text-[#717171] hover:text-[#222222] flex items-center gap-1 cursor-pointer transition hover:bg-gray-100 rounded-full"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenFilterModal}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition cursor-pointer flex items-center gap-2 ${
              activeFilterCount > 0
                ? "border-[#222222] bg-[#222222] text-white shadow-sm"
                : "border-[#DDDDDD] bg-white text-[#222222] hover:border-[#222222] hover:shadow-xs"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-[#222222] text-[10px] font-extrabold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
