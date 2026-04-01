import ProblemWorkspace from "@/components/oj/ProblemWorkspace.client";
import { getProblemById } from "@/data/problems";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
  return <ProblemWorkspace problem={problem} />;
}
