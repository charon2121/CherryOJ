import "server-only";

import { ApiError } from "@/lib/api/core";
import { serverFetch } from "@/lib/api/server";
import type { UserProfile } from "@/lib/api/endpoints/auth.client";

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    return await serverFetch<UserProfile>("/api/auth/me", { method: "GET" });
  } catch (error) {
    if (error instanceof ApiError && (error.code === 401 || error.code === 403)) {
      return null;
    }
    throw error;
  }
}
