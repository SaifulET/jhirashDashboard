"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export default function HomePage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    router.replace(accessToken ? "/pages/dashboard" : "/auth/signin");
  }, [accessToken, isHydrated, router]);

  return <div className="min-h-screen bg-[#F4F4F6]" />;
}
