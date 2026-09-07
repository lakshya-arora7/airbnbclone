"use client";

import React, { useEffect, useRef } from "react";
import { Plus, Minus } from "lucide-react";

interface TripLocation {
  id: number;
  title: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  image?: string;
  dates: string;
}

interface TripsWorldMapProps {
  trips?: TripLocation[];
}

export default function TripsWorldMap({ trips = [] }: TripsWorldMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function initWorldMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      const L = (await import("leaflet")).default;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // World center matching Screenshot 1
      const initialCenter: [number, number] = [25, 10];
      const initialZoom = 2;

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false,
        scrollWheelZoom: true,
        attributionControl: false,
      });

      // CartoDB Voyager tiles with English labels
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      // Add markers if trips exist
      if (trips.length > 0) {
        const bounds: [number, number][] = [];

        trips.forEach((trip) => {
          bounds.push([trip.lat, trip.lng]);

          const iconHtml = `
            <div style="
              background-color: #FF385C;
              color: white;
              padding: 6px 10px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 700;
              box-shadow: 0 3px 12px rgba(0,0,0,0.25);
              white-space: nowrap;
              border: 2px solid #FFFFFF;
              display: flex;
              align-items: center;
              gap: 5px;
            ">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
              <span>${trip.city}</span>
            </div>
          `;

          const customIcon = L.divIcon({
            html: iconHtml,
            className: "trip-map-pin",
            iconSize: [80, 30],
            iconAnchor: [40, 15],
          });

          const popupContent = `
            <div style="min-width: 180px; font-family: sans-serif;">
              ${trip.image ? `<img src="${trip.image}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />` : ""}
              <div style="font-weight: 700; font-size: 12px; color: #222;">${trip.title}</div>
              <div style="font-size: 11px; color: #717171; margin-top: 2px;">${trip.city}, ${trip.country}</div>
              <div style="font-size: 10px; color: #FF385C; font-weight: 600; margin-top: 4px;">${trip.dates}</div>
            </div>
          `;

          L.marker([trip.lat, trip.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(popupContent, { offset: [0, -10] });
        });

        if (bounds.length > 0) {
          try {
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 6 });
          } catch (e) {
            console.error(e);
          }
        }
      }

      mapInstanceRef.current = map;
    }

    initWorldMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [trips]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-full bg-[#E5E3DF] rounded-3xl overflow-hidden border border-[#E0E0E0] shadow-xs">
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px] lg:min-h-[640px] z-0" />

      {/* Top Right Zoom Controls matching Screenshot 1 */}
      <div className="absolute top-6 right-6 z-10 flex flex-col bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.15)] overflow-hidden border border-[#DDDDDD]">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-2.5 hover:bg-[#F7F7F7] text-[#222222] transition border-b border-[#EBEBEB] cursor-pointer flex items-center justify-center"
          aria-label="Zoom in"
        >
          <Plus className="w-4 h-4 text-[#484848] stroke-[2.5]" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-2.5 hover:bg-[#F7F7F7] text-[#222222] transition cursor-pointer flex items-center justify-center"
          aria-label="Zoom out"
        >
          <Minus className="w-4 h-4 text-[#484848] stroke-[2.5]" />
        </button>
      </div>

      {/* Bottom Left Google Style Badge matching Screenshot 1 */}
      <div className="absolute bottom-2.5 left-3 z-10 select-none pointer-events-none">
        <span className="text-[14px] font-medium tracking-tight text-[#444444] bg-white/80 px-1.5 py-0.5 rounded shadow-2xs">
          Google
        </span>
      </div>

      {/* Bottom Right Attribution Bar matching Screenshot 1 */}
      <div className="absolute bottom-2 right-3 z-10 flex items-center gap-3 text-[10px] text-[#555555] bg-white/80 px-2 py-0.5 rounded shadow-2xs backdrop-blur-2xs select-none pointer-events-none">
        <span className="hover:underline cursor-pointer">Keyboard shortcuts</span>
        <span>Map Data ©2026</span>
        <span>1000 km</span>
        <span className="hover:underline cursor-pointer">Terms</span>
      </div>
    </div>
  );
}
