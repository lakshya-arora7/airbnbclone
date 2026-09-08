import type { Metadata } from "next";
import "./globals.css";
import { AuthPersonaProvider } from "@/context/AuthPersonaContext";
import { LanguageCurrencyProvider } from "@/context/LanguageCurrencyContext";
import { WishlistProvider } from "@/context/WishlistContext";
import LanguageCurrencyModal from "@/components/modals/LanguageCurrencyModal";

export const metadata: Metadata = {
  title: "bnbair | Holiday Rentals, Cabins, Beach Houses & Experiences",
  description: "Find holiday rentals, cabins, beach houses, unique homes and experiences around the world on bnbair.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-[#222222] antialiased flex flex-col justify-between">
        <AuthPersonaProvider>
          <LanguageCurrencyProvider>
            <WishlistProvider>
              <div className="flex-1">{children}</div>
              <LanguageCurrencyModal />
            </WishlistProvider>
          </LanguageCurrencyProvider>
        </AuthPersonaProvider>
      </body>
    </html>
  );
}

