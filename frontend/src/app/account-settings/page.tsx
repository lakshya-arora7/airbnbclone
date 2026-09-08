"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  Eye,
  Bell,
  CreditCard,
  Globe,
  Monitor,
  Smartphone,
  ChevronRight,
  X,
  Check,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuthPersona } from "@/context/AuthPersonaContext";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";

type AccountNavTab =
  | "personal"
  | "security"
  | "privacy"
  | "notifications"
  | "payments"
  | "preferences";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { persona, updateProfile } = useAuthPersona();
  const { currentLanguage, currentCurrency, openLanguageModal, openCurrencyModal, t, formatPrice } =
    useLanguageCurrency();

  // Active Sidebar Tab
  const [activeTab, setActiveTab] = useState<AccountNavTab>("personal");

  // =========================================================================
  // 1. Personal Information State
  // =========================================================================
  const [legalName, setLegalName] = useState(persona.fullName || "Lakshya Arora");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editFirstName, setEditFirstName] = useState("Lakshya");
  const [editLastName, setEditLastName] = useState("Arora");

  const [preferredName, setPreferredName] = useState("");
  const [isEditingPreferred, setIsEditingPreferred] = useState(false);
  const [tempPreferred, setTempPreferred] = useState("");

  const [emailAddress, setEmailAddress] = useState(persona.email || "l***1@gmail.com");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(emailAddress);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(true);

  const [phoneNumber, setPhoneNumber] = useState("+91 ***** *5664");
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [tempPhone, setTempPhone] = useState(phoneNumber);

  const [idVerificationStatus, setIdVerificationStatus] = useState<"Not started" | "Verified">("Not started");
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // =========================================================================
  // 2. Login & Security State
  // =========================================================================
  const [isPasskeyModalOpen, setIsPasskeyModalOpen] = useState(false);
  const [passkeys, setPasskeys] = useState<string[]>([]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [deviceSessions, setDeviceSessions] = useState([
    {
      id: 1,
      title: "Windows 10.0 · Chrome",
      location: "Noida, Uttar Pradesh",
      date: "7 September 2026 at 17:17",
      isCurrent: true,
      icon: "desktop",
    },
    {
      id: 2,
      title: "iOS",
      location: "Noida, Uttar Pradesh",
      date: "3 September 2026 at 14:32",
      isCurrent: false,
      icon: "mobile",
    },
    {
      id: 3,
      title: "iOS 26.3.1 · Chrome Mobile",
      location: "Greater Noida, Uttar Pradesh",
      date: "18 April 2026 at 18:04",
      isCurrent: false,
      icon: "tablet",
    },
  ]);

  // =========================================================================
  // 3. Payments State
  // =========================================================================
  const [paymentsSubTab, setPaymentsSubTab] = useState<"payments" | "payouts">("payments");
  const [expandedPayoutHelp, setExpandedPayoutHelp] = useState<string | null>(null);
  const [dataArchiveRequested, setDataArchiveRequested] = useState(false);
  const [isManagePaymentsOpen, setIsManagePaymentsOpen] = useState(false);
  const [isAddPaymentMethodOpen, setIsAddPaymentMethodOpen] = useState(false);
  const [paymentCards, setPaymentCards] = useState([
    { id: 1, type: "Visa", last4: "4242", expiry: "12/28" },
  ]);
  const [isAddGiftCardOpen, setIsAddGiftCardOpen] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState("");
  const [giftCardBalance, setGiftCardBalance] = useState(0);

  const [isSetupPayoutsOpen, setIsSetupPayoutsOpen] = useState(false);
  const [payoutMethods, setPayoutMethods] = useState<string[]>([]);
  const [payoutBank, setPayoutBank] = useState("");
  const [payoutIFSC, setPayoutIFSC] = useState("");

  // =========================================================================
  // 4. Privacy & Notifications State
  // =========================================================================
  const [searchEngineVisible, setSearchEngineVisible] = useState(true);
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);

  const handleSaveName = () => {
    const full = `${editFirstName} ${editLastName}`.trim();
    if (full) {
      setLegalName(full);
      updateProfile({ fullName: full });
    }
    setIsEditingName(false);
  };

  const handleSavePreferred = () => {
    setPreferredName(tempPreferred.trim());
    setIsEditingPreferred(false);
  };

  const handleSaveEmail = () => {
    if (tempEmail.trim()) {
      setEmailAddress(tempEmail.trim());
      updateProfile({ email: tempEmail.trim() });
    }
    setIsEditingEmail(false);
  };

  const handleSavePhone = () => {
    if (tempPhone.trim()) {
      setPhoneNumber(tempPhone.trim());
    }
    setIsEditingPhone(false);
  };

  const handleLogOutSession = (id: number) => {
    setDeviceSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const NAV_ITEMS: { id: AccountNavTab; label: string; icon: React.ElementType; isNew?: boolean }[] = [
    { id: "personal", label: "Personal information", icon: User },
    { id: "security", label: "Login & security", icon: Shield },
    { id: "payments", label: "Payments & payouts", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & sharing", icon: Eye },
    { id: "preferences", label: "Languages & currency", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER MATCHING SCREENSHOT 1                                        */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#EBEBEB] px-6 sm:px-12 py-4 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer" title="bnbair Home">
          <span className="font-extrabold text-[24px] sm:text-[26px] tracking-tight text-[#FF385C] transition-transform group-hover:scale-105 select-none">
            bnbair
          </span>
        </Link>

        {/* Right: Done Pill Button matching Screenshot 1 */}
        <Link
          href="/"
          className="px-5 py-2 rounded-full bg-[#F7F7F7] hover:bg-[#EBEBEB] text-sm font-semibold text-[#222222] transition cursor-pointer"
        >
          Done
        </Link>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN SPLIT WORKSPACE MATCHING SCREENSHOTS 1, 2, 3, 4, 5       */}
      {/* ========================================================================= */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row gap-8 lg:gap-16">
        {/* ======================================================================= */}
        {/* LEFT SIDEBAR: ACCOUNT SETTINGS NAVIGATION (Screenshot 1)                 */}
        {/* ======================================================================= */}
        <aside className="w-full md:w-72 lg:w-80 flex-shrink-0">
          <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#222222] mb-6 px-3">
            Account settings
          </h2>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium transition cursor-pointer text-left ${
                    isActive
                      ? "bg-[#F2F2F2] text-[#222222] font-semibold shadow-2xs"
                      : "text-[#222222] hover:bg-[#F9F9F9]"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-5 h-5 ${isActive ? "text-[#222222]" : "text-[#717171]"}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.isNew && (
                    <span className="bg-[#FDF2F4] text-[#E00B41] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ======================================================================= */}
        {/* RIGHT MAIN CONTENT AREA                                                 */}
        {/* ======================================================================= */}
        <main className="flex-1 max-w-2xl w-full">
          {/* --------------------------------------------------------------------- */}
          {/* VIEW 1: PERSONAL INFORMATION (Screenshot 1)                           */}
          {/* --------------------------------------------------------------------- */}
          {activeTab === "personal" && (
            <div className="space-y-8 animate-fadeIn">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222]">
                Personal information
              </h1>

              <div className="divide-y divide-[#EBEBEB] text-sm">
                {/* Row 1: Legal Name */}
                <div className="py-6 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base text-[#222222]">Legal name</h4>
                    {isEditingName ? (
                      <div className="mt-3 space-y-3 max-w-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-[#717171]">First name</label>
                            <input
                              type="text"
                              value={editFirstName}
                              onChange={(e) => setEditFirstName(e.target.value)}
                              className="w-full border border-[#DDDDDD] rounded-xl p-2 text-xs focus:outline-none focus:border-[#222222]"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-[#717171]">Last name</label>
                            <input
                              type="text"
                              value={editLastName}
                              onChange={(e) => setEditLastName(e.target.value)}
                              className="w-full border border-[#DDDDDD] rounded-xl p-2 text-xs focus:outline-none focus:border-[#222222]"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveName}
                            className="px-4 py-1.5 bg-[#222222] text-white text-xs font-bold rounded-lg hover:bg-black cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditingName(false)}
                            className="px-4 py-1.5 border border-[#DDDDDD] text-xs font-bold rounded-lg hover:bg-[#F7F7F7] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[#717171] mt-1">{legalName}</p>
                    )}
                  </div>
                  {!isEditingName && (
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-sm font-semibold underline text-[#222222] hover:opacity-80 cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {/* Row 2: Preferred first name */}
                <div className="py-6 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base text-[#222222]">Preferred first name</h4>
                    {isEditingPreferred ? (
                      <div className="mt-3 space-y-3 max-w-sm">
                        <input
                          type="text"
                          placeholder="e.g. Lucky"
                          value={tempPreferred}
                          onChange={(e) => setTempPreferred(e.target.value)}
                          className="w-full border border-[#DDDDDD] rounded-xl p-2 text-xs focus:outline-none focus:border-[#222222]"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSavePreferred}
                            className="px-4 py-1.5 bg-[#222222] text-white text-xs font-bold rounded-lg hover:bg-black cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditingPreferred(false)}
                            className="px-4 py-1.5 border border-[#DDDDDD] text-xs font-bold rounded-lg hover:bg-[#F7F7F7] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[#717171] mt-1">
                        {preferredName || "Not provided"}
                      </p>
                    )}
                  </div>
                  {!isEditingPreferred && (
                    <button
                      onClick={() => setIsEditingPreferred(true)}
                      className="text-sm font-semibold underline text-[#222222] hover:opacity-80 cursor-pointer"
                    >
                      {preferredName ? "Edit" : "Add"}
                    </button>
                  )}
                </div>

                {/* Row 3: Email address */}
                <div className="py-6 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base text-[#222222]">Email address</h4>
                    {isEditingEmail ? (
                      <div className="mt-3 space-y-3 max-w-sm">
                        <input
                          type="email"
                          value={tempEmail}
                          onChange={(e) => setTempEmail(e.target.value)}
                          className="w-full border border-[#DDDDDD] rounded-xl p-2 text-xs focus:outline-none focus:border-[#222222]"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEmail}
                            className="px-4 py-1.5 bg-[#222222] text-white text-xs font-bold rounded-lg hover:bg-black cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditingEmail(false)}
                            className="px-4 py-1.5 border border-[#DDDDDD] text-xs font-bold rounded-lg hover:bg-[#F7F7F7] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-[#717171] mt-1">{emailAddress}</p>
                        {isEmailConfirmed && (
                          <div className="mt-2.5">
                            <span className="inline-block border border-[#DDDDDD] px-3.5 py-1 rounded-xl text-xs font-semibold text-[#222222] bg-white">
                              Confirm
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {!isEditingEmail && (
                    <button
                      onClick={() => setIsEditingEmail(true)}
                      className="text-sm font-semibold underline text-[#222222] hover:opacity-80 cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {/* Row 4: Phone number */}
                <div className="py-6 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base text-[#222222]">Phone number</h4>
                    {isEditingPhone ? (
                      <div className="mt-3 space-y-3 max-w-sm">
                        <input
                          type="tel"
                          value={tempPhone}
                          onChange={(e) => setTempPhone(e.target.value)}
                          className="w-full border border-[#DDDDDD] rounded-xl p-2 text-xs focus:outline-none focus:border-[#222222]"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSavePhone}
                            className="px-4 py-1.5 bg-[#222222] text-white text-xs font-bold rounded-lg hover:bg-black cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditingPhone(false)}
                            className="px-4 py-1.5 border border-[#DDDDDD] text-xs font-bold rounded-lg hover:bg-[#F7F7F7] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-[#717171] mt-1">{phoneNumber}</p>
                        <p className="text-xs text-[#717171] mt-1 leading-relaxed">
                          Contact number (for confirmed guests and Airbnb to get in touch). You can add other numbers and choose how they’re used.
                        </p>
                      </>
                    )}
                  </div>
                  {!isEditingPhone && (
                    <button
                      onClick={() => setIsEditingPhone(true)}
                      className="text-sm font-semibold underline text-[#222222] hover:opacity-80 cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {/* Row 5: Identity verification */}
                <div className="py-6 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base text-[#222222]">Identity verification</h4>
                    <p className={`text-sm mt-1 font-medium ${
                      idVerificationStatus === "Verified" ? "text-emerald-700" : "text-[#717171]"
                    }`}>
                      {idVerificationStatus}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsVerifyModalOpen(true)}
                    className="text-sm font-semibold underline text-[#222222] hover:opacity-80 cursor-pointer"
                  >
                    {idVerificationStatus === "Verified" ? "View" : "Start"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 2: LOGIN & SECURITY (Screenshot 2)                               */}
          {/* --------------------------------------------------------------------- */}
          {activeTab === "security" && (
            <div className="space-y-10 animate-fadeIn">
              {/* Section 1: Login */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222222] mb-6">
                  Login
                </h2>

                <div className="divide-y divide-[#EBEBEB]">
                  {/* Passkeys */}
                  <div className="py-5 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-base text-[#222222]">Passkeys</h4>
                      <p className="text-xs text-[#717171] mt-1">
                        Use your fingerprint, face or PIN.
                      </p>
                      {passkeys.length > 0 && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{passkeys.length} passkey configured (Windows Hello)</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setIsPasskeyModalOpen(true)}
                      className="text-sm font-semibold underline text-[#222222] hover:opacity-80 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  {/* Password */}
                  <div className="py-5 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-base text-[#222222]">Password</h4>
                      <p className="text-xs text-[#717171] mt-1">
                        Last updated a year ago
                      </p>
                    </div>
                    <button
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="text-sm font-semibold underline text-[#222222] hover:opacity-80 cursor-pointer"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 2: Device history matching Screenshot 2 */}
              <div className="pt-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222222] mb-6">
                  Device history
                </h2>

                <div className="divide-y divide-[#EBEBEB]">
                  {deviceSessions.map((session) => (
                    <div key={session.id} className="py-5 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 border border-[#DDDDDD] rounded-xl text-[#222222]">
                          {session.icon === "desktop" && <Monitor className="w-6 h-6" />}
                          {session.icon === "mobile" && <Smartphone className="w-6 h-6" />}
                          {session.icon === "tablet" && <Monitor className="w-6 h-6" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm text-[#222222]">{session.title}</h4>
                            {session.isCurrent && (
                              <span className="bg-[#EBEBEB] text-[#222222] text-[10px] font-extrabold px-2 py-0.5 rounded-sm">
                                CURRENT SESSION
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#717171] mt-1">
                            {session.location} · {session.date}
                          </p>
                        </div>
                      </div>

                      {!session.isCurrent && (
                        <button
                          onClick={() => handleLogOutSession(session.id)}
                          className="text-sm font-semibold underline text-[#222222] hover:opacity-80 cursor-pointer"
                        >
                          Log out
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 3: PAYMENTS (Screenshots 3 & 4)                                   */}
          {/* --------------------------------------------------------------------- */}
          {activeTab === "payments" && (
            <div className="space-y-8 animate-fadeIn">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222]">
                Payments
              </h1>

              {/* 2 Sub-tabs: Payments | Payouts */}
              <div className="flex items-center gap-8 border-b border-[#EBEBEB]">
                {(["payments", "payouts"] as const).map((tab) => {
                  const isActive = paymentsSubTab === tab;
                  const labelMap = {
                    payments: "Payments",
                    payouts: "Payouts",
                  };

                  return (
                    <button
                      key={tab}
                      onClick={() => setPaymentsSubTab(tab)}
                      className={`pb-3 text-sm font-semibold relative transition cursor-pointer ${
                        isActive ? "text-[#222222]" : "text-[#717171] hover:text-[#222222]"
                      }`}
                    >
                      <span>{labelMap[tab]}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#222222] rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sub-tab 1: Payments (Screenshot 3) */}
              {paymentsSubTab === "payments" && (
                <div className="space-y-8">
                  {/* Your payments */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-[#222222]">Your payments</h3>
                    <p className="text-sm text-[#717171]">
                      Keep track of all your payments and refunds.
                    </p>
                    <button
                      onClick={() => setIsManagePaymentsOpen(true)}
                      className="px-5 py-3 bg-[#222222] hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Manage payments
                    </button>
                  </div>

                  <hr className="border-[#EBEBEB]" />

                  {/* Payment methods */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-[#222222]">Payment methods</h3>
                      <button
                        onClick={() => setIsAddPaymentMethodOpen(true)}
                        className="px-4 py-2 border border-[#DDDDDD] hover:border-[#222222] rounded-full text-xs font-bold text-[#222222] flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add payment method</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {paymentCards.map((card) => (
                        <div
                          key={card.id}
                          className="p-4 border border-[#DDDDDD] rounded-2xl flex items-center justify-between hover:shadow-xs transition"
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-[#717171]" />
                            <div>
                              <p className="font-bold text-sm text-[#222222]">
                                {card.type} •••• {card.last4}
                              </p>
                              <p className="text-xs text-[#717171]">Expires {card.expiry}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold px-2.5 py-1 bg-[#F7F7F7] border border-[#DDDDDD] rounded-full text-[#717171]">
                            Default
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Airbnb gift credit */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xl font-bold text-[#222222]">Airbnb gift credit</h3>
                    <div className="p-5 border border-[#DDDDDD] rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#717171] uppercase font-bold tracking-wider">Current Balance</p>
                        <p className="text-2xl font-extrabold text-[#222222] mt-0.5">
                          {formatPrice(giftCardBalance)}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsAddGiftCardOpen(true)}
                        className="px-4 py-2 bg-[#222222] hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Add gift card
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Payouts */}
              {paymentsSubTab === "payouts" && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-[#222222]">How you’ll get paid</h3>
                    <p className="text-sm text-[#717171]">
                      Add at least one payout method so we can release your earnings from bookings.
                    </p>
                    <button
                      onClick={() => setIsSetupPayoutsOpen(true)}
                      className="px-5 py-3 bg-[#222222] hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Set up payouts
                    </button>
                  </div>

                  {payoutMethods.length > 0 && (
                    <div className="space-y-2">
                      {payoutMethods.map((method, idx) => (
                        <div key={idx} className="p-4 border border-[#DDDDDD] rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-sm text-[#222222]">{method}</p>
                            <p className="text-xs text-[#717171]">Active Payout Account</p>
                          </div>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Need help box with accordion */}
                  <div className="bg-white border border-[#EBEBEB] rounded-3xl p-6 shadow-xs space-y-4">
                    <h4 className="font-bold text-base text-[#222222]">Need help?</h4>
                    <div className="divide-y divide-[#F0F0F0] text-sm">
                      <div>
                        <div
                          onClick={() => setExpandedPayoutHelp(expandedPayoutHelp === "when" ? null : "when")}
                          className="py-3 flex items-center justify-between hover:opacity-80 cursor-pointer font-medium text-[#222222]"
                        >
                          <span className="underline">When you’ll get your payout</span>
                          <ChevronRight className={`w-4 h-4 text-[#717171] transition-transform ${expandedPayoutHelp === "when" ? "rotate-90" : ""}`} />
                        </div>
                        {expandedPayoutHelp === "when" && (
                          <div className="pb-3 text-xs text-[#717171] leading-relaxed animate-in fade-in duration-150">
                            Payouts are typically released approximately 24 hours after your guest&apos;s scheduled check-in time. Depending on your bank&apos;s processing schedule, funds are deposited within 1 to 2 business days.
                          </div>
                        )}
                      </div>

                      <div>
                        <div
                          onClick={() => setExpandedPayoutHelp(expandedPayoutHelp === "how" ? null : "how")}
                          className="py-3 flex items-center justify-between hover:opacity-80 cursor-pointer font-medium text-[#222222]"
                        >
                          <span className="underline">How payouts work</span>
                          <ChevronRight className={`w-4 h-4 text-[#717171] transition-transform ${expandedPayoutHelp === "how" ? "rotate-90" : ""}`} />
                        </div>
                        {expandedPayoutHelp === "how" && (
                          <div className="pb-3 text-xs text-[#717171] leading-relaxed animate-in fade-in duration-150">
                            Payouts work via direct bank transfer (NEFT/RTGS) or UPI. You can set up and manage your default payout method under the Payouts tab.
                          </div>
                        )}
                      </div>

                      <div
                        onClick={() => setIsManagePaymentsOpen(true)}
                        className="py-3 flex items-center justify-between hover:opacity-80 cursor-pointer font-medium text-[#222222]"
                      >
                        <span className="underline">Go to your transaction history</span>
                        <ChevronRight className="w-4 h-4 text-[#717171]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 5: PRIVACY */}

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 5: PRIVACY                                                       */}
          {/* --------------------------------------------------------------------- */}
          {activeTab === "privacy" && (
            <div className="space-y-8 animate-fadeIn">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222]">
                Privacy & sharing
              </h1>

              <div className="divide-y divide-[#EBEBEB] space-y-6">
                <div className="pt-2 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-base text-[#222222]">Search engine visibility</h4>
                    <p className="text-xs text-[#717171] mt-1">
                      Allow search engines like Google to include your public profile and reviews in results.
                    </p>
                  </div>
                  <button
                    onClick={() => setSearchEngineVisible(!searchEngineVisible)}
                    className={`w-12 h-7 rounded-full transition-colors cursor-pointer relative ${
                      searchEngineVisible ? "bg-[#222222]" : "bg-[#DDDDDD]"
                    }`}
                  >
                    <span className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                      searchEngineVisible ? "right-1" : "left-1"
                    }`} />
                  </button>
                </div>

                <div className="pt-6 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-base text-[#222222]">Read receipts</h4>
                    <p className="text-xs text-[#717171] mt-1">
                      Show other guests and hosts when you have viewed their messages.
                    </p>
                  </div>
                  <button
                    onClick={() => setReadReceiptsEnabled(!readReceiptsEnabled)}
                    className={`w-12 h-7 rounded-full transition-colors cursor-pointer relative ${
                      readReceiptsEnabled ? "bg-[#222222]" : "bg-[#DDDDDD]"
                    }`}
                  >
                    <span className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                      readReceiptsEnabled ? "right-1" : "left-1"
                    }`} />
                  </button>
                </div>

                <div className="pt-6 space-y-3">
                  <h4 className="font-semibold text-base text-[#222222]">Account data</h4>
                  <p className="text-xs text-[#717171]">
                    You can request a complete archive of your personal information, booking history, and data held by Airbnb.
                  </p>
                  {dataArchiveRequested ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Personal data archive requested. A download link will be emailed to your account within 24 hours.</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDataArchiveRequested(true)}
                      className="px-4 py-2 border border-[#DDDDDD] rounded-xl text-xs font-bold text-[#222222] hover:bg-[#F7F7F7] cursor-pointer"
                    >
                      Request personal data
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 6: NOTIFICATIONS                                                 */}
          {/* --------------------------------------------------------------------- */}
          {activeTab === "notifications" && (
            <div className="space-y-8 animate-fadeIn">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222]">
                Notification preferences
              </h1>

              <div className="divide-y divide-[#EBEBEB] space-y-6">
                <div className="pt-2 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-base text-[#222222]">Email notifications</h4>
                    <p className="text-xs text-[#717171] mt-1">
                      Booking confirmations, payment receipts, and security updates sent to {emailAddress}.
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifyEmail(!notifyEmail)}
                    className={`w-12 h-7 rounded-full transition-colors cursor-pointer relative ${
                      notifyEmail ? "bg-[#222222]" : "bg-[#DDDDDD]"
                    }`}
                  >
                    <span className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                      notifyEmail ? "right-1" : "left-1"
                    }`} />
                  </button>
                </div>

                <div className="pt-6 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-base text-[#222222]">SMS text messages</h4>
                    <p className="text-xs text-[#717171] mt-1">
                      Urgent reservation changes and access codes sent to {phoneNumber}.
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifySMS(!notifySMS)}
                    className={`w-12 h-7 rounded-full transition-colors cursor-pointer relative ${
                      notifySMS ? "bg-[#222222]" : "bg-[#DDDDDD]"
                    }`}
                  >
                    <span className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                      notifySMS ? "right-1" : "left-1"
                    }`} />
                  </button>
                </div>

                <div className="pt-6 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-base text-[#222222]">Browser push notifications</h4>
                    <p className="text-xs text-[#717171] mt-1">
                      Real-time guest inquiries, host messages, and stay updates on this device.
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifyPush(!notifyPush)}
                    className={`w-12 h-7 rounded-full transition-colors cursor-pointer relative ${
                      notifyPush ? "bg-[#222222]" : "bg-[#DDDDDD]"
                    }`}
                  >
                    <span className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                      notifyPush ? "right-1" : "left-1"
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* VIEW 7: LANGUAGES & CURRENCY                                          */}
          {/* --------------------------------------------------------------------- */}
          {activeTab === "preferences" && (
            <div className="space-y-8 animate-fadeIn">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222]">
                Languages & currency
              </h1>

              <div className="divide-y divide-[#EBEBEB]">
                {/* Language Card */}
                <div className="py-6 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-base text-[#222222]">Preferred language</h4>
                    <p className="text-sm text-[#717171] mt-1">
                      {currentLanguage.name} ({currentLanguage.region})
                    </p>
                  </div>
                  <button
                    onClick={openLanguageModal}
                    className="text-sm font-semibold underline text-[#222222] hover:opacity-80 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                {/* Currency Card */}
                <div className="py-6 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-base text-[#222222]">Preferred currency</h4>
                    <p className="text-sm text-[#717171] mt-1">
                      {currentCurrency.name} ({currentCurrency.code} – {currentCurrency.symbol})
                    </p>
                  </div>
                  <button
                    onClick={openCurrencyModal}
                    className="text-sm font-semibold underline text-[#222222] hover:opacity-80 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                {/* Automatic Translation */}
                <div className="py-6 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-base text-[#222222]">Automatic translation</h4>
                    <p className="text-xs text-[#717171] mt-1 leading-relaxed">
                      Automatically translate reviews, descriptions, and messages written in foreign languages.
                    </p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full">
                    Enabled
                  </div>
                </div>
              </div>
            </div>
          )}


        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. WORKING MODALS                                                         */}
      {/* ========================================================================= */}

      {/* Identity Verification Modal */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#DDDDDD] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBEBEB]">
              <h3 className="text-lg font-bold text-[#222222]">Identity Verification</h3>
              <button onClick={() => setIsVerifyModalOpen(false)} className="p-1 rounded-full hover:bg-[#F7F7F7] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#717171] leading-relaxed">
              Verify your identity with an official government ID (Passport, Driving License, or Aadhaar).
            </p>

            <div className="p-3.5 bg-[#F7F7F7] rounded-2xl flex items-center gap-3 border border-[#EBEBEB]">
              <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-xs text-[#222222]">Profile: {legalName}</p>
                <p className="text-[11px] text-[#717171]">Automatic instant check active</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="px-4 py-2 border border-[#DDDDDD] text-xs font-bold rounded-xl hover:bg-[#F7F7F7] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIdVerificationStatus("Verified");
                  setIsVerifyModalOpen(false);
                }}
                className="px-5 py-2 bg-[#222222] text-white text-xs font-bold rounded-xl hover:bg-black cursor-pointer"
              >
                Verify Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Passkey Modal */}
      {isPasskeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#DDDDDD] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBEBEB]">
              <h3 className="text-base font-bold text-[#222222]">Add a Passkey</h3>
              <button onClick={() => setIsPasskeyModalOpen(false)} className="p-1 rounded-full hover:bg-[#F7F7F7] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#717171] leading-relaxed">
              Sign in securely with Windows Hello, Touch ID, or Face ID without typing a password.
            </p>

            <button
              onClick={() => {
                setPasskeys(["Windows Hello"]);
                setIsPasskeyModalOpen(false);
              }}
              className="w-full py-2.5 bg-[#222222] text-white text-xs font-bold rounded-xl hover:bg-black cursor-pointer"
            >
              Register Passkey
            </button>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#DDDDDD] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBEBEB]">
              <h3 className="text-base font-bold text-[#222222]">Update Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="p-1 rounded-full hover:bg-[#F7F7F7] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[#717171] font-bold">Current password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-[#DDDDDD] rounded-xl p-2.5 focus:outline-none focus:border-[#222222]"
                />
              </div>
              <div>
                <label className="text-[#717171] font-bold">New password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-[#DDDDDD] rounded-xl p-2.5 focus:outline-none focus:border-[#222222]"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setIsPasswordModalOpen(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="w-full py-2.5 bg-[#222222] text-white text-xs font-bold rounded-xl hover:bg-black cursor-pointer"
            >
              Save Password
            </button>
          </div>
        </div>
      )}

      {/* Manage Payments Modal */}
      {isManagePaymentsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#DDDDDD] space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBEBEB]">
              <h3 className="text-base font-bold text-[#222222]">Payment History</h3>
              <button onClick={() => setIsManagePaymentsOpen(false)} className="p-1 rounded-full hover:bg-[#F7F7F7] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-[#EBEBEB] text-xs">
              <div className="py-3 flex justify-between">
                <div>
                  <p className="font-bold text-[#222222]">Modern Villa in Noida</p>
                  <p className="text-[#717171]">12–14 Sept 2026 · Visa •••• 4242</p>
                </div>
                <span className="font-bold text-emerald-700">{formatPrice(5800)}</span>
              </div>
              <div className="py-3 flex justify-between">
                <div>
                  <p className="font-bold text-[#222222]">Beachfront Studio in Goa</p>
                  <p className="text-[#717171]">4–7 Aug 2026 · Visa •••• 4242</p>
                </div>
                <span className="font-bold text-emerald-700">{formatPrice(12400)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {isAddPaymentMethodOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#DDDDDD] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBEBEB]">
              <h3 className="text-base font-bold text-[#222222]">Add Payment Method</h3>
              <button onClick={() => setIsAddPaymentMethodOpen(false)} className="p-1 rounded-full hover:bg-[#F7F7F7] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[#717171] font-bold">Card number</label>
                <input
                  type="text"
                  placeholder="4111 2222 3333 4444"
                  className="w-full border border-[#DDDDDD] rounded-xl p-2.5 focus:outline-none focus:border-[#222222]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#717171] font-bold">Expiration</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full border border-[#DDDDDD] rounded-xl p-2.5 focus:outline-none focus:border-[#222222]"
                  />
                </div>
                <div>
                  <label className="text-[#717171] font-bold">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="123"
                    className="w-full border border-[#DDDDDD] rounded-xl p-2.5 focus:outline-none focus:border-[#222222]"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setPaymentCards([...paymentCards, { id: Date.now(), type: "Mastercard", last4: "8899", expiry: "09/29" }]);
                setIsAddPaymentMethodOpen(false);
              }}
              className="w-full py-2.5 bg-[#222222] text-white text-xs font-bold rounded-xl hover:bg-black cursor-pointer"
            >
              Save Card
            </button>
          </div>
        </div>
      )}

      {/* Gift Card Modal */}
      {isAddGiftCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#DDDDDD] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBEBEB]">
              <h3 className="text-base font-bold text-[#222222]">Redeem Gift Card</h3>
              <button onClick={() => setIsAddGiftCardOpen(false)} className="p-1 rounded-full hover:bg-[#F7F7F7] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs text-[#717171] font-bold">Claim code (19 digits)</label>
              <input
                type="text"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                value={giftCardCode}
                onChange={(e) => setGiftCardCode(e.target.value)}
                className="w-full border border-[#DDDDDD] rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#222222] mt-1 uppercase"
              />
            </div>

            <button
              onClick={() => {
                setGiftCardBalance((prev) => prev + 5000);
                setIsAddGiftCardOpen(false);
                setGiftCardCode("");
              }}
              className="w-full py-2.5 bg-[#222222] text-white text-xs font-bold rounded-xl hover:bg-black cursor-pointer"
            >
              Apply to Account
            </button>
          </div>
        </div>
      )}

      {/* Setup Payouts Modal */}
      {isSetupPayoutsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#DDDDDD] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBEBEB]">
              <h3 className="text-base font-bold text-[#222222]">Set Up Payout Account</h3>
              <button onClick={() => setIsSetupPayoutsOpen(false)} className="p-1 rounded-full hover:bg-[#F7F7F7] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[#717171] font-bold">Bank Account Number</label>
                <input
                  type="text"
                  placeholder="Account Number"
                  value={payoutBank}
                  onChange={(e) => setPayoutBank(e.target.value)}
                  className="w-full border border-[#DDDDDD] rounded-xl p-2.5 focus:outline-none focus:border-[#222222]"
                />
              </div>
              <div>
                <label className="text-[#717171] font-bold">IFSC Code / Routing</label>
                <input
                  type="text"
                  placeholder="HDFC0001234"
                  value={payoutIFSC}
                  onChange={(e) => setPayoutIFSC(e.target.value)}
                  className="w-full border border-[#DDDDDD] rounded-xl p-2.5 focus:outline-none focus:border-[#222222] uppercase"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setPayoutMethods([...payoutMethods, `HDFC Bank (•••• ${payoutBank.slice(-4) || "8812"})`]);
                setIsSetupPayoutsOpen(false);
              }}
              className="w-full py-2.5 bg-[#222222] text-white text-xs font-bold rounded-xl hover:bg-black cursor-pointer"
            >
              Link Payout Method
            </button>
          </div>
        </div>
      )}


    </div>
  );
}
