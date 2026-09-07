"use client";

import React, { useState } from "react";
import { Grid, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ListingImage } from "@/types";

interface PhotoMosaicProps {
  images: ListingImage[];
  title: string;
}

export default function PhotoMosaic({ images, title }: PhotoMosaicProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const displayImages = images.length > 0
    ? images
    : [{ id: 1, url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80", displayOrder: 1, isPrimary: true }];

  const primaryImage = displayImages[0];
  const sideImages = displayImages.slice(1, 5);

  return (
    <>
      {/* 5-Photo Mosaic Grid */}
      <div className="relative rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-2 h-[340px] sm:h-[420px] md:h-[480px]">
        {/* Main Large Image (Spans 2 columns, full height) */}
        <div
          onClick={() => {
            setActivePhotoIndex(0);
            setIsGalleryOpen(true);
          }}
          className="md:col-span-2 h-full relative cursor-pointer group overflow-hidden bg-[#EBEBEB]"
        >
          <img
            src={primaryImage.url}
            alt={`${title} main view`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* 4 Quadrant Images (2x2 grid on right) */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
          {sideImages.map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => {
                setActivePhotoIndex(idx + 1);
                setIsGalleryOpen(true);
              }}
              className="relative h-full cursor-pointer group overflow-hidden bg-[#EBEBEB]"
            >
              <img
                src={img.url}
                alt={`${title} view ${idx + 2}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}

          {/* Fill placeholders if fewer than 4 side images */}
          {Array.from({ length: Math.max(0, 4 - sideImages.length) }).map((_, idx) => (
            <div key={`ph-${idx}`} className="bg-[#F7F7F7] h-full" />
          ))}
        </div>

        {/* "Show all photos" floating button */}
        <button
          onClick={() => setIsGalleryOpen(true)}
          className="absolute bottom-5 right-5 bg-white/95 hover:bg-white text-[#222222] text-xs font-semibold px-4 py-2 rounded-xl shadow-md border border-[#222222]/20 flex items-center gap-2 transition hover:scale-105"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Show all {displayImages.length} photos</span>
        </button>
      </div>

      {/* Full Gallery Lightbox Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between text-white py-2">
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition"
            >
              <X className="w-5 h-5" />
              <span>Close</span>
            </button>
            <span className="text-xs font-medium">
              {activePhotoIndex + 1} / {displayImages.length}
            </span>
          </div>

          {/* Main Photo View */}
          <div className="relative flex-1 flex items-center justify-center max-w-5xl mx-auto w-full my-4">
            <img
              src={displayImages[activePhotoIndex].url}
              alt={`${title} photo`}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            {/* Navigation Chevrons */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActivePhotoIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
                  }
                  className="absolute left-2 sm:left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setActivePhotoIndex((prev) => (prev + 1) % displayImages.length)}
                  className="absolute right-2 sm:right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails Strip */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {displayImages.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 transition border-2 ${
                  idx === activePhotoIndex ? "border-[#FF385C] scale-105" : "border-transparent opacity-60"
                }`}
              >
                <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
