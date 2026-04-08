"use client";

import { create } from "zustand";
import { fetchCurrentUser, logout as logoutApi, type UserProfile } from "@/lib/api/endpoints/auth.client";
import { ApiError } from "@/lib/api/core";

type AuthState = {
  user: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, initialized: true }),
  refreshUser: async () => {
    set({ loading: true });
    try {
      const user = await fetchCurrentUser();
      set({ user, isAuthenticated: true, initialized: true });
    } catch (err) {
      if (err instanceof ApiError && err.code === 401) {
        set({ user: null, isAuthenticated: false, initialized: true });
        return;
      }
      set({ user: null, isAuthenticated: false, initialized: true });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    try {
      await logoutApi();
    } finally {
      set({ user: null, isAuthenticated: false, initialized: true, loading: false });
    }
  },
}));
