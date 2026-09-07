"use client";

import React, { useState } from "react";
import Navbar from "@/components/header/Navbar";
import { Copy, Check, Gift, Users, IndianRupee, Sparkles, Share2 } from "lucide-react";

export default function ReferHostPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://www.airbnb.co.in/r/lakshya?c=.pi0.pkc3RhcnRfaG9zdGluZw==";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-[#FFF0F3] text-[#FF385C] flex items-center justify-center mb-4">
            <Gift className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#222222] mb-3">
            Earn ₹20,000 for every host you refer
          </h1>
          <p className="text-sm text-[#717171] leading-relaxed">
            Know someone with an extra room, apartment, or vacation home? Share your referral link and earn a bonus when they welcome their first guest.
          </p>
        </div>

        {/* Copy Referral Link Card */}
        <div className="bg-[#F7F7F7] border border-[#EBEBEB] rounded-3xl p-6 sm:p-8 max-w-xl mx-auto mb-12 shadow-sm">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#717171] mb-2">
            Your personal referral link
          </label>
          <div className="flex items-center gap-2 bg-white border border-[#DDDDDD] rounded-2xl p-2 pl-4">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 bg-transparent text-xs sm:text-sm text-[#222222] font-mono focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-[#222222] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* How It Works Steps */}
        <div className="space-y-6 mb-12">
          <h2 className="text-xl font-bold text-[#222222] text-center">How referral bonuses work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-[#EBEBEB] text-center space-y-2 bg-white">
              <div className="w-10 h-10 rounded-full bg-[#F7F7F7] font-bold text-sm text-[#222222] flex items-center justify-center mx-auto">
                1
              </div>
              <h4 className="font-bold text-sm text-[#222222]">Share your link</h4>
              <p className="text-xs text-[#717171]">Send your unique invite link to friends, family, or colleagues.</p>
            </div>

            <div className="p-6 rounded-3xl border border-[#EBEBEB] text-center space-y-2 bg-white">
              <div className="w-10 h-10 rounded-full bg-[#F7F7F7] font-bold text-sm text-[#222222] flex items-center justify-center mx-auto">
                2
              </div>
              <h4 className="font-bold text-sm text-[#222222]">They list their space</h4>
              <p className="text-xs text-[#717171]">They publish their listing and receive guidance from seasoned Superhosts.</p>
            </div>

            <div className="p-6 rounded-3xl border border-[#EBEBEB] text-center space-y-2 bg-white">
              <div className="w-10 h-10 rounded-full bg-[#F7F7F7] font-bold text-sm text-[#222222] flex items-center justify-center mx-auto">
                3
              </div>
              <h4 className="font-bold text-sm text-[#222222]">You both get rewarded</h4>
              <p className="text-xs text-[#717171]">Once their first guest completes a stay, ₹20,000 is transferred to you.</p>
            </div>
          </div>
        </div>

        {/* Activity & Earnings Tracker */}
        <div className="p-6 rounded-3xl border border-[#DDDDDD] bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-4">
            <div>
              <h3 className="font-bold text-base text-[#222222]">Your Referrals</h3>
              <p className="text-xs text-[#717171]">Track your invited hosts and pending payouts</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              ₹0 Earned to date
            </span>
          </div>

          <div className="text-center py-6 text-xs text-[#717171]">
            <p className="font-semibold text-sm text-[#222222]">No completed referrals yet</p>
            <p className="mt-1">Share your link above to start inviting prospective hosts.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
