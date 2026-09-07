"use client";

import React, { useState } from "react";
import { X, CheckCircle2, User, Home, Sparkles, Luggage, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuthPersona } from "@/context/AuthPersonaContext";
import { UserRole } from "@/types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
}

export default function AuthModal({ isOpen, onClose, initialRole = "GUEST" }: AuthModalProps) {
  const { persona, login, selectPersona, availablePersonas } = useAuthPersona();
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [loginInput, setLoginInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const inputVal = loginInput.trim() || (selectedRole === "HOST" ? "ravi.host@airbnb.demo" : "lakshya.guest@airbnb.demo");
    const isSuccess = await login(inputVal, selectedRole);

    setIsSubmitting(false);
    if (isSuccess) {
      setSuccessMessage(
        selectedRole === "HOST"
          ? "Logged in as Host! Welcome back to hosting."
          : "Logged in as Guest! Welcome back to Airbnb."
      );
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1200);
    }
  };

  const handleSelectQuickPersona = async (p: any) => {
    setIsSubmitting(true);
    await selectPersona(p);
    setIsSubmitting(false);
    setSuccessMessage(`Welcome back, ${p.fullName}! Active role: ${p.role}`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-[540px] bg-white rounded-3xl shadow-[0_12px_48px_rgba(0,0,0,0.22)] border border-[#DDDDDD] p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F7F7F7] text-[#222222] transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {successMessage ? (
          <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#222222]">{successMessage}</h3>
            <p className="text-sm text-[#717171]">
              Switching your session and loading your profile...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Brand Title */}
            <div className="text-center pt-1">
              <span className="font-extrabold text-3xl tracking-tight text-[#FF385C]">airbnbclone</span>
              <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#222222] mt-3">
                Log in or sign up
              </h2>
              <p className="text-xs text-[#717171] mt-1">
                Choose your role to experience guest bookings or host management.
              </p>
            </div>

            {/* Notion of "Guest vs Host" Interactive Segmented Role Cards */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#222222] uppercase tracking-wider block">
                Select Account Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole("GUEST")}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    selectedRole === "GUEST"
                      ? "border-[#222222] bg-[#F7F7F7] ring-2 ring-[#222222]/10 shadow-xs"
                      : "border-[#DDDDDD] hover:border-[#717171]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-[#FF385C] flex items-center justify-center">
                      <Luggage className="w-4 h-4" />
                    </div>
                    {selectedRole === "GUEST" && (
                      <span className="w-2 h-2 rounded-full bg-[#FF385C]" />
                    )}
                  </div>
                  <div className="mt-2.5">
                    <h4 className="font-extrabold text-sm text-[#222222]">Guest (Travelling)</h4>
                    <p className="text-[11px] text-[#717171] leading-tight mt-0.5">
                      Explore stays, book trips, wishlists & reviews
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("HOST")}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    selectedRole === "HOST"
                      ? "border-[#222222] bg-[#F7F7F7] ring-2 ring-[#222222]/10 shadow-xs"
                      : "border-[#DDDDDD] hover:border-[#717171]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
                      <Home className="w-4 h-4" />
                    </div>
                    {selectedRole === "HOST" && (
                      <span className="w-2 h-2 rounded-full bg-amber-600" />
                    )}
                  </div>
                  <div className="mt-2.5">
                    <h4 className="font-extrabold text-sm text-[#222222]">Host (Hosting)</h4>
                    <p className="text-[11px] text-[#717171] leading-tight mt-0.5">
                      Publish listings, calendar, payouts & inbox
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Form matching Screenshot */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="Phone number or email"
                  className="w-full px-4 py-3.5 text-base border border-[#B0B0B0] rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition placeholder:text-[#717171]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#FF385C] hover:bg-[#E00B41] active:scale-[0.99] text-white font-bold text-base rounded-xl transition shadow-md cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Continue"}
              </button>
            </form>

            {/* Divider with "or" */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-[#DDDDDD]" />
              <span className="px-4 text-xs font-semibold text-[#717171] uppercase tracking-wider">
                or
              </span>
              <div className="flex-1 h-px bg-[#DDDDDD]" />
            </div>

            {/* Social Logins matching Screenshot */}
            <div className="flex items-center justify-center gap-4">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => {
                  setLoginInput(selectedRole === "HOST" ? "ravi.google@gmail.com" : "lakshya.google@gmail.com");
                }}
                className="w-16 h-14 rounded-2xl border border-[#DDDDDD] hover:border-[#222222] hover:bg-[#F7F7F7] flex items-center justify-center transition cursor-pointer"
                title="Continue with Google"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </button>

              {/* Apple Button */}
              <button
                type="button"
                onClick={() => {
                  setLoginInput(selectedRole === "HOST" ? "ravi.apple@icloud.com" : "lakshya.apple@icloud.com");
                }}
                className="w-16 h-14 rounded-2xl border border-[#DDDDDD] hover:border-[#222222] hover:bg-[#F7F7F7] flex items-center justify-center transition cursor-pointer"
                title="Continue with Apple"
              >
                <svg className="w-5 h-5 fill-current text-[#222222]" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.92.04-2.02.62-2.66 1.37-.56.65-1.06 1.71-.93 2.73 1.03.08 2.07-.5 2.67-1.25z" />
                </svg>
              </button>
            </div>

            {/* Quick 1-Click Persona Accounts (Guest vs Host) */}
            <div className="pt-2 border-t border-[#EBEBEB]">
              <p className="text-xs font-semibold text-[#717171] mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant 1-Click Demo Accounts:</span>
              </p>
              <div className="space-y-2">
                {availablePersonas.map((p) => {
                  const isCurrent = persona.id === p.id && persona.role === p.role;
                  return (
                    <button
                      key={`${p.id}-${p.role}`}
                      type="button"
                      onClick={() => handleSelectQuickPersona(p)}
                      className={`w-full p-2.5 rounded-2xl border flex items-center justify-between transition cursor-pointer text-left ${
                        isCurrent
                          ? "border-[#222222] bg-[#F7F7F7]"
                          : "border-[#EBEBEB] hover:border-[#DDDDDD] hover:bg-[#FAFAFA]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatarUrl}
                          alt={p.fullName}
                          className="w-9 h-9 rounded-full object-cover border border-[#DDDDDD]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#222222]">{p.fullName}</span>
                            <span
                              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                                p.role === "HOST"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-[#FFF0F3] text-[#FF385C]"
                              }`}
                            >
                              <span>{p.role}</span>
                              {p.isSuperhost && (
                                <span className="flex items-center gap-0.5">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                                  Superhost
                                </span>
                              )}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#717171]">{p.email}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#717171]" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
