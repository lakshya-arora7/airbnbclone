"use client";

import React, { useState } from "react";
import { X, MessageSquare, Check, Sparkles, Send, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthPersona } from "@/context/AuthPersonaContext";

interface ContactHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    id: number;
    title: string;
    city: string;
    images?: { url: string }[];
    hostId?: number;
    host?: {
      id?: number;
      fullName?: string;
      avatarUrl?: string;
      isSuperhost?: boolean;
    };
  };
}

const QUICK_INQUIRIES = [
  "Hi, is it possible to request an earlier check-in time?",
  "Hello! Is there dedicated parking available on the premises?",
  "Hi, could you please tell me about the Wi-Fi speed and workspace setup?",
  "Hello, are there any quiet hours or specific house rules to keep in mind?",
];

export default function ContactHostModal({ isOpen, onClose, listing }: ContactHostModalProps) {
  const router = useRouter();
  const { persona } = useAuthPersona();

  const hostName = listing.host?.fullName || "Host";
  const hostAvatar = listing.host?.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80";
  const hostId = listing.host?.id || listing.hostId || 2;
  const listingImage = listing.images?.[0]?.url || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600";

  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) {
      setErrorMsg("Please write a message before sending.");
      return;
    }

    setIsSending(true);
    setErrorMsg(null);

    const senderId = persona?.id || 1;
    const result = await api.sendMessage(
      {
        recipientId: hostId,
        listingId: listing.id,
        text: messageText.trim(),
      },
      senderId
    );

    setIsSending(false);

    if (result) {
      setIsSuccess(true);
    } else {
      setErrorMsg("Unable to send message. Please try again.");
    }
  };

  const handleSelectQuickInquiry = (chipText: string) => {
    setMessageText((prev) => (prev ? `${prev}\n${chipText}` : chipText));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#DDDDDD] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#EBEBEB] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#222222]">
            <MessageSquare className="w-5 h-5 text-[#FF385C]" />
            <h3 className="font-bold text-lg">Contact {hostName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F7F7F7] text-[#717171] hover:text-[#222222] transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-bold text-[#222222]">Message sent to {hostName}!</h4>
                <p className="text-sm text-[#717171] max-w-sm mx-auto leading-relaxed">
                  {hostName} has been notified and will reply to your message soon. You can view all replies in your Messages.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push("/messages");
                  }}
                  className="px-6 py-3 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Go to Messages</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-[#DDDDDD] text-[#222222] font-semibold text-sm rounded-xl hover:bg-[#F7F7F7] transition cursor-pointer"
                >
                  Stay on this listing
                </button>
              </div>
            </div>
          ) : (
            /* Message Composition Form */
            <>
              {/* Host & Listing Summary Card */}
              <div className="p-4 rounded-2xl bg-[#F7F7F7] border border-[#EBEBEB] flex items-center gap-4">
                <img
                  src={hostAvatar}
                  alt={hostName}
                  className="w-14 h-14 rounded-full object-cover border border-white shadow-xs flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-base text-[#222222] truncate">{hostName}</p>
                    {listing.host?.isSuperhost && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-[#FF385C] border border-rose-100">
                        Superhost
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#717171] truncate mt-0.5">
                    Host of <span className="font-medium text-[#222222]">{listing.title}</span> ({listing.city})
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Usually responds within an hour
                  </p>
                </div>
              </div>

              {/* Quick Inquiry Chips */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#717171] uppercase tracking-wider">
                  Quick inquiries
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_INQUIRIES.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectQuickInquiry(chip)}
                      className="text-xs text-[#222222] bg-white border border-[#DDDDDD] hover:border-[#222222] hover:bg-[#FAFAFA] rounded-full px-3.5 py-1.5 transition text-left cursor-pointer"
                    >
                      {chip.slice(0, 36)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label htmlFor="host-message-input" className="block text-xs font-bold text-[#717171] uppercase tracking-wider mb-2">
                    Your message
                  </label>
                  <textarea
                    id="host-message-input"
                    rows={4}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`Hi ${hostName}, I'm interested in staying at your place and had a question regarding...`}
                    className="w-full p-4 rounded-2xl border border-[#DDDDDD] text-sm text-[#222222] placeholder:text-[#999999] focus:outline-hidden focus:border-[#222222] focus:ring-1 focus:ring-[#222222] transition resize-none leading-relaxed"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs font-semibold text-rose-600">{errorMsg}</p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[#717171]">
                    Sending as <strong className="text-[#222222]">{persona?.fullName || "Guest"}</strong>
                  </span>

                  <button
                    type="submit"
                    disabled={isSending || !messageText.trim()}
                    className={`px-6 py-3 rounded-xl font-bold text-sm text-white flex items-center gap-2 transition cursor-pointer shadow-md ${
                      isSending || !messageText.trim()
                        ? "bg-[#CCCCCC] cursor-not-allowed shadow-none"
                        : "bg-[#FF385C] hover:bg-[#E00B41] active:scale-98"
                    }`}
                  >
                    {isSending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
