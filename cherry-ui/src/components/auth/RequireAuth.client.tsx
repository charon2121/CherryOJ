"use client";

import { useAuthStore } from "@/lib/auth/auth.store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useAuthStore((s) => s.initialized);
  const user = useAuthStore((s) => s.user);
  const redirected = useRef(false);

  useEffect(() => {
    if (!initialized || user) {
      redirected.current = false;
      return;
    }
    if (redirected.current) {
      return;
    }
    redirected.current = true;
    const q = searchParams.toString();
    const returnPath = q ? `${pathname}?${q}` : pathname;
    router.replace(`/login?returnUrl=${encodeURIComponent(returnPath)}`);
  }, [initialized, user, pathname, router, searchParams]);

  if (!initialized || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-50 text-sm text-zinc-500 dark:bg-[#070708] dark:text-zinc-400">
        正在验证登录状态…
      </div>
    );
  }

  return <>{children}</>;
}
