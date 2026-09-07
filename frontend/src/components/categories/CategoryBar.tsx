"use client";

import React, { useRef } from "react";
import {
  Waves,
  TreePine,
  Castle,
  Flame,
  Building2,
  MountainSnow,
  Palmtree,
  Sparkles,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sun,
  Home,
  Trees,
  Ship,
  Coffee,
  Tent,
  Warehouse
} from "lucide-react";

export interface CategoryItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export const CATEGORIES: CategoryItem[] = [
  { id: "all", label: "All Homes", icon: Home },
  { id: "Beachfront", label: "Beachfront", icon: Waves },
  { id: "Cabins", label: "Cabins", icon: TreePine },
  { id: "Mansions", label: "Mansions", icon: Castle },
  { id: "Trending", label: "Trending", icon: Flame },
  { id: "Iconic cities", label: "Iconic cities", icon: Building2 },
  { id: "Amazing pools", label: "Amazing pools", icon: Sun },
  { id: "Countryside", label: "Countryside", icon: Trees },
  { id: "Lakefront", label: "Lakefront", icon: Ship },
  { id: "Skiing", label: "Skiing", icon: MountainSnow },
  { id: "Tropical", label: "Tropical", icon: Palmtree },
  { id: "Luxe", label: "Luxe", icon: Sparkles },
  { id: "Bed & breakfasts", label: "Bed & breakfasts", icon: Coffee },
  { id: "Camping", label: "Camping", icon: Tent },
  { id: "Farms", label: "Farms", icon: Warehouse }
];

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  onOpenFilters: () => void;
  filterCount?: number;
}

export default function CategoryBar({
  selectedCategory,
  onSelectCategory,
  onOpenFilters,
  filterCount = 0
}: CategoryBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-20 z-30 bg-white border-b border-[#EBEBEB] pt-4 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex p-1.5 rounded-full border border-[#DDDDDD] hover:shadow-md transition text-[#222222] bg-white flex-shrink-0"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Categories List */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-8 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-1"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center gap-2 pb-3 pt-1 border-b-2 transition-colors flex-shrink-0 group ${
                  isSelected
                    ? "border-[#222222] text-[#222222]"
                    : "border-transparent text-[#717171] hover:text-[#222222] hover:border-[#DDDDDD]"
                }`}
              >
                <Icon
                  className={`w-6 h-6 transition-transform group-hover:scale-105 ${
                    isSelected ? "text-[#222222]" : "text-[#717171] group-hover:text-[#222222]"
                  }`}
                />
                <span className={`text-xs whitespace-nowrap ${isSelected ? "font-semibold text-[#222222]" : "font-medium"}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex p-1.5 rounded-full border border-[#DDDDDD] hover:shadow-md transition text-[#222222] bg-white flex-shrink-0"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Filters Button */}
        <button
          onClick={onOpenFilters}
          className="flex items-center gap-2 border border-[#DDDDDD] rounded-xl px-4 py-2.5 hover:border-[#222222] hover:shadow-sm transition text-xs font-semibold text-[#222222] flex-shrink-0 bg-white"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {filterCount > 0 && (
            <span className="bg-[#222222] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {filterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
