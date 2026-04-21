"use client";

import type { UserProfile } from "@/lib/api/endpoints/auth.client";
import { useAuthStore } from "@/lib/auth/auth.store";
import { useEffect } from "react";

export default function AuthSnapshot({
  user,
  children,
}: {
  user: UserProfile | null;
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    setUser(user);
  }, [setUser, user]);

  return <>{children}</>;
}
