"use client";

import React, { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Plus, Minus, RotateCcw } from "lucide-react";
import { Listing } from "@/types";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";

interface SearchMapProps {
  listings: Listing[];
  hoveredListingId: number | null;
  onHoverListing: (id: number | null) => void;
  onSelectListing: (id: number) => void;
}

export default function SearchMap({
  listings,
  hoveredListingId,
  onHoverListing,
  onSelectListing,
}: SearchMapProps) {
  const { formatPrice } = useLanguageCurrency();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<number, any>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Keep callbacks stable in refs to avoid recreating markers on callback identity changes
  const onSelectRef = useRef(onSelectListing);
  onSelectRef.current = onSelectListing;
  const onHoverRef = useRef(onHoverListing);
  onHoverRef.current = onHoverListing;

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      const L = (await import("leaflet")).default;

      // Avoid double initialization
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.stop();
          mapInstanceRef.current.remove();
        } catch {}
        mapInstanceRef.current = null;
      }

      if (!mapContainerRef.current) return;
      try {
        (mapContainerRef.current as any)._leaflet_id = null;
      } catch {}

      const centerLat = 28.585;
      const centerLng = 77.365;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 12,
        zoomControl: false,
        scrollWheelZoom: true,
        attributionControl: false,
      });

      // Reliable OpenStreetMap tiles with Voyager styling
      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          subdomains: ["a", "b", "c"],
        }
      ).addTo(map);

      mapInstanceRef.current = map;

      setTimeout(() => {
        try {
          map.invalidateSize();
        } catch {}
      }, 150);

      setTimeout(() => {
        try {
          map.invalidateSize();
        } catch {}
      }, 400);

      if (isMounted) {
        setIsMapReady(true);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.stop();
          mapInstanceRef.current.off();
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn("Map unmount notice:", e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 1. Build markers ONLY when listings, map readiness, or currency change
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;
    let isCancelled = false;

    async function createMarkers() {
      const L = (await import("leaflet")).default;
      if (isCancelled || !mapInstanceRef.current) return;
      const map = mapInstanceRef.current;

      // Cleanly remove existing markers
      Object.values(markersRef.current).forEach((marker: any) => {
        try {
          map.removeLayer(marker);
        } catch {}
      });
      markersRef.current = {};

      if (!listings || listings.length === 0) return;

      const bounds: [number, number][] = [];

      listings.forEach((listing) => {
        if (!listing.latitude || !listing.longitude) return;

        const pinText = formatPrice(listing.pricePerNight);
        const pinHtml = `
          <div class="airbnb-price-pin" id="map-pin-${listing.id}">
            <span>${pinText}</span>
          </div>
        `;

        const customIcon = L.divIcon({
          className: "custom-leaflet-div-icon",
          html: pinHtml,
          iconSize: [88, 36],
          iconAnchor: [44, 18],
        });

        const marker = L.marker([listing.latitude, listing.longitude], {
          icon: customIcon,
          zIndexOffset: 100,
        }).addTo(map);

        const imgUrl = listing.images?.[0]?.url || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500";
        const popupHtml = `
          <div style="width: 230px; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; cursor: pointer;">
            <div style="width: 100%; height: 135px; border-radius: 12px; overflow: hidden; position: relative; background: #EBEBEB;">
              <img src="${imgUrl}" alt="${listing.title}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="padding: 8px 2px 2px 2px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <p style="font-weight: 700; font-size: 13px; color: #222222; margin: 0; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${listing.title}
                </p>
                <span style="font-size: 12px; font-weight: 600; color: #222222; display: inline-flex; align-items: center; gap: 3px;">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#222222" stroke="#222222" style="display:inline-block;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  ${listing.rating.toFixed(1)}
                </span>
              </div>
              <p style="font-size: 11px; color: #717171; margin: 2px 0 6px 0;">${listing.city}, ${listing.country}</p>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #EBEBEB; padding-top: 6px;">
                <div>
                  <span style="font-weight: 700; font-size: 13px; color: #222222;">${pinText}</span>
                  <span style="font-size: 11px; color: #717171;"> night</span>
                </div>
                <a href="/rooms/${listing.id}" style="font-size: 11px; font-weight: 700; color: #FF385C; text-decoration: none;">View stay</a>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml, {
          maxWidth: 260,
          minWidth: 230,
          className: "airbnb-map-popup",
          closeButton: false,
          offset: [0, -14],
        });

        marker.on("click", () => {
          onSelectRef.current(listing.id);
          marker.openPopup();
        });

        marker.on("mouseover", () => {
          onHoverRef.current(listing.id);
        });

        marker.on("mouseout", () => {
          onHoverRef.current(null);
        });

        markersRef.current[listing.id] = marker;
        bounds.push([listing.latitude, listing.longitude]);
      });

      // Safely fit map bounds without triggering animation race condition
      if (bounds.length > 0 && mapInstanceRef.current) {
        try {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14, animate: false });
        } catch (e) {
          console.warn("fitBounds notice:", e);
        }
      }
    }

    createMarkers();

    return () => {
      isCancelled = true;
    };
  }, [listings, isMapReady, formatPrice]);

  // 2. Update hover styles purely in DOM / zIndex without tearing down markers
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([idStr, marker]) => {
      const id = Number(idStr);
      const isHovered = id === hoveredListingId;
      try {
        const el = marker?.getElement();
        if (el) {
          const pin = el.querySelector(".airbnb-price-pin");
          if (pin) {
            if (isHovered) {
              pin.classList.add("active-pin");
            } else {
              pin.classList.remove("active-pin");
            }
          }
        }
        marker?.setZIndexOffset(isHovered ? 1000 : 100);
      } catch {}
    });
  }, [hoveredListingId]);

  // Recalculate map size on container resize / fullscreen toggle
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        try {
          mapInstanceRef.current?.invalidateSize();
        } catch {}
      }, 200);
    }
  }, [isFullscreen]);

  const handleZoomIn = () => {
    try {
      mapInstanceRef.current?.zoomIn();
    } catch {}
  };

  const handleZoomOut = () => {
    try {
      mapInstanceRef.current?.zoomOut();
    } catch {}
  };

  const handleResetCenter = () => {
    if (mapInstanceRef.current && listings.length > 0) {
      const bounds = listings.map((l) => [l.latitude, l.longitude] as [number, number]);
      try {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13, animate: false });
        return;
      } catch {}
    }
    try {
      mapInstanceRef.current?.setView([28.585, 77.365], 12);
    } catch {}
  };

  return (
    <div
      className={`relative w-full h-full bg-[#E5E3DF] overflow-hidden transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "rounded-3xl"
      }`}
    >
      {/* Actual Live Interactive Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-10 h-10 bg-white/95 backdrop-blur-xs rounded-xl shadow-md border border-[#DDDDDD] flex items-center justify-center hover:bg-white text-[#222222] transition active:scale-95 cursor-pointer"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <button
          onClick={handleResetCenter}
          className="w-10 h-10 bg-white/95 backdrop-blur-xs rounded-xl shadow-md border border-[#DDDDDD] flex items-center justify-center hover:bg-white text-[#222222] transition active:scale-95 cursor-pointer"
          title="Reset Center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="bg-white/95 backdrop-blur-xs rounded-xl shadow-md border border-[#DDDDDD] overflow-hidden flex flex-col">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#F7F7F7] text-[#222222] transition border-b border-[#EBEBEB] active:scale-95 cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#F7F7F7] text-[#222222] transition active:scale-95 cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
