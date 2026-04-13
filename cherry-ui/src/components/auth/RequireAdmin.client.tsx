"use client";

import { useAuthStore } from "@/lib/auth/auth.store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useAuthStore((s) => s.initialized);
  const user = useAuthStore((s) => s.user);
  const redirected = useRef(false);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    if (!user) {
      if (redirected.current) {
        return;
      }
      redirected.current = true;
      const q = searchParams.toString();
      const returnPath = q ? `${pathname}?${q}` : pathname;
      router.replace(`/login?returnUrl=${encodeURIComponent(returnPath)}`);
      return;
    }
    if (user.isAdmin !== 1) {
      if (redirected.current) {
        return;
      }
      redirected.current = true;
      router.replace("/problems");
      return;
    }
    redirected.current = false;
  }, [initialized, pathname, router, searchParams, user]);

  if (!initialized || !user || user.isAdmin !== 1) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f4f1eb] text-sm text-zinc-500">
        正在验证后台权限…
      </div>
    );
  }

  return <>{children}</>;
}
