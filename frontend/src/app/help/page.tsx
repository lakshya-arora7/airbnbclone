"use client";

import React, { useState } from "react";
import Navbar from "@/components/header/Navbar";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTopicId, setExpandedTopicId] = useState<number | null>(null);

  const HELP_TOPICS = [
    {
      id: 1,
      title: "Cancelling your reservation",
      desc: "Learn about refund amounts and how to cancel a reservation as a guest.",
      details:
        "Go to your Trips tab, select the reservation you wish to cancel, and click 'Cancel reservation'. If cancelled before the host's check-in date, dates are immediately unlocked and refunded per the host's policy."
    },
    {
      id: 2,
      title: "How refunds work on Airbnb",
      desc: "Find out when and how your refund will be processed to your original payment method.",
      details:
        "Refunds are automatically issued to your original payment method used at checkout. For card payments, banks process refunds within 3–5 business days. UPI payments credit within 24 hours."
    },
    {
      id: 3,
      title: "AirCover protection for guests",
      desc: "What is covered if your host cancels or if check-in doesn't go as planned.",
      details:
        "AirCover is comprehensive protection included with every stay. If a host ever cancels or a property is significantly inaccurate upon arrival, Airbnb will find you an equivalent stay or issue a 100% refund."
    },
    {
      id: 4,
      title: "Changing dates or guest count",
      desc: "Submit a reservation alteration request directly to your host.",
      details:
        "You can coordinate check-in times and date changes directly through the Messages tab with your host, or cancel and rebook for your desired updated dates."
    },
    {
      id: 5,
      title: "Paying for your reservation",
      desc: "Accepted payment methods including Credit/Debit Cards and UPI.",
      details:
        "We support Visa, Mastercard, American Express, and instant UPI. Per assignment guidelines, payment checkout is mocked and immediately confirms your stay."
    },
    {
      id: 6,
      title: "House rules and quiet hours",
      desc: "Understanding community standards on noise, check-in, and safety.",
      details:
        "Guests are required to respect host-specific check-in windows, quiet hours, and maximum guest capacities listed on the property details page."
    }
  ];

  const filteredTopics = HELP_TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
        {/* Hero Search */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#222222] mb-3">Hi Lakshya, how can we help?</h1>
          <p className="text-sm text-[#717171] mb-6">Search our knowledge base or browse popular guides below.</p>

          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#717171]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search how-tos, policies, and more..."
              className="w-full pl-12 pr-4 py-3.5 rounded-full border border-[#DDDDDD] shadow-sm text-sm font-medium focus:outline-none focus:border-[#222222]"
            />
          </div>
        </div>

        {/* Popular Topics Grid (Interactive Accordion) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#222222]">Recommended Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTopics.map((topic) => {
              const isExpanded = expandedTopicId === topic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                  className="p-5 rounded-2xl border border-[#DDDDDD] hover:shadow-md cursor-pointer transition flex flex-col justify-between group bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#222222] group-hover:text-[#FF385C] transition-colors">
                        {topic.title}
                      </h4>
                      <p className="text-xs text-[#717171] mt-1 leading-relaxed">{topic.desc}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#222222] flex-shrink-0 mt-0.5 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#CCCCCC] group-hover:text-[#222222] transition-colors flex-shrink-0 mt-0.5 ml-2" />
                    )}
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-[#F0F0F0] text-xs text-[#484848] leading-relaxed animate-in fade-in duration-200">
                      {topic.details}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Need to get in touch? */}
        <div className="mt-14 p-8 rounded-3xl border border-[#DDDDDD] bg-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-lg text-[#222222]">Need to get in touch?</h3>
            <p className="text-xs text-[#717171]">Send an instant message or inquiry to priority support.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/messages"
              className="px-6 py-3 rounded-full bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold shadow-sm transition cursor-pointer"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
