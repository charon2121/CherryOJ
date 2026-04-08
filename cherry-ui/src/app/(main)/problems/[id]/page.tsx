import ProblemWorkspace from "@/components/oj/ProblemWorkspace.client";
import { getProblemById } from "@/data/problems";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = getProblemById(id);
  return {
    title: p ? `${p.id}. ${p.title} — CherryOJ` : "题目 — CherryOJ",
    description: p ? p.description.slice(0, 120) : undefined,
  };
}

export default async function ProblemPage({ params }: Props) {
  const { id } = await params;
  const problem = getProblemById(id);
  if (!problem) notFound();
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-zinc-50 text-sm text-zinc-500 dark:bg-[#070708] dark:text-zinc-400">
          加载中…
        </div>
      }
    >
      <ProblemWorkspace problem={problem} />
    </Suspense>
  );
}
