"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BecomeAHostPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/hosting?tab=listings&create=true");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#FF385C] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-[#717171]">Loading Airbnb Setup...</p>
      </div>
    </div>
  );
}
