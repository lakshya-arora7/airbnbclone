"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  ShieldCheck,
  LifeBuoy,
  HeartHandshake,
  FileText,
  X,
  CheckCircle2,
  ExternalLink,
  Users,
  Award,
  Sparkles
} from "lucide-react";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";

interface ModalContent {
  title: string;
  category: string;
  content: React.ReactNode;
}

export default function Footer() {
  const pathname = usePathname();
  const [activeModal, setActiveModal] = useState<ModalContent | null>(null);
  const { currentLanguage, currentCurrency, openLanguageModal, openCurrencyModal } = useLanguageCurrency();

  // In Airbnb, the hosting dashboard (/hosting) and account settings (/account-settings) are full-screen workspaces without the public guest footer
  if (pathname?.startsWith("/hosting") || pathname?.startsWith("/account-settings")) {
    return null;
  }

  // Link Handlers
  const handleOpenModal = (title: string, category: string, content: React.ReactNode) => {
    setActiveModal({ title, category, content });
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <footer className="bg-[#F7F7F7] border-t border-[#DDDDDD] mt-16 text-[#222222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 3 Columns matching Screenshot 5 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pb-10 border-b border-[#DDDDDD]">
            {/* Column 1: Support / Guest Safety */}
            <div className="space-y-3.5">
              <button
                onClick={() =>
                  handleOpenModal(
                    "Get help with a safety issue",
                    "Support",
                    <div className="space-y-4">
                      <p className="text-sm text-[#717171]">
                        Our 24/7 specialized safety team is always ready to support guests and hosts around the clock.
                      </p>
                      <div className="bg-[#FFF0F3] border border-[#FFE4E8] rounded-2xl p-4">
                        <h4 className="font-bold text-sm text-[#FF385C] mb-1">Emergency 24/7 Safety Line</h4>
                        <p className="text-xs text-[#222222]">
                          Call: <span className="font-bold">+1-888-AIRBNB-SAFE</span> or start an urgent live chat with a crisis specialist.
                        </p>
                      </div>
                      <div className="space-y-2 text-xs text-[#717171]">
                        <p className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> One-tap direct access to local emergency services
                        </p>
                        <p className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Urgent rebooking assistance if a property is unsafe
                        </p>
                      </div>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Get help with a safety issue
              </button>

              <button
                onClick={() =>
                  handleOpenModal(
                    "AirCover for Guests",
                    "Protection",
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[#FF385C] font-bold text-lg">
                        <ShieldCheck className="w-6 h-6" />
                        <span>air<span className="text-[#222222]">cover</span></span>
                      </div>
                      <p className="text-sm text-[#222222] font-semibold">
                        Comprehensive protection included with every single booking on Airbnb.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-white border border-[#EBEBEB] rounded-xl">
                          <p className="font-bold text-[#222222]">Booking Protection Guarantee</p>
                          <p className="text-[#717171] mt-1">In the rare case a host cancels within 30 days of check-in, we find you a similar or better stay.</p>
                        </div>
                        <div className="p-3 bg-white border border-[#EBEBEB] rounded-xl">
                          <p className="font-bold text-[#222222]">Check-In Guarantee</p>
                          <p className="text-[#717171] mt-1">If you cannot check in, our 24/7 team immediately books an alternative home.</p>
                        </div>
                        <div className="p-3 bg-white border border-[#EBEBEB] rounded-xl">
                          <p className="font-bold text-[#222222]">Get-What-You-Booked Guarantee</p>
                          <p className="text-[#717171] mt-1">If the home differs significantly from the listing, we help resolve it or issue a full refund.</p>
                        </div>
                        <div className="p-3 bg-white border border-[#EBEBEB] rounded-xl">
                          <p className="font-bold text-[#222222]">24-Hour Safety Hotline</p>
                          <p className="text-[#717171] mt-1">Dedicated priority safety specialists available day or night.</p>
                        </div>
                      </div>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                AirCover
              </button>

              <button
                onClick={() =>
                  handleOpenModal(
                    "Anti-discrimination Policy",
                    "Community Commitment",
                    <div className="space-y-4 text-sm text-[#717171]">
                      <p>
                        Airbnb is built on welcoming anyone, anywhere. Every member of our community agrees to treat fellow members with respect and without bias, regardless of race, religion, national origin, ethnicity, disability, sex, or sexual orientation.
                      </p>
                      <div className="p-4 bg-white border border-[#DDDDDD] rounded-xl text-xs text-[#222222] font-medium">
                        "We commit to working together to build a world where anyone can belong anywhere."
                      </div>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Anti-discrimination
              </button>

              <button
                onClick={() =>
                  handleOpenModal(
                    "Disability Support & Accessibility",
                    "Accessibility",
                    <div className="space-y-3 text-sm text-[#717171]">
                      <p>
                        We want everyone to find places that meet their needs. Airbnb homes can be filtered for step-free guest entrance, wide doorways, accessible parking, and roll-in showers.
                      </p>
                      <p className="text-xs text-[#222222] font-semibold">
                        Over 25,000 homes verified for accessibility features worldwide.
                      </p>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Disability support
              </button>

              <button
                onClick={() =>
                  handleOpenModal(
                    "Cancellation Options",
                    "Policies",
                    <div className="space-y-3 text-xs text-[#222222]">
                      <div className="p-3 bg-white border border-[#DDDDDD] rounded-xl">
                        <span className="font-bold text-sm block mb-1">Flexible</span>
                        <p className="text-[#717171]">Full refund up to 24 hours before check-in. Partial refund thereafter.</p>
                      </div>
                      <div className="p-3 bg-white border border-[#DDDDDD] rounded-xl">
                        <span className="font-bold text-sm block mb-1">Moderate</span>
                        <p className="text-[#717171]">Full refund up to 5 days before check-in.</p>
                      </div>
                      <div className="p-3 bg-white border border-[#DDDDDD] rounded-xl">
                        <span className="font-bold text-sm block mb-1">Strict</span>
                        <p className="text-[#717171]">Full refund for cancellations made within 48 hours of booking (if at least 14 days before check-in).</p>
                      </div>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Cancellation options
              </button>

              <button
                onClick={() =>
                  handleOpenModal(
                    "Report Neighbourhood Concern",
                    "Neighbourhood Support",
                    <div className="space-y-3 text-sm text-[#717171]">
                      <p>
                        If you are a neighbour experiencing an issue with a nearby Airbnb listing (excessive noise, parking issues, or trash), submit a report directly to our Neighbourhood Support team.
                      </p>
                      <Link
                        href="/help"
                        onClick={handleCloseModal}
                        className="inline-block bg-[#222222] hover:bg-black px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition"
                      >
                        Visit Help Centre
                      </Link>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Report neighbourhood concern
              </button>
            </div>

            {/* Column 2: Hosting */}
            <div className="space-y-3.5">
              <button
                onClick={() =>
                  handleOpenModal(
                    "Airbnb your experience",
                    "Host Experiences",
                    <div className="space-y-3 text-sm text-[#717171]">
                      <p>
                        Turn your passion into an income stream. Lead culinary tours, guided hikes, photography workshops, or pottery sessions for travellers worldwide.
                      </p>
                      <div className="p-4 bg-white border border-[#DDDDDD] rounded-xl text-xs">
                        <p className="font-bold text-[#222222]">Average experience host earnings in India:</p>
                        <p className="text-base font-bold text-[#FF385C] mt-1">₹45,000 / month</p>
                      </div>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Airbnb your experience
              </button>

              <button
                onClick={() =>
                  handleOpenModal(
                    "Airbnb your service",
                    "Host Services",
                    <div className="space-y-3 text-sm text-[#717171]">
                      <p>
                        Offer on-demand services for travellers, from private chef meals to professional airport transfers and wellness treatments.
                      </p>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Airbnb your service
              </button>

              <button
                onClick={() =>
                  handleOpenModal(
                    "AirCover for Hosts",
                    "Host Protection",
                    <div className="space-y-3 text-sm text-[#222222]">
                      <p className="text-[#717171]">
                        Top-to-bottom protection for every host on Airbnb, completely free of charge.
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="p-3 bg-white border border-[#DDDDDD] rounded-xl">
                          <p className="font-bold">$3,000,000 USD Host Damage Protection</p>
                          <p className="text-[#717171]">Covers home, art, valuables, and auto damage during a stay.</p>
                        </div>
                        <div className="p-3 bg-white border border-[#DDDDDD] rounded-xl">
                          <p className="font-bold">$1,000,000 USD Host Liability Insurance</p>
                          <p className="text-[#717171]">Protects you in the rare event a guest is injured.</p>
                        </div>
                      </div>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                AirCover for Hosts
              </button>

              <button
                onClick={() =>
                  handleOpenModal(
                    "Hosting Resources",
                    "Education",
                    <div className="space-y-3 text-sm text-[#717171]">
                      <p>
                        Explore comprehensive guides on how to take professional listing photos, set competitive smart pricing, manage calendars, and achieve Superhost status.
                      </p>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Hosting resources
              </button>

              <button
                onClick={() =>
                  handleOpenModal(
                    "Community Forum",
                    "Host Community",
                    <div className="space-y-3 text-sm text-[#717171]">
                      <p>
                        Connect with over 4 million hosts globally. Share tips, discuss local regulations, and learn best hospitality practices.
                      </p>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Community forum
              </button>

              <button
                onClick={() =>
                  handleOpenModal(
                    "Hosting Responsibly",
                    "Standards",
                    <div className="space-y-3 text-sm text-[#717171]">
                      <p>
                        Guidance on local building codes, safety precautions, fire extinguishers, smoke alarms, noise decibel monitoring, and respecting neighbours.
                      </p>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Hosting responsibly
              </button>

              <button
                onClick={() =>
                  handleOpenModal(
                    "Join a free hosting class",
                    "Live Webinars",
                    <div className="space-y-4">
                      <p className="text-sm text-[#717171]">
                        Join a 45-minute interactive webinar with a seasoned Superhost to learn how to launch your first Airbnb listing smoothly.
                      </p>
                      <div className="p-3 bg-white border border-[#DDDDDD] rounded-xl text-xs space-y-1">
                        <p className="font-bold text-[#222222]">Next session: Thursday, 7:00 PM IST</p>
                        <p className="text-[#717171]">Topic: Creating high-converting listing titles and photography</p>
                      </div>
                      <Link
                        href="/hosting"
                        onClick={handleCloseModal}
                        className="inline-block bg-[#222222] hover:bg-black px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition"
                      >
                        Explore Host Dashboard
                      </Link>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Join a free hosting class
              </button>

              <button
                onClick={() =>
                  handleOpenModal(
                    "Find a Co-Host",
                    "Co-Hosting Network",
                    <div className="space-y-3 text-sm text-[#717171]">
                      <p>
                        Hire an experienced local co-host in Noida, Greater Noida, or Delhi to take care of guest communications, cleaning, key handoffs, and maintenance.
                      </p>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Find a co host
              </button>

              <button
                onClick={() =>
                  handleOpenModal(
                    "Refer a Host",
                    "Host Referral Bonus",
                    <div className="space-y-3 text-sm text-[#717171]">
                      <p>
                        Know someone with an extra room, apartment, or vacation villa? Refer them and earn up to ₹20,000 when they welcome their first guest.
                      </p>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Refer a host
              </button>
            </div>

            {/* Column 3: Airbnb Corporate & News */}
            <div className="space-y-3.5">
              <button
                onClick={() =>
                  handleOpenModal(
                    "Newsroom",
                    "Press & Releases",
                    <div className="space-y-3 text-sm text-[#717171]">
                      <p className="text-xs font-bold uppercase text-[#FF385C]">Latest Updates</p>
                      <p className="font-semibold text-[#222222]">
                        Airbnb 2026 Summer Release: Introducing Icons, Shared Wishlists, and Group Trips.
                      </p>
                      <p className="text-xs">Published September 2026 · 4 min read</p>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Newsroom
              </button>

              <button
                onClick={() =>
                  handleOpenModal(
                    "Careers at Airbnb",
                    "Join Our Team",
                    <div className="space-y-3 text-sm text-[#717171]">
                      <p>
                        Work from anywhere in the world. We are hiring engineers, product designers, data scientists, and community support specialists.
                      </p>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Careers
              </button>

              <button
                onClick={() =>
                  handleOpenModal(
                    "Investors",
                    "Investor Relations",
                    <div className="space-y-3 text-sm text-[#717171]">
                      <p>
                        Quarterly financial results, annual shareholder reports, SEC filings, and corporate governance for Airbnb, Inc. (NASDAQ: ABNB).
                      </p>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Investors
              </button>

              <button
                onClick={() =>
                  handleOpenModal(
                    "Airbnb.org Emergency Stays",
                    "Non-Profit Housing",
                    <div className="space-y-3 text-sm text-[#717171]">
                      <p>
                        An independent 501(c)(3) nonprofit organization that partners with hosts to provide free, temporary housing to people displaced by natural disasters and humanitarian crises.
                      </p>
                    </div>
                  )
                }
                className="block text-sm text-[#222222] hover:underline text-left transition"
              >
                Airbnb.org emergency stays
              </button>
            </div>
          </div>

          {/* Bottom Legal & Locale Bar matching Screenshot 5 */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#222222]">
            {/* Left: Copyright & Legal */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-[#222222]">
              <span>© 2026 Airbnb, Inc.</span>
              <span>·</span>
              <button
                onClick={() =>
                  handleOpenModal(
                    "Privacy Policy",
                    "Legal",
                    <div className="space-y-3 text-sm text-[#717171]">
                      <p>Your privacy is important to us. Learn how Airbnb collects, uses, and safeguards your personal data across our services.</p>
                    </div>
                  )
                }
                className="hover:underline"
              >
                Privacy
              </button>
              <span>·</span>
              <button
                onClick={() =>
                  handleOpenModal(
                    "Terms of Service",
                    "Legal",
                    <div className="space-y-3 text-sm text-[#717171]">
                      <p>General terms governing the use of the Airbnb platform, payments, cancellations, and host-guest obligations.</p>
                    </div>
                  )
                }
                className="hover:underline"
              >
                Terms
              </button>
              <span>·</span>
              <button
                onClick={() =>
                  handleOpenModal(
                    "Company Details",
                    "Corporate Information",
                    <div className="space-y-3 text-sm text-[#717171]">
                      <p className="font-semibold text-[#222222]">Airbnb India Private Limited</p>
                      <p className="text-xs">CIN: U74999DL2016PTC291884</p>
                      <p className="text-xs">Regd Office: Connaught Place, New Delhi 110001, India</p>
                    </div>
                  )
                }
                className="hover:underline"
              >
                Company details
              </button>
            </div>

            {/* Right: Language, Currency & Social Links */}
            <div className="flex items-center gap-6 text-sm font-semibold">
              {/* Language Selector */}
              <button
                onClick={openLanguageModal}
                className="flex items-center gap-2 hover:underline cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLanguage.name} ({currentLanguage.code.split("-")[1] || "IN"})</span>
              </button>

              {/* Currency Selector */}
              <button
                onClick={openCurrencyModal}
                className="hover:underline cursor-pointer"
              >
                {currentCurrency.symbol} {currentCurrency.code}
              </button>

              {/* Social Icons */}
              <div className="flex items-center gap-4 text-[#222222]">
                {/* Facebook */}
                <a
                  href="https://facebook.com/airbnb"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-75 transition"
                  aria-label="Airbnb on Facebook"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>

                {/* X (formerly Twitter) */}
                <a
                  href="https://twitter.com/airbnb"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-75 transition"
                  aria-label="Airbnb on X"
                >
                  <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/airbnb"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-75 transition"
                  aria-label="Airbnb on Instagram"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Detail Modal for any clicked footer link */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#DDDDDD] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#EBEBEB] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF385C]">
                  {activeModal.category}
                </span>
                <h3 className="font-bold text-lg text-[#222222]">{activeModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-full hover:bg-[#F7F7F7] text-[#222222] transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">{activeModal.content}</div>

            <div className="px-6 py-3 bg-[#F7F7F7] border-t border-[#EBEBEB] flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-full border border-[#222222] bg-white font-semibold text-xs text-[#222222] hover:bg-[#F7F7F7] transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
