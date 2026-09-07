"use client";

import React, { useState } from "react";
import Navbar from "@/components/header/Navbar";
import { Star, ShieldCheck, CheckCircle2, MessageSquare, MapPin, X } from "lucide-react";

interface CoHost {
  id: number;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  reviewsCount: number;
  listingsManaged: number;
  responseRate: string;
  services: string[];
  bio: string;
}

const CO_HOSTS: CoHost[] = [
  {
    id: 1,
    name: "Rajesh Khanna",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
    location: "Sector 62, Noida",
    rating: 4.98,
    reviewsCount: 142,
    listingsManaged: 48,
    responseRate: "100% within 1 hour",
    services: ["Listing setup & photography", "Guest messaging 24/7", "Cleaning coordination", "Key exchange"],
    bio: "Superhost since 2019. Specializing in high-occupancy corporate flats and luxury stays across Noida sectors."
  },
  {
    id: 2,
    name: "Meenakshi Sen",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    location: "Indirapuram & Central Noida",
    rating: 4.95,
    reviewsCount: 98,
    listingsManaged: 32,
    responseRate: "99% within 2 hours",
    services: ["Interior styling", "Dynamic pricing optimization", "Professional turnover cleaning"],
    bio: "Passionate hospitality manager. I treat every property as my own and maintain an average 4.9+ guest review record."
  },
  {
    id: 3,
    name: "Vikram Batra",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    location: "Greater Noida & Expressway",
    rating: 4.92,
    reviewsCount: 64,
    listingsManaged: 18,
    responseRate: "100% within 30 min",
    services: ["In-person check-in", "Maintenance management", "Emergency repairs"],
    bio: "Local Greater Noida resident. Expert in villa management, pool maintenance, and long-term guest hospitality."
  }
];

export default function CoHostsPage() {
  const [selectedCoHost, setSelectedCoHost] = useState<CoHost | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setSelectedCoHost(null);
      setMessageText("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF385C]">Airbnb Co-Host Network</span>
          <h1 className="text-3xl font-bold text-[#222222] mt-1">Top-Rated Co-Hosts in Noida & Delhi NCR</h1>
          <p className="text-sm text-[#717171] mt-1 max-w-2xl">
            Hire an experienced local co-host to take care of guest messaging, turnover cleaning, and check-in so you can earn hands-off income.
          </p>
        </div>

        {/* Co-Host Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CO_HOSTS.map((coHost) => (
            <div
              key={coHost.id}
              className="bg-white border border-[#DDDDDD] rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={coHost.avatar}
                    alt={coHost.name}
                    className="w-14 h-14 rounded-full object-cover border border-[#DDDDDD] flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-base text-[#222222]">{coHost.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-[#717171]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{coHost.location}</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-xs text-[#222222] mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-[#222222]" />
                      <span>{coHost.rating.toFixed(2)}</span>
                      <span className="text-[#717171] font-normal">({coHost.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#717171] leading-relaxed line-clamp-3">{coHost.bio}</p>

                <div className="p-3 bg-[#F7F7F7] rounded-2xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#717171]">Listings managed</span>
                    <span className="font-bold text-[#222222]">{coHost.listingsManaged} homes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#717171]">Response rate</span>
                    <span className="font-bold text-emerald-700">{coHost.responseRate}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-bold text-[#717171] uppercase tracking-wider">Services offered</p>
                  <div className="flex flex-wrap gap-1.5">
                    {coHost.services.map((s) => (
                      <span key={s} className="text-[11px] bg-white border border-[#DDDDDD] px-2.5 py-1 rounded-full text-[#222222]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCoHost(coHost)}
                className="w-full mt-6 py-2.5 rounded-full border border-[#222222] hover:bg-[#222222] hover:text-white transition text-xs font-bold text-[#222222] cursor-pointer"
              >
                Contact {coHost.name.split(" ")[0]}
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Contact Co-Host Modal */}
      {selectedCoHost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#DDDDDD] w-full max-w-lg p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBEBEB]">
              <div className="flex items-center gap-2.5">
                <img src={selectedCoHost.avatar} alt="Co-Host" className="w-8 h-8 rounded-full object-cover" />
                <h3 className="font-bold text-base text-[#222222]">Message {selectedCoHost.name}</h3>
              </div>
              <button onClick={() => setSelectedCoHost(null)} className="p-1 rounded-full hover:bg-[#F7F7F7]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {sentSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base text-[#222222]">Inquiry Sent!</h4>
                <p className="text-xs text-[#717171]">
                  {selectedCoHost.name} will respond to your property inquiry shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="py-4 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#717171] mb-1">Tell {selectedCoHost.name} about your property</label>
                  <textarea
                    rows={4}
                    required
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Hi! I have a 2BHK flat in Noida Sector 62 and am looking for co-hosting support..."
                    className="w-full p-3 border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-[#222222] text-sm text-[#222222]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#EBEBEB]">
                  <button
                    type="button"
                    onClick={() => setSelectedCoHost(null)}
                    className="px-4 py-2 rounded-full border border-[#DDDDDD] font-semibold hover:bg-[#F7F7F7]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#FF385C] hover:bg-[#E00B41] text-white font-semibold transition"
                  >
                    Send message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
