"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthPersona } from "@/context/AuthPersonaContext";
import {
  Briefcase,
  MessageSquare,
  User,
  Menu,
  X,
  Luggage,
  Heart,
  Home,
  Star,
  Calendar,
  MapPin
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { persona, switchToHosting, switchToTravelling, isHost } = useAuthPersona();

  const [activeTab, setActiveTab] = useState<"about" | "trips" | "connections">("about");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [workText, setWorkText] = useState("Student");
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col">
      {/* ============================================================ */}
      {/* 1. TOP HEADER MATCHING SCREENSHOT                            */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#EBEBEB] px-6 sm:px-12 py-4 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <svg
            className="h-8 w-auto text-[#FF385C] transition-transform group-hover:scale-105"
            viewBox="0 0 32 32"
            fill="currentColor"
          >
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.371c0 4.14-3.328 7.75-8.5 7.75-3.08 0-5.836-1.503-7.5-3.873-1.664 2.37-4.42 3.873-7.5 3.873-5.172 0-8.5-3.61-8.5-7.75 0-1.127.284-2.22.971-3.767l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C8.537 1.963 9.992 1 12 1h4zm0 2.5h-4c-1.144 0-2.083.568-3.083 2.387l-.462.887C6.54 10.536 2.42 19.167 1.48 21.36c-.57 1.306-.78 2.062-.78 2.89 0 2.98 2.348 5.25 6.3 5.25 3.018 0 5.485-1.742 6.577-4.444l.423-1.146.423 1.146c1.092 2.702 3.559 4.444 6.577 4.444 3.952 0 6.3-2.27 6.3-5.25 0-.828-.21-1.584-.78-2.89-.94-2.193-5.06-10.824-6.975-14.586l-.462-.887C19.083 4.068 18.144 3.5 17 3.5h-1zm0 13c2.485 0 4.5 2.015 4.5 4.5S18.485 24.5 16 24.5s-4.5-2.015-4.5-4.5 2.015-4.5 4.5-4.5zm0 2.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z" />
          </svg>
          <span className="font-bold text-xl tracking-tight text-[#FF385C] hidden md:inline">airbnb</span>
        </Link>

        {/* Right: Switch to hosting & Profile Menu */}
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => {
              if (isHost) {
                switchToTravelling();
                router.push("/");
              } else {
                switchToHosting();
                router.push("/hosting");
              }
            }}
            className="text-sm font-semibold text-[#222222] hover:bg-[#F7F7F7] px-4 py-2 rounded-full transition"
          >
            {isHost ? "Switch to travelling" : "Switch to hosting"}
          </button>

          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#DDDDDD] bg-[#EBEBEB] flex items-center justify-center">
            {persona.avatarUrl ? (
              <img src={persona.avatarUrl} alt={persona.fullName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-[#717171]" />
            )}
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-9 h-9 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:shadow-md transition bg-white"
            aria-label="Main menu"
          >
            <Menu className="w-4 h-4 text-[#222222]" />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-[#DDDDDD] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <Link
                href="/wishlists"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-left px-4 py-2 text-sm text-[#222222] hover:bg-[#F7F7F7] flex items-center gap-2.5"
              >
                <Heart className="w-4 h-4 text-[#717171]" />
                Wishlists
              </Link>
              <Link
                href="/trips"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-left px-4 py-2 text-sm text-[#222222] hover:bg-[#F7F7F7] flex items-center gap-2.5"
              >
                <Luggage className="w-4 h-4 text-[#717171]" />
                Trips
              </Link>
              <Link
                href="/messages"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-left px-4 py-2 text-sm text-[#222222] hover:bg-[#F7F7F7] flex items-center gap-2.5"
              >
                <MessageSquare className="w-4 h-4 text-[#717171]" />
                Messages
              </Link>
              <Link
                href="/hosting"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-left px-4 py-2 text-sm text-[#222222] hover:bg-[#F7F7F7] flex items-center gap-2.5"
              >
                <Home className="w-4 h-4 text-[#717171]" />
                Host Dashboard
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MAIN 2-COLUMN LAYOUT MATCHING SCREENSHOT EXACTLY          */}
      {/* ============================================================ */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-10 w-full flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar (Navigation) */}
        <aside className="w-full md:w-72 lg:w-80 md:border-r border-[#EBEBEB] md:pr-8 md:min-h-[550px] flex-shrink-0">
          <h1 className="text-3xl font-bold text-[#222222] mb-6">Profile</h1>

          <div className="space-y-1">
            {/* Tab 1: About me */}
            <button
              onClick={() => setActiveTab("about")}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition cursor-pointer text-left ${
                activeTab === "about"
                  ? "bg-[#F2F2F2] font-semibold text-[#222222]"
                  : "hover:bg-[#F7F7F7] text-[#222222] font-medium"
              }`}
            >
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#DDDDDD] flex-shrink-0">
                <img
                  src={persona.avatarUrl}
                  alt={persona.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm">About me</span>
            </button>

            {/* Tab 2: Past trips */}
            <button
              onClick={() => setActiveTab("trips")}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition cursor-pointer text-left ${
                activeTab === "trips"
                  ? "bg-[#F2F2F2] font-semibold text-[#222222]"
                  : "hover:bg-[#F7F7F7] text-[#222222] font-medium"
              }`}
            >
              {/* Illustrated Vintage Suitcase matching Screenshot */}
              <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 28 28" className="w-6 h-6">
                  <rect x="3" y="8" width="22" height="16" rx="3" fill="#A86E43" />
                  <rect x="4" y="9" width="20" height="14" rx="2" fill="#B98054" />
                  {/* Handle */}
                  <path d="M 10 8 L 10 5 C 10 4.5, 11 4, 12 4 L 16 4 C 17 4, 18 4.5, 18 5 L 18 8" fill="none" stroke="#6D4327" strokeWidth="2" />
                  {/* Straps */}
                  <line x1="8" y1="8" x2="8" y2="24" stroke="#6D4327" strokeWidth="1.5" />
                  <line x1="20" y1="8" x2="20" y2="24" stroke="#6D4327" strokeWidth="1.5" />
                  {/* Corner brass guards */}
                  <rect x="3" y="8" width="3" height="3" fill="#E5C158" />
                  <rect x="22" y="8" width="3" height="3" fill="#E5C158" />
                  {/* Travel sticker */}
                  <circle cx="14" cy="16" r="3" fill="#E74C3C" opacity="0.85" />
                </svg>
              </div>
              <span className="text-sm">Past trips</span>
            </button>

            {/* Tab 3: Connections */}
            <button
              onClick={() => setActiveTab("connections")}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition cursor-pointer text-left ${
                activeTab === "connections"
                  ? "bg-[#F2F2F2] font-semibold text-[#222222]"
                  : "hover:bg-[#F7F7F7] text-[#222222] font-medium"
              }`}
            >
              {/* Illustrated People Connection Avatars matching Screenshot */}
              <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 28 28" className="w-6 h-6">
                  {/* Person 1 (Adult) */}
                  <circle cx="9" cy="9" r="4" fill="#3B71CA" />
                  <path d="M 3 22 C 3 17, 7 15, 9 15 C 11 15, 15 17, 15 22" fill="#3B71CA" />
                  {/* Person 2 (Adult) */}
                  <circle cx="19" cy="10" r="4" fill="#E4A11B" />
                  <path d="M 13 22 C 13 17.5, 17 16, 19 16 C 21 16, 25 17.5, 25 22" fill="#E4A11B" />
                  {/* Child in front */}
                  <circle cx="14" cy="15" r="3" fill="#14A44D" />
                  <path d="M 10 24 C 10 20, 12 19, 14 19 C 16 19, 18 20, 18 24" fill="#14A44D" />
                </svg>
              </div>
              <span className="text-sm">Connections</span>
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <section className="flex-1 md:pl-10 lg:pl-16 pt-6 md:pt-0">
          {/* TAB 1: ABOUT ME (Matches Screenshot Exactly) */}
          {activeTab === "about" && (
            <div>
              {/* Title & Edit Button */}
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-[#222222]">About me</h2>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#DDDDDD] hover:bg-[#F7F7F7] text-xs font-semibold text-[#222222] transition cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Profile Card matching Screenshot */}
              <div className="mt-6 mb-8 w-full max-w-[340px] bg-white rounded-[32px] border border-[#EBEBEB] shadow-[0_6px_24px_rgba(0,0,0,0.06)] p-8 text-center">
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border border-[#EBEBEB]">
                  <img
                    src={persona.avatarUrl}
                    alt={persona.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-2xl font-bold text-[#222222] mt-4">{persona.fullName}</h3>
                <p className="text-xs text-[#717171] mt-0.5 capitalize">{persona.role.toLowerCase()}</p>
              </div>

              {/* Work Row */}
              <div className="flex items-center gap-3.5 text-sm text-[#222222]">
                <Briefcase className="w-5 h-5 text-[#222222] flex-shrink-0" />
                <span>My work: {workText}</span>
              </div>

              {/* Separator line */}
              <div className="h-px bg-[#EBEBEB] my-6 max-w-xl" />

              {/* Reviews Link */}
              <div
                onClick={() => setShowReviewsModal(true)}
                className="flex items-center gap-3.5 text-sm text-[#222222] cursor-pointer hover:underline group max-w-fit"
              >
                <MessageSquare className="w-5 h-5 text-[#222222] flex-shrink-0" />
                <span>Show reviews I’ve written</span>
              </div>
            </div>
          )}

          {/* TAB 2: PAST TRIPS */}
          {activeTab === "trips" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-3xl font-bold text-[#222222]">Past trips</h2>
              <div className="p-8 rounded-3xl border border-[#EBEBEB] bg-white text-center space-y-3">
                <p className="font-semibold text-base text-[#222222]">No past trips yet</p>
                <p className="text-xs text-[#717171]">When you complete trips booked on Airbnb, they will show up here.</p>
                <Link
                  href="/"
                  className="inline-block px-5 py-2.5 rounded-full bg-[#222222] text-white text-xs font-semibold hover:bg-black transition"
                >
                  Explore stays
                </Link>
              </div>
            </div>
          )}

          {/* TAB 3: CONNECTIONS */}
          {activeTab === "connections" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-3xl font-bold text-[#222222]">Connections</h2>
              <p className="text-xs text-[#717171]">Travel companions and friends connected with your Airbnb profile.</p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-[#EBEBEB] flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F7F7F7] font-bold text-sm text-[#222222] flex items-center justify-center">
                      AJ
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#222222]">Aarav Jain</h4>
                      <p className="text-xs text-[#717171]">Co-traveler on 2 stays</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700">Connected</span>
                </div>

                <div className="p-4 rounded-2xl border border-[#EBEBEB] flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F7F7F7] font-bold text-sm text-[#222222] flex items-center justify-center">
                      RM
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#222222]">Rhea Mehta</h4>
                      <p className="text-xs text-[#717171]">Co-traveler on 1 stay</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700">Connected</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Edit Work & Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#DDDDDD] w-full max-w-md p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBEBEB]">
              <h3 className="font-bold text-lg text-[#222222]">Edit About me</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#F7F7F7] text-[#222222]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#717171] mb-1">My work</label>
                <input
                  type="text"
                  value={workText}
                  onChange={(e) => setWorkText(e.target.value)}
                  placeholder="e.g. Student, Software Engineer, Designer"
                  className="w-full p-3 border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-[#222222] text-sm text-[#222222]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#EBEBEB] flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[#DDDDDD] text-xs font-semibold hover:bg-[#F7F7F7]"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2 rounded-full bg-[#222222] text-white text-xs font-semibold hover:bg-black"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Written Modal */}
      {showReviewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#DDDDDD] w-full max-w-lg p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBEBEB]">
              <h3 className="font-bold text-lg text-[#222222]">Reviews I’ve written</h3>
              <button
                onClick={() => setShowReviewsModal(false)}
                className="p-1 rounded-full hover:bg-[#F7F7F7] text-[#222222]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-8 text-center space-y-2 text-[#717171]">
              <p className="text-sm font-semibold text-[#222222]">No reviews written yet</p>
              <p className="text-xs">After completing stays, you can write reviews for hosts and they will appear here.</p>
            </div>

            <div className="pt-3 border-t border-[#EBEBEB] flex justify-end">
              <button
                onClick={() => setShowReviewsModal(false)}
                className="px-5 py-2 rounded-full bg-[#222222] text-white text-xs font-semibold hover:bg-black"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
