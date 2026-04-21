"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AdminProblemUpsertRequest } from "@/lib/api/admin-types";

type AdminProblemDraftState = {
  drafts: Record<string, AdminProblemUpsertRequest>;
  saveDraft: (draftKey: string, draft: AdminProblemUpsertRequest) => void;
  clearDraft: (draftKey: string) => void;
};

export const useAdminProblemDraftStore = create<AdminProblemDraftState>()(
  persist(
    (set) => ({
      drafts: {},
      saveDraft: (draftKey, draft) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [draftKey]: draft,
          },
        })),
      clearDraft: (draftKey) =>
        set((state) => {
          const nextDrafts = { ...state.drafts };
          delete nextDrafts[draftKey];
          return { drafts: nextDrafts };
        }),
    }),
    {
      name: "cherryoj-admin-problem-drafts",
      partialize: (state) => ({ drafts: state.drafts }),
    },
  ),
);
