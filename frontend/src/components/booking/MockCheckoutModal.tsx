"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  QrCode,
  CreditCard,
  Building2,
  Wallet,
  Copy,
  Check,
  ChevronLeft,
  Lock,
  Download,
  ExternalLink,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Listing } from "@/types";
import { useAuthPersona } from "@/context/AuthPersonaContext";
import { useLanguageCurrency } from "@/context/LanguageCurrencyContext";
import { api } from "@/lib/api";

interface MockCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalNights: number;
  nightlyTotal: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
  onBookingSuccess?: (bookingId: number) => void;
}

type CheckoutStep = "review" | "payment" | "processing" | "confirmed";
type PaymentTab = "upi_qr" | "card" | "netbanking" | "wallet";

export default function MockCheckoutModal({
  isOpen,
  onClose,
  listing,
  checkIn,
  checkOut,
  guestsCount,
  totalNights,
  nightlyTotal,
  cleaningFee,
  serviceFee,
  totalPrice,
  onBookingSuccess,
}: MockCheckoutModalProps) {
  const { persona } = useAuthPersona();
  const { formatPrice, currentCurrency, t } = useLanguageCurrency();

  // Flow Step: review -> payment -> processing -> confirmed
  const [step, setStep] = useState<CheckoutStep>("review");
  const [paymentTab, setPaymentTab] = useState<PaymentTab>("upi_qr");

  // Hold Timer (15 mins) & QR Timer (10 mins)
  const [holdSeconds, setHoldSeconds] = useState(15 * 60);
  const [qrSeconds, setQrSeconds] = useState(10 * 60);

  // Form Inputs
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8812");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("884");
  const [cardName, setCardName] = useState(persona.fullName || "Lakshya Arora");
  const [saveCard, setSaveCard] = useState(true);

  const [customUpi, setCustomUpi] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [selectedWallet, setSelectedWallet] = useState("Paytm");

  // Output
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [confirmedPaymentMethod, setConfirmedPaymentMethod] = useState<string>("Card / Instant Checkout");

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setStep("review");
      setConfirmationCode(null);
      setConflictError(null);
      setHoldSeconds(15 * 60);
      setQrSeconds(10 * 60);
    }
  }, [isOpen]);

  // Timers
  useEffect(() => {
    if (!isOpen || step === "confirmed") return;
    const timer = setInterval(() => {
      setHoldSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setQrSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, step]);

  if (!isOpen) return null;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText("airbnb.pay@icici");
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleExecutePayment = async () => {
    setStep("processing");

    const paymentMethodName =
      paymentTab === "upi_qr"
        ? "UPI / QR Code"
        : paymentTab === "card"
        ? `Card (•••• ${cardNumber.slice(-4)})`
        : paymentTab === "netbanking"
        ? `Net Banking (${selectedBank})`
        : `Wallet (${selectedWallet})`;

    try {
      const res = await api.createBooking(
        {
          listingId: listing.id,
          checkIn,
          checkOut,
          guestsCount,
          paymentMethod: paymentMethodName,
        },
        persona.id || 1
      );

      if (!res.success && res.error) {
        setConflictError(res.error);
        setStep("review");
        return;
      }

      const generatedCode =
        res.data?.confirmation_code ||
        res.data?.confirmationCode ||
        `HM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      setConfirmationCode(generatedCode);
      setConfirmedPaymentMethod(paymentMethodName);
      setStep("confirmed");

      // Save complete booking to localStorage so it syncs with /trips and World Map
      const newBooking = {
        id: res.data?.id || Date.now(),
        confirmationCode: generatedCode,
        listingId: listing.id,
        listingTitle: listing.title,
        listingImage: listing.images[0]?.url,
        city: listing.city,
        country: listing.country,
        lat: listing.latitude,
        lng: listing.longitude,
        checkIn,
        checkOut,
        guestsCount,
        nightlyRate: listing.pricePerNight,
        totalNights,
        cleaningFee,
        serviceFee,
        totalPrice,
        paymentMethod: paymentMethodName,
        status: "CONFIRMED" as const,
        createdAt: new Date().toISOString(),
      };

      try {
        const existing = JSON.parse(localStorage.getItem("airbnb_demo_bookings") || "[]");
        localStorage.setItem("airbnb_demo_bookings", JSON.stringify([newBooking, ...existing]));
      } catch (e) {
        console.error(e);
      }

      if (onBookingSuccess) {
        onBookingSuccess(newBooking.id);
      }
    } catch (err) {
      console.error("Booking error:", err);
      // Resilient fallback
      const generatedCode = `HM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setConfirmationCode(generatedCode);
      setStep("confirmed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#DDDDDD] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#EBEBEB] flex items-center justify-between flex-shrink-0">
          {step === "payment" ? (
            <button
              onClick={() => setStep("review")}
              className="p-1.5 -ml-2 rounded-full hover:bg-[#F7F7F7] text-[#222222] transition cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="p-2 -ml-2 rounded-full hover:bg-[#F7F7F7] text-[#222222] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <h3 className="text-base font-bold text-[#222222]">
            {step === "review" && "Confirm & Pay"}
            {step === "payment" && "Select Payment Method"}
            {step === "processing" && "Processing Payment..."}
            {step === "confirmed" && "Reservation Confirmed!"}
          </h3>

          <div className="w-8" />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* ================================================================= */}
          {/* STAGE 1: REVIEW & DATE-HOLD                                       */}
          {/* ================================================================= */}
          {step === "review" && (
            <div className="space-y-5">
              {/* 15-Minute Hold Live Countdown Alert */}
              <div className="bg-[#FFF8F6] border border-[#FF385C]/20 rounded-2xl p-3.5 flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#FF385C] flex-shrink-0 animate-pulse" />
                <div className="text-xs">
                  <span className="font-bold text-[#222222]">Temporary Date-Hold Active: </span>
                  <span className="text-[#717171]">
                    These dates are locked for you for{" "}
                    <strong className="text-[#FF385C] font-mono">{formatTimer(holdSeconds)}</strong>.
                  </span>
                </div>
              </div>

              {/* Property Summary */}
              {conflictError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Dates Unavailable</p>
                    <p>{conflictError}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pb-4 border-b border-[#EBEBEB]">
                <img
                  src={listing.images[0]?.url}
                  alt={listing.title}
                  className="w-24 h-20 rounded-2xl object-cover border border-[#DDDDDD]"
                />
                <div className="flex-1 text-xs space-y-1">
                  <p className="font-bold text-sm text-[#222222] line-clamp-1">{listing.title}</p>
                  <p className="text-[#717171]">{listing.city}, {listing.country}</p>
                  <p className="text-[#222222] font-semibold pt-1">
                    {checkIn} to {checkOut} · {guestsCount} {guestsCount === 1 ? "guest" : "guests"}
                  </p>
                </div>
              </div>

              {/* Price Details */}
              <div className="py-2 space-y-2 text-sm border-b border-[#EBEBEB]">
                <div className="flex justify-between text-[#717171]">
                  <span>{formatPrice(listing.pricePerNight)} × {totalNights} {t("listing.night", "nights")}</span>
                  <span className="text-[#222222] font-medium">{formatPrice(nightlyTotal)}</span>
                </div>
                <div className="flex justify-between text-[#717171]">
                  <span>Cleaning fee</span>
                  <span className="text-[#222222] font-medium">{formatPrice(cleaningFee)}</span>
                </div>
                <div className="flex justify-between text-[#717171]">
                  <span>Airbnb service fee (14%)</span>
                  <span className="text-[#222222] font-medium">{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-[#222222] pt-2 border-t border-[#EBEBEB]">
                  <span>{t("listing.total", "Total")} ({currentCurrency.code})</span>
                  <span className="text-[#FF385C]">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Guest Profile & Guarantee */}
              <div className="flex items-center justify-between text-xs text-[#717171]">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  AirCover Protection Included
                </span>
                <span>Booking as <strong>{persona.fullName}</strong></span>
              </div>

              {/* Primary Action Button: Move to Payment Stage */}
              <button
                onClick={() => setStep("payment")}
                className="mt-4 w-full bg-[#FF385C] hover:bg-[#E00B41] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <span>Confirm and Pay {formatPrice(totalPrice)}</span>
              </button>
            </div>
          )}

          {/* ================================================================= */}
          {/* STAGE 2: PAYMENT METHODS (UPI QR, CARDS, NETBANKING, WALLETS)     */}
          {/* ================================================================= */}
          {step === "payment" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Total Banner */}
              <div className="bg-[#F7F7F7] border border-[#EBEBEB] rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#717171]">Total Amount Due</p>
                  <p className="text-xl font-black text-[#222222]">{formatPrice(totalPrice)}</p>
                </div>
                <div className="text-right text-xs text-[#717171]">
                  <p className="font-semibold text-[#222222]">{totalNights} nights</p>
                  <p>{checkIn} – {checkOut}</p>
                </div>
              </div>

              {/* 4 Payment Category Tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#F0F0F0] rounded-2xl text-xs font-bold">
                <button
                  onClick={() => setPaymentTab("upi_qr")}
                  className={`py-2 rounded-xl transition flex flex-col items-center gap-1 cursor-pointer ${
                    paymentTab === "upi_qr"
                      ? "bg-white text-[#222222] shadow-xs"
                      : "text-[#717171] hover:text-[#222222]"
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span className="text-[11px]">UPI / QR</span>
                </button>

                <button
                  onClick={() => setPaymentTab("card")}
                  className={`py-2 rounded-xl transition flex flex-col items-center gap-1 cursor-pointer ${
                    paymentTab === "card"
                      ? "bg-white text-[#222222] shadow-xs"
                      : "text-[#717171] hover:text-[#222222]"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[11px]">Cards</span>
                </button>

                <button
                  onClick={() => setPaymentTab("netbanking")}
                  className={`py-2 rounded-xl transition flex flex-col items-center gap-1 cursor-pointer ${
                    paymentTab === "netbanking"
                      ? "bg-white text-[#222222] shadow-xs"
                      : "text-[#717171] hover:text-[#222222]"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-[11px]">NetBanking</span>
                </button>

                <button
                  onClick={() => setPaymentTab("wallet")}
                  className={`py-2 rounded-xl transition flex flex-col items-center gap-1 cursor-pointer ${
                    paymentTab === "wallet"
                      ? "bg-white text-[#222222] shadow-xs"
                      : "text-[#717171] hover:text-[#222222]"
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span className="text-[11px]">Wallets</span>
                </button>
              </div>

              {/* Tab 1: UPI & Dummy QR Code */}
              {paymentTab === "upi_qr" && (
                <div className="space-y-4 pt-1">
                  <div className="bg-white border-2 border-[#222222] rounded-3xl p-5 flex flex-col items-center text-center shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-[#222222]">Scan QR Code with any UPI App</span>
                    </div>

                    {/* Crisp Dummy QR Code SVG with Airbnb Emblem in center */}
                    <div className="relative w-48 h-48 bg-white border border-[#EBEBEB] rounded-2xl p-2 flex items-center justify-center shadow-inner">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-[#222222]" fill="currentColor">
                        {/* QR Code Matrix Elements */}
                        <path d="M5 5h30v30H5zM10 10h20v20H10zM15 15h10v10H15z" />
                        <path d="M65 5h30v30H65zM70 10h20v20H70zM75 15h10v10H75z" />
                        <path d="M5 65h30v30H5zM10 70h20v20H10zM15 75h10v10H15z" />
                        <path d="M45 10h10v5H45zM40 20h5v10H40zM50 25h10v5H50zM45 35h5v5H45z" />
                        <path d="M65 45h10v5H65zM80 40h15v5H80zM85 50h10v10H85zM65 60h5v15H65z" />
                        <path d="M40 65h10v5H40zM55 70h5v10H55zM45 80h10v15H45zM60 85h5v5H60z" />
                        <path d="M70 70h10v5H70zM85 75h10v15H85zM75 85h5v10H75zM80 65h5v5H80z" />
                        {/* Decorative central logo backdrop */}
                        <circle cx="50" cy="50" r="12" fill="white" />
                        <circle cx="50" cy="50" r="10" fill="#FF385C" />
                        <path
                          d="M50 43c-2 0-3.5 1-4.7 3.2l-.5 1-1.8 3.5c-.7 1.5-1 2.4-1 3.3 0 2.5 1.8 4.2 4 4.2 1.5 0 2.9-.8 4-2.2 1.1 1.4 2.5 2.2 4 2.2 2.2 0 4-1.7 4-4.2 0-.9-.3-1.8-1-3.3l-1.8-3.5-.5-1C53.5 44 52 43 50 43zm0 8.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5z"
                          fill="white"
                        />
                      </svg>
                    </div>

                    <div className="mt-3 flex items-center gap-1 text-xs font-mono text-[#FF385C]">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>QR expires in {formatTimer(qrSeconds)}</span>
                    </div>

                    {/* Supported UPI logos */}
                    <div className="mt-3 flex items-center justify-center gap-3 text-[11px] font-bold text-[#717171]">
                      <span className="px-2 py-0.5 bg-[#F7F7F7] border border-[#DDDDDD] rounded-md text-emerald-700">GPay</span>
                      <span className="px-2 py-0.5 bg-[#F7F7F7] border border-[#DDDDDD] rounded-md text-indigo-700">PhonePe</span>
                      <span className="px-2 py-0.5 bg-[#F7F7F7] border border-[#DDDDDD] rounded-md text-sky-700">Paytm</span>
                      <span className="px-2 py-0.5 bg-[#F7F7F7] border border-[#DDDDDD] rounded-md text-orange-700">BHIM</span>
                    </div>
                  </div>

                  {/* Copyable UPI ID */}
                  <div className="flex items-center justify-between p-3 bg-[#F7F7F7] rounded-2xl border border-[#DDDDDD] text-xs">
                    <div>
                      <p className="text-[11px] text-[#717171]">Official Merchant UPI ID</p>
                      <p className="font-mono font-bold text-[#222222]">airbnb.pay@icici</p>
                    </div>
                    <button
                      onClick={handleCopyUpi}
                      className="px-3 py-1.5 bg-white border border-[#DDDDDD] rounded-xl font-bold flex items-center gap-1.5 hover:bg-[#F0F0F0] cursor-pointer transition"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#717171]" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Or Enter Custom UPI */}
                  <div className="space-y-1.5 text-xs">
                    <label className="text-[#717171] font-bold">Or enter your Virtual Payment Address (VPA)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="yourname@okhdfcbank"
                        value={customUpi}
                        onChange={(e) => setCustomUpi(e.target.value)}
                        className="flex-1 border border-[#DDDDDD] rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#222222]"
                      />
                      <button
                        onClick={handleExecutePayment}
                        className="px-4 py-2 bg-[#222222] text-white font-bold rounded-xl hover:bg-black cursor-pointer text-xs"
                      >
                        Verify & Pay
                      </button>
                    </div>
                  </div>

                  {/* Complete Payment Button */}
                  <button
                    onClick={handleExecutePayment}
                    className="w-full bg-[#222222] hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <span>I have scanned & paid {formatPrice(totalPrice)}</span>
                  </button>
                </div>
              )}

              {/* Tab 2: Credit / Debit Cards */}
              {paymentTab === "card" && (
                <div className="space-y-4 pt-1 text-xs">
                  <div>
                    <label className="block text-[#717171] font-bold mb-1">Card number</label>
                    <div className="flex items-center border border-[#DDDDDD] rounded-xl px-3 py-2.5 focus-within:border-[#222222]">
                      <CreditCard className="w-4 h-4 text-[#717171] mr-2" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="w-full text-xs font-semibold focus:outline-none"
                      />
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">VISA</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#717171] font-bold mb-1">Expiration date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full border border-[#DDDDDD] rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-[#222222]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#717171] font-bold mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full border border-[#DDDDDD] rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-[#222222]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#717171] font-bold mb-1">Name on card</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Cardholder Name"
                      className="w-full border border-[#DDDDDD] rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-[#222222]"
                    />
                  </div>

                  <label className="flex items-center gap-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="rounded text-[#222222] focus:ring-0"
                    />
                    <span className="text-xs text-[#717171]">Save this card securely for faster checkout</span>
                  </label>

                  <button
                    onClick={handleExecutePayment}
                    className="w-full bg-[#222222] hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Pay {formatPrice(totalPrice)} with Card</span>
                  </button>
                </div>
              )}

              {/* Tab 3: Net Banking */}
              {paymentTab === "netbanking" && (
                <div className="space-y-4 pt-1 text-xs">
                  <p className="text-[#717171] font-bold">Select Popular Indian Banks</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Bank", "Punjab National Bank"].map((bank) => (
                      <button
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-2xl border text-left font-bold transition cursor-pointer ${
                          selectedBank === bank
                            ? "border-[#222222] bg-[#F7F7F7]"
                            : "border-[#DDDDDD] hover:border-[#717171]"
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleExecutePayment}
                    className="w-full bg-[#222222] hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <span>Pay {formatPrice(totalPrice)} via {selectedBank}</span>
                  </button>
                </div>
              )}

              {/* Tab 4: Wallets & Pay Later */}
              {paymentTab === "wallet" && (
                <div className="space-y-4 pt-1 text-xs">
                  <p className="text-[#717171] font-bold">Choose Wallet or Pay Later</p>
                  <div className="space-y-2">
                    {[
                      { name: "Paytm Wallet", desc: "Instant checkout with linked Paytm balance" },
                      { name: "Amazon Pay", desc: "Use Amazon Pay balance or gift card" },
                      { name: "PhonePe Wallet", desc: "Seamless single-tap mobile payment" },
                      { name: "Simpl Pay Later", desc: "Pay in 15 days, 0% interest" },
                    ].map((w) => (
                      <div
                        key={w.name}
                        onClick={() => setSelectedWallet(w.name)}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                          selectedWallet === w.name
                            ? "border-[#222222] bg-[#F7F7F7]"
                            : "border-[#DDDDDD] hover:border-[#717171]"
                        }`}
                      >
                        <div>
                          <p className="font-bold text-sm text-[#222222]">{w.name}</p>
                          <p className="text-[11px] text-[#717171]">{w.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedWallet === w.name ? "border-[#222222] bg-[#222222]" : "border-[#DDDDDD]"
                        }`}>
                          {selectedWallet === w.name && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleExecutePayment}
                    className="w-full bg-[#222222] hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <span>Pay {formatPrice(totalPrice)} with {selectedWallet}</span>
                  </button>
                </div>
              )}

              {/* Security Badge */}
              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#717171]">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>256-bit Encrypted SSL Payment · Airbnb Coverage Guarantee</span>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STAGE 3: PROCESSING SPINNER                                       */}
          {/* ================================================================= */}
          {step === "processing" && (
            <div className="py-16 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-[#FF385C] animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-base text-[#222222]">Contacting Banking Gateway...</h4>
                <p className="text-xs text-[#717171]">
                  Authorizing {formatPrice(totalPrice)}. Please do not refresh the page.
                </p>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STAGE 4: RESERVATION CONFIRMED CELEBRATION                        */}
          {/* ================================================================= */}
          {step === "confirmed" && (
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-black text-[#222222]">Pack your bags!</h4>
                <p className="text-xs text-[#717171]">
                  Your reservation at <strong>{listing.title}</strong> is officially confirmed!
                </p>
              </div>

              {/* Confirmation Code Card */}
              <div className="bg-[#F7F7F7] border border-[#DDDDDD] rounded-3xl p-5 max-w-sm mx-auto text-xs space-y-3 shadow-2xs">
                <div>
                  <p className="text-[#717171] text-[11px] font-semibold">Confirmation Code</p>
                  <p className="font-mono text-xl font-extrabold tracking-widest text-[#222222] mt-0.5">
                    {confirmationCode}
                  </p>
                </div>

                <div className="border-t border-[#EBEBEB] pt-3 grid grid-cols-2 gap-2 text-left">
                  <div>
                    <span className="text-[#717171] text-[11px] block">Check-in</span>
                    <span className="font-bold text-xs text-[#222222]">{checkIn}</span>
                  </div>
                  <div>
                    <span className="text-[#717171] text-[11px] block">Checkout</span>
                    <span className="font-bold text-xs text-[#222222]">{checkOut}</span>
                  </div>
                </div>

                <div className="border-t border-[#EBEBEB] pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-[#717171]">Total Paid ({currentCurrency.code})</span>
                  <span className="font-bold text-emerald-700">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-2">
                <Link
                  href="/trips"
                  onClick={onClose}
                  className="bg-[#222222] hover:bg-black text-white py-3.5 px-6 rounded-xl font-bold text-sm inline-block shadow-md transition cursor-pointer"
                >
                  View in My Trips
                </Link>

                <button
                  onClick={() => {
                    const receiptContent = `AIRBNB OFFICIAL BOOKING RECEIPT\n==============================================\nConfirmation Code: ${confirmationCode}\nProperty: ${listing.title}\nLocation: ${listing.city}, ${listing.country}\nCheck-in: ${checkIn} (From 3:00 PM)\nCheck-out: ${checkOut} (Until 11:00 AM)\nGuests: ${guestsCount}\nBooked By: ${persona.fullName} (${persona.email})\nTotal Amount Paid: ${formatPrice(totalPrice)}\nPayment Method: ${confirmedPaymentMethod}\nStatus: CONFIRMED\nThank you for booking with Airbnb!\n==============================================`;
                    const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `Airbnb-Receipt-${confirmationCode}.txt`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 border border-[#DDDDDD] rounded-xl text-xs font-semibold text-[#222222] hover:bg-[#F7F7F7] flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Booking Receipt</span>
                </button>

                <button
                  onClick={onClose}
                  className="text-xs font-semibold text-[#717171] hover:underline cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
