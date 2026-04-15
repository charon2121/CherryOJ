import type { Problem } from "@/data/problems";
import { Link } from "@heroui/react";

import ProblemsFilterPanel from "./ProblemsFilterPanel.client";

export default function ProblemsPageShell({
  initialProblems,
}: {
  initialProblems: Problem[];
}) {
  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="no-underline hover:text-rose-600 dark:hover:text-rose-400">
          CherryOJ
        </Link>
        <span aria-hidden>/</span>
        <span className="text-zinc-800 dark:text-zinc-200">题库</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          题库
        </h1>
      </div>

      <ProblemsFilterPanel initialProblems={initialProblems} />
    </main>
  );
}
