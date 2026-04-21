"use client";

import { create } from "zustand";
import { logout as logoutApi, type UserProfile } from "@/lib/api/endpoints/auth.client";

type AuthState = {
  user: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, initialized: true }),
  logout: async () => {
    try {
      await logoutApi();
    } finally {
      set({ user: null, isAuthenticated: false, initialized: true, loading: false });
    }
  },
}));
