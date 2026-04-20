import AdminProblemCreateForm from "@/components/admin/problems/AdminProblemCreateForm.client";
import { getAdminProblem } from "@/lib/api/endpoints/admin-problems";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `编辑题目 ${id} — CherryOJ Admin`,
  };
}

export default async function AdminProblemEditPage({ params }: Props) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  let problem;
  try {
    problem = await getAdminProblem(id);
  } catch {
    notFound();
  }

  return <AdminProblemCreateForm mode="edit" initialProblem={problem} />;
}
