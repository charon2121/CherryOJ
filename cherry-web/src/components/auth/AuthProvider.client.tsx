"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth/auth.store";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const handler = () => {
      setUser(null);
    };
    window.addEventListener("auth:unauthorized", handler);
    return () => {
      window.removeEventListener("auth:unauthorized", handler);
    };
  }, [setUser]);

  return <>{children}</>;
}
