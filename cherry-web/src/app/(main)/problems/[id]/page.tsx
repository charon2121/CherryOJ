import ProblemPageShell from "@/components/oj/ProblemPageShell";
import { getProblemById } from "@/data/problems";
import { getProblem as getProblemApi } from "@/lib/api/endpoints/problems";
import { adaptProblemDetail } from "@/lib/oj/problem-adapter";
import { requireUser } from "@/lib/session/require-user";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  let p = getProblemById(id);
  if (!p && /^\d+$/.test(id)) {
    try {
      p = adaptProblemDetail(await getProblemApi(id));
    } catch {
      p = undefined;
    }
  }
  return {
    title: p ? `${p.id}. ${p.title} — CherryOJ` : "题目 — CherryOJ",
    description: p ? p.description.slice(0, 120) : undefined,
  };
}

export default async function ProblemPage({ params }: Props) {
  const { id } = await params;
  await requireUser(`/problems/${id}`);
  let problem = getProblemById(id);
  if (!problem && /^\d+$/.test(id)) {
    try {
      problem = adaptProblemDetail(await getProblemApi(id));
    } catch {
      problem = undefined;
    }
  }
  if (!problem) notFound();
  
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-zinc-50 text-sm text-zinc-500 dark:bg-[#070708] dark:text-zinc-400">
          加载中…
        </div>
      }
    >
      <ProblemPageShell problem={problem} />
    </Suspense>
  );
}
