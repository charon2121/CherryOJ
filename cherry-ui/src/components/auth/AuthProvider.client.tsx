"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth/auth.store";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialized = useAuthStore((s) => s.initialized);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (initialized) {
      return;
    }
    void refreshUser();
  }, [initialized, refreshUser]);

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
