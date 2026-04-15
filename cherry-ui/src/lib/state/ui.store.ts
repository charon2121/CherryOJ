"use client";

import { create } from "zustand";

type UiState = {
  ojUserMenuOpen: boolean;
  setOjUserMenuOpen: (open: boolean) => void;
  toggleOjUserMenu: () => void;
  closeOjUserMenu: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  ojUserMenuOpen: false,
  setOjUserMenuOpen: (open) => set({ ojUserMenuOpen: open }),
  toggleOjUserMenu: () => set((state) => ({ ojUserMenuOpen: !state.ojUserMenuOpen })),
  closeOjUserMenu: () => set({ ojUserMenuOpen: false }),
}));
