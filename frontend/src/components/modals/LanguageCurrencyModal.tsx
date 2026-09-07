"use client";

import React from "react";
import { X, Check, Languages } from "lucide-react";
import {
  useLanguageCurrency,
  SUGGESTED_LANGUAGES,
  ALL_LANGUAGES,
  ALL_CURRENCIES,
  LanguageItem,
  CurrencyItem,
} from "@/context/LanguageCurrencyContext";

export default function LanguageCurrencyModal() {
  const {
    isModalOpen,
    activeTab,
    currentLanguage,
    currentCurrency,
    isTranslationEnabled,
    closeModal,
    setActiveTab,
    setLanguage,
    setCurrency,
    setIsTranslationEnabled,
  } = useLanguageCurrency();

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-[#DDDDDD] w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close and Navigation Tabs matching Screenshots 4 & 5 */}
        <div className="px-6 pt-5 pb-0 border-b border-[#EBEBEB]">
          <div className="flex items-center justify-start mb-4">
            <button
              onClick={closeModal}
              className="p-2 -ml-2 rounded-full hover:bg-[#F7F7F7] text-[#222222] transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab("language")}
              className={`pb-3 text-sm font-semibold transition cursor-pointer border-b-2 ${
                activeTab === "language"
                  ? "border-[#222222] text-[#222222]"
                  : "border-transparent text-[#717171] hover:text-[#222222]"
              }`}
            >
              Language and region
            </button>
            <button
              onClick={() => setActiveTab("currency")}
              className={`pb-3 text-sm font-semibold transition cursor-pointer border-b-2 ${
                activeTab === "currency"
                  ? "border-[#222222] text-[#222222]"
                  : "border-transparent text-[#717171] hover:text-[#222222]"
              }`}
            >
              Currency
            </button>
          </div>
        </div>

        {/* Modal Body with Custom Scrollbar */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {activeTab === "language" ? (
            <>
              {/* Translation Toggle Pill Banner matching Screenshot 4 */}
              <div className="bg-[#F7F7F7] rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#222222]">Translation</span>
                    <Languages className="w-4 h-4 text-[#222222]" />
                  </div>
                  <p className="text-xs text-[#717171] mt-0.5">
                    Automatically translate descriptions and reviews to English.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTranslationEnabled(!isTranslationEnabled)}
                  className={`w-12 h-7 rounded-full transition-colors flex items-center p-1 cursor-pointer ${
                    isTranslationEnabled ? "bg-[#222222] justify-end" : "bg-[#CCCCCC] justify-start"
                  }`}
                  aria-label="Toggle translation"
                >
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-xs">
                    {isTranslationEnabled && <Check className="w-3 h-3 text-[#222222] stroke-[3]" />}
                  </div>
                </button>
              </div>

              {/* Suggested languages and regions */}
              <div>
                <h3 className="text-lg font-bold text-[#222222] mb-4">Suggested languages and regions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {SUGGESTED_LANGUAGES.map((item) => {
                    const isSelected =
                      currentLanguage.name === item.name && currentLanguage.region === item.region;
                    return (
                      <button
                        key={`${item.name}-${item.region}`}
                        onClick={() => {
                          setLanguage(item);
                          closeModal();
                        }}
                        className={`text-left p-3 rounded-xl transition cursor-pointer ${
                          isSelected
                            ? "border border-[#222222] bg-white shadow-xs"
                            : "border border-transparent hover:bg-[#F7F7F7]"
                        }`}
                      >
                        <div className="text-sm font-medium text-[#222222]">{item.name}</div>
                        <div className="text-xs text-[#717171] mt-0.5">{item.region}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Choose a language and region */}
              <div>
                <h3 className="text-lg font-bold text-[#222222] mb-4">Choose a language and region</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {ALL_LANGUAGES.map((item) => {
                    const isSelected =
                      currentLanguage.name === item.name && currentLanguage.region === item.region;
                    return (
                      <button
                        key={`${item.name}-${item.region}`}
                        onClick={() => {
                          setLanguage(item);
                          closeModal();
                        }}
                        className={`text-left p-3 rounded-xl transition cursor-pointer ${
                          isSelected
                            ? "border border-[#222222] bg-white shadow-xs"
                            : "border border-transparent hover:bg-[#F7F7F7]"
                        }`}
                      >
                        <div className="text-sm font-medium text-[#222222]">{item.name}</div>
                        <div className="text-xs text-[#717171] mt-0.5">{item.region}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Currency Tab matching Screenshot 5 */
            <div>
              <h3 className="text-lg font-bold text-[#222222] mb-4">Choose a currency</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {ALL_CURRENCIES.map((item) => {
                  const isSelected = currentCurrency.code === item.code;
                  return (
                    <button
                      key={item.code}
                      onClick={() => {
                        setCurrency(item);
                        closeModal();
                      }}
                      className={`text-left p-3 rounded-xl transition cursor-pointer ${
                        isSelected
                          ? "border border-[#222222] bg-white shadow-xs"
                          : "border border-transparent hover:bg-[#F7F7F7]"
                      }`}
                    >
                      <div className="text-sm font-medium text-[#222222]">{item.name}</div>
                      <div className="text-xs text-[#717171] mt-0.5">
                        {item.code} – {item.symbol}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
