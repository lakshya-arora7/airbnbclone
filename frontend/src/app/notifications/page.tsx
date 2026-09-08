"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/header/Navbar";
import { Bell, Check, Tag, ShieldCheck, MessageSquare, Calendar, ChevronRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";
import { useAuthPersona } from "@/context/AuthPersonaContext";
import { api } from "@/lib/api";

interface NotificationItem {
  id: number;
  type: "booking" | "message" | "offer" | "security";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  linkUrl: string;
}

export default function NotificationsPage() {
  const { t } = useLanguageCurrency();
  const { persona } = useAuthPersona();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filterTab, setFilterTab] = useState<"all" | "unread">("all");

  const loadAllNotifications = React.useCallback(async () => {
    const userId = persona.id || 1;
    const [liveNotifs, trips] = await Promise.all([
      api.getNotifications(userId),
      api.getMyTrips(userId),
    ]);

    const combined: NotificationItem[] = [];

    // 1. Live messages & system notifications from database
    if (Array.isArray(liveNotifs)) {
      liveNotifs.forEach((n: any) => {
        combined.push({
          id: n.id,
          type: (n.type || "message") as any,
          title: n.title,
          description: n.description,
          time: n.time || new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          isRead: n.is_read,
          linkUrl: n.link_url || "/messages",
        });
      });
    }

    // 2. Booking confirmed notifications
    if (Array.isArray(trips)) {
      trips.forEach((t: any) => {
        combined.push({
          id: 100000 + t.id,
          type: "booking",
          title: `Reservation ${t.status === "CONFIRMED" ? "Confirmed" : t.status}: ${t.listing?.title || "Property"}`,
          description: `Confirmation #${t.confirmation_code} · ${t.check_in} to ${t.check_out} (${t.total_nights} nights) for ${t.guests_count} guests.`,
          time: new Date(t.created_at || t.check_in).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          isRead: true,
          linkUrl: "/trips",
        });
      });
    }

    setNotifications(combined);
  }, [persona.id]);

  useEffect(() => {
    loadAllNotifications();

    const handleUpdate = () => loadAllNotifications();
    window.addEventListener("airbnb_notifications_updated", handleUpdate);
    window.addEventListener("airbnb_messages_updated", handleUpdate);
    return () => {
      window.removeEventListener("airbnb_notifications_updated", handleUpdate);
      window.removeEventListener("airbnb_messages_updated", handleUpdate);
    };
  }, [loadAllNotifications]);

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await api.markAllNotificationsAsRead(persona.id || 1);
  };

  const handleClearNotifications = async () => {
    setNotifications([]);
    await api.clearNotifications(persona.id || 1);
  };


  const filtered =
    filterTab === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col">
        {/* Top Header Row matching Screenshot 3 */}
        <div className="flex items-center justify-between pb-6 border-b border-[#EBEBEB]">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#222222]">
            {t("notifications.title", "Notifications")}
          </h1>

          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-[#222222] hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
              <span className="text-[#DDDDDD]">•</span>
              <button
                type="button"
                onClick={handleClearNotifications}
                className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Page Body */}
        {notifications.length === 0 ? (
          /* ========================================================================= */
          /* Exact Screenshot 3 Empty State                                           */
          /* ========================================================================= */
          <div className="flex-1 flex flex-col items-center justify-center py-24 sm:py-32 text-center">
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-lg sm:text-xl font-bold text-[#222222]">
                {t("notifications.noNotifications", "No notifications yet")}
              </h2>
              <p className="text-sm text-[#717171] leading-relaxed">
                {t(
                  "notifications.subtitle",
                  "You’ve got a blank slate (for now). We’ll let you know when updates arrive."
                )}
              </p>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* Active Notifications Feed when user has notifications                     */
          /* ========================================================================= */
          <div className="py-6 space-y-6 animate-in fade-in duration-200">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterTab("all")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    filterTab === "all"
                      ? "bg-[#222222] text-white"
                      : "bg-[#F7F7F7] text-[#717171] hover:text-[#222222]"
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab("unread")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    filterTab === "unread"
                      ? "bg-[#222222] text-white"
                      : "bg-[#F7F7F7] text-[#717171] hover:text-[#222222]"
                  }`}
                >
                  Unread ({notifications.filter((n) => !n.isRead).length})
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="font-semibold text-[#717171] hover:text-[#222222] hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
                <button
                  type="button"
                  onClick={handleClearNotifications}
                  className="font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-[#EBEBEB] border border-[#EBEBEB] rounded-2xl overflow-hidden bg-white shadow-xs">
              {filtered.map((item) => (
                <Link
                  key={item.id}
                  href={item.linkUrl}
                  className={`p-4 sm:p-5 flex items-start gap-4 hover:bg-[#F7F7F7] transition group ${
                    !item.isRead ? "bg-[#FFF9FA]" : "bg-white"
                  }`}
                >
                  <div className="p-2.5 rounded-full bg-[#F7F7F7] group-hover:bg-white text-[#222222] flex-shrink-0 transition border border-[#DDDDDD]">
                    {item.type === "booking" && <Calendar className="w-5 h-5 text-[#FF385C]" />}
                    {item.type === "message" && <MessageSquare className="w-5 h-5 text-blue-600" />}
                    {item.type === "offer" && <Tag className="w-5 h-5 text-emerald-600" />}
                    {item.type === "security" && <ShieldCheck className="w-5 h-5 text-amber-600" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-[#222222] truncate">{item.title}</h3>
                      <span className="text-[11px] text-[#717171] whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-xs text-[#717171] mt-1 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="self-center">
                    <ChevronRight className="w-4 h-4 text-[#717171] group-hover:text-[#222222] transition" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
