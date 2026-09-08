"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/header/Navbar";
import {
  Search,
  Settings,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  X,
  Mail,
  Calendar,
  Users,
  MapPin,
  Languages,
  MessageSquare,
  Trash2,
  ExternalLink,
  Home
} from "lucide-react";
import Link from "next/link";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";
import { useAuthPersona } from "@/context/AuthPersonaContext";
import { api } from "@/lib/api";

interface ChatMessage {
  id: number;
  sender: "guest" | "host" | "system";
  sender_id?: number;
  sender_name?: string;
  sender_avatar?: string;
  text: string;
  time: string;
  created_at?: string;
  is_read?: boolean;
}

interface ThreadParticipant {
  id: number;
  full_name: string;
  avatar_url?: string;
  role: string;
  is_superhost?: boolean;
}

interface ThreadListing {
  id: number;
  title: string;
  city: string;
  country: string;
  image_url?: string;
  price_per_night: number;
}

interface ThreadData {
  thread_id: string;
  other_user: ThreadParticipant;
  listing?: ThreadListing;
  last_message?: string;
  last_message_date?: string;
  unread_count: number;
  messages: ChatMessage[];
}

export default function MessagesPage() {
  const { formatPrice, t } = useLanguageCurrency();
  const { persona } = useAuthPersona();

  const [threads, setThreads] = useState<ThreadData[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isListingPanelOpen, setIsListingPanelOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load real conversation threads from backend for current persona
  const loadThreads = useCallback(async () => {
    const userId = persona?.id || 1;
    const data = await api.getMessagesThreads(userId);
    setThreads(data || []);
    if (data && data.length > 0) {
      setActiveThreadId((prev) => {
        if (prev && data.some((t: ThreadData) => t.thread_id === prev)) {
          return prev;
        }
        return data[0].thread_id;
      });
    } else {
      setActiveThreadId(null);
    }
    setIsLoading(false);
  }, [persona?.id]);

  useEffect(() => {
    loadThreads();

    const handleUpdate = () => {
      loadThreads();
    };

    window.addEventListener("airbnb_messages_updated", handleUpdate);
    return () => {
      window.removeEventListener("airbnb_messages_updated", handleUpdate);
    };
  }, [loadThreads]);

  const activeThread = threads.find((t) => t.thread_id === activeThreadId) || threads[0] || null;

  // Mark thread as read when selected
  useEffect(() => {
    if (activeThreadId && persona?.id) {
      api.markThreadAsRead(activeThreadId, persona.id);
      setThreads((prev) =>
        prev.map((t) => (t.thread_id === activeThreadId ? { ...t, unread_count: 0 } : t))
      );
    }
  }, [activeThreadId, persona?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    const outgoingText = inputText.trim();
    setInputText("");

    // Optimistic UI update
    const tempMsg: ChatMessage = {
      id: Date.now(),
      sender: persona?.role === "HOST" ? "host" : "guest",
      sender_id: persona?.id || 1,
      sender_name: "You",
      sender_avatar: persona?.avatarUrl,
      text: outgoingText,
      time: "Just now",
      created_at: new Date().toISOString(),
      is_read: false,
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.thread_id === activeThread.thread_id) {
          return {
            ...t,
            last_message: outgoingText,
            last_message_date: "Just now",
            messages: [...t.messages, tempMsg],
          };
        }
        return t;
      })
    );

    await api.sendMessage(
      {
        recipientId: activeThread.other_user.id,
        listingId: activeThread.listing?.id,
        text: outgoingText,
      },
      persona?.id || 1
    );

    loadThreads();
  };

  const handleDeleteThread = async (threadId: string) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;
    await api.deleteThread(threadId, persona?.id || 1);
    loadThreads();
  };

  // Filter conversations
  const filteredThreads = threads.filter((t) => {
    if (filterTab === "unread" && t.unread_count === 0) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.other_user.full_name.toLowerCase().includes(q) ||
        (t.listing?.title && t.listing.title.toLowerCase().includes(q)) ||
        (t.last_message && t.last_message.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1680px] w-full mx-auto px-2 sm:px-4 lg:px-8 py-4 flex flex-col">
        {/* If no conversations at all across the application, show clean zero-state */}
        {!isLoading && threads.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-20 text-center border border-[#EBEBEB] rounded-3xl bg-white shadow-xs my-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-[#FF385C] mb-4">
              <MessageSquare className="w-8 h-8 stroke-[1.8]" />
            </div>

            <h2 className="text-2xl font-bold text-[#222222]">You have no messages yet</h2>
            <p className="text-sm text-[#717171] max-w-md mx-auto mt-2 leading-relaxed">
              When you contact a host from any listing page or receive inquiries about your stays, your active conversations will appear right here.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/"
                className="px-6 py-3 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-sm flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Explore Stays & Contact Host</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Active 3-Column Messaging Interface */
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 border border-[#EBEBEB] rounded-3xl overflow-hidden bg-white shadow-xs min-h-[720px]">
            {/* COLUMN 1: Threads List (Width: 4 cols) */}
            <div className="md:col-span-4 lg:col-span-4 border-r border-[#EBEBEB] flex flex-col bg-white">
              {/* Header: Messages + Search */}
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
                      placeholder="Search by name or property..."
                      className="w-full px-3 py-2 text-xs border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-[#222222]"
                      autoFocus
                    />
                  </div>
                )}

                {/* Filter Pills: [ All ] and [ Unread ] */}
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
                  <div className="p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#F7F7F7] flex items-center justify-center mx-auto text-[#717171]">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-[#222222]">You have no unread messages</h4>
                    <p className="text-xs text-[#717171] leading-relaxed">
                      When you have new replies from hosts, they will appear here.
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
                    const isSelected = thread.thread_id === activeThread?.thread_id;
                    const avatarUrl =
                      thread.other_user.avatar_url ||
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80";

                    return (
                      <div
                        key={thread.thread_id}
                        onClick={() => setActiveThreadId(thread.thread_id)}
                        className={`p-4 transition cursor-pointer flex items-start gap-3.5 hover:bg-[#F7F7F7] ${
                          isSelected ? "bg-[#F7F7F7]" : "bg-white"
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <img
                            src={avatarUrl}
                            alt={thread.other_user.full_name}
                            className="w-12 h-12 rounded-full object-cover border border-[#DDDDDD]"
                          />
                          {thread.unread_count > 0 && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF385C] rounded-full border-2 border-white" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-[#222222] truncate flex items-center gap-1.5">
                              <span>{thread.other_user.full_name}</span>
                              {thread.other_user.is_superhost && (
                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-rose-50 text-[#FF385C]">
                                  Superhost
                                </span>
                              )}
                            </h4>
                            <span className="text-[11px] text-[#717171] font-medium">
                              {thread.last_message_date || "Today"}
                            </span>
                          </div>
                          {thread.listing && (
                            <p className="text-xs text-[#717171] truncate mt-0.5 font-medium">
                              {thread.listing.title} ({thread.listing.city})
                            </p>
                          )}
                          <p className="text-xs text-[#717171] truncate mt-0.5">
                            {thread.last_message || "No messages yet"}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* COLUMN 2: Active Chat Stream */}
            <div className="md:col-span-8 lg:col-span-5 flex flex-col bg-white border-r border-[#EBEBEB]">
              {!activeThread ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#717171]">
                  <MessageSquare className="w-12 h-12 text-[#DDDDDD] mb-3" />
                  <h4 className="font-bold text-base text-[#222222]">No conversation selected</h4>
                  <p className="text-xs text-[#717171] max-w-xs mt-1">
                    Select a conversation from the left to view messages.
                  </p>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="px-6 py-4 border-b border-[#F0F0F0] flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          activeThread.other_user.avatar_url ||
                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                        }
                        alt={activeThread.other_user.full_name}
                        className="w-10 h-10 rounded-full object-cover border border-[#DDDDDD]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-base text-[#222222]">
                            {activeThread.other_user.full_name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#717171]">
                          <Languages className="w-3.5 h-3.5 text-[#717171]" />
                          <span>Translation on</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteThread(activeThread.thread_id)}
                        className="p-2 rounded-full hover:bg-rose-50 text-[#717171] hover:text-rose-600 transition cursor-pointer"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsListingPanelOpen(!isListingPanelOpen)}
                        className="text-xs font-semibold text-[#717171] hover:text-[#222222] border border-[#DDDDDD] px-3 py-1.5 rounded-full transition cursor-pointer"
                      >
                        {isListingPanelOpen ? "Hide details" : "Show details"}
                      </button>
                    </div>
                  </div>

                  {/* Chat Messages Body */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-white">
                    {/* Listing context pill */}
                    {activeThread.listing && (
                      <div className="text-center py-2">
                        <div className="inline-flex items-center gap-2 bg-[#F7F7F7] border border-[#EBEBEB] text-[#717171] px-4 py-1.5 rounded-full text-xs font-medium">
                          <span>Inquiry regarding</span>
                          <Link
                            href={`/rooms/${activeThread.listing.id}`}
                            className="font-bold text-[#222222] hover:text-[#FF385C] underline"
                          >
                            {activeThread.listing.title}
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Messages stream */}
                    {activeThread.messages.map((msg) => {
                      const isMe = msg.sender_id === persona?.id || msg.sender_name === "You";

                      if (isMe) {
                        return (
                          <div key={msg.id} className="flex flex-col items-end space-y-1">
                            <div className="text-[11px] text-[#717171] pr-1">{msg.time}</div>
                            <div className="max-w-lg bg-[#222222] text-white px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-xs">
                              {msg.text}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={msg.id} className="flex flex-col items-start space-y-1">
                          <div className="text-xs text-[#717171] pl-1 font-medium">
                            {msg.sender_name || activeThread.other_user.full_name} · {msg.time}
                          </div>

                          <div className="flex items-start gap-2.5 max-w-lg">
                            <img
                              src={
                                msg.sender_avatar ||
                                activeThread.other_user.avatar_url ||
                                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                              }
                              alt={msg.sender_name || "User"}
                              className="w-8 h-8 rounded-full object-cover border border-[#DDDDDD] mt-1 flex-shrink-0"
                            />
                            <div className="bg-[#F7F7F7] text-[#222222] px-5 py-3.5 rounded-2xl text-sm leading-relaxed border border-[#EBEBEB]">
                              {msg.text}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Message Input Box */}
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
                        placeholder={`Write a message to ${activeThread.other_user.full_name}...`}
                        rows={2}
                        className="w-full text-sm text-[#222222] placeholder-[#717171] resize-none focus:outline-none bg-transparent"
                      />

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-[#717171]">
                          Sending as <strong className="text-[#222222]">{persona?.fullName}</strong>
                        </span>

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
                </>
              )}
            </div>

            {/* COLUMN 3: Right Details Panel (Listing Info) */}
            {isListingPanelOpen && activeThread && (
              <div className="md:col-span-12 lg:col-span-3 p-5 flex flex-col bg-white border-t lg:border-t-0">
                <div className="flex items-center justify-between pb-4 border-b border-[#F0F0F0] mb-5">
                  <h3 className="font-bold text-lg text-[#222222]">Stay Details</h3>
                  <button
                    type="button"
                    onClick={() => setIsListingPanelOpen(false)}
                    className="p-1.5 rounded-full hover:bg-[#F7F7F7] text-[#222222] transition cursor-pointer"
                    aria-label="Close details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {activeThread.listing ? (
                  <div className="border border-[#DDDDDD] rounded-2xl overflow-hidden bg-white shadow-xs space-y-4 p-4">
                    {activeThread.listing.image_url && (
                      <div className="w-full h-40 rounded-xl overflow-hidden bg-[#F7F7F7]">
                        <img
                          src={activeThread.listing.image_url}
                          alt={activeThread.listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#FF385C] bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Listing
                      </span>
                      <h4 className="font-bold text-sm text-[#222222] pt-1">
                        {activeThread.listing.title}
                      </h4>
                      <p className="text-xs text-[#717171] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{activeThread.listing.city}, {activeThread.listing.country}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#717171]">Nightly rate:</span>
                        <div className="text-sm font-bold text-[#222222]">
                          {formatPrice(activeThread.listing.price_per_night)}
                          <span className="text-xs font-normal text-[#717171]"> / night</span>
                        </div>
                      </div>

                      <Link
                        href={`/rooms/${activeThread.listing.id}`}
                        className="px-3.5 py-2 rounded-xl bg-[#222222] hover:bg-black text-white text-xs font-semibold transition flex items-center gap-1.5"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-[#717171] border border-[#EBEBEB] rounded-2xl">
                    Direct conversation with {activeThread.other_user.full_name}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
