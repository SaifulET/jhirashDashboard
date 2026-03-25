"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export default function AuthGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (isHydrated && !accessToken) {
      const redirectQuery = pathname
        ? `?redirect=${encodeURIComponent(pathname)}`
        : "";

      router.replace(`/auth/signin${redirectQuery}`);
    }
  }, [accessToken, isHydrated, pathname, router]);

  if (!isHydrated) {
    return <div className="min-h-screen bg-[#F4F4F6]" />;
  }

  if (!accessToken) {
    return null;
  }

  return <>{children}</>;
}
