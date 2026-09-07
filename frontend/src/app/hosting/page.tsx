"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  LayoutGrid,
  List,
  Search,
  Settings,
  ArrowUp,
  X,
  Check,
  AlertCircle,
  Clock,
  MapPin,
  Users,
  Edit3,
  Trash2,
  ExternalLink,
  Keyboard,
  RotateCw,
  Phone,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Lock,
  Bath,
  Waves,
  Wind,
  Home,
  Languages,
} from "lucide-react";
import { useAuthPersona } from "@/context/AuthPersonaContext";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";
import { Listing } from "@/types";
import { api } from "@/lib/api";
import CreateListingModal from "@/components/hosting/CreateListingModal";
import EditListingModal from "@/components/hosting/EditListingModal";
import ModifyBookingModal from "@/components/hosting/ModifyBookingModal";
import ListingBookingsModal from "@/components/hosting/ListingBookingsModal";

type HostTab = "today" | "calendar" | "listings" | "messages";

interface MessageItem {
  id: number;
  sender: "guest" | "host" | "system";
  senderName: string;
  text: string;
  time: string;
}

interface ChatThread {
  id: number;
  guestName: string;
  guestAvatar: string;
  guestRating: number;
  reservationDates: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  listingTitle: string;
  totalPayout: number;
  confirmationCode: string;
  phoneNumber: string;
  lastMessageSnippet: string;
  lastMessageDate: string;
  unread: boolean;
  messages: MessageItem[];
}

const MONTH_NAMES = [
  "August 2026",
  "September 2026",
  "October 2026",
  "November 2026",
];

export default function HostDashboardPage() {
  const router = useRouter();
  const { persona, switchToTravelling, switchToHosting } = useAuthPersona();
  const { formatPrice, currentCurrency, t, openLanguageModal } = useLanguageCurrency();

  // Active Main Host Tab
  const [activeTab, setActiveTab] = useState<HostTab>("today");

  // Verify Identity Banner status
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // Today tab state: "today" vs "upcoming"
  const [todayFilter, setTodayFilter] = useState<"today" | "upcoming">("today");

  // Calendar tab state
  const [monthIndex, setMonthIndex] = useState(1); // Default to September 2026
  const calendarMonth = MONTH_NAMES[monthIndex];
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number | null>(7);
  const [blockedDates, setBlockedDates] = useState<number[]>([15, 16]);
  const [customPricePerNight, setCustomPricePerNight] = useState<number>(2200);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [weeklyDiscount, setWeeklyDiscount] = useState(10);
  const [monthlyDiscount, setMonthlyDiscount] = useState(25);
  const [isDiscountsModalOpen, setIsDiscountsModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [minNights, setMinNights] = useState(1);
  const [maxNights, setMaxNights] = useState(365);
  const [advanceNotice, setAdvanceNotice] = useState("Same day");
  const [isCancellationsModalOpen, setIsCancellationsModalOpen] = useState(false);
  const [cancellationPolicy, setCancellationPolicy] = useState("Flexible");
  const [isKeyboardModalOpen, setIsKeyboardModalOpen] = useState(false);

  // Listings tab state
  const [listingsViewMode, setListingsViewMode] = useState<"grid" | "list">("grid");
  const [isCreateListingModalOpen, setIsCreateListingModalOpen] = useState(false);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [primaryListingStatus, setPrimaryListingStatus] = useState<"action_required" | "published">("published");
  const [listingSearchQuery, setListingSearchQuery] = useState("");
  const [listingStatusFilter, setListingStatusFilter] = useState<"all" | "active" | "draft">("all");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Edit Listing & Modify Booking Modal States
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [isEditListingModalOpen, setIsEditListingModalOpen] = useState<boolean>(false);
  const [activeListingForBookings, setActiveListingForBookings] = useState<Listing | null>(null);
  const [isListingBookingsModalOpen, setIsListingBookingsModalOpen] = useState<boolean>(false);
  const [editingBooking, setEditingBooking] = useState<any | null>(null);
  const [isModifyBookingModalOpen, setIsModifyBookingModalOpen] = useState<boolean>(false);

  // Messages & Reservations state from live backend
  const [hostReservations, setHostReservations] = useState<any[]>([]);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
  const [chatFilter, setChatFilter] = useState<"all" | "unread">("all");
  const [chatInput, setChatInput] = useState("");
  const [isHostReservationOpen, setIsHostReservationOpen] = useState(true);

  const activeThread = chatThreads.find((t) => t.id === activeThreadId) || chatThreads[0] || null;

  // Load host listings and reservations from live backend API
  useEffect(() => {
    // When on hosting dashboard, ensure hosting persona
    if (persona.role !== "HOST") {
      switchToHosting();
    }
    const hostIdToQuery = persona.id === 2 ? 2 : (persona.id || 2);

    const loadHostData = () => {
      api.getHostListings(hostIdToQuery).then((liveListings) => {
        setUserListings(liveListings || []);
      });
    };

    loadHostData();

    const handleUpdate = () => loadHostData();
    window.addEventListener("airbnb_listings_updated", handleUpdate);

    api.getHostReservations(hostIdToQuery).then((resList) => {
      const reservations = resList || [];
      setHostReservations(reservations);
      if (reservations.length > 0) {
        const threads: ChatThread[] = reservations.map((res: any) => {
          const guestName = res.guest?.full_name || `Guest #${res.guest_id}`;
          const guestAvatar = res.guest?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
          const checkInDate = new Date(res.check_in);
          const checkOutDate = new Date(res.check_out);
          return {
            id: res.id,
            guestName,
            guestAvatar,
            guestRating: 5.0,
            reservationDates: `${checkInDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${checkOutDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
            checkIn: `${checkInDate.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}`,
            checkOut: `${checkOutDate.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}`,
            guestsCount: res.guests_count,
            listingTitle: res.listing?.title || "Property",
            totalPayout: res.total_price,
            confirmationCode: res.confirmation_code,
            phoneNumber: "+91 98765 43210",
            lastMessageSnippet: res.status === "COMPLETED" ? "Thank you for hosting me! Left a 5-star review." : `Booking confirmed for ${res.guests_count} guests.`,
            lastMessageDate: new Date(res.created_at || res.check_in).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            unread: false,
            messages: [
              {
                id: 1,
                sender: "system",
                senderName: "Airbnb",
                text: `Reservation ${res.status.toLowerCase()} · ${res.confirmation_code} · ${res.total_nights} nights`,
                time: new Date(res.created_at || res.check_in).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              },
              {
                id: 2,
                sender: "guest",
                senderName: guestName.split(" ")[0],
                text: res.status === "COMPLETED"
                  ? "Thank you so much for the wonderful stay! Everything was spotless and well organized."
                  : "Hello! Looking forward to our upcoming stay. Let us know if there are any specific check-in instructions.",
                time: "Check-in inquiry",
              }
            ],
          };
        });
        setChatThreads(threads);
        setActiveThreadId(threads[0].id);
      } else {
        setChatThreads([]);
        setActiveThreadId(null);
      }
    });

    return () => {
      window.removeEventListener("airbnb_listings_updated", handleUpdate);
    };
  }, [persona.id, persona.role, switchToHosting]);

  const handleSwitchToTravelling = () => {
    switchToTravelling();
    router.push("/");
  };

  const handleSendHostMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !chatInput.trim()) return;

    const newMsg: MessageItem = {
      id: Date.now(),
      sender: "host",
      senderName: "You",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };

    setChatThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === activeThread.id) {
          return {
            ...thread,
            lastMessageSnippet: newMsg.text,
            lastMessageDate: "Just now",
            messages: [...thread.messages, newMsg],
          };
        }
        return thread;
      })
    );

    setChatInput("");
  };

  const handleToggleBlockDate = (day: number) => {
    setBlockedDates((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Called when a new listing is published via the interactive CreateListingModal
  const handleListingCreated = (created: Listing) => {
    setUserListings((prev) => [created, ...prev]);
    setActiveTab("listings");
    setSuccessToast(`"${created.title}" successfully published to database and added to your listings!`);
    setTimeout(() => setSuccessToast(null), 6000);
  };

  // Delete a listing from the database and UI state
  const handleDeleteListing = async (listingId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to remove this listing?")) return;
    await api.deleteListing(listingId, persona.id || 2);
    setUserListings((prev) => prev.filter((l) => l.id !== listingId));
    setSuccessToast("Listing removed successfully.");
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleOpenEditListing = (listing: Listing) => {
    setEditingListing(listing);
    setIsEditListingModalOpen(true);
  };

  const handleListingUpdated = (updated: Listing) => {
    setUserListings((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setSuccessToast(`"${updated.title}" updated successfully!`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const handleOpenListingBookings = (listing: Listing) => {
    setActiveListingForBookings(listing);
    setIsListingBookingsModalOpen(true);
  };

  const handleOpenModifyBooking = (booking: any) => {
    setEditingBooking(booking);
    setIsModifyBookingModalOpen(true);
  };

  const handleBookingUpdated = (updated: any) => {
    setHostReservations((prev) =>
      prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b))
    );
    setSuccessToast(
      `Reservation #${updated.confirmation_code || updated.confirmationCode} updated successfully!`
    );
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const filteredThreads = chatFilter === "unread"
    ? chatThreads.filter((t) => t.unread)
    : chatThreads;

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#222222] flex flex-col font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP HOST NAVBAR MATCHING SCREENSHOTS 1, 2, 3, 4                        */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#EBEBEB] px-4 sm:px-8 h-20 grid grid-cols-[1fr_auto_1fr] items-center shadow-2xs">
        {/* Left: Brand Logo matching Screenshots */}
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0" title="Airbnb">
            <svg
              className="h-8.5 w-auto text-[#FF385C] transition-transform group-hover:scale-105"
              viewBox="0 0 32 32"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.371c0 4.14-3.328 7.75-8.5 7.75-3.08 0-5.836-1.503-7.5-3.873-1.664 2.37-4.42 3.873-7.5 3.873-5.172 0-8.5-3.61-8.5-7.75 0-1.127.284-2.22.971-3.767l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C8.537 1.963 9.992 1 12 1h4zm0 2.5h-4c-1.144 0-2.083.568-3.083 2.387l-.462.887C6.54 10.536 2.42 19.167 1.48 21.36c-.57 1.306-.78 2.062-.78 2.89 0 2.98 2.348 5.25 6.3 5.25 3.018 0 5.485-1.742 6.577-4.444l.423-1.146.423 1.146c1.092 2.702 3.559 4.444 6.577 4.444 3.952 0 6.3-2.27 6.3-5.25 0-.828-.21-1.584-.78-2.89-.94-2.193-5.06-10.824-6.975-14.586l-.462-.887C19.083 4.068 18.144 3.5 17 3.5h-1zm0 13c2.485 0 4.5 2.015 4.5 4.5S18.485 24.5 16 24.5s-4.5-2.015-4.5-4.5 2.015-4.5 4.5-4.5zm0 2.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z" />
            </svg>
            <span className="font-bold text-xl tracking-tight text-[#FF385C] hidden sm:inline">airbnb</span>
          </Link>
        </div>

        {/* Center: The 4 Host Tabs (Today, Calendar, Listings, Messages) - Perfectly Centered */}
        <div className="flex items-center justify-center">
          <nav className="flex items-center gap-6 sm:gap-10 h-full">
            {(["today", "calendar", "listings", "messages"] as HostTab[]).map((tab) => {
              const isActive = activeTab === tab;
              const labelMap: Record<HostTab, string> = {
                today: "Today",
                calendar: "Calendar",
                listings: "Listings",
                messages: "Messages",
              };

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 text-sm font-semibold relative transition cursor-pointer ${
                    isActive ? "text-[#222222]" : "text-[#717171] hover:text-[#222222]"
                  }`}
                >
                  <span>{labelMap[tab]}</span>
                  {isActive && (
                    <span className="absolute -bottom-3 left-0 right-0 h-[2.5px] bg-[#222222] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Switch to travelling & Persona Avatar */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleSwitchToTravelling}
            className="text-sm font-semibold text-[#222222] hover:bg-[#F7F7F7] px-4 py-2 rounded-full transition cursor-pointer hidden sm:inline-block"
          >
            Switch to travelling
          </button>

          <div
            onClick={handleSwitchToTravelling}
            className="w-9 h-9 rounded-full overflow-hidden border border-[#DDDDDD] bg-[#EBEBEB] cursor-pointer hover:ring-2 hover:ring-[#222222] transition"
            title="Profile"
          >
            {persona.avatarUrl ? (
              <img src={persona.avatarUrl} alt={persona.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-xs">
                {persona.fullName[0]}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. VERIFY YOUR IDENTITY BANNER MATCHING SCREENSHOTS 1, 2, 3, 4            */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto px-4 w-full pt-6 pb-2">
        <div
          onClick={() => setIsVerifyModalOpen(true)}
          className="bg-white rounded-3xl border border-[#DDDDDD] p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition cursor-pointer max-w-xl mx-auto"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center flex-shrink-0 border border-rose-200">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shadow-xs text-white ${
              isIdentityVerified ? "bg-emerald-600" : "bg-[#E00B41]"
            }`}>
              {isIdentityVerified ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-base text-[#222222]">
              {isIdentityVerified ? "Identity Verified" : "Verify your identity"}
            </h4>
            <p className="text-xs text-[#717171] mt-0.5">
              {isIdentityVerified
                ? "Your official government ID is approved. Your listings are active!"
                : "Required to publish"}
            </p>
          </div>

          <div className="text-xs font-semibold text-[#222222] underline">
            {isIdentityVerified ? "View details" : "Get started"}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB 1: TODAY (Matching Screenshot 1)                                   */}
      {/* ========================================================================= */}
      {activeTab === "today" && (
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col items-center">
          {/* Segmented Pills: [ Today ] and [ Upcoming ] matching Screenshot 1 */}
          <div className="flex items-center gap-2 mb-10">
            <button
              onClick={() => setTodayFilter("today")}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition cursor-pointer ${
                todayFilter === "today"
                  ? "bg-[#222222] text-white shadow-xs"
                  : "bg-white text-[#222222] border border-[#DDDDDD] hover:bg-[#F7F7F7]"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTodayFilter("upcoming")}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition cursor-pointer ${
                todayFilter === "upcoming"
                  ? "bg-[#222222] text-white shadow-xs"
                  : "bg-white text-[#222222] border border-[#DDDDDD] hover:bg-[#F7F7F7]"
              }`}
            >
              Upcoming ({hostReservations.length})
            </button>
          </div>

          {todayFilter === "today" ? (
            /* Empty state with open notebook graphic matching Screenshot 1 */
            <div className="flex flex-col items-center text-center space-y-5 max-w-md mx-auto pt-4">
              <div className="w-56 h-56 flex items-center justify-center">
                <img
                  src="/images/host-notebook.jpg"
                  alt="You don't have any reservations"
                  className="w-full h-full object-contain drop-shadow-sm hover:scale-105 transition duration-300"
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222222]">
                  You don’t have any reservations
                </h2>
                <p className="text-sm text-[#717171] max-w-sm mx-auto leading-relaxed">
                  To get booked, you’ll need to complete and publish your listing.
                </p>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setActiveTab("listings")}
                  className="px-6 py-3 bg-[#222222] text-white text-xs font-bold rounded-xl hover:bg-black transition cursor-pointer shadow-xs"
                >
                  View your listings
                </button>
                <button
                  onClick={() => setTodayFilter("upcoming")}
                  className="px-6 py-3 bg-white text-[#222222] border border-[#DDDDDD] text-xs font-bold rounded-xl hover:bg-[#F7F7F7] transition cursor-pointer"
                >
                  Check upcoming stays
                </button>
              </div>
            </div>
          ) : (
            /* Upcoming reservations list from live database */
            hostReservations.length === 0 ? (
              <div className="flex flex-col items-center text-center space-y-4 py-12">
                <div className="w-40 h-40 flex items-center justify-center">
                  <img
                    src="/images/host-notebook.jpg"
                    alt="No upcoming stays"
                    className="w-full h-full object-contain opacity-80"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#222222]">No upcoming stays found</h3>
                <p className="text-xs text-[#717171] max-w-sm">
                  When guests book your listings, their reservations will appear here.
                </p>
              </div>
            ) : (
              <div className="w-full max-w-2xl space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-[#222222]">Upcoming Guest Stays</h3>
                  <span className="text-xs text-[#717171]">{hostReservations.length} reservations</span>
                </div>

                {hostReservations.map((booking) => {
                  const guestName = booking.guest?.full_name || `Guest #${booking.guest_id}`;
                  const guestAvatar = booking.guest?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
                  const checkInStr = new Date(booking.check_in).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  const checkOutStr = new Date(booking.check_out).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                  return (
                    <div
                      key={booking.id}
                      className="bg-white rounded-2xl border border-[#DDDDDD] p-5 shadow-xs flex items-center justify-between gap-4 hover:border-[#222222] transition"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={guestAvatar}
                          alt={guestName}
                          className="w-13 h-13 rounded-full object-cover border border-[#DDDDDD]"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-[#222222]">{guestName}</h4>
                          <p className="text-xs text-[#717171]">{booking.listing?.title || "Property"}</p>
                          <p className="text-xs font-semibold text-[#222222] mt-1">
                            {checkInStr} – {checkOutStr} · {booking.guests_count} guests
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-2">
                        <div>
                          <span className="text-sm font-bold text-emerald-700">
                            +{formatPrice(booking.total_price)}
                          </span>
                          <p className="text-[11px] text-[#717171] font-semibold uppercase">{booking.status}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleOpenModifyBooking(booking)}
                            className="text-xs font-bold text-sky-700 underline hover:text-sky-900 cursor-pointer flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Modify booking</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab("messages");
                              setActiveThreadId(booking.id);
                            }}
                            className="text-xs font-bold text-[#222222] underline hover:text-black cursor-pointer"
                          >
                            Message guest
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </main>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 2: CALENDAR (Matching Screenshot 2)                                */}
      {/* ========================================================================= */}
      {activeTab === "calendar" && (
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-[#EBEBEB] rounded-3xl p-6 shadow-sm min-h-[720px]">
            {/* Left/Main Column: Calendar Month Grid */}
            <div className="lg:col-span-8 flex flex-col">
              {/* Calendar Controls Bar */}
              <div className="flex items-center justify-between pb-6 mb-4 border-b border-[#F0F0F0]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222222]">
                      {calendarMonth}
                    </h2>
                    <ChevronDown className="w-5 h-5 text-[#222222]" />
                  </div>

                  {/* Prev / Next Month arrows */}
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => setMonthIndex((prev) => Math.max(0, prev - 1))}
                      disabled={monthIndex === 0}
                      className="p-1.5 rounded-full hover:bg-[#F7F7F7] disabled:opacity-30 cursor-pointer"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setMonthIndex((prev) => Math.min(MONTH_NAMES.length - 1, prev + 1))}
                      disabled={monthIndex === MONTH_NAMES.length - 1}
                      className="p-1.5 rounded-full hover:bg-[#F7F7F7] disabled:opacity-30 cursor-pointer"
                      title="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-1 border border-[#DDDDDD] rounded-xl px-3 py-1.5 text-xs font-bold text-[#222222]">
                    <span>Month</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                  <button
                    onClick={() => setIsKeyboardModalOpen(true)}
                    className="p-2 border border-[#DDDDDD] rounded-xl text-[#717171] hover:text-[#222222] transition cursor-pointer"
                    title="Keyboard shortcuts"
                  >
                    <Keyboard className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#717171] pb-3">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              {/* Calendar Grid matching Screenshot 2 */}
              <div className="grid grid-cols-7 gap-2 flex-1">
                {/* Blank days before Tuesday 1 Sept 2026 */}
                <div className="min-h-[85px] p-2 bg-[#FAFAFA] rounded-2xl opacity-40" />
                <div className="min-h-[85px] p-2 bg-[#FAFAFA] rounded-2xl opacity-40" />

                {/* 30 Days of September 2026 */}
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  const isToday = day === 7; // Highlighted 7 in screenshot
                  const isBlocked = blockedDates.includes(day);
                  const isSelected = selectedCalendarDate === day;

                  return (
                    <div
                      key={day}
                      onClick={() => {
                        setSelectedCalendarDate(day);
                        handleToggleBlockDate(day);
                      }}
                      className={`min-h-[85px] p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                        isToday
                          ? "border-[#222222] bg-white shadow-xs"
                          : isBlocked
                          ? "border-dashed border-[#DDDDDD] bg-[#FAFAFA] opacity-60 line-through"
                          : isSelected
                          ? "border-[#222222] bg-white ring-1 ring-[#222222]"
                          : "border-[#EBEBEB] bg-white hover:border-[#222222]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {isToday ? (
                          <span className="w-6 h-6 rounded-full bg-[#E00B41] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            {day}
                          </span>
                        ) : (
                          <span className="font-semibold text-xs text-[#222222]">{day}</span>
                        )}
                      </div>

                      <div className="text-[11px] font-bold text-[#717171]">
                        {isBlocked ? "Blocked" : formatPrice(customPricePerNight)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Floating Currency badge near bottom right matching Screenshot 2 */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={openLanguageModal}
                  className="bg-white border border-[#DDDDDD] shadow-md px-4 py-2 rounded-full text-xs font-bold text-[#222222] hover:bg-[#F7F7F7] hover:scale-105 transition cursor-pointer flex items-center gap-1.5"
                  title="Switch Currency"
                >
                  <span>{currentCurrency.code}</span>
                  <span className="text-[10px] text-[#717171]">({currentCurrency.symbol})</span>
                </button>
              </div>
            </div>

            {/* Right Sidebar: Pricing, Discounts, Availability, Cancellations matching Screenshot 2 */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#EBEBEB] lg:pl-8 flex flex-col justify-start space-y-6">
              <h3 className="font-bold text-lg text-[#222222] pb-2 border-b border-[#F0F0F0]">
                Listing Settings
              </h3>

              {/* 1. Pricing */}
              <div
                onClick={() => setIsPricingModalOpen(true)}
                className="p-4 rounded-2xl hover:bg-[#F7F7F7] border border-[#EBEBEB] transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#222222]">Pricing</h4>
                  <ChevronRight className="w-4 h-4 text-[#717171]" />
                </div>
                <p className="text-xs text-[#717171] mt-1">
                  {formatPrice(customPricePerNight - 27)} – {formatPrice(customPricePerNight + 16)} per night
                </p>
              </div>

              {/* 2. Discounts */}
              <div
                onClick={() => setIsDiscountsModalOpen(true)}
                className="p-4 rounded-2xl hover:bg-[#F7F7F7] border border-[#EBEBEB] transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#222222]">Discounts</h4>
                  <ChevronRight className="w-4 h-4 text-[#717171]" />
                </div>
                <p className="text-xs text-[#717171] mt-1">{weeklyDiscount}% weekly discount</p>
                <p className="text-xs text-[#717171]">{monthlyDiscount}% monthly discount</p>
              </div>

              {/* 3. Availability */}
              <div
                onClick={() => setIsAvailabilityModalOpen(true)}
                className="p-4 rounded-2xl hover:bg-[#F7F7F7] border border-[#EBEBEB] transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#222222]">Availability</h4>
                  <ChevronRight className="w-4 h-4 text-[#717171]" />
                </div>
                <p className="text-xs text-[#717171] mt-1">{minNights}–{maxNights} night stays</p>
                <p className="text-xs text-[#717171]">{advanceNotice} advance notice</p>
              </div>

              {/* 4. Cancellations */}
              <div
                onClick={() => setIsCancellationsModalOpen(true)}
                className="p-4 rounded-2xl hover:bg-[#F7F7F7] border border-[#EBEBEB] transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#222222]">Cancellations</h4>
                  <ChevronRight className="w-4 h-4 text-[#717171]" />
                </div>
                <p className="text-xs text-[#717171] mt-1">{cancellationPolicy} for short-term stays</p>
                <p className="text-xs text-[#717171]">Firm Long-Term for long-term stays</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 3: LISTINGS (Comprehensive Host Table & Grid)                      */}
      {/* ========================================================================= */}
      {activeTab === "listings" && (
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8">
          {/* Success Banner */}
          {successToast && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold">{successToast}</span>
              </div>
              <button
                onClick={() => setSuccessToast(null)}
                className="p-1 hover:bg-emerald-100 rounded-full text-emerald-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Header Row: Title & Action buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#EBEBEB]">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222222]">
                  Your listings
                </h2>
                <span className="bg-[#F7F7F7] border border-[#DDDDDD] text-[#222222] text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {userListings.length} total
                </span>
              </div>
              <p className="text-xs text-[#717171] mt-1">
                Manage your properties, view public pages, or add new accommodations.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Layout Switcher */}
              <div className="flex items-center bg-white border border-[#DDDDDD] rounded-full p-1 shadow-2xs">
                <button
                  onClick={() => setListingsViewMode("grid")}
                  className={`p-1.5 rounded-full transition cursor-pointer ${
                    listingsViewMode === "grid"
                      ? "bg-[#222222] text-white"
                      : "text-[#717171] hover:text-[#222222]"
                  }`}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setListingsViewMode("list")}
                  className={`p-1.5 rounded-full transition cursor-pointer ${
                    listingsViewMode === "list"
                      ? "bg-[#222222] text-white"
                      : "text-[#717171] hover:text-[#222222]"
                  }`}
                  aria-label="Table view"
                  title="Table view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Add New Listing Button */}
              <button
                onClick={() => setIsCreateListingModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-full font-bold text-xs shadow-sm hover:shadow-md transition cursor-pointer"
                title="Create a new listing"
              >
                <Plus className="w-4 h-4" />
                <span>Create listing</span>
              </button>
            </div>
          </div>

          {/* Search and Status Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#717171] absolute left-3.5 top-3" />
              <input
                type="text"
                value={listingSearchQuery}
                onChange={(e) => setListingSearchQuery(e.target.value)}
                placeholder="Search listings by title, city, or address..."
                className="w-full bg-white border border-[#DDDDDD] rounded-full pl-10 pr-4 py-2 text-xs font-medium text-[#222222] focus:outline-none focus:border-[#222222] transition"
              />
              {listingSearchQuery && (
                <button
                  onClick={() => setListingSearchQuery("")}
                  className="absolute right-3 top-2.5 text-[#717171] hover:text-[#222222]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-white border border-[#DDDDDD] p-1 rounded-full text-xs font-semibold self-start sm:self-auto">
              {(["all", "active", "draft"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setListingStatusFilter(filter)}
                  className={`px-3 py-1 rounded-full capitalize transition cursor-pointer ${
                    listingStatusFilter === filter
                      ? "bg-[#222222] text-white"
                      : "text-[#717171] hover:text-[#222222]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Listings Display: Grid vs Table View */}
          {(() => {
            const filtered = userListings.filter((item) => {
              const q = listingSearchQuery.toLowerCase().trim();
              const matchesSearch =
                !q ||
                item.title.toLowerCase().includes(q) ||
                item.city.toLowerCase().includes(q) ||
                (item.subtitle && item.subtitle.toLowerCase().includes(q));

              const matchesStatus =
                listingStatusFilter === "all" ||
                (listingStatusFilter === "active" && item.isPublished) ||
                (listingStatusFilter === "draft" && !item.isPublished);

              return matchesSearch && matchesStatus;
            });

            if (filtered.length === 0) {
              return (
                <div className="bg-white rounded-3xl border border-[#DDDDDD] p-12 text-center space-y-4">
                  <div className="w-14 h-14 bg-rose-50 text-[#FF385C] rounded-full flex items-center justify-center mx-auto">
                    <Home className="w-7 h-7" />
                  </div>
                  <h3 className="font-extrabold text-base text-[#222222]">
                    No listings found
                  </h3>
                  <p className="text-xs text-[#717171] max-w-sm mx-auto">
                    {listingSearchQuery
                      ? "Try searching for a different keyword or clearing your search filters."
                      : "You have not added any listings matching this view. Click below to create your first listing."}
                  </p>
                  <button
                    onClick={() => setIsCreateListingModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF385C] text-white rounded-full text-xs font-bold hover:bg-[#E00B41] transition cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Create listing
                  </button>
                </div>
              );
            }

            if (listingsViewMode === "grid") {
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((item) => {
                    const hasPoolAmenity = item.amenities?.some((a) =>
                      a.toLowerCase().includes("pool")
                    );
                    const hasACAmenity = item.amenities?.some(
                      (a) =>
                        a.toLowerCase().includes("air conditioning") ||
                        a.toLowerCase().includes("ac")
                    );
                    const hasAttachedBathAmenity = item.amenities?.some((a) =>
                      a.toLowerCase().includes("attached")
                    );

                    return (
                      <div
                        key={item.id}
                        className="group bg-white rounded-3xl overflow-hidden border border-[#DDDDDD] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                      >
                        {/* Cover Image Container */}
                        <div className="relative aspect-4/3 w-full bg-[#EBEBEB] overflow-hidden">
                          <img
                            src={
                              item.images && item.images[0]?.url
                                ? item.images[0].url
                                : "/images/host-listing-cover.jpg"
                            }
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <span className="bg-white/95 backdrop-blur-xs rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  item.isPublished ? "bg-emerald-600" : "bg-amber-500"
                                }`}
                              />
                              <span className="text-[11px] font-bold text-[#222222]">
                                {item.isPublished ? "Published" : "Draft"}
                              </span>
                            </span>

                            {item.id && (
                              <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                                ID #{item.id}
                              </span>
                            )}
                          </div>

                          {/* Amenity Pills Overlay */}
                          <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1">
                            {hasPoolAmenity && (
                              <span className="bg-cyan-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Waves className="w-3 h-3" /> Pool
                              </span>
                            )}
                            {hasACAmenity && (
                              <span className="bg-sky-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Wind className="w-3 h-3" /> AC
                              </span>
                            )}
                            {hasAttachedBathAmenity && (
                              <span className="bg-emerald-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Bath className="w-3 h-3" /> Attached Bath
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Listing Details */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            <h4
                              className="font-bold text-base text-[#222222] truncate"
                              title={item.title}
                            >
                              {item.title}
                            </h4>
                            <p
                              className="text-xs text-[#717171] truncate"
                              title={item.subtitle || `${item.city}, ${item.country}`}
                            >
                              {item.subtitle || `${item.city}, ${item.country}`}
                            </p>
                            <p className="text-[11px] text-[#717171] pt-0.5">
                              {item.maxGuests} guests · {item.bedrooms} bedrooms · {item.bathrooms} baths
                            </p>
                          </div>

                          {/* Price & Action Row */}
                          <div className="pt-2 border-t border-[#EBEBEB] flex items-center justify-between">
                            <div>
                              <span className="font-extrabold text-sm text-[#222222]">
                                {formatPrice(item.pricePerNight)}
                              </span>
                              <span className="text-[11px] text-[#717171]"> / night</span>
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap justify-end">
                              <button
                                onClick={() => handleOpenListingBookings(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition cursor-pointer"
                                title="Manage bookings for this stay"
                              >
                                <CalendarIcon className="w-3 h-3" />
                                <span>Bookings</span>
                              </button>
                              <button
                                onClick={() => handleOpenEditListing(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] border border-[#DDDDDD] transition cursor-pointer"
                                title="Edit listing details"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <Link
                                href={`/rooms/${item.id}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] border border-[#DDDDDD] transition cursor-pointer"
                                title="View public room page"
                              >
                                <span>View</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                              <button
                                onClick={(e) => handleDeleteListing(item.id, e)}
                                className="w-7 h-7 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer"
                                title="Delete listing"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }

            /* Table / List View */
            return (
              <div className="bg-white rounded-3xl border border-[#DDDDDD] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F7F7F7] text-[#717171] font-bold border-b border-[#EBEBEB] uppercase tracking-wider text-[10px]">
                        <th className="py-3.5 px-4">Property</th>
                        <th className="py-3.5 px-3">Status</th>
                        <th className="py-3.5 px-3">Location</th>
                        <th className="py-3.5 px-3">Capacity</th>
                        <th className="py-3.5 px-3">Amenities</th>
                        <th className="py-3.5 px-3">Nightly Rate</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBEBEB]">
                      {filtered.map((item) => {
                        const hasPool = item.amenities?.some((a) =>
                          a.toLowerCase().includes("pool")
                        );
                        const hasAC = item.amenities?.some(
                          (a) =>
                            a.toLowerCase().includes("air conditioning") ||
                            a.toLowerCase().includes("ac")
                        );
                        const hasAttached = item.amenities?.some((a) =>
                          a.toLowerCase().includes("attached")
                        );

                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-[#F9F9F9] transition group"
                          >
                            {/* Property thumbnail & title */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    item.images && item.images[0]?.url
                                      ? item.images[0].url
                                      : "/images/host-listing-cover.jpg"
                                  }
                                  alt={item.title}
                                  className="w-14 h-14 rounded-2xl object-cover border border-[#DDDDDD] flex-shrink-0"
                                />
                                <div className="min-w-0 max-w-xs">
                                  <h4 className="font-bold text-xs text-[#222222] truncate">
                                    {item.title}
                                  </h4>
                                  <p className="text-[11px] text-[#717171] truncate">
                                    {item.subtitle || `${item.city}, ${item.country}`}
                                  </p>
                                  <span className="text-[10px] text-[#717171] font-mono">
                                    ID #{item.id}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-3">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                  item.isPublished
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    item.isPublished ? "bg-emerald-600" : "bg-amber-500"
                                  }`}
                                />
                                {item.isPublished ? "Active" : "Draft"}
                              </span>
                            </td>

                            {/* Location */}
                            <td className="py-3.5 px-3">
                              <span className="font-medium text-[#222222]">{item.city}</span>
                              <span className="text-[#717171] block text-[11px]">
                                {item.country}
                              </span>
                            </td>

                            {/* Capacity */}
                            <td className="py-3.5 px-3 text-[#717171]">
                              <span className="font-semibold text-[#222222] block">
                                {item.maxGuests} guests
                              </span>
                              <span className="text-[11px]">
                                {item.bedrooms} bed · {item.bathrooms} bath
                              </span>
                            </td>

                            {/* Amenities Badges */}
                            <td className="py-3.5 px-3">
                              <div className="flex flex-wrap gap-1 max-w-[160px]">
                                {hasPool && (
                                  <span className="bg-cyan-50 text-cyan-800 border border-cyan-200 text-[10px] px-1.5 py-0.5 rounded font-medium">
                                    Pool
                                  </span>
                                )}
                                {hasAC && (
                                  <span className="bg-sky-50 text-sky-800 border border-sky-200 text-[10px] px-1.5 py-0.5 rounded font-medium">
                                    AC
                                  </span>
                                )}
                                {hasAttached && (
                                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] px-1.5 py-0.5 rounded font-medium">
                                    Attached Bath
                                  </span>
                                )}
                                {!hasPool && !hasAC && !hasAttached && (
                                  <span className="text-[#717171] text-[11px]">Standard</span>
                                )}
                              </div>
                            </td>

                            {/* Nightly Rate */}
                            <td className="py-3.5 px-3 font-bold text-[#222222]">
                              {formatPrice(item.pricePerNight)}
                              <span className="font-normal text-[#717171] block text-[10px]">
                                / night
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenListingBookings(item)}
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition cursor-pointer"
                                  title="Manage bookings for this stay"
                                >
                                  <CalendarIcon className="w-3 h-3" />
                                  <span>Bookings</span>
                                </button>
                                <button
                                  onClick={() => handleOpenEditListing(item)}
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] border border-[#DDDDDD] transition cursor-pointer"
                                  title="Edit listing details"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                                <Link
                                  href={`/rooms/${item.id}`}
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] border border-[#DDDDDD] transition cursor-pointer"
                                >
                                  <span>View</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                                <button
                                  onClick={(e) => handleDeleteListing(item.id, e)}
                                  className="p-1.5 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                  title="Delete listing"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </main>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB 4: MESSAGES (Matching Screenshot 4)                                */}
      {/* ========================================================================= */}
      {activeTab === "messages" && (
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-12 border border-[#EBEBEB] rounded-3xl overflow-hidden bg-white shadow-sm min-h-[680px]">
            {/* Left Column: Messages list matching Screenshot 4 */}
            <div className="md:col-span-4 lg:col-span-4 border-r border-[#EBEBEB] flex flex-col bg-white">
              <div className="p-4 border-b border-[#F0F0F0]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#222222]">Messages</h3>
                  <div className="flex items-center gap-1.5">
                    <button className="p-2 rounded-full hover:bg-[#F7F7F7] text-[#222222] cursor-pointer" title="Search">
                      <Search className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-[#F7F7F7] text-[#222222] cursor-pointer" title="Settings">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChatFilter("all")}
                    className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition ${
                      chatFilter === "all"
                        ? "bg-[#222222] text-white"
                        : "bg-white text-[#222222] border border-[#DDDDDD] hover:bg-[#F7F7F7]"
                    }`}
                  >
                    <span>All</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setChatFilter("unread")}
                    className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition ${
                      chatFilter === "unread"
                        ? "bg-[#222222] text-white"
                        : "bg-white text-[#222222] border border-[#DDDDDD] hover:bg-[#F7F7F7]"
                    }`}
                  >
                    Unread
                  </button>
                </div>
              </div>

              {/* Chat Thread List */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#F0F0F0]">
                {filteredThreads.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#717171]">
                    No messages found.
                  </div>
                ) : (
                  filteredThreads.map((thread) => {
                    const isSelected = thread.id === activeThread?.id;
                    return (
                      <div
                        key={thread.id}
                        onClick={() => {
                          setActiveThreadId(thread.id);
                          // Mark read
                          setChatThreads((prev) =>
                            prev.map((t) => (t.id === thread.id ? { ...t, unread: false } : t))
                          );
                        }}
                        className={`p-4 flex items-start gap-3 cursor-pointer transition ${
                          isSelected ? "bg-[#F7F7F7]" : "hover:bg-[#FAFAFA]"
                        }`}
                      >
                        <img
                          src={thread.guestAvatar}
                          alt={thread.guestName}
                          className="w-12 h-12 rounded-full object-cover border border-[#DDDDDD] flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-[#222222] flex items-center gap-1.5">
                              <span>{thread.guestName}</span>
                              {thread.unread && (
                                <span className="w-2 h-2 rounded-full bg-[#FF385C]" />
                              )}
                            </h4>
                            <span className="text-[11px] text-[#717171]">{thread.lastMessageDate}</span>
                          </div>
                          <p className="text-xs text-[#717171] truncate mt-0.5">
                            {thread.lastMessageSnippet}
                          </p>
                          <span className="text-[10px] text-[#717171] font-medium">
                            {thread.reservationDates}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Chat Stream + Collapsible Reservation Panel matching Screenshot 4 */}
            <div className="md:col-span-8 lg:col-span-8 flex flex-col bg-white">
              {!activeThread ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#717171]">
                  <MessageSquare className="w-12 h-12 text-[#DDDDDD] mb-3" />
                  <h4 className="font-bold text-base text-[#222222]">No conversation selected</h4>
                  <p className="text-xs text-[#717171] max-w-xs mt-1">
                    When guests book or inquire about your properties, their messages will appear here.
                  </p>
                </div>
              ) : (
                <>
                  {/* Header with Show Reservation button matching Screenshot 4 */}
                  <div className="px-6 py-4 border-b border-[#F0F0F0] flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={activeThread.guestAvatar}
                        alt={activeThread.guestName}
                        className="w-10 h-10 rounded-full object-cover border border-[#DDDDDD]"
                      />
                      <div>
                        <div className="flex items-center gap-1 font-bold text-sm text-[#222222]">
                          <span>{activeThread.guestName}</span>
                          <ChevronRight className="w-4 h-4 text-[#717171]" />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#717171]">
                          <Languages className="w-3.5 h-3.5 text-[#717171]" />
                          <span>Translation on</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsHostReservationOpen(!isHostReservationOpen)}
                      className="text-xs font-semibold text-[#222222] border border-[#DDDDDD] px-4 py-2 rounded-full hover:bg-[#F7F7F7] transition cursor-pointer"
                    >
                      {isHostReservationOpen ? "Hide reservation" : "Show reservation"}
                    </button>
                  </div>

                  {/* Collapsible Reservation Details Card */}
                  {isHostReservationOpen && (
                    <div className="bg-[#FAFAFA] border-b border-[#EBEBEB] px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div>
                        <p className="font-bold text-sm text-[#222222]">{activeThread.listingTitle}</p>
                        <p className="text-[#717171] mt-0.5">
                          {activeThread.checkIn} → {activeThread.checkOut} · {activeThread.guestsCount} guests
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[11px] text-[#717171]">Total Payout</p>
                          <p className="font-bold text-sm text-emerald-700">{formatPrice(activeThread.totalPayout)}</p>
                        </div>
                        <div className="text-right border-l border-[#DDDDDD] pl-4">
                          <p className="text-[11px] text-[#717171]">Code</p>
                          <p className="font-bold text-xs text-[#222222]">{activeThread.confirmationCode}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Chat Stream */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-white">
                    {activeThread.messages.map((msg) => {
                      if (msg.sender === "system") {
                        return (
                          <div key={msg.id} className="flex justify-center my-2">
                            <div className="bg-[#F7F7F7] border border-[#EBEBEB] text-[#717171] px-4 py-1.5 rounded-full text-xs font-medium text-center">
                              {msg.text}
                            </div>
                          </div>
                        );
                      }

                      if (msg.sender === "guest") {
                        return (
                          <div key={msg.id} className="flex justify-end">
                            <div className="max-w-xl bg-[#333333] text-white px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-xs">
                              <p>{msg.text}</p>
                              <span className="block text-[10px] text-gray-300 text-right mt-1">{msg.time}</span>
                            </div>
                          </div>
                        );
                      }

                      if (msg.sender === "host") {
                        return (
                          <div key={msg.id} className="flex items-start gap-2.5 max-w-xl">
                            <div className="bg-[#F7F7F7] text-[#222222] px-5 py-3.5 rounded-2xl text-sm leading-relaxed border border-[#EBEBEB]">
                              <p>{msg.text}</p>
                              <span className="block text-[10px] text-[#717171] mt-1">{msg.time}</span>
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>

                  {/* Input bar matching Screenshot 4 */}
                  <div className="p-4 border-t border-[#F0F0F0]">
                    <form
                      onSubmit={handleSendHostMessage}
                      className="border border-[#DDDDDD] rounded-2xl p-3 focus-within:border-[#222222] flex flex-col justify-between min-h-[90px] transition"
                    >
                      <textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendHostMessage(e);
                          }
                        }}
                        placeholder="Write a message..."
                        rows={2}
                        className="w-full text-sm text-[#222222] focus:outline-none resize-none bg-transparent"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={!chatInput.trim()}
                          className="w-8 h-8 rounded-full bg-[#222222] text-white flex items-center justify-center hover:bg-black transition disabled:opacity-30 cursor-pointer"
                          title="Send message"
                        >
                          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* MODALS: Identity Verification, Pricing, Discounts, Create Listing, etc.   */}
      {/* ========================================================================= */}

      {/* 1. Identity Verification Modal */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#DDDDDD] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBEBEB]">
              <h3 className="text-lg font-bold text-[#222222]">Identity Verification</h3>
              <button onClick={() => setIsVerifyModalOpen(false)} className="p-1 rounded-full hover:bg-[#F7F7F7] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#717171] leading-relaxed">
              <p>
                To keep the Airbnb hosting community secure, hosts must verify their identity using an official
                government-issued document.
              </p>
              <div className="p-3 bg-[#F7F7F7] rounded-2xl flex items-center gap-3 border border-[#EBEBEB]">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-[#222222]">Host Account: {persona.fullName}</p>
                  <p className="text-[11px] text-[#717171]">Document Types: Passport, Driving License, or Aadhaar</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-[#DDDDDD] text-[#222222] font-bold text-xs hover:bg-[#F7F7F7] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsIdentityVerified(true);
                  setIsVerifyModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#222222] text-white font-bold text-xs hover:bg-black transition cursor-pointer"
              >
                Verify Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Base Pricing Modal */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#DDDDDD] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBEBEB]">
              <h3 className="text-base font-bold text-[#222222]">Base Nightly Price</h3>
              <button onClick={() => setIsPricingModalOpen(false)} className="p-1 rounded-full hover:bg-[#F7F7F7] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#717171] mb-1">Standard Nightly Rate</label>
              <div className="flex items-center border border-[#DDDDDD] rounded-xl p-3 focus-within:border-[#222222]">
                <span className="font-bold pr-2">{currentCurrency.symbol}</span>
                <input
                  type="number"
                  value={customPricePerNight}
                  onChange={(e) => setCustomPricePerNight(Number(e.target.value))}
                  className="w-full text-sm font-bold focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-[#717171] mt-1.5">
                Suggested range for this season: {formatPrice(2000)} – {formatPrice(2600)}
              </p>
            </div>

            <button
              onClick={() => setIsPricingModalOpen(false)}
              className="w-full py-2.5 bg-[#222222] text-white text-xs font-bold rounded-xl hover:bg-black transition cursor-pointer"
            >
              Save Pricing
            </button>
          </div>
        </div>
      )}

      {/* 3. Discounts Modal */}
      {isDiscountsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#DDDDDD] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBEBEB]">
              <h3 className="text-base font-bold text-[#222222]">Edit Stays Discounts</h3>
              <button onClick={() => setIsDiscountsModalOpen(false)} className="p-1 rounded-full hover:bg-[#F7F7F7] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#717171] mb-1">Weekly Discount (%)</label>
                <input
                  type="number"
                  value={weeklyDiscount}
                  onChange={(e) => setWeeklyDiscount(Number(e.target.value))}
                  className="w-full border border-[#DDDDDD] rounded-xl p-2.5 text-sm font-bold focus:outline-none focus:border-[#222222]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#717171] mb-1">Monthly Discount (%)</label>
                <input
                  type="number"
                  value={monthlyDiscount}
                  onChange={(e) => setMonthlyDiscount(Number(e.target.value))}
                  className="w-full border border-[#DDDDDD] rounded-xl p-2.5 text-sm font-bold focus:outline-none focus:border-[#222222]"
                />
              </div>
            </div>

            <button
              onClick={() => setIsDiscountsModalOpen(false)}
              className="w-full py-2.5 bg-[#222222] text-white text-xs font-bold rounded-xl hover:bg-black transition cursor-pointer"
            >
              Save Discounts
            </button>
          </div>
        </div>
      )}

      {/* 4. Availability Modal */}
      {isAvailabilityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#DDDDDD] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBEBEB]">
              <h3 className="text-base font-bold text-[#222222]">Stay Availability Settings</h3>
              <button onClick={() => setIsAvailabilityModalOpen(false)} className="p-1 rounded-full hover:bg-[#F7F7F7] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#717171] mb-1">Minimum Night Stay</label>
                <input
                  type="number"
                  value={minNights}
                  onChange={(e) => setMinNights(Number(e.target.value))}
                  className="w-full border border-[#DDDDDD] rounded-xl p-2.5 text-sm font-bold focus:outline-none focus:border-[#222222]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#717171] mb-1">Maximum Night Stay</label>
                <input
                  type="number"
                  value={maxNights}
                  onChange={(e) => setMaxNights(Number(e.target.value))}
                  className="w-full border border-[#DDDDDD] rounded-xl p-2.5 text-sm font-bold focus:outline-none focus:border-[#222222]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#717171] mb-1">Advance Notice</label>
                <select
                  value={advanceNotice}
                  onChange={(e) => setAdvanceNotice(e.target.value)}
                  className="w-full border border-[#DDDDDD] rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#222222]"
                >
                  <option value="Same day">Same day</option>
                  <option value="At least 1 day">At least 1 day</option>
                  <option value="At least 2 days">At least 2 days</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setIsAvailabilityModalOpen(false)}
              className="w-full py-2.5 bg-[#222222] text-white text-xs font-bold rounded-xl hover:bg-black transition cursor-pointer"
            >
              Save Availability
            </button>
          </div>
        </div>
      )}

      {/* 5. Cancellations Modal */}
      {isCancellationsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#DDDDDD] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBEBEB]">
              <h3 className="text-base font-bold text-[#222222]">Cancellation Policy</h3>
              <button onClick={() => setIsCancellationsModalOpen(false)} className="p-1 rounded-full hover:bg-[#F7F7F7] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { title: "Flexible", desc: "Full refund up to 24 hours before check-in" },
                { title: "Moderate", desc: "Full refund up to 5 days before check-in" },
                { title: "Firm", desc: "Full refund up to 30 days before check-in" },
              ].map((policy) => (
                <div
                  key={policy.title}
                  onClick={() => setCancellationPolicy(policy.title)}
                  className={`p-3 rounded-2xl border cursor-pointer transition ${
                    cancellationPolicy === policy.title
                      ? "border-[#222222] bg-[#F7F7F7]"
                      : "border-[#EBEBEB] hover:border-[#DDDDDD]"
                  }`}
                >
                  <p className="font-bold text-xs text-[#222222]">{policy.title}</p>
                  <p className="text-[11px] text-[#717171]">{policy.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsCancellationsModalOpen(false)}
              className="w-full py-2.5 bg-[#222222] text-white text-xs font-bold rounded-xl hover:bg-black transition cursor-pointer"
            >
              Save Policy
            </button>
          </div>
        </div>
      )}

      {/* 6. Keyboard Shortcuts Modal */}
      {isKeyboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#DDDDDD] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBEBEB]">
              <h3 className="text-base font-bold text-[#222222]">Calendar Shortcuts</h3>
              <button onClick={() => setIsKeyboardModalOpen(false)} className="p-1 rounded-full hover:bg-[#F7F7F7] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#F0F0F0]">
                <span className="text-[#717171]">Next / Previous Day</span>
                <span className="font-mono bg-[#F7F7F7] px-2 py-0.5 rounded border border-[#DDDDDD]">← →</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0F0F0]">
                <span className="text-[#717171]">Toggle Block / Available</span>
                <span className="font-mono bg-[#F7F7F7] px-2 py-0.5 rounded border border-[#DDDDDD]">Space</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#717171]">Close Modals</span>
                <span className="font-mono bg-[#F7F7F7] px-2 py-0.5 rounded border border-[#DDDDDD]">Esc</span>
              </div>
            </div>

            <button
              onClick={() => setIsKeyboardModalOpen(false)}
              className="w-full py-2 bg-[#222222] text-white text-xs font-bold rounded-xl hover:bg-black transition cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* 7. Interactive Multi-Step Create Listing Modal */}
      <CreateListingModal
        isOpen={isCreateListingModalOpen}
        onClose={() => setIsCreateListingModalOpen(false)}
        onSuccess={handleListingCreated}
        hostId={persona.id || 2}
      />

      {/* 8. Edit Listing Modal */}
      <EditListingModal
        isOpen={isEditListingModalOpen}
        listing={editingListing}
        onClose={() => setIsEditListingModalOpen(false)}
        onSuccess={handleListingUpdated}
        hostId={persona.id || 2}
      />

      {/* 9. Listing Bookings Modal */}
      <ListingBookingsModal
        isOpen={isListingBookingsModalOpen}
        listing={activeListingForBookings}
        onClose={() => setIsListingBookingsModalOpen(false)}
        onModifyBooking={(booking) => {
          setIsListingBookingsModalOpen(false);
          handleOpenModifyBooking(booking);
        }}
        hostId={persona.id || 2}
      />

      {/* 10. Modify Booking Modal */}
      <ModifyBookingModal
        isOpen={isModifyBookingModalOpen}
        booking={editingBooking}
        onClose={() => setIsModifyBookingModalOpen(false)}
        onSuccess={handleBookingUpdated}
        userId={persona.id || 2}
      />
    </div>
  );
}
