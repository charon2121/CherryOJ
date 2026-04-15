"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { LangId } from "@/data/problems";

type ProblemEditorDraft = {
  language: LangId;
  code: string;
  customInput: string;
};

type ProblemEditorState = {
  drafts: Record<string, ProblemEditorDraft>;
  saveDraft: (problemKey: string, draft: ProblemEditorDraft) => void;
  clearDraft: (problemKey: string) => void;
};

export const useProblemEditorStore = create<ProblemEditorState>()(
  persist(
    (set) => ({
      drafts: {},
      saveDraft: (problemKey, draft) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [problemKey]: draft,
          },
        })),
      clearDraft: (problemKey) =>
        set((state) => {
          const nextDrafts = { ...state.drafts };
          delete nextDrafts[problemKey];
          return { drafts: nextDrafts };
        }),
    }),
    {
      name: "cherryoj-problem-editor-drafts",
      partialize: (state) => ({ drafts: state.drafts }),
    },
  ),
);
