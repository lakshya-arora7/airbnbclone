"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Luggage, Home, Sparkles, Check } from "lucide-react";
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

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(initialRole);
      setLoginInput(initialRole === "HOST" ? "ravi.sharma@gmail.com" : "lakshya@gmail.com");
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const inputVal = loginInput.trim() || (selectedRole === "HOST" ? "ravi.sharma@gmail.com" : "lakshya@gmail.com");
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
      }, 1000);
    }
  };

  const handleSelectQuickPersona = async (p: any) => {
    setIsSubmitting(true);
    await selectPersona(p);
    setIsSubmitting(false);
    setSuccessMessage(`Logged in as ${p.fullName} (${p.role})`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-[420px] bg-white rounded-[32px] shadow-[0_16px_48px_rgba(0,0,0,0.2)] border border-gray-100 p-7 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button at top-right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-[#222222] transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {successMessage ? (
          <div className="py-10 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-[#222222]">{successMessage}</h3>
            <p className="text-xs text-[#717171]">
              Switching your role and personal dashboard...
            </p>
          </div>
        ) : (
          <div>
            {/* 1. Brand Logo */}
            <div className="flex justify-center pt-2">
              <span className="font-extrabold text-[28px] tracking-tight text-[#FF385C] select-none">
                bnbair
              </span>
            </div>

            {/* 2. Heading matching Screenshot */}
            <h2 className="text-[26px] font-bold text-[#222222] text-center mt-3 mb-4 tracking-tight">
              Log in or sign up
            </h2>

            {/* 3. Notion of Guest vs Host Segmented Switcher */}
            <div className="flex bg-[#F2F2F2] p-1 rounded-xl mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole("GUEST");
                  setLoginInput("lakshya@gmail.com");
                }}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  selectedRole === "GUEST"
                    ? "bg-white text-[#222222] shadow-xs font-bold"
                    : "text-[#717171] hover:text-[#222222]"
                }`}
              >
                <Luggage className="w-3.5 h-3.5 text-[#FF385C]" />
                <span>Guest</span>
                {selectedRole === "GUEST" && <Check className="w-3 h-3 text-[#FF385C]" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole("HOST");
                  setLoginInput("ravi.sharma@gmail.com");
                }}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  selectedRole === "HOST"
                    ? "bg-white text-[#222222] shadow-xs font-bold"
                    : "text-[#717171] hover:text-[#222222]"
                }`}
              >
                <Home className="w-3.5 h-3.5 text-amber-600" />
                <span>Host</span>
                {selectedRole === "HOST" && <Check className="w-3 h-3 text-amber-600" />}
              </button>
            </div>

            {/* 4. Form with Input & Continue Button matching Screenshot */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <input
                  type="text"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="Phone number or email"
                  className="w-full px-4 py-3.5 text-base border border-[#B0B0B0] rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition placeholder:text-[#717171]"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#E00B41] hover:bg-[#D70466] active:scale-[0.99] text-white font-semibold text-base rounded-xl transition cursor-pointer shadow-xs disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Continue"}
              </button>
            </form>

            {/* 5. Divider with "or" matching Screenshot */}
            <div className="flex items-center my-5">
              <div className="flex-1 h-px bg-[#EBEBEB]" />
              <span className="px-4 text-xs font-normal text-[#717171]">or</span>
              <div className="flex-1 h-px bg-[#EBEBEB]" />
            </div>

            {/* 6. Social Logins matching Screenshot (Google & Apple) */}
            <div className="flex items-center justify-center gap-4">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => {
                  const email = selectedRole === "HOST" ? "ravi.sharma@gmail.com" : "lakshya@gmail.com";
                  setLoginInput(email);
                  login(email, selectedRole);
                  setSuccessMessage(`Signed in with Google as ${selectedRole === "HOST" ? "Host (Ravi)" : "Guest (Lakshya)"}!`);
                  setTimeout(() => {
                    setSuccessMessage(null);
                    onClose();
                  }, 1000);
                }}
                className="w-16 h-14 sm:w-20 sm:h-14 rounded-2xl border border-[#B0B0B0] hover:border-black hover:bg-[#F7F7F7] flex items-center justify-center transition cursor-pointer"
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
                  const email = selectedRole === "HOST" ? "ravi.sharma@gmail.com" : "lakshya@gmail.com";
                  setLoginInput(email);
                  login(email, selectedRole);
                  setSuccessMessage(`Signed in with Apple as ${selectedRole === "HOST" ? "Host (Ravi)" : "Guest (Lakshya)"}!`);
                  setTimeout(() => {
                    setSuccessMessage(null);
                    onClose();
                  }, 1000);
                }}
                className="w-16 h-14 sm:w-20 sm:h-14 rounded-2xl border border-[#B0B0B0] hover:border-black hover:bg-[#F7F7F7] flex items-center justify-center transition cursor-pointer"
                title="Continue with Apple"
              >
                <svg className="w-5 h-5 fill-current text-[#222222]" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.92.04-2.02.62-2.66 1.37-.56.65-1.06 1.71-.93 2.73 1.03.08 2.07-.5 2.67-1.25z" />
                </svg>
              </button>
            </div>

            {/* 7. Quick 1-Click Simplified Persona Switcher */}
            <div className="mt-5 pt-3 border-t border-[#EBEBEB]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#717171] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>1-Click Test Accounts:</span>
                </span>
                <span className="text-[10px] text-[#717171]">Active: {persona.role}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {availablePersonas.slice(0, 2).map((p) => {
                  const isCurrent = persona.id === p.id && persona.role === p.role;
                  return (
                    <button
                      key={`${p.id}-${p.role}`}
                      type="button"
                      onClick={() => handleSelectQuickPersona(p)}
                      className={`p-2 rounded-xl border flex items-center gap-2 text-left transition cursor-pointer ${
                        isCurrent
                          ? "border-[#222222] bg-[#F7F7F7] shadow-2xs"
                          : "border-[#EBEBEB] hover:border-[#717171] hover:bg-[#FAFAFA]"
                      }`}
                    >
                      <img
                        src={p.avatarUrl}
                        alt={p.fullName}
                        className="w-7 h-7 rounded-full object-cover border border-[#DDDDDD] flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-[#222222] truncate">{p.fullName}</p>
                        <p className={`text-[9px] font-extrabold uppercase ${p.role === "HOST" ? "text-amber-700" : "text-[#FF385C]"}`}>
                          {p.role}
                        </p>
                      </div>
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
