"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/header/Navbar";
import {
  Search,
  Settings,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  X,
  AlertTriangle,
  RotateCw,
  Mail,
  CheckCheck,
  Calendar,
  Users,
  MapPin,
  Languages,
} from "lucide-react";
import Link from "next/link";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";

interface ChatMessage {
  id: number;
  sender: "guest" | "host" | "system";
  senderName?: string;
  senderRole?: string;
  avatar?: string;
  text: string;
  time: string;
  isHidden?: boolean;
}

interface ChatThread {
  id: number;
  hostName: string;
  hostRole?: string;
  hostAvatar: string;
  listingTitle: string;
  dates: string;
  lastMessage: string;
  lastDate: string;
  unreadCount: number;
  enquiryText?: string;
  messages: ChatMessage[];
}

const INITIAL_THREADS: ChatThread[] = [
  {
    id: 1,
    hostName: "Ravi",
    hostRole: "Co-host",
    hostAvatar: "/images/ravi-avatar.jpg",
    listingTitle: "Modern 4BHK Villa for Parties & Gatherings",
    dates: "1–2 Feb",
    lastMessage: "This message has been hidden because the person no longer has access to Airbnb.",
    lastDate: "30/1",
    unreadCount: 0,
    enquiryText: "Your enquiry for 16 guests on 1–2 Feb has been sent. Show listing",
    messages: [
      {
        id: 1,
        sender: "system",
        text: "Your enquiry for 16 guests on 1–2 Feb has been sent. Show listing",
        time: "30 Jan",
      },
      {
        id: 2,
        sender: "guest",
        text: "Hi Ravi bhai , mere ko ek birthday party krni h on 1st FEB toh me ye home book krna chaa rha tha ek baar apse baat hoskti hai aur kya app current condition ki photos bhej skte ho stay ki ?",
        time: "1:25 pm",
      },
      {
        id: 3,
        sender: "host",
        senderName: "Ravi",
        senderRole: "Co-host",
        text: "This message has been hidden because the person no longer has access to Airbnb.",
        time: "1:38 pm",
        isHidden: true,
      },
      {
        id: 4,
        sender: "host",
        senderName: "Ravi",
        senderRole: "Co-host",
        avatar: "/images/ravi-avatar.jpg",
        text: "This message has been hidden because the person no longer has access to Airbnb.",
        time: "1:38 pm",
        isHidden: true,
      },
    ],
  }
];

export default function MessagesPage() {
  const { formatPrice, t } = useLanguageCurrency();
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<number>(1);
  const [filterTab, setFilterTab] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isReservationOpen, setIsReservationOpen] = useState(true);
  const [reservationState, setReservationState] = useState<"error" | "details">("error");
  const [isRetrying, setIsRetrying] = useState(false);

  // Load any stored conversation updates
  useEffect(() => {
    try {
      const stored = localStorage.getItem("airbnb_demo_messages");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setThreads(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: "guest",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };

    const updated = threads.map((t) => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          lastMessage: newMsg.text,
          lastDate: "Today",
          messages: [...t.messages, newMsg],
        };
      }
      return t;
    });

    setThreads(updated);
    setInputText("");
    try {
      localStorage.setItem("airbnb_demo_messages", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRetryReservation = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      setReservationState("details");
    }, 900);
  };

  // Filter conversations
  const filteredThreads = threads.filter((t) => {
    if (filterTab === "unread" && t.unreadCount === 0) return false;
    if (searchQuery) {
      return (
        t.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1680px] w-full mx-auto px-2 sm:px-4 lg:px-8 py-4 flex flex-col">
        {/* 3-Column Layout Matching Screenshot 2 */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 border border-[#EBEBEB] rounded-3xl overflow-hidden bg-white shadow-xs min-h-[720px]">
          {/* ========================================================================= */}
          {/* COLUMN 1: Threads List (Width: 3 or 4 cols)                               */}
          {/* ========================================================================= */}
          <div className="md:col-span-4 lg:col-span-3 border-r border-[#EBEBEB] flex flex-col bg-white">
            {/* Header: Messages + Search + Settings matching Screenshot 2 */}
            <div className="p-4 border-b border-[#F0F0F0]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#222222]">
                  {t("messages.title", "Messages")}
                </h2>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-2 rounded-full hover:bg-[#F7F7F7] text-[#222222] transition cursor-pointer"
                    aria-label="Search conversations"
                  >
                    <Search className="w-4 h-4 stroke-[2.2]" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-[#F7F7F7] text-[#222222] transition cursor-pointer"
                    aria-label="Message settings"
                  >
                    <Settings className="w-4 h-4 stroke-[2.2]" />
                  </button>
                </div>
              </div>

              {/* Collapsible search bar */}
              {isSearchOpen && (
                <div className="mb-3 animate-in fade-in duration-150">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by host or property..."
                    className="w-full px-3 py-2 text-xs border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-[#222222]"
                    autoFocus
                  />
                </div>
              )}

              {/* Filter Pills matching Screenshot 2: [ All ⌄ ] and [ Unread ] */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterTab("all")}
                  className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                    filterTab === "all"
                      ? "bg-[#222222] text-white"
                      : "bg-white text-[#222222] border border-[#DDDDDD] hover:bg-[#F7F7F7]"
                  }`}
                >
                  <span>{t("messages.all", "All")}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setFilterTab("unread")}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                    filterTab === "unread"
                      ? "bg-[#222222] text-white"
                      : "bg-white text-[#222222] border border-[#DDDDDD] hover:bg-[#F7F7F7]"
                  }`}
                >
                  {t("messages.unread", "Unread")}
                </button>
              </div>
            </div>

            {/* Conversation Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#F0F0F0]">
              {filterTab === "unread" && filteredThreads.length === 0 ? (
                /* Empty state when Unread selected (User requirement: "which tells could find any messages it there are no messages") */
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#F7F7F7] flex items-center justify-center mx-auto text-[#717171]">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#222222]">You have no unread messages</h4>
                  <p className="text-xs text-[#717171] leading-relaxed">
                    When you have new messages or replies from hosts, they will appear here.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilterTab("all")}
                    className="text-xs font-semibold text-[#FF385C] hover:underline cursor-pointer pt-2 inline-block"
                  >
                    View all conversations
                  </button>
                </div>
              ) : filteredThreads.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#717171]">
                  No conversations match your search.
                </div>
              ) : (
                filteredThreads.map((thread) => {
                  const isSelected = thread.id === activeThread.id;
                  return (
                    <div
                      key={thread.id}
                      onClick={() => setActiveThreadId(thread.id)}
                      className={`p-4 transition cursor-pointer flex items-start gap-3.5 hover:bg-[#F7F7F7] ${
                        isSelected ? "bg-[#F7F7F7]" : "bg-white"
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={thread.hostAvatar}
                          alt={thread.hostName}
                          className="w-12 h-12 rounded-full object-cover border border-[#DDDDDD]"
                        />
                        {thread.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF385C] rounded-full border-2 border-white" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-[#222222] truncate">
                            {thread.hostName}
                          </h4>
                          <span className="text-[11px] text-[#717171] font-medium">
                            {thread.lastDate}
                          </span>
                        </div>
                        <p className="text-xs text-[#717171] truncate mt-0.5">
                          New message · {thread.dates}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUMN 2: Active Chat Stream (Width: 5 or 6 cols)                         */}
          {/* ========================================================================= */}
          <div className="md:col-span-8 lg:col-span-6 flex flex-col bg-white border-r border-[#EBEBEB]">
            {/* Header: Ravi > | Translation on matching Screenshot 2 */}
            <div className="px-6 py-4 border-b border-[#F0F0F0] flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <img
                  src={activeThread.hostAvatar}
                  alt={activeThread.hostName}
                  className="w-10 h-10 rounded-full object-cover border border-[#DDDDDD]"
                />
                <div>
                  <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition">
                    <h3 className="font-bold text-base text-[#222222]">{activeThread.hostName}</h3>
                    <div className="w-5 h-5 rounded-full bg-[#F7F7F7] flex items-center justify-center">
                      <ChevronRight className="w-3.5 h-3.5 text-[#222222]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#717171]">
                    <Languages className="w-3.5 h-3.5 text-[#717171]" />
                    <span>Translation on</span>
                  </div>
                </div>
              </div>

              {/* Toggle Reservation button for responsive views */}
              <button
                type="button"
                onClick={() => setIsReservationOpen(!isReservationOpen)}
                className="text-xs font-semibold text-[#717171] hover:text-[#222222] border border-[#DDDDDD] px-3 py-1.5 rounded-full transition cursor-pointer"
              >
                {isReservationOpen ? "Hide reservation" : "Show reservation"}
              </button>
            </div>

            {/* Chat Messages Body matching Screenshot 2 */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-white">
              {/* Centered Date Tag matching Screenshot 2: 30 Jan */}
              <div className="text-center">
                <span className="text-xs font-bold text-[#717171]">30 Jan</span>
              </div>

              {/* Inquiry notification pill matching Screenshot 2 */}
              <div className="text-center">
                <p className="text-xs text-[#717171]">
                  Your enquiry for 16 guests on 1–2 Feb has been sent.{" "}
                  <Link href="/rooms/1" className="underline font-semibold text-[#222222] hover:text-[#FF385C]">
                    Show listing
                  </Link>
                </p>
              </div>

              {/* Message Bubbles */}
              {activeThread.messages
                .filter((m) => m.sender !== "system")
                .map((msg) => {
                  const isGuest = msg.sender === "guest";

                  if (isGuest) {
                    return (
                      <div key={msg.id} className="flex flex-col items-end space-y-1">
                        <div className="text-[11px] text-[#717171] pr-1">{msg.time}</div>
                        <div className="max-w-lg bg-[#333333] text-white px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-xs">
                          {msg.text}
                        </div>
                      </div>
                    );
                  }

                  // Host messages (matching Screenshot 2 light gray bubbles)
                  return (
                    <div key={msg.id} className="flex flex-col items-start space-y-1">
                      {msg.senderName && !msg.avatar && (
                        <div className="text-xs text-[#717171] pl-1 font-medium">
                          {msg.senderName} · {msg.senderRole} {msg.time}
                        </div>
                      )}

                      <div className="flex items-start gap-2.5 max-w-lg">
                        {msg.avatar && (
                          <img
                            src={msg.avatar}
                            alt={msg.senderName || "Host"}
                            className="w-7 h-7 rounded-full object-cover border border-[#DDDDDD] mt-1 flex-shrink-0"
                          />
                        )}
                        <div className="bg-[#F7F7F7] text-[#222222] px-5 py-3.5 rounded-2xl text-sm leading-relaxed border border-[#EBEBEB]">
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Bottom Message Input Box matching Screenshot 2 */}
            <div className="p-4 border-t border-[#F0F0F0] bg-white">
              <form
                onSubmit={handleSendMessage}
                className="border border-[#DDDDDD] rounded-2xl p-3 focus-within:border-[#222222] transition shadow-xs flex flex-col justify-between min-h-[96px] bg-white"
              >
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Write a message..."
                  rows={2}
                  className="w-full text-sm text-[#222222] placeholder-[#717171] resize-none focus:outline-none bg-transparent"
                />

                <div className="flex items-center justify-end pt-1">
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                      inputText.trim()
                        ? "bg-[#222222] text-white hover:bg-black"
                        : "bg-[#F0F0F0] text-[#B0B0B0] cursor-not-allowed"
                    }`}
                    aria-label="Send message"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUMN 3: Right Reservation Details (Width: 3 cols)                       */}
          {/* ========================================================================= */}
          {isReservationOpen && (
            <div className="md:col-span-12 lg:col-span-3 p-5 flex flex-col bg-white border-t lg:border-t-0">
              {/* Header: Reservation + Close matching Screenshot 2 */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F0F0F0] mb-5">
                <h3 className="font-bold text-lg text-[#222222]">Reservation</h3>
                <button
                  type="button"
                  onClick={() => setIsReservationOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F7F7F7] text-[#222222] transition cursor-pointer"
                  aria-label="Close reservation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* State 1: Error Card matching Screenshot 2 */}
              {reservationState === "error" ? (
                <div className="border border-[#DDDDDD] rounded-2xl p-5 bg-white shadow-xs space-y-4">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-[#222222]">Something went wrong.</h4>
                      <p className="text-xs text-[#717171] leading-relaxed mt-1">
                        Unfortunately, a server error prevented your request from being completed.
                        Airbnb may be undergoing maintenance or your connection may have timed out.
                        Please refresh the page or try again.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleRetryReservation}
                      disabled={isRetrying}
                      className="w-full py-2.5 px-4 rounded-xl border border-[#DDDDDD] hover:bg-[#F7F7F7] text-xs font-semibold text-[#222222] transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isRetrying ? (
                        <>
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <span>Try again</span>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* State 2: Active Reservation Details */
                <div className="border border-[#DDDDDD] rounded-2xl p-5 bg-white shadow-xs space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      Enquiry Pending
                    </span>
                    <h4 className="font-bold text-sm text-[#222222] pt-1">
                      {activeThread.listingTitle}
                    </h4>
                  </div>

                  <div className="space-y-2 text-xs text-[#717171] pt-2 border-t border-[#F0F0F0]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#222222]" />
                      <span>{activeThread.dates} (1 night)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#222222]" />
                      <span>16 guests (Birthday Party)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#222222]" />
                      <span>Sector 63, Noida, Uttar Pradesh</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#717171]">{t("listing.total", "Estimated")}:</span>
                      <div className="text-sm font-bold text-[#222222]">{formatPrice(45000)}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReservationState("error")}
                      className="text-[11px] text-[#717171] hover:underline cursor-pointer"
                    >
                      Show error state
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
